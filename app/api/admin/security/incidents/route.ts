import { type NextRequest, NextResponse } from "next/server"
import { dbTableExists, dbTransaction, sql } from "@/lib/db"
import { getAdminSession } from "@/lib/admin-access"
import { looksLikeUuid } from "@/lib/professional-access"
import {
  canCloseIncident,
  incidentRequiresEscalation,
  validateIncidentCreate,
  validateIncidentUpdate,
} from "@/lib/security-incident-policy.mjs"

export const runtime = "nodejs"

async function incidentTablesReady() {
  return (await dbTableExists("security_incidents")) && (await dbTableExists("security_incident_events"))
}

async function loadIncident(incidentId: string) {
  const rows = await sql`
    SELECT id, title, incident_type, status, severity, summary, detected_at, contained_at, closed_at,
      affected_people_estimate, personal_information_involved, health_information_involved, maori_data_involved,
      serious_harm_assessment, opc_notification_status, opc_notified_at,
      affected_people_notification_status, affected_people_notified_at,
      containment_summary, notification_decision_reason, policy_version, created_at, updated_at
    FROM security_incidents
    WHERE id = ${incidentId}
    LIMIT 1
  `
  return rows[0] ?? null
}

export async function GET() {
  try {
    const admin = await getAdminSession()
    if (!admin.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    if (!admin.authorised) return NextResponse.json({ error: "Administrator MFA is required" }, { status: 403 })
    if (!(await incidentTablesReady())) {
      return NextResponse.json({ error: "Security incident register is not available until the Phase 4G data update is applied" }, { status: 503 })
    }

    const incidents = await sql`
      SELECT id, title, incident_type, status, severity, summary, detected_at, contained_at, closed_at,
        affected_people_estimate, personal_information_involved, health_information_involved, maori_data_involved,
        serious_harm_assessment, opc_notification_status, opc_notified_at,
        affected_people_notification_status, affected_people_notified_at,
        containment_summary, notification_decision_reason, policy_version, created_at, updated_at
      FROM security_incidents
      ORDER BY
        CASE status WHEN 'open' THEN 0 WHEN 'contained' THEN 1 WHEN 'monitoring' THEN 2 ELSE 3 END,
        updated_at DESC
      LIMIT 200
    `

    return NextResponse.json({ incidents }, { headers: { "Cache-Control": "private, no-store, max-age=0" } })
  } catch (error) {
    console.error("[waypoint] Unable to load security incident register", error)
    return NextResponse.json({ error: "Unable to load security incident register" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await getAdminSession()
    if (!admin.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    if (!admin.authorised) return NextResponse.json({ error: "Administrator MFA is required" }, { status: 403 })
    if (!(await incidentTablesReady())) {
      return NextResponse.json({ error: "Security incident register is not available until the Phase 4G data update is applied" }, { status: 503 })
    }

    const body = await request.json()
    const validation = validateIncidentCreate(body)
    if (!validation.ok || !validation.value) {
      return NextResponse.json({ error: validation.errors[0] || "Invalid incident", errors: validation.errors }, { status: 400 })
    }

    const value = validation.value
    const created = await dbTransaction((tx) => [
      tx`
        INSERT INTO security_incidents (
          title, incident_type, severity, summary, detected_at, affected_people_estimate,
          personal_information_involved, health_information_involved, maori_data_involved,
          policy_version, created_by_user_id, updated_by_user_id
        ) VALUES (
          ${value.title}, ${value.incidentType}, ${value.severity}, ${value.summary}, ${value.detectedAt},
          ${value.affectedPeopleEstimate}, ${value.personalInformationInvolved}, ${value.healthInformationInvolved},
          ${value.maoriDataInvolved}, ${value.policyVersion}, ${admin.user.id}, ${admin.user.id}
        )
        RETURNING id
      `,
    ]) as any

    const incidentId = created?.[0]?.[0]?.id as string | undefined
    if (!incidentId) throw new Error("Security incident creation did not return an id")

    const initialMetadata = JSON.stringify({
      severity: value.severity,
      incidentType: value.incidentType,
      personalInformationInvolved: value.personalInformationInvolved,
      healthInformationInvolved: value.healthInformationInvolved,
      maoriDataInvolved: value.maoriDataInvolved,
      policyVersion: value.policyVersion,
      rawAffectedPersonIdentifiersStoredHere: false,
    })

    await dbTransaction((tx) => [
      tx`
        INSERT INTO security_incident_events (incident_id, actor_user_id, event_type, note, metadata)
        VALUES (${incidentId}, ${admin.user.id}, 'incident_opened', ${value.summary}, ${initialMetadata}::jsonb)
      `,
      tx`
        INSERT INTO administrative_audit_events (actor_user_id, action, target_type, target_id, reason, metadata)
        VALUES (${admin.user.id}, 'security_incident_opened', 'security_incident', ${incidentId}, ${value.title}, ${initialMetadata}::jsonb)
      `,
    ])

    return NextResponse.json({ success: true, incident: await loadIncident(incidentId) })
  } catch (error) {
    console.error("[waypoint] Unable to create security incident", error)
    return NextResponse.json({ error: "Unable to create security incident" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const admin = await getAdminSession()
    if (!admin.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    if (!admin.authorised) return NextResponse.json({ error: "Administrator MFA is required" }, { status: 403 })
    if (!(await incidentTablesReady())) {
      return NextResponse.json({ error: "Security incident register is not available until the Phase 4G data update is applied" }, { status: 503 })
    }

    const body = await request.json()
    if (!looksLikeUuid(body.incidentId)) return NextResponse.json({ error: "Invalid incident" }, { status: 400 })
    const existing = await loadIncident(body.incidentId)
    if (!existing) return NextResponse.json({ error: "Incident not found" }, { status: 404 })

    const validation = validateIncidentUpdate(body)
    if (!validation.ok || !validation.value) return NextResponse.json({ error: "Invalid incident update" }, { status: 400 })
    const value = validation.value

    if (value.status === "closed") {
      const closeDecision = canCloseIncident(value)
      if (!closeDecision.ok) return NextResponse.json({ error: closeDecision.reason }, { status: 400 })
    }

    const escalated = incidentRequiresEscalation(value)
    const metadataJson = JSON.stringify({
      previousStatus: existing.status,
      status: value.status,
      severity: value.severity,
      seriousHarmAssessment: value.seriousHarmAssessment,
      opcNotificationStatus: value.opcNotificationStatus,
      affectedPeopleNotificationStatus: value.affectedPeopleNotificationStatus,
      escalationRequired: escalated,
      policyVersion: value.policyVersion,
    })

    await dbTransaction((tx) => [
      tx`
        UPDATE security_incidents
        SET
          status = ${value.status},
          severity = ${value.severity},
          serious_harm_assessment = ${value.seriousHarmAssessment},
          opc_notification_status = ${value.opcNotificationStatus},
          opc_notified_at = CASE
            WHEN ${value.opcNotificationStatus} = 'notified' AND opc_notified_at IS NULL THEN CURRENT_TIMESTAMP
            WHEN ${value.opcNotificationStatus} <> 'notified' THEN NULL
            ELSE opc_notified_at
          END,
          affected_people_notification_status = ${value.affectedPeopleNotificationStatus},
          affected_people_notified_at = CASE
            WHEN ${value.affectedPeopleNotificationStatus} = 'notified' AND affected_people_notified_at IS NULL THEN CURRENT_TIMESTAMP
            WHEN ${value.affectedPeopleNotificationStatus} <> 'notified' THEN NULL
            ELSE affected_people_notified_at
          END,
          containment_summary = ${value.containmentSummary || null},
          notification_decision_reason = ${value.notificationDecisionReason || null},
          contained_at = CASE WHEN ${value.status} IN ('contained', 'monitoring', 'closed') AND contained_at IS NULL THEN CURRENT_TIMESTAMP ELSE contained_at END,
          closed_at = CASE WHEN ${value.status} = 'closed' THEN CURRENT_TIMESTAMP ELSE NULL END,
          policy_version = ${value.policyVersion},
          updated_by_user_id = ${admin.user.id},
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${body.incidentId}
      `,
      tx`
        INSERT INTO security_incident_events (incident_id, actor_user_id, event_type, note, metadata)
        VALUES (${body.incidentId}, ${admin.user.id}, 'incident_updated', ${value.notificationDecisionReason || value.containmentSummary || null}, ${metadataJson}::jsonb)
      `,
      tx`
        INSERT INTO administrative_audit_events (actor_user_id, action, target_type, target_id, reason, metadata)
        VALUES (${admin.user.id}, 'security_incident_updated', 'security_incident', ${body.incidentId}, ${value.notificationDecisionReason || null}, ${metadataJson}::jsonb)
      `,
    ])

    return NextResponse.json({ success: true, incident: await loadIncident(body.incidentId), escalationRequired: escalated })
  } catch (error) {
    console.error("[waypoint] Unable to update security incident", error)
    return NextResponse.json({ error: "Unable to update security incident" }, { status: 500 })
  }
}
