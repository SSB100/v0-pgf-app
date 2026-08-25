export const PROFESSIONAL_SHARING_CONSENT_VERSION = "professional-sharing-v1"

type ProfessionalSensitivity = "standard" | "sensitive" | "high"

export const PROFESSIONAL_SHARE_SCOPES = [
  {
    id: "journey_progress",
    label: "Journey progress",
    description: "Modules completed and overall learning progress. Journey exercise answers and quick-check responses are not included.",
    sensitivity: "standard" as ProfessionalSensitivity,
  },
  {
    id: "daily_checkins_summary",
    label: "Daily check-in summaries",
    description: "Selected trend and summary information from daily check-ins. Free-text reflections and private notes are excluded.",
    sensitivity: "sensitive" as ProfessionalSensitivity,
  },
  {
    id: "skills_practice",
    label: "Skills practice",
    description: "Skills and tools recorded in Waypoint, including whether the user found them helpful where available. Practice notes are excluded.",
    sensitivity: "standard" as ProfessionalSensitivity,
  },
  {
    id: "core_values",
    label: "Core values",
    description: "Core values the user has chosen to record and explicitly share. Private reflections about those values are excluded.",
    sensitivity: "sensitive" as ProfessionalSensitivity,
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
// selectable. Safeguards, Journey response content and private reflections remain
// outside the professional summary unless a future separately consented policy is added.
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
