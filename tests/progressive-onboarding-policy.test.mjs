import test from "node:test"
import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import {
  MINIMUM_ONBOARDING_AVATARS,
  MINIMUM_ONBOARDING_FOCUS_AREAS,
  MINIMUM_ONBOARDING_PRESENTATIONS,
  NO_COMPANION_ID,
  sanitizeMinimumOnboardingInput,
} from "../lib/minimum-onboarding-policy.mjs"

const readSource = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8")

test("preference sanitizer still accepts only known focus areas and progress presentations", () => {
  const result = sanitizeMinimumOnboardingInput({
    journeyTypes: ["gambling", "personal_growth", "gambling", "not-real"],
    growthAvatar: "spirit_fox",
  })
  const progressOnly = sanitizeMinimumOnboardingInput({
    journeyTypes: ["mental_health"],
    growthAvatar: NO_COMPANION_ID,
  })

  assert.equal(result.ok, true)
  assert.deepEqual(result.journeyTypes, ["gambling", "personal_growth"])
  assert.equal(result.growthAvatar, "spirit_fox")
  assert.equal(progressOnly.ok, true)
  assert.equal(progressOnly.growthAvatar, "none")
  assert.ok(MINIMUM_ONBOARDING_FOCUS_AREAS.length >= 6)
  assert.equal(MINIMUM_ONBOARDING_AVATARS.length, 5)
  assert.ok(MINIMUM_ONBOARDING_PRESENTATIONS.includes("none"))
})

test("preference sanitizer requires a real focus and an explicit valid presentation choice", () => {
  assert.equal(sanitizeMinimumOnboardingInput({ journeyTypes: [], growthAvatar: "growth_tree" }).ok, false)
  assert.equal(sanitizeMinimumOnboardingInput({ journeyTypes: ["gambling"], growthAvatar: "unknown" }).ok, false)
  assert.equal(sanitizeMinimumOnboardingInput({ journeyTypes: ["gambling"], growthAvatar: "" }).ok, false)
})

test("retired minimum completion cannot bypass the required baseline", async () => {
  const source = await readSource("app/api/onboarding/minimum-complete/route.ts")
  const page = await readSource("app/onboarding/page.tsx")

  assert.match(source, /status: 410/)
  assert.match(source, /FULL_BASELINE_ONBOARDING_REQUIRED/)
  assert.match(source, /full Waypoint baseline onboarding/)
  assert.doesNotMatch(source, /UPDATE user_profiles/)
  assert.doesNotMatch(source, /onboarding_completed = true/)
  assert.doesNotMatch(page, /MinimumOnboardingFlow/)
})

test("active onboarding restores the comprehensive baseline flow", async () => {
  const page = await readSource("app/onboarding/page.tsx")
  const flow = await readSource("components/onboarding/onboarding-flow.tsx")
  const completion = await readSource("app/api/onboarding/complete/route.ts")

  assert.match(page, /OnboardingFlow/)
  assert.match(page, /userId=\{user\.id\}/)
  assert.match(page, /requestedStep <= 50/)
  assert.match(page, /focus areas, values, strengths and first check-in/)
  assert.doesNotMatch(page, /Three short steps/)
  assert.doesNotMatch(page, /MinimumOnboardingFlow/)

  for (const requiredStep of [
    "journey_type",
    "gambling",
    "alcohol",
    "substances",
    "mental_health",
    "personal_growth",
    "gaming",
    "physical_harm",
    "values_selection",
    "values_ranking",
    "values_summary",
    "strengths",
    "daily_checkin",
    "avatar_selection",
    "completion",
  ]) {
    assert.ok(flow.includes(`\"${requiredStep}\"`), `full onboarding is missing ${requiredStep}`)
  }

  assert.match(flow, /\/api\/onboarding\/complete/)
  assert.match(flow, /\/api\/onboarding\/save-progress/)
  assert.match(completion, /selectedValues/)
  assert.match(completion, /initialDailyCheckIn/)
  assert.match(completion, /user_values/)
  assert.match(completion, /problem_areas/)
  assert.match(completion, /daily_checkins/)
})

test("completed clients can update only their Waypoint focus and presentation preferences", async () => {
  const source = await readSource("app/api/user/waypoint-preferences/route.ts")

  assert.match(source, /user\.role !== "client"/)
  assert.match(source, /WHERE user_id = \$\{user\.id\}::uuid/)
  assert.match(source, /COALESCE\(onboarding_completed, false\) = true/)
  assert.match(source, /sanitizeMinimumOnboardingInput/)
  assert.match(source, /journey_types =/)
  assert.match(source, /growth_avatar =/)
  assert.match(source, /updated_at = CURRENT_TIMESTAMP/)
  assert.match(source, /Cache-Control": "no-store"/)

  for (const forbidden of ["level_credits", "tree_growth_level", "check_in_streak", "daily_checkins", "journey_completions", "user_values", "problem_areas", "sharing_permissions", "user_demographics"]) {
    assert.equal(source.includes(forbidden), false, `preference update must not mutate or query ${forbidden}`)
  }
})

test("settings retains editable focus and the progress-only companion alternative after baseline onboarding", async () => {
  const settings = await readSource("app/settings/page.tsx")
  const preferences = await readSource("components/settings/waypoint-preferences-card.tsx")
  const desktopGrowth = await readSource("components/dashboard/growth-avatar-card.tsx")
  const mobileGrowth = await readSource("components/dashboard/mobile-growth-companion.tsx")

  assert.match(settings, /WaypointPreferencesCard/)
  assert.match(preferences, /\/api\/user\/waypoint-preferences/)
  assert.match(preferences, /Progress only/)
  assert.match(preferences, /Fantasy Companions/)
  assert.match(preferences, /do not erase your history, credits, Journey progress or sharing settings/)
  assert.match(desktopGrowth, /avatarType === "none"/)
  assert.match(desktopGrowth, /Progress only/)
  assert.match(mobileGrowth, /avatarType === "none"/)
  assert.match(mobileGrowth, /track engagement without a character/)
})

test("signup remains limited to account essentials and does not infer optional preferences", async () => {
  const form = await readSource("components/auth/signup-form.tsx")
  const route = await readSource("app/api/auth/signup/route.ts")

  for (const removedFormConcept of ["DemographicsFields", "dataConsent", "ethnicityPreferNotToSay", "iwiAffiliations", 'id="gender"', 'id="country"']) {
    assert.equal(form.includes(removedFormConcept), false, `signup form still includes ${removedFormConcept}`)
  }

  assert.match(route, /age_verified_18_plus = true/)
  assert.match(route, /terms_accepted = true/)
  assert.match(route, /privacy_policy/)
  for (const forbiddenRouteConcept of ["user_demographics", "future_research_interest", "data_consent_date", "sanitizeDemographicsInput", "demographics_collection_notice"]) {
    assert.equal(route.includes(forbiddenRouteConcept), false, `signup route still infers ${forbiddenRouteConcept}`)
  }
})

test("first explicit demographics save records the collection notice instead of signup", async () => {
  const source = await readSource("app/api/user/demographics/route.ts")

  assert.match(source, /demographics_collection_notice/)
  assert.match(source, /collectionNoticeVersion/)
  assert.match(source, /WHERE NOT EXISTS/)
  assert.match(source, /source: "settings"/)
})

test("full baseline draft saving is client-only, supports the long flow and exits only after save", async () => {
  const source = await readSource("app/api/onboarding/save-progress/route.ts")
  const updateIndex = source.indexOf("UPDATE user_profiles")
  const signOutIndex = source.indexOf("await deleteSession()")

  assert.match(source, /user\.role !== "client"/)
  assert.match(source, /currentStep > 50/)
  assert.match(source, /100 \* 1024/)
  assert.match(source, /COALESCE\(onboarding_completed, false\) = false/)
  assert.ok(updateIndex >= 0)
  assert.ok(signOutIndex > updateIndex)
})
