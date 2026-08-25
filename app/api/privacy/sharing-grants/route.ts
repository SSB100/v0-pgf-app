import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import { sql } from "@/lib/db"
import { governanceTableExists, recordConsentEvent } from "@/lib/governance"
import {
  normaliseProfessionalShareScopes,
  PROFESSIONAL_SHARING_CONSENT_VERSION,
} from "@/lib/sharing-policy"

function looksLikeUuid(value: unknown): value is string {
  return typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getSession()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const ready =
      (await governanceTableExists("client_professional_links")) &&
      (await governanceTableExists("professional_accounts")) &&
      (await governanceTableExists("sharing_grants"))

    if (!ready) return NextResponse.json({ error: "Professional sharing has not been activated on this environment." }, { status: 503 })

    const body = await request.json()
    if (!looksLikeUuid(body.linkId)) return NextResponse.json({ error: "Invalid professional connection" }, { status: 400 })

    const scopes = normaliseProfessionalShareScopes(body.scopes)
    if (!Array.isArray(body.scopes) || scopes.length !== body.scopes.length) {
      return NextResponse.json({ error: "One or more sharing categories are invalid" }, { status: 400 })
    }

    const linkRows = await sql`
      SELECT
        l.id,
        l.status,
        p.organisation_id,
        p.verification_status AS professional_verification_status,
        o.verification_status AS organisation_verification_status
      FROM client_professional_links l
      JOIN professional_accounts p ON p.id = l.professional_account_id
      LEFT JOIN organisations o ON o.id = p.organisation_id
      WHERE l.id = ${body.linkId}
        AND l.client_user_id = ${user.id}
      LIMIT 1
    `

    const link = linkRows[0]
    if (!link) return NextResponse.json({ error: "Professional connection not found" }, { status: 404 })
    if (!['active', 'paused'].includes(link.status)) {
      return NextResponse.json({ error: "Sharing cannot be changed for an ended professional connection" }, { status: 409 })
    }
    if (link.professional_verification_status !== "verified") {
      return NextResponse.json({ error: "This professional is not currently verified for data access" }, { status: 409 })
    }
    if (!link.organisation_id || link.organisation_verification_status !== "verified") {
      return NextResponse.json({ error: "This professional's organisation is not currently verified for data access" }, { status: 409 })
    }

    const selectedScopesJson = JSON.stringify(scopes)

    await sql`
      UPDATE sharing_grants
      SET status = 'revoked', revoked_at = CURRENT_TIMESTAMP
      WHERE link_id = ${body.linkId}
        AND status = 'active'
        AND data_scope NOT IN (
          SELECT selected.scope
          FROM jsonb_array_elements_text(${selectedScopesJson}::jsonb) AS selected(scope)
        )
    `

    await sql`
      INSERT INTO sharing_grants (link_id, data_scope, status, consent_version, granted_at)
      SELECT ${body.linkId}, selected.scope, 'active', ${PROFESSIONAL_SHARING_CONSENT_VERSION}, CURRENT_TIMESTAMP
      FROM jsonb_array_elements_text(${selectedScopesJson}::jsonb) AS selected(scope)
      WHERE NOT EXISTS (
        SELECT 1 FROM sharing_grants existing
        WHERE existing.link_id = ${body.linkId}
          AND existing.data_scope = selected.scope
          AND existing.status = 'active'
      )
    `

    await recordConsentEvent({
      subjectUserId: user.id,
      actorUserId: user.id,
      consentType: "professional_sharing",
      action: "updated",
      targetType: "client_professional_link",
      targetId: body.linkId,
      scope: { scopes, connectionStatus: link.status },
      documentVersion: PROFESSIONAL_SHARING_CONSENT_VERSION,
      metadata: { source: "privacy_centre" },
    })

    return NextResponse.json({ linkId: body.linkId, scopes, consentVersion: PROFESSIONAL_SHARING_CONSENT_VERSION })
  } catch (error) {
    console.error("[waypoint] Unable to update professional sharing", error)
    return NextResponse.json({ error: "Unable to update sharing permissions" }, { status: 500 })
  }
}
