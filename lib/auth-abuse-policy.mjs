export const AUTH_RATE_LIMIT_POLICY_VERSION = "auth-abuse-v1"

export const AUTH_RATE_LIMITS = Object.freeze({
  signInNetwork: Object.freeze({ action: "signin_network", limit: 60, windowSeconds: 15 * 60 }),
  signInFailedIdentityNetwork: Object.freeze({ action: "signin_failed_identity_network", limit: 8, windowSeconds: 15 * 60 }),
  signInFailedIdentity: Object.freeze({ action: "signin_failed_identity", limit: 25, windowSeconds: 60 * 60 }),
  clientSignupNetwork: Object.freeze({ action: "client_signup_network", limit: 8, windowSeconds: 60 * 60 }),
  clientSignupIdentity: Object.freeze({ action: "client_signup_identity", limit: 3, windowSeconds: 60 * 60 }),
  professionalSignupNetwork: Object.freeze({ action: "professional_signup_network", limit: 5, windowSeconds: 60 * 60 }),
  professionalSignupIdentity: Object.freeze({ action: "professional_signup_identity", limit: 3, windowSeconds: 60 * 60 }),
  mfaNetwork: Object.freeze({ action: "mfa_network", limit: 30, windowSeconds: 15 * 60 }),
})

export function isRateLimitExceeded({ attemptCount, limit }) {
  return Number.isFinite(Number(attemptCount))
    && Number.isFinite(Number(limit))
    && Number(attemptCount) > Number(limit)
}

export function rateLimitRetryAfterSeconds({ windowStartedAt, windowSeconds, nowMs = Date.now() }) {
  const startMs = new Date(windowStartedAt).getTime()
  const windowMs = Number(windowSeconds) * 1000
  if (!Number.isFinite(startMs) || !Number.isFinite(windowMs) || windowMs <= 0) return 60
  return Math.max(1, Math.ceil((startMs + windowMs - nowMs) / 1000))
}
