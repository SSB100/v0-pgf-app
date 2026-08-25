import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"
import { sql } from "@/lib/db"
import { canUseClientSurface, canUseProfessionalSurface } from "@/lib/access-policy.mjs"

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

const clientOnlyRoutes = [
  "/dashboard",
  "/onboarding",
  "/check-in",
  "/community",
  "/skills",
  "/profile",
  "/training",
  "/safeguards",
  "/journey",
  "/share-journey",
  "/connect",
]

const clientOnlyApiRoutes = [
  "/api/check-in",
  "/api/community",
  "/api/connect/professional",
  "/api/growth",
  "/api/journey",
  "/api/onboarding",
  "/api/privacy/professional-connection",
  "/api/privacy/sharing-grants",
  "/api/skills",
  "/api/sos",
  "/api/user/update-values-order",
]

const professionalOnlyApiRoutes = [
  "/api/professional/clients",
  "/api/professional/invitations",
]

const authRoutes = ["/auth/signin", "/auth/signup", "/auth/professional-signup", "/auth/professional-mfa"]

function matchesRoute(pathname: string, route: string) {
  return pathname === route || pathname.startsWith(`${route}/`)
}

function matchesAnyRoute(pathname: string, routes: string[]) {
  return routes.some((route) => matchesRoute(pathname, route))
}

function isProtectedPath(pathname: string) {
  return matchesAnyRoute(pathname, protectedRoutes)
}

function isAuthPath(pathname: string) {
  return matchesAnyRoute(pathname, authRoutes)
}

function roleHome(role: string | null) {
  if (role === "admin") return "/admin/professionals"
  if (role === "professional") return "/professional"
  return "/dashboard"
}

function clearSession(response: NextResponse) {
  response.cookies.delete("session")
  return response
}

function apiDenied(status: 401 | 403, error: string, clear = false) {
  const response = NextResponse.json({ error }, { status })
  return clear ? clearSession(response) : response
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
        const recognisedRole = userRow?.role === "client" || userRow?.role === "professional" || userRow?.role === "admin"
          ? userRow.role
          : null

        if (userRow && recognisedRole && Number(userRow.security_version) === tokenSecurityVersion) {
          userId = payloadUserId
          userRole = recognisedRole
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

  if (matchesAnyRoute(pathname, clientOnlyApiRoutes)) {
    if (!isAuthenticated) return apiDenied(401, "Unauthorized", invalidSession)
    if (!canUseClientSurface({ role: userRole })) {
      return apiDenied(403, "This endpoint is available only to client accounts")
    }
  }

  if (matchesAnyRoute(pathname, professionalOnlyApiRoutes)) {
    if (!isAuthenticated) return apiDenied(401, "Unauthorized", invalidSession)
    if (!canUseProfessionalSurface({ role: userRole })) {
      return apiDenied(403, "This endpoint is available only to professional accounts")
    }
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

  if (isAuthenticated && matchesAnyRoute(pathname, clientOnlyRoutes) && !canUseClientSurface({ role: userRole })) {
    return NextResponse.redirect(new URL(roleHome(userRole), request.url))
  }

  if (isAuthenticated && userId && isProtectedPath(pathname)) {
    try {
      const isStrongAuthRole = userRole === "professional" || userRole === "admin"

      if (matchesRoute(pathname, "/admin")) {
        if (userRole !== "admin") return NextResponse.redirect(new URL(roleHome(userRole), request.url))
      }

      if (matchesRoute(pathname, "/professional")) {
        if (!canUseProfessionalSurface({ role: userRole })) {
          return NextResponse.redirect(new URL(roleHome(userRole), request.url))
        }
        const professional = await sql`SELECT id FROM professional_accounts WHERE user_id = ${userId} LIMIT 1`
        if (professional.length === 0) {
          const signInUrl = new URL("/auth/signin", request.url)
          signInUrl.searchParams.set("from", "/professional")
          return clearSession(NextResponse.redirect(signInUrl))
        }
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
    if (pathname === "/auth/professional-mfa") return NextResponse.redirect(new URL(roleHome(userRole), request.url))
    return NextResponse.redirect(new URL(roleHome(userRole), request.url))
  }

  const response = NextResponse.next()
  return invalidSession ? clearSession(response) : response
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
