import { type NextRequest, NextResponse } from "next/server"
import { createUser, getUserByEmail } from "@/lib/auth"
import { encrypt } from "@/lib/session"
import { sql } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Sign up attempt starting")
    const { email, password, fullName, dateOfBirth, country, gender, termsAccepted, dataConsent } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 })
    }

    if (!termsAccepted) {
      return NextResponse.json({ error: "You must accept the terms and conditions" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(email)
    if (existingUser) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 })
    }

    console.log("[v0] Creating new user")
    const user = await createUser(email, password, fullName)

    if (user.id) {
      const now = new Date().toISOString()
      await sql`
        UPDATE users 
        SET 
          data_consent = ${dataConsent || false},
          data_consent_date = ${dataConsent ? now : null},
          terms_accepted = ${termsAccepted},
          terms_accepted_date = ${now},
          date_of_birth = ${dateOfBirth || null},
          country = ${country || null},
          gender = ${gender || null}
        WHERE id = ${user.id}
      `
      console.log("[v0] User consent preferences and demographics saved")
    }

    const token = await encrypt({ userId: user.id })
    console.log("[v0] Token created for new user, setting cookie")

    const response = NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, full_name: user.full_name },
      onboardingComplete: false, // New users always need onboarding
    })

    response.cookies.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    })

    console.log("[v0] Sign up successful, cookie set")
    return response
  } catch (error) {
    console.error("[v0] Sign up error:", error)
    return NextResponse.json({ error: "An error occurred during sign up" }, { status: 500 })
  }
}
