export const PROFESSIONAL_SHARING_CONSENT_VERSION = "professional-sharing-v1"

export const PROFESSIONAL_SHARE_SCOPES = [
  {
    id: "journey_progress",
    label: "Journey progress",
    description: "Modules completed and overall learning progress.",
    sensitivity: "standard",
  },
  {
    id: "daily_checkins_summary",
    label: "Daily check-in summaries",
    description: "Selected trend and summary information from daily check-ins. Free-text reflections are excluded.",
    sensitivity: "sensitive",
  },
  {
    id: "skills_practice",
    label: "Skills practice",
    description: "Skills and tools completed in Waypoint, including whether the user found them helpful where available.",
    sensitivity: "standard",
  },
  {
    id: "core_values",
    label: "Core values",
    description: "Core values the user has chosen to record and explicitly share.",
    sensitivity: "sensitive",
  },
] as const

export type ProfessionalShareScope = (typeof PROFESSIONAL_SHARE_SCOPES)[number]["id"]

const PROFESSIONAL_SHARE_SCOPE_IDS = new Set<string>(PROFESSIONAL_SHARE_SCOPES.map((scope) => scope.id))

export function isProfessionalShareScope(value: unknown): value is ProfessionalShareScope {
  return typeof value === "string" && PROFESSIONAL_SHARE_SCOPE_IDS.has(value)
}

export function normaliseProfessionalShareScopes(values: unknown): ProfessionalShareScope[] {
  if (!Array.isArray(values)) return []
  return [...new Set(values.filter(isProfessionalShareScope))]
}

// Only categories with an explicit, permission-scoped professional summary are
// selectable. Safeguards and private reflections remain reserved for later work.
export const PROFESSIONAL_REQUESTABLE_SCOPES: ProfessionalShareScope[] = [
  "journey_progress",
  "daily_checkins_summary",
  "skills_practice",
  "core_values",
]

export function normaliseRequestableProfessionalScopes(values: unknown): ProfessionalShareScope[] {
  const requestable = new Set<string>(PROFESSIONAL_REQUESTABLE_SCOPES)
  return normaliseProfessionalShareScopes(values).filter((scope) => requestable.has(scope))
}

export const DEFAULT_PROFESSIONAL_SHARE_SCOPES: ProfessionalShareScope[] = ["journey_progress"]
