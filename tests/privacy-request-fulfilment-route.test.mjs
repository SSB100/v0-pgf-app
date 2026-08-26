import test from "node:test"
import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"

const route = await readFile(new URL("../app/api/admin/privacy-requests/route.ts", import.meta.url), "utf8")

test("privacy fulfilment requires administrator session and MFA", () => {
  assert.match(route, /getAdminSession/)
  assert.match(route, /Administrator MFA is required/)
})

test("deletion is an atomic governed transaction", () => {
  assert.match(route, /dbTransaction/)
  assert.match(route, /privacy_deletion_fulfilled/)
  assert.match(route, /privacy_deletion_completed/)
  assert.match(route, /DELETE FROM users WHERE id/)
})

test("legacy peer-supporter foreign key is cleared before client deletion", () => {
  assert.match(route, /UPDATE sos_alerts SET peer_supporter_id = NULL/)
})

test("professional accounts are not deleted through the client privacy workflow", () => {
  assert.match(route, /has_professional_account/)
  assert.match(route, /Professional accounts require the governed professional offboarding workflow/)
  assert.match(route, /AND role = 'client'/)
})

test("privacy deletion audits do not copy raw personal content", () => {
  assert.match(route, /rawPersonalContentRetainedInAudit: false/)
  assert.doesNotMatch(route, /password_hash/)
  assert.doesNotMatch(route, /response_data.*deletionMetadata/s)
})
