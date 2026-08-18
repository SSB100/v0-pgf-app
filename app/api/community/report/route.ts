import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.NEON_DATABASE_URL!)
const REPORT_REASONS = new Set(["harassment", "inappropriate", "spam", "abuse", "other"])

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await request.json()
    const groupId = typeof body.groupId === "string" ? body.groupId : ""
    const messageId = typeof body.messageId === "string" ? body.messageId : ""
    const reason = typeof body.reason === "string" ? body.reason : ""
    const description = typeof body.description === "string" ? body.description.trim().slice(0, 500) : null

    if (!groupId || !messageId || !REPORT_REASONS.has(reason)) {
      return NextResponse.json({ error: "Invalid report" }, { status: 400 })
    }

    const membership = await sql`
      SELECT id
      FROM group_memberships
      WHERE user_id = ${session.id}::uuid AND group_id = ${groupId}::uuid
      LIMIT 1
    `

    if (membership.length === 0) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    const reportedMessage = await sql`
      SELECT id, user_id
      FROM community_messages
      WHERE id = ${messageId}::uuid AND group_id = ${groupId}::uuid
      LIMIT 1
    `

    if (reportedMessage.length === 0) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 })
    }

    const reportedUserId = reportedMessage[0].user_id
    if (reportedUserId === session.id) {
      return NextResponse.json({ error: "You cannot report your own message" }, { status: 400 })
    }

    const duplicate = await sql`
      SELECT id
      FROM community_reports
      WHERE reporter_user_id = ${session.id}::uuid
        AND reported_message_id = ${messageId}::uuid
      LIMIT 1
    `

    if (duplicate.length > 0) {
      return NextResponse.json({ success: true, message: "Report already recorded." })
    }

    await sql`
      INSERT INTO community_reports (
        group_id,
        reporter_user_id,
        reported_user_id,
        reported_message_id,
        reason,
        description
      )
      VALUES (
        ${groupId}::uuid,
        ${session.id}::uuid,
        ${reportedUserId}::uuid,
        ${messageId}::uuid,
        ${reason},
        ${description}
      )
    `

    return NextResponse.json({ success: true, message: "Report recorded." })
  } catch (error) {
    console.error("[v0] Error recording community report:", error)
    return NextResponse.json({ error: "Failed to record report" }, { status: 500 })
  }
}
