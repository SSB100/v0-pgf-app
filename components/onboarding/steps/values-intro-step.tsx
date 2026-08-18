"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StepButtonFooter } from "./step-button-footer"

interface ValuesIntroStepProps {
  onNext: () => void
  onBack: () => void
}

export default function ValuesIntroStep({ onNext, onBack }: ValuesIntroStepProps) {
  return (
    <Card className="soft-shadow-lg border-border/50">
      <CardHeader>
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
          <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 21a9 9 0 100-18 9 9 0 000 18zm0 0c-1.5-4.5-1.5-9 0-13m0 13c1.5-4.5 1.5-9 0-13M5 10h14M4 14h16"
            />
          </svg>
        </div>
        <CardTitle className="text-2xl text-foreground">The Life Garden</CardTitle>
        <p className="text-muted-foreground text-pretty">
          Explore what matters to you, then gradually narrow a broad set of values to three core values.
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="bg-secondary/50 rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold text-foreground">What Are Values?</h3>
          <p className="text-sm text-foreground/90 text-pretty">
            Values are not goals you complete. They are qualities and directions that can help describe how you want to
            live, how you want to treat yourself and others, and what you want to make room for in your life.
          </p>
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-card rounded-lg p-3 border border-border">
              <p className="text-xs font-semibold text-foreground mb-1">Goal</p>
              <p className="text-xs text-muted-foreground">"Pay off my debt"</p>
            </div>
            <div className="bg-primary/5 rounded-lg p-3 border border-primary/20">
              <p className="text-xs font-semibold text-primary mb-1">Value</p>
              <p className="text-xs text-foreground">"Act with responsibility"</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-base font-semibold text-foreground">How the Life Garden works</h3>

          <div className="grid gap-3">
            <div className="bg-card border border-border rounded-lg p-4 flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">1</div>
              <div>
                <p className="text-sm font-medium text-foreground">Start broad</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Select every value that genuinely feels relevant. There is no ranking at this stage.
                </p>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-4 flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">2</div>
              <div>
                <p className="text-sm font-medium text-foreground">Narrow the garden gradually</p>
                <p className="text-xs text-muted-foreground mt-1">
                  You will go through several short rounds, setting aside a few values at a time rather than trying to
                  order a long list all at once.
                </p>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-4 flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">3</div>
              <div>
                <p className="text-sm font-medium text-foreground">Finish with three core values</p>
                <p className="text-xs text-muted-foreground mt-1">
                  The final three become your core values. Waypoint will still remember the wider set you chose at the
                  beginning because those values have not stopped mattering.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-info/10 border border-info/20 rounded-lg p-4">
          <p className="text-sm text-foreground text-pretty">
            There are no right answers here. Values can change over time, and choosing three core values is simply a way
            to make the exercise useful when you are reflecting on decisions or direction.
          </p>
        </div>

        <div className="flex gap-3 pt-4">
          <StepButtonFooter onBack={onBack} onNext={onNext} nextText="Start my Life Garden" />
        </div>
      </CardContent>
    </Card>
  )
}
