"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import type { OnboardingData } from "../onboarding-flow"
import { StepButtonFooter } from "./step-button-footer"

interface SubstanceUseStepProps {
  data: OnboardingData
  updateData: (data: Partial<OnboardingData>) => void
  onNext: () => void
  onBack: () => void
}

export default function SubstanceUseStep({ data, updateData, onNext, onBack }: SubstanceUseStepProps) {
  const [alcoholUse, setAlcoholUse] = useState(data.alcoholUse || "")
  const [drugUse, setDrugUse] = useState(data.drugUse || "")
  const [substanceGamblingLink, setSubstanceGamblingLink] = useState(data.substanceGamblingLink || "")
  const [substanceMentalHealthLink, setSubstanceMentalHealthLink] = useState(data.substanceMentalHealthLink || "")

  function handleNext() {
    updateData({
      alcoholUse,
      drugUse,
      substanceGamblingLink,
      substanceMentalHealthLink,
    })
    onNext()
  }

  const canContinue = alcoholUse && drugUse && substanceGamblingLink && substanceMentalHealthLink

  return (
    <Card className="soft-shadow-lg border-border/50">
      <CardHeader>
        <CardTitle className="text-2xl text-foreground">Alcohol and Substance Use</CardTitle>
        <p className="text-muted-foreground text-pretty">
          Understanding the connection between substance use and gambling helps us provide better support.
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label className="text-base font-semibold text-foreground">How often do you consume alcohol?</Label>
          <div className="space-y-2">
            {[
              "Never",
              "Occasionally (1-2 times/month)",
              "Regularly (1-2 times/week)",
              "Frequently (3+ times/week)",
              "Daily",
            ].map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setAlcoholUse(option)}
                className={`w-full p-3 rounded-lg border-2 text-left font-medium transition-all ${
                  alcoholUse === option
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-foreground hover:border-primary/50"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-base font-semibold text-foreground">
            Do you use recreational drugs or misuse prescription medications?
          </Label>
          <div className="space-y-2">
            {["No", "Occasionally", "Regularly", "Prefer not to say"].map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setDrugUse(option)}
                className={`w-full p-3 rounded-lg border-2 text-left font-medium transition-all ${
                  drugUse === option
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-foreground hover:border-primary/50"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-base font-semibold text-foreground">
            Does alcohol or drug use affect your gambling behavior?
          </Label>
          <div className="space-y-2">
            {[
              "No connection",
              "I gamble more when using",
              "I use more when gambling",
              "Both happen together often",
              "Not sure",
            ].map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setSubstanceGamblingLink(option)}
                className={`w-full p-3 rounded-lg border-2 text-left font-medium transition-all ${
                  substanceGamblingLink === option
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-foreground hover:border-primary/50"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-base font-semibold text-foreground">
            Has substance use affected your mental health or wellbeing?
          </Label>
          <div className="space-y-2">
            {["No impact", "Minor impact", "Moderate impact", "Significant impact", "Not sure"].map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setSubstanceMentalHealthLink(option)}
                className={`w-full p-3 rounded-lg border-2 text-left font-medium transition-all ${
                  substanceMentalHealthLink === option
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-foreground hover:border-primary/50"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-info/10 border border-info/20 rounded-lg p-4">
          <p className="text-sm text-foreground text-pretty">
            Understanding these connections helps you recognize patterns and make informed choices. Many people find
            that addressing multiple challenges together leads to better outcomes.
          </p>
        </div>

        <div className="flex gap-3 pt-4">
          <StepButtonFooter onBack={onBack} onNext={handleNext} disabled={!canContinue} />
        </div>
      </CardContent>
    </Card>
  )
}
