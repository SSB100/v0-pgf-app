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
          <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
        </div>
        <CardTitle className="text-2xl text-foreground">Building Awareness</CardTitle>
        <p className="text-muted-foreground text-pretty">Practise noticing what is happening before deciding what to do next.</p>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="bg-secondary/50 rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold text-foreground">What do we mean by awareness?</h3>
          <p className="text-sm text-foreground/90 text-pretty">
            In Waypoint, awareness means noticing thoughts, emotions, body sensations and urges without having to act on them immediately.
            Sometimes that creates a little more room to choose how you want to respond.
          </p>
          <p className="text-sm text-foreground/90 text-pretty">
            You may hear this kind of moment described as a <span className="font-semibold text-primary">choice point</span>: a point where more than one next step is possible.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-base font-semibold text-foreground">What you might notice</h3>
          <div className="space-y-3">
            {[
              ["1", "Situations and cues", "Notice places, routines, thoughts or feelings that tend to come before an urge or difficult moment."],
              ["2", "Patterns over time", "Look for connections between what was happening, how you felt and what you did next."],
              ["3", "A little more choice", "Pausing does not guarantee a particular outcome, but it can give you time to consider what fits your goals and values."],
            ].map(([number, title, description]) => (
              <div key={number} className="flex gap-3 items-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center"><span className="text-primary font-bold text-sm">{number}</span></div>
                <div><p className="text-sm font-medium text-foreground">{title}</p><p className="text-xs text-muted-foreground">{description}</p></div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-info/10 border border-info/20 rounded-lg p-4">
          <p className="text-sm text-foreground text-pretty">
            Thoughts, feelings and urges can show up without being chosen. This exercise is about noticing them, not judging yourself for having them.
          </p>
        </div>

        <div className="flex gap-3 pt-4"><StepButtonFooter onBack={onBack} onNext={onNext} /></div>
      </CardContent>
    </Card>
  )
}
