import test from "node:test"
import assert from "node:assert/strict"
import {
  canAdminActOnProfessionalTarget,
  canAdminManageProfessionals,
  canExposeScopeDerivedMetadata,
  canProfessionalAccessClientData,
  canProfessionalViewClientSummary,
  canUseClientSurface,
  canUseProfessionalSurface,
} from "../lib/access-policy.mjs"

const baseProfessional = {
  professionalStatus: "verified",
  organisationId: "org-1",
  organisationStatus: "verified",
  membershipStatus: "active",
  mfaStatus: "active",
  sessionMfaVerified: true,
}

test("professional access requires every trust gate including active organisation membership", () => {
  assert.equal(canProfessionalAccessClientData(baseProfessional), true)
  assert.equal(canProfessionalAccessClientData({ ...baseProfessional, professionalStatus: "pending" }), false)
  assert.equal(canProfessionalAccessClientData({ ...baseProfessional, organisationId: null }), false)
  assert.equal(canProfessionalAccessClientData({ ...baseProfessional, organisationStatus: "pending" }), false)
  assert.equal(canProfessionalAccessClientData({ ...baseProfessional, membershipStatus: "suspended" }), false)
  assert.equal(canProfessionalAccessClientData({ ...baseProfessional, membershipStatus: null }), false)
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

test("administrator cannot act on their own professional account", () => {
  assert.equal(canAdminActOnProfessionalTarget({ actorUserId: "user-1", targetUserId: "user-1" }), false)
  assert.equal(canAdminActOnProfessionalTarget({ actorUserId: "user-1", targetUserId: "user-2" }), true)
  assert.equal(canAdminActOnProfessionalTarget({ actorUserId: null, targetUserId: "user-2" }), false)
})

test("client-only surfaces reject professional and admin identities", () => {
  assert.equal(canUseClientSurface({ role: "client" }), true)
  assert.equal(canUseClientSurface({ role: "professional" }), false)
  assert.equal(canUseClientSurface({ role: "admin" }), false)
  assert.equal(canUseClientSurface({ role: null }), false)
})

test("professional surfaces require the exact professional role", () => {
  assert.equal(canUseProfessionalSurface({ role: "professional" }), true)
  assert.equal(canUseProfessionalSurface({ role: "client" }), false)
  assert.equal(canUseProfessionalSurface({ role: "admin" }), false)
  assert.equal(canUseProfessionalSurface({ role: null }), false)
})

test("scope-derived activity metadata is exposed only for the matching active scope", () => {
  assert.equal(canExposeScopeDerivedMetadata({ activeScopes: ["daily_checkins_summary"], requiredScope: "daily_checkins_summary" }), true)
  assert.equal(canExposeScopeDerivedMetadata({ activeScopes: ["journey_progress"], requiredScope: "daily_checkins_summary" }), false)
  assert.equal(canExposeScopeDerivedMetadata({ activeScopes: [], requiredScope: "daily_checkins_summary" }), false)
  assert.equal(canExposeScopeDerivedMetadata({ activeScopes: null, requiredScope: "daily_checkins_summary" }), false)
})
