"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import type { OnboardingData } from "../onboarding-flow"
import { StepButtonFooter } from "./step-button-footer"

interface ProblemsStepProps {
  data: OnboardingData
  updateData: (data: Partial<OnboardingData>) => void
  onNext: () => void
  onBack: () => void
}

const FREQUENCY_OPTIONS = ["Daily", "Several times a week", "Weekly", "Occasionally", "Rarely now"]

const GAMBLING_FORMS = [
  "Lotto",
  "Sports Betting",
  "Online Casinos",
  "Pokies (bars)",
  "Pokies (Casino)",
  "Casino Table Games",
  "Poker",
  "Horse Racing",
]

const TRIGGER_OPTIONS = [
  "Stress or anxiety",
  "Boredom",
  "Financial pressure",
  "Social situations",
  "Alcohol or substances",
  "Loneliness",
  "Advertisements",
  "Past wins",
  "Relationship issues",
  "Work pressure",
]

const IMPACT_AREAS = [
  "Financial",
  "Relationships",
  "Work/School",
  "Mental health",
  "Physical health",
  "Self-esteem",
  "Sleep",
  "Trust from others",
]

export default function ProblemsStep({ data, updateData, onNext, onBack }: ProblemsStepProps) {
  const [frequency, setFrequency] = useState(data.gamblingFrequency || "")
  const [lastBetDate, setLastBetDate] = useState(data.lastBetDate || "")
  const [gamblingForms, setGamblingForms] = useState<string[]>(data.gamblingForms || [])
  const [mostUsedForms, setMostUsedForms] = useState<string[]>(data.mostUsedGamblingForms || [])
  const [illegalGambling, setIllegalGambling] = useState(data.illegalGambling || "")
  const [triggers, setTriggers] = useState<string[]>(data.gamblingTriggers || [])
  const [impacts, setImpacts] = useState<string[]>(data.impactAreas || [])

  function toggleGamblingForm(form: string) {
    setGamblingForms((prev) => (prev.includes(form) ? prev.filter((f) => f !== form) : [...prev, form]))
  }

  function toggleMostUsedForm(form: string) {
    setMostUsedForms((prev) => (prev.includes(form) ? prev.filter((f) => f !== form) : [...prev, form]))
  }

  function toggleTrigger(trigger: string) {
    setTriggers((prev) => (prev.includes(trigger) ? prev.filter((t) => t !== trigger) : [...prev, trigger]))
  }

  function toggleImpact(impact: string) {
    setImpacts((prev) => (prev.includes(impact) ? prev.filter((i) => i !== impact) : [...prev, impact]))
  }

  function handleNext() {
    updateData({
      gamblingFrequency: frequency,
      lastBetDate: lastBetDate || undefined,
      gamblingForms,
      mostUsedGamblingForms: mostUsedForms,
      illegalGambling: illegalGambling || undefined,
      gamblingTriggers: triggers,
      impactAreas: impacts,
    })
    onNext()
  }

  const canContinue =
    frequency && gamblingForms.length > 0 && mostUsedForms.length > 0 && triggers.length > 0 && impacts.length > 0

  return (
    <Card className="soft-shadow-lg border-border/50">
      <CardHeader>
        <CardTitle className="text-2xl text-foreground">Understanding Your Gambling Behaviours</CardTitle>
        <p className="text-muted-foreground text-pretty">
          Help us understand your gambling so we can support you better. This stays private.
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Frequency */}
        <div className="space-y-2">
          <Label className="text-lg font-semibold text-foreground">How often do you gamble?</Label>
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
            If recent, when was your last bet? <span className="text-xs text-muted-foreground">(Optional)</span>
          </Label>
          <Input
            type="date"
            value={lastBetDate}
            onChange={(e) => setLastBetDate(e.target.value)}
            max={new Date().toISOString().split("T")[0]}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label             className="text-lg font-semibold text-foreground">
            What forms of gambling have you used? (select all that apply)
          </Label>
          <div className="grid grid-cols-2 gap-1.5">
            {GAMBLING_FORMS.map((form) => (
              <button
                key={form}
                type="button"
                onClick={() => toggleGamblingForm(form)}
                className={`px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                  gamblingForms.includes(form)
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-foreground hover:border-primary/50"
                }`}
              >
                {form}
              </button>
            ))}
          </div>
        </div>

        {gamblingForms.length > 0 && (
          <div className="space-y-2">
            <Label             className="text-lg font-semibold text-foreground">
              What forms of gambling have you used most often? (select all that apply)
            </Label>
            <div className="grid grid-cols-2 gap-1.5">
              {gamblingForms.map((form) => (
                <button
                  key={form}
                  type="button"
                  onClick={() => toggleMostUsedForm(form)}
                  className={`px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                    mostUsedForms.includes(form)
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-card text-foreground hover:border-primary/50"
                  }`}
                >
                  {form}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label             className="text-lg font-semibold text-foreground">
            Have you ever participated in any illegal gambling?{" "}
            <span className="text-xs text-muted-foreground">(Optional)</span>
          </Label>
          <div className="space-y-1.5">
            <button
              type="button"
              onClick={() => setIllegalGambling("yes")}
              className={`w-full px-3 py-2 rounded-lg border-2 text-left text-sm font-medium transition-all ${
                illegalGambling === "yes"
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-card text-foreground hover:border-primary/50"
              }`}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => setIllegalGambling("no")}
              className={`w-full px-3 py-2 rounded-lg border-2 text-left text-sm font-medium transition-all ${
                illegalGambling === "no"
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-card text-foreground hover:border-primary/50"
              }`}
            >
              No
            </button>
          </div>
        </div>

        {/* Triggers */}
        <div className="space-y-2">
          <Label             className="text-lg font-semibold text-foreground">
            What triggers your urge to gamble? (select all that apply)
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
            What areas of life has gambling negatively affected? (select all that apply)
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
            Recognizing these patterns is a huge step. You're building awareness that will help you make different
            choices.
          </p>
        </div>

        <div className="flex gap-3 pt-2">
          <StepButtonFooter onBack={onBack} onNext={handleNext} disabled={!canContinue} />
        </div>
      </CardContent>
    </Card>
  )
}
