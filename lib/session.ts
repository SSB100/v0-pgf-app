import { cookies } from "next/headers"
import { SignJWT, jwtVerify } from "jose"
import { getUserById, type User } from "./auth"

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key-change-in-production"
const key = new TextEncoder().encode(SECRET_KEY)

export async function encrypt(payload: { userId: string }) {
  return new SignJWT(payload).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("7d").sign(key)
}

export async function decrypt(token: string) {
  try {
    const { payload } = await jwtVerify(token, key, {
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
    maxAge: 60 * 60 * 24 * 7, // 7 days
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
    // User was deleted but session still exists - clear it
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
