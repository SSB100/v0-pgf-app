"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { OnboardingData } from "../onboarding-flow"
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
          <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <CardTitle className="text-2xl text-foreground">Understanding Your Values</CardTitle>
        <p className="text-muted-foreground text-pretty">
          Values are your compass—they show you the direction you want to move in life
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="bg-secondary/50 rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold text-foreground">What Are Values?</h3>
          <p className="text-sm text-foreground/90 text-pretty">
            Values aren't goals you achieve—they're{" "}
            <span className="font-semibold text-primary">qualities you want to live by</span>. They're about the person
            you want to be and how you want to treat yourself and others.
          </p>
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-card rounded-lg p-3 border border-border">
              <p className="text-xs font-semibold text-foreground mb-1">Not a Value ✗</p>
              <p className="text-xs text-muted-foreground">"Win back my losses"</p>
            </div>
            <div className="bg-primary/5 rounded-lg p-3 border border-primary/20">
              <p className="text-xs font-semibold text-primary mb-1">Value ✓</p>
              <p className="text-xs text-foreground">"Act with honesty"</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-base font-semibold text-foreground">Values vs. Rules vs. Goals</h3>

          <div className="space-y-3">
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-sm font-medium text-foreground mb-1">Values (Toward Moves)</p>
              <p className="text-xs text-muted-foreground">
                Directions you move toward: "Being a caring parent," "Living authentically," "Staying connected to
                family"
              </p>
            </div>

            <div className="bg-muted/50 border border-muted rounded-lg p-4">
              <p className="text-sm font-medium text-foreground mb-1">Rules (Away Moves)</p>
              <p className="text-xs text-muted-foreground">
                Things you avoid: "Never gamble again," "Always say no to betting ads." These can work short-term but
                don't give you direction.
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-sm font-medium text-foreground mb-1">Goals (Checkpoints)</p>
              <p className="text-xs text-muted-foreground">
                Things you achieve: "Pay off debt," "Rebuild trust with partner." Goals support values but aren't the
                values themselves.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-info/10 border border-info/20 rounded-lg p-4">
          <p className="text-sm text-foreground text-pretty italic">
            When you're clear on your values, even small steps in that direction create meaning and momentum—regardless
            of how many times you've fallen off track.
          </p>
        </div>

        <div className="flex gap-3 pt-4">
          <StepButtonFooter onBack={onBack} onNext={onNext} />
        </div>
      </CardContent>
    </Card>
  )
}
