"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StepButtonFooter } from "./step-button-footer"

interface MindstateEducationStepProps {
  journeyTypes: string[]
  onNext: () => void
  onBack: () => void
}

export default function MindstateEducationStep({ journeyTypes, onNext, onBack }: MindstateEducationStepProps) {
  const getEmotionalMindExamples = () => {
    const examples: string[] = []
    if (journeyTypes.includes("gambling")) examples.push('"The urge to gamble feels really strong right now."')
    if (journeyTypes.includes("alcohol")) examples.push('"I really want a drink right now."')
    if (journeyTypes.includes("substances")) examples.push('"I want relief from this feeling right now."')
    if (journeyTypes.includes("mental_health")) examples.push('"This feeling is intense and I want to get away from it."')
    if (journeyTypes.includes("personal_growth")) examples.push('"I feel discouraged and want to give up on this for now."')
    if (journeyTypes.includes("gaming")) examples.push('"I want to keep playing even though I planned to stop."')
    if (examples.length === 0) examples.push('"This feeling is intense and I want to do something immediately."')
    if (examples.length < 3) examples.push("Feeling pulled toward an immediate response", "Finding it hard to consider longer-term consequences in the moment")
    return examples
  }

  const getWiseMindExamples = () => {
    const examples: string[] = []
    if (journeyTypes.includes("gambling")) examples.push('"I notice the urge to gamble, and I can also consider what matters to me before I decide."')
    if (journeyTypes.includes("alcohol")) examples.push('"I want a drink, and I can pause to consider what I want from tonight and tomorrow."')
    if (journeyTypes.includes("substances")) examples.push('"I want relief, and I can consider the options and support available to me."')
    if (journeyTypes.includes("mental_health")) examples.push('"This feeling is difficult, and I can decide what support or next step feels safest."')
    if (journeyTypes.includes("personal_growth")) examples.push('"This is difficult, and I can choose whether a small next step fits my values."')
    if (journeyTypes.includes("gaming")) examples.push('"I want to keep playing, and I can also think about the boundary I set for myself."')
    if (examples.length === 0) examples.push('"This is difficult, and I can pause before choosing what to do next."')
    if (examples.length < 3) examples.push("Making room for both emotion and practical information", "Considering feelings, facts and values together")
    return examples
  }

  const emotionalExamples = getEmotionalMindExamples()
  const wiseMindExamples = getWiseMindExamples()

  return (
    <Card className="soft-shadow-lg border-border/50">
      <CardHeader>
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
          <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
        </div>
        <CardTitle className="text-2xl text-foreground">A DBT-Informed Mind States Model</CardTitle>
        <p className="text-muted-foreground text-pretty">
          Emotional Mind, Reasonable Mind and Wise Mind are concepts used in DBT. Waypoint uses them as a reflection tool, not as a test or diagnosis.
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="bg-secondary/50 rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Three ways of describing a moment</h3>
          <p className="text-sm text-foreground/90 text-pretty">
            The model can help you notice whether emotion, logic, or a combination of both feels most prominent when you are making a decision.
            People can move between these states, and none of them makes you a good or bad decision-maker.
          </p>
        </div>

        <div className="border-2 border-destructive/30 rounded-xl p-5 bg-destructive/5 space-y-3">
          <h4 className="text-lg font-bold text-destructive">Emotional Mind</h4>
          <p className="text-sm text-foreground/90">
            A way of describing moments when feelings and urges are especially prominent and a response may feel urgent.
          </p>
          <div className="bg-card/50 rounded-lg p-3 space-y-2">
            <p className="text-xs font-semibold text-foreground">Examples:</p>
            <ul className="text-xs text-muted-foreground space-y-1 pl-4 list-disc">
              {emotionalExamples.slice(0, 3).map((example, i) => <li key={i}>{example}</li>)}
            </ul>
          </div>
        </div>

        <div className="border-2 border-info/30 rounded-xl p-5 bg-info/5 space-y-3">
          <h4 className="text-lg font-bold text-info">Reasonable Mind</h4>
          <p className="text-sm text-foreground/90">
            A way of describing moments when facts, planning and logic are most prominent, sometimes with less attention to emotion.
          </p>
          <div className="bg-card/50 rounded-lg p-3 space-y-2">
            <p className="text-xs font-semibold text-foreground">Examples:</p>
            <ul className="text-xs text-muted-foreground space-y-1 pl-4 list-disc">
              <li>Looking closely at practical consequences or probabilities</li>
              <li>Making a detailed plan</li>
              <li>Focusing on facts while finding it harder to acknowledge how you feel</li>
            </ul>
          </div>
        </div>

        <div className="border-2 border-success/30 rounded-xl p-5 bg-success/5 space-y-3">
          <h4 className="text-lg font-bold text-success">Wise Mind</h4>
          <p className="text-sm text-foreground/90">
            In this DBT model, Wise Mind refers to bringing emotion and reason together and considering both before choosing a response.
          </p>
          <div className="bg-card/50 rounded-lg p-3 space-y-2">
            <p className="text-xs font-semibold text-foreground">Examples:</p>
            <ul className="text-xs text-muted-foreground space-y-1 pl-4 list-disc">
              {wiseMindExamples.slice(0, 3).map((example, i) => <li key={i}>{example}</li>)}
            </ul>
          </div>
        </div>

        <div className="bg-primary/10 border border-primary/20 rounded-xl p-5 space-y-3">
          <h4 className="font-semibold text-foreground">A question you can try</h4>
          <p className="text-sm text-foreground">
            If a decision feels urgent, you might pause and ask: <span className="font-semibold">“What am I feeling, what are the facts, and what matters to me here?”</span>
            The aim is not to force a particular answer, but to create space to consider more than one part of the situation.
          </p>
        </div>

        <div className="bg-muted/50 border border-border/50 rounded-lg p-4">
          <p className="text-xs text-muted-foreground text-pretty">
            Later modules explore this model in more detail. You can use it if it feels useful; it is one framework among several in Waypoint.
          </p>
        </div>

        <div className="flex gap-3 pt-4"><StepButtonFooter onBack={onBack} onNext={onNext} /></div>
      </CardContent>
    </Card>
  )
}
