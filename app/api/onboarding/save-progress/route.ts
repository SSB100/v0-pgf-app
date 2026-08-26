import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { deleteSession, getSession } from "@/lib/session"

const MAX_ONBOARDING_DRAFT_BYTES = 100 * 1024

export async function POST(request: NextRequest) {
  try {
    const user = await getSession()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    if (user.role !== "client") return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    const { currentStep, data } = await request.json()

    if (!Number.isInteger(currentStep) || currentStep < 1 || currentStep > 50 || !data || typeof data !== "object") {
      return NextResponse.json({ error: "Invalid onboarding progress" }, { status: 400 })
    }

    const serializedData = JSON.stringify(data)
    if (Buffer.byteLength(serializedData, "utf8") > MAX_ONBOARDING_DRAFT_BYTES) {
      return NextResponse.json({ error: "Onboarding progress is too large to save" }, { status: 413 })
    }

    const updated = await sql`
      UPDATE user_profiles
      SET
        onboarding_current_step = ${currentStep},
        onboarding_data = ${serializedData}::jsonb,
        onboarding_last_saved = CURRENT_TIMESTAMP
      WHERE user_id = ${user.id}::uuid
        AND COALESCE(onboarding_completed, false) = false
      RETURNING user_id
    `

    if (updated.length === 0) {
      return NextResponse.json({ error: "Setup is already complete or unavailable" }, { status: 409 })
    }

    // "Save & Finish Later" is an explicit exit from the comprehensive setup.
    // End the current session only after the baseline draft has saved successfully.
    await deleteSession()

    return NextResponse.json({ success: true, message: "Progress saved" })
  } catch (error) {
    console.error("[v0] Error saving onboarding progress:", error)
    return NextResponse.json({ error: "Failed to save progress" }, { status: 500 })
  }
}
