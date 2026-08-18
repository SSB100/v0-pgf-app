import { NextResponse } from "next/server"
import { getUserFromSession } from "@/lib/session"

export async function POST() {
  const user = await getUserFromSession()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  return NextResponse.json(
    {
      error: "The previous SOS alert feature is disabled because Waypoint is not a monitored emergency-response service.",
      supportPath: "/support",
    },
    { status: 410 },
  )
}
