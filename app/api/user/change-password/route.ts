import { type NextRequest, NextResponse } from "next/server"
import { createSession, getSessionContext } from "@/lib/session"
import { sql } from "@/lib/db"
import { hashPassword, verifyPassword } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const session = await getSessionContext()
    const user = session.user
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { currentPassword, newPassword } = await request.json()

    if (typeof currentPassword !== "string" || typeof newPassword !== "string") {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (newPassword.length < 8 || newPassword.length > 128) {
      return NextResponse.json({ error: "New password must be between 8 and 128 characters" }, { status: 400 })
    }

    const userResult = await sql`
      SELECT password_hash FROM users WHERE id = ${user.id}
    `

    if (userResult.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const isValid = await verifyPassword(currentPassword, userResult[0].password_hash)
    if (!isValid) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 })
    }

    const newPasswordHash = await hashPassword(newPassword)

    const updated = await sql`
      UPDATE users
      SET
        password_hash = ${newPasswordHash},
        security_version = COALESCE(security_version, 1) + 1,
        updated_at = NOW()
      WHERE id = ${user.id}
      RETURNING security_version
    `

    if (updated.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Rotate the caller onto the new security version immediately. All other
    // sessions were issued against the previous version and will fail closed.
    await createSession(user.id, { mfaVerified: session.mfaVerified })

    return NextResponse.json({ success: true, sessionsRevoked: true })
  } catch (error) {
    console.error("[v0] Change password error:", error)
    return NextResponse.json({ error: "Failed to change password" }, { status: 500 })
  }
}
