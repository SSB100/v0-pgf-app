import test from "node:test"
import assert from "node:assert/strict"
import {
  PROFESSIONAL_VERIFICATION_POLICY_VERSION,
  normaliseVerificationEvidence,
  validateVerificationEvidence,
} from "../lib/professional-verification-policy.mjs"

const completeChecklist = {
  identityChecked: true,
  credentialBasisChecked: true,
  organisationChecked: true,
  affiliationChecked: true,
  sourcesRecorded: true,
}

test("regulated professionals require authoritative-register evidence", () => {
  const valid = validateVerificationEvidence({
    method: "authoritative_register",
    credentialBasis: "regulated_registration",
    checklist: completeChecklist,
    sources: ["Official statutory register checked 25 Aug 2026"],
    note: "Registration details matched the application and organisation affiliation was independently confirmed.",
  })
  assert.equal(valid.ok, true)
  assert.equal(valid.value.policyVersion, PROFESSIONAL_VERIFICATION_POLICY_VERSION)

  const invalid = validateVerificationEvidence({
    method: "organisation_confirmation",
    credentialBasis: "regulated_registration",
    checklist: completeChecklist,
    sources: ["Employer website"],
    note: "Organisation confirmed the applicant works there in the stated professional role.",
  })
  assert.equal(invalid.ok, false)
  assert.match(invalid.errors.join(" "), /authoritative register/i)
})

test("non-regulated roles require independent organisation confirmation", () => {
  const valid = validateVerificationEvidence({
    method: "organisation_confirmation",
    credentialBasis: "non_regulated_role",
    checklist: completeChecklist,
    sources: ["Organisation switchboard confirmation 25 Aug 2026"],
    note: "Role is not subject to a mandatory professional register; employment and scope were independently confirmed.",
  })
  assert.equal(valid.ok, true)

  const invalid = validateVerificationEvidence({
    method: "professional_body",
    credentialBasis: "non_regulated_role",
    checklist: completeChecklist,
    sources: ["Applicant membership information"],
    note: "Applicant supplied membership information but the organisation was not independently contacted.",
  })
  assert.equal(invalid.ok, false)
})

test("verification cannot pass with unchecked controls, no sources or a token note", () => {
  const result = validateVerificationEvidence({
    method: "mixed_evidence",
    credentialBasis: "professional_membership",
    checklist: { ...completeChecklist, affiliationChecked: false },
    sources: [],
    note: "checked",
  })
  assert.equal(result.ok, false)
  assert.match(result.errors.join(" "), /affiliationChecked/)
  assert.match(result.errors.join(" "), /source/i)
  assert.match(result.errors.join(" "), /20 characters/i)
})

test("verification sources are normalised, deduplicated and bounded", () => {
  const result = normaliseVerificationEvidence({
    method: "mixed_evidence",
    credentialBasis: "professional_membership",
    checklist: completeChecklist,
    sources: [" Official body ", "Official body", "Organisation", "Register", "Employer", "Directory", "Extra"],
    note: "  A sufficiently detailed verification note for the audit trail.  ",
  })
  assert.deepEqual(result.sources, ["Official body", "Organisation", "Register", "Employer", "Directory", "Extra"])
  assert.equal(result.note, "A sufficiently detailed verification note for the audit trail.")
})
