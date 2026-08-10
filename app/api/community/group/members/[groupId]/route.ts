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

    // Get group members - no profile_image on users table, use user_profiles for growth
    const members = await sql`
      SELECT 
        gm.user_id,
        cp.alias_name,
        up.tree_growth_level,
        up.growth_type,
        gm.joined_at,
        gm.last_active_at
      FROM group_memberships gm
      JOIN community_profiles cp ON gm.community_profile_id = cp.id
      LEFT JOIN user_profiles up ON gm.user_id = up.user_id
      WHERE gm.group_id = ${groupId}::uuid
      ORDER BY gm.last_active_at DESC
    `

    return NextResponse.json({
      members: (members || []).map((member: any) => ({
        userId: member.user_id,
        alias: member.alias_name,
        profileImage: null,
        growthLevel: member.tree_growth_level,
        growthType: member.growth_type,
        joinedAt: member.joined_at,
        lastActive: member.last_active_at,
      })),
    })
  } catch (error) {
    console.error("[v0] Error fetching members:", error)
    return NextResponse.json({ error: "Failed to fetch members" }, { status: 500 })
  }
}
