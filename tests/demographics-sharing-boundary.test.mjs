import test from "node:test"
import assert from "node:assert/strict"
import { sanitizeProfessionalSummarySection } from "../lib/clinician-summary-policy.mjs"

const demographicFields = {
  ethnicity: ["Māori"],
  ethnicities: ["Māori"],
  iwi: ["Ngāpuhi"],
  iwi_affiliations: ["Ngāpuhi"],
  demographics: { ethnicity: ["Māori"], iwi: ["Ngāpuhi"] },
}

test("current professional summary scopes cannot leak ethnicity or iwi data", () => {
  const sections = {
    daily_checkins_summary: {
      period: { basis: "rolling_days", days: 14 },
      summary: { checkin_count: 1, average_mood: 7, ...demographicFields },
      trend: [{ date: "2026-08-25", mood_rating: 7, ...demographicFields }],
      ...demographicFields,
    },
    journey_progress: {
      period: { basis: "all_time" },
      completed_modules: 1,
      recentModules: [{ module_slug: "test", module_name: "Test", completed_at: "2026-08-25", ...demographicFields }],
      ...demographicFields,
    },
    skills_practice: {
      period: { basis: "all_time" },
      practice_count: 1,
      recentSkills: [{ skill_name: "STOP", ...demographicFields }],
      ...demographicFields,
    },
    core_values: {
      period: { basis: "current" },
      values: [{ value_name: "Family", category: "Relationships", rank: 1, ...demographicFields }],
      ...demographicFields,
    },
  }

  for (const [scope, source] of Object.entries(sections)) {
    const result = sanitizeProfessionalSummarySection(scope, source)
    const serialized = JSON.stringify(result)
    assert.equal(serialized.includes("Māori"), false, `${scope} leaked ethnicity`)
    assert.equal(serialized.includes("Ngāpuhi"), false, `${scope} leaked iwi`)
    assert.equal(serialized.includes("demographics"), false, `${scope} leaked demographic container`)
  }
})
