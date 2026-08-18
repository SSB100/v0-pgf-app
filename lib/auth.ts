import { sql } from "./db"

export interface User {
  id: string
  email: string
  full_name: string | null
  role: string
  created_at: Date
}

export interface UserWithPassword extends User {
  password_hash: string
}

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("")
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const passwordHash = await hashPassword(password)
  return passwordHash === hash
}

export { hashPassword, verifyPassword }

export async function createUser(email: string, password: string, fullName?: string): Promise<User> {
  const passwordHash = await hashPassword(password)

  const result = await sql`
    INSERT INTO users (email, password_hash, full_name, role)
    VALUES (${email}, ${passwordHash}, ${fullName || null}, 'client')
    RETURNING id, email, full_name, role, created_at
  `

  const user = result[0] as User | undefined
  if (!user) throw new Error("User creation did not return a user record")

  await sql`
    INSERT INTO user_profiles (user_id)
    VALUES (${user.id})
  `

  return user
}

export async function getUserByEmail(email: string): Promise<UserWithPassword | null> {
  const result = await sql`
    SELECT id, email, password_hash, full_name, role, created_at
    FROM users
    WHERE email = ${email}
  `

  return (result[0] as UserWithPassword | undefined) || null
}

export async function getUserById(id: string): Promise<User | null> {
  const result = await sql`
    SELECT id, email, full_name, role, created_at
    FROM users
    WHERE id = ${id}
  `

  return (result[0] as User | undefined) || null
}
