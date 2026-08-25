import { NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import { sql } from "@/lib/db"
import { governanceTableExists } from "@/lib/governance"

export async function GET() {
  try {
    const user = await getSession()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const accountRows = await sql`
      SELECT
        created_at,
        data_consent,
        data_consent_date,
        terms_accepted,
        terms_accepted_date,
        date_of_birth,
        country,
        gender
      FROM users
      WHERE id = ${user.id}
      LIMIT 1
    `

    const account = accountRows[0] ?? {}
    const sharingInfrastructureReady =
      (await governanceTableExists("client_professional_links")) &&
      (await governanceTableExists("professional_accounts")) &&
      (await governanceTableExists("sharing_grants"))

    let connections: any[] = []
    let accessHistory: any[] = []
    let policyHistory: any[] = []

    if (sharingInfrastructureReady) {
      connections = await sql`
        SELECT
          l.id,
          l.status,
          l.invited_by,
          l.invited_at,
          l.accepted_at,
          l.invitation_expires_at,
          p.display_name AS professional_name,
          p.professional_role,
          p.verification_status AS professional_verification_status,
          o.name AS organisation_name,
          o.verification_status AS organisation_verification_status,
          COALESCE(
            json_agg(
              json_build_object(
                'scope', g.data_scope,
                'status', g.status,
                'grantedAt', g.granted_at,
                'expiresAt', g.expires_at,
                'revokedAt', g.revoked_at,
                'consentVersion', g.consent_version
              )
              ORDER BY g.granted_at
            ) FILTER (WHERE g.id IS NOT NULL),
            '[]'::json
          ) AS grants
        FROM client_professional_links l
        JOIN professional_accounts p ON p.id = l.professional_account_id
        LEFT JOIN organisations o ON o.id = p.organisation_id
        LEFT JOIN sharing_grants g ON g.link_id = l.id
        WHERE l.client_user_id = ${user.id}
          AND l.status <> 'ended'
        GROUP BY l.id, p.id, o.id
        ORDER BY l.created_at DESC
      `
    }

    if (await governanceTableExists("access_audit_events")) {
      accessHistory = await sql`
        SELECT
          a.id,
          a.event_type,
          a.resource_scope,
          a.purpose,
          a.occurred_at,
          p.display_name AS professional_name,
          o.name AS organisation_name
        FROM access_audit_events a
        LEFT JOIN professional_accounts p ON p.id = a.professional_account_id
        LEFT JOIN organisations o ON o.id = COALESCE(a.organisation_id, p.organisation_id)
        WHERE a.subject_user_id = ${user.id}
        ORDER BY a.occurred_at DESC
        LIMIT 25
      `
    }

    if (await governanceTableExists("policy_acceptances")) {
      policyHistory = await sql`
        SELECT policy_type, policy_version, action, occurred_at
        FROM policy_acceptances
        WHERE user_id = ${user.id}
        ORDER BY occurred_at DESC
        LIMIT 25
      `
    }

    return NextResponse.json({
      account: {
        createdAt: account.created_at ?? null,
        exactDateOfBirthStored: Boolean(account.date_of_birth),
        countryStored: Boolean(account.country),
        genderStored: Boolean(account.gender),
        termsAccepted: account.terms_accepted === true,
        termsAcceptedAt: account.terms_accepted_date ?? null,
      },
      researchInterest: {
        interested: account.data_consent === true,
        changedAt: account.data_consent_date ?? null,
        formalResearchConsent: false,
      },
      sharingInfrastructureReady,
      connections,
      accessHistory,
      policyHistory,
    })
  } catch (error) {
    console.error("[waypoint] Unable to load privacy overview", error)
    return NextResponse.json({ error: "Unable to load privacy information" }, { status: 500 })
  }
}
