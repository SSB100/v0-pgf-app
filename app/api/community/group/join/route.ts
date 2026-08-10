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

    const { journeyType } = await request.json()

    if (!journeyType) {
      return NextResponse.json({ error: "Journey type is required" }, { status: 400 })
    }

    // Get or create group for this journey type
    let groupQuery = await sql`
      SELECT id FROM community_groups WHERE journey_type = ${journeyType}
    `

    let groupId: string

    if (!groupQuery || groupQuery.length === 0) {
      const newGroupResult = await sql`
        INSERT INTO community_groups (journey_type, name, description)
        VALUES (
          ${journeyType},
          ${journeyType.charAt(0).toUpperCase() + journeyType.slice(1)} Support Group,
          'Support group for those on the ' + ${journeyType} + ' recovery journey'
        )
        RETURNING id
      `
      groupId = newGroupResult[0].id
    } else {
      groupId = groupQuery[0].id
    }

    // Check if user already in this group
    const existing = await sql`
      SELECT id FROM group_memberships 
      WHERE user_id = ${session.id}::uuid AND group_id = ${groupId}::uuid
    `

    if (existing && existing.length > 0) {
      return NextResponse.json({ groupId }, { status: 200 })
    }

    // Get user's community profile
    const profileQuery = await sql`
      SELECT id FROM community_profiles WHERE user_id = ${session.id}::uuid
    `

    if (!profileQuery || profileQuery.length === 0) {
      return NextResponse.json({ error: "Community profile not found" }, { status: 400 })
    }

    const profileId = profileQuery[0].id

    // Create group membership
    await sql`
      INSERT INTO group_memberships (user_id, group_id, community_profile_id)
      VALUES (${session.id}::uuid, ${groupId}::uuid, ${profileId}::uuid)
    `

    return NextResponse.json({
      success: true,
      groupId,
    })
  } catch (error) {
    console.error("[v0] Error joining group:", error)
    return NextResponse.json({ error: "Failed to join group" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const membership = await sql`
      SELECT gm.group_id, cg.journey_type 
      FROM group_memberships gm
      JOIN community_groups cg ON gm.group_id = cg.id
      WHERE gm.user_id = ${session.id}::uuid
      LIMIT 1
    `

    if (!membership || membership.length === 0) {
      return NextResponse.json({ membership: null })
    }

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
