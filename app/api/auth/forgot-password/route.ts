import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import crypto from "crypto"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Check if user exists
    const users = await sql`
      SELECT id FROM users WHERE email = ${email}
    `

    // Always return success to prevent email enumeration
    if (!users || users.length === 0) {
      return NextResponse.json({ success: true })
    }

    const userId = users[0].id

    // Generate secure random token
    const token = crypto.randomBytes(32).toString("hex")
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    // Store token in database
    await sql`
      INSERT INTO password_reset_tokens (user_id, token, expires_at)
      VALUES (${userId}, ${token}, ${expiresAt})
    `

    // In a production app, send email here
    // For now, we'll just log the reset URL
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/reset-password?token=${token}`
    console.log("[v0] Password reset URL:", resetUrl)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Forgot password error:", error)
    return NextResponse.json({ error: "An error occurred" }, { status: 500 })
  }
}
