import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getUserFromSession } from "@/lib/session"

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromSession()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const profile = await sql`
      SELECT sos_configured, sos_contact_number, sos_service_type
      FROM user_profiles
      WHERE user_id = ${user.id}
    `

    if (profile.length === 0) {
      return NextResponse.json({ configured: false })
    }

    return NextResponse.json({
      configured: profile[0].sos_configured || false,
      contactNumber: profile[0].sos_contact_number,
      serviceType: profile[0].sos_service_type,
    })
  } catch (error) {
    console.error("[v0] SOS config check error:", error)
    return NextResponse.json({ error: "Failed to check SOS configuration" }, { status: 500 })
  }
}
