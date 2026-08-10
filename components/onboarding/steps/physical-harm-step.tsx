"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import type { OnboardingData } from "../onboarding-flow"
import { StepButtonFooter } from "./step-button-footer"

interface PhysicalHarmStepProps {
  data: OnboardingData
  updateData: (data: Partial<OnboardingData>) => void
  onNext: () => void
  onBack: () => void
}

export default function PhysicalHarmStep({ data, updateData, onNext, onBack }: PhysicalHarmStepProps) {
  const [selfHarmThoughts, setSelfHarmThoughts] = useState(data.selfHarmThoughts || "")
  const [selfHarmActions, setSelfHarmActions] = useState(data.selfHarmActions || "")
  const [suicidalThoughts, setSuicidalThoughts] = useState(data.suicidalThoughts || "")

  function handleNext() {
    updateData({
      selfHarmThoughts,
      selfHarmActions,
      suicidalThoughts,
    })
    onNext()
  }

  const canContinue = selfHarmThoughts && selfHarmActions && suicidalThoughts

  return (
    <Card className="soft-shadow-lg border-border/50">
      <CardHeader>
        <CardTitle className="text-2xl text-foreground">Your Wellbeing Matters</CardTitle>
        <p className="text-muted-foreground text-pretty">
          These questions help us understand how to support you better. Your answers are private and confidential.
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
          <p className="text-sm text-amber-900 dark:text-amber-100 text-pretty">
            If you're in crisis or experiencing thoughts of harming yourself, please reach out to a crisis service
            immediately. Help is available 24/7.
          </p>
          <p className="text-xs text-amber-800 dark:text-amber-200 mt-2 font-medium">
            Lifeline: 13 11 14 | Beyond Blue: 1300 22 4636
          </p>
        </div>

        <div className="space-y-3">
          <Label className="text-base font-semibold text-foreground">
            Have you experienced thoughts of self-harm in the past 6 months?
          </Label>
          <div className="space-y-2">
            {["No, not at all", "Occasionally", "Frequently", "Prefer not to say"].map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setSelfHarmThoughts(option)}
                className={`w-full p-3 rounded-lg border-2 text-left font-medium transition-all ${
                  selfHarmThoughts === option
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
            Have you engaged in self-harm behaviors in the past 6 months?
          </Label>
          <div className="space-y-2">
            {["No", "Yes, in the past", "Yes, recently", "Prefer not to say"].map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setSelfHarmActions(option)}
                className={`w-full p-3 rounded-lg border-2 text-left font-medium transition-all ${
                  selfHarmActions === option
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
            Have you experienced thoughts about ending your life?
          </Label>
          <div className="space-y-2">
            {["No, never", "In the past, but not recently", "Sometimes", "Prefer not to say"].map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setSuicidalThoughts(option)}
                className={`w-full p-3 rounded-lg border-2 text-left font-medium transition-all ${
                  suicidalThoughts === option
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
            Thank you for sharing this with us. Your courage in being honest is an important step toward healing. The
            tools and support in this app can help, but please reach out to professional support if you're struggling.
          </p>
        </div>

        <div className="flex gap-3 pt-6">
          <StepButtonFooter onBack={onBack} onNext={handleNext} disabled={!canContinue} />
        </div>
      </CardContent>
    </Card>
  )
}
