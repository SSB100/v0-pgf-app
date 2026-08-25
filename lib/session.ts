import { cookies } from "next/headers"
import { SignJWT, jwtVerify, type JWTPayload } from "jose"
import { getUserById, type User } from "./auth"

function getJwtKey() {
  const secret = process.env.JWT_SECRET

  if (!secret) {
    throw new Error("JWT_SECRET is not configured")
  }

  return new TextEncoder().encode(secret)
}

export type WaypointSessionPayload = JWTPayload & {
  userId: string
  securityVersion?: number
  mfaVerified?: boolean
  purpose?: string
  returnTo?: string
}

export async function encrypt(payload: { userId: string; securityVersion?: number; mfaVerified?: boolean }) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getJwtKey())
}

export async function decrypt(token: string): Promise<WaypointSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtKey(), {
      algorithms: ["HS256"],
    })
    return payload as WaypointSessionPayload
  } catch {
    return null
  }
}

export async function createSession(userId: string, options: { mfaVerified?: boolean } = {}) {
  const user = await getUserById(userId)
  if (!user) throw new Error("Cannot create a session for an unknown user")

  const token = await encrypt({
    userId,
    securityVersion: user.security_version || 1,
    mfaVerified: options.mfaVerified === true,
  })
  const cookieStore = await cookies()

  cookieStore.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  })
}

export async function createMfaChallengeToken(input: { userId: string; securityVersion: number; returnTo?: string | null }) {
  return new SignJWT({
    userId: input.userId,
    securityVersion: input.securityVersion,
    purpose: "professional_mfa",
    returnTo: input.returnTo || "/professional",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("5m")
    .sign(getJwtKey())
}

export async function readMfaChallengeToken(token: string) {
  const payload = await decrypt(token)
  if (!payload || payload.purpose !== "professional_mfa" || typeof payload.userId !== "string") return null
  return payload
}

export async function getSessionContext(): Promise<{ user: User | null; mfaVerified: boolean }> {
  const cookieStore = await cookies()
  const token = cookieStore.get("session")?.value

  if (!token) return { user: null, mfaVerified: false }

  const payload = await decrypt(token)
  if (!payload || typeof payload.userId !== "string") return { user: null, mfaVerified: false }

  const user = await getUserById(payload.userId)

  if (!user) {
    await deleteSession()
    return { user: null, mfaVerified: false }
  }

  const tokenSecurityVersion = typeof payload.securityVersion === "number" ? payload.securityVersion : 1
  if ((user.security_version || 1) !== tokenSecurityVersion) {
    await deleteSession()
    return { user: null, mfaVerified: false }
  }

  return { user, mfaVerified: payload.mfaVerified === true }
}

export async function getSession(): Promise<User | null> {
  const context = await getSessionContext()
  return context.user
}

export async function getUserFromSession(): Promise<User | null> {
  return getSession()
}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete("session")
}

export async function deleteMfaChallenge() {
  const cookieStore = await cookies()
  cookieStore.delete("professional_mfa_challenge")
}
