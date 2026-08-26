import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"
import { sanitizeMinimumOnboardingInput } from "@/lib/minimum-onboarding-policy.mjs"

const MAX_PAYLOAD_BYTES = 8_000
const NO_STORE_HEADERS = { "Cache-Control": "no-store" }

export async function POST(request: Request) {
  try {
    const user = await getSession()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: NO_STORE_HEADERS })
    if (user.role !== "client") return NextResponse.json({ error: "Forbidden" }, { status: 403, headers: NO_STORE_HEADERS })

    const profileRows = await sql`
      SELECT onboarding_completed
      FROM user_profiles
      WHERE user_id = ${user.id}::uuid
      LIMIT 1
    `

    if (profileRows[0]?.onboarding_completed === true) {
      return NextResponse.json({ success: true, alreadyCompleted: true }, { headers: NO_STORE_HEADERS })
    }

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400, headers: NO_STORE_HEADERS })
    }

    if (typeof body !== "object" || body === null) {
      return NextResponse.json({ error: "Onboarding data is required" }, { status: 400, headers: NO_STORE_HEADERS })
    }

    const serialized = JSON.stringify(body)
    if (Buffer.byteLength(serialized, "utf8") > MAX_PAYLOAD_BYTES) {
      return NextResponse.json({ error: "Onboarding data is too large" }, { status: 413, headers: NO_STORE_HEADERS })
    }

    const result = sanitizeMinimumOnboardingInput(body as Record<string, unknown>)
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400, headers: NO_STORE_HEADERS })
    }

    const updated = await sql`
      UPDATE user_profiles
      SET
        onboarding_completed = true,
        journey_types = ${JSON.stringify(result.journeyTypes)}::jsonb,
        growth_avatar = ${result.growthAvatar},
        onboarding_current_step = NULL,
        onboarding_data = NULL,
        onboarding_last_saved = NULL,
        updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ${user.id}::uuid
        AND COALESCE(onboarding_completed, false) = false
      RETURNING user_id
    `

    if (updated.length === 0) {
      return NextResponse.json({ error: "Unable to complete minimum setup" }, { status: 409, headers: NO_STORE_HEADERS })
    }

    return NextResponse.json(
      {
        success: true,
        journeyTypes: result.journeyTypes,
        growthAvatar: result.growthAvatar,
        growthCreditsAwarded: 0,
      },
      { headers: NO_STORE_HEADERS },
    )
  } catch (error) {
    console.error("[waypoint] Minimum onboarding completion error", error)
    return NextResponse.json({ error: "Unable to complete setup" }, { status: 500, headers: NO_STORE_HEADERS })
  }
}
