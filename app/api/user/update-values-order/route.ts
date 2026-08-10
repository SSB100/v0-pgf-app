import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getUserFromSession } from "@/lib/session"

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromSession()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { values } = await request.json()

    if (!values || !Array.isArray(values) || values.length === 0) {
      return NextResponse.json({ error: "Invalid values data" }, { status: 400 })
    }

    // Update each value's rank in a transaction
    for (const value of values) {
      await sql`
        UPDATE user_values
        SET rank = ${value.rank}
        WHERE user_id = ${user.id} AND value_name = ${value.value_name}
      `
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating values order:", error)
    return NextResponse.json({ error: "Failed to update values order" }, { status: 500 })
  }
}
