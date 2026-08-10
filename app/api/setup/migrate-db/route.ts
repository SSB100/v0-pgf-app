import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Starting database migration...")

    // Add missing columns to problem_areas table
    await sql`
      ALTER TABLE problem_areas 
      ADD COLUMN IF NOT EXISTS last_bet_date DATE,
      ADD COLUMN IF NOT EXISTS gambling_forms JSONB DEFAULT '[]'::jsonb,
      ADD COLUMN IF NOT EXISTS most_used_forms JSONB DEFAULT '[]'::jsonb,
      ADD COLUMN IF NOT EXISTS illegal_gambling VARCHAR(50)
    `
    console.log("[v0] Added gambling columns to problem_areas")

    // Add missing columns to user_profiles table
    await sql`
      ALTER TABLE user_profiles 
      ADD COLUMN IF NOT EXISTS choice_points JSONB DEFAULT '[]'::jsonb,
      ADD COLUMN IF NOT EXISTS perceived_strengths JSONB DEFAULT '[]'::jsonb,
      ADD COLUMN IF NOT EXISTS identified_strengths JSONB DEFAULT '[]'::jsonb,
      ADD COLUMN IF NOT EXISTS strengths_completed BOOLEAN DEFAULT false,
      ADD COLUMN IF NOT EXISTS self_harm_thoughts VARCHAR(50),
      ADD COLUMN IF NOT EXISTS self_harm_actions VARCHAR(50),
      ADD COLUMN IF NOT EXISTS suicidal_thoughts VARCHAR(50),
      ADD COLUMN IF NOT EXISTS alcohol_use VARCHAR(50),
      ADD COLUMN IF NOT EXISTS drug_use VARCHAR(50),
      ADD COLUMN IF NOT EXISTS substance_gambling_link VARCHAR(50),
      ADD COLUMN IF NOT EXISTS substance_mental_health_link VARCHAR(50),
      ADD COLUMN IF NOT EXISTS plays_video_games BOOLEAN,
      ADD COLUMN IF NOT EXISTS gaming_frequency VARCHAR(50),
      ADD COLUMN IF NOT EXISTS gaming_impact VARCHAR(50),
      ADD COLUMN IF NOT EXISTS loot_box_exposure VARCHAR(50),
      ADD COLUMN IF NOT EXISTS in_game_purchases VARCHAR(50)
    `
    console.log("[v0] Added wellbeing columns to user_profiles")

    // Add rank column to user_values table
    await sql`
      ALTER TABLE user_values 
      ADD COLUMN IF NOT EXISTS rank INTEGER DEFAULT 0
    `
    console.log("[v0] Added rank column to user_values")

    return NextResponse.json({
      success: true,
      message: "Database migration completed successfully",
    })
  } catch (error) {
    console.error("[v0] Migration error:", error)
    return NextResponse.json(
      {
        error: "Migration failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
