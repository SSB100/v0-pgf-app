import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.NEON_DATABASE_URL!)

export async function POST() {
  try {
    console.log("[v0] Starting onboarding credits migration...")

    // Award 1 level credit to users who completed onboarding but don't have credits
    const result = await sql`
      UPDATE user_profiles
      SET level_credits = 1
      WHERE onboarding_completed = true
        AND (level_credits IS NULL OR level_credits = 0)
      RETURNING id, name, level_credits
    `

    console.log("[v0] Credits awarded to users:", result)

    return NextResponse.json({
      success: true,
      message: `Successfully awarded credits to ${result.length} user(s)`,
      users: result,
    })
  } catch (error) {
    console.error("[v0] Error awarding credits:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to award credits",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
