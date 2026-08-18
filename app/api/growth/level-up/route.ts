import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"

export async function POST() {
  try {
    const user = await getSession()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    // Spend and apply the credit in one database statement so two concurrent
    // requests cannot both spend the same credit.
    const updated = await sql`
      UPDATE user_profiles
      SET
        tree_growth_level = COALESCE(tree_growth_level, 0) + 1,
        level_credits = level_credits - 1,
        updated_at = NOW()
      WHERE user_id = ${user.id}
        AND COALESCE(level_credits, 0) > 0
      RETURNING tree_growth_level, level_credits
    `

    if (updated.length === 0) {
      const profile = await sql`
        SELECT id FROM user_profiles WHERE user_id = ${user.id} LIMIT 1
      `
      if (profile.length === 0) return NextResponse.json({ error: "Profile not found" }, { status: 404 })
      return NextResponse.json({ error: "No credits available to apply" }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      newLevel: updated[0].tree_growth_level,
      remainingCredits: updated[0].level_credits,
    })
  } catch (error) {
    console.error("[v0] Growth credit error:", error)
    return NextResponse.json({ error: "Failed to apply growth credit" }, { status: 500 })
  }
}
