import { type NextRequest, NextResponse } from "next/server"
import { dbTableExists, dbTransaction, sql } from "@/lib/db"
import { getAdminSession } from "@/lib/admin-access"
import { looksLikeUuid } from "@/lib/professional-access"
import { validateOrganisationLifecycleAction } from "@/lib/organisation-lifecycle-policy.mjs"

export const runtime = "nodejs"

async function loadOrganisation(organisationId: string) {
  const rows = await sql`
    SELECT id, name, organisation_type, verification_status, verified_at, verified_by_user_id,
      verification_note, suspended_at, suspension_reason, created_at, updated_at
    FROM organisations
    WHERE id = ${organisationId}
    LIMIT 1
  `
  return rows[0] ?? null
}

export async function GET() {
  try {
    const admin = await getAdminSession()
    if (!admin.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    if (!admin.authorised) return NextResponse.json({ error: "Administrator MFA is required" }, { status: 403 })
    if (!(await dbTableExists("organisation_memberships")) || !(await dbTableExists("organisation_membership_events"))) {
      return NextResponse.json({ error: "Organisation lifecycle controls are not available until the Phase 4D data update is applied" }, { status: 503 })
    }

    const organisations = await sql`
      SELECT
        o.id,
        o.name,
        o.organisation_type,
        o.verification_status,
        o.verified_at,
        o.verification_note,
        o.suspended_at,
        o.suspension_reason,
        o.created_at,
        o.updated_at,
        (SELECT COUNT(*) FROM organisation_memberships m WHERE m.organisation_id = o.id AND m.status = 'active') AS active_members,
        (SELECT COUNT(*) FROM organisation_memberships m WHERE m.organisation_id = o.id AND m.status = 'suspended') AS suspended_members,
        (
          SELECT COUNT(*)
          FROM client_professional_links l
          JOIN professional_accounts p ON p.id = l.professional_account_id
          WHERE p.organisation_id = o.id AND l.status = 'active'
        ) AS active_client_links,
        COALESCE((
          SELECT json_agg(json_build_object(
            'membership_id', m.id,
            'professional_account_id', p.id,
            'display_name', p.display_name,
            'email', u.email,
            'professional_role', p.professional_role,
            'professional_status', p.verification_status,
            'membership_status', m.status,
            'membership_verified_at', m.verified_at,
            'membership_status_reason', m.status_reason
          ) ORDER BY p.display_name, u.email)
          FROM organisation_memberships m
          JOIN professional_accounts p ON p.id = m.professional_account_id
          JOIN users u ON u.id = p.user_id
          WHERE m.organisation_id = o.id
            AND m.status IN ('active', 'suspended')
        ), '[]'::json) AS current_members,
        latest_admin.action AS latest_admin_action,
        latest_admin.reason AS latest_admin_reason,
        latest_admin.occurred_at AS latest_admin_at
      FROM organisations o
      LEFT JOIN LATERAL (
        SELECT action, reason, occurred_at
        FROM administrative_audit_events
        WHERE target_type = 'organisation' AND target_id = o.id
        ORDER BY occurred_at DESC
        LIMIT 1
      ) latest_admin ON TRUE
      ORDER BY
        CASE o.verification_status WHEN 'suspended' THEN 0 WHEN 'verified' THEN 1 ELSE 2 END,
        o.name
      LIMIT 200
    `

    return NextResponse.json({ organisations }, { headers: { "Cache-Control": "private, no-store, max-age=0" } })
  } catch (error) {
    console.error("[waypoint] Unable to load organisation lifecycle register", error)
    return NextResponse.json({ error: "Unable to load organisation lifecycle register" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const admin = await getAdminSession()
    if (!admin.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    if (!admin.authorised) return NextResponse.json({ error: "Administrator MFA is required" }, { status: 403 })
    if (!(await dbTableExists("organisation_memberships")) || !(await dbTableExists("organisation_membership_events"))) {
      return NextResponse.json({ error: "Organisation lifecycle controls are not available until the Phase 4D data update is applied" }, { status: 503 })
    }

    const body = await request.json()
    const organisationId = body.organisationId
    if (!looksLikeUuid(organisationId)) return NextResponse.json({ error: "Invalid organisation" }, { status: 400 })

    const organisation = await loadOrganisation(organisationId)
    if (!organisation) return NextResponse.json({ error: "Organisation not found" }, { status: 404 })

    const validation = validateOrganisationLifecycleAction({
      action: body.action,
      currentStatus: organisation.verification_status,
      reason: body.reason,
    })
    const validationErrors = validation.errors ?? []
    if (!validation.ok || !validation.value) {
      return NextResponse.json({ error: validationErrors[0] || "Invalid organisation lifecycle action", lifecycleErrors: validationErrors }, { status: 400 })
    }

    const { action, reason, policyVersion } = validation.value
    const metadataJson = JSON.stringify({
      source: "admin_portal",
      policyVersion,
      clientDataVisibleToOrganisationAdmin: false,
      membershipsAutomaticallyReactivated: false,
    })

    if (action === "suspend") {
      await dbTransaction((tx) => [
        tx`
          UPDATE organisations
          SET verification_status = 'suspended', suspended_at = CURRENT_TIMESTAMP,
            suspension_reason = ${reason}, updated_at = CURRENT_TIMESTAMP
          WHERE id = ${organisationId}
        `,
        tx`
          INSERT INTO organisation_membership_events (
            membership_id, professional_account_id, organisation_id, actor_user_id,
            action, previous_status, new_status, reason, metadata
          )
          SELECT id, professional_account_id, organisation_id, ${admin.user.id},
            'suspended', 'active', 'suspended', ${reason}, ${metadataJson}::jsonb
          FROM organisation_memberships
          WHERE organisation_id = ${organisationId} AND status = 'active'
        `,
        tx`
          UPDATE organisation_memberships
          SET status = 'suspended', suspended_at = CURRENT_TIMESTAMP,
            status_reason = ${reason}, updated_at = CURRENT_TIMESTAMP
          WHERE organisation_id = ${organisationId} AND status = 'active'
        `,
        tx`
          UPDATE professional_invitations
          SET status = 'revoked'
          WHERE professional_account_id IN (
            SELECT id FROM professional_accounts WHERE organisation_id = ${organisationId}
          ) AND status = 'active'
        `,
        tx`
          UPDATE client_professional_links
          SET status = 'paused', updated_at = CURRENT_TIMESTAMP
          WHERE professional_account_id IN (
            SELECT id FROM professional_accounts WHERE organisation_id = ${organisationId}
          ) AND status = 'active'
        `,
        tx`
          UPDATE users
          SET security_version = COALESCE(security_version, 1) + 1, updated_at = CURRENT_TIMESTAMP
          WHERE id IN (
            SELECT user_id FROM professional_accounts WHERE organisation_id = ${organisationId}
          )
        `,
        tx`
          INSERT INTO administrative_audit_events (actor_user_id, action, target_type, target_id, reason, metadata)
          VALUES (${admin.user.id}, 'organisation_suspended', 'organisation', ${organisationId}, ${reason}, ${metadataJson}::jsonb)
        `,
      ])
    }

    if (action === "reactivate") {
      await dbTransaction((tx) => [
        tx`
          UPDATE organisations
          SET verification_status = 'verified', verified_at = CURRENT_TIMESTAMP,
            verified_by_user_id = ${admin.user.id}, verification_note = ${reason},
            suspended_at = NULL, suspension_reason = NULL, updated_at = CURRENT_TIMESTAMP
          WHERE id = ${organisationId}
        `,
        tx`
          INSERT INTO administrative_audit_events (actor_user_id, action, target_type, target_id, reason, metadata)
          VALUES (${admin.user.id}, 'organisation_reactivated', 'organisation', ${organisationId}, ${reason}, ${metadataJson}::jsonb)
        `,
      ])
    }

    return NextResponse.json({ success: true, organisation: await loadOrganisation(organisationId) })
  } catch (error) {
    console.error("[waypoint] Organisation lifecycle action failed", error)
    return NextResponse.json({ error: "Unable to complete organisation lifecycle action" }, { status: 500 })
  }
}
