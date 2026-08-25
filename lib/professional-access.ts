import { createHash, randomBytes } from "node:crypto"
import { sql } from "@/lib/db"
import { getSessionContext } from "@/lib/session"
import { canProfessionalAccessClientData as policyCanProfessionalAccessClientData } from "@/lib/access-policy.mjs"

export const PROFESSIONAL_USE_VERSION = "professional-use-v1"
export const PROFESSIONAL_INVITE_DEFAULT_DAYS = 7
export const PROFESSIONAL_INVITE_MAX_DAYS = 14

export type ProfessionalAccount = {
  id: string
  user_id: string
  organisation_id: string | null
  display_name: string
  professional_role: string | null
  registration_body: string | null
  registration_number: string | null
  verification_status: "unverified" | "pending" | "verified" | "suspended"
  claimed_organisation_name: string | null
  verification_requested_at: string | null
  organisation_name: string | null
  organisation_verification_status: string | null
  mfa_status: "pending" | "active" | "disabled" | null
  offboarded_at: string | null
}

export function generateProfessionalInvitationToken() {
  return randomBytes(32).toString("base64url")
}

export function hashProfessionalInvitationToken(token: string) {
  return createHash("sha256").update(token).digest("hex")
}

export function looksLikeUuid(value: unknown): value is string {
  return typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
}

export async function getProfessionalAccountForUser(userId: string): Promise<ProfessionalAccount | null> {
  const rows = await sql`
    SELECT
      p.id,
      p.user_id,
      p.organisation_id,
      p.display_name,
      p.professional_role,
      p.registration_body,
      p.registration_number,
      p.verification_status,
      p.claimed_organisation_name,
      p.verification_requested_at,
      p.offboarded_at,
      o.name AS organisation_name,
      o.verification_status AS organisation_verification_status,
      m.status AS mfa_status
    FROM professional_accounts p
    LEFT JOIN organisations o ON o.id = p.organisation_id
    LEFT JOIN mfa_factors m ON m.user_id = p.user_id AND m.factor_type = 'totp'
    WHERE p.user_id = ${userId}
    LIMIT 1
  `
  return (rows[0] as ProfessionalAccount | undefined) ?? null
}

export function professionalCanAccessClientData(professional: ProfessionalAccount, sessionMfaVerified: boolean) {
  return policyCanProfessionalAccessClientData({
    professionalStatus: professional.verification_status,
    organisationId: professional.organisation_id,
    organisationStatus: professional.organisation_verification_status,
    mfaStatus: professional.mfa_status,
    sessionMfaVerified,
  })
}

export async function getProfessionalSession() {
  const session = await getSessionContext()
  if (!session.user) return { user: null, professional: null, mfaVerified: false }
  const professional = await getProfessionalAccountForUser(session.user.id)
  return { user: session.user, professional, mfaVerified: session.mfaVerified }
}
