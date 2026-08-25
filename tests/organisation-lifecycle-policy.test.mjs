import test from "node:test"
import assert from "node:assert/strict"
import {
  hasCurrentProfessionalAffiliation,
  isOrganisationAffiliationTransfer,
  validateOrganisationLifecycleAction,
} from "../lib/organisation-lifecycle-policy.mjs"

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

test("current professional affiliation requires every organisation trust gate", () => {
  const current = {
    professionalStatus: "verified",
    organisationId: "org-1",
    organisationStatus: "verified",
    membershipStatus: "active",
  }
  assert.equal(hasCurrentProfessionalAffiliation(current), true)
  assert.equal(hasCurrentProfessionalAffiliation({ ...current, professionalStatus: "suspended" }), false)
  assert.equal(hasCurrentProfessionalAffiliation({ ...current, organisationId: null }), false)
  assert.equal(hasCurrentProfessionalAffiliation({ ...current, organisationStatus: "suspended" }), false)
  assert.equal(hasCurrentProfessionalAffiliation({ ...current, membershipStatus: "suspended" }), false)
  assert.equal(hasCurrentProfessionalAffiliation({ ...current, membershipStatus: null }), false)
})

test("organisation transfer is detected only when an existing affiliation changes organisation", () => {
  assert.equal(isOrganisationAffiliationTransfer({ currentOrganisationId: "org-1", nextOrganisationId: "org-2" }), true)
  assert.equal(isOrganisationAffiliationTransfer({ currentOrganisationId: "org-1", nextOrganisationId: "org-1" }), false)
  assert.equal(isOrganisationAffiliationTransfer({ currentOrganisationId: null, nextOrganisationId: "org-1" }), false)
})
