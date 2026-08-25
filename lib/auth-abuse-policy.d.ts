export type AuthRateLimitDefinition = {
  action: string
  limit: number
  windowSeconds: number
}

export const AUTH_RATE_LIMIT_POLICY_VERSION: string
export const AUTH_RATE_LIMITS: Readonly<{
  signInNetwork: Readonly<AuthRateLimitDefinition>
  signInFailedIdentityNetwork: Readonly<AuthRateLimitDefinition>
  signInFailedIdentity: Readonly<AuthRateLimitDefinition>
  clientSignupNetwork: Readonly<AuthRateLimitDefinition>
  clientSignupIdentity: Readonly<AuthRateLimitDefinition>
  professionalSignupNetwork: Readonly<AuthRateLimitDefinition>
  professionalSignupIdentity: Readonly<AuthRateLimitDefinition>
  mfaNetwork: Readonly<AuthRateLimitDefinition>
}>

export function isRateLimitExceeded(input: { attemptCount: number; limit: number }): boolean
export function rateLimitRetryAfterSeconds(input: { windowStartedAt: string | Date; windowSeconds: number; nowMs?: number }): number
