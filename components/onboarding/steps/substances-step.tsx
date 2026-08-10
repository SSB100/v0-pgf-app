"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import type { OnboardingData } from "../onboarding-flow"
import { StepButtonFooter } from "./step-button-footer"

interface SubstancesStepProps {
  data: OnboardingData
  updateData: (data: Partial<OnboardingData>) => void
  onNext: () => void
  onBack: () => void
}

const FREQUENCY_OPTIONS = ["Daily", "Several times a week", "Weekly", "Occasionally", "Currently clean"]

const SUBSTANCE_TYPES = [
  "Cannabis",
  "Prescription medications (misuse)",
  "Stimulants (cocaine, meth, etc.)",
  "Opioids",
  "MDMA/Ecstasy",
  "Hallucinogens",
  "Synthetic drugs",
  "Other",
]

const TRIGGER_OPTIONS = [
  "Stress or anxiety",
  "Social situations",
  "Boredom",
  "Emotional pain",
  "Physical pain",
  "Sleep difficulties",
  "Peer pressure",
  "Trauma response",
  "Work pressure",
  "Loneliness",
]

const IMPACT_AREAS = [
  "Physical health",
  "Mental health",
  "Relationships",
  "Work/School",
  "Financial",
  "Legal issues",
  "Self-esteem",
  "Memory/cognition",
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
          Help us understand your situation so we can provide the right support. This information is confidential.
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="text-lg font-semibold text-foreground">How often do you use substances?</Label>
          <div className="space-y-1.5">
            {FREQUENCY_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setFrequency(option)}
                className={`w-full px-3 py-2 rounded-lg border-2 text-left text-sm font-medium transition-all ${
                  frequency === option
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-foreground hover:border-primary/50"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label             className="text-lg font-semibold text-foreground">
            When was your last use? <span className="text-xs text-muted-foreground">(Optional)</span>
          </Label>
          <Input
            type="date"
            value={lastUseDate}
            onChange={(e) => setLastUseDate(e.target.value)}
            max={new Date().toISOString().split("T")[0]}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label             className="text-lg font-semibold text-foreground">
            What substances are you working on? (select all that apply)
          </Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {SUBSTANCE_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => toggleSubstanceType(type)}
                className={`px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                  substanceTypes.includes(type)
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-foreground hover:border-primary/50"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label             className="text-lg font-semibold text-foreground">
            What triggers your urge to use? (select all that apply)
          </Label>
            <div className="grid grid-cols-2 gap-1.5">
            {TRIGGER_OPTIONS.map((trigger) => (
              <button
                key={trigger}
                type="button"
                onClick={() => toggleTrigger(trigger)}
                className={`px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                  triggers.includes(trigger)
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-foreground hover:border-primary/50"
                }`}
              >
                {trigger}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label             className="text-lg font-semibold text-foreground">
            What areas of life has substance use affected? (select all that apply)
          </Label>
            <div className="grid grid-cols-2 gap-1.5">
            {IMPACT_AREAS.map((area) => (
              <button
                key={area}
                type="button"
                onClick={() => toggleImpact(area)}
                className={`px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                  impacts.includes(area)
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-foreground hover:border-primary/50"
                }`}
              >
                {area}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-info/10 border border-info/20 rounded-lg p-3">
          <p className="text-sm text-foreground text-pretty">
            Recovery is possible. By understanding your patterns, you're taking control of your journey. Every step
            forward matters.
          </p>
        </div>

        <div className="flex gap-3 pt-2">
          <StepButtonFooter onBack={onBack} onNext={handleNext} disabled={!canContinue} />
        </div>
      </CardContent>
    </Card>
  )
}
