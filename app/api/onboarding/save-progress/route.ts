import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"

export async function POST(request: NextRequest) {
  try {
    const user = await getSession()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { currentStep, data } = await request.json()

    if (!currentStep || !data) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    await sql`
      UPDATE user_profiles
      SET
        onboarding_current_step = ${currentStep},
        onboarding_data = ${JSON.stringify(data)},
        onboarding_last_saved = CURRENT_TIMESTAMP
      WHERE user_id = ${user.id}
    `

    return NextResponse.json({
      success: true,
      message: "Progress saved successfully",
    })
  } catch (error) {
    console.error("[v0] Error saving onboarding progress:", error)
    return NextResponse.json({ error: "Failed to save progress" }, { status: 500 })
  }
}
