import test from "node:test"
import assert from "node:assert/strict"
import {
  CONTENT_VALIDATION_STATUS,
  EVIDENCE_SOURCES,
  SKILL_CONTENT,
  getJourneyContentId,
  getSkillContentByName,
  getSkillContentBySlug,
  isSemanticContentVersion,
  resolveJourneyEvidenceIds,
} from "../lib/content-evidence-registry.mjs"

test("all governed skills have unique stable IDs, versions and valid evidence references", () => {
  assert.equal(SKILL_CONTENT.length, 14)
  const slugs = new Set()
  const contentIds = new Set()

  for (const skill of SKILL_CONTENT) {
    assert.equal(slugs.has(skill.slug), false, `duplicate skill slug ${skill.slug}`)
    assert.equal(contentIds.has(skill.contentId), false, `duplicate content ID ${skill.contentId}`)
    slugs.add(skill.slug)
    contentIds.add(skill.contentId)

    assert.equal(isSemanticContentVersion(skill.version), true, `invalid version for ${skill.slug}`)
    assert.equal(skill.validationStatus, CONTENT_VALIDATION_STATUS)
    assert.ok(skill.evidenceIds.length >= 2)
    for (const evidenceId of skill.evidenceIds) {
      assert.ok(EVIDENCE_SOURCES[evidenceId], `${skill.slug} references missing evidence source ${evidenceId}`)
    }
  }
})

test("skill aliases resolve to the governed content record", () => {
  assert.equal(getSkillContentBySlug("interpersonal/fast")?.title, "FAST")
  assert.equal(getSkillContentByName("FAST")?.slug, "interpersonal/fast")
  assert.equal(getSkillContentByName("Distress Tolerance")?.slug, "distress-tolerance")
  assert.equal(getSkillContentByName("not a governed waypoint skill"), null)
})

test("journey evidence mapping preserves the source-method boundary", () => {
  const dbt = resolveJourneyEvidenceIds(["DBT-informed"], "Opposite Action")
  assert.ok(dbt.includes("linehan-dbt-skills-2025"))

  const motivation = resolveJourneyEvidenceIds(["Motivational reflection", "Transtheoretical model"], "Motivation for Change")
  assert.ok(motivation.includes("miller-rollnick-mi-2023"))
  assert.ok(motivation.includes("prochaska-diclemente-norcross-1992"))

  const cbt = resolveJourneyEvidenceIds(["CBT-informed"], "Thinking Patterns")
  assert.ok(cbt.includes("beck-cbt-2020"))

  const act = resolveJourneyEvidenceIds(["Values-based reflection", "Acceptance-based approaches"], "Values")
  assert.ok(act.includes("hayes-act-2011"))

  const urgeSurfing = resolveJourneyEvidenceIds(["Relapse prevention"], "Grounding, Breath, RAIN & Urge Surfing")
  assert.ok(urgeSurfing.includes("marlatt-donovan-relapse-2005"))
  assert.ok(urgeSurfing.includes("brach-rain"))

  for (const mapped of [dbt, motivation, cbt, act, urgeSurfing]) {
    assert.ok(mapped.includes("nice-ng248-2025"))
    assert.ok(mapped.includes("internal-curriculum-review-2026-08"))
  }
})

test("Journey content IDs are stable and do not depend on display titles", () => {
  assert.equal(getJourneyContentId("understanding-the-pattern"), "waypoint.journey.understanding-the-pattern")
  assert.equal(getJourneyContentId("interpersonal/dear-man"), "waypoint.journey.interpersonal.dear-man")
})
