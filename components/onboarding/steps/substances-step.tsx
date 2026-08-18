"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { supportResources } from "@/lib/support-resources"
import type { OnboardingData } from "../onboarding-flow"
import { StepButtonFooter } from "./step-button-footer"

interface SubstancesStepProps {
  data: OnboardingData
  updateData: (data: Partial<OnboardingData>) => void
  onNext: () => void
  onBack: () => void
}

const FREQUENCY_OPTIONS = ["Daily", "Several times a week", "Weekly", "Occasionally", "Not using currently"]

const SUBSTANCE_TYPES = [
  "Cannabis",
  "Prescription medication used differently from prescribed",
  "Stimulants (for example cocaine or methamphetamine)",
  "Opioids",
  "MDMA / ecstasy",
  "Hallucinogens",
  "Synthetic substances",
  "Other",
]

const TRIGGER_OPTIONS = [
  "Stress or anxiety",
  "Social situations",
  "Boredom",
  "Emotional pain",
  "Physical pain",
  "Sleep difficulties",
  "Peer or social pressure",
  "Trauma-related distress",
  "Work pressure",
  "Loneliness",
]

const IMPACT_AREAS = [
  "Physical health",
  "Mental wellbeing",
  "Relationships",
  "Work or study",
  "Finances",
  "Legal issues",
  "How I feel about myself",
  "Memory or concentration",
]

export default function SubstancesStep({ data, updateData, onNext, onBack }: SubstancesStepProps) {
  const [frequency, setFrequency] = useState(data.substanceFrequency || "")
  const [lastUseDate, setLastUseDate] = useState(data.lastSubstanceDate || "")
  const [substanceTypes, setSubstanceTypes] = useState<string[]>(data.substanceTypes || [])
  const [triggers, setTriggers] = useState<string[]>(data.substanceTriggers || [])
  const [impacts, setImpacts] = useState<string[]>(data.substanceImpactAreas || [])

  function toggleSubstanceType(type: string) {
    setSubstanceTypes((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]))
  }

  function toggleTrigger(trigger: string) {
    setTriggers((prev) => (prev.includes(trigger) ? prev.filter((t) => t !== trigger) : [...prev, trigger]))
  }

  function toggleImpact(impact: string) {
    setImpacts((prev) => (prev.includes(impact) ? prev.filter((i) => i !== impact) : [...prev, impact]))
  }

  function handleNext() {
    updateData({
      substanceFrequency: frequency,
      lastSubstanceDate: lastUseDate || undefined,
      substanceTypes,
      substanceTriggers: triggers,
      substanceImpactAreas: impacts,
    })
    onNext()
  }

  const canContinue = frequency && triggers.length > 0 && impacts.length > 0

  return (
    <Card className="soft-shadow-lg border-border/50">
      <CardHeader>
        <CardTitle className="text-2xl text-foreground">Understanding Your Substance Use</CardTitle>
        <p className="text-muted-foreground text-pretty">
          These questions help personalise Waypoint around the patterns and impacts you choose to share. Your answers are stored with your Waypoint account.
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="text-lg font-semibold text-foreground">How often do you currently use substances?</Label>
          <div className="space-y-1.5">
            {FREQUENCY_OPTIONS.map((option) => (
              <button key={option} type="button" onClick={() => setFrequency(option)} className={`w-full px-3 py-2 rounded-lg border-2 text-left text-sm font-medium transition-all ${frequency === option ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-foreground hover:border-primary/50"}`}>
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-lg font-semibold text-foreground">
            If recent, when did you last use a substance? <span className="text-xs text-muted-foreground">(Optional)</span>
          </Label>
          <Input type="date" value={lastUseDate} onChange={(e) => setLastUseDate(e.target.value)} max={new Date().toISOString().split("T")[0]} className="w-full" />
        </div>

        <div className="space-y-2">
          <Label className="text-lg font-semibold text-foreground">Which substances are relevant to the change you want to make? (select all that apply)</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {SUBSTANCE_TYPES.map((type) => (
              <button key={type} type="button" onClick={() => toggleSubstanceType(type)} className={`px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all ${substanceTypes.includes(type) ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-foreground hover:border-primary/50"}`}>
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-lg font-semibold text-foreground">What tends to increase your urge to use? (select all that apply)</Label>
          <div className="grid grid-cols-2 gap-1.5">
            {TRIGGER_OPTIONS.map((trigger) => (
              <button key={trigger} type="button" onClick={() => toggleTrigger(trigger)} className={`px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all ${triggers.includes(trigger) ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-foreground hover:border-primary/50"}`}>
                {trigger}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-lg font-semibold text-foreground">Which areas of your life, if any, have been affected by substance use? (select all that apply)</Label>
          <div className="grid grid-cols-2 gap-1.5">
            {IMPACT_AREAS.map((area) => (
              <button key={area} type="button" onClick={() => toggleImpact(area)} className={`px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all ${impacts.includes(area) ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-foreground hover:border-primary/50"}`}>
                {area}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-info/10 border border-info/20 rounded-lg p-3 space-y-2">
          <p className="text-sm text-foreground text-pretty">
            Noticing patterns can help you decide which changes, skills or supports may be useful. These answers are for personalisation and are not a clinical assessment.
          </p>
          <p className="text-xs text-muted-foreground text-pretty">
            Withdrawal risks differ between substances. If you are worried about stopping or reducing use, a GP, addiction service or the Alcohol Drug Helpline ({supportResources.alcoholDrug.phone}) can help you plan more safely.
          </p>
        </div>

        <div className="flex gap-3 pt-2">
          <StepButtonFooter onBack={onBack} onNext={handleNext} disabled={!canContinue} />
        </div>
      </CardContent>
    </Card>
  )
}
