import { JOURNEY_MODULE_BY_SLUG } from "@/lib/journey-curriculum"
import {
  JOURNEY_EXERCISES,
  type JourneyExerciseDefinition,
  type JourneyExerciseField,
  type JourneyExerciseOption,
} from "@/lib/journey-exercises"

export const JOURNEY_RESPONSE_SCHEMA_VERSION = "journey-response-v1"
export const MAX_JOURNEY_RESPONSE_BODY_CHARS = 32_768
export const MAX_JOURNEY_RESPONSE_TEXT_CHARS = 4_000

export type JourneyResponseHistoryMode = "include_previous" | "new_only"

export interface JourneyResponseInput {
  quickCheck?: { selectedOptionIndex?: unknown }
  exercise?: {
    kind?: unknown
    text?: unknown
    selectedIds?: unknown
    sortAnswers?: unknown
    sequenceIds?: unknown
  }
}

export interface CanonicalJourneyResponse {
  quickCheck: {
    prompt: string
    selectedOptionIndex: number
    selectedOptionLabel: string
  }
  exercise: Record<string, unknown> & { kind: JourneyExerciseDefinition["kind"] }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value)
}

function textValue(value: unknown, label: string): string {
  if (typeof value !== "string") throw new Error(`${label} is required`)
  const trimmed = value.trim()
  if (!trimmed) throw new Error(`${label} is required`)
  if (trimmed.length > MAX_JOURNEY_RESPONSE_TEXT_CHARS) throw new Error(`${label} is too long`)
  return trimmed
}

function stringRecord(value: unknown): Record<string, unknown> {
  return isRecord(value) ? value : {}
}

function stringArray(value: unknown): string[] {
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) return []
  return value as string[]
}

function canonicalFields(fields: JourneyExerciseField[], rawText: unknown) {
  const text = stringRecord(rawText)
  return fields.map((field) => ({
    fieldId: field.id,
    prompt: field.label,
    value: textValue(text[field.id], field.label),
  }))
}

function optionsForExercise(exercise: JourneyExerciseDefinition, coreValues: string[]): JourneyExerciseOption[] {
  if ((exercise.kind === "choice" || exercise.kind === "multi") && exercise.useCoreValues && coreValues.length > 0) {
    return coreValues.slice(0, 3).map((value, index) => ({ id: `core-${index}`, label: value }))
  }
  if (exercise.kind === "choice" || exercise.kind === "multi" || exercise.kind === "scenario") return exercise.options
  return []
}

function requireSelectedOptions(raw: unknown, options: JourneyExerciseOption[], min: number, max: number): JourneyExerciseOption[] {
  const selectedIds = [...new Set(stringArray(raw))]
  if (selectedIds.length < min || selectedIds.length > max) throw new Error("Invalid exercise selection")
  const byId = new Map(options.map((option) => [option.id, option]))
  const selected = selectedIds.map((id) => byId.get(id))
  if (selected.some((option) => !option)) throw new Error("Invalid exercise selection")
  return selected as JourneyExerciseOption[]
}

function followUpAnswer(field: JourneyExerciseField | undefined, rawText: unknown) {
  if (!field) return undefined
  const text = stringRecord(rawText)
  return {
    fieldId: field.id,
    prompt: field.label,
    value: textValue(text[field.id], field.label),
  }
}

export function canonicaliseJourneyResponse(
  moduleSlug: string,
  raw: unknown,
  coreValues: string[] = [],
): CanonicalJourneyResponse {
  const module = JOURNEY_MODULE_BY_SLUG[moduleSlug]
  const exercise = JOURNEY_EXERCISES[moduleSlug]
  if (!module || !exercise) throw new Error("Unknown Journey module")
  if (!isRecord(raw)) throw new Error("Journey response is required")

  const quickCheck = isRecord(raw.quickCheck) ? raw.quickCheck : {}
  const selectedOptionIndex = quickCheck.selectedOptionIndex
  if (!Number.isInteger(selectedOptionIndex)) throw new Error("Quick check response is required")
  const selectedOption = module.check.options[selectedOptionIndex as number]
  if (!selectedOption) throw new Error("Invalid quick check response")

  const rawExercise = isRecord(raw.exercise) ? raw.exercise : {}
  if (rawExercise.kind !== exercise.kind) throw new Error("Exercise type does not match this module")

  let canonicalExercise: CanonicalJourneyResponse["exercise"]

  switch (exercise.kind) {
    case "builder":
      canonicalExercise = {
        kind: exercise.kind,
        title: exercise.title,
        answers: canonicalFields(exercise.fields, rawExercise.text),
      }
      break
    case "balance":
      canonicalExercise = {
        kind: exercise.kind,
        title: exercise.title,
        answers: canonicalFields(exercise.boxes, rawExercise.text),
      }
      break
    case "choice": {
      const options = optionsForExercise(exercise, coreValues)
      const selected = requireSelectedOptions(rawExercise.selectedIds, options, 1, 1)
      canonicalExercise = {
        kind: exercise.kind,
        title: exercise.title,
        prompt: exercise.prompt,
        selected: selected.map(({ id, label }) => ({ id, label })),
        followUp: followUpAnswer(exercise.followUp, rawExercise.text),
      }
      break
    }
    case "multi": {
      const options = optionsForExercise(exercise, coreValues)
      const max = exercise.maxSelections ?? options.length
      const selected = requireSelectedOptions(rawExercise.selectedIds, options, exercise.minSelections, max)
      canonicalExercise = {
        kind: exercise.kind,
        title: exercise.title,
        prompt: exercise.prompt,
        selected: selected.map(({ id, label }) => ({ id, label })),
        followUp: followUpAnswer(exercise.followUp, rawExercise.text),
      }
      break
    }
    case "scenario": {
      const selected = requireSelectedOptions(rawExercise.selectedIds, exercise.options, 1, 1)
      canonicalExercise = {
        kind: exercise.kind,
        title: exercise.title,
        scenario: exercise.scenario,
        prompt: exercise.prompt,
        selected: selected.map(({ id, label }) => ({ id, label })),
        followUp: followUpAnswer(exercise.followUp, rawExercise.text),
      }
      break
    }
    case "sort": {
      const answers = stringRecord(rawExercise.sortAnswers)
      const groupById = new Map<string, { id: string; label: string; help?: string }>(exercise.groups.map((group) => [group.id, group]))
      canonicalExercise = {
        kind: exercise.kind,
        title: exercise.title,
        assignments: exercise.items.map((item) => {
          const groupId = answers[item.id]
          if (typeof groupId !== "string" || !groupById.has(groupId)) throw new Error("Complete every sorting item")
          const group = groupById.get(groupId)!
          return { itemId: item.id, itemLabel: item.label, groupId, groupLabel: group.label }
        }),
      }
      break
    }
    case "sequence": {
      const sequenceIds = stringArray(rawExercise.sequenceIds)
      const knownIds = new Set(exercise.items.map((item) => item.id))
      if (
        sequenceIds.length !== exercise.items.length ||
        new Set(sequenceIds).size !== exercise.items.length ||
        sequenceIds.some((id) => !knownIds.has(id))
      ) {
        throw new Error("Complete the full sequence")
      }
      const itemById = new Map<string, JourneyExerciseOption>(exercise.items.map((item) => [item.id, item]))
      canonicalExercise = {
        kind: exercise.kind,
        title: exercise.title,
        prompt: exercise.prompt,
        sequence: sequenceIds.map((id, index) => ({
          position: index + 1,
          id,
          label: itemById.get(id)!.label,
        })),
        followUp: followUpAnswer(exercise.followUp, rawExercise.text),
      }
      break
    }
  }

  return {
    quickCheck: {
      prompt: module.check.prompt,
      selectedOptionIndex: selectedOptionIndex as number,
      selectedOptionLabel: selectedOption.label,
    },
    exercise: canonicalExercise,
  }
}

export function parseJourneyResponseHistoryMode(value: unknown): JourneyResponseHistoryMode | null {
  return value === "include_previous" || value === "new_only" ? value : null
}
