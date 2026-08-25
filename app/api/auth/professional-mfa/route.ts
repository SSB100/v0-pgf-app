import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getUserById } from "@/lib/auth"
import { createSession, deleteMfaChallenge, readMfaChallengeToken } from "@/lib/session"
import { decryptMfaSecret, hashRecoveryCode, looksLikeTotp, verifyTotpCode } from "@/lib/mfa"
import { recordAccessAuditEvent } from "@/lib/governance"

export const runtime = "nodejs"

function safeReturnPath(value: unknown, role: string) {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) {
    return role === "admin" ? "/admin/professionals" : "/professional"
  }
  return value
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const challengeToken = cookieStore.get("professional_mfa_challenge")?.value
    if (!challengeToken) return NextResponse.json({ error: "Your verification session has expired. Sign in again." }, { status: 401 })

    const challenge = await readMfaChallengeToken(challengeToken)
    if (!challenge) {
      await deleteMfaChallenge()
      return NextResponse.json({ error: "Your verification session has expired. Sign in again." }, { status: 401 })
    }

    const user = await getUserById(challenge.userId)
    if (!user || (user.role !== "professional" && user.role !== "admin")) {
      await deleteMfaChallenge()
      return NextResponse.json({ error: "Professional verification is unavailable for this account." }, { status: 403 })
    }

    const challengeSecurityVersion = typeof challenge.securityVersion === "number" ? challenge.securityVersion : 1
    if ((user.security_version || 1) !== challengeSecurityVersion) {
      await deleteMfaChallenge()
      return NextResponse.json({ error: "Your sign-in was invalidated by a security change. Sign in again." }, { status: 401 })
    }

    const rows = await sql`
      SELECT id, status, secret_ciphertext, secret_iv, secret_auth_tag, failed_attempts, locked_until
      FROM mfa_factors
      WHERE user_id = ${user.id}
        AND factor_type = 'totp'
      LIMIT 1
    `
    const factor = rows[0]
    if (!factor || factor.status !== "active") {
      return NextResponse.json({ error: "Authenticator verification has not been activated for this account." }, { status: 409 })
    }

    if (factor.locked_until && new Date(factor.locked_until).getTime() > Date.now()) {
      return NextResponse.json({ error: "Too many unsuccessful attempts. Try again after the temporary lock expires." }, { status: 429 })
    }

    const body = await request.json()
    const code = typeof body.code === "string" ? body.code.trim() : ""
    let valid = false
    let usedRecoveryCode = false

    if (looksLikeTotp(code)) {
      const secret = decryptMfaSecret({
        ciphertext: factor.secret_ciphertext,
        iv: factor.secret_iv,
        authTag: factor.secret_auth_tag,
      })
      valid = verifyTotpCode(secret, code)
    } else if (code.length >= 8) {
      const recoveryHash = hashRecoveryCode(code)
      const used = await sql`
        UPDATE mfa_recovery_codes
        SET used_at = CURRENT_TIMESTAMP
        WHERE factor_id = ${factor.id}
          AND code_hash = ${recoveryHash}
          AND used_at IS NULL
        RETURNING id
      `
      valid = used.length > 0
      usedRecoveryCode = valid
    }

    if (!valid) {
      await sql`
        UPDATE mfa_factors
        SET
          failed_attempts = failed_attempts + 1,
          locked_until = CASE
            WHEN failed_attempts + 1 >= 5 THEN CURRENT_TIMESTAMP + INTERVAL '15 minutes'
            ELSE locked_until
          END,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${factor.id}
      `
      return NextResponse.json({ error: "That verification code was not accepted." }, { status: 401 })
    }

    await sql`
      UPDATE mfa_factors
      SET failed_attempts = 0, locked_until = NULL, last_verified_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${factor.id}
    `

    await recordAccessAuditEvent({
      subjectUserId: user.id,
      actorUserId: user.id,
      eventType: usedRecoveryCode ? "mfa_recovery_code_used" : "mfa_challenge_verified",
      resourceScope: "account_security",
      purpose: "strong_authentication",
    })

    await createSession(user.id, { mfaVerified: true })
    await deleteMfaChallenge()

    return NextResponse.json({ success: true, redirectTo: safeReturnPath(challenge.returnTo, user.role) })
  } catch (error) {
    console.error("[waypoint] MFA sign-in verification failed", error)
    return NextResponse.json({ error: "Unable to complete authenticator verification" }, { status: 500 })
  }
}
