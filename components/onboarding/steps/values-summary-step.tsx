"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { OnboardingData } from "../onboarding-flow"

interface ValuesSummaryStepProps {
  data: OnboardingData
  onNext: () => void
  onBack: () => void
}

export default function ValuesSummaryStep({ data, onNext, onBack }: ValuesSummaryStepProps) {
  const values = data.selectedValues || []

  return (
    <Card className="soft-shadow-lg border-border/50 w-full max-w-4xl mx-auto">
      <CardHeader className="px-4 sm:px-6">
        <CardTitle className="text-xl sm:text-2xl text-foreground">Your Values Compass</CardTitle>
        <p className="text-sm sm:text-base text-muted-foreground text-pretty">
          These values will guide your journey toward a meaningful life
        </p>
      </CardHeader>

      <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6 pb-6 sm:pb-8">
        <div className="bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 rounded-lg p-6 space-y-4">
          <p className="text-foreground font-medium text-center text-lg">
            Congratulations on identifying your core values!
          </p>

          <p className="text-sm text-foreground/90 text-pretty">
            You've done important work here. By clarifying what matters most to you, you've created a personal compass
            that can guide you through challenges and help you make choices aligned with who you want to be.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold text-foreground">Your Top 3 Core Values:</h3>
          <div className="space-y-2">
            {values.slice(0, 3).map((value, index) => (
              <div
                key={value.name}
                className="flex items-center gap-3 bg-primary/10 border border-primary/30 rounded-lg p-4"
              >
                <span className="text-2xl font-bold text-primary">#{index + 1}</span>
                <span className="text-lg font-medium text-foreground">{value.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold text-foreground">Your Complete Values:</h3>
          <div className="grid grid-cols-2 gap-2">
            {values.map((value) => (
              <div key={value.name} className="bg-secondary/50 rounded-lg px-4 py-2 text-sm text-foreground">
                {value.name}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4 space-y-2">
          <p className="text-sm font-semibold text-foreground">Remember:</p>
          <p className="text-sm text-foreground/90 text-pretty">
            This ranking isn't about which values are unimportant: all your values matter. This exercise simply helps
            you identify your <span className="font-semibold">core guiding principles</span>. When you face difficult
            choices or feel lost, these top values can light the way forward.
          </p>
        </div>

        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
          <p className="text-sm text-foreground/90 text-pretty italic text-center">
            "Values are not just words: they're a way of living. Every choice you make is an opportunity to move toward
            the person you want to be."
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4 w-full">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="w-full sm:flex-1 bg-transparent h-12 sm:h-auto"
          >
            Back
          </Button>
          <Button
            type="button"
            onClick={onNext}
            className="w-full sm:flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-medium h-12 sm:h-auto"
          >
            Continue Journey
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
