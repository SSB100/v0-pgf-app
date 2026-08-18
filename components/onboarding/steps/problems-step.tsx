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
  "Sports betting",
  "Online casinos",
  "Pokies (bars or clubs)",
  "Pokies (casino)",
  "Casino table games",
  "Poker",
  "Horse racing",
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
  "Finances",
  "Relationships",
  "Work or study",
  "Mental wellbeing",
  "Physical health",
  "How I feel about myself",
  "Sleep",
  "Trust in relationships",
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
        <CardTitle className="text-2xl text-foreground">Understanding Your Gambling</CardTitle>
        <p className="text-muted-foreground text-pretty">
          These questions help personalise Waypoint around the patterns and impacts you choose to share. Your answers are stored with your Waypoint account.
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="text-lg font-semibold text-foreground">How often do you currently gamble?</Label>
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
            If recent, when did you last gamble? <span className="text-xs text-muted-foreground">(Optional)</span>
          </Label>
          <Input type="date" value={lastBetDate} onChange={(e) => setLastBetDate(e.target.value)} max={new Date().toISOString().split("T")[0]} className="w-full" />
        </div>

        <div className="space-y-2">
          <Label className="text-lg font-semibold text-foreground">What forms of gambling have you used? (select all that apply)</Label>
          <div className="grid grid-cols-2 gap-1.5">
            {GAMBLING_FORMS.map((form) => (
              <button key={form} type="button" onClick={() => toggleGamblingForm(form)} className={`px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all ${gamblingForms.includes(form) ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-foreground hover:border-primary/50"}`}>
                {form}
              </button>
            ))}
          </div>
        </div>

        {gamblingForms.length > 0 && (
          <div className="space-y-2">
            <Label className="text-lg font-semibold text-foreground">Which have you used most often? (select all that apply)</Label>
            <div className="grid grid-cols-2 gap-1.5">
              {gamblingForms.map((form) => (
                <button key={form} type="button" onClick={() => toggleMostUsedForm(form)} className={`px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all ${mostUsedForms.includes(form) ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-foreground hover:border-primary/50"}`}>
                  {form}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label className="text-lg font-semibold text-foreground">
            Have you taken part in gambling that you understand may be illegal or unregulated? <span className="text-xs text-muted-foreground">(Optional)</span>
          </Label>
          <div className="space-y-1.5">
            {[{ value: "yes", label: "Yes" }, { value: "no", label: "No" }, { value: "prefer-not-to-say", label: "Prefer not to say" }].map((option) => (
              <button key={option.value} type="button" onClick={() => setIllegalGambling(option.value)} className={`w-full px-3 py-2 rounded-lg border-2 text-left text-sm font-medium transition-all ${illegalGambling === option.value ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-foreground hover:border-primary/50"}`}>
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-lg font-semibold text-foreground">What tends to increase your urge to gamble? (select all that apply)</Label>
          <div className="grid grid-cols-2 gap-1.5">
            {TRIGGER_OPTIONS.map((trigger) => (
              <button key={trigger} type="button" onClick={() => toggleTrigger(trigger)} className={`px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all ${triggers.includes(trigger) ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-foreground hover:border-primary/50"}`}>
                {trigger}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-lg font-semibold text-foreground">Which areas of your life, if any, have been affected by gambling? (select all that apply)</Label>
          <div className="grid grid-cols-2 gap-1.5">
            {IMPACT_AREAS.map((area) => (
              <button key={area} type="button" onClick={() => toggleImpact(area)} className={`px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all ${impacts.includes(area) ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-foreground hover:border-primary/50"}`}>
                {area}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-info/10 border border-info/20 rounded-lg p-3">
          <p className="text-sm text-foreground text-pretty">
            Noticing patterns can help you decide which changes, skills or supports may be useful. These answers are for personalisation and are not a clinical assessment.
          </p>
        </div>

        <div className="flex gap-3 pt-2">
          <StepButtonFooter onBack={onBack} onNext={handleNext} disabled={!canContinue} />
        </div>
      </CardContent>
    </Card>
  )
}
