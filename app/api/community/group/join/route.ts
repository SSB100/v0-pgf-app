import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import { neon } from "@neondatabase/serverless"
import { communityGroupDescription, communityGroupName, isCommunityJourneyType } from "@/lib/community"

const sql = neon(process.env.NEON_DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { journeyType } = await request.json()
    if (!isCommunityJourneyType(journeyType)) {
      return NextResponse.json({ error: "Invalid community group type" }, { status: 400 })
    }

    let groupQuery = await sql`
      SELECT id FROM community_groups WHERE journey_type = ${journeyType}
      LIMIT 1
    `

    let groupId: string
    if (groupQuery.length === 0) {
      const newGroupResult = await sql`
        INSERT INTO community_groups (journey_type, name, description)
        VALUES (
          ${journeyType},
          ${communityGroupName(journeyType)},
          ${communityGroupDescription(journeyType)}
        )
        RETURNING id
      `
      groupId = newGroupResult[0].id
    } else {
      groupId = groupQuery[0].id
    }

    const profileQuery = await sql`
      SELECT id FROM community_profiles WHERE user_id = ${session.id}::uuid
      LIMIT 1
    `

    if (profileQuery.length === 0) {
      return NextResponse.json({ error: "Community profile not found" }, { status: 400 })
    }

    // A user has one active peer-group membership in the current MVP. Derive
    // that state server-side rather than trusting a group identifier from the client.
    await sql`
      DELETE FROM group_memberships
      WHERE user_id = ${session.id}::uuid AND group_id <> ${groupId}::uuid
    `

    await sql`
      INSERT INTO group_memberships (user_id, group_id, community_profile_id)
      VALUES (${session.id}::uuid, ${groupId}::uuid, ${profileQuery[0].id}::uuid)
      ON CONFLICT (user_id, group_id) DO NOTHING
    `

    return NextResponse.json({ success: true, groupId })
  } catch (error) {
    console.error("[v0] Error joining group:", error)
    return NextResponse.json({ error: "Failed to join group" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const membership = await sql`
      SELECT gm.group_id, cg.journey_type
      FROM group_memberships gm
      JOIN community_groups cg ON gm.group_id = cg.id
      WHERE gm.user_id = ${session.id}::uuid
      ORDER BY gm.last_active_at DESC NULLS LAST, gm.joined_at DESC
      LIMIT 1
    `

    if (membership.length === 0) return NextResponse.json({ membership: null })

    return NextResponse.json({
      membership: {
        groupId: membership[0].group_id,
        journeyType: membership[0].journey_type,
      },
    })
  } catch (error) {
    console.error("[v0] Error fetching membership:", error)
    return NextResponse.json({ error: "Failed to fetch membership" }, { status: 500 })
  }
}
