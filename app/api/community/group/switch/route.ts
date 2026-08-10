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

    const { currentGroupId, newJourneyType, reason } = await request.json()

    if (!newJourneyType) {
      return NextResponse.json({ error: "New journey type is required" }, { status: 400 })
    }

    // Get or create group for new journey type
    let newGroup = await sql`
      SELECT id FROM community_groups WHERE journey_type = ${newJourneyType}
    `

    if (!newGroup || newGroup.length === 0) {
      const [createdGroup] = await sql`
        INSERT INTO community_groups (journey_type, name, description)
        VALUES (
          ${newJourneyType},
          ${newJourneyType.charAt(0).toUpperCase() + newJourneyType.slice(1)} Support Group,
          'Support group for those on the ' + ${newJourneyType} + ' recovery journey'
        )
        RETURNING id
      `
      newGroup = [{ id: createdGroup.id }]
    }

    const newGroupId = newGroup[0].id

    // Get user's community profile
    const [profile] = await sql`
      SELECT id FROM community_profiles WHERE user_id = ${session.id}::uuid
    `

    if (!profile) {
      return NextResponse.json({ error: "Community profile not found" }, { status: 400 })
    }

    // Record reason for switching
    if (currentGroupId) {
      await sql`
        INSERT INTO group_switch_reasons (user_id, from_group_id, to_group_id, reason)
        VALUES (${session.id}::uuid, ${currentGroupId}::uuid, ${newGroupId}::uuid, ${reason || null})
      `

      // Leave current group
      await sql`
        DELETE FROM group_memberships 
        WHERE user_id = ${session.id}::uuid AND group_id = ${currentGroupId}::uuid
      `
    }

    // Join new group
    await sql`
      INSERT INTO group_memberships (user_id, group_id, community_profile_id)
      VALUES (${session.id}::uuid, ${newGroupId}::uuid, ${profile.id}::uuid)
      ON CONFLICT (user_id, group_id) DO NOTHING
    `

    return NextResponse.json({
      success: true,
      groupId: newGroupId,
    })
  } catch (error) {
    console.error("[v0] Error switching group:", error)
    return NextResponse.json({ error: "Failed to switch group" }, { status: 500 })
  }
}
