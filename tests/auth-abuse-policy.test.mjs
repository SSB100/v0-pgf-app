import test from "node:test"
import assert from "node:assert/strict"
import {
  AUTH_RATE_LIMITS,
  AUTH_RATE_LIMIT_POLICY_VERSION,
  isRateLimitExceeded,
  rateLimitRetryAfterSeconds,
} from "../lib/auth-abuse-policy.mjs"

test("auth abuse policy has explicit bounded windows for public credential surfaces", () => {
  assert.equal(AUTH_RATE_LIMIT_POLICY_VERSION, "auth-abuse-v1")
  assert.deepEqual(AUTH_RATE_LIMITS.signInNetwork, { action: "signin_network", limit: 60, windowSeconds: 900 })
  assert.deepEqual(AUTH_RATE_LIMITS.signInFailedIdentityNetwork, { action: "signin_failed_identity_network", limit: 8, windowSeconds: 900 })
  assert.deepEqual(AUTH_RATE_LIMITS.signInFailedIdentity, { action: "signin_failed_identity", limit: 25, windowSeconds: 3600 })
  assert.deepEqual(AUTH_RATE_LIMITS.clientSignupNetwork, { action: "client_signup_network", limit: 8, windowSeconds: 3600 })
  assert.deepEqual(AUTH_RATE_LIMITS.professionalSignupNetwork, { action: "professional_signup_network", limit: 5, windowSeconds: 3600 })
  assert.deepEqual(AUTH_RATE_LIMITS.mfaNetwork, { action: "mfa_network", limit: 30, windowSeconds: 900 })
})

test("rate-limit threshold allows the configured count and blocks the next attempt", () => {
  assert.equal(isRateLimitExceeded({ attemptCount: 8, limit: 8 }), false)
  assert.equal(isRateLimitExceeded({ attemptCount: 9, limit: 8 }), true)
})

test("retry-after is bounded to at least one second", () => {
  const start = "2026-08-26T00:00:00.000Z"
  assert.equal(rateLimitRetryAfterSeconds({ windowStartedAt: start, windowSeconds: 900, nowMs: Date.parse("2026-08-26T00:10:00.000Z") }), 300)
  assert.equal(rateLimitRetryAfterSeconds({ windowStartedAt: start, windowSeconds: 900, nowMs: Date.parse("2026-08-26T00:20:00.000Z") }), 1)
})

test("identity-wide failed-signin limit is higher than the network-pair limit", () => {
  assert.ok(AUTH_RATE_LIMITS.signInFailedIdentity.limit > AUTH_RATE_LIMITS.signInFailedIdentityNetwork.limit)
  assert.ok(AUTH_RATE_LIMITS.signInFailedIdentity.windowSeconds >= AUTH_RATE_LIMITS.signInFailedIdentityNetwork.windowSeconds)
})
