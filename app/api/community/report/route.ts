import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.NEON_DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { groupId, messageId, reason, description } = await request.json()

    if (!groupId || !messageId || !reason) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const membership = await sql`
      SELECT id
      FROM group_memberships
      WHERE user_id = ${session.id}::uuid AND group_id = ${groupId}::uuid
      LIMIT 1
    `

    if (!membership.length) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    const reportedMessage = await sql`
      SELECT id, user_id
      FROM community_messages
      WHERE id = ${messageId}::uuid AND group_id = ${groupId}::uuid
      LIMIT 1
    `

    if (!reportedMessage.length) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 })
    }

    const reportedUserId = reportedMessage[0].user_id

    if (reportedUserId === session.id) {
      return NextResponse.json({ error: "You cannot report your own message" }, { status: 400 })
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
        ${description || null}
      )
    `

    return NextResponse.json({ success: true, message: "Report recorded." })
  } catch (error) {
    console.error("[v0] Error recording community report:", error)
    return NextResponse.json({ error: "Failed to record report" }, { status: 500 })
  }
}
