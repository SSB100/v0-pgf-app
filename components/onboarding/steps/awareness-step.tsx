"use client"

import { useState } from "react"
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
  "Anxious", "Calm", "Confused", "Scared", "Happy", "Lonely", "Angry", "Helpless", "Proud", "Frustrated", "Guilty", "Excited", "Sad", "Ashamed", "Hopeful", "Content", "Disappointed", "Grateful",
]

export default function AwarenessStep({ data, updateData, onNext, onBack }: AwarenessStepProps) {
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>(data.currentEmotions || [])
  const [strongestEmotion, setStrongestEmotion] = useState(data.strongestEmotion || "")
  const [situation, setSituation] = useState(data.situationDescription || "")
  const [selfTalk, setSelfTalk] = useState(data.selfTalk || "")
  const [stillExperiencing, setStillExperiencing] = useState<boolean | null>(data.stillExperiencing !== undefined ? data.stillExperiencing : null)

  function toggleEmotion(emotion: string) {
    setSelectedEmotions((prev) => (prev.includes(emotion) ? prev.filter((e) => e !== emotion) : [...prev, emotion]))
  }

  function handleNext() {
    updateData({ currentEmotions: selectedEmotions, strongestEmotion, situationDescription: situation, selfTalk, stillExperiencing })
    onNext()
  }

  const canContinue = selectedEmotions.length > 0 && strongestEmotion && situation && selfTalk && stillExperiencing !== null

  return (
    <Card className="soft-shadow-lg border-border/50">
      <CardHeader>
        <CardTitle className="text-2xl text-foreground">Notice What's Happening</CardTitle>
        <p className="text-muted-foreground text-pretty">Take a moment to describe your experience without needing to label it as good or bad.</p>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label className="text-lg font-semibold text-foreground">What emotions have you noticed today? (select all that apply)</Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {EMOTIONS.map((emotion) => (
              <button key={emotion} type="button" onClick={() => toggleEmotion(emotion)} className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${selectedEmotions.includes(emotion) ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-foreground hover:border-primary/50"}`}>
                {emotion}
              </button>
            ))}
          </div>
        </div>

        {selectedEmotions.length > 0 && (
          <div className="space-y-3">
            <Label className="text-lg font-semibold text-foreground">Which emotion felt strongest?</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {selectedEmotions.map((emotion) => (
                <button key={emotion} type="button" onClick={() => setStrongestEmotion(emotion)} className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${strongestEmotion === emotion ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-foreground hover:border-primary/50"}`}>
                  {emotion}
                </button>
              ))}
            </div>
          </div>
        )}

        {strongestEmotion && (
          <div className="space-y-3">
            <Label htmlFor="situation" className="text-lg font-semibold text-foreground">What was happening around that time?</Label>
            <Textarea id="situation" value={situation} onChange={(e) => setSituation(e.target.value)} onFocus={(e) => setTimeout(() => e.target.scrollIntoView({ behavior: "smooth", block: "center" }), 300)} placeholder="Describe as much or as little context as is useful..." className="min-h-[80px] resize-none" />
          </div>
        )}

        {situation && (
          <div className="space-y-3">
            <Label htmlFor="selfTalk" className="text-lg font-semibold text-foreground">What would you like to remind yourself about this situation?</Label>
            <Textarea id="selfTalk" value={selfTalk} onChange={(e) => setSelfTalk(e.target.value)} onFocus={(e) => setTimeout(() => e.target.scrollIntoView({ behavior: "smooth", block: "center" }), 300)} placeholder="A perspective, observation or reminder you want to keep..." className="min-h-[80px] resize-none" />
          </div>
        )}

        {selfTalk && (
          <div className="space-y-3">
            <Label className="text-lg font-semibold text-foreground">Are you still noticing this emotion now?</Label>
            <div className="flex gap-3">
              <button type="button" onClick={() => setStillExperiencing(true)} className={`flex-1 p-4 rounded-lg border-2 font-medium transition-all ${stillExperiencing === true ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-foreground hover:border-primary/50"}`}>Yes</button>
              <button type="button" onClick={() => setStillExperiencing(false)} className={`flex-1 p-4 rounded-lg border-2 font-medium transition-all ${stillExperiencing === false ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-foreground hover:border-primary/50"}`}>No</button>
            </div>
          </div>
        )}

        {stillExperiencing !== null && (
          <div className="bg-success/10 border border-success/20 rounded-lg p-4">
            <p className="text-sm text-foreground text-pretty">
              You have recorded what you were feeling, what was happening and whether the emotion is still present. The point of this exercise is simply to notice the pattern; there is no required emotional outcome.
            </p>
          </div>
        )}

        <div className="flex gap-3 pt-6"><StepButtonFooter onBack={onBack} onNext={handleNext} disabled={!canContinue} /></div>
      </CardContent>
    </Card>
  )
}
