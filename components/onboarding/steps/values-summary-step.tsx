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
  const coreValues = (data.selectedValues || []).slice(0, 3)
  const allSelectedValues = data.initialValuesShortlist || coreValues.map((value) => value.name)

  return (
    <Card className="soft-shadow-lg border-border/50 w-full max-w-4xl mx-auto">
      <CardHeader className="px-4 sm:px-6">
        <CardTitle className="text-xl sm:text-2xl text-foreground">Your Life Garden</CardTitle>
        <p className="text-sm sm:text-base text-muted-foreground text-pretty">
          You started with a wider set of values and gradually narrowed them to three that feel most central right now.
        </p>
      </CardHeader>

      <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6 pb-6 sm:pb-8">
        <div className="bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 rounded-lg p-5 space-y-3">
          <p className="text-sm text-foreground/90 text-pretty">
            The three values you kept through the final round are your <span className="font-semibold">core values</span>.
            They are not the only things that matter to you, and they do not have to be ranked against one another.
          </p>
          <p className="text-sm text-foreground/90 text-pretty">
            Waypoint will also keep the full set you chose at the start so your wider values picture is not lost.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold text-foreground">Your 3 Core Values</h3>
          <div className="grid sm:grid-cols-3 gap-2">
            {coreValues.map((value) => (
              <div
                key={value.name}
                className="flex items-center justify-center text-center bg-primary/10 border border-primary/30 rounded-lg p-4 min-h-20"
              >
                <span className="text-base font-semibold text-foreground">{value.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-foreground">Your Wider Values</h3>
            <p className="text-xs text-muted-foreground mt-1">
              These are all the values you selected at the beginning of the Life Garden exercise.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {allSelectedValues.map((value) => {
              const isCore = coreValues.some((coreValue) => coreValue.name === value)
              return (
                <div
                  key={value}
                  className={`rounded-lg px-3 py-2 text-sm border ${
                    isCore
                      ? "bg-primary/10 border-primary/30 text-foreground font-medium"
                      : "bg-secondary/40 border-border text-foreground"
                  }`}
                >
                  {value}
                  {isCore && <span className="block text-[10px] text-primary mt-0.5">Core value</span>}
                </div>
              )
            })}
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4 space-y-2">
          <p className="text-sm font-semibold text-foreground">A useful way to think about this:</p>
          <p className="text-sm text-foreground/90 text-pretty">
            Your core values are a small compass you can return to when a decision feels complicated. Your wider values
            still matter and may become more or less important at different points in your life.
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
