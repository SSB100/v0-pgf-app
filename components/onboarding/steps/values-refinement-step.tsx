"use client"

import { Label } from "@/components/ui/label"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { OnboardingData } from "../onboarding-flow"
import { VALUE_DOMAINS } from "@/lib/onboarding-data"
import { StepButtonFooter } from "./step-button-footer"

interface ValuesRefinementStepProps {
  data: OnboardingData
  updateData: (data: Partial<OnboardingData>) => void
  onNext: () => void
  onBack: () => void
}

export default function ValuesRefinementStep({ data, updateData, onNext, onBack }: ValuesRefinementStepProps) {
  const shortlist = data.initialValuesShortlist || []
  const [finalValues, setFinalValues] = useState<string[]>(data.secondRoundValues || [])

  function toggleValue(value: string) {
    if (finalValues.includes(value)) {
      setFinalValues((prev) => prev.filter((v) => v !== value))
    } else if (finalValues.length < 8) {
      setFinalValues((prev) => [...prev, value])
    }
  }

  function handleNext() {
    // Find category for each value
    const valuesData = finalValues.map((name) => {
      const domain = VALUE_DOMAINS.find((d) => d.values.includes(name))
      return {
        name,
        importance: 8,
        category: domain?.domain || "other",
      }
    })

    updateData({
      secondRoundValues: finalValues,
      selectedValues: valuesData,
    })
    onNext()
  }

  const canContinue = finalValues.length === 8

  return (
    <Card className="soft-shadow-lg border-border/50">
      <CardHeader>
        <CardTitle className="text-2xl text-foreground">The Life Garden: Round 2</CardTitle>
        <p className="text-muted-foreground text-pretty">
          From your shortlist, choose your 8 core values—these will guide your journey
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="bg-secondary/50 rounded-xl p-4">
          <p className="text-sm text-foreground/90 text-pretty">
            <span className="font-semibold">Think about:</span> Which values would you want to guide you during your
            hardest moments? Which ones, if you lived by them daily, would make you proud of who you're becoming?
          </p>
        </div>

        {/* Value selection from shortlist */}
        <div className="space-y-3">
          <Label className="text-base font-semibold text-foreground">Select exactly 8 values</Label>
          <div className="grid grid-cols-2 gap-2">
            {shortlist.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => toggleValue(value)}
                disabled={!finalValues.includes(value) && finalValues.length >= 8}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  finalValues.includes(value)
                    ? "bg-primary text-primary-foreground border-2 border-primary"
                    : "bg-card text-foreground border-2 border-border hover:border-primary/50 disabled:opacity-40 disabled:cursor-not-allowed"
                }`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>

        <div className="text-sm text-center font-medium text-muted-foreground">
          {finalValues.length}/8 core values selected
        </div>

        <div className="flex gap-3 pt-4">
          <StepButtonFooter onBack={onBack} onNext={handleNext} disabled={!canContinue} />
        </div>
      </CardContent>
    </Card>
  )
}
