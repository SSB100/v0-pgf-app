import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"

export async function POST(request: NextRequest) {
  try {
    const user = await getSession()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("[v0] Processing level up for user:", user.id)

    // Get current profile data
    const profileResult = await sql`
      SELECT tree_growth_level, level_credits
      FROM user_profiles
      WHERE user_id = ${user.id}
    `

    if (!profileResult[0]) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    const { tree_growth_level, level_credits } = profileResult[0]

    if (level_credits < 1) {
      return NextResponse.json({ error: "No credits available to apply" }, { status: 400 })
    }

    // Apply one credit to level
    const newLevel = tree_growth_level + 1
    const newCredits = level_credits - 1

    await sql`
      UPDATE user_profiles
      SET 
        tree_growth_level = ${newLevel},
        level_credits = ${newCredits},
        updated_at = NOW()
      WHERE user_id = ${user.id}
    `

    console.log("[v0] Level up successful! New level:", newLevel, "Remaining credits:", newCredits)

    return NextResponse.json({
      success: true,
      newLevel,
      remainingCredits: newCredits,
    })
  } catch (error) {
    console.error("[v0] Level up error:", error)
    return NextResponse.json(
      {
        error: "Failed to level up",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
