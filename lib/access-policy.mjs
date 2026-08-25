export function canProfessionalAccessClientData(input) {
  return input.professionalStatus === "verified"
    && Boolean(input.organisationId)
    && input.organisationStatus === "verified"
    && input.membershipStatus === "active"
    && input.mfaStatus === "active"
    && input.sessionMfaVerified === true
}

export function canAdminManageProfessionals(input) {
  return input.role === "admin"
    && input.mfaStatus === "active"
    && input.sessionMfaVerified === true
}

export function canAdminActOnProfessionalTarget(input) {
  return Boolean(input.actorUserId)
    && Boolean(input.targetUserId)
    && input.actorUserId !== input.targetUserId
}

export function canProfessionalViewClientSummary(input) {
  return canProfessionalAccessClientData(input)
    && input.linkStatus === "active"
    && input.hasActiveGrant === true
}

export function canUseClientSurface(input) {
  return input.role === "client"
}

export function canUseProfessionalSurface(input) {
  return input.role === "professional"
}

export function canExposeScopeDerivedMetadata(input) {
  return Array.isArray(input.activeScopes)
    && typeof input.requiredScope === "string"
    && input.activeScopes.includes(input.requiredScope)
}
