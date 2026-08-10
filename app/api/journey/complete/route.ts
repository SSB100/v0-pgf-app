import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import { sql } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const user = await getSession()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { moduleSlug, moduleTitle } = await request.json()

    if (!moduleSlug || !moduleTitle) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if already completed
    const existing = await sql`
      SELECT id FROM journey_completions
      WHERE user_id = ${user.id} AND module_slug = ${moduleSlug}
    `

    if (existing.length > 0) {
      return NextResponse.json({ message: "Module already completed", alreadyCompleted: true })
    }

    // Mark module as complete
    await sql`
      INSERT INTO journey_completions (user_id, module_slug, module_name)
      VALUES (${user.id}, ${moduleSlug}, ${moduleTitle})
    `

    // Award 1 level credit
    await sql`
      UPDATE user_profiles
      SET level_credits = level_credits + 1
      WHERE user_id = ${user.id}
    `

    // Get updated level credits
    const profileResult = await sql`
      SELECT level_credits FROM user_profiles
      WHERE user_id = ${user.id}
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
