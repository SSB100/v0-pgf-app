import { type NextRequest, NextResponse } from "next/server"
import { dbTableExists, dbTransaction, sql } from "@/lib/db"
import { getAdminSession } from "@/lib/admin-access"
import { looksLikeUuid } from "@/lib/professional-access"
import { validatePrivacyRequestAction } from "@/lib/privacy-request-policy.mjs"

export const runtime = "nodejs"

async function workflowReady() {
  return (
    await dbTableExists("privacy_requests") &&
    await dbTableExists("access_audit_events") &&
    await dbTableExists("administrative_audit_events")
  )
}

async function loadRequest(requestId: string) {
  const rows = await sql`
    SELECT
      pr.id,
      pr.user_id,
      pr.request_type,
      pr.status,
      pr.requested_at,
      pr.completed_at,
      pr.resolution_note,
      pr.metadata,
      u.email,
      u.full_name,
      u.role,
      EXISTS (
        SELECT 1 FROM professional_accounts pa WHERE pa.user_id = pr.user_id
      ) AS has_professional_account
    FROM privacy_requests pr
    LEFT JOIN users u ON u.id = pr.user_id
    WHERE pr.id = ${requestId}
    LIMIT 1
  `
  return rows[0] ?? null
}

export async function GET() {
  try {
    const admin = await getAdminSession()
    if (!admin.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    if (!admin.authorised) return NextResponse.json({ error: "Administrator MFA is required" }, { status: 403 })
    if (!(await workflowReady())) {
      return NextResponse.json({ error: "Privacy-request fulfilment is not available on this environment yet" }, { status: 503 })
    }

    const requests = await sql`
      SELECT
        pr.id,
        pr.user_id,
        pr.request_type,
        pr.status,
        pr.requested_at,
        pr.completed_at,
        pr.resolution_note,
        pr.metadata,
        u.email,
        u.full_name,
        u.role
      FROM privacy_requests pr
      LEFT JOIN users u ON u.id = pr.user_id
      ORDER BY
        CASE pr.status WHEN 'requested' THEN 0 WHEN 'in_review' THEN 1 ELSE 2 END,
        pr.requested_at ASC
      LIMIT 250
    `

    return NextResponse.json({ requests }, { headers: { "Cache-Control": "private, no-store, max-age=0" } })
  } catch (error) {
    console.error("[waypoint] Unable to load privacy requests", error)
    return NextResponse.json({ error: "Unable to load privacy requests" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const admin = await getAdminSession()
    if (!admin.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    if (!admin.authorised) return NextResponse.json({ error: "Administrator MFA is required" }, { status: 403 })
    if (!(await workflowReady())) {
      return NextResponse.json({ error: "Privacy-request fulfilment is not available on this environment yet" }, { status: 503 })
    }

    const body = await request.json()
    const requestId = typeof body.requestId === "string" ? body.requestId : ""
    const action = typeof body.action === "string" ? body.action : ""
    const resolutionNote = typeof body.resolutionNote === "string" ? body.resolutionNote.trim().slice(0, 4000) : ""
    const confirmation = typeof body.confirmation === "string" ? body.confirmation.trim() : ""

    if (!looksLikeUuid(requestId)) return NextResponse.json({ error: "Invalid privacy request" }, { status: 400 })

    const privacyRequest = await loadRequest(requestId)
    if (!privacyRequest) return NextResponse.json({ error: "Privacy request not found" }, { status: 404 })

    const validation = validatePrivacyRequestAction({
      action,
      requestType: privacyRequest.request_type,
      status: privacyRequest.status,
      subjectRole: privacyRequest.role ?? null,
      resolutionNote,
      confirmation,
    })
    if (!validation.ok) return NextResponse.json({ error: validation.errors[0], errors: validation.errors }, { status: 400 })

    const auditMetadata = JSON.stringify({
      source: "admin_portal",
      requestId,
      requestType: privacyRequest.request_type,
      retainedOperationalRecordsOnly: action === "complete_deletion",
    })

    if (action === "start_review") {
      await dbTransaction((tx) => [
        tx`
          UPDATE privacy_requests
          SET status = 'in_review',
            metadata = metadata || ${JSON.stringify({ reviewStartedAt: new Date().toISOString(), reviewSource: "admin_portal" })}::jsonb
          WHERE id = ${requestId} AND status = 'requested'
        `,
        tx`
          INSERT INTO administrative_audit_events (actor_user_id, action, target_type, target_id, reason, metadata)
          VALUES (${admin.user.id}, 'privacy_request_review_started', 'privacy_request', ${requestId}, NULL, ${auditMetadata}::jsonb)
        `,
      ])
      return NextResponse.json({ request: await loadRequest(requestId) })
    }

    if (action === "complete_correction" || action === "decline") {
      const nextStatus = action === "complete_correction" ? "completed" : "declined"
      const adminAction = action === "complete_correction" ? "privacy_correction_completed" : "privacy_request_declined"
      const accessEvent = action === "complete_correction" ? "privacy_correction_fulfilled" : "privacy_request_declined"

      await dbTransaction((tx) => [
        tx`
          UPDATE privacy_requests
          SET status = ${nextStatus}, completed_at = CURRENT_TIMESTAMP, resolution_note = ${validation.value.resolutionNote},
            metadata = metadata || ${JSON.stringify({ resolvedBy: "admin", resolutionAction: action })}::jsonb
          WHERE id = ${requestId} AND status IN ('requested', 'in_review')
        `,
        tx`
          INSERT INTO administrative_audit_events (actor_user_id, action, target_type, target_id, reason, metadata)
          VALUES (${admin.user.id}, ${adminAction}, 'privacy_request', ${requestId}, ${validation.value.resolutionNote}, ${auditMetadata}::jsonb)
        `,
        tx`
          INSERT INTO access_audit_events (subject_user_id, actor_user_id, event_type, resource_scope, purpose, metadata)
          VALUES (${privacyRequest.user_id}, ${admin.user.id}, ${accessEvent}, ${privacyRequest.request_type}, 'privacy_request_fulfilment', ${auditMetadata}::jsonb)
        `,
      ])
      return NextResponse.json({ request: await loadRequest(requestId) })
    }

    if (!privacyRequest.user_id) {
      return NextResponse.json({ error: "The account linked to this deletion request no longer exists" }, { status: 409 })
    }
    if (privacyRequest.has_professional_account) {
      return NextResponse.json({ error: "Professional accounts require the governed professional offboarding workflow before account deletion" }, { status: 409 })
    }

    const legacySosTableExists = await dbTableExists("sos_alerts")
    const deletionMetadata = JSON.stringify({
      source: "admin_portal",
      requestId,
      requestType: "deletion",
      fulfilment: "client_account_and_personal_data_deleted",
      retainedRecords: ["privacy_request", "governance_audit_events"],
      rawPersonalContentRetainedInAudit: false,
    })

    await dbTransaction((tx) => {
      const queries: unknown[] = []

      if (legacySosTableExists) {
        queries.push(tx`
          UPDATE sos_alerts SET peer_supporter_id = NULL
          WHERE peer_supporter_id = ${privacyRequest.user_id}
        `)
      }

      queries.push(
        tx`
          INSERT INTO access_audit_events (subject_user_id, actor_user_id, event_type, resource_scope, purpose, metadata)
          VALUES (${privacyRequest.user_id}, ${admin.user.id}, 'privacy_deletion_fulfilled', 'account_data', 'privacy_request_fulfilment', ${deletionMetadata}::jsonb)
        `,
        tx`
          INSERT INTO administrative_audit_events (actor_user_id, action, target_type, target_id, reason, metadata)
          VALUES (${admin.user.id}, 'privacy_deletion_completed', 'privacy_request', ${requestId}, ${validation.value.resolutionNote}, ${deletionMetadata}::jsonb)
        `,
        tx`DELETE FROM users WHERE id = ${privacyRequest.user_id} AND role = 'client'`,
        tx`
          SELECT COALESCE((SELECT role::integer FROM users WHERE id = ${privacyRequest.user_id}), 1) AS deletion_guard
        `,
        tx`
          UPDATE privacy_requests
          SET status = 'completed', completed_at = CURRENT_TIMESTAMP, resolution_note = ${validation.value.resolutionNote},
            metadata = metadata || ${JSON.stringify({ resolvedBy: "admin", resolutionAction: "complete_deletion" })}::jsonb
          WHERE id = ${requestId} AND status IN ('requested', 'in_review')
        `,
      )

      return queries
    })

    return NextResponse.json({ request: await loadRequest(requestId), accountDeleted: true })
  } catch (error) {
    console.error("[waypoint] Unable to update privacy request", error)
    return NextResponse.json({ error: "Unable to update privacy request" }, { status: 500 })
  }
}
