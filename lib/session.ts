import { cookies } from "next/headers"
import { SignJWT, jwtVerify } from "jose"
import { getUserById, type User } from "./auth"

function getJwtKey() {
  const secret = process.env.JWT_SECRET

  if (!secret) {
    throw new Error("JWT_SECRET is not configured")
  }

  return new TextEncoder().encode(secret)
}

export async function encrypt(payload: { userId: string }) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getJwtKey())
}

export async function decrypt(token: string) {
  try {
    const { payload } = await jwtVerify(token, getJwtKey(), {
      algorithms: ["HS256"],
    })
    return payload
  } catch (error) {
    return null
  }
}

export async function createSession(userId: string) {
  const token = await encrypt({ userId })
  const cookieStore = await cookies()

  cookieStore.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  })
}

export async function getSession(): Promise<User | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get("session")?.value

  if (!token) return null

  const payload = await decrypt(token)
  if (!payload || typeof payload.userId !== "string") return null

  const user = await getUserById(payload.userId)

  if (!user) {
    await deleteSession()
    return null
  }

  return user
}

export async function getUserFromSession(): Promise<User | null> {
  return getSession()
}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete("session")
}
