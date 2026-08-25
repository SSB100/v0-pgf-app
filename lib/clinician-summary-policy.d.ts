export const PROFESSIONAL_SUMMARY_SCHEMA_VERSION: "professional-summary-v1"

export const PROFESSIONAL_SUMMARY_BOUNDARY: Readonly<{
  userAuthorised: true
  selfReported: true
  freeTextIncluded: false
  clinicalRecord: false
  liveMonitoring: false
  riskScoreGenerated: false
  explicitlyExcluded: readonly string[]
}>

export type ProfessionalSummaryScope =
  | "daily_checkins_summary"
  | "journey_progress"
  | "skills_practice"
  | "core_values"

export function sanitizeProfessionalSummarySection(
  scope: ProfessionalSummaryScope,
  payload: unknown,
): Record<string, unknown> | null
