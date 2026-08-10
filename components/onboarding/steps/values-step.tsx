"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import type { OnboardingData } from "../onboarding-flow"
import { StepButtonFooter } from "./step-button-footer"

interface ValuesStepProps {
  data: OnboardingData
  updateData: (data: Partial<OnboardingData>) => void
  onNext: () => void
  onBack: () => void
}

const VALUE_OPTIONS = [
  { category: "relationships", values: ["Family", "Friendship", "Love", "Connection", "Belonging"] },
  { category: "health", values: ["Physical Health", "Mental Wellbeing", "Self-Care", "Recovery", "Balance"] },
  { category: "purpose", values: ["Growth", "Achievement", "Contribution", "Creativity", "Learning"] },
  { category: "character", values: ["Honesty", "Courage", "Kindness", "Responsibility", "Authenticity"] },
]

export default function ValuesStep({ data, updateData, onNext, onBack }: ValuesStepProps) {
  const [selectedValues, setSelectedValues] = useState<string[]>(data.selectedValues.map((v) => v.name))
  const [currentRating, setCurrentRating] = useState<string>("")
  const [ratings, setRatings] = useState<Record<string, number>>(
    Object.fromEntries(data.selectedValues.map((v) => [v.name, v.importance])),
  )

  function toggleValue(value: string, category: string) {
    if (selectedValues.includes(value)) {
      setSelectedValues((prev) => prev.filter((v) => v !== value))
      const newRatings = { ...ratings }
      delete newRatings[value]
      setRatings(newRatings)
      if (currentRating === value) setCurrentRating("")
    } else if (selectedValues.length < 5) {
      setSelectedValues((prev) => [...prev, value])
      setCurrentRating(value)
    }
  }

  function setImportance(value: string, importance: number) {
    setRatings((prev) => ({ ...prev, [value]: importance }))
  }

  function handleNext() {
    const valuesData = selectedValues.map((name) => {
      const category = VALUE_OPTIONS.find((cat) => cat.values.includes(name))?.category || "other"

      return {
        name,
        importance: ratings[name] || 5,
        category,
      }
    })

    updateData({ selectedValues: valuesData })
    onNext()
  }

  const canContinue = selectedValues.length >= 3 && selectedValues.every((v) => ratings[v])

  return (
    <Card className="soft-shadow-lg border-border/50">
      <CardHeader>
        <CardTitle className="text-2xl text-foreground">What Matters Most to You?</CardTitle>
        <p className="text-muted-foreground text-pretty">
          Choose 3-5 core values that guide your life. These will help you make choices aligned with who you want to be.
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Value selection */}
        {VALUE_OPTIONS.map((category) => (
          <div key={category.category} className="space-y-3">
            <Label className="text-base font-semibold text-foreground capitalize">{category.category}</Label>
            <div className="flex flex-wrap gap-2">
              {category.values.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => toggleValue(value, category.category)}
                  disabled={!selectedValues.includes(value) && selectedValues.length >= 5}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedValues.includes(value)
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80 disabled:opacity-40"
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
        ))}

        <div className="text-sm text-muted-foreground text-center">
          {selectedValues.length}/5 values selected (minimum 3)
        </div>

        {/* Importance ratings */}
        {selectedValues.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-border">
            <Label className="text-lg font-semibold text-foreground">How important is each value? (1-10)</Label>

            {selectedValues.map((value) => (
              <div key={value} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-foreground">{value}</span>
                  <span className="text-sm text-muted-foreground">{ratings[value] || 5}/10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={ratings[value] || 5}
                  onChange={(e) => setImportance(value, Number.parseInt(e.target.value))}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-3 pt-6">
          <StepButtonFooter onBack={onBack} onNext={handleNext} disabled={!canContinue} />
        </div>
      </CardContent>
    </Card>
  )
}
