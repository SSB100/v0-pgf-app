import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import { sql } from "@/lib/db"
import { recordAccessAuditEvent, recordConsentEvent } from "@/lib/governance"
import { looksLikeUuid } from "@/lib/professional-access"
import { hasCurrentProfessionalAffiliation } from "@/lib/organisation-lifecycle-policy.mjs"
import { PROFESSIONAL_SHARING_CONSENT_VERSION } from "@/lib/sharing-policy"

export async function PATCH(request: NextRequest) {
  try {
    const user = await getSession()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await request.json()
    const action = body.action === "pause" || body.action === "resume" || body.action === "end" ? body.action : null
    if (!looksLikeUuid(body.linkId) || !action) {
      return NextResponse.json({ error: "Invalid professional connection action" }, { status: 400 })
    }

    const rows = await sql`
      SELECT
        l.id,
        l.status,
        l.professional_account_id,
        p.organisation_id,
        p.verification_status AS professional_verification_status,
        o.verification_status AS organisation_verification_status,
        om.status AS membership_status
      FROM client_professional_links l
      JOIN professional_accounts p ON p.id = l.professional_account_id
      LEFT JOIN organisations o ON o.id = p.organisation_id
      LEFT JOIN organisation_memberships om
        ON om.professional_account_id = p.id
        AND om.organisation_id = p.organisation_id
        AND om.status IN ('active', 'suspended')
      WHERE l.id = ${body.linkId}
        AND l.client_user_id = ${user.id}
      LIMIT 1
    `
    const link = rows[0]
    if (!link) return NextResponse.json({ error: "Professional connection not found" }, { status: 404 })

    if (action === "pause") {
      if (link.status !== "active") return NextResponse.json({ error: "Only an active connection can be paused" }, { status: 409 })
      await sql`UPDATE client_professional_links SET status = 'paused', updated_at = CURRENT_TIMESTAMP WHERE id = ${body.linkId}`
    }

    if (action === "resume") {
      if (link.status !== "paused") return NextResponse.json({ error: "Only a paused connection can be resumed" }, { status: 409 })
      if (!hasCurrentProfessionalAffiliation({
        professionalStatus: link.professional_verification_status,
        organisationId: link.organisation_id,
        organisationStatus: link.organisation_verification_status,
        membershipStatus: link.membership_status,
      })) {
        return NextResponse.json({ error: "This professional connection cannot be resumed until the professional's current organisation affiliation is verified" }, { status: 409 })
      }
      await sql`UPDATE client_professional_links SET status = 'active', updated_at = CURRENT_TIMESTAMP WHERE id = ${body.linkId}`
    }

    if (action === "end") {
      if (!["active", "paused"].includes(link.status)) return NextResponse.json({ error: "This connection has already ended" }, { status: 409 })
      await sql`
        UPDATE client_professional_links
        SET status = 'ended', ended_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
        WHERE id = ${body.linkId}
      `
      await sql`
        UPDATE sharing_grants
        SET status = 'revoked', revoked_at = CURRENT_TIMESTAMP
        WHERE link_id = ${body.linkId} AND status = 'active'
      `
    }

    await recordConsentEvent({
      subjectUserId: user.id,
      actorUserId: user.id,
      consentType: "professional_connection",
      action: action === "end" ? "revoked" : "updated",
      targetType: "client_professional_link",
      targetId: body.linkId,
      scope: {
        connectionStatus: action === "pause" ? "paused" : action === "resume" ? "active" : "ended",
        organisationId: link.organisation_id,
      },
      documentVersion: PROFESSIONAL_SHARING_CONSENT_VERSION,
      metadata: { source: "privacy_centre", action, organisationId: link.organisation_id },
    })

    await recordAccessAuditEvent({
      subjectUserId: user.id,
      actorUserId: user.id,
      professionalAccountId: link.professional_account_id,
      organisationId: link.organisation_id,
      eventType: `professional_connection_${action}`,
      resourceScope: "connection",
      purpose: "user_privacy_control",
      metadata: { linkId: body.linkId, organisationId: link.organisation_id },
    })

    return NextResponse.json({ success: true, status: action === "pause" ? "paused" : action === "resume" ? "active" : "ended" })
  } catch (error) {
    console.error("[waypoint] Unable to change professional connection", error)
    return NextResponse.json({ error: "Unable to update professional connection" }, { status: 500 })
  }
}
