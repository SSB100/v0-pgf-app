export const ORGANISATION_LIFECYCLE_POLICY_VERSION = "organisation-lifecycle-v1"

function cleanText(value) {
  return typeof value === "string" ? value.trim() : ""
}

export function hasCurrentProfessionalAffiliation(input) {
  return input?.professionalStatus === "verified"
    && Boolean(input?.organisationId)
    && input?.organisationStatus === "verified"
    && input?.membershipStatus === "active"
}

export function isOrganisationAffiliationTransfer(input) {
  return Boolean(input?.currentOrganisationId)
    && Boolean(input?.nextOrganisationId)
    && input.currentOrganisationId !== input.nextOrganisationId
}

export function validateOrganisationLifecycleAction(input) {
  const action = cleanText(input?.action)
  const currentStatus = cleanText(input?.currentStatus)
  const reason = cleanText(input?.reason)
  const errors = []

  if (!["suspend", "reactivate"].includes(action)) {
    errors.push("Unsupported organisation lifecycle action")
  }

  if (reason.length < 20) {
    errors.push("Record a review reason of at least 20 characters")
  }

  if (action === "suspend" && currentStatus !== "verified") {
    errors.push("Only a currently verified organisation can be suspended")
  }

  if (action === "reactivate" && currentStatus !== "suspended") {
    errors.push("Only a suspended organisation can be reactivated")
  }

  return errors.length > 0
    ? { ok: false, errors }
    : {
        ok: true,
        value: {
          action,
          currentStatus,
          reason: reason.slice(0, 2000),
          policyVersion: ORGANISATION_LIFECYCLE_POLICY_VERSION,
        },
      }
}
