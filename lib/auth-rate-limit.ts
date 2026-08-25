import { createHmac } from "node:crypto"
import type { NextRequest } from "next/server"
import { dbTableExists, sql } from "@/lib/db"
import { isRateLimitExceeded, rateLimitRetryAfterSeconds } from "@/lib/auth-abuse-policy.mjs"

type AuthRateLimitDefinition = {
  action: string
  limit: number
  windowSeconds: number
}

export type AuthRateLimitResult = {
  allowed: boolean
  unavailable: boolean
  attemptCount: number
  retryAfterSeconds: number
}

let limiterSchemaReady: boolean | null = null

function authRateLimitSecret() {
  return process.env.AUTH_RATE_LIMIT_SECRET || process.env.JWT_SECRET || null
}

async function isLimiterReady() {
  if (limiterSchemaReady !== null) return limiterSchemaReady
  limiterSchemaReady = await dbTableExists("auth_rate_limit_counters")
  return limiterSchemaReady
}

function hashSubject(action: string, rawSubject: string) {
  const secret = authRateLimitSecret()
  if (!secret) return null
  return createHmac("sha256", secret)
    .update(`waypoint-auth-rate-limit-v1:${action}:${rawSubject}`)
    .digest("hex")
}

export function getAuthRequestNetworkSubject(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for")
  const firstForwarded = forwarded?.split(",")[0]?.trim()
  return firstForwarded || request.headers.get("x-real-ip")?.trim() || "unknown"
}

export function combineAuthRateLimitSubject(...parts: string[]) {
  return parts.join("|")
}

export async function consumeAuthRateLimit(
  definition: AuthRateLimitDefinition,
  rawSubject: string,
): Promise<AuthRateLimitResult> {
  const subjectHash = hashSubject(definition.action, rawSubject)
  if (!subjectHash || !(await isLimiterReady())) {
    return { allowed: false, unavailable: true, attemptCount: 0, retryAfterSeconds: 60 }
  }

  const rows = await sql`
    INSERT INTO auth_rate_limit_counters (
      action, subject_hash, window_started_at, window_seconds,
      attempt_count, last_attempt_at, updated_at
    )
    VALUES (
      ${definition.action}, ${subjectHash}, CURRENT_TIMESTAMP, ${definition.windowSeconds},
      1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    )
    ON CONFLICT (action, subject_hash) DO UPDATE SET
      attempt_count = CASE
        WHEN auth_rate_limit_counters.window_started_at
          + auth_rate_limit_counters.window_seconds * INTERVAL '1 second' <= CURRENT_TIMESTAMP
        THEN 1
        ELSE auth_rate_limit_counters.attempt_count + 1
      END,
      window_started_at = CASE
        WHEN auth_rate_limit_counters.window_started_at
          + auth_rate_limit_counters.window_seconds * INTERVAL '1 second' <= CURRENT_TIMESTAMP
        THEN CURRENT_TIMESTAMP
        ELSE auth_rate_limit_counters.window_started_at
      END,
      window_seconds = EXCLUDED.window_seconds,
      last_attempt_at = CURRENT_TIMESTAMP,
      updated_at = CURRENT_TIMESTAMP
    RETURNING attempt_count, window_started_at, window_seconds
  `

  const row = rows[0]
  const attemptCount = Number(row?.attempt_count ?? 0)
  const retryAfterSeconds = rateLimitRetryAfterSeconds({
    windowStartedAt: row?.window_started_at ?? new Date(),
    windowSeconds: Number(row?.window_seconds ?? definition.windowSeconds),
  })

  if (Math.random() < 0.02) {
    try {
      await sql`
        DELETE FROM auth_rate_limit_counters
        WHERE last_attempt_at < CURRENT_TIMESTAMP - INTERVAL '7 days'
      `
    } catch (cleanupError) {
      console.warn("[waypoint] Auth rate-limit retention cleanup failed", cleanupError)
    }
  }

  return {
    allowed: !isRateLimitExceeded({ attemptCount, limit: definition.limit }),
    unavailable: false,
    attemptCount,
    retryAfterSeconds,
  }
}

export async function clearAuthRateLimit(definition: AuthRateLimitDefinition, rawSubject: string) {
  const subjectHash = hashSubject(definition.action, rawSubject)
  if (!subjectHash || !(await isLimiterReady())) return
  await sql`
    DELETE FROM auth_rate_limit_counters
    WHERE action = ${definition.action}
      AND subject_hash = ${subjectHash}
  `
}
