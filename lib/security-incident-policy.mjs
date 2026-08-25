export const SECURITY_INCIDENT_POLICY_VERSION = "security-incident-v1"

export const INCIDENT_TYPES = Object.freeze(["privacy", "security", "availability", "integrity", "supplier", "other"])
export const INCIDENT_STATUSES = Object.freeze(["open", "contained", "monitoring", "closed"])
export const INCIDENT_SEVERITIES = Object.freeze(["low", "moderate", "high", "critical"])
export const SERIOUS_HARM_ASSESSMENTS = Object.freeze(["not_assessed", "unlikely", "possible", "likely"])
export const OPC_NOTIFICATION_STATUSES = Object.freeze(["not_assessed", "not_required", "planned", "notified"])
export const AFFECTED_NOTIFICATION_STATUSES = Object.freeze(["not_assessed", "not_required", "planned", "notified", "exception_applied"])

function cleanText(value, maxLength) {
  if (typeof value !== "string") return ""
  return value.trim().slice(0, maxLength)
}

function oneOf(value, allowed, fallback) {
  return allowed.includes(value) ? value : fallback
}

export function validateIncidentCreate(input = {}) {
  const title = cleanText(input.title, 180)
  const summary = cleanText(input.summary, 4000)
  const detectedAt = typeof input.detectedAt === "string" ? input.detectedAt : ""
  const parsedDetectedAt = detectedAt ? new Date(detectedAt) : null
  const affectedPeopleEstimate = Number.isInteger(input.affectedPeopleEstimate) && input.affectedPeopleEstimate >= 0
    ? Math.min(input.affectedPeopleEstimate, 100000000)
    : null

  const errors = []
  if (title.length < 3) errors.push("Provide a short incident title")
  if (summary.length < 10) errors.push("Provide a concise incident summary")
  if (!parsedDetectedAt || Number.isNaN(parsedDetectedAt.getTime())) errors.push("Provide when the incident was detected")

  if (errors.length > 0) return { ok: false, errors }

  return {
    ok: true,
    errors: [],
    value: {
      title,
      summary,
      incidentType: oneOf(input.incidentType, INCIDENT_TYPES, "other"),
      severity: oneOf(input.severity, INCIDENT_SEVERITIES, "moderate"),
      detectedAt: parsedDetectedAt.toISOString(),
      affectedPeopleEstimate,
      personalInformationInvolved: input.personalInformationInvolved === true,
      healthInformationInvolved: input.healthInformationInvolved === true,
      maoriDataInvolved: input.maoriDataInvolved === true,
      policyVersion: SECURITY_INCIDENT_POLICY_VERSION,
    },
  }
}

export function validateIncidentUpdate(input = {}) {
  return {
    ok: true,
    errors: [],
    value: {
      status: oneOf(input.status, INCIDENT_STATUSES, "open"),
      severity: oneOf(input.severity, INCIDENT_SEVERITIES, "moderate"),
      seriousHarmAssessment: oneOf(input.seriousHarmAssessment, SERIOUS_HARM_ASSESSMENTS, "not_assessed"),
      opcNotificationStatus: oneOf(input.opcNotificationStatus, OPC_NOTIFICATION_STATUSES, "not_assessed"),
      affectedPeopleNotificationStatus: oneOf(input.affectedPeopleNotificationStatus, AFFECTED_NOTIFICATION_STATUSES, "not_assessed"),
      containmentSummary: cleanText(input.containmentSummary, 4000),
      notificationDecisionReason: cleanText(input.notificationDecisionReason, 4000),
      policyVersion: SECURITY_INCIDENT_POLICY_VERSION,
    },
  }
}

export function incidentRequiresEscalation(input = {}) {
  return input.seriousHarmAssessment === "possible"
    || input.seriousHarmAssessment === "likely"
    || input.severity === "high"
    || input.severity === "critical"
}

export function canCloseIncident(input = {}) {
  if (input.seriousHarmAssessment === "not_assessed" || input.seriousHarmAssessment === "possible") {
    return { ok: false, reason: "Serious-harm assessment must be resolved before closure" }
  }

  if (input.seriousHarmAssessment === "likely") {
    if (input.opcNotificationStatus !== "notified") {
      return { ok: false, reason: "A likely-serious-harm incident cannot close until Privacy Commissioner notification is recorded" }
    }
    if (!["notified", "exception_applied"].includes(input.affectedPeopleNotificationStatus)) {
      return { ok: false, reason: "Affected-person notification or a documented statutory exception must be recorded before closure" }
    }
  }

  if (input.seriousHarmAssessment === "unlikely") {
    if (!["not_required", "notified"].includes(input.opcNotificationStatus)) {
      return { ok: false, reason: "Record the Privacy Commissioner notification decision before closure" }
    }
    if (!["not_required", "notified", "exception_applied"].includes(input.affectedPeopleNotificationStatus)) {
      return { ok: false, reason: "Record the affected-person notification decision before closure" }
    }
  }

  return { ok: true, reason: null }
}
