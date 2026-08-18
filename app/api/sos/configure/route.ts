import { NextResponse } from "next/server"
import { getUserFromSession } from "@/lib/session"

export async function POST() {
  const user = await getUserFromSession()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  return NextResponse.json(
    {
      error: "SOS contact configuration is disabled in the current Waypoint MVP because Waypoint is not a monitored alert service.",
      supportPath: "/support",
    },
    { status: 410 },
  )
}
