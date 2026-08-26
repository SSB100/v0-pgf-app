import { NextResponse } from "next/server"

const NO_STORE_HEADERS = { "Cache-Control": "no-store" }

export async function POST() {
  return NextResponse.json(
    {
      error: "The minimum onboarding flow has been retired. Complete the full Waypoint baseline onboarding instead.",
      code: "FULL_BASELINE_ONBOARDING_REQUIRED",
    },
    { status: 410, headers: NO_STORE_HEADERS },
  )
}
