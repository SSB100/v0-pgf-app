import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"
import { getAotearoaDateKey } from "@/lib/aotearoa-date"

export async function GET() {
  try {
    const user = await getSession()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const today = getAotearoaDateKey()
    const result = await sql`
      SELECT mood_rating, overall_rating
      FROM daily_checkins
      WHERE user_id = ${user.id}::uuid AND date = ${today}::date
      LIMIT 1
    `

    const checkin = result[0] || null

    return NextResponse.json({
      completed: Boolean(checkin),
      date: today,
      moodRating: checkin?.mood_rating ?? null,
      overallRating: checkin?.overall_rating ?? null,
    })
  } catch (error) {
    console.error("[v0] Error checking daily check-in:", error)
    return NextResponse.json({ error: "Failed to check check-in status" }, { status: 500 })
  }
}
