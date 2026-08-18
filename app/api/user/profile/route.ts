import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import { sql } from "@/lib/db"

export async function GET(_request: NextRequest) {
  try {
    const user = await getSession()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    // Return only fields needed for ordinary client-side profile state. Sensitive
    // onboarding answers, self-harm fields and saved draft data should not be
    // bundled into a generic browser profile endpoint.
    const profile = await sql`
      SELECT
        onboarding_completed,
        journey_types,
        growth_avatar,
        tree_growth_level,
        level_credits,
        check_in_streak,
        longest_streak
      FROM user_profiles
      WHERE user_id = ${user.id}
      LIMIT 1
    `

    if (profile.length === 0) {
      return NextResponse.json({ onboarding_completed: false })
    }

    return NextResponse.json(profile[0])
  } catch (error) {
    console.error("[v0] Get profile error:", error)
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
  }
}
