import { type NextRequest, NextResponse } from "next/server"
import { getUserByEmail, verifyPassword, hashPassword, isLegacyPasswordHash } from "@/lib/auth"
import { encrypt } from "@/lib/session"
import { sql } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : ""
    const password = typeof body.password === "string" ? body.password : ""

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const user = await getUserByEmail(email)
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    const isValid = await verifyPassword(password, user.password_hash)
    if (!isValid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Existing MVP accounts may still have the original unsalted SHA-256 password
    // hash. Upgrade it transparently after the user proves they know the password.
    if (isLegacyPasswordHash(user.password_hash)) {
      const upgradedHash = await hashPassword(password)
      await sql`
        UPDATE users
        SET password_hash = ${upgradedHash}, updated_at = NOW()
        WHERE id = ${user.id}
      `
    }

    const profile = await sql`
      SELECT onboarding_completed FROM user_profiles WHERE user_id = ${user.id}
    `
    const onboardingComplete = profile.length > 0 ? Boolean(profile[0].onboarding_completed) : false

    const token = await encrypt({ userId: user.id })

    const response = NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, full_name: user.full_name },
      onboardingComplete,
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
    console.error("[v0] Sign in error:", error)
    return NextResponse.json({ error: "An error occurred during sign in" }, { status: 500 })
  }
}
