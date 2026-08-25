import test from "node:test"
import assert from "node:assert/strict"
import {
  ETHNICITY_OPTIONS,
  IWI_OPTIONS,
  sanitizeDemographicsInput,
} from "../lib/demographics-policy.mjs"

test("demographic options include the standard Stats NZ ethnicity question choices", () => {
  assert.deepEqual(
    ETHNICITY_OPTIONS.map((option) => option.label),
    ["New Zealand European", "Māori", "Samoan", "Cook Islands Māori", "Tongan", "Niuean", "Chinese", "Indian"],
  )
  assert.ok(IWI_OPTIONS.length > 100)
})

test("ethnicity is multiple-response and custom responses are sanitised", () => {
  const result = sanitizeDemographicsInput({
    ethnicities: ["maori", "nz_european", "not-valid"],
    otherEthnicities: " Dutch,  Japanese , Dutch ",
  })

  assert.equal(result.ethnicityResponseStatus, "provided")
  assert.deepEqual(result.ethnicityResponses.map((item) => item.label), ["Māori", "New Zealand European", "Dutch", "Japanese"])
})

test("prefer not to say clears ethnicity values", () => {
  const result = sanitizeDemographicsInput({
    ethnicities: ["maori"],
    otherEthnicities: "Dutch",
    ethnicityPreferNotToSay: true,
  })

  assert.equal(result.ethnicityResponseStatus, "prefer_not_to_say")
  assert.deepEqual(result.ethnicityResponses, [])
})

test("iwi supports multiple guide entries and user-supplied affiliations", () => {
  const result = sanitizeDemographicsInput({
    iwiAffiliations: ["Ngāti Whakaue (Te Arawa)", "Ngāpuhi"],
    otherIwi: ["A user supplied iwi name"],
  })

  assert.equal(result.iwiResponseStatus, "provided")
  assert.deepEqual(result.iwiAffiliations, [
    { label: "Ngāti Whakaue (Te Arawa)", source: "stats_nz_2023_guide" },
    { label: "Ngāpuhi", source: "stats_nz_2023_guide" },
    { label: "A user supplied iwi name", source: "user_supplied" },
  ])
})

test("explicit iwi response states do not retain affiliation values", () => {
  for (const status of ["dont_know", "none", "prefer_not_to_say"]) {
    const result = sanitizeDemographicsInput({
      iwiAffiliations: ["Ngāpuhi"],
      iwiResponseStatus: status,
    })
    assert.equal(result.iwiResponseStatus, status)
    assert.deepEqual(result.iwiAffiliations, [])
  }
})

test("demographic input is bounded and strips control characters", () => {
  const result = sanitizeDemographicsInput({
    otherEthnicities: ["\u0000  A   very    spaced ethnicity  "],
    otherIwi: ["\u0007Custom   iwi"],
  })

  assert.equal(result.ethnicityResponses[0].label, "A very spaced ethnicity")
  assert.equal(result.iwiAffiliations[0].label, "Custom iwi")
})
