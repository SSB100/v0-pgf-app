export const WAYPOINT_FOCUS_AREAS: string[]
export const GROWTH_COMPANION_IDS: string[]
export const NO_COMPANION_ID: string
export const GROWTH_PRESENTATION_IDS: string[]

export type WaypointPreferencesSanitized =
  | { ok: false; error: string }
  | { ok: true; journeyTypes: string[]; growthAvatar: string }

export function sanitizeWaypointPreferencesInput(input?: Record<string, unknown>): WaypointPreferencesSanitized
