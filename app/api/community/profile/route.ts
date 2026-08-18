import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.NEON_DATABASE_URL!)
const RESERVED_ALIAS_TERMS = ["admin", "moderator", "waypoint", "counsellor", "counselor", "clinician", "1737", "gambling helpline", "pgf"]

function validateAlias(value: unknown) {
  if (typeof value !== "string") return { error: "Alias name is required" } as const
  const alias = value.trim().replace(/\s+/g, " ")

  if (alias.length < 2 || alias.length > 30) {
    return { error: "Alias name must be between 2 and 30 characters" } as const
  }

  if (!/^[\p{L}\p{N} _-]+$/u.test(alias)) {
    return { error: "Alias can contain letters, numbers, spaces, hyphens and underscores" } as const
  }

  const lowered = alias.toLowerCase()
  if (RESERVED_ALIAS_TERMS.some((term) => lowered === term || lowered.startsWith(`${term} `))) {
    return { error: "Please choose an alias that cannot be mistaken for Waypoint staff or a support service" } as const
  }

  return { alias } as const
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await request.json()
    const validated = validateAlias(body.aliasName)
    if ("error" in validated) return NextResponse.json({ error: validated.error }, { status: 400 })
    const aliasName = validated.alias

    const existingProfile = await sql`
      SELECT id FROM community_profiles WHERE user_id = ${session.id}::uuid
      LIMIT 1
    `

    if (existingProfile.length > 0) {
      return NextResponse.json({ error: "You already have a community profile" }, { status: 400 })
    }

    const aliasInUse = await sql`
      SELECT id FROM community_profiles
      WHERE LOWER(alias_name) = LOWER(${aliasName})
      LIMIT 1
    `

    if (aliasInUse.length > 0) {
      return NextResponse.json({ error: "That alias is already in use" }, { status: 409 })
    }

    const profileResult = await sql`
      INSERT INTO community_profiles (user_id, alias_name)
      VALUES (${session.id}::uuid, ${aliasName})
      RETURNING id, alias_name
    `

    if (profileResult.length === 0) {
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

export async function GET() {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const profile = await sql`
      SELECT id, alias_name FROM community_profiles
      WHERE user_id = ${session.id}::uuid
      LIMIT 1
    `

    if (profile.length === 0) return NextResponse.json({ profile: null })

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
