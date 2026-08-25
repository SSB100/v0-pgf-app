export const CONTENT_REGISTRY_REVISION = "2026-08-25.1"
export const INITIAL_CONTENT_VERSION = "1.0.0"
export const LEGACY_CONTENT_VERSION = "legacy-unversioned"
export const CONTENT_REVIEW_STATUS = "internal_provenance_mapped_external_review_pending"
export const CONTENT_VALIDATION_STATUS = "not_clinically_validated"

export const EVIDENCE_SOURCES = Object.freeze({
  "nice-ng248-2025": {
    id: "nice-ng248-2025",
    sourceType: "guideline_context",
    title: "Gambling-related harms: identification, assessment and management",
    citation: "National Institute for Health and Care Excellence. NICE guideline NG248. Published 28 January 2025.",
    url: "https://www.nice.org.uk/guidance/ng248",
    note: "Gambling-harm guideline context. It does not validate Waypoint or every technique used in Waypoint.",
  },
  "linehan-dbt-skills-2025": {
    id: "linehan-dbt-skills-2025",
    sourceType: "method_source",
    title: "DBT Skills Training Manual, Revised Edition",
    citation: "Linehan, M. M. (2025). DBT Skills Training Manual, Revised Edition. Guilford Press. ISBN 9781462556359.",
    url: "https://www.guilford.com/books/DBT-Skills-Training-Manual/Marsha-Linehan/9781462556359",
    note: "Method/provenance source for DBT-informed skills. Waypoint does not deliver comprehensive DBT.",
  },
  "miller-rollnick-mi-2023": {
    id: "miller-rollnick-mi-2023",
    sourceType: "method_source",
    title: "Motivational Interviewing, Fourth Edition: Helping People Change and Grow",
    citation: "Miller, W. R., & Rollnick, S. (2023). Motivational Interviewing, Fourth Edition: Helping People Change and Grow. Guilford Press. ISBN 9781462552795.",
    url: "https://www.guilford.com/books/Motivational-Interviewing/Miller-Rollnick/9781462552795",
    note: "Method/provenance source for motivational and ambivalence-focused content.",
  },
  "hayes-act-2011": {
    id: "hayes-act-2011",
    sourceType: "method_source",
    title: "Acceptance and Commitment Therapy, Second Edition: The Process and Practice of Mindful Change",
    citation: "Hayes, S. C., Strosahl, K. D., & Wilson, K. G. (2011). Acceptance and Commitment Therapy, Second Edition: The Process and Practice of Mindful Change. Guilford Press. ISBN 9781609189624.",
    url: "https://www.guilford.com/books/Acceptance-and-Commitment-Therapy/Hayes-Strosahl-Wilson/9781462528943",
    note: "Method/provenance source for values, acceptance, choice-point and committed-action concepts. Waypoint does not deliver comprehensive ACT.",
  },
  "beck-cbt-2020": {
    id: "beck-cbt-2020",
    sourceType: "method_source",
    title: "Cognitive Behavior Therapy, Third Edition: Basics and Beyond",
    citation: "Beck, J. S. (2020). Cognitive Behavior Therapy, Third Edition: Basics and Beyond. Guilford Press. ISBN 9781462544196.",
    url: "https://www.guilford.com/books/Cognitive-Behavior-Therapy/Judith-Beck/9781462544196",
    note: "Method/provenance source for CBT-informed thinking and problem-solving concepts. Waypoint does not deliver comprehensive CBT.",
  },
  "marlatt-donovan-relapse-2005": {
    id: "marlatt-donovan-relapse-2005",
    sourceType: "method_source",
    title: "Relapse Prevention, Second Edition: Maintenance Strategies in the Treatment of Addictive Behaviors",
    citation: "Marlatt, G. A., & Donovan, D. M. (Eds.). (2005). Relapse Prevention, Second Edition: Maintenance Strategies in the Treatment of Addictive Behaviors. Guilford Press. ISBN 9781593856410.",
    url: "https://www.guilford.com/books/Relapse-Prevention/Marlatt-Donovan/9781593856410",
    note: "Method/provenance source for relapse prevention, high-risk situations, coping and urge-surfing concepts.",
  },
  "prochaska-diclemente-norcross-1992": {
    id: "prochaska-diclemente-norcross-1992",
    sourceType: "method_source",
    title: "In search of how people change: Applications to addictive behaviors",
    citation: "Prochaska, J. O., DiClemente, C. C., & Norcross, J. C. (1992). American Psychologist, 47(9), 1102-1114. https://doi.org/10.1037/0003-066X.47.9.1102",
    url: "https://pubmed.ncbi.nlm.nih.gov/1329589/",
    note: "Method/provenance source for stages and processes of change. Stage labels are used as flexible descriptive concepts, not as a diagnostic assessment.",
  },
  "brach-rain": {
    id: "brach-rain",
    sourceType: "technique_provenance",
    title: "RAIN: Recognize, Allow, Investigate, Nurture",
    citation: "Brach, T. RAIN: A Practice of Radical Compassion.",
    url: "https://www.tarabrach.com/rain/",
    note: "Technique provenance for the RAIN mindfulness mnemonic. This citation is not a claim of clinical efficacy for Waypoint's implementation.",
  },
  "internal-curriculum-review-2026-08": {
    id: "internal-curriculum-review-2026-08",
    sourceType: "internal_provenance",
    title: "Waypoint Journey Curriculum Review",
    citation: "Waypoint internal curriculum review, August 2026.",
    sourcePath: "docs/journey-curriculum-review.md",
    note: "Internal mapping and safety review. External clinician co-design/review remains pending.",
  },
})

function contentId(kind, slug) {
  return `waypoint.${kind}.${slug.replaceAll("/", ".")}`
}

function normaliseSkillName(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
}

function skill(slug, name, category, approaches, evidenceIds, aliases = []) {
  return Object.freeze({
    kind: "skill",
    slug,
    title: name,
    category,
    approaches: Object.freeze(approaches),
    evidenceIds: Object.freeze(["nice-ng248-2025", "internal-curriculum-review-2026-08", ...evidenceIds]),
    contentId: contentId("skill", slug),
    version: INITIAL_CONTENT_VERSION,
    registryRevision: CONTENT_REGISTRY_REVISION,
    reviewStatus: CONTENT_REVIEW_STATUS,
    validationStatus: CONTENT_VALIDATION_STATUS,
    sourcePath: `app/skills/${slug}/page.tsx`,
    aliases: Object.freeze([name, ...aliases]),
  })
}

export const SKILL_CONTENT = Object.freeze([
  skill("tip", "TIP Skills", "Distress tolerance", ["DBT-informed"], ["linehan-dbt-skills-2025"], ["TIP"]),
  skill("stop", "STOP Skill", "Distress tolerance", ["DBT-informed"], ["linehan-dbt-skills-2025"], ["STOP"]),
  skill("please", "PLEASE Skills", "Emotion regulation", ["DBT-informed"], ["linehan-dbt-skills-2025"], ["PLEASE"]),
  skill("improve", "IMPROVE Skills", "Distress tolerance", ["DBT-informed"], ["linehan-dbt-skills-2025"], ["IMPROVE"]),
  skill("rain", "RAIN Mindfulness", "Mindfulness", ["Mindfulness"], ["brach-rain"], ["RAIN"]),
  skill("opposite-action", "Opposite Action", "Emotion regulation", ["DBT-informed"], ["linehan-dbt-skills-2025"]),
  skill("interpersonal/dear-man", "DEAR MAN", "Interpersonal effectiveness", ["DBT-informed"], ["linehan-dbt-skills-2025"]),
  skill("interpersonal/give", "GIVE", "Interpersonal effectiveness", ["DBT-informed"], ["linehan-dbt-skills-2025"]),
  skill("interpersonal/fast", "FAST", "Interpersonal effectiveness", ["DBT-informed"], ["linehan-dbt-skills-2025"]),
  skill("interpersonal/problem-solving", "Problem Solving", "Problem solving", ["CBT-informed", "DBT-informed"], ["beck-cbt-2020", "linehan-dbt-skills-2025"]),
  skill("interpersonal/turning-the-mind", "Turning the Mind", "Acceptance", ["DBT-informed"], ["linehan-dbt-skills-2025"]),
  skill("reality-acceptance", "Reality Acceptance", "Acceptance", ["DBT-informed"], ["linehan-dbt-skills-2025"]),
  skill("willingness", "Willingness", "Acceptance", ["DBT-informed"], ["linehan-dbt-skills-2025"]),
  skill("distress-tolerance", "Distress Tolerance Overview", "Distress tolerance", ["DBT-informed"], ["linehan-dbt-skills-2025"], ["Distress Tolerance"]),
])

const SKILL_BY_SLUG = new Map(SKILL_CONTENT.map((item) => [item.slug, item]))
const SKILL_BY_NAME = new Map()
for (const item of SKILL_CONTENT) {
  for (const alias of item.aliases) SKILL_BY_NAME.set(normaliseSkillName(alias), item)
}

export function getSkillContentBySlug(slug) {
  return SKILL_BY_SLUG.get(String(slug || "")) || null
}

export function getSkillContentByName(name) {
  return SKILL_BY_NAME.get(normaliseSkillName(name)) || null
}

export function getJourneyContentId(slug) {
  return contentId("journey", String(slug || ""))
}

export function resolveJourneyEvidenceIds(approaches = [], title = "") {
  const values = approaches.map((value) => String(value).toLowerCase())
  const joined = values.join(" | ")
  const titleLower = String(title).toLowerCase()
  const ids = new Set(["nice-ng248-2025", "internal-curriculum-review-2026-08"])

  if (joined.includes("dbt") || joined.includes("mindfulness")) ids.add("linehan-dbt-skills-2025")
  if (joined.includes("motivational")) ids.add("miller-rollnick-mi-2023")
  if (joined.includes("transtheoretical") || joined.includes("stage")) ids.add("prochaska-diclemente-norcross-1992")
  if (joined.includes("cbt") || joined.includes("cognitive")) ids.add("beck-cbt-2020")
  if (joined.includes("act") || joined.includes("values-based") || joined.includes("acceptance-based") || joined.includes("choice point") || joined.includes("committed action")) ids.add("hayes-act-2011")
  if (joined.includes("relapse") || joined.includes("urge surfing") || titleLower.includes("urge surfing")) ids.add("marlatt-donovan-relapse-2005")
  if (titleLower.includes("rain")) ids.add("brach-rain")

  return [...ids]
}

export function isSemanticContentVersion(value) {
  return /^\d+\.\d+\.\d+$/.test(String(value || ""))
}
