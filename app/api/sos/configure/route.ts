import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getUserFromSession } from "@/lib/session"

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromSession()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { contactNumber, serviceType } = await request.json()

    if (!contactNumber || !serviceType) {
      return NextResponse.json({ error: "Contact number and service type are required" }, { status: 400 })
    }

    await sql`
      UPDATE user_profiles
      SET 
        sos_contact_number = ${contactNumber},
        sos_service_type = ${serviceType},
        sos_configured = true,
        updated_at = NOW()
      WHERE user_id = ${user.id}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] SOS configuration error:", error)
    return NextResponse.json({ error: "Failed to configure SOS" }, { status: 500 })
  }
}
