import test from "node:test"
import assert from "node:assert/strict"
import {
  PRIVACY_DELETION_CONFIRMATION,
  validatePrivacyRequestAction,
} from "../lib/privacy-request-policy.mjs"

const note = "Identity and scope were reviewed before this request was resolved."

function validate(overrides = {}) {
  return validatePrivacyRequestAction({
    action: "start_review",
    requestType: "deletion",
    status: "requested",
    subjectRole: "client",
    resolutionNote: "",
    confirmation: "",
    ...overrides,
  })
}

test("requested privacy request can move into review without destructive confirmation", () => {
  assert.equal(validate().ok, true)
})

test("completed or declined privacy requests cannot be actioned again", () => {
  assert.equal(validate({ status: "completed" }).ok, false)
  assert.equal(validate({ status: "declined" }).ok, false)
})

test("correction completion requires a correction request and substantive note", () => {
  assert.equal(validate({ action: "complete_correction", requestType: "correction", status: "in_review", resolutionNote: note }).ok, true)
  assert.equal(validate({ action: "complete_correction", requestType: "deletion", status: "in_review", resolutionNote: note }).ok, false)
  assert.equal(validate({ action: "complete_correction", requestType: "correction", status: "in_review", resolutionNote: "too short" }).ok, false)
})

test("deletion is restricted to client deletion requests with exact confirmation", () => {
  const valid = validate({
    action: "complete_deletion",
    requestType: "deletion",
    status: "in_review",
    subjectRole: "client",
    resolutionNote: note,
    confirmation: PRIVACY_DELETION_CONFIRMATION,
  })
  assert.equal(valid.ok, true)

  assert.equal(validate({ action: "complete_deletion", requestType: "deletion", status: "in_review", subjectRole: "professional", resolutionNote: note, confirmation: PRIVACY_DELETION_CONFIRMATION }).ok, false)
  assert.equal(validate({ action: "complete_deletion", requestType: "correction", status: "in_review", subjectRole: "client", resolutionNote: note, confirmation: PRIVACY_DELETION_CONFIRMATION }).ok, false)
  assert.equal(validate({ action: "complete_deletion", requestType: "deletion", status: "in_review", subjectRole: "client", resolutionNote: note, confirmation: "DELETE" }).ok, false)
})

test("declining an open request requires a substantive resolution note", () => {
  assert.equal(validate({ action: "decline", status: "requested", resolutionNote: note }).ok, true)
  assert.equal(validate({ action: "decline", status: "in_review", resolutionNote: "no" }).ok, false)
})
