import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.NEON_DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { groupId, reportedUserId, messageId, reason, description } = await request.json()

    if (!groupId || !reportedUserId || !reason) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Prevent self-reporting
    if (reportedUserId === session.id) {
      return NextResponse.json({ error: "Cannot report yourself" }, { status: 400 })
    }

    // Create report
    await sql`
      INSERT INTO community_reports (group_id, reporter_user_id, reported_user_id, reported_message_id, reason, description)
      VALUES (
        ${groupId}::uuid,
        ${session.id}::uuid,
        ${reportedUserId}::uuid,
        ${messageId ? messageId : null}::uuid,
        ${reason},
        ${description || null}
      )
    `

    return NextResponse.json({
      success: true,
      message: "Report submitted. Thank you for helping keep our community safe.",
    })
  } catch (error) {
    console.error("[v0] Error submitting report:", error)
    return NextResponse.json({ error: "Failed to submit report" }, { status: 500 })
  }
}
