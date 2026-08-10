"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StepButtonFooter } from "./step-button-footer"

interface AwarenessIntroStepProps {
  onNext: () => void
  onBack: () => void
}

export default function AwarenessIntroStep({ onNext, onBack }: AwarenessIntroStepProps) {
  return (
    <Card className="soft-shadow-lg border-border/50">
      <CardHeader>
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
          <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
        </div>
        <CardTitle className="text-2xl text-foreground">Understanding Awareness</CardTitle>
        <p className="text-muted-foreground text-pretty">
          The foundation of change is noticing what's happening in the moment
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="bg-secondary/50 rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold text-foreground">What is Awareness?</h3>
          <p className="text-sm text-foreground/90 text-pretty">
            Awareness means <span className="font-semibold text-primary">noticing what's happening</span> in your mind
            and body without immediately acting on it. It's the pause between feeling something and doing something
            about it.
          </p>
          <p className="text-sm text-foreground/90 text-pretty">
            When you're aware, you can catch yourself at a{" "}
            <span className="font-semibold text-primary">"choice point"</span>: a moment where you can choose a
            different path.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-base font-semibold text-foreground">Why This Matters for Recovery</h3>

          <div className="space-y-3">
            <div className="flex gap-3 items-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-bold text-sm">1</span>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Recognize Triggers Early</p>
                <p className="text-xs text-muted-foreground">
                  Notice stress, boredom, or emotions before they lead to urges
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-bold text-sm">2</span>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Understand Your Patterns</p>
                <p className="text-xs text-muted-foreground">
                  See the connection between feelings, thoughts, and gambling urges
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-bold text-sm">3</span>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Create Space for Choice</p>
                <p className="text-xs text-muted-foreground">
                  Between the urge and the action, awareness gives you the power to choose differently
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-info/10 border border-info/20 rounded-lg p-4">
          <p className="text-sm text-foreground text-pretty italic">
            You can't control what thoughts or feelings show up, but you can notice them, name them, and choose how to
            respond.
          </p>
        </div>

        <div className="flex gap-3 pt-4">
          <StepButtonFooter onBack={onBack} onNext={onNext} />
        </div>
      </CardContent>
    </Card>
  )
}
