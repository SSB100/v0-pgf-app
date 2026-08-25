import { sql } from "@/lib/db"
import { getSessionContext } from "@/lib/session"
import { canAdminManageProfessionals } from "@/lib/access-policy.mjs"

export async function getAdminSession() {
  const session = await getSessionContext()
  if (!session.user) return { user: null, authorised: false, mfaStatus: null as string | null }

  const rows = await sql`
    SELECT status
    FROM mfa_factors
    WHERE user_id = ${session.user.id}
      AND factor_type = 'totp'
    LIMIT 1
  `
  const mfaStatus = (rows[0]?.status as string | undefined) ?? null

  return {
    user: session.user,
    mfaStatus,
    authorised: canAdminManageProfessionals({
      role: session.user.role,
      mfaStatus,
      sessionMfaVerified: session.mfaVerified,
    }),
  }
}

export async function recordAdministrativeAuditEvent(input: {
  actorUserId: string
  action: string
  targetType: string
  targetId?: string | null
  reason?: string | null
  metadata?: Record<string, unknown>
}) {
  await sql`
    INSERT INTO administrative_audit_events (
      actor_user_id,
      action,
      target_type,
      target_id,
      reason,
      metadata
    )
    VALUES (
      ${input.actorUserId},
      ${input.action},
      ${input.targetType},
      ${input.targetId ?? null},
      ${input.reason ?? null},
      ${JSON.stringify(input.metadata ?? {})}::jsonb
    )
  `
}
