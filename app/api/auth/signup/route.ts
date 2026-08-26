import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createUser, getUserByEmail } from "@/lib/auth"
import { encrypt } from "@/lib/session"
import { dbColumnExists, sql } from "@/lib/db"
import { getAotearoaDateKey } from "@/lib/aotearoa-date"
import { governanceTableExists } from "@/lib/governance"
import { AUTH_RATE_LIMITS } from "@/lib/auth-abuse-policy.mjs"
import { consumeAuthRateLimit, getAuthRequestNetworkSubject } from "@/lib/auth-rate-limit"

const TERMS_VERSION = "0.3"
const PRIVACY_POLICY_VERSION = "0.1"

function calculateAge(dateOfBirth: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateOfBirth)) return null
  const [birthYear, birthMonth, birthDay] = dateOfBirth.split("-").map(Number)
  const parsedBirthDate = new Date(Date.UTC(birthYear, birthMonth - 1, birthDay))
  if (parsedBirthDate.getUTCFullYear() !== birthYear || parsedBirthDate.getUTCMonth() !== birthMonth - 1 || parsedBirthDate.getUTCDate() !== birthDay) return null
  const [currentYear, currentMonth, currentDay] = getAotearoaDateKey().split("-").map(Number)
  let age = currentYear - birthYear
  if (currentMonth < birthMonth || (currentMonth === birthMonth && currentDay < birthDay)) age -= 1
  return age
}

function ageBandForAge(age: number) {
  if (age <= 24) return "18-24"
  if (age <= 34) return "25-34"
  if (age <= 44) return "35-44"
  if (age <= 54) return "45-54"
  if (age <= 64) return "55-64"
  return "65+"
}

function limiterUnavailable() {
  return NextResponse.json(
    { error: "Account creation is temporarily unavailable. Please try again shortly." },
    { status: 503, headers: { "Cache-Control": "no-store", "Retry-After": "60" } },
  )
}

function limiterBlocked(retryAfterSeconds: number) {
  return NextResponse.json(
    { error: "Too many account-creation attempts. Please try again later." },
    {
      status: 429,
      headers: { "Cache-Control": "no-store", "Retry-After": String(Math.max(1, retryAfterSeconds)) },
    },
  )
}

export async function POST(request: NextRequest) {
  try {
    const networkGate = await consumeAuthRateLimit(
      AUTH_RATE_LIMITS.clientSignupNetwork,
      getAuthRequestNetworkSubject(request),
    )
    if (networkGate.unavailable) return limiterUnavailable()
    if (!networkGate.allowed) return limiterBlocked(networkGate.retryAfterSeconds)

    const body = await request.json()
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : ""
    const password = typeof body.password === "string" ? body.password : ""
    const fullName = typeof body.fullName === "string" ? body.fullName.trim().slice(0, 150) : ""
    const dateOfBirth = typeof body.dateOfBirth === "string" ? body.dateOfBirth : ""
    const termsAccepted = body.termsAccepted === true

    if (!email || !password || !fullName || !dateOfBirth) {
      return NextResponse.json({ error: "Name, email, password and date of birth are required" }, { status: 400 })
    }

    const identityGate = await consumeAuthRateLimit(AUTH_RATE_LIMITS.clientSignupIdentity, email)
    if (identityGate.unavailable) return limiterUnavailable()
    if (!identityGate.allowed) return limiterBlocked(identityGate.retryAfterSeconds)

    if (password.length < 8 || password.length > 128) return NextResponse.json({ error: "Password must be between 8 and 128 characters" }, { status: 400 })
    if (!termsAccepted) return NextResponse.json({ error: "You must accept the terms and acknowledge the privacy notice" }, { status: 400 })

    const age = calculateAge(dateOfBirth)
    if (age === null || age < 0 || age > 120) return NextResponse.json({ error: "Please enter a valid date of birth" }, { status: 400 })
    if (age < 18) return NextResponse.json({ error: "The current Waypoint MVP is available to adults aged 18 and over." }, { status: 400 })

    const existingUser = await getUserByEmail(email)
    if (existingUser) return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 })

    const user = await createUser(email, password, fullName)
    const now = new Date().toISOString()
    const ageMinimisationReady = await dbColumnExists("users", "age_verified_18_plus")

    if (ageMinimisationReady) {
      await sql`
        UPDATE users SET
          terms_accepted = true,
          terms_accepted_date = ${now},
          date_of_birth = NULL,
          age_verified_18_plus = true,
          age_verified_at = ${now},
          age_band = ${ageBandForAge(age)},
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${user.id}
      `
    } else {
      await sql`
        UPDATE users SET
          terms_accepted = true,
          terms_accepted_date = ${now},
          date_of_birth = ${dateOfBirth},
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${user.id}
      `
    }

    try {
      if (await governanceTableExists("policy_acceptances")) {
        await sql`
          INSERT INTO policy_acceptances (user_id, policy_type, policy_version, action, occurred_at, metadata)
          VALUES
            (${user.id}, 'terms', ${TERMS_VERSION}, 'accepted', ${now}, '{"source":"signup"}'::jsonb),
            (${user.id}, 'privacy_policy', ${PRIVACY_POLICY_VERSION}, 'acknowledged', ${now}, '{"source":"signup","acknowledgement":true}'::jsonb)
        `
      }
    } catch (governanceError) {
      console.warn("[waypoint] Account created but policy acknowledgement history could not be recorded", governanceError)
    }

    const token = await encrypt({ userId: user.id })
    const response = NextResponse.json({ success: true, user: { id: user.id, email: user.email, full_name: user.full_name }, onboardingComplete: false })
    response.cookies.set("session", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: 60 * 60 * 24 * 7, path: "/" })
    return response
  } catch (error) {
    console.error("[v0] Sign up error:", error)
    return NextResponse.json({ error: "An error occurred during sign up" }, { status: 500 })
  }
}
