import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getUserFromSession } from "@/lib/session"

const MAX_VALUES = 50

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromSession()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await request.json()
    const values = body.values

    if (!Array.isArray(values) || values.length === 0 || values.length > MAX_VALUES) {
      return NextResponse.json({ error: "Invalid values data" }, { status: 400 })
    }

    const normalized = values.map((value, index) => ({
      valueName: typeof value?.value_name === "string" ? value.value_name.trim() : "",
      rank: Number.isInteger(value?.rank) ? value.rank : index + 1,
    }))

    if (
      normalized.some((value) => !value.valueName || value.valueName.length > 100 || value.rank < 1 || value.rank > MAX_VALUES) ||
      new Set(normalized.map((value) => value.valueName.toLowerCase())).size !== normalized.length ||
      new Set(normalized.map((value) => value.rank)).size !== normalized.length
    ) {
      return NextResponse.json({ error: "Invalid values order" }, { status: 400 })
    }

    for (const value of normalized) {
      await sql`
        UPDATE user_values
        SET rank = ${value.rank}
        WHERE user_id = ${user.id} AND value_name = ${value.valueName}
      `
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating values order:", error)
    return NextResponse.json({ error: "Failed to update values order" }, { status: 500 })
  }
}
