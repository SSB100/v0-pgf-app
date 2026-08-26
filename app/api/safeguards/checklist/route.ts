import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import { sql } from "@/lib/db"
import { isGamblingProtectionKey } from "@/lib/gambling-protection-guide"

const MAX_CHECKLIST_BODY_CHARS = 512

function toStringList(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((item): item is string => typeof item === "string")
  if (typeof value !== "string") return []

  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : []
  } catch {
    return []
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getSession()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    if (user.role !== "client") return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    const rawBody = await request.text()
    if (rawBody.length > MAX_CHECKLIST_BODY_CHARS) {
      return NextResponse.json({ error: "Checklist update is too large" }, { status: 413 })
    }

    let body: unknown
    try {
      body = JSON.parse(rawBody)
    } catch {
      return NextResponse.json({ error: "Invalid checklist update" }, { status: 400 })
    }

    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid checklist update" }, { status: 400 })
    }

    const { safeguardKey, isActive } = body as { safeguardKey?: unknown; isActive?: unknown }
    if (!isGamblingProtectionKey(safeguardKey) || typeof isActive !== "boolean") {
      return NextResponse.json({ error: "Invalid safeguard status" }, { status: 400 })
    }

    const profileResult = await sql`
      SELECT journey_types
      FROM user_profiles
      WHERE user_id = ${user.id}
      LIMIT 1
    `
    const journeyTypes = toStringList(profileResult[0]?.journey_types)
    if (!journeyTypes.includes("gambling")) {
      return NextResponse.json({ error: "Gambling protection guide is not enabled for this account" }, { status: 403 })
    }

    const result = await sql`
      INSERT INTO user_safeguard_checklist (user_id, safeguard_key, is_active, updated_at)
      VALUES (${user.id}, ${safeguardKey}, ${isActive}, CURRENT_TIMESTAMP)
      ON CONFLICT (user_id, safeguard_key) DO UPDATE SET
        is_active = EXCLUDED.is_active,
        updated_at = CURRENT_TIMESTAMP
      RETURNING safeguard_key, is_active, updated_at
    `

    return NextResponse.json({
      success: true,
      safeguardKey: result[0]?.safeguard_key ?? safeguardKey,
      isActive: result[0]?.is_active === true,
      updatedAt: result[0]?.updated_at ?? null,
    })
  } catch (error) {
    console.error("Error updating safeguard checklist:", error)
    return NextResponse.json({ error: "Failed to update safeguard status" }, { status: 500 })
  }
}
