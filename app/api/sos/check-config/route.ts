import { NextResponse } from "next/server"
import { getUserFromSession } from "@/lib/session"

export async function GET() {
  const user = await getUserFromSession()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  // Do not return previously stored contact details from the retired SOS feature.
  return NextResponse.json({
    configured: false,
    available: false,
    supportPath: "/support",
  })
}
