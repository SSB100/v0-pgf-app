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
  "/privacy",
  "/professional",
  "/connect",
  "/security",
  "/admin",
]

const authRoutes = ["/auth/signin", "/auth/signup", "/auth/professional-signup", "/auth/professional-mfa"]

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
  let userRole: string | null = null
  let sessionMfaVerified = false
  let invalidSession = Boolean(sessionCookie)

  if (sessionCookie && jwtKey) {
    try {
      const verified = await jwtVerify(sessionCookie, jwtKey, { algorithms: ["HS256"] })
      const payloadUserId = verified.payload.userId

      if (typeof payloadUserId === "string" && payloadUserId.length > 0) {
        const userCheck = await sql`
          SELECT id, role, COALESCE(security_version, 1)::int AS security_version
          FROM users
          WHERE id = ${payloadUserId}
          LIMIT 1
        `
        const userRow = userCheck[0]
        const tokenSecurityVersion = typeof verified.payload.securityVersion === "number" ? verified.payload.securityVersion : 1
        if (userRow && Number(userRow.security_version) === tokenSecurityVersion) {
          userId = payloadUserId
          userRole = userRow.role ?? "client"
          sessionMfaVerified = verified.payload.mfaVerified === true
          isAuthenticated = true
          invalidSession = false
        }
      }
    } catch {
      console.warn("[waypoint] Session verification failed")
    }
  } else if (sessionCookie && !jwtKey) {
    console.error("[waypoint] JWT_SECRET is not configured; session authentication is disabled")
  }

  if (pathname === "/auth/signin" && request.nextUrl.searchParams.get("reauth") === "1" && isAuthenticated) {
    return clearSession(NextResponse.next())
  }

  if (isProtectedPath(pathname) && !isAuthenticated) {
    const signInUrl = new URL("/auth/signin", request.url)
    signInUrl.searchParams.set("from", `${pathname}${request.nextUrl.search}`)
    const response = NextResponse.redirect(signInUrl)
    return invalidSession ? clearSession(response) : response
  }

  if (isAuthenticated && userId && isProtectedPath(pathname)) {
    try {
      const isStrongAuthRole = userRole === "professional" || userRole === "admin"

      if (matchesRoute(pathname, "/admin")) {
        if (userRole !== "admin") return NextResponse.redirect(new URL(userRole === "professional" ? "/professional" : "/dashboard", request.url))
      }

      if (matchesRoute(pathname, "/professional")) {
        const professional = await sql`SELECT id FROM professional_accounts WHERE user_id = ${userId} LIMIT 1`
        if (professional.length === 0) return NextResponse.redirect(new URL("/dashboard", request.url))
      }

      if (matchesRoute(pathname, "/security/mfa")) {
        if (!isStrongAuthRole) return NextResponse.redirect(new URL("/settings", request.url))
      } else if (isStrongAuthRole && (matchesRoute(pathname, "/professional") || matchesRoute(pathname, "/admin"))) {
        const factor = await sql`
          SELECT status
          FROM mfa_factors
          WHERE user_id = ${userId}
            AND factor_type = 'totp'
          LIMIT 1
        `
        if (factor[0]?.status !== "active") return NextResponse.redirect(new URL("/security/mfa", request.url))
        if (!sessionMfaVerified) {
          const signInUrl = new URL("/auth/signin", request.url)
          signInUrl.searchParams.set("from", `${pathname}${request.nextUrl.search}`)
          signInUrl.searchParams.set("reauth", "1")
          return clearSession(NextResponse.redirect(signInUrl))
        }
      } else if (!isStrongAuthRole && !matchesRoute(pathname, "/onboarding")) {
        const result = await sql`SELECT onboarding_completed FROM user_profiles WHERE user_id = ${userId} LIMIT 1`
        if (result.length === 0) return clearSession(NextResponse.redirect(new URL("/auth/signin", request.url)))
        if (!result[0]?.onboarding_completed) return NextResponse.redirect(new URL("/onboarding", request.url))
      }
    } catch (error) {
      console.error("[waypoint] Unable to verify route access", error)
      return clearSession(NextResponse.redirect(new URL("/auth/signin", request.url)))
    }
  }

  if (isAuthPath(pathname) && isAuthenticated && userId) {
    try {
      if (pathname === "/auth/professional-mfa") return NextResponse.redirect(new URL(userRole === "admin" ? "/admin/professionals" : userRole === "professional" ? "/professional" : "/dashboard", request.url))
      const professional = await sql`SELECT id FROM professional_accounts WHERE user_id = ${userId} LIMIT 1`
      if (userRole === "admin") return NextResponse.redirect(new URL("/admin/professionals", request.url))
      return NextResponse.redirect(new URL(professional.length > 0 ? "/professional" : "/dashboard", request.url))
    } catch {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }

  const response = NextResponse.next()
  return invalidSession ? clearSession(response) : response
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api).*)"],
}
