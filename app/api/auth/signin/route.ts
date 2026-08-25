import { type NextRequest, NextResponse } from "next/server"
import { getUserByEmail, verifyPassword, hashPassword, isLegacyPasswordHash } from "@/lib/auth"
import { createMfaChallengeToken, encrypt } from "@/lib/session"
import { sql } from "@/lib/db"

function safeReturnPath(value: unknown) {
  return typeof value === "string" && value.startsWith("/") && !value.startsWith("//") ? value : null
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : ""
    const password = typeof body.password === "string" ? body.password : ""
    const returnTo = safeReturnPath(body.returnTo)

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const user = await getUserByEmail(email)
    if (!user) return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })

    const isValid = await verifyPassword(password, user.password_hash)
    if (!isValid) return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })

    if (isLegacyPasswordHash(user.password_hash)) {
      const upgradedHash = await hashPassword(password)
      await sql`UPDATE users SET password_hash = ${upgradedHash}, updated_at = NOW() WHERE id = ${user.id}`
    }

    const profile = await sql`SELECT onboarding_completed FROM user_profiles WHERE user_id = ${user.id}`
    const onboardingComplete = profile.length > 0 ? Boolean(profile[0].onboarding_completed) : false
    const professionalRows = await sql`SELECT id, verification_status FROM professional_accounts WHERE user_id = ${user.id} LIMIT 1`
    const professionalAccount = professionalRows[0] ?? null
    const strongAuthAccount = user.role === "professional" || user.role === "admin" || Boolean(professionalAccount)

    if (strongAuthAccount) {
      const mfaRows = await sql`
        SELECT status
        FROM mfa_factors
        WHERE user_id = ${user.id}
          AND factor_type = 'totp'
        LIMIT 1
      `
      const mfaStatus = mfaRows[0]?.status ?? null

      if (mfaStatus === "active") {
        const challengeToken = await createMfaChallengeToken({
          userId: user.id,
          securityVersion: user.security_version || 1,
          returnTo: returnTo || (user.role === "admin" ? "/admin/professionals" : "/professional"),
        })
        const response = NextResponse.json({
          success: true,
          requiresMfa: true,
          redirectTo: "/auth/professional-mfa",
        })
        response.cookies.delete("session")
        response.cookies.set("professional_mfa_challenge", challengeToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 5,
          path: "/",
        })
        return response
      }

      const token = await encrypt({
        userId: user.id,
        securityVersion: user.security_version || 1,
        mfaVerified: false,
      })
      const response = NextResponse.json({
        success: true,
        requiresMfaSetup: true,
        professionalAccount: professionalAccount ? { verificationStatus: professionalAccount.verification_status } : null,
        redirectTo: "/security/mfa",
      })
      response.cookies.set("session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      })
      return response
    }

    const redirectTo = onboardingComplete ? "/dashboard" : "/onboarding"
    const token = await encrypt({ userId: user.id, securityVersion: user.security_version || 1, mfaVerified: false })
    const response = NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, full_name: user.full_name },
      onboardingComplete,
      professionalAccount: null,
      redirectTo,
    })

    response.cookies.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    })

    return response
  } catch (error) {
    console.error("[waypoint] Sign in error:", error)
    return NextResponse.json({ error: "An error occurred during sign in" }, { status: 500 })
  }
}
