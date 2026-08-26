import test from "node:test"
import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import {
  MINIMUM_ONBOARDING_AVATARS,
  MINIMUM_ONBOARDING_FOCUS_AREAS,
  sanitizeMinimumOnboardingInput,
} from "../lib/minimum-onboarding-policy.mjs"

const readSource = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8")

test("minimum onboarding accepts only known focus areas and companions", () => {
  const result = sanitizeMinimumOnboardingInput({
    journeyTypes: ["gambling", "personal_growth", "gambling", "not-real"],
    growthAvatar: "spirit_fox",
  })

  assert.equal(result.ok, true)
  assert.deepEqual(result.journeyTypes, ["gambling", "personal_growth"])
  assert.equal(result.growthAvatar, "spirit_fox")
  assert.ok(MINIMUM_ONBOARDING_FOCUS_AREAS.length >= 6)
  assert.ok(MINIMUM_ONBOARDING_AVATARS.length >= 5)
})

test("minimum onboarding requires a real focus and valid companion", () => {
  assert.equal(sanitizeMinimumOnboardingInput({ journeyTypes: [], growthAvatar: "growth_tree" }).ok, false)
  assert.equal(sanitizeMinimumOnboardingInput({ journeyTypes: ["gambling"], growthAvatar: "unknown" }).ok, false)
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

test("minimum onboarding is a three-step focus companion start flow", async () => {
  const source = await readSource("components/onboarding/minimum-onboarding-flow.tsx")

  assert.match(source, /Step \{step\} of 3/)
  assert.match(source, /What would you like Waypoint to help with\?/)
  assert.match(source, /Choose your Growth Companion/)
  assert.match(source, /Start using Waypoint/)
  assert.match(source, /does not create a Daily Check-in or award a Growth Credit/)
  assert.match(source, /\/api\/onboarding\/minimum-complete/)
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
