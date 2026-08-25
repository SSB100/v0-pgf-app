import test from "node:test"
import assert from "node:assert/strict"
import {
  canAdminManageProfessionals,
  canProfessionalAccessClientData,
  canProfessionalViewClientSummary,
} from "../lib/access-policy.mjs"

const baseProfessional = {
  professionalStatus: "verified",
  organisationId: "org-1",
  organisationStatus: "verified",
  mfaStatus: "active",
  sessionMfaVerified: true,
}

test("professional access requires every trust gate", () => {
  assert.equal(canProfessionalAccessClientData(baseProfessional), true)
  assert.equal(canProfessionalAccessClientData({ ...baseProfessional, professionalStatus: "pending" }), false)
  assert.equal(canProfessionalAccessClientData({ ...baseProfessional, organisationId: null }), false)
  assert.equal(canProfessionalAccessClientData({ ...baseProfessional, organisationStatus: "pending" }), false)
  assert.equal(canProfessionalAccessClientData({ ...baseProfessional, mfaStatus: "disabled" }), false)
  assert.equal(canProfessionalAccessClientData({ ...baseProfessional, sessionMfaVerified: false }), false)
})

test("client summary requires active relationship and grant", () => {
  assert.equal(canProfessionalViewClientSummary({ ...baseProfessional, linkStatus: "active", hasActiveGrant: true }), true)
  assert.equal(canProfessionalViewClientSummary({ ...baseProfessional, linkStatus: "paused", hasActiveGrant: true }), false)
  assert.equal(canProfessionalViewClientSummary({ ...baseProfessional, linkStatus: "active", hasActiveGrant: false }), false)
})

test("administrative verification requires admin role and strong authentication", () => {
  assert.equal(canAdminManageProfessionals({ role: "admin", mfaStatus: "active", sessionMfaVerified: true }), true)
  assert.equal(canAdminManageProfessionals({ role: "admin", mfaStatus: "active", sessionMfaVerified: false }), false)
  assert.equal(canAdminManageProfessionals({ role: "professional", mfaStatus: "active", sessionMfaVerified: true }), false)
})
