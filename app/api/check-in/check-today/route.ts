import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"

export async function GET() {
  try {
    const user = await getSession()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const result = await sql`
      SELECT id FROM daily_checkins
      WHERE user_id = ${user.id}::uuid AND date = CURRENT_DATE
      LIMIT 1
    `

    return NextResponse.json({ completed: result.length > 0 })
  } catch (error) {
    console.error("[v0] Error checking daily check-in:", error)
    return NextResponse.json({ error: "Failed to check check-in status" }, { status: 500 })
  }
}
