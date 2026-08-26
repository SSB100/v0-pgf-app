import assert from "node:assert/strict"
import fs from "node:fs"
import test from "node:test"

const read = (path) => fs.readFileSync(new URL(`../${path}`, import.meta.url), "utf8")

test("migration creates private current-response storage and explicit Journey history mode", () => {
  const migration = read("scripts/028_journey_response_sharing.sql")
  assert.match(migration, /CREATE TABLE IF NOT EXISTS journey_module_responses/)
  assert.match(migration, /UNIQUE\(user_id, module_slug\)/)
  assert.match(migration, /include_pre_grant_data BOOLEAN/)
  assert.match(migration, /'journey_responses'/)
  assert.match(migration, /data_scope <> 'journey_responses' OR include_pre_grant_data IS NOT NULL/)
  assert.match(migration, /sharing_grants_data_scope_check_v2/)
  assert.match(migration, /ADD CONSTRAINT sharing_grants_data_scope_check_v2[\s\S]*NOT VALID/)
  assert.match(migration, /VALIDATE CONSTRAINT sharing_grants_data_scope_check_v2/)
  assert.match(migration, /DROP CONSTRAINT sharing_grants_data_scope_check;[\s\S]*RENAME CONSTRAINT sharing_grants_data_scope_check_v2/)
  assert.match(migration, /ADD CONSTRAINT sharing_grants_journey_history_check[\s\S]*NOT VALID/)
  assert.match(migration, /VALIDATE CONSTRAINT sharing_grants_journey_history_check/)
})

test("Journey response sharing is distinct, high sensitivity and never a default grant", () => {
  const sharing = read("lib/sharing-policy.ts")
  assert.match(sharing, /id: "journey_responses"/)
  assert.match(sharing, /sensitivity: "high"/)
  assert.match(sharing, /PROFESSIONAL_REQUESTABLE_SCOPES[\s\S]*"journey_responses"/)
  assert.match(sharing, /DEFAULT_PROFESSIONAL_SHARE_SCOPES[^\n]*\["journey_progress"\]/)
})

test("completion validates server-owned responses, overwrites repeats and only rewards first completion", () => {
  const route = read("app/api/journey/complete/route.ts")
  assert.match(route, /canonicaliseJourneyResponse/)
  assert.match(route, /ON CONFLICT \(user_id, module_slug\) DO UPDATE SET/)
  assert.match(route, /ON CONFLICT \(user_id, module_slug\) DO NOTHING/)
  assert.match(route, /EXISTS \(SELECT 1 FROM completion_insert\)/)
  assert.match(route, /creditsAwarded: firstCompletion \? 1 : 0/)
  assert.match(route, /responseSaved: true/)
})

test("response policy limits free text and canonicalises against registered module content", () => {
  const policy = read("lib/journey-response-policy.ts")
  assert.match(policy, /MAX_JOURNEY_RESPONSE_TEXT_CHARS = 4_000/)
  assert.match(policy, /JOURNEY_MODULE_BY_SLUG\[moduleSlug\]/)
  assert.match(policy, /JOURNEY_EXERCISES\[moduleSlug\]/)
  assert.match(policy, /selectedOptionLabel: selectedOption.label/)
  assert.doesNotMatch(policy, /correct:/)
})

test("Journey response writes fail cleanly until the response schema is available", () => {
  const completion = read("app/api/journey/complete/route.ts")
  const sharing = read("app/api/privacy/sharing-grants/route.ts")
  const invitation = read("app/api/connect/professional/route.ts")
  const invitationClient = read("components/professional/connect-professional-client.tsx")

  assert.match(completion, /dbTableExists\("journey_module_responses"\)/)
  assert.match(completion, /Journey response storage has not been activated[\s\S]*status: 503/)
  assert.match(sharing, /addingJourneyResponses && !\(await dbTableExists\("journey_module_responses"\)\)/)
  assert.match(sharing, /Journey response sharing has not been activated[\s\S]*status: 503/)
  assert.match(invitation, /wantsJourneyResponses && !\(await dbTableExists\("journey_module_responses"\)\)/)
  assert.match(invitation, /journeyResponsesReady/)
  assert.match(invitationClient, /disabled=\{unavailableJourneyResponses\}/)
})
