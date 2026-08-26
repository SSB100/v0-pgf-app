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

test("minimum onboarding accepts only known focus areas and progress presentations", () => {
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

test("minimum onboarding requires a real focus and an explicit valid presentation choice", () => {
  assert.equal(sanitizeMinimumOnboardingInput({ journeyTypes: [], growthAvatar: "growth_tree" }).ok, false)
  assert.equal(sanitizeMinimumOnboardingInput({ journeyTypes: ["gambling"], growthAvatar: "unknown" }).ok, false)
  assert.equal(sanitizeMinimumOnboardingInput({ journeyTypes: ["gambling"], growthAvatar: "" }).ok, false)
})

test("minimum completion changes access state without fabricating personalisation data", async () => {
  const source = await readSource("app/api/onboarding/minimum-complete/route.ts")

  assert.match(source, /user\.role !== "client"/)
  assert.match(source, /onboarding_completed = true/)
  assert.match(source, /journey_types =/)
  assert.match(source, /growth_avatar =/)
  assert.match(source, /growthCreditsAwarded: 0/)

  for (const forbidden of ["daily_checkins", "user_values", "problem_areas", "strengths_completed", "level_credits", "check_in_streak", "total_points_earned"]) {
    assert.equal(source.includes(forbidden), false, `minimum completion must not write ${forbidden}`)
  }
})

test("minimum onboarding is a three-step focus presentation start flow", async () => {
  const source = await readSource("components/onboarding/minimum-onboarding-flow.tsx")

  assert.match(source, /Step \{step\} of 3/)
  assert.match(source, /What would you like Waypoint to help with\?/)
  assert.match(source, /Choose how you want to see progress/)
  assert.match(source, /Progress only/)
  assert.match(source, /Fantasy Companions/)
  assert.match(source, /Start using Waypoint/)
  assert.match(source, /does not create a Daily Check-in or award a Growth Credit/)
  assert.match(source, /\/api\/onboarding\/minimum-complete/)
  assert.doesNotMatch(source, /growthAvatar: "growth_tree"/)
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

test("settings exposes editable focus and an equal progress-only companion alternative", async () => {
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

test("signup is limited to account essentials and does not infer optional preferences", async () => {
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

test("minimum draft saving is client-only, bounded to three steps and exits only after save", async () => {
  const source = await readSource("app/api/onboarding/save-progress/route.ts")
  const updateIndex = source.indexOf("UPDATE user_profiles")
  const signOutIndex = source.indexOf("await deleteSession()")

  assert.match(source, /user\.role !== "client"/)
  assert.match(source, /currentStep > 3/)
  assert.ok(updateIndex >= 0)
  assert.ok(signOutIndex > updateIndex)
})
