import { type NextRequest, NextResponse } from "next/server"
import { createUser, getUserByEmail } from "@/lib/auth"
import { encrypt } from "@/lib/session"
import { sql } from "@/lib/db"

function calculateAge(dateOfBirth: string) {
  const dob = new Date(`${dateOfBirth}T00:00:00`)
  if (Number.isNaN(dob.getTime())) return null

  const today = new Date()
  let age = today.getFullYear() - dob.getFullYear()
  const monthDifference = today.getMonth() - dob.getMonth()

  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < dob.getDate())) age -= 1
  return age
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : ""
    const password = typeof body.password === "string" ? body.password : ""
    const fullName = typeof body.fullName === "string" ? body.fullName.trim().slice(0, 150) : ""
    const dateOfBirth = typeof body.dateOfBirth === "string" ? body.dateOfBirth : ""
    const country = typeof body.country === "string" ? body.country.trim().slice(0, 100) : ""
    const gender = typeof body.gender === "string" ? body.gender.trim().slice(0, 50) : ""
    const termsAccepted = body.termsAccepted === true
    const dataConsent = body.dataConsent === true

    if (!email || !password || !dateOfBirth) {
      return NextResponse.json({ error: "Email, password and date of birth are required" }, { status: 400 })
    }

    if (password.length < 8 || password.length > 128) {
      return NextResponse.json({ error: "Password must be between 8 and 128 characters" }, { status: 400 })
    }

    if (!termsAccepted) {
      return NextResponse.json({ error: "You must accept the terms and conditions" }, { status: 400 })
    }

    const age = calculateAge(dateOfBirth)
    if (age === null || age < 0 || age > 120) {
      return NextResponse.json({ error: "Please enter a valid date of birth" }, { status: 400 })
    }

    if (age < 18) {
      return NextResponse.json({ error: "The current Waypoint MVP is available to adults aged 18 and over." }, { status: 400 })
    }

    const existingUser = await getUserByEmail(email)
    if (existingUser) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 })
    }

    const user = await createUser(email, password, fullName || undefined)
    const now = new Date().toISOString()

    await sql`
      UPDATE users
      SET
        data_consent = ${dataConsent},
        data_consent_date = ${dataConsent ? now : null},
        terms_accepted = true,
        terms_accepted_date = ${now},
        date_of_birth = ${dateOfBirth},
        country = ${country || null},
        gender = ${gender || null}
      WHERE id = ${user.id}
    `

    const token = await encrypt({ userId: user.id })
    const response = NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, full_name: user.full_name },
      onboardingComplete: false,
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
    console.error("[v0] Sign up error:", error)
    return NextResponse.json({ error: "An error occurred during sign up" }, { status: 500 })
  }
}
