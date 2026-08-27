export const WAYPOINT_FOCUS_AREAS = [
  "gambling",
  "alcohol",
  "substances",
  "gaming",
  "mental_health",
  "personal_growth",
]

export const GROWTH_COMPANION_IDS = [
  "growth_tree",
  "rising_phoenix",
  "dragon_hatchling",
  "crystal_sentinel",
  "spirit_fox",
  "waka_journey",
]

export const NO_COMPANION_ID = "none"
export const GROWTH_PRESENTATION_IDS = [...GROWTH_COMPANION_IDS, NO_COMPANION_ID]

const focusAreaSet = new Set(WAYPOINT_FOCUS_AREAS)
const presentationSet = new Set(GROWTH_PRESENTATION_IDS)

export function sanitizeWaypointPreferencesInput(input = {}) {
  const requestedFocusAreas = Array.isArray(input.journeyTypes) ? input.journeyTypes : []
  const journeyTypes = [...new Set(
    requestedFocusAreas
      .filter((value) => typeof value === "string")
      .map((value) => value.trim())
      .filter((value) => focusAreaSet.has(value)),
  )].slice(0, WAYPOINT_FOCUS_AREAS.length)

  if (journeyTypes.length === 0) {
    return { ok: false, error: "Please select at least one Waypoint focus area" }
  }

  const requestedPresentation = typeof input.growthAvatar === "string" ? input.growthAvatar.trim() : ""
  if (!presentationSet.has(requestedPresentation)) {
    return { ok: false, error: "Please choose a Growth Companion or Progress only" }
  }

  return {
    ok: true,
    journeyTypes,
    growthAvatar: requestedPresentation,
  }
}
