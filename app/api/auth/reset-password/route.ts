import { NextResponse } from "next/server"

export async function POST() {
  // The previous MVP reset flow stored raw tokens and had no verified email
  // delivery channel. Keep password reset disabled until a production-grade
  // recovery flow is implemented end to end.
  return NextResponse.json(
    { error: "Password reset is not available in the current Waypoint MVP." },
    { status: 503 },
  )
}
