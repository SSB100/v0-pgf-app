export const PROFESSIONAL_VERIFICATION_POLICY_VERSION: "professional-verification-v1"
export const VERIFICATION_METHODS: readonly ["authoritative_register", "professional_body", "organisation_confirmation", "mixed_evidence"]
export const CREDENTIAL_BASES: readonly ["regulated_registration", "professional_membership", "non_regulated_role"]
export const REQUIRED_VERIFICATION_CHECKS: readonly ["identityChecked", "credentialBasisChecked", "organisationChecked", "affiliationChecked", "sourcesRecorded"]

export type VerificationEvidence = {
  policyVersion: string
  method: string
  credentialBasis: string
  checklist: Record<string, boolean>
  sources: string[]
  note: string
}

export function normaliseVerificationEvidence(input: unknown): VerificationEvidence
export function validateVerificationEvidence(input: unknown): { ok: boolean; errors: string[]; value: VerificationEvidence }
