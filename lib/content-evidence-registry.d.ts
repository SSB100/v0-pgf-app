export type EvidenceSource = {
  id: string
  sourceType: "guideline_context" | "method_source" | "technique_provenance" | "internal_provenance"
  title: string
  citation: string
  url?: string
  sourcePath?: string
  note: string
}

export type SkillContentRecord = {
  kind: "skill"
  slug: string
  title: string
  category: string
  approaches: readonly string[]
  evidenceIds: readonly string[]
  contentId: string
  version: string
  registryRevision: string
  reviewStatus: string
  validationStatus: string
  sourcePath: string
  aliases: readonly string[]
}

export const CONTENT_REGISTRY_REVISION: string
export const INITIAL_CONTENT_VERSION: string
export const LEGACY_CONTENT_VERSION: string
export const CONTENT_REVIEW_STATUS: string
export const CONTENT_VALIDATION_STATUS: string
export const EVIDENCE_SOURCES: Readonly<Record<string, EvidenceSource>>
export const SKILL_CONTENT: readonly SkillContentRecord[]
export function getSkillContentBySlug(slug: string): SkillContentRecord | null
export function getSkillContentByName(name: string): SkillContentRecord | null
export function getJourneyContentId(slug: string): string
export function resolveJourneyEvidenceIds(approaches?: readonly string[], title?: string): string[]
export function isSemanticContentVersion(value: string): boolean
