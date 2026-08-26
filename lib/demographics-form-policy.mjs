import { ETHNICITY_OPTIONS, IWI_OPTIONS } from "./demographics-policy.mjs"

const ethnicityByKey = new Map(ETHNICITY_OPTIONS.map((option) => [option.key, option]))
const ethnicityKeyByLabel = new Map(ETHNICITY_OPTIONS.map((option) => [option.label.toLocaleLowerCase("en-NZ"), option.key]))
const iwiLabels = new Set(IWI_OPTIONS.map((option) => option.label))
const explicitIwiStatuses = new Set(["dont_know", "none", "prefer_not_to_say"])

function parseStoredList(value) {
  if (Array.isArray(value)) return value
  if (typeof value !== "string") return []
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function cleanStoredLabel(value, maxLength = 100) {
  if (typeof value !== "string") return ""
  return value.replace(/[\u0000-\u001F\u007F]/g, " ").replace(/\s+/g, " ").trim().slice(0, maxLength)
}

function uniqueStrings(values) {
  const seen = new Set()
  const result = []
  for (const value of values) {
    const key = value.toLocaleLowerCase("en-NZ")
    if (seen.has(key)) continue
    seen.add(key)
    result.push(value)
  }
  return result
}

export function demographicsRecordToFormValue(record = {}) {
  const ethnicityStatus = record.ethnicity_response_status ?? record.ethnicityResponseStatus
  const preferNotToSay = ethnicityStatus === "prefer_not_to_say"
  const ethnicityResponses = preferNotToSay
    ? []
    : parseStoredList(record.ethnicity_responses ?? record.ethnicityResponses)

  const ethnicities = []
  const otherEthnicities = []

  for (const response of ethnicityResponses) {
    if (typeof response === "string") {
      const label = cleanStoredLabel(response, 50)
      if (!label) continue
      const standardKey = ethnicityKeyByLabel.get(label.toLocaleLowerCase("en-NZ"))
      if (standardKey) ethnicities.push(standardKey)
      else otherEthnicities.push(label)
      continue
    }

    if (!response || typeof response !== "object") continue
    const key = typeof response.key === "string" ? response.key : ""
    const label = cleanStoredLabel(response.label, 50)
    if (key && ethnicityByKey.has(key)) ethnicities.push(key)
    else if (label) {
      const standardKey = ethnicityKeyByLabel.get(label.toLocaleLowerCase("en-NZ"))
      if (standardKey) ethnicities.push(standardKey)
      else otherEthnicities.push(label)
    }
  }

  const storedIwiStatus = typeof (record.iwi_response_status ?? record.iwiResponseStatus) === "string"
    ? (record.iwi_response_status ?? record.iwiResponseStatus)
    : "not_stated"
  const iwiResponseStatus = explicitIwiStatuses.has(storedIwiStatus) ? storedIwiStatus : "not_stated"
  const iwiEntries = iwiResponseStatus === "not_stated"
    ? parseStoredList(record.iwi_affiliations ?? record.iwiAffiliations)
    : []
  const iwiAffiliations = []
  const otherIwi = []

  for (const entry of iwiEntries) {
    const label = cleanStoredLabel(typeof entry === "string" ? entry : entry?.label, 100)
    if (!label) continue
    if (iwiLabels.has(label)) iwiAffiliations.push(label)
    else otherIwi.push(label)
  }

  return {
    ethnicities: uniqueStrings(ethnicities).slice(0, 8),
    otherEthnicities: uniqueStrings(otherEthnicities).slice(0, 6).join(", "),
    ethnicityPreferNotToSay: preferNotToSay,
    iwiAffiliations: uniqueStrings(iwiAffiliations).slice(0, 12),
    otherIwi: uniqueStrings(otherIwi).slice(0, 6),
    iwiResponseStatus,
  }
}

export const EMPTY_DEMOGRAPHICS_FORM_VALUE = Object.freeze({
  ethnicities: [],
  otherEthnicities: "",
  ethnicityPreferNotToSay: false,
  iwiAffiliations: [],
  otherIwi: [],
  iwiResponseStatus: "not_stated",
})
