export const PROFESSIONAL_SUMMARY_SCHEMA_VERSION = "professional-summary-v2"

export const PROFESSIONAL_SUMMARY_BOUNDARY = Object.freeze({
  userAuthorised: true,
  selfReported: true,
  freeTextIncluded: "journey_responses_only_with_explicit_permission",
  clinicalRecord: false,
  liveMonitoring: false,
  riskScoreGenerated: false,
  explicitlyExcluded: Object.freeze([
    "private reflections and notes outside the explicit Journey responses permission",
    "trigger descriptions and narrative onboarding responses",
    "self-harm or suicide profile fields",
    "mental-health profile fields",
    "community messages",
    "research data",
    "client email address",
  ]),
})

const DAILY_SUMMARY_FIELDS = Object.freeze([
  "checkin_count",
  "average_mood",
  "average_urge",
  "average_overall",
  "gambling_days",
  "behaviour_days",
  "latest_date",
])
const DAILY_TREND_FIELDS = Object.freeze([
  "date",
  "mood_rating",
  "urge_strength",
  "overall_rating",
  "gambling_occurred",
  "behavior_occurred",
])
const JOURNEY_FIELDS = Object.freeze(["completed_modules", "latest_completion"])
const JOURNEY_MODULE_FIELDS = Object.freeze([
  "module_slug",
  "module_name",
  "completed_at",
  "content_version",
])
const SKILL_FIELDS = Object.freeze([
  "practice_count",
  "helpful_count",
  "average_effectiveness",
  "latest_practice",
])
const SKILL_ROW_FIELDS = Object.freeze([
  "skill_name",
  "skill_category",
  "effectiveness_rating",
  "was_helpful",
  "practiced_at",
  "content_version",
])
const CORE_VALUE_FIELDS = Object.freeze(["value_name", "category", "rank"])
const PERIOD_FIELDS = Object.freeze(["basis", "days"])

function pick(source, fields) {
  if (!source || typeof source !== "object" || Array.isArray(source)) return {}
  const result = {}
  for (const field of fields) {
    if (Object.prototype.hasOwnProperty.call(source, field)) result[field] = source[field]
  }
  return result
}

function sanitiseRows(rows, fields) {
  return Array.isArray(rows) ? rows.map((row) => pick(row, fields)) : []
}

export function sanitizeProfessionalSummarySection(scope, payload) {
  if (!payload || typeof payload !== "object") return null

  if (scope === "daily_checkins_summary") {
    return {
      period: pick(payload.period, PERIOD_FIELDS),
      summary: pick(payload.summary, DAILY_SUMMARY_FIELDS),
      trend: sanitiseRows(payload.trend, DAILY_TREND_FIELDS),
    }
  }

  if (scope === "journey_progress") {
    return {
      period: pick(payload.period, PERIOD_FIELDS),
      ...pick(payload, JOURNEY_FIELDS),
      recentModules: sanitiseRows(payload.recentModules, JOURNEY_MODULE_FIELDS),
    }
  }

  if (scope === "skills_practice") {
    return {
      period: pick(payload.period, PERIOD_FIELDS),
      ...pick(payload, SKILL_FIELDS),
      recentSkills: sanitiseRows(payload.recentSkills, SKILL_ROW_FIELDS),
    }
  }

  if (scope === "core_values") {
    return {
      period: pick(payload.period, PERIOD_FIELDS),
      values: sanitiseRows(payload.values, CORE_VALUE_FIELDS),
    }
  }

  return null
}
