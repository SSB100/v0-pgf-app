import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"
import { addCalendarDays, getAotearoaDateKey } from "@/lib/aotearoa-date"

function toDateKey(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  return String(value).slice(0, 10)
}

export async function GET() {
  try {
    const user = await getSession()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const today = getAotearoaDateKey()
    const weekStart = addCalendarDays(today, -6)

    const result = await sql`
      SELECT date, mood_rating, overall_rating
      FROM daily_checkins
      WHERE user_id = ${user.id}::uuid
        AND date >= ${weekStart}::date
        AND date <= ${today}::date
      ORDER BY date ASC
    `

    return NextResponse.json({
      today,
      checkins: result.map((checkin: any) => ({
        date: toDateKey(checkin.date),
        moodRating: checkin.mood_rating ?? null,
        overallRating: checkin.overall_rating ?? null,
      })),
    })
  } catch (error) {
    console.error("[v0] Error loading weekly dashboard summary:", error)
    return NextResponse.json({ error: "Failed to load weekly dashboard summary" }, { status: 500 })
  }
}
