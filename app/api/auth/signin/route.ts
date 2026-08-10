import { type NextRequest, NextResponse } from "next/server"
import { getUserByEmail, verifyPassword, hashPassword } from "@/lib/auth"
import { encrypt } from "@/lib/session"
import { sql } from "@/lib/db"
import { v4 as uuidv4 } from "uuid"

// Hardcoded test credentials
const TEST_EMAIL = "test@test.com"
const TEST_PASSWORD = "12345678"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Sign in attempt starting")
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Handle hardcoded test login - always goes through onboarding
    if (email === TEST_EMAIL && password === TEST_PASSWORD) {
      console.log("[v0] Test login detected")
      
      // Check if test user exists, create if not
      let testUser = await getUserByEmail(TEST_EMAIL)
      
      if (!testUser) {
        // Create test user
        const hashedPassword = await hashPassword(TEST_PASSWORD)
        const userId = uuidv4()
        
        await sql`
          INSERT INTO users (id, email, password_hash, full_name, created_at, updated_at)
          VALUES (${userId}, ${TEST_EMAIL}, ${hashedPassword}, 'Test User', NOW(), NOW())
        `
        
        testUser = { id: userId, email: TEST_EMAIL, full_name: "Test User", password_hash: hashedPassword }
      }
      
      // Reset onboarding status for test user - always start fresh
      await sql`
        DELETE FROM user_profiles WHERE user_id = ${testUser.id}
      `
      
      // Delete any existing problem areas for fresh start
      await sql`
        DELETE FROM problem_areas WHERE user_id = ${testUser.id}
      `
      
      // Delete any existing daily checkins for fresh start
      await sql`
        DELETE FROM daily_checkins WHERE user_id = ${testUser.id}
      `
      
      const token = await encrypt({ userId: testUser.id })
      
      const response = NextResponse.json({
        success: true,
        user: { id: testUser.id, email: testUser.email, full_name: testUser.full_name },
        onboardingComplete: false, // Always force onboarding for test user
      })

      response.cookies.set("session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      })

      console.log("[v0] Test login successful, redirecting to onboarding")
      return response
    }

    // Regular login flow
    const user = await getUserByEmail(email)
    console.log("[v0] User found:", !!user)

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    const isValid = await verifyPassword(password, user.password_hash)
    console.log("[v0] Password valid:", isValid)

    if (!isValid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    const profile = await sql`
      SELECT onboarding_completed FROM user_profiles WHERE user_id = ${user.id}
    `
    console.log("[v0] Profile query result:", profile)

    // Neon returns an array directly, not { rows: [] }
    const onboardingComplete = profile && profile.length > 0 ? profile[0].onboarding_completed : false
    console.log("[v0] Onboarding complete:", onboardingComplete)

    const token = await encrypt({ userId: user.id })
    console.log("[v0] Token created, setting cookie")

    const response = NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, full_name: user.full_name },
      onboardingComplete, // Include onboarding status in response
    })

    response.cookies.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    })

    console.log("[v0] Sign in successful, cookie set")
    return response
  } catch (error) {
    console.error("[v0] Sign in error:", error)
    return NextResponse.json({ error: "An error occurred during sign in" }, { status: 500 })
  }
}
