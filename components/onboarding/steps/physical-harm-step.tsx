"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { supportResources } from "@/lib/support-resources"
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
    updateData({ selfHarmThoughts, selfHarmActions, suicidalThoughts })
    onNext()
  }

  const canContinue = selfHarmThoughts && selfHarmActions && suicidalThoughts
  const emergency = supportResources.emergency
  const emotionalSupport = supportResources.emotionalSupport

  return (
    <Card className="soft-shadow-lg border-border/50">
      <CardHeader>
        <CardTitle className="text-2xl text-foreground">A Few Questions About Your Safety</CardTitle>
        <p className="text-muted-foreground text-pretty">
          These questions help personalise Waypoint. They are direct because clear language matters when talking about safety.
          You can choose “Prefer not to say” for any question. Your answers are not monitored in real time.
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 space-y-2">
          <p className="text-sm text-amber-900 dark:text-amber-100 text-pretty">
            {emergency.description} For free, confidential brief emotional support, call or text {emotionalSupport.phone} any time.
          </p>
          <p className="text-xs text-amber-800 dark:text-amber-200 font-medium">
            Waypoint does not notify a clinician, counsellor or support worker when you answer these questions.
          </p>
          <Button asChild variant="outline" size="sm" className="bg-background/60">
            <Link href="/support">View New Zealand support options</Link>
          </Button>
        </div>

        <div className="space-y-3">
          <Label className="text-base font-semibold text-foreground">Have you had thoughts of harming yourself in the past 6 months?</Label>
          <div className="space-y-2">
            {["No, not at all", "Occasionally", "Frequently", "Prefer not to say"].map((option) => (
              <button key={option} type="button" onClick={() => setSelfHarmThoughts(option)} className={`w-full p-3 rounded-lg border-2 text-left font-medium transition-all ${selfHarmThoughts === option ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-foreground hover:border-primary/50"}`}>
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-base font-semibold text-foreground">Have you harmed yourself in the past 6 months?</Label>
          <div className="space-y-2">
            {["No", "Yes, but not recently", "Yes, recently", "Prefer not to say"].map((option) => (
              <button key={option} type="button" onClick={() => setSelfHarmActions(option)} className={`w-full p-3 rounded-lg border-2 text-left font-medium transition-all ${selfHarmActions === option ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-foreground hover:border-primary/50"}`}>
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-base font-semibold text-foreground">Have you had thoughts about ending your life?</Label>
          <div className="space-y-2">
            {["No, never", "Yes, but not recently", "Yes, recently or currently", "Prefer not to say"].map((option) => (
              <button key={option} type="button" onClick={() => setSuicidalThoughts(option)} className={`w-full p-3 rounded-lg border-2 text-left font-medium transition-all ${suicidalThoughts === option ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-foreground hover:border-primary/50"}`}>
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-info/10 border border-info/20 rounded-lg p-4">
          <p className="text-sm text-foreground text-pretty">
            Thank you for answering. Waypoint can provide self-guided tools and support information, but it does not assess your level of risk or replace professional care.
            If you are worried about your safety, use the support options above or contact a healthcare professional or trusted person.
          </p>
        </div>

        <div className="flex gap-3 pt-6">
          <StepButtonFooter onBack={onBack} onNext={handleNext} disabled={!canContinue} />
        </div>
      </CardContent>
    </Card>
  )
}
