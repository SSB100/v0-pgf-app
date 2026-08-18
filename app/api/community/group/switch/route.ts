import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import { neon } from "@neondatabase/serverless"
import { communityGroupDescription, communityGroupName, isCommunityJourneyType } from "@/lib/community"

const sql = neon(process.env.NEON_DATABASE_URL!)
const MAX_REASON_LENGTH = 500

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await request.json()
    const newJourneyType = body.newJourneyType
    const reason = typeof body.reason === "string" ? body.reason.trim().slice(0, MAX_REASON_LENGTH) : null

    if (!isCommunityJourneyType(newJourneyType)) {
      return NextResponse.json({ error: "Invalid community group type" }, { status: 400 })
    }

    let newGroup = await sql`
      SELECT id FROM community_groups WHERE journey_type = ${newJourneyType}
      LIMIT 1
    `

    if (newGroup.length === 0) {
      const created = await sql`
        INSERT INTO community_groups (journey_type, name, description)
        VALUES (
          ${newJourneyType},
          ${communityGroupName(newJourneyType)},
          ${communityGroupDescription(newJourneyType)}
        )
        RETURNING id
      `
      newGroup = [{ id: created[0].id }]
    }

    const newGroupId = newGroup[0].id

    const profile = await sql`
      SELECT id FROM community_profiles WHERE user_id = ${session.id}::uuid
      LIMIT 1
    `

    if (profile.length === 0) {
      return NextResponse.json({ error: "Community profile not found" }, { status: 400 })
    }

    const currentMembership = await sql`
      SELECT group_id
      FROM group_memberships
      WHERE user_id = ${session.id}::uuid
      ORDER BY last_active_at DESC NULLS LAST, joined_at DESC
      LIMIT 1
    `

    const currentGroupId = currentMembership[0]?.group_id || null

    if (currentGroupId && currentGroupId !== newGroupId) {
      await sql`
        INSERT INTO group_switch_reasons (user_id, from_group_id, to_group_id, reason)
        VALUES (${session.id}::uuid, ${currentGroupId}::uuid, ${newGroupId}::uuid, ${reason || null})
      `
    }

    await sql`
      DELETE FROM group_memberships
      WHERE user_id = ${session.id}::uuid AND group_id <> ${newGroupId}::uuid
    `

    await sql`
      INSERT INTO group_memberships (user_id, group_id, community_profile_id)
      VALUES (${session.id}::uuid, ${newGroupId}::uuid, ${profile[0].id}::uuid)
      ON CONFLICT (user_id, group_id) DO NOTHING
    `

    return NextResponse.json({ success: true, groupId: newGroupId })
  } catch (error) {
    console.error("[v0] Error switching group:", error)
    return NextResponse.json({ error: "Failed to switch group" }, { status: 500 })
  }
}
