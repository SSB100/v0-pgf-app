import { NextResponse } from "next/server"

export async function POST() {
  // Database migrations must not be exposed as public application endpoints.
  // Keep this route inert until migration work is moved to a controlled
  // deployment/admin process outside the user-facing app.
  return NextResponse.json({ error: "Not found" }, { status: 404 })
}
