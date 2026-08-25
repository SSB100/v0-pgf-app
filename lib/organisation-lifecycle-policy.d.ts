export const ORGANISATION_LIFECYCLE_POLICY_VERSION: string

export type ProfessionalAffiliationInput = {
  professionalStatus: string | null
  organisationId: string | null
  organisationStatus: string | null
  membershipStatus: string | null
}

export type OrganisationAffiliationTransferInput = {
  currentOrganisationId: string | null
  nextOrganisationId: string | null
}

export type OrganisationLifecycleActionInput = {
  action: string | null
  currentStatus: string | null
  reason: string | null
}

export type OrganisationLifecycleValidationResult =
  | { ok: false; errors: string[] }
  | {
      ok: true
      value: {
        action: "suspend" | "reactivate"
        currentStatus: string
        reason: string
        policyVersion: string
      }
    }

export function hasCurrentProfessionalAffiliation(input: ProfessionalAffiliationInput): boolean
export function isOrganisationAffiliationTransfer(input: OrganisationAffiliationTransferInput): boolean
export function validateOrganisationLifecycleAction(input: OrganisationLifecycleActionInput): OrganisationLifecycleValidationResult
