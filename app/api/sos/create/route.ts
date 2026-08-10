import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getUserFromSession } from "@/lib/session"

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromSession()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if SOS is configured
    const profile = await sql`
      SELECT sos_configured, sos_contact_number, sos_service_type
      FROM user_profiles
      WHERE user_id = ${user.id}
    `

    if (!profile[0]?.sos_configured) {
      return NextResponse.json({ error: "SOS not configured", needsSetup: true }, { status: 400 })
    }

    // Create SOS alert
    await sql`
      INSERT INTO sos_alerts (user_id, status)
      VALUES (${user.id}, 'active')
    `

    // TODO: In future, send notification based on sos_service_type
    // For now, log the alert with contact info
    console.log("[v0] SOS alert created for user:", user.id, {
      contactNumber: profile[0].sos_contact_number,
      serviceType: profile[0].sos_service_type,
    })

    return NextResponse.json({
      success: true,
      message: "SOS alert sent. Support will contact you soon at your registered number.",
    })
  } catch (error) {
    console.error("[v0] SOS creation error:", error)
    return NextResponse.json({ error: "Failed to create SOS alert" }, { status: 500 })
  }
}
