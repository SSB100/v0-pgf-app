"use client"

import { useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ETHNICITY_OPTIONS, IWI_OPTIONS } from "@/lib/demographics-policy.mjs"
import { Search, X } from "lucide-react"

export type DemographicsFormValue = {
  ethnicities: string[]
  otherEthnicities: string
  ethnicityPreferNotToSay: boolean
  iwiAffiliations: string[]
  otherIwi: string[]
  iwiResponseStatus: "not_stated" | "dont_know" | "none" | "prefer_not_to_say"
}

type Props = {
  value: DemographicsFormValue
  onChange: (value: DemographicsFormValue) => void
  disabled?: boolean
}

function normalize(value: string) {
  return value.toLocaleLowerCase("en-NZ").normalize("NFD").replace(/\p{Diacritic}/gu, "")
}

export default function DemographicsFields({ value, onChange, disabled = false }: Props) {
  const [iwiSearch, setIwiSearch] = useState("")

  const selectedIwi = useMemo(
    () => new Set([...value.iwiAffiliations, ...value.otherIwi]),
    [value.iwiAffiliations, value.otherIwi],
  )

  const filteredIwi = useMemo(() => {
    const query = normalize(iwiSearch)
    if (!query) return IWI_OPTIONS
    return IWI_OPTIONS.filter((option) => normalize(`${option.label} ${option.region}`).includes(query))
  }, [iwiSearch])

  function set(next: Partial<DemographicsFormValue>) {
    onChange({ ...value, ...next })
  }

  function toggleEthnicity(key: string) {
    const selected = value.ethnicities.includes(key)
    set({
      ethnicityPreferNotToSay: false,
      ethnicities: selected ? value.ethnicities.filter((item) => item !== key) : [...value.ethnicities, key],
    })
  }

  function toggleIwi(label: string) {
    const selected = value.iwiAffiliations.includes(label)
    set({
      iwiResponseStatus: "not_stated",
      iwiAffiliations: selected ? value.iwiAffiliations.filter((item) => item !== label) : [...value.iwiAffiliations, label].slice(0, 12),
    })
  }

  function addCustomIwi() {
    const label = iwiSearch.replace(/\s+/g, " ").trim().slice(0, 100)
    if (!label || selectedIwi.has(label)) return
    const official = IWI_OPTIONS.find((option) => normalize(option.label) === normalize(label))
    if (official) {
      toggleIwi(official.label)
    } else {
      set({ iwiResponseStatus: "not_stated", otherIwi: [...value.otherIwi, label].slice(0, 6) })
    }
    setIwiSearch("")
  }

  function removeIwi(label: string) {
    set({
      iwiAffiliations: value.iwiAffiliations.filter((item) => item !== label),
      otherIwi: value.otherIwi.filter((item) => item !== label),
    })
  }

  function setIwiAnswerMode(mode: DemographicsFormValue["iwiResponseStatus"] | "provide") {
    if (mode === "provide") {
      set({ iwiResponseStatus: "not_stated" })
      return
    }
    set({ iwiResponseStatus: mode, iwiAffiliations: [], otherIwi: [] })
    setIwiSearch("")
  }

  const iwiMode = value.iwiResponseStatus === "not_stated" ? "provide" : value.iwiResponseStatus

  return (
    <div className="space-y-6 rounded-xl border border-border bg-muted/20 p-4">
      <div>
        <h3 className="font-semibold text-foreground">About you</h3>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          These questions are optional. They help Waypoint monitor equity and improve the service. They do not affect your access, and ethnicity or iwi information is not shown to connected professionals by default.
        </p>
      </div>

      <div className="space-y-3">
        <div>
          <Label className="text-foreground font-medium">Which ethnic group or groups do you identify with?</Label>
          <p className="mt-1 text-xs text-muted-foreground">Select all that apply to you.</p>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          {ETHNICITY_OPTIONS.map((option) => (
            <label key={option.key} className="flex cursor-pointer items-center gap-3 rounded-lg border bg-background p-3 text-sm">
              <Checkbox checked={value.ethnicities.includes(option.key)} onCheckedChange={() => toggleEthnicity(option.key)} disabled={disabled || value.ethnicityPreferNotToSay} />
              <span>{option.label}</span>
            </label>
          ))}
        </div>

        <div className="space-y-2">
          <Label htmlFor="otherEthnicities">Other ethnicity or ethnicities</Label>
          <Input id="otherEthnicities" value={value.otherEthnicities} onChange={(event) => set({ ethnicityPreferNotToSay: false, otherEthnicities: event.target.value })} placeholder="e.g. Dutch, Japanese, Tokelauan" disabled={disabled || value.ethnicityPreferNotToSay} />
          <p className="text-xs text-muted-foreground">You can enter more than one, separated by commas.</p>
        </div>

        <label className="flex cursor-pointer items-center gap-3 text-sm">
          <Checkbox
            checked={value.ethnicityPreferNotToSay}
            onCheckedChange={(checked) => set({
              ethnicityPreferNotToSay: checked === true,
              ethnicities: checked === true ? [] : value.ethnicities,
              otherEthnicities: checked === true ? "" : value.otherEthnicities,
            })}
            disabled={disabled}
          />
          <span>Prefer not to say</span>
        </label>
      </div>

      <div className="border-t pt-5 space-y-3">
        <div>
          <Label className="text-foreground font-medium">Which iwi do you affiliate with?</Label>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            Optional. You can select more than one iwi. The Stats NZ list is used as a guide and is not exhaustive, so you can add an iwi that is not listed.
          </p>
        </div>

        <Select value={iwiMode} onValueChange={(next) => setIwiAnswerMode(next as DemographicsFormValue["iwiResponseStatus"] | "provide")} disabled={disabled}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="provide">Select or enter my iwi</SelectItem>
            <SelectItem value="dont_know">I don&apos;t know / I&apos;m not sure</SelectItem>
            <SelectItem value="none">I don&apos;t affiliate with an iwi</SelectItem>
            <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
          </SelectContent>
        </Select>

        {iwiMode === "provide" && (
          <div className="space-y-3">
            {selectedIwi.size > 0 && (
              <div className="flex flex-wrap gap-2">
                {[...selectedIwi].map((label) => (
                  <Badge key={label} variant="secondary" className="gap-1 py-1 pl-2 pr-1">
                    {label}
                    <button type="button" onClick={() => removeIwi(label)} className="rounded p-0.5 hover:bg-background/70" aria-label={`Remove ${label}`} disabled={disabled}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input value={iwiSearch} onChange={(event) => setIwiSearch(event.target.value)} placeholder="Search iwi or rohe" className="pl-9" disabled={disabled} />
            </div>

            <div className="max-h-56 overflow-y-auto rounded-lg border bg-background">
              {filteredIwi.slice(0, 60).map((option) => (
                <label key={`${option.region}:${option.label}`} className="flex cursor-pointer items-start gap-3 border-b px-3 py-2.5 text-sm last:border-b-0 hover:bg-muted/50">
                  <Checkbox checked={value.iwiAffiliations.includes(option.label)} onCheckedChange={() => toggleIwi(option.label)} disabled={disabled} className="mt-0.5" />
                  <span><span className="block">{option.label}</span><span className="block text-xs text-muted-foreground">{option.region}</span></span>
                </label>
              ))}
              {filteredIwi.length === 0 && <div className="p-3 text-sm text-muted-foreground">No matching iwi in the guide list.</div>}
            </div>

            {iwiSearch.trim() && !selectedIwi.has(iwiSearch.trim()) && (
              <Button type="button" variant="outline" size="sm" onClick={addCustomIwi} disabled={disabled}>Add “{iwiSearch.trim().slice(0, 50)}”</Button>
            )}
          </div>
        )}
      </div>

      <p className="text-xs leading-5 text-muted-foreground">
        Ethnicity follows the standard Stats NZ census question. Iwi options are based on the 2023 Census guide list. Research or secondary use of iwi-level data remains subject to Waypoint&apos;s Māori data-governance framework.
      </p>
    </div>
  )
}
