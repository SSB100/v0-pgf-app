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

    const members = await sql`
      SELECT cp.alias_name
      FROM group_memberships gm
      JOIN community_profiles cp ON gm.community_profile_id = cp.id
      WHERE gm.group_id = ${groupId}::uuid
      ORDER BY cp.alias_name ASC
      LIMIT 100
    `

    return NextResponse.json({
      members: members.map((member: any) => ({
        alias: member.alias_name,
        profileImage: null,
      })),
    })
  } catch (error) {
    console.error("[v0] Error fetching members:", error)
    return NextResponse.json({ error: "Failed to fetch members" }, { status: 500 })
  }
}
