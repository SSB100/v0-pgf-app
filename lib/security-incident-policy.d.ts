export const SECURITY_INCIDENT_POLICY_VERSION: string
export const INCIDENT_TYPES: readonly string[]
export const INCIDENT_STATUSES: readonly string[]
export const INCIDENT_SEVERITIES: readonly string[]
export const SERIOUS_HARM_ASSESSMENTS: readonly string[]
export const OPC_NOTIFICATION_STATUSES: readonly string[]
export const AFFECTED_NOTIFICATION_STATUSES: readonly string[]

export function validateIncidentCreate(input?: Record<string, unknown>): {
  ok: boolean
  errors: string[]
  value?: {
    title: string
    summary: string
    incidentType: string
    severity: string
    detectedAt: string
    affectedPeopleEstimate: number | null
    personalInformationInvolved: boolean
    healthInformationInvolved: boolean
    maoriDataInvolved: boolean
    policyVersion: string
  }
}

export function validateIncidentUpdate(input?: Record<string, unknown>): {
  ok: boolean
  errors: string[]
  value?: {
    status: string
    severity: string
    seriousHarmAssessment: string
    opcNotificationStatus: string
    affectedPeopleNotificationStatus: string
    containmentSummary: string
    notificationDecisionReason: string
    policyVersion: string
  }
}

export function incidentRequiresEscalation(input?: Record<string, unknown>): boolean
export function canCloseIncident(input?: Record<string, unknown>): { ok: boolean; reason: string | null }
