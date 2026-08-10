import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"
import { sql } from "@/lib/db"

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key-change-in-production"
const key = new TextEncoder().encode(SECRET_KEY)

// Routes that require authentication
const protectedRoutes = ["/dashboard", "/onboarding", "/skills", "/profile", "/training", "/safeguards", "/journey"]

// Routes that should redirect to dashboard if already authenticated
const authRoutes = ["/auth/signin", "/auth/signup"]

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const sessionCookie = request.cookies.get("session")?.value

  let isAuthenticated = false
  let userId: string | null = null
  let userExists = false

  // Verify session token
  if (sessionCookie) {
    try {
      const verified = await jwtVerify(sessionCookie, key, { algorithms: ["HS256"] })
      userId = verified.payload.userId as string

      try {
        const userCheck = await sql`
          SELECT id FROM users WHERE id = ${userId} LIMIT 1
        `
        userExists = userCheck.length > 0
        isAuthenticated = userExists
      } catch (error) {
        console.log("[v0] Error checking user existence:", error)
        isAuthenticated = false
      }
    } catch (error) {
      // Invalid token - clear it
      console.log("[v0] Invalid session token")
    }
  }

  if (sessionCookie && !userExists) {
    const response = NextResponse.redirect(new URL("/auth/signin", request.url))
    response.cookies.delete("session")
    return response
  }

  // Redirect to signin if trying to access protected routes without authentication
  if (protectedRoutes.some((route) => pathname.startsWith(route)) && !isAuthenticated) {
    const signInUrl = new URL("/auth/signin", request.url)
    signInUrl.searchParams.set("from", pathname)
    return NextResponse.redirect(signInUrl)
  }

  if (isAuthenticated && userId) {
    // Check if trying to access dashboard or other protected routes (not onboarding)
    const needsOnboardingCheck = protectedRoutes.some(
      (route) => pathname.startsWith(route) && !pathname.startsWith("/onboarding"),
    )

    if (needsOnboardingCheck) {
      try {
        const result = await sql`
          SELECT onboarding_completed 
          FROM user_profiles 
          WHERE user_id = ${userId}
        `

        if (!result || result.length === 0) {
          const response = NextResponse.redirect(new URL("/auth/signin", request.url))
          response.cookies.delete("session")
          return response
        }

        // Redirect to onboarding if not completed
        if (!result[0]?.onboarding_completed) {
          return NextResponse.redirect(new URL("/onboarding", request.url))
        }
      } catch (error) {
        console.log("[v0] Error checking onboarding status:", error)
        const response = NextResponse.redirect(new URL("/auth/signin", request.url))
        response.cookies.delete("session")
        return response
      }
    }
  }

  // Redirect authenticated users away from auth routes to dashboard
  if (authRoutes.some((route) => pathname.startsWith(route)) && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api).*)",
  ],
}
