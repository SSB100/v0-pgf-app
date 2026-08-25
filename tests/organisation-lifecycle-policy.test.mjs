import test from "node:test"
import assert from "node:assert/strict"
import { validateOrganisationLifecycleAction } from "../lib/organisation-lifecycle-policy.mjs"

const detailedReason = "Independent governance review confirmed the organisation status change."

test("verified organisation can be suspended with a substantive reason", () => {
  const result = validateOrganisationLifecycleAction({ action: "suspend", currentStatus: "verified", reason: detailedReason })
  assert.equal(result.ok, true)
  if (result.ok) assert.equal(result.value.action, "suspend")
})

test("unverified or already suspended organisation cannot be suspended again", () => {
  assert.equal(validateOrganisationLifecycleAction({ action: "suspend", currentStatus: "unverified", reason: detailedReason }).ok, false)
  assert.equal(validateOrganisationLifecycleAction({ action: "suspend", currentStatus: "suspended", reason: detailedReason }).ok, false)
})

test("only a suspended organisation can be reactivated", () => {
  assert.equal(validateOrganisationLifecycleAction({ action: "reactivate", currentStatus: "suspended", reason: detailedReason }).ok, true)
  assert.equal(validateOrganisationLifecycleAction({ action: "reactivate", currentStatus: "verified", reason: detailedReason }).ok, false)
})

test("organisation lifecycle actions require a substantive review record", () => {
  const result = validateOrganisationLifecycleAction({ action: "suspend", currentStatus: "verified", reason: "too short" })
  assert.equal(result.ok, false)
  if (!result.ok) assert.match(result.errors.join(" "), /20 characters/)
})
