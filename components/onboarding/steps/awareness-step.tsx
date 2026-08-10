"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { OnboardingData } from "../onboarding-flow"
import { StepButtonFooter } from "./step-button-footer"

interface AwarenessStepProps {
  data: OnboardingData
  updateData: (data: Partial<OnboardingData>) => void
  onNext: () => void
  onBack: () => void
}

const EMOTIONS = [
  "Anxious",
  "Calm",
  "Confused",
  "Scared",
  "Happy",
  "Lonely",
  "Angry",
  "Helpless",
  "Proud",
  "Frustrated",
  "Guilty",
  "Excited",
  "Sad",
  "Ashamed",
  "Hopeful",
  "Content",
  "Disappointed",
  "Grateful",
]

export default function AwarenessStep({ data, updateData, onNext, onBack }: AwarenessStepProps) {
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>(data.currentEmotions || [])
  const [strongestEmotion, setStrongestEmotion] = useState(data.strongestEmotion || "")
  const [situation, setSituation] = useState(data.situationDescription || "")
  const [selfTalk, setSelfTalk] = useState(data.selfTalk || "")
  const [stillExperiencing, setStillExperiencing] = useState<boolean | null>(
    data.stillExperiencing !== undefined ? data.stillExperiencing : null,
  )

  function toggleEmotion(emotion: string) {
    setSelectedEmotions((prev) => (prev.includes(emotion) ? prev.filter((e) => e !== emotion) : [...prev, emotion]))
  }

  function handleNext() {
    updateData({
      currentEmotions: selectedEmotions,
      strongestEmotion,
      situationDescription: situation,
      selfTalk,
      stillExperiencing,
    })
    onNext()
  }

  const canContinue =
    selectedEmotions.length > 0 && strongestEmotion && situation && selfTalk && stillExperiencing !== null

  const negativeEmotions = [
    "Anxious",
    "Scared",
    "Lonely",
    "Angry",
    "Helpless",
    "Frustrated",
    "Guilty",
    "Sad",
    "Ashamed",
    "Disappointed",
    "Confused",
  ]
  const isNegativeEmotion = negativeEmotions.includes(strongestEmotion)

  return (
    <Card className="soft-shadow-lg border-border/50">
      <CardHeader>
        <CardTitle className="text-2xl text-foreground">Notice What's Happening</CardTitle>
        <p className="text-muted-foreground text-pretty">
          Take a moment to observe your experience today without judgment
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label className="text-lg font-semibold text-foreground">
            What emotions have you felt today? (Select all that apply)
          </Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {EMOTIONS.map((e) => (
              <button
                key={e}
                type="button"
                onClick={() => toggleEmotion(e)}
                className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                  selectedEmotions.includes(e)
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-foreground hover:border-primary/50"
                }`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        {selectedEmotions.length > 0 && (
          <div className="space-y-3">
            <Label             className="text-lg font-semibold text-foreground">
              What was the strongest emotion you experienced today?
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {selectedEmotions.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setStrongestEmotion(e)}
                  className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                    strongestEmotion === e
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-card text-foreground hover:border-primary/50"
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>
        )}

        {strongestEmotion && (
          <div className="space-y-3">
            <Label htmlFor="situation"             className="text-lg font-semibold text-foreground">
              What was happening at the time?
            </Label>
            <Textarea
              id="situation"
              value={situation}
              onChange={(e) => setSituation(e.target.value)}
              onFocus={(e) => setTimeout(() => e.target.scrollIntoView({ behavior: "smooth", block: "center" }), 300)}
              placeholder="Describe the situation when you felt this emotion..."
              className="min-h-[80px] resize-none"
            />
          </div>
        )}

        {situation && (
          <div className="space-y-3">
            <Label htmlFor="selfTalk"             className="text-lg font-semibold text-foreground">
              What can I tell myself about what happened?
            </Label>
            <Textarea
              id="selfTalk"
              value={selfTalk}
              onChange={(e) => setSelfTalk(e.target.value)}
              onFocus={(e) => setTimeout(() => e.target.scrollIntoView({ behavior: "smooth", block: "center" }), 300)}
              placeholder="A helpful perspective or reminder to yourself..."
              className="min-h-[80px] resize-none"
            />
          </div>
        )}

        {selfTalk && (
          <div className="space-y-3">
            <Label             className="text-lg font-semibold text-foreground">Are you still experiencing this emotion?</Label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStillExperiencing(true)}
                className={`flex-1 p-4 rounded-lg border-2 font-medium transition-all ${
                  stillExperiencing === true
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-foreground hover:border-primary/50"
                }`}
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => setStillExperiencing(false)}
                className={`flex-1 p-4 rounded-lg border-2 font-medium transition-all ${
                  stillExperiencing === false
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-foreground hover:border-primary/50"
                }`}
              >
                No
              </button>
            </div>
          </div>
        )}

        {stillExperiencing !== null && (
          <div className="bg-success/10 border border-success/20 rounded-lg p-4">
            {stillExperiencing && isNegativeEmotion ? (
              <p className="text-sm text-foreground text-pretty">
                <span className="font-semibold">Remember:</span> All emotions eventually pass, especially when you take
                the right steps forward. You're building awareness right now, and that's a powerful first step toward
                change.
              </p>
            ) : stillExperiencing && !isNegativeEmotion ? (
              <p className="text-sm text-foreground text-pretty">
                <span className="font-semibold">Wonderful:</span> Noticing positive emotions helps us recognize what
                brings us joy and meaning. This awareness can guide you toward more of what matters.
              </p>
            ) : !stillExperiencing && isNegativeEmotion ? (
              <p className="text-sm text-foreground text-pretty">
                <span className="font-semibold">This is important:</span> You just proved that negative emotions are not
                permanent. They change and pass. This practice is all about being aware of this truth—emotions come and
                go, and you have the power to influence that process.
              </p>
            ) : (
              <p className="text-sm text-foreground text-pretty">
                <span className="font-semibold">Great awareness:</span> Noticing how your emotions shift throughout the
                day helps you understand your patterns and what influences your emotional state.
              </p>
            )}
          </div>
        )}

        <div className="flex gap-3 pt-6">
          <StepButtonFooter onBack={onBack} onNext={handleNext} disabled={!canContinue} />
        </div>
      </CardContent>
    </Card>
  )
}
