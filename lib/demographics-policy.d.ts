export const DEMOGRAPHICS_NOTICE_VERSION: string
export const ETHNICITY_STANDARD_VERSION: string
export const IWI_STANDARD_VERSION: string

export const ETHNICITY_OPTIONS: Array<{ key: string; label: string }>
export const IWI_GROUPS: Array<{ region: string; options: string[] }>
export const IWI_OPTIONS: Array<{ label: string; region: string }>

export type SanitizedDemographics = {
  ethnicityResponses: Array<{ key: string | null; label: string; source: string }>
  ethnicityResponseStatus: "provided" | "not_stated" | "prefer_not_to_say"
  iwiAffiliations: Array<{ label: string; source: string }>
  iwiResponseStatus: "provided" | "not_stated" | "dont_know" | "none" | "prefer_not_to_say"
  collectionNoticeVersion: string
  ethnicityStandardVersion: string
  iwiStandardVersion: string
}

export function sanitizeDemographicsInput(input?: Record<string, unknown>): SanitizedDemographics
