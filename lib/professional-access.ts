import { createHash, randomBytes } from "node:crypto"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"

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
      o.name AS organisation_name,
      o.verification_status AS organisation_verification_status
    FROM professional_accounts p
    LEFT JOIN organisations o ON o.id = p.organisation_id
    WHERE p.user_id = ${userId}
    LIMIT 1
  `
  return (rows[0] as ProfessionalAccount | undefined) ?? null
}

export function professionalCanAccessClientData(professional: ProfessionalAccount) {
  return professional.verification_status === "verified"
    && Boolean(professional.organisation_id)
    && professional.organisation_verification_status === "verified"
}

export async function getProfessionalSession() {
  const user = await getSession()
  if (!user) return { user: null, professional: null }
  const professional = await getProfessionalAccountForUser(user.id)
  return { user, professional }
}
