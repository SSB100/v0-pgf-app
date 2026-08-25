export const PROFESSIONAL_SHARING_CONSENT_VERSION = "professional-sharing-v1"

export const PROFESSIONAL_SHARE_SCOPES = [
  {
    id: "journey_progress",
    label: "Journey progress",
    description: "Modules completed, current module and overall learning progress.",
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
    description: "Skills and tools practised in Waypoint, including completion and effectiveness ratings where available.",
    sensitivity: "standard",
  },
  {
    id: "core_values",
    label: "Core values",
    description: "Values the user has chosen to record and explicitly share.",
    sensitivity: "sensitive",
  },
  {
    id: "safeguards",
    label: "Safeguards",
    description: "Selected support and safeguard information the user chooses to make available.",
    sensitivity: "high",
  },
  {
    id: "selected_reflections",
    label: "Selected reflections",
    description: "Only reflections the user deliberately selects for professional sharing. Private free text is never included by default.",
    sensitivity: "high",
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

// Nothing beyond high-level Journey progress is assumed to be shareable by default.
// Every other category requires an explicit user action after a verified professional
// relationship exists.
export const DEFAULT_PROFESSIONAL_SHARE_SCOPES: ProfessionalShareScope[] = ["journey_progress"]
