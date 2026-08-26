export const MINIMUM_ONBOARDING_FOCUS_AREAS: string[]
export const MINIMUM_ONBOARDING_AVATARS: string[]

export type MinimumOnboardingSanitized =
  | { ok: false; error: string }
  | { ok: true; journeyTypes: string[]; growthAvatar: string }

export function sanitizeMinimumOnboardingInput(input?: Record<string, unknown>): MinimumOnboardingSanitized
