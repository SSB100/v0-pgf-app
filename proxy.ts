import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"
import { sql } from "@/lib/db"

const jwtSecret = process.env.JWT_SECRET
const jwtKey = jwtSecret ? new TextEncoder().encode(jwtSecret) : null

const protectedRoutes = [
  "/dashboard",
  "/onboarding",
  "/check-in",
  "/community",
  "/skills",
  "/profile",
  "/settings",
  "/training",
  "/safeguards",
  "/journey",
  "/share-journey",
]

const authRoutes = ["/auth/signin", "/auth/signup"]

function matchesRoute(pathname: string, route: string) {
  return pathname === route || pathname.startsWith(`${route}/`)
}

function isProtectedPath(pathname: string) {
  return protectedRoutes.some((route) => matchesRoute(pathname, route))
}

function isAuthPath(pathname: string) {
  return authRoutes.some((route) => matchesRoute(pathname, route))
}

function clearSession(response: NextResponse) {
  response.cookies.delete("session")
  return response
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const sessionCookie = request.cookies.get("session")?.value

  let isAuthenticated = false
  let userId: string | null = null
  let invalidSession = Boolean(sessionCookie)

  if (sessionCookie && jwtKey) {
    try {
      const verified = await jwtVerify(sessionCookie, jwtKey, { algorithms: ["HS256"] })
      const payloadUserId = verified.payload.userId

      if (typeof payloadUserId === "string" && payloadUserId.length > 0) {
        const userCheck = await sql`
          SELECT id FROM users WHERE id = ${payloadUserId} LIMIT 1
        `

        if (userCheck.length > 0) {
          userId = payloadUserId
          isAuthenticated = true
          invalidSession = false
        }
      }
    } catch (error) {
      console.warn("[waypoint] Session verification failed")
    }
  } else if (sessionCookie && !jwtKey) {
    console.error("[waypoint] JWT_SECRET is not configured; session authentication is disabled")
  }

  if (isProtectedPath(pathname) && !isAuthenticated) {
    const signInUrl = new URL("/auth/signin", request.url)
    signInUrl.searchParams.set("from", pathname)
    const response = NextResponse.redirect(signInUrl)
    return invalidSession ? clearSession(response) : response
  }

  if (isAuthenticated && userId && isProtectedPath(pathname) && !matchesRoute(pathname, "/onboarding")) {
    try {
      const result = await sql`
        SELECT onboarding_completed
        FROM user_profiles
        WHERE user_id = ${userId}
        LIMIT 1
      `

      if (result.length === 0) {
        return clearSession(NextResponse.redirect(new URL("/auth/signin", request.url)))
      }

      if (!result[0]?.onboarding_completed) {
        return NextResponse.redirect(new URL("/onboarding", request.url))
      }
    } catch (error) {
      console.error("[waypoint] Unable to verify onboarding status")
      return clearSession(NextResponse.redirect(new URL("/auth/signin", request.url)))
    }
  }

  if (isAuthPath(pathname) && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  const response = NextResponse.next()
  return invalidSession ? clearSession(response) : response
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api).*)",
  ],
}
