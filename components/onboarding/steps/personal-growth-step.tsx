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
  "Build helpful habits",
  "Manage stress",
  "Improve emotional awareness",
  "Build confidence",
  "Improve work-life balance",
  "Improve relationships",
  "Work with procrastination",
  "Build resilience",
  "Explore purpose or direction",
  "Practise mindfulness",
]

const MOTIVATION_LEVEL = [
  { value: "very_high", label: "I feel ready to make changes now" },
  { value: "high", label: "I feel fairly motivated" },
  { value: "moderate", label: "I'm interested and still exploring" },
  { value: "building", label: "I'm not very motivated yet, but I'm open to support" },
]

const CHALLENGES = [
  "Staying consistent",
  "Limited time or energy",
  "Self-doubt",
  "Unclear direction",
  "Previous attempts that didn't go as planned",
  "Feeling overwhelmed",
  "Perfectionism",
  "Uncertainty about change",
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
    updateData({ growthGoals, growthMotivation: motivation, growthChallenges: challenges })
    onNext()
  }

  const canContinue = growthGoals.length > 0 && motivation

  return (
    <Card className="soft-shadow-lg border-border/50">
      <CardHeader>
        <CardTitle className="text-2xl text-foreground">Personal Growth</CardTitle>
        <p className="text-muted-foreground text-pretty">
          Choose the areas you would like to work on. Your motivation can change from day to day, so there is no "right" answer here.
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="text-lg font-semibold text-foreground">What would you like to work on? (select all that apply)</Label>
          <div className="grid grid-cols-2 gap-1.5">
            {GROWTH_GOALS.map((goal) => (
              <button key={goal} type="button" onClick={() => toggleGoal(goal)} className={`px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all ${growthGoals.includes(goal) ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-foreground hover:border-primary/50"}`}>
                {goal}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-lg font-semibold text-foreground">How motivated do you feel right now?</Label>
          <div className="space-y-1.5">
            {MOTIVATION_LEVEL.map((option) => (
              <button key={option.value} type="button" onClick={() => setMotivation(option.value)} className={`w-full px-3 py-2 rounded-lg border-2 text-left text-sm font-medium transition-all ${motivation === option.value ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-foreground hover:border-primary/50"}`}>
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-lg font-semibold text-foreground">What tends to make change harder for you? <span className="text-xs text-muted-foreground">(Optional)</span></Label>
          <div className="grid grid-cols-2 gap-1.5">
            {CHALLENGES.map((challenge) => (
              <button key={challenge} type="button" onClick={() => toggleChallenge(challenge)} className={`px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all ${challenges.includes(challenge) ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-foreground hover:border-primary/50"}`}>
                {challenge}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-4">
          <p className="text-sm text-foreground text-pretty">
            You can change direction, take breaks and revisit these goals later. Waypoint uses them to personalise your experience; they are not a measure of success or failure.
          </p>
        </div>

        <div className="flex gap-3 pt-2"><StepButtonFooter onBack={onBack} onNext={handleNext} disabled={!canContinue} /></div>
      </CardContent>
    </Card>
  )
}
