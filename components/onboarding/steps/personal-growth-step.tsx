"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import type { OnboardingData } from "../onboarding-flow"
import { StepButtonFooter } from "./step-button-footer"

interface PersonalGrowthStepProps {
  data: OnboardingData
  updateData: (data: Partial<OnboardingData>) => void
  onNext: () => void
  onBack: () => void
}

const GROWTH_GOALS = [
  "Build better habits",
  "Manage stress better",
  "Improve emotional awareness",
  "Increase self-confidence",
  "Better work-life balance",
  "Improve relationships",
  "Break procrastination",
  "Develop resilience",
  "Find more purpose",
  "Increase mindfulness",
]

const MOTIVATION_LEVEL = [
  { value: "very_high", label: "Very motivated - ready to commit fully" },
  { value: "high", label: "Motivated - willing to put in the work" },
  { value: "moderate", label: "Moderately motivated - exploring options" },
  { value: "building", label: "Building motivation - need some guidance" },
]

const CHALLENGES = [
  "Staying consistent",
  "Lack of time",
  "Self-doubt",
  "Unclear direction",
  "Past failures",
  "Overwhelm",
  "Perfectionism",
  "Fear of change",
]

export default function PersonalGrowthStep({ data, updateData, onNext, onBack }: PersonalGrowthStepProps) {
  const [growthGoals, setGrowthGoals] = useState<string[]>(data.growthGoals || [])
  const [motivation, setMotivation] = useState(data.growthMotivation || "")
  const [challenges, setChallenges] = useState<string[]>(data.growthChallenges || [])

  function toggleGoal(goal: string) {
    setGrowthGoals((prev) => (prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]))
  }

  function toggleChallenge(challenge: string) {
    setChallenges((prev) => (prev.includes(challenge) ? prev.filter((c) => c !== challenge) : [...prev, challenge]))
  }

  function handleNext() {
    updateData({
      growthGoals,
      growthMotivation: motivation,
      growthChallenges: challenges,
    })
    onNext()
  }

  const canContinue = growthGoals.length > 0 && motivation

  return (
    <Card className="soft-shadow-lg border-border/50">
      <CardHeader>
        <CardTitle className="text-2xl text-foreground">Your Personal Growth Journey</CardTitle>
        <p className="text-muted-foreground text-pretty">
          Tell us about your goals for personal development so we can support your growth.
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="text-lg font-semibold text-foreground">
            What areas do you want to grow in? (select all that apply)
          </Label>
          <div className="grid grid-cols-2 gap-1.5">
            {GROWTH_GOALS.map((goal) => (
              <button
                key={goal}
                type="button"
                onClick={() => toggleGoal(goal)}
                className={`px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                  growthGoals.includes(goal)
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-foreground hover:border-primary/50"
                }`}
              >
                {goal}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label             className="text-lg font-semibold text-foreground">How motivated do you feel right now?</Label>
          <div className="space-y-1.5">
            {MOTIVATION_LEVEL.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setMotivation(option.value)}
                className={`w-full px-3 py-2 rounded-lg border-2 text-left text-sm font-medium transition-all ${
                  motivation === option.value
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-foreground hover:border-primary/50"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label             className="text-lg font-semibold text-foreground">
            What challenges typically hold you back? <span className="text-xs text-muted-foreground">(Optional)</span>
          </Label>
          <div className="grid grid-cols-2 gap-1.5">
            {CHALLENGES.map((challenge) => (
              <button
                key={challenge}
                type="button"
                onClick={() => toggleChallenge(challenge)}
                className={`px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                  challenges.includes(challenge)
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-foreground hover:border-primary/50"
                }`}
              >
                {challenge}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-4">
          <p className="text-sm text-foreground text-pretty">
            Personal growth is a lifelong journey. The skills and insights you'll gain here will help you become the
            best version of yourself. Every small step counts.
          </p>
        </div>

        <div className="flex gap-3 pt-2">
          <StepButtonFooter onBack={onBack} onNext={handleNext} disabled={!canContinue} />
        </div>
      </CardContent>
    </Card>
  )
}
