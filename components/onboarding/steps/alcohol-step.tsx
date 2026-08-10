"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import type { OnboardingData } from "../onboarding-flow"
import { StepButtonFooter } from "./step-button-footer"

interface AlcoholStepProps {
  data: OnboardingData
  updateData: (data: Partial<OnboardingData>) => void
  onNext: () => void
  onBack: () => void
}

const FREQUENCY_OPTIONS = ["Daily", "Several times a week", "Weekly", "Occasionally", "Currently sober"]

const DRINKING_TYPES = ["Beer", "Wine", "Spirits", "Cocktails", "Cider", "Ready-to-drink (RTDs)"]

const TRIGGER_OPTIONS = [
  "Stress or anxiety",
  "Social situations",
  "End of workday routine",
  "Boredom",
  "Loneliness",
  "Celebrations",
  "Sleep difficulties",
  "Relationship issues",
  "Work pressure",
  "Emotional pain",
]

const IMPACT_AREAS = [
  "Physical health",
  "Mental health",
  "Relationships",
  "Work/School",
  "Financial",
  "Sleep quality",
  "Self-esteem",
  "Memory/cognition",
]

export default function AlcoholStep({ data, updateData, onNext, onBack }: AlcoholStepProps) {
  const [frequency, setFrequency] = useState(data.alcoholFrequency || "")
  const [lastDrinkDate, setLastDrinkDate] = useState(data.lastDrinkDate || "")
  const [drinkingTypes, setDrinkingTypes] = useState<string[]>(data.drinkingTypes || [])
  const [triggers, setTriggers] = useState<string[]>(data.alcoholTriggers || [])
  const [impacts, setImpacts] = useState<string[]>(data.alcoholImpactAreas || [])

  function toggleDrinkingType(type: string) {
    setDrinkingTypes((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]))
  }

  function toggleTrigger(trigger: string) {
    setTriggers((prev) => (prev.includes(trigger) ? prev.filter((t) => t !== trigger) : [...prev, trigger]))
  }

  function toggleImpact(impact: string) {
    setImpacts((prev) => (prev.includes(impact) ? prev.filter((i) => i !== impact) : [...prev, impact]))
  }

  function handleNext() {
    updateData({
      alcoholFrequency: frequency,
      lastDrinkDate: lastDrinkDate || undefined,
      drinkingTypes,
      alcoholTriggers: triggers,
      alcoholImpactAreas: impacts,
    })
    onNext()
  }

  const canContinue = frequency && triggers.length > 0 && impacts.length > 0

  return (
    <Card className="soft-shadow-lg border-border/50">
      <CardHeader>
        <CardTitle className="text-2xl text-foreground">Understanding Your Relationship with Alcohol</CardTitle>
        <p className="text-muted-foreground text-pretty">
          Help us understand your drinking patterns so we can support you better. This information stays private.
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="text-lg font-semibold text-foreground">How often do you drink?</Label>
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
            When was your last drink? <span className="text-xs text-muted-foreground">(Optional)</span>
          </Label>
          <Input
            type="date"
            value={lastDrinkDate}
            onChange={(e) => setLastDrinkDate(e.target.value)}
            max={new Date().toISOString().split("T")[0]}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label             className="text-lg font-semibold text-foreground">
            What types of alcohol do you typically consume?{" "}
            <span className="text-xs text-muted-foreground">(Optional)</span>
          </Label>
          <div className="grid grid-cols-2 gap-1.5">
            {DRINKING_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => toggleDrinkingType(type)}
                className={`px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                  drinkingTypes.includes(type)
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
            What triggers your urge to drink? (select all that apply)
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
            What areas of life has drinking affected? (select all that apply)
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
            Understanding your patterns is a crucial step toward change. You're building awareness that will help you
            make empowered choices.
          </p>
        </div>

        <div className="flex gap-3 pt-2">
          <StepButtonFooter onBack={onBack} onNext={handleNext} disabled={!canContinue} />
        </div>
      </CardContent>
    </Card>
  )
}
