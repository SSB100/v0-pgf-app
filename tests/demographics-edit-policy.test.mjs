import test from "node:test"
import assert from "node:assert/strict"
import fs from "node:fs"
import { demographicsRecordToFormValue } from "../lib/demographics-form-policy.mjs"

test("stored demographics map back to editable standard and custom form values", () => {
  const result = demographicsRecordToFormValue({
    ethnicity_responses: [
      { key: "maori", label: "Māori", source: "stats_nz_standard_question" },
      { key: null, label: "Dutch", source: "other" },
    ],
    ethnicity_response_status: "provided",
    iwi_affiliations: [
      { label: "Ngāti Whakaue (Te Arawa)", source: "stats_nz_2023_guide" },
      { label: "A user supplied iwi name", source: "user_supplied" },
    ],
    iwi_response_status: "provided",
  })

  assert.deepEqual(result.ethnicities, ["maori"])
  assert.equal(result.otherEthnicities, "Dutch")
  assert.equal(result.ethnicityPreferNotToSay, false)
  assert.deepEqual(result.iwiAffiliations, ["Ngāti Whakaue (Te Arawa)"])
  assert.deepEqual(result.otherIwi, ["A user supplied iwi name"])
  assert.equal(result.iwiResponseStatus, "not_stated")
})

test("explicit privacy response states suppress stale stored demographic values", () => {
  const ethnicity = demographicsRecordToFormValue({
    ethnicity_responses: [{ key: "maori", label: "Māori", source: "stats_nz_standard_question" }],
    ethnicity_response_status: "prefer_not_to_say",
  })
  assert.deepEqual(ethnicity.ethnicities, [])
  assert.equal(ethnicity.otherEthnicities, "")
  assert.equal(ethnicity.ethnicityPreferNotToSay, true)

  for (const status of ["dont_know", "none", "prefer_not_to_say"]) {
    const iwi = demographicsRecordToFormValue({
      iwi_affiliations: [{ label: "Ngāpuhi", source: "stats_nz_2023_guide" }],
      iwi_response_status: status,
    })
    assert.deepEqual(iwi.iwiAffiliations, [])
    assert.deepEqual(iwi.otherIwi, [])
    assert.equal(iwi.iwiResponseStatus, status)
  }
})

test("demographics settings API is client-only and caller-bound", () => {
  const source = fs.readFileSync(new URL("../app/api/user/demographics/route.ts", import.meta.url), "utf8")
  assert.match(source, /user\.role !== "client"/)
  assert.match(source, /WHERE user_id = \$\{access\.user\.id\}::uuid/)
  assert.match(source, /sanitizeDemographicsInput/)
  assert.match(source, /valuesIncludedInAudit: false/)
  assert.doesNotMatch(source, /professionalAccountId|sharing_grants|professional\/clients/)
})
