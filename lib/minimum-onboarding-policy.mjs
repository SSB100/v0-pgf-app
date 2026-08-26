export const MINIMUM_ONBOARDING_FOCUS_AREAS = [
  "gambling",
  "alcohol",
  "substances",
  "gaming",
  "mental_health",
  "personal_growth",
]

export const MINIMUM_ONBOARDING_AVATARS = [
  "growth_tree",
  "rising_phoenix",
  "dragon_hatchling",
  "crystal_sentinel",
  "spirit_fox",
]

const focusAreaSet = new Set(MINIMUM_ONBOARDING_FOCUS_AREAS)
const avatarSet = new Set(MINIMUM_ONBOARDING_AVATARS)

export function sanitizeMinimumOnboardingInput(input = {}) {
  const requestedFocusAreas = Array.isArray(input.journeyTypes) ? input.journeyTypes : []
  const journeyTypes = [...new Set(
    requestedFocusAreas
      .filter((value) => typeof value === "string")
      .map((value) => value.trim())
      .filter((value) => focusAreaSet.has(value)),
  )].slice(0, MINIMUM_ONBOARDING_FOCUS_AREAS.length)

  if (journeyTypes.length === 0) {
    return { ok: false, error: "Please select at least one Waypoint focus area" }
  }

  const requestedAvatar = typeof input.growthAvatar === "string" ? input.growthAvatar.trim() : ""
  if (!avatarSet.has(requestedAvatar)) {
    return { ok: false, error: "Please choose a valid Growth Companion" }
  }

  return {
    ok: true,
    journeyTypes,
    growthAvatar: requestedAvatar,
  }
}
