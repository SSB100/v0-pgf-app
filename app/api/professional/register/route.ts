import { type NextRequest, NextResponse } from "next/server"
import { hashPassword } from "@/lib/auth"
import { sql } from "@/lib/db"
import { createSession } from "@/lib/session"
import { PROFESSIONAL_USE_VERSION } from "@/lib/professional-access"

const TERMS_VERSION = "0.3"
const PRIVACY_VERSION = "0.1"

function latestEligibleBirthDate() {
  const today = new Date()
  return new Date(Date.UTC(today.getUTCFullYear() - 18, today.getUTCMonth(), today.getUTCDate()))
}

function parseBirthDate(value: unknown) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null
  const parsed = new Date(`${value}T00:00:00.000Z`)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : ""
    const password = typeof body.password === "string" ? body.password : ""
    const displayName = typeof body.displayName === "string" ? body.displayName.trim() : ""
    const professionalRole = typeof body.professionalRole === "string" ? body.professionalRole.trim() : ""
    const organisationName = typeof body.organisationName === "string" ? body.organisationName.trim() : ""
    const registrationBody = typeof body.registrationBody === "string" ? body.registrationBody.trim() : ""
    const registrationNumber = typeof body.registrationNumber === "string" ? body.registrationNumber.trim() : ""
    const dateOfBirth = parseBirthDate(body.dateOfBirth)

    if (!email || !displayName || !professionalRole || !organisationName || !dateOfBirth) {
      return NextResponse.json({ error: "Please complete all required fields" }, { status: 400 })
    }
    if (dateOfBirth > latestEligibleBirthDate()) {
      return NextResponse.json({ error: "Professional accounts are currently limited to people aged 18 and over" }, { status: 400 })
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 })
    }
    if (body.termsAccepted !== true || body.privacyAcknowledged !== true || body.professionalUseAccepted !== true) {
      return NextResponse.json({ error: "You must accept the required terms and professional-use notice" }, { status: 400 })
    }

    const existing = await sql`SELECT id FROM users WHERE email = ${email} LIMIT 1`
    if (existing.length > 0) {
      return NextResponse.json({ error: "An account already exists for this email address" }, { status: 409 })
    }

    const passwordHash = await hashPassword(password)
    const age = Math.floor((Date.now() - dateOfBirth.getTime()) / 31557600000)
    const ageBand = age < 25 ? "18-24" : age < 35 ? "25-34" : age < 45 ? "35-44" : age < 55 ? "45-54" : age < 65 ? "55-64" : "65+"

    const created = await sql`
      INSERT INTO users (
        email,
        password_hash,
        full_name,
        role,
        terms_accepted,
        terms_accepted_date,
        age_verified_18_plus,
        age_verified_at,
        age_band
      )
      VALUES (
        ${email},
        ${passwordHash},
        ${displayName},
        'professional',
        TRUE,
        CURRENT_TIMESTAMP,
        TRUE,
        CURRENT_TIMESTAMP,
        ${ageBand}
      )
      RETURNING id
    `
    const userId = created[0]?.id as string | undefined
    if (!userId) throw new Error("Professional user creation failed")

    try {
      await sql`INSERT INTO user_profiles (user_id) VALUES (${userId})`
      await sql`
        INSERT INTO professional_accounts (
          user_id,
          display_name,
          professional_role,
          registration_body,
          registration_number,
          verification_status,
          claimed_organisation_name,
          verification_requested_at,
          professional_use_version,
          professional_use_accepted_at
        )
        VALUES (
          ${userId},
          ${displayName},
          ${professionalRole},
          ${registrationBody || null},
          ${registrationNumber || null},
          'pending',
          ${organisationName},
          CURRENT_TIMESTAMP,
          ${PROFESSIONAL_USE_VERSION},
          CURRENT_TIMESTAMP
        )
      `

      await sql`
        INSERT INTO policy_acceptances (user_id, policy_type, policy_version, action, metadata)
        VALUES
          (${userId}, 'terms', ${TERMS_VERSION}, 'accepted', '{"source":"professional_signup"}'::jsonb),
          (${userId}, 'privacy', ${PRIVACY_VERSION}, 'acknowledged', '{"source":"professional_signup"}'::jsonb),
          (${userId}, 'professional_use', ${PROFESSIONAL_USE_VERSION}, 'accepted', '{"source":"professional_signup"}'::jsonb)
      `
    } catch (error) {
      await sql`DELETE FROM users WHERE id = ${userId}`
      throw error
    }

    await createSession(userId, { mfaVerified: false })
    return NextResponse.json({ success: true, redirectTo: "/security/mfa" })
  } catch (error) {
    console.error("[waypoint] Professional registration failed", error)
    return NextResponse.json({ error: "Unable to create professional account" }, { status: 500 })
  }
}
