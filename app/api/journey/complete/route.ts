import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import { sql } from "@/lib/db"
import { JOURNEY_MODULE_TITLE_BY_SLUG } from "@/lib/journey-curriculum"

// Keep the previous standalone Distress Tolerance route rewardable for users who
// arrive through an old bookmark while the new Journey uses more specific modules.
const LEGACY_JOURNEY_MODULES: Record<string, string> = {
  "distress-tolerance": "Distress Tolerance",
}

export async function POST(request: NextRequest) {
  try {
    const user = await getSession()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await request.json()
    const moduleSlug = typeof body.moduleSlug === "string" ? body.moduleSlug : ""
    const moduleTitle = JOURNEY_MODULE_TITLE_BY_SLUG[moduleSlug] || LEGACY_JOURNEY_MODULES[moduleSlug]

    if (!moduleTitle) {
      return NextResponse.json({ error: "Unknown journey module" }, { status: 400 })
    }

    // Do not trust the client to decide whether a completion is rewardable or
    // what the module is called. Only one completion per known module can earn a
    // Growth Credit.
    const inserted = await sql`
      INSERT INTO journey_completions (user_id, module_slug, module_name)
      SELECT ${user.id}, ${moduleSlug}, ${moduleTitle}
      WHERE NOT EXISTS (
        SELECT 1 FROM journey_completions
        WHERE user_id = ${user.id} AND module_slug = ${moduleSlug}
      )
      RETURNING id
    `

    if (inserted.length === 0) {
      return NextResponse.json({ message: "Module already completed", alreadyCompleted: true })
    }

    const profileResult = await sql`
      UPDATE user_profiles
      SET level_credits = COALESCE(level_credits, 0) + 1
      WHERE user_id = ${user.id}
      RETURNING level_credits
    `

    return NextResponse.json({
      success: true,
      creditsAwarded: 1,
      totalCredits: profileResult[0]?.level_credits || 0,
    })
  } catch (error) {
    console.error("Error completing journey module:", error)
    return NextResponse.json({ error: "Failed to complete module" }, { status: 500 })
  }
}
