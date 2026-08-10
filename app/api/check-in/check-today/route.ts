import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const result = await sql`
      SELECT id FROM daily_checkins
      WHERE user_id = ${userId}::uuid AND date = CURRENT_DATE
      LIMIT 1
    `

    const completed = result && result.length > 0

    return NextResponse.json({ completed })
  } catch (error) {
    console.error("[v0] Error checking daily check-in:", error)
    return NextResponse.json({ error: "Failed to check check-in status" }, { status: 500 })
  }
}
