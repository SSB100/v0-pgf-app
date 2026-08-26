import assert from "node:assert/strict"
import fs from "node:fs"
import test from "node:test"

const read = (path) => fs.readFileSync(new URL(`../${path}`, import.meta.url), "utf8")

test("guided Journey completion submits quick-check and exercise response only on completion", () => {
  const guided = read("components/journey/guided-learning-module-v2.tsx")
  const exercise = read("components/journey/journey-exercise.tsx")

  assert.match(guided, /response:\s*\{[\s\S]*quickCheck:\s*\{ selectedOptionIndex: Number\(selectedCheck\) \}[\s\S]*exercise: exerciseResponse/)
  assert.match(guided, /onResponseChange=\{setExerciseResponse\}/)
  assert.match(exercise, /onResponseChange\?\.\(\{/)
  assert.match(exercise, /kind: exercise\.kind/)
  assert.match(exercise, /selectedIds: selected/)
  assert.match(exercise, /sortAnswers,/)
  assert.match(exercise, /sequenceIds: sequence/)
  assert.doesNotMatch(exercise, /fetch\(/)
})

test("Journey completion explains privacy, replacement semantics and repeat credits", () => {
  const guided = read("components/journey/guided-learning-module-v2.tsx")
  const privacyNotice = read("components/journey/journey-response-privacy-notice.tsx")
  const dialog = read("components/journey/module-completion-dialog.tsx")

  assert.match(guided, /replaces your previous saved response/)
  assert.match(guided, /Repeats do not add another Growth Credit/)
  assert.match(privacyNotice, /private by default/i)
  assert.match(privacyNotice, /journey_responses/)
  assert.match(privacyNotice, /\/privacy#professional-sharing/)
  assert.match(dialog, /No additional Growth Credit/)
  assert.match(dialog, /updates its saved response but does not add another credit/)
})

test("Privacy Centre requires an explicit history decision when first enabling Journey responses", () => {
  const privacy = read("components/privacy/privacy-centre-client.tsx")

  assert.match(privacy, /id="professional-sharing"/)
  assert.match(privacy, /addingJourneyResponses/)
  assert.match(privacy, /journeyResponsesHistoryMode/)
  assert.match(privacy, /include_previous/)
  assert.match(privacy, /new_only/)
  assert.match(privacy, /Share previous \+ future responses/)
  assert.match(privacy, /Share new responses only/)
  assert.match(privacy, /addingJourneyResponses && !journeyHistoryChoice/)
})

test("professional invitation acceptance uses the same Journey history decision", () => {
  const invitation = read("components/professional/connect-professional-client.tsx")

  assert.match(invitation, /journeyResponsesHistoryMode/)
  assert.match(invitation, /include_previous/)
  assert.match(invitation, /new_only/)
  assert.match(invitation, /journeyResponseCount/)
  assert.match(invitation, /sharingJourneyResponses && !journeyHistoryMode/)
  assert.match(invitation, /High sensitivity/)
})

test("professional workspace displays Journey responses only as a distinct consented section", () => {
  const dashboard = read("components/professional/professional-dashboard-client.tsx")
  const responses = read("components/professional/journey-responses-summary.tsx")

  assert.match(dashboard, /journeyResponses\?: JourneyResponsesSummary/)
  assert.match(dashboard, /JourneyResponsesSummarySection summary=\{summary\.journeyResponses\}/)
  assert.match(dashboard, /Journey progress[\s\S]*completion\/progress only/)
  assert.match(dashboard, /distinct Journey responses permission/)
  assert.doesNotMatch(dashboard, /Private free text, Journey answers/)
  assert.match(responses, /client-entered quick-check and exercise responses/)
  assert.match(responses, /not a clinical record, diagnosis, risk score or live-monitoring signal/)
  assert.match(responses, /historyMode/)
})
