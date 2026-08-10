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
    const examples = []

    if (journeyTypes.includes("gambling")) {
      examples.push('"I need to gamble RIGHT NOW to feel better"')
    }
    if (journeyTypes.includes("alcohol")) {
      examples.push('"I have to have a drink right now"')
    }
    if (journeyTypes.includes("substances")) {
      examples.push('"I need to use right now to escape this feeling"')
    }
    if (journeyTypes.includes("mental_health")) {
      examples.push('"I can\'t handle this anxiety, I need to avoid it"')
    }
    if (journeyTypes.includes("personal_growth")) {
      examples.push('"I\'ll never succeed, why bother trying"')
    }
    if (journeyTypes.includes("gaming")) {
      examples.push('"I need to play just one more game"')
    }

    // Add general examples if specific ones don't fill it
    if (examples.length === 0) {
      examples.push('"I can\'t stand this feeling, I have to do something"')
    }
    if (examples.length < 3) {
      examples.push(
        '"I can\'t stand this feeling, I have to do something"',
        "Acting on impulse without thinking of consequences",
      )
    }

    return examples
  }

  const getWiseMindExamples = () => {
    const examples = []

    if (journeyTypes.includes("gambling")) {
      examples.push('"I feel the urge to gamble, AND I know it won\'t solve my problem"')
    }
    if (journeyTypes.includes("alcohol")) {
      examples.push('"I want a drink, AND I know I\'ll feel worse tomorrow"')
    }
    if (journeyTypes.includes("substances")) {
      examples.push('"I\'m craving relief, AND I can find healthier ways to cope"')
    }
    if (journeyTypes.includes("mental_health")) {
      examples.push('"This anxiety is uncomfortable, AND I can sit with it safely"')
    }
    if (journeyTypes.includes("personal_growth")) {
      examples.push('"This is challenging, AND challenges help me grow"')
    }
    if (journeyTypes.includes("gaming")) {
      examples.push('"I want to play more, AND I need to maintain balance in my life"')
    }

    // Add general examples
    if (examples.length === 0) {
      examples.push('"This is difficult AND I can handle it with the right support"')
    }
    if (examples.length < 3) {
      examples.push(
        '"This is difficult AND I can handle it with the right support"',
        "Taking action that honors both your feelings and your values",
      )
    }

    return examples
  }

  const getRecoveryTip = () => {
    if (journeyTypes.includes("gambling")) {
      return 'When you notice you\'re in emotional mind (urge to gamble feels overwhelming), pause and ask: "What would wise mind do right now?" This simple question creates space for a better choice.'
    }
    if (journeyTypes.includes("alcohol")) {
      return 'When the urge to drink feels overwhelming, pause and ask: "What would wise mind do right now?" This creates space between the urge and your response.'
    }
    if (journeyTypes.includes("substances")) {
      return 'When cravings feel intense, pause and ask: "What would wise mind do right now?" This brief pause can change everything.'
    }
    if (journeyTypes.includes("mental_health")) {
      return 'When difficult emotions arise, pause and ask: "What would wise mind do right now?" This helps you respond skillfully instead of reactively.'
    }
    if (journeyTypes.includes("personal_growth")) {
      return 'When facing challenges, pause and ask: "What would wise mind do right now?" This helps you make choices aligned with your growth.'
    }
    if (journeyTypes.includes("gaming")) {
      return 'When the pull to keep playing is strong, pause and ask: "What would wise mind do right now?" This helps you maintain healthy boundaries.'
    }

    return 'When you notice you\'re in emotional mind (urges feel overwhelming), pause and ask: "What would wise mind do right now?" This simple question creates space for a better choice.'
  }

  const emotionalExamples = getEmotionalMindExamples()
  const wiseMindExamples = getWiseMindExamples()
  const recoveryTip = getRecoveryTip()

  return (
    <Card className="soft-shadow-lg border-border/50">
      <CardHeader>
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
          <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
        </div>
        <CardTitle className="text-2xl text-foreground">Understanding Your Mind States</CardTitle>
        <p className="text-muted-foreground text-pretty">
          Learning to recognize different mind states helps you make wiser choices
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="bg-secondary/50 rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Three States of Mind</h3>
          <p className="text-sm text-foreground/90 text-pretty">
            We operate in three different mind states. Understanding these helps you recognize which state you're in and
            make more balanced decisions.
          </p>
        </div>

        {/* Emotional Mind */}
        <div className="border-2 border-destructive/30 rounded-xl p-5 bg-destructive/5 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h4 className="text-lg font-bold text-destructive">Emotional Mind</h4>
          </div>
          <p className="text-sm text-foreground/90">
            <span className="font-semibold">Driven by feelings.</span> When you're in emotional mind, your emotions are
            in control. Decisions feel urgent and impulsive. This is often when urges feel strongest.
          </p>
          <div className="bg-card/50 rounded-lg p-3 space-y-2">
            <p className="text-xs font-semibold text-foreground">Examples:</p>
            <ul className="text-xs text-muted-foreground space-y-1 pl-4">
              {emotionalExamples.slice(0, 3).map((example, i) => (
                <li key={i}>{example}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Reasonable Mind */}
        <div className="border-2 border-info/30 rounded-xl p-5 bg-info/5 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-info/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h4 className="text-lg font-bold text-info">Reasonable Mind</h4>
          </div>
          <p className="text-sm text-foreground/90">
            <span className="font-semibold">Driven by logic and facts.</span> When you're in reasonable mind, you're
            thinking rationally and planning. You might ignore or dismiss your emotions entirely.
          </p>
          <div className="bg-card/50 rounded-lg p-3 space-y-2">
            <p className="text-xs font-semibold text-foreground">Examples:</p>
            <ul className="text-xs text-muted-foreground space-y-1 pl-4">
              <li>"Logically, this behavior isn't helping me reach my goals"</li>
              <li>"I should just ignore these feelings and push through"</li>
              <li>Making plans without considering how you actually feel</li>
            </ul>
          </div>
        </div>

        {/* Wise Mind */}
        <div className="border-2 border-success/30 rounded-xl p-5 bg-success/5 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h4 className="text-lg font-bold text-success">Wise Mind</h4>
          </div>
          <p className="text-sm text-foreground/90">
            <span className="font-semibold">The integration of emotion and reason.</span> Wise mind is where your
            emotions and logic work together. You acknowledge your feelings AND consider the facts. This is where the
            best decisions happen.
          </p>
          <div className="bg-card/50 rounded-lg p-3 space-y-2">
            <p className="text-xs font-semibold text-foreground">Examples:</p>
            <ul className="text-xs text-muted-foreground space-y-1 pl-4">
              {wiseMindExamples.slice(0, 3).map((example, i) => (
                <li key={i}>{example}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* The Connection */}
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-5 space-y-3">
          <h4 className="font-semibold text-foreground flex items-center gap-2">
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            How They Connect
          </h4>
          <p className="text-sm text-foreground">
            You'll move between these states throughout the day. The goal isn't to always be in wise mind—that's
            impossible. The goal is to <span className="font-semibold">recognize which state you're in</span> and gently
            guide yourself toward wise mind when making important decisions.
          </p>
          <div className="bg-card/50 rounded-lg p-4 mt-3">
            <p className="text-xs font-semibold text-foreground mb-2">Recovery Tip:</p>
            <p className="text-xs text-muted-foreground">{recoveryTip}</p>
          </div>
        </div>

        <div className="bg-muted/50 border border-border/50 rounded-lg p-4">
          <p className="text-xs text-muted-foreground text-pretty">
            <span className="font-semibold text-foreground">Coming up in Waypoint Modules:</span> We'll explore mind
            states in greater depth through interactive exercises and real-world practice scenarios after you complete
            onboarding.
          </p>
        </div>

        <div className="flex gap-3 pt-4">
          <StepButtonFooter onBack={onBack} onNext={onNext} />
        </div>
      </CardContent>
    </Card>
  )
}
