import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.NEON_DATABASE_URL!)

export async function GET(request: NextRequest, props: { params: Promise<{ groupId: string }> }) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { groupId } = await props.params

    // Verify user is member of this group
    const membership = await sql`
      SELECT id FROM group_memberships 
      WHERE user_id = ${session.id}::uuid AND group_id = ${groupId}::uuid
    `

    if (!membership || membership.length === 0) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    // Get messages - join community_profiles for alias, user_profiles for growth level
    // Note: users table has no profile_image column so we omit it
    const messages = await sql`
      SELECT 
        cm.id,
        cm.content,
        cm.created_at,
        cp.alias_name,
        up.tree_growth_level,
        up.growth_type
      FROM community_messages cm
      JOIN community_profiles cp ON cm.community_profile_id = cp.id
      LEFT JOIN user_profiles up ON cm.user_id = up.user_id
      WHERE cm.group_id = ${groupId}::uuid
      ORDER BY cm.created_at ASC
      LIMIT 100
    `

    return NextResponse.json({
      messages: (messages || []).map((msg: any) => ({
        id: msg.id,
        alias: msg.alias_name,
        content: msg.content,
        timestamp: msg.created_at,
        profileImage: null,
        growthLevel: msg.tree_growth_level,
        growthType: msg.growth_type,
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
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { groupId } = await props.params
    const { content } = await request.json()

    if (!content || content.trim().length === 0) {
      return NextResponse.json({ error: "Message content is required" }, { status: 400 })
    }

    if (content.length > 1000) {
      return NextResponse.json({ error: "Message too long (max 1000 characters)" }, { status: 400 })
    }

    // Verify user is member of this group
    const membership = await sql`
      SELECT community_profile_id FROM group_memberships 
      WHERE user_id = ${session.id}::uuid AND group_id = ${groupId}::uuid
    `

    if (!membership || membership.length === 0) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    const communityProfileId = membership[0].community_profile_id

    // Create message
    const messageResult = await sql`
      INSERT INTO community_messages (group_id, user_id, community_profile_id, content)
      VALUES (${groupId}::uuid, ${session.id}::uuid, ${communityProfileId}::uuid, ${content})
      RETURNING id, created_at
    `

    if (!messageResult || messageResult.length === 0) {
      return NextResponse.json({ error: "Failed to create message" }, { status: 500 })
    }

    const message = messageResult[0]

    // Update last active time
    await sql`
      UPDATE group_memberships 
      SET last_active_at = NOW()
      WHERE user_id = ${session.id}::uuid AND group_id = ${groupId}::uuid
    `

    return NextResponse.json({
      success: true,
      message: {
        id: message.id,
        timestamp: message.created_at,
      },
    })
  } catch (error) {
    console.error("[v0] Error sending message:", error)
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
  }
}
