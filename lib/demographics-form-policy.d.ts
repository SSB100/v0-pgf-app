export type DemographicsEditFormValue = {
  ethnicities: string[]
  otherEthnicities: string
  ethnicityPreferNotToSay: boolean
  iwiAffiliations: string[]
  otherIwi: string[]
  iwiResponseStatus: "not_stated" | "dont_know" | "none" | "prefer_not_to_say"
}

export const EMPTY_DEMOGRAPHICS_FORM_VALUE: Readonly<DemographicsEditFormValue>

export function demographicsRecordToFormValue(record?: Record<string, unknown>): DemographicsEditFormValue
