import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.NEON_DATABASE_URL!)

export async function GET(_request: NextRequest, props: { params: Promise<{ groupId: string }> }) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { groupId } = await props.params

    const membership = await sql`
      SELECT id FROM group_memberships
      WHERE user_id = ${session.id}::uuid AND group_id = ${groupId}::uuid
      LIMIT 1
    `

    if (membership.length === 0) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    const messages = await sql`
      SELECT
        cm.id,
        cm.content,
        cm.created_at,
        cp.alias_name
      FROM community_messages cm
      JOIN community_profiles cp ON cm.community_profile_id = cp.id
      WHERE cm.group_id = ${groupId}::uuid
      ORDER BY cm.created_at ASC
      LIMIT 100
    `

    return NextResponse.json({
      messages: messages.map((message: any) => ({
        id: message.id,
        alias: message.alias_name,
        content: message.content,
        timestamp: message.created_at,
        profileImage: null,
      })),
    })
  } catch (error) {
    console.error("[v0] Error fetching messages:", error)
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, props: { params: Promise<{ groupId: string }> }) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { groupId } = await props.params
    const body = await request.json()
    const content = typeof body.content === "string" ? body.content.trim() : ""

    if (!content) {
      return NextResponse.json({ error: "Message content is required" }, { status: 400 })
    }

    if (content.length > 1000) {
      return NextResponse.json({ error: "Message too long (max 1000 characters)" }, { status: 400 })
    }

    const membership = await sql`
      SELECT community_profile_id FROM group_memberships
      WHERE user_id = ${session.id}::uuid AND group_id = ${groupId}::uuid
      LIMIT 1
    `

    if (membership.length === 0) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    const communityProfileId = membership[0].community_profile_id
    const messageResult = await sql`
      INSERT INTO community_messages (group_id, user_id, community_profile_id, content)
      VALUES (${groupId}::uuid, ${session.id}::uuid, ${communityProfileId}::uuid, ${content})
      RETURNING id, created_at
    `

    if (messageResult.length === 0) {
      return NextResponse.json({ error: "Failed to create message" }, { status: 500 })
    }

    await sql`
      UPDATE group_memberships
      SET last_active_at = NOW()
      WHERE user_id = ${session.id}::uuid AND group_id = ${groupId}::uuid
    `

    return NextResponse.json({
      success: true,
      message: {
        id: messageResult[0].id,
        timestamp: messageResult[0].created_at,
      },
    })
  } catch (error) {
    console.error("[v0] Error sending message:", error)
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
  }
}
