import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import {
  PROFESSIONAL_INVITE_DEFAULT_DAYS,
  PROFESSIONAL_INVITE_MAX_DAYS,
  generateProfessionalInvitationToken,
  getProfessionalSession,
  hashProfessionalInvitationToken,
  looksLikeUuid,
  professionalCanAccessClientData,
} from "@/lib/professional-access"
import { normaliseRequestableProfessionalScopes } from "@/lib/sharing-policy"

export async function GET() {
  try {
    const { user, professional } = await getProfessionalSession()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    if (!professional) return NextResponse.json({ error: "Professional account not found" }, { status: 404 })

    await sql`
      UPDATE professional_invitations
      SET status = 'expired'
      WHERE professional_account_id = ${professional.id}
        AND status = 'active'
        AND expires_at <= CURRENT_TIMESTAMP
    `

    const invitations = await sql`
      SELECT id, requested_scopes, status, expires_at, created_at, used_at
      FROM professional_invitations
      WHERE professional_account_id = ${professional.id}
      ORDER BY created_at DESC
      LIMIT 30
    `

    return NextResponse.json({ invitations }, { headers: { "Cache-Control": "private, no-store, max-age=0" } })
  } catch (error) {
    console.error("[waypoint] Unable to load professional invitations", error)
    return NextResponse.json({ error: "Unable to load invitations" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user, professional } = await getProfessionalSession()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    if (!professional) return NextResponse.json({ error: "Professional account not found" }, { status: 404 })
    if (!professionalCanAccessClientData(professional)) {
      return NextResponse.json({ error: "Professional and organisation verification are required before invitations can be created" }, { status: 403 })
    }

    const body = await request.json()
    const requestedScopes = normaliseRequestableProfessionalScopes(body.scopes)
    if (!Array.isArray(body.scopes) || requestedScopes.length !== body.scopes.length || requestedScopes.length === 0) {
      return NextResponse.json({ error: "Select at least one valid sharing category" }, { status: 400 })
    }

    const requestedDays = Number(body.expiresInDays ?? PROFESSIONAL_INVITE_DEFAULT_DAYS)
    const expiresInDays = Number.isInteger(requestedDays)
      ? Math.min(Math.max(requestedDays, 1), PROFESSIONAL_INVITE_MAX_DAYS)
      : PROFESSIONAL_INVITE_DEFAULT_DAYS

    const token = generateProfessionalInvitationToken()
    const tokenHash = hashProfessionalInvitationToken(token)
    const scopesJson = JSON.stringify(requestedScopes)

    const rows = await sql`
      INSERT INTO professional_invitations (
        professional_account_id,
        token_hash,
        requested_scopes,
        status,
        expires_at
      )
      VALUES (
        ${professional.id},
        ${tokenHash},
        ${scopesJson}::jsonb,
        'active',
        CURRENT_TIMESTAMP + (${expiresInDays} * INTERVAL '1 day')
      )
      RETURNING id, requested_scopes, status, expires_at, created_at
    `

    const invitation = rows[0]
    const invitationUrl = new URL("/connect/professional", request.nextUrl.origin)
    invitationUrl.searchParams.set("token", token)

    return NextResponse.json({ invitation, invitationUrl: invitationUrl.toString() }, { status: 201 })
  } catch (error) {
    console.error("[waypoint] Unable to create professional invitation", error)
    return NextResponse.json({ error: "Unable to create invitation" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { user, professional } = await getProfessionalSession()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    if (!professional) return NextResponse.json({ error: "Professional account not found" }, { status: 404 })

    const body = await request.json()
    if (!looksLikeUuid(body.invitationId) || body.action !== "revoke") {
      return NextResponse.json({ error: "Invalid invitation action" }, { status: 400 })
    }

    const updated = await sql`
      UPDATE professional_invitations
      SET status = 'revoked'
      WHERE id = ${body.invitationId}
        AND professional_account_id = ${professional.id}
        AND status = 'active'
      RETURNING id
    `

    if (updated.length === 0) return NextResponse.json({ error: "Active invitation not found" }, { status: 404 })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[waypoint] Unable to revoke professional invitation", error)
    return NextResponse.json({ error: "Unable to revoke invitation" }, { status: 500 })
  }
}
