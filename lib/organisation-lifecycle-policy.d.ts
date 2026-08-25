export const ORGANISATION_LIFECYCLE_POLICY_VERSION: string

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

export function validateOrganisationLifecycleAction(input: OrganisationLifecycleActionInput): OrganisationLifecycleValidationResult
