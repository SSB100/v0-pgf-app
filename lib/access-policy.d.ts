export type ProfessionalAccessPolicyInput = {
  professionalStatus: string | null
  organisationId: string | null
  organisationStatus: string | null
  membershipStatus: string | null
  mfaStatus: string | null
  sessionMfaVerified: boolean
}

export function canProfessionalAccessClientData(input: ProfessionalAccessPolicyInput): boolean
export function canAdminManageProfessionals(input: { role: string | null; mfaStatus: string | null; sessionMfaVerified: boolean }): boolean
export function canAdminActOnProfessionalTarget(input: { actorUserId: string | null; targetUserId: string | null }): boolean
export function canProfessionalViewClientSummary(input: ProfessionalAccessPolicyInput & { linkStatus: string | null; hasActiveGrant: boolean }): boolean
export function canUseClientSurface(input: { role: string | null }): boolean
export function canUseProfessionalSurface(input: { role: string | null }): boolean
export function canExposeScopeDerivedMetadata(input: { activeScopes: unknown; requiredScope: string }): boolean
