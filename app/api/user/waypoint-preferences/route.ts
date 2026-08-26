import { NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import { sql } from "@/lib/db"
import { sanitizeMinimumOnboardingInput } from "@/lib/minimum-onboarding-policy.mjs"

const MAX_PAYLOAD_BYTES = 8_000
const NO_STORE_HEADERS = { "Cache-Control": "no-store" }

function toStringList(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((item): item is string => typeof item === "string")
  if (typeof value !== "string") return []
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : []
  } catch {
    return []
  }
}

export async function GET() {
  try {
    const user = await getSession()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: NO_STORE_HEADERS })
    if (user.role !== "client") return NextResponse.json({ error: "Forbidden" }, { status: 403, headers: NO_STORE_HEADERS })

    const rows = await sql`
      SELECT journey_types, growth_avatar
      FROM user_profiles
      WHERE user_id = ${user.id}::uuid
        AND COALESCE(onboarding_completed, false) = true
      LIMIT 1
    `

    if (!rows[0]) {
      return NextResponse.json({ error: "Waypoint preferences are unavailable" }, { status: 404, headers: NO_STORE_HEADERS })
    }

    return NextResponse.json(
      {
        journeyTypes: toStringList(rows[0].journey_types),
        growthAvatar: typeof rows[0].growth_avatar === "string" && rows[0].growth_avatar ? rows[0].growth_avatar : "growth_tree",
      },
      { headers: NO_STORE_HEADERS },
    )
  } catch (error) {
    console.error("[waypoint] Unable to load Waypoint preferences", error)
    return NextResponse.json({ error: "Unable to load Waypoint preferences" }, { status: 500, headers: NO_STORE_HEADERS })
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await getSession()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: NO_STORE_HEADERS })
    if (user.role !== "client") return NextResponse.json({ error: "Forbidden" }, { status: 403, headers: NO_STORE_HEADERS })

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400, headers: NO_STORE_HEADERS })
    }

    if (typeof body !== "object" || body === null) {
      return NextResponse.json({ error: "Waypoint preferences are required" }, { status: 400, headers: NO_STORE_HEADERS })
    }

    const serialized = JSON.stringify(body)
    if (Buffer.byteLength(serialized, "utf8") > MAX_PAYLOAD_BYTES) {
      return NextResponse.json({ error: "Waypoint preferences are too large" }, { status: 413, headers: NO_STORE_HEADERS })
    }

    const result = sanitizeMinimumOnboardingInput(body as Record<string, unknown>)
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400, headers: NO_STORE_HEADERS })
    }

    const updated = await sql`
      UPDATE user_profiles
      SET
        journey_types = ${JSON.stringify(result.journeyTypes)}::jsonb,
        growth_avatar = ${result.growthAvatar},
        updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ${user.id}::uuid
        AND COALESCE(onboarding_completed, false) = true
      RETURNING journey_types, growth_avatar
    `

    if (!updated[0]) {
      return NextResponse.json({ error: "Unable to update Waypoint preferences" }, { status: 409, headers: NO_STORE_HEADERS })
    }

    return NextResponse.json(
      {
        success: true,
        journeyTypes: toStringList(updated[0].journey_types),
        growthAvatar: updated[0].growth_avatar,
      },
      { headers: NO_STORE_HEADERS },
    )
  } catch (error) {
    console.error("[waypoint] Unable to update Waypoint preferences", error)
    return NextResponse.json({ error: "Unable to update Waypoint preferences" }, { status: 500, headers: NO_STORE_HEADERS })
  }
}
