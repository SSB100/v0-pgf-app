export const PROFESSIONAL_VERIFICATION_POLICY_VERSION = "professional-verification-v1"

export const VERIFICATION_METHODS = Object.freeze([
  "authoritative_register",
  "professional_body",
  "organisation_confirmation",
  "mixed_evidence",
])

export const CREDENTIAL_BASES = Object.freeze([
  "regulated_registration",
  "professional_membership",
  "non_regulated_role",
])

export const REQUIRED_VERIFICATION_CHECKS = Object.freeze([
  "identityChecked",
  "credentialBasisChecked",
  "organisationChecked",
  "affiliationChecked",
  "sourcesRecorded",
])

function cleanText(value, max = 300) {
  return typeof value === "string" ? value.trim().slice(0, max) : ""
}

export function normaliseVerificationEvidence(input) {
  const source = input && typeof input === "object" ? input : {}
  const rawChecklist = source.checklist && typeof source.checklist === "object" ? source.checklist : {}
  const checklist = Object.fromEntries(REQUIRED_VERIFICATION_CHECKS.map((key) => [key, rawChecklist[key] === true]))
  const sources = Array.isArray(source.sources)
    ? [...new Set(source.sources.map((item) => cleanText(item, 500)).filter(Boolean))].slice(0, 6)
    : []

  return {
    policyVersion: PROFESSIONAL_VERIFICATION_POLICY_VERSION,
    method: VERIFICATION_METHODS.includes(source.method) ? source.method : "",
    credentialBasis: CREDENTIAL_BASES.includes(source.credentialBasis) ? source.credentialBasis : "",
    checklist,
    sources,
    note: cleanText(source.note, 2000),
  }
}

export function validateVerificationEvidence(input) {
  const value = normaliseVerificationEvidence(input)
  const errors = []

  if (!value.method) errors.push("Select how the verification was completed")
  if (!value.credentialBasis) errors.push("Record the professional credential or role basis")
  for (const check of REQUIRED_VERIFICATION_CHECKS) {
    if (!value.checklist[check]) errors.push(`Required verification check not confirmed: ${check}`)
  }
  if (value.sources.length === 0) errors.push("Record at least one independent verification source")
  if (value.note.length < 20) errors.push("Record a verification note of at least 20 characters")

  if (value.credentialBasis === "regulated_registration" && !["authoritative_register", "mixed_evidence"].includes(value.method)) {
    errors.push("Regulated registration must include an authoritative register check")
  }

  if (value.credentialBasis === "non_regulated_role" && !["organisation_confirmation", "mixed_evidence"].includes(value.method)) {
    errors.push("A non-regulated role must be independently confirmed with the organisation")
  }

  return { ok: errors.length === 0, errors, value }
}
