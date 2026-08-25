import test from "node:test"
import assert from "node:assert/strict"
import {
  canCloseIncident,
  incidentRequiresEscalation,
  validateIncidentCreate,
  validateIncidentUpdate,
} from "../lib/security-incident-policy.mjs"

test("incident creation rejects incomplete operational records", () => {
  const result = validateIncidentCreate({ title: "x", summary: "short", detectedAt: "bad" })
  assert.equal(result.ok, false)
  assert.ok(result.errors.length >= 2)
})

test("possible serious harm remains an escalation state", () => {
  assert.equal(incidentRequiresEscalation({ seriousHarmAssessment: "possible", severity: "moderate" }), true)
  const close = canCloseIncident({
    seriousHarmAssessment: "possible",
    opcNotificationStatus: "planned",
    affectedPeopleNotificationStatus: "planned",
  })
  assert.equal(close.ok, false)
})

test("likely serious harm cannot close without Commissioner and affected-person decisions", () => {
  const incomplete = canCloseIncident({
    seriousHarmAssessment: "likely",
    opcNotificationStatus: "planned",
    affectedPeopleNotificationStatus: "planned",
  })
  assert.equal(incomplete.ok, false)

  const complete = canCloseIncident({
    seriousHarmAssessment: "likely",
    opcNotificationStatus: "notified",
    affectedPeopleNotificationStatus: "notified",
  })
  assert.equal(complete.ok, true)
})

test("unlikely serious harm still requires the notification decision to be recorded before closure", () => {
  const unresolved = canCloseIncident({
    seriousHarmAssessment: "unlikely",
    opcNotificationStatus: "not_assessed",
    affectedPeopleNotificationStatus: "not_assessed",
  })
  assert.equal(unresolved.ok, false)

  const resolved = canCloseIncident({
    seriousHarmAssessment: "unlikely",
    opcNotificationStatus: "not_required",
    affectedPeopleNotificationStatus: "not_required",
  })
  assert.equal(resolved.ok, true)
})

test("policy normalises unexpected update enums to safe unresolved states", () => {
  const update = validateIncidentUpdate({ status: "deleted", seriousHarmAssessment: "certain" })
  assert.equal(update.ok, true)
  assert.equal(update.value?.status, "open")
  assert.equal(update.value?.seriousHarmAssessment, "not_assessed")
})
