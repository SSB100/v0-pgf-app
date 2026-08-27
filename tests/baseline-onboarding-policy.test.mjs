import test from "node:test"
import assert from "node:assert/strict"
import { access, readFile } from "node:fs/promises"
import {
  GROWTH_COMPANION_IDS,
  GROWTH_PRESENTATION_IDS,
  NO_COMPANION_ID,
  WAYPOINT_FOCUS_AREAS,
  sanitizeWaypointPreferencesInput,
} from "../lib/waypoint-preferences-policy.mjs"

const readSource = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8")
const sourceUrl = (path) => new URL(`../${path}`, import.meta.url)

test("Waypoint preference sanitizer accepts only known focus areas and growth presentations", () => {
  const result = sanitizeWaypointPreferencesInput({
    journeyTypes: ["gambling", "personal_growth", "gambling", "not-real"],
    growthAvatar: "spirit_fox",
  })
  const progressOnly = sanitizeWaypointPreferencesInput({
    journeyTypes: ["mental_health"],
    growthAvatar: NO_COMPANION_ID,
  })

  assert.equal(result.ok, true)
  assert.deepEqual(result.journeyTypes, ["gambling", "personal_growth"])
  assert.equal(result.growthAvatar, "spirit_fox")
  assert.equal(progressOnly.ok, true)
  assert.equal(progressOnly.growthAvatar, "none")
  assert.ok(WAYPOINT_FOCUS_AREAS.length >= 6)
  assert.equal(GROWTH_COMPANION_IDS.length, 6)
  assert.ok(GROWTH_PRESENTATION_IDS.includes("none"))
})

test("Waypoint preference sanitizer requires a real focus and explicit progress presentation", () => {
  assert.equal(sanitizeWaypointPreferencesInput({ journeyTypes: [], growthAvatar: "growth_tree" }).ok, false)
  assert.equal(sanitizeWaypointPreferencesInput({ journeyTypes: ["gambling"], growthAvatar: "unknown" }).ok, false)
  assert.equal(sanitizeWaypointPreferencesInput({ journeyTypes: ["gambling"], growthAvatar: "" }).ok, false)
})

test("the obsolete three-step onboarding component has been removed", async () => {
  await assert.rejects(access(sourceUrl("components/onboarding/minimum-onboarding-flow.tsx")))
  await assert.rejects(access(sourceUrl("lib/minimum-onboarding-policy.mjs")))

  const page = await readSource("app/onboarding/page.tsx")
  assert.doesNotMatch(page, /MinimumOnboardingFlow/)
  assert.doesNotMatch(page, /Three short steps/)
})

test("retired minimum-completion endpoint cannot bypass the required baseline", async () => {
  const source = await readSource("app/api/onboarding/minimum-complete/route.ts")

  assert.match(source, /status: 410/)
  assert.match(source, /FULL_BASELINE_ONBOARDING_REQUIRED/)
  assert.doesNotMatch(source, /UPDATE user_profiles/)
  assert.doesNotMatch(source, /onboarding_completed = true/)
})

test("active onboarding remains the comprehensive baseline flow", async () => {
  const page = await readSource("app/onboarding/page.tsx")
  const flow = await readSource("components/onboarding/onboarding-flow.tsx")
  const completion = await readSource("app/api/onboarding/complete/route.ts")

  assert.match(page, /OnboardingFlow/)
  assert.match(page, /requestedStep <= 50/)
  assert.match(page, /focus areas, values, strengths and first Daily Reflection/)

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

  assert.match(completion, /selectedValues/)
  assert.match(completion, /initialDailyCheckIn/)
  assert.match(completion, /user_values/)
  assert.match(completion, /problem_areas/)
  assert.match(completion, /daily_checkins/)
})

test("signup restores identity, ethnicity, iwi and research-interest baseline collection", async () => {
  const form = await readSource("components/auth/signup-form.tsx")
  const route = await readSource("app/api/auth/signup/route.ts")

  assert.match(form, /id="country"/)
  assert.match(form, /id="gender"/)
  assert.match(form, /DemographicsFields/)
  assert.match(form, /iwiAffiliations/)
  assert.match(form, /dataConsent/)
  assert.match(form, /Ethnicity, iwi affiliation and future research interest remain optional/)
  assert.match(form, /does not share your data with a professional/)
  assert.match(form, /separate approved consent process/)

  assert.match(route, /country =/)
  assert.match(route, /gender =/)
  assert.match(route, /sanitizeDemographicsInput/)
  assert.match(route, /INSERT INTO user_demographics/)
  assert.match(route, /data_consent =/)
  assert.match(route, /data_consent_date =/)
  assert.match(route, /demographics_collection_notice/)
  assert.match(route, /future_research_interest/)
  assert.match(route, /formalResearchConsent: false/)
  assert.match(route, /professionalSharingConsent: false/)
  assert.match(route, /age_verified_18_plus = true/)
  assert.match(route, /terms_accepted = true/)
  assert.match(route, /privacy_policy/)
})

test("long onboarding offers Progress only and persists it as an explicit choice", async () => {
  const selection = await readSource("components/onboarding/steps/avatar-selection-step.tsx")
  const completion = await readSource("app/api/onboarding/complete/route.ts")

  assert.match(selection, /Progress only/)
  assert.match(selection, /NO_COMPANION_ID/)
  assert.match(selection, /disabled=\{!selectedAvatar\}/)
  assert.match(selection, /data\.growthAvatar \|\| ""/)
  assert.doesNotMatch(selection, /data\.growthAvatar \|\| "growth_tree"/)

  assert.match(completion, /GROWTH_PRESENTATION_IDS/)
  assert.match(completion, /ALLOWED_GROWTH_PRESENTATIONS/)
  assert.match(completion, /Please choose a Growth Companion or Progress only/)
  assert.match(completion, /const growthAvatar = data\.growthAvatar/)
  assert.doesNotMatch(completion, /data\.growthAvatar\) \? data\.growthAvatar : "growth_tree"/)
})

test("completed clients can update only focus and growth presentation preferences", async () => {
  const source = await readSource("app/api/user/waypoint-preferences/route.ts")

  assert.match(source, /user\.role !== "client"/)
  assert.match(source, /COALESCE\(onboarding_completed, false\) = true/)
  assert.match(source, /sanitizeWaypointPreferencesInput/)
  assert.match(source, /journey_types =/)
  assert.match(source, /growth_avatar =/)
  assert.match(source, /Cache-Control": "no-store"/)

  for (const forbidden of ["level_credits", "tree_growth_level", "check_in_streak", "daily_checkins", "journey_completions", "user_values", "problem_areas", "sharing_permissions", "user_demographics"]) {
    assert.equal(source.includes(forbidden), false, `preference update must not mutate or query ${forbidden}`)
  }
})

test("Settings retains Progress only after the baseline is complete", async () => {
  const preferences = await readSource("components/settings/waypoint-preferences-card.tsx")
  const desktopGrowth = await readSource("components/dashboard/growth-avatar-card.tsx")
  const mobileGrowth = await readSource("components/dashboard/mobile-growth-companion.tsx")

  assert.match(preferences, /waypoint-preferences-policy/)
  assert.match(preferences, /Progress only/)
  assert.match(preferences, /Growth Companions/)
  assert.match(preferences, /do not erase your history, credits, Journey progress or sharing settings/)
  assert.match(desktopGrowth, /avatarType === "none"/)
  assert.match(mobileGrowth, /avatarType === "none"/)
})

test("full baseline draft saving remains client-only and supports the long flow", async () => {
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
