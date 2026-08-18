import { NextResponse } from "next/server"

export async function POST() {
  // Email delivery is not configured in the current MVP. Do not generate or log
  // password-reset tokens until there is a verified delivery channel and token
  // storage/rotation process.
  return NextResponse.json(
    { error: "Password reset by email is not available in the current Waypoint MVP." },
    { status: 503 },
  )
}
