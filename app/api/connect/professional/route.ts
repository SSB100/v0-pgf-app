import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"
import { hashProfessionalInvitationToken } from "@/lib/professional-access"
import {
  normaliseRequestableProfessionalScopes,
  PROFESSIONAL_SHARING_CONSENT_VERSION,
} from "@/lib/sharing-policy"

async function getInvitation(token: string) {
  const tokenHash = hashProfessionalInvitationToken(token)
  const rows = await sql`
    SELECT
      i.id,
      i.professional_account_id,
      i.requested_scopes,
      i.status,
      i.expires_at,
      i.created_at,
      p.user_id AS professional_user_id,
      p.display_name AS professional_name,
      p.professional_role,
      p.verification_status AS professional_verification_status,
      p.organisation_id,
      o.name AS organisation_name,
      o.verification_status AS organisation_verification_status
    FROM professional_invitations i
    JOIN professional_accounts p ON p.id = i.professional_account_id
    LEFT JOIN organisations o ON o.id = p.organisation_id
    WHERE i.token_hash = ${tokenHash}
    LIMIT 1
  `
  return rows[0] ?? null
}

function invitationAvailable(invitation: any) {
  return invitation
    && invitation.status === "active"
    && new Date(invitation.expires_at).getTime() > Date.now()
    && invitation.professional_verification_status === "verified"
    && invitation.organisation_id
    && invitation.organisation_verification_status === "verified"
}

export async function GET(request: NextRequest) {
  try {
    const user = await getSession()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const token = request.nextUrl.searchParams.get("token")?.trim() || ""
    if (token.length < 20) return NextResponse.json({ error: "Invalid invitation" }, { status: 400 })

    const invitation = await getInvitation(token)
    if (!invitationAvailable(invitation)) {
      return NextResponse.json({ error: "This invitation is invalid, expired or no longer available" }, { status: 410 })
    }
    if (invitation.professional_user_id === user.id) {
      return NextResponse.json({ error: "A professional cannot connect this invitation to their own account" }, { status: 409 })
    }

    return NextResponse.json({
      professional: {
        name: invitation.professional_name,
        role: invitation.professional_role,
        organisation: invitation.organisation_name,
      },
      requestedScopes: normaliseRequestableProfessionalScopes(invitation.requested_scopes),
      expiresAt: invitation.expires_at,
      monitoringNotice: "Waypoint is not monitored continuously. Sharing supports later professional review and does not create an emergency-response service.",
    })
  } catch (error) {
    console.error("[waypoint] Unable to preview professional invitation", error)
    return NextResponse.json({ error: "Unable to load invitation" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getSession()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await request.json()
    const token = typeof body.token === "string" ? body.token.trim() : ""
    const action = body.action === "accept" || body.action === "decline" ? body.action : null
    if (token.length < 20 || !action) return NextResponse.json({ error: "Invalid invitation action" }, { status: 400 })

    const invitation = await getInvitation(token)
    if (!invitationAvailable(invitation)) {
      return NextResponse.json({ error: "This invitation is invalid, expired or no longer available" }, { status: 410 })
    }
    if (invitation.professional_user_id === user.id) {
      return NextResponse.json({ error: "A professional cannot connect to their own account" }, { status: 409 })
    }

    if (action === "decline") {
      const tokenHash = hashProfessionalInvitationToken(token)
      const declined = await sql`
        WITH changed AS (
          UPDATE professional_invitations
          SET status = 'revoked', used_at = CURRENT_TIMESTAMP, used_by_user_id = ${user.id}
          WHERE token_hash = ${tokenHash}
            AND status = 'active'
            AND expires_at > CURRENT_TIMESTAMP
          RETURNING professional_account_id
        )
        INSERT INTO consent_events (
          subject_user_id, actor_user_id, consent_type, action, target_type, target_id, scope, document_version, metadata
        )
        SELECT
          ${user.id}, ${user.id}, 'professional_connection_invitation', 'declined',
          'professional_account', changed.professional_account_id, '{}'::jsonb,
          ${PROFESSIONAL_SHARING_CONSENT_VERSION}, '{"source":"connection_invitation"}'::jsonb
        FROM changed
        RETURNING id
      `
      if (declined.length === 0) return NextResponse.json({ error: "Invitation is no longer available" }, { status: 410 })
      return NextResponse.json({ success: true, status: "declined" })
    }

    const requestedScopes = normaliseRequestableProfessionalScopes(invitation.requested_scopes)
    const selectedScopes = normaliseRequestableProfessionalScopes(body.scopes)
    if (!Array.isArray(body.scopes) || selectedScopes.length !== body.scopes.length || selectedScopes.length === 0) {
      return NextResponse.json({ error: "Select at least one sharing category" }, { status: 400 })
    }
    const requestedSet = new Set(requestedScopes)
    if (selectedScopes.some((scope) => !requestedSet.has(scope))) {
      return NextResponse.json({ error: "You can only grant categories requested in this invitation" }, { status: 400 })
    }

    const profile = await sql`SELECT onboarding_completed FROM user_profiles WHERE user_id = ${user.id} LIMIT 1`
    if (!profile[0]?.onboarding_completed) {
      return NextResponse.json({ error: "Complete your Waypoint onboarding before connecting a professional" }, { status: 409 })
    }

    const tokenHash = hashProfessionalInvitationToken(token)
    const selectedJson = JSON.stringify(selectedScopes)

    const accepted = await sql`
      WITH claimed_invite AS (
        UPDATE professional_invitations
        SET status = 'used', used_at = CURRENT_TIMESTAMP, used_by_user_id = ${user.id}
        WHERE token_hash = ${tokenHash}
          AND status = 'active'
          AND expires_at > CURRENT_TIMESTAMP
        RETURNING professional_account_id, requested_scopes, created_at, expires_at
      ),
      verified_invite AS (
        SELECT ci.*
        FROM claimed_invite ci
        JOIN professional_accounts p ON p.id = ci.professional_account_id
        JOIN organisations o ON o.id = p.organisation_id
        WHERE p.verification_status = 'verified'
          AND o.verification_status = 'verified'
      ),
      new_link AS (
        INSERT INTO client_professional_links (
          client_user_id,
          professional_account_id,
          status,
          invited_by,
          requested_scopes,
          invited_at,
          accepted_at,
          invitation_expires_at
        )
        SELECT
          ${user.id}, professional_account_id, 'active', 'professional', requested_scopes,
          created_at, CURRENT_TIMESTAMP, expires_at
        FROM verified_invite
        RETURNING id, professional_account_id
      ),
      new_grants AS (
        INSERT INTO sharing_grants (link_id, data_scope, status, consent_version, granted_at)
        SELECT
          new_link.id,
          selected.scope,
          'active',
          ${PROFESSIONAL_SHARING_CONSENT_VERSION},
          CURRENT_TIMESTAMP
        FROM new_link
        CROSS JOIN jsonb_array_elements_text(${selectedJson}::jsonb) AS selected(scope)
        RETURNING id
      ),
      connection_consent AS (
        INSERT INTO consent_events (
          subject_user_id, actor_user_id, consent_type, action, target_type, target_id, scope, document_version, metadata
        )
        SELECT
          ${user.id}, ${user.id}, 'professional_connection', 'accepted', 'client_professional_link', new_link.id,
          jsonb_build_object('scopes', ${selectedJson}::jsonb),
          ${PROFESSIONAL_SHARING_CONSENT_VERSION},
          '{"source":"professional_invitation"}'::jsonb
        FROM new_link
        RETURNING id
      ),
      audit_event AS (
        INSERT INTO access_audit_events (
          subject_user_id, actor_user_id, professional_account_id, event_type, resource_scope, purpose, metadata
        )
        SELECT
          ${user.id}, ${user.id}, new_link.professional_account_id,
          'professional_connection_accepted', 'connection', 'clinical_support',
          jsonb_build_object('scopes', ${selectedJson}::jsonb)
        FROM new_link
        RETURNING id
      )
      SELECT id FROM new_link
    `

    if (accepted.length === 0) return NextResponse.json({ error: "Invitation could not be accepted" }, { status: 409 })

    return NextResponse.json({
      success: true,
      status: "active",
      linkId: accepted[0].id,
      scopes: selectedScopes,
      redirectTo: "/privacy",
    })
  } catch (error: any) {
    if (error?.code === "23505") {
      return NextResponse.json({ error: "You already have an active connection with this professional" }, { status: 409 })
    }
    console.error("[waypoint] Unable to process professional invitation", error)
    return NextResponse.json({ error: "Unable to process invitation" }, { status: 500 })
  }
}
