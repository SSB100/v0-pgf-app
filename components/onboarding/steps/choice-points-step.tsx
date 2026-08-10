"use client"

import { Label } from "@/components/ui/label"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { OnboardingData } from "../onboarding-flow"
import { StepButtonFooter } from "./step-button-footer"

interface ChoicePointsStepProps {
  data: OnboardingData
  updateData: (data: Partial<OnboardingData>) => void
  onNext: () => void
  onBack: () => void
}

const CHOICE_POINT_SCENARIOS = [
  {
    id: "urge-recognition",
    label: "Noticing when an urge to gamble appears",
    description:
      "Simply becoming aware of the urge gives you a moment to pause and consider your options, rather than acting automatically.",
  },
  {
    id: "trigger-awareness",
    label: "Recognizing what situations trigger difficult feelings",
    description:
      "Understanding your triggers helps you prepare and respond with intention instead of reacting impulsively.",
  },
  {
    id: "emotion-response",
    label: "Allowing yourself to feel emotions without needing to escape them",
    description:
      "Emotions are temporary visitors. Learning to sit with them, even the uncomfortable ones, builds emotional resilience.",
  },
  {
    id: "values-alignment",
    label: "Checking if your choices align with what matters most to you",
    description:
      "Taking a moment to ask 'Does this bring me closer to the life I want?' helps guide decisions toward your values.",
  },
]

export default function ChoicePointsStep({ data, updateData, onNext, onBack }: ChoicePointsStepProps) {
  const [recognized, setRecognized] = useState<string[]>(data.recognizedChoicePoints || [])

  function toggleChoice(id: string) {
    setRecognized((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]))
  }

  function handleNext() {
    updateData({ recognizedChoicePoints: recognized })
    onNext()
  }

  const canContinue = recognized.length >= 2

  return (
    <Card className="soft-shadow-lg border-border/50">
      <CardHeader>
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
          <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
            />
          </svg>
        </div>
        <CardTitle className="text-2xl text-foreground">Recognizing Choice Points</CardTitle>
        <p className="text-muted-foreground text-pretty">
          Choice points are gentle reminders that you have options in every moment
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="bg-secondary/50 rounded-xl p-6 space-y-3">
          <h3 className="text-lg font-semibold text-foreground">What are Choice Points?</h3>
          <p className="text-sm text-foreground/90 text-pretty">
            A <span className="font-semibold text-primary">choice point</span> is that precious space between feeling
            something and acting on it. It's a moment of awareness where you can pause, breathe, and choose how to
            respond.
          </p>
          <p className="text-sm text-foreground/80 text-pretty">
            These aren't about forcing yourself to make "perfect" choices or judging yourself when you don't. They're
            simply about building awareness of the moments when you have options—and that awareness itself is incredibly
            powerful.
          </p>
        </div>

        <div className="space-y-3">
          <Label className="text-base font-semibold text-foreground">
            Which moments would you like to practice noticing? (choose at least 2)
          </Label>
          <p className="text-sm text-muted-foreground -mt-2">
            There's no pressure to be perfect. Just an invitation to start paying attention
          </p>

          <div className="space-y-2">
            {CHOICE_POINT_SCENARIOS.map((scenario) => (
              <button
                key={scenario.id}
                type="button"
                onClick={() => toggleChoice(scenario.id)}
                className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                  recognized.includes(scenario.id)
                    ? "border-primary bg-primary/10"
                    : "border-border bg-card hover:border-primary/50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      recognized.includes(scenario.id) ? "border-primary bg-primary" : "border-border bg-transparent"
                    }`}
                  >
                    {recognized.includes(scenario.id) && (
                      <svg
                        className="w-4 h-4 text-primary-foreground"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{scenario.label}</p>
                    <p className="text-xs text-muted-foreground mt-1">{scenario.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-info/10 border border-info/20 rounded-lg p-4">
          <p className="text-sm text-foreground text-pretty">
            <span className="font-semibold">A gentle reminder:</span> Choice points aren't about catching yourself doing
            something "wrong." They're about building the muscle of awareness. Some days you'll notice them clearly,
            other days they'll slip by, and that's completely okay. Each time you simply notice a choice point, you're
            strengthening your ability to respond with intention.
          </p>
        </div>

        <div className="flex gap-3 pt-6">
          <StepButtonFooter onBack={onBack} onNext={handleNext} disabled={!canContinue} />
        </div>
      </CardContent>
    </Card>
  )
}
