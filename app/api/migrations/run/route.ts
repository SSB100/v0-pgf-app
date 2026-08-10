import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    const sql = neon(process.env.NEON_DATABASE_URL!)

    // Run migration 004: Add gambling tracking columns
    await sql`
      ALTER TABLE problem_areas 
      ADD COLUMN IF NOT EXISTS last_bet_date DATE,
      ADD COLUMN IF NOT EXISTS gambling_forms JSONB,
      ADD COLUMN IF NOT EXISTS most_used_forms JSONB,
      ADD COLUMN IF NOT EXISTS illegal_gambling VARCHAR(10)
    `

    await sql`
      CREATE INDEX IF NOT EXISTS idx_problem_areas_last_bet_date 
      ON problem_areas(last_bet_date DESC)
    `

    return NextResponse.json({
      success: true,
      message: "Migration 004 completed successfully",
    })
  } catch (error) {
    console.error("[v0] Migration error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
