import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { userId, currentStep, data } = await request.json()

    if (!userId || !currentStep) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Save progress to database
    await sql`
      UPDATE user_profiles
      SET 
        onboarding_current_step = ${currentStep},
        onboarding_data = ${JSON.stringify(data)},
        onboarding_last_saved = CURRENT_TIMESTAMP
      WHERE user_id = ${userId}
    `

    return NextResponse.json({
      success: true,
      message: "Progress saved successfully",
    })
  } catch (error) {
    console.error("[v0] Error saving onboarding progress:", error)
    return NextResponse.json(
      {
        error: "Failed to save progress",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
