import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import { sql } from "@/lib/db"
import { governanceTableExists, recordConsentEvent } from "@/lib/governance"
import { hasCurrentProfessionalAffiliation } from "@/lib/organisation-lifecycle-policy.mjs"
import { parseJourneyResponseHistoryMode } from "@/lib/journey-response-policy"
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
        p.id AS professional_account_id,
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

    const link = linkRows[0]
    if (!link) return NextResponse.json({ error: "Professional connection not found" }, { status: 404 })
    if (!["active", "paused"].includes(link.status)) {
      return NextResponse.json({ error: "Sharing cannot be changed for an ended professional connection" }, { status: 409 })
    }

    const currentAffiliation = hasCurrentProfessionalAffiliation({
      professionalStatus: link.professional_verification_status,
      organisationId: link.organisation_id,
      organisationStatus: link.organisation_verification_status,
      membershipStatus: link.membership_status,
    })

    const currentRows = await sql`
      SELECT data_scope, granted_at, include_pre_grant_data
      FROM sharing_grants
      WHERE link_id = ${body.linkId} AND status = 'active'
    `
    const currentScopes = new Set(currentRows.map((row: any) => row.data_scope))
    const hadJourneyResponses = currentScopes.has("journey_responses")
    const wantsJourneyResponses = scopes.includes("journey_responses")
    const addingJourneyResponses = wantsJourneyResponses && !hadJourneyResponses
    const revokingJourneyResponses = hadJourneyResponses && !wantsJourneyResponses
    const historyMode = addingJourneyResponses ? parseJourneyResponseHistoryMode(body.journeyResponsesHistoryMode) : null

    if (addingJourneyResponses && !historyMode) {
      return NextResponse.json(
        { error: "Choose whether this professional can see previous Journey responses or only new responses" },
        { status: 400 },
      )
    }

    if (!currentAffiliation && scopes.some((scope) => !currentScopes.has(scope))) {
      return NextResponse.json(
        { error: "New sharing cannot be granted until the professional's current organisation affiliation is verified" },
        { status: 409 },
      )
    }

    const selectedScopesJson = JSON.stringify(scopes)
    const includePrevious = historyMode === "include_previous"

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

    if (scopes.length > 0) {
      await sql`
        INSERT INTO sharing_grants (
          link_id, data_scope, status, consent_version, granted_at, include_pre_grant_data
        )
        SELECT
          ${body.linkId}, selected.scope, 'active', ${PROFESSIONAL_SHARING_CONSENT_VERSION}, CURRENT_TIMESTAMP,
          CASE WHEN selected.scope = 'journey_responses' THEN ${includePrevious} ELSE NULL END
        FROM jsonb_array_elements_text(${selectedScopesJson}::jsonb) AS selected(scope)
        WHERE NOT EXISTS (
          SELECT 1 FROM sharing_grants existing
          WHERE existing.link_id = ${body.linkId}
            AND existing.data_scope = selected.scope
            AND existing.status = 'active'
        )
      `
    }

    const activeJourneyRows = wantsJourneyResponses
      ? await sql`
          SELECT granted_at, include_pre_grant_data
          FROM sharing_grants
          WHERE link_id = ${body.linkId}
            AND data_scope = 'journey_responses'
            AND status = 'active'
          ORDER BY granted_at DESC LIMIT 1
        `
      : []
    const activeJourneyGrant = activeJourneyRows[0] ?? null

    await recordConsentEvent({
      subjectUserId: user.id,
      actorUserId: user.id,
      consentType: "professional_sharing",
      action: "updated",
      targetType: "client_professional_link",
      targetId: body.linkId,
      scope: { scopes, connectionStatus: link.status, organisationId: link.organisation_id },
      documentVersion: PROFESSIONAL_SHARING_CONSENT_VERSION,
      metadata: { source: "privacy_centre", organisationId: link.organisation_id, currentAffiliation },
    })

    if (addingJourneyResponses && activeJourneyGrant) {
      await recordConsentEvent({
        subjectUserId: user.id,
        actorUserId: user.id,
        consentType: "professional_journey_response_sharing",
        action: "granted",
        targetType: "client_professional_link",
        targetId: body.linkId,
        scope: {
          dataScope: "journey_responses",
          historyMode,
          includePrevious: activeJourneyGrant.include_pre_grant_data === true,
          grantedAt: activeJourneyGrant.granted_at,
        },
        documentVersion: PROFESSIONAL_SHARING_CONSENT_VERSION,
        metadata: { source: "privacy_centre", organisationId: link.organisation_id },
      })
    }

    if (revokingJourneyResponses) {
      await recordConsentEvent({
        subjectUserId: user.id,
        actorUserId: user.id,
        consentType: "professional_journey_response_sharing",
        action: "revoked",
        targetType: "client_professional_link",
        targetId: body.linkId,
        scope: { dataScope: "journey_responses" },
        documentVersion: PROFESSIONAL_SHARING_CONSENT_VERSION,
        metadata: { source: "privacy_centre", organisationId: link.organisation_id },
      })
    }

    return NextResponse.json({
      linkId: body.linkId,
      scopes,
      consentVersion: PROFESSIONAL_SHARING_CONSENT_VERSION,
      journeyResponses: activeJourneyGrant
        ? {
            active: true,
            grantedAt: activeJourneyGrant.granted_at,
            historyMode: activeJourneyGrant.include_pre_grant_data === true ? "include_previous" : "new_only",
          }
        : { active: false },
    })
  } catch (error) {
    console.error("[waypoint] Unable to update professional sharing", error)
    return NextResponse.json({ error: "Unable to update sharing permissions" }, { status: 500 })
  }
}
