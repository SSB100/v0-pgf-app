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

    const { aliasName } = await request.json()

    if (!aliasName || aliasName.trim().length === 0) {
      return NextResponse.json({ error: "Alias name is required" }, { status: 400 })
    }

    if (aliasName.length > 50) {
      return NextResponse.json({ error: "Alias name must be 50 characters or less" }, { status: 400 })
    }

    // Check if user already has a community profile
    const existingProfile = await sql`
      SELECT id FROM community_profiles WHERE user_id = ${session.id}::uuid
    `

    if (existingProfile && existingProfile.length > 0) {
      return NextResponse.json({ error: "You already have a community profile" }, { status: 400 })
    }

    // Create community profile
    const profileResult = await sql`
      INSERT INTO community_profiles (user_id, alias_name)
      VALUES (${session.id}::uuid, ${aliasName})
      RETURNING id, alias_name, created_at
    `

    if (!profileResult || profileResult.length === 0) {
      return NextResponse.json({ error: "Failed to create profile" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      profile: {
        id: profileResult[0].id,
        aliasName: profileResult[0].alias_name,
      },
    })
  } catch (error) {
    console.error("[v0] Error creating community profile:", error)
    return NextResponse.json({ error: "Failed to create profile" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const profile = await sql`
      SELECT id, alias_name FROM community_profiles WHERE user_id = ${session.id}::uuid
    `

    if (!profile || profile.length === 0) {
      return NextResponse.json({ profile: null })
    }

    return NextResponse.json({
      profile: {
        id: profile[0].id,
        aliasName: profile[0].alias_name,
      },
    })
  } catch (error) {
    console.error("[v0] Error fetching community profile:", error)
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
  }
}
