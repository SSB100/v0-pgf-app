"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { OnboardingData } from "../onboarding-flow"
import { StepButtonFooter } from "./step-button-footer"

interface ValuesEncouragementStepProps {
  data: OnboardingData
  onNext: () => void
  onBack: () => void
}

export default function ValuesEncouragementStep({ data, onNext, onBack }: ValuesEncouragementStepProps) {
  const selectedCount = data.initialValuesShortlist?.length || 0

  return (
    <Card className="soft-shadow-lg border-border/50">
      <CardHeader>
        <CardTitle className="text-2xl text-foreground">Your Values Matter</CardTitle>
        <p className="text-muted-foreground text-pretty">Let's explore what truly matters to you</p>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 space-y-4">
          <p className="text-foreground text-pretty">
            You've selected {selectedCount} {selectedCount === 1 ? "value" : "values"} so far. That's a wonderful start,
            but let's dig a little deeper.
          </p>

          <p className="text-foreground text-pretty italic">
            "Values are like a compass: they guide us toward the life we want to live."
          </p>

          <div className="space-y-3 text-sm text-foreground/90">
            <p className="text-pretty">
              <span className="font-semibold">Understanding Values:</span> Values aren't goals or feelings. They're the
              principles and qualities that matter most to you: like kindness, honesty, connection, or growth.
            </p>

            <p className="text-pretty">
              <span className="font-semibold">Why Multiple Values?</span> Life is rich and multifaceted. We need values
              across different areas: relationships, personal growth, health, character, and purpose. Each value
              supports a different part of who we want to be.
            </p>

            <p className="text-pretty">
              <span className="font-semibold">You Deserve This:</span> Having strong values isn't selfish: it's
              essential. When you know what matters to you, you can make choices that lead to a life you're proud of.
              You deserve to have values that guide you toward meaning and fulfillment.
            </p>
          </div>

          <div className="bg-card/50 rounded-lg p-4 mt-4">
            <p className="text-sm font-medium text-foreground mb-2">Think about:</p>
            <ul className="text-sm text-foreground/90 space-y-1 list-disc list-inside">
              <li>What kind of friend, family member, or partner do you want to be?</li>
              <li>What personal qualities would make you feel proud?</li>
              <li>How do you want to treat yourself and others?</li>
              <li>What gives your life meaning and direction?</li>
            </ul>
          </div>

          <p className="text-foreground font-medium text-center pt-4">
            We encourage you to select at least 8 values to create a strong foundation for your journey.
          </p>
        </div>

        <div className="flex gap-3">
          <StepButtonFooter onBack={onBack} onNext={onNext} />
        </div>
      </CardContent>
    </Card>
  )
}
