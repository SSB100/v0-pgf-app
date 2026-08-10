"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import type { OnboardingData } from "../onboarding-flow"
import { StepButtonFooter } from "./step-button-footer"

interface StrengthsStepProps {
  data: OnboardingData
  updateData: (data: Partial<OnboardingData>) => void
  onNext: () => void
  onBack: () => void
}

const STRENGTHS_LIST = [
  "Compassionate",
  "Resilient",
  "Creative",
  "Loyal",
  "Determined",
  "Honest",
  "Supportive",
  "Thoughtful",
  "Brave",
  "Patient",
  "Funny",
  "Generous",
  "Hardworking",
  "Adaptable",
  "Caring",
  "Reliable",
  "Open-minded",
  "Optimistic",
  "Resourceful",
  "Empathetic",
]

export default function StrengthsStep({ data, updateData, onNext, onBack }: StrengthsStepProps) {
  const [step, setStep] = useState<"intro" | "others" | "self">("intro")
  const [othersStrengths, setOthersStrengths] = useState<string[]>(data.perceivedStrengths || [])
  const [selfStrengths, setSelfStrengths] = useState<string[]>(data.identifiedStrengths || [])

  const toggleOthersStrength = (strength: string) => {
    setOthersStrengths((prev) => (prev.includes(strength) ? prev.filter((s) => s !== strength) : [...prev, strength]))
  }

  const toggleSelfStrength = (strength: string) => {
    setSelfStrengths((prev) => (prev.includes(strength) ? prev.filter((s) => s !== strength) : [...prev, strength]))
  }

  const handleOthersNext = () => {
    updateData({ perceivedStrengths: othersStrengths })
    setStep("self")
  }

  const handleComplete = () => {
    updateData({
      perceivedStrengths: othersStrengths,
      identifiedStrengths: selfStrengths,
    })
    onNext()
  }

  if (step === "intro") {
    return (
      <Card className="soft-shadow-lg border-border/50">
        <CardHeader>
          <CardTitle className="text-2xl text-foreground">Your Strengths</CardTitle>
          <CardDescription className="text-base">
            Recognize the qualities that have carried you through challenges
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-secondary/20 rounded-xl p-4 space-y-2">
            <p className="text-sm text-foreground/90 text-pretty">
              Even in tough times, your strengths are still there. We'll explore them from two angles: how others might see you, and how you see yourself.
            </p>
            <p className="text-xs text-muted-foreground">💡 If this feels hard, ask a trusted friend to help you recognize what they see in you.</p>
          </div>

          <div className="flex gap-3 pt-2">
            <StepButtonFooter onBack={onBack} onNext={() => setStep("others")} />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (step === "others") {
    return (
      <Card className="soft-shadow-lg border-border/50">
        <CardHeader>
          <CardTitle className="text-xl text-foreground">How Others See You</CardTitle>
          <CardDescription className="text-sm">
            Strengths a friend or family member might recognize in you
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-xs text-muted-foreground italic">
            Think of someone who cares about you. What positive qualities might they see?
          </p>

          <div className="space-y-3">
            <Label className="text-base font-semibold text-foreground">
              Select strengths ({othersStrengths.length} selected)
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {STRENGTHS_LIST.map((strength) => (
                <button
                  key={strength}
                  type="button"
                  onClick={() => toggleOthersStrength(strength)}
                  className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all text-center ${
                    othersStrengths.includes(strength)
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-foreground border-border hover:border-primary/50"
                  }`}
                >
                  {strength}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <StepButtonFooter 
              onBack={() => setStep("intro")} 
              onNext={handleOthersNext} 
              disabled={othersStrengths.length === 0}
            />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="soft-shadow-lg border-border/50">
      <CardHeader>
        <CardTitle className="text-xl text-foreground">Your Strengths</CardTitle>
        <CardDescription className="text-sm">What strengths do you see in yourself?</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-secondary/20 rounded-lg p-3">
          <p className="text-xs text-foreground/90 text-pretty">
            Your strengths can exist alongside mistakes. Being resilient doesn't mean you never struggle. Your inherent qualities don't disappear during difficult moments.
          </p>
        </div>

        <div className="space-y-3">
          <Label className="text-base font-semibold text-foreground">
            Select strengths ({selfStrengths.length} selected)
          </Label>
          <div className="grid grid-cols-2 gap-2">
            {STRENGTHS_LIST.map((strength) => (
              <button
                key={strength}
                type="button"
                onClick={() => toggleSelfStrength(strength)}
                className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all text-center ${
                  selfStrengths.includes(strength)
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-foreground border-border hover:border-primary/50"
                } ${othersStrengths.includes(strength) ? "ring-1 ring-primary/50" : ""}`}
              >
                {strength}
                {othersStrengths.includes(strength) && selfStrengths.includes(strength) && " ✓"}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">Ring outline = strength others might also see in you</p>
        </div>

        {selfStrengths.length > 0 && (
          <div className="space-y-2">
            {(() => {
              const inBoth = selfStrengths.filter((s) => othersStrengths.includes(s))
              const onlyInOthers = othersStrengths.filter((s) => !selfStrengths.includes(s))
              const onlyInSelf = selfStrengths.filter((s) => !othersStrengths.includes(s))

              return (
                <>
                  {inBoth.length > 0 && (
                    <div className="bg-primary/10 border border-primary/30 rounded p-2">
                      <p className="text-xs font-semibold text-foreground">Both recognize: <span className="font-normal">{inBoth.join(", ")}</span></p>
                    </div>
                  )}
                  {onlyInOthers.length > 0 && (
                    <div className="bg-secondary/20 border border-secondary/30 rounded p-2">
                      <p className="text-xs font-semibold text-foreground">They see: <span className="font-normal">{onlyInOthers.join(", ")}</span></p>
                    </div>
                  )}
                  {onlyInSelf.length > 0 && (
                    <div className="bg-accent/20 border border-accent/30 rounded p-2">
                      <p className="text-xs font-semibold text-foreground">You see: <span className="font-normal">{onlyInSelf.join(", ")}</span></p>
                    </div>
                  )}
                </>
              )
            })()}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <StepButtonFooter 
            onBack={() => setStep("others")} 
            onNext={handleComplete} 
            disabled={selfStrengths.length === 0}
          />
        </div>
      </CardContent>
    </Card>
  )
}
