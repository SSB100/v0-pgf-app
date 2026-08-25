import { JOURNEY_MODULES } from "@/lib/journey-curriculum"
import {
  CONTENT_REGISTRY_REVISION,
  CONTENT_REVIEW_STATUS,
  CONTENT_VALIDATION_STATUS,
  EVIDENCE_SOURCES,
  INITIAL_CONTENT_VERSION,
  SKILL_CONTENT,
  getJourneyContentId,
  getSkillContentByName,
  getSkillContentBySlug,
  isSemanticContentVersion,
  resolveJourneyEvidenceIds,
} from "@/lib/content-evidence-registry.mjs"

export type ClinicalContentKind = "journey_module" | "skill"
export type EvidenceSource = (typeof EVIDENCE_SOURCES)[keyof typeof EVIDENCE_SOURCES]
export type SkillContentRecord = (typeof SKILL_CONTENT)[number]

export type ClinicalContentRecord = {
  kind: ClinicalContentKind
  contentId: string
  slug: string
  title: string
  category: string
  version: string
  registryRevision: string
  approaches: readonly string[]
  evidenceIds: readonly string[]
  sourcePath: string
  reviewStatus: string
  validationStatus: string
}

export {
  CONTENT_REGISTRY_REVISION,
  CONTENT_REVIEW_STATUS,
  CONTENT_VALIDATION_STATUS,
  EVIDENCE_SOURCES,
  INITIAL_CONTENT_VERSION,
  SKILL_CONTENT,
  getSkillContentByName,
  getSkillContentBySlug,
}

const journeyRecords: ClinicalContentRecord[] = JOURNEY_MODULES.map((module) => ({
  kind: "journey_module",
  contentId: getJourneyContentId(module.slug),
  slug: module.slug,
  title: module.title,
  category: module.category,
  version: INITIAL_CONTENT_VERSION,
  registryRevision: CONTENT_REGISTRY_REVISION,
  approaches: module.approaches,
  evidenceIds: resolveJourneyEvidenceIds(module.approaches, module.title),
  sourcePath: "lib/journey-curriculum.ts",
  reviewStatus: CONTENT_REVIEW_STATUS,
  validationStatus: CONTENT_VALIDATION_STATUS,
}))

const skillRecords: ClinicalContentRecord[] = SKILL_CONTENT.map((item) => ({
  kind: "skill",
  contentId: item.contentId,
  slug: item.slug,
  title: item.title,
  category: item.category,
  version: item.version,
  registryRevision: item.registryRevision,
  approaches: item.approaches,
  evidenceIds: item.evidenceIds,
  sourcePath: item.sourcePath,
  reviewStatus: item.reviewStatus,
  validationStatus: item.validationStatus,
}))

export const CLINICAL_CONTENT_REGISTRY: readonly ClinicalContentRecord[] = Object.freeze([
  ...journeyRecords,
  ...skillRecords,
])

const BY_CONTENT_ID = new Map(CLINICAL_CONTENT_REGISTRY.map((record) => [record.contentId, record]))
const JOURNEY_BY_SLUG = new Map(journeyRecords.map((record) => [record.slug, record]))

export function getClinicalContentById(contentId: string) {
  return BY_CONTENT_ID.get(contentId) ?? null
}

export function getJourneyContentRecord(slug: string) {
  return JOURNEY_BY_SLUG.get(slug) ?? null
}

function assertRegistryIntegrity() {
  const contentIds = new Set<string>()
  for (const record of CLINICAL_CONTENT_REGISTRY) {
    if (contentIds.has(record.contentId)) throw new Error(`Duplicate clinical content ID: ${record.contentId}`)
    contentIds.add(record.contentId)

    if (!isSemanticContentVersion(record.version)) {
      throw new Error(`Clinical content ${record.contentId} has an invalid version: ${record.version}`)
    }
    if (record.evidenceIds.length === 0) throw new Error(`Clinical content ${record.contentId} has no provenance/evidence references`)
    for (const evidenceId of record.evidenceIds) {
      if (!(evidenceId in EVIDENCE_SOURCES)) throw new Error(`Clinical content ${record.contentId} references unknown evidence source: ${evidenceId}`)
    }
    if (record.validationStatus !== CONTENT_VALIDATION_STATUS) {
      throw new Error(`Clinical content ${record.contentId} has an unexpected validation status`)
    }
  }
}

assertRegistryIntegrity()
