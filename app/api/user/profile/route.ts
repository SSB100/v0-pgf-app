import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import { sql } from "@/lib/db"

export async function GET(_request: NextRequest) {
  try {
    const user = await getSession()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const profile = await sql`
      SELECT * FROM user_profiles WHERE user_id = ${user.id}
    `

    if (profile.length === 0) {
      return NextResponse.json({
        user_id: user.id,
        onboarding_completed: false,
      })
    }

    return NextResponse.json(profile[0])
  } catch (error) {
    console.error("[v0] Get profile error:", error)
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
  }
}
