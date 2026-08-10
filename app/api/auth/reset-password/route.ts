import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { hashPassword } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json()

    if (!token || !password) {
      return NextResponse.json({ error: "Token and password are required" }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters long" }, { status: 400 })
    }

    // Verify token and get user ID
    const tokenData = await sql`
      SELECT user_id, expires_at 
      FROM password_reset_tokens 
      WHERE token = ${token} AND used = false
    `

    if (!tokenData || tokenData.length === 0) {
      return NextResponse.json({ error: "Invalid or expired reset token" }, { status: 400 })
    }

    const { user_id, expires_at } = tokenData[0]

    // Check if token is expired
    if (new Date(expires_at) < new Date()) {
      return NextResponse.json({ error: "Reset token has expired" }, { status: 400 })
    }

    // Hash the new password
    const passwordHash = await hashPassword(password)

    // Update user password
    await sql`
      UPDATE users 
      SET password_hash = ${passwordHash}, updated_at = NOW()
      WHERE id = ${user_id}
    `

    // Mark token as used
    await sql`
      UPDATE password_reset_tokens 
      SET used = true 
      WHERE token = ${token}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Reset password error:", error)
    return NextResponse.json({ error: "An error occurred" }, { status: 500 })
  }
}
