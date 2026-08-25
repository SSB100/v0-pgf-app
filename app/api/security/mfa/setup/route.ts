import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSessionContext, createSession, deleteMfaChallenge } from "@/lib/session"
import { recordAccessAuditEvent } from "@/lib/governance"
import {
  buildTotpUri,
  decryptMfaSecret,
  encryptMfaSecret,
  generateRecoveryCodes,
  generateTotpSecret,
  hashRecoveryCode,
  verifyTotpCode,
} from "@/lib/mfa"

export const runtime = "nodejs"

function eligibleRole(role: string) {
  return role === "professional" || role === "admin"
}

async function getFactor(userId: string) {
  const rows = await sql`
    SELECT id, status, secret_ciphertext, secret_iv, secret_auth_tag, verified_at, locked_until
    FROM mfa_factors
    WHERE user_id = ${userId}
      AND factor_type = 'totp'
    LIMIT 1
  `
  return rows[0] ?? null
}

export async function GET() {
  try {
    const session = await getSessionContext()
    if (!session.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    if (!eligibleRole(session.user.role)) return NextResponse.json({ error: "MFA setup is not required for this account" }, { status: 403 })

    let factor = await getFactor(session.user.id)
    if (factor?.status === "active") {
      return NextResponse.json({ status: "active", verifiedAt: factor.verified_at }, { headers: { "Cache-Control": "private, no-store, max-age=0" } })
    }

    if (!factor || factor.status === "disabled") {
      const secret = generateTotpSecret()
      const encrypted = encryptMfaSecret(secret)

      await sql`
        INSERT INTO mfa_factors (
          user_id,
          factor_type,
          status,
          secret_ciphertext,
          secret_iv,
          secret_auth_tag,
          failed_attempts,
          locked_until,
          setup_started_at,
          disabled_at,
          updated_at
        )
        VALUES (
          ${session.user.id},
          'totp',
          'pending',
          ${encrypted.ciphertext},
          ${encrypted.iv},
          ${encrypted.authTag},
          0,
          NULL,
          CURRENT_TIMESTAMP,
          NULL,
          CURRENT_TIMESTAMP
        )
        ON CONFLICT (user_id) DO UPDATE SET
          status = 'pending',
          secret_ciphertext = EXCLUDED.secret_ciphertext,
          secret_iv = EXCLUDED.secret_iv,
          secret_auth_tag = EXCLUDED.secret_auth_tag,
          failed_attempts = 0,
          locked_until = NULL,
          setup_started_at = CURRENT_TIMESTAMP,
          disabled_at = NULL,
          updated_at = CURRENT_TIMESTAMP
      `
      factor = await getFactor(session.user.id)
    }

    if (!factor) throw new Error("MFA factor could not be created")
    const secret = decryptMfaSecret({
      ciphertext: factor.secret_ciphertext,
      iv: factor.secret_iv,
      authTag: factor.secret_auth_tag,
    })

    return NextResponse.json({
      status: "pending",
      secret,
      otpauthUri: buildTotpUri({ secret, email: session.user.email }),
      instructions: "Add this account to an authenticator app using the setup key, then enter the current six-digit code to confirm.",
    }, { headers: { "Cache-Control": "private, no-store, max-age=0" } })
  } catch (error) {
    console.error("[waypoint] MFA setup failed", error)
    const message = error instanceof Error && error.message.includes("MFA_ENCRYPTION_KEY")
      ? "Professional MFA is not configured on this environment"
      : "Unable to prepare MFA setup"
    return NextResponse.json({ error: message }, { status: message.includes("not configured") ? 503 : 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSessionContext()
    if (!session.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    if (!eligibleRole(session.user.role)) return NextResponse.json({ error: "MFA setup is not required for this account" }, { status: 403 })

    const body = await request.json()
    const code = typeof body.code === "string" ? body.code.trim() : ""
    const factor = await getFactor(session.user.id)
    if (!factor || factor.status !== "pending") return NextResponse.json({ error: "No pending MFA setup was found" }, { status: 409 })

    const secret = decryptMfaSecret({
      ciphertext: factor.secret_ciphertext,
      iv: factor.secret_iv,
      authTag: factor.secret_auth_tag,
    })

    if (!verifyTotpCode(secret, code)) {
      return NextResponse.json({ error: "That authenticator code was not accepted. Check the time on your device and try again." }, { status: 400 })
    }

    const recoveryCodes = generateRecoveryCodes(10)
    await sql`DELETE FROM mfa_recovery_codes WHERE factor_id = ${factor.id}`
    for (const recoveryCode of recoveryCodes) {
      await sql`
        INSERT INTO mfa_recovery_codes (factor_id, code_hash)
        VALUES (${factor.id}, ${hashRecoveryCode(recoveryCode)})
      `
    }

    await sql`
      UPDATE mfa_factors
      SET
        status = 'active',
        verified_at = COALESCE(verified_at, CURRENT_TIMESTAMP),
        last_verified_at = CURRENT_TIMESTAMP,
        failed_attempts = 0,
        locked_until = NULL,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${factor.id}
    `

    await recordAccessAuditEvent({
      subjectUserId: session.user.id,
      actorUserId: session.user.id,
      eventType: "mfa_setup_completed",
      resourceScope: "account_security",
      purpose: "strong_authentication",
    })

    await createSession(session.user.id, { mfaVerified: true })
    await deleteMfaChallenge()

    return NextResponse.json({
      success: true,
      recoveryCodes,
      warning: "Save these recovery codes now. Waypoint stores only protected hashes and cannot show the same codes again.",
      redirectTo: session.user.role === "admin" ? "/admin/professionals" : "/professional",
    })
  } catch (error) {
    console.error("[waypoint] MFA verification failed", error)
    return NextResponse.json({ error: "Unable to complete MFA setup" }, { status: 500 })
  }
}
