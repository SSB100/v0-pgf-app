"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Lightbulb,
  Sparkles,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ModuleCompletionDialog } from "@/components/journey/module-completion-dialog"
import JourneyConceptVisual from "@/components/journey/journey-concept-visual"
import JourneyExercise from "@/components/journey/journey-exercise"
import { getJourneyExercise } from "@/lib/journey-exercises"
import type { JourneyModuleDefinition } from "@/lib/journey-curriculum"

interface GuidedLearningModuleProps {
  module: JourneyModuleDefinition
  moduleNumber: number
  totalModules: number
  coreValues?: string[]
}

const KIND_LABELS: Record<JourneyModuleDefinition["kind"], string> = {
  foundation: "Foundation",
  learning: "Learning",
  skill: "Practice skill",
  integration: "Put it together",
}

export default function GuidedLearningModuleV2({ module, moduleNumber, coreValues = [] }: GuidedLearningModuleProps) {
  const [activeStep, setActiveStep] = useState(0)
  const [hasRestoredStep, setHasRestoredStep] = useState(false)
  const [selectedCheck, setSelectedCheck] = useState("")
  const [exerciseReady, setExerciseReady] = useState(false)
  const [showCompletion, setShowCompletion] = useState(false)
  const [isCompleting, setIsCompleting] = useState(false)
  const [attemptedCompletion, setAttemptedCompletion] = useState(false)

  const exercise = useMemo(() => getJourneyExercise(module.slug), [module.slug])
  const checkStep = 1 + module.sections.length
  const exerciseStep = checkStep + 1
  const finishStep = exerciseStep + 1
  const storageKey = `waypoint-journey-place:${module.slug}`

  useEffect(() => {
    try {
      const saved = Number(window.localStorage.getItem(storageKey))
      if (Number.isInteger(saved) && saved > 0) {
        // Only the learning position is remembered. Check answers and exercise
        // responses stay in the current browser session and are not sent when
        // module completion is recorded.
        setActiveStep(Math.min(saved, checkStep))
      }
    } catch {
      // Local storage is optional.
    } finally {
      setHasRestoredStep(true)
    }
  }, [checkStep, storageKey])

  useEffect(() => {
    if (!hasRestoredStep || activeStep === 0) return
    try {
      window.localStorage.setItem(storageKey, String(Math.min(activeStep, checkStep)))
    } catch {
      // Local storage is optional.
    }
  }, [activeStep, checkStep, hasRestoredStep, storageKey])

  const selectedOption = useMemo(() => {
    if (selectedCheck === "") return undefined
    const index = Number(selectedCheck)
    return Number.isInteger(index) && index >= 0 ? module.check.options[index] : undefined
  }, [module.check.options, selectedCheck])

  const idealOption = useMemo(
    () => module.check.options.find((option) => option.correct),
    [module.check.options],
  )

  const canComplete = Boolean(selectedOption) && exerciseReady
  const learningSectionIndex = activeStep >= 1 && activeStep < checkStep ? activeStep - 1 : -1
  const progressPercent = activeStep === 0 ? 0 : Math.round((activeStep / finishStep) * 100)

  const moveNext = () => setActiveStep((current) => Math.min(finishStep, current + 1))
  const moveBack = () => setActiveStep((current) => Math.max(0, current - 1))

  const handleComplete = async () => {
    setAttemptedCompletion(true)
    if (!canComplete) return

    setIsCompleting(true)
    try {
      const response = await fetch("/api/journey/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moduleSlug: module.slug }),
      })

      if (!response.ok) throw new Error("Failed to record module activity")
      try {
        window.localStorage.removeItem(storageKey)
      } catch {
        // Local storage is optional.
      }
      setShowCompletion(true)
    } catch (error) {
      console.error("Error recording guided module activity:", error)
      alert("Unable to record this module right now. Please try again.")
    } finally {
      setIsCompleting(false)
    }
  }

  const navigation = (canContinue = true, continueLabel = "Continue") => (
    <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
      <Button variant="outline" onClick={moveBack} className="sm:w-auto">
        <ChevronLeft className="mr-1.5 h-4 w-4" /> Back
      </Button>
      <Button onClick={moveNext} disabled={!canContinue} className="flex-1">
        {continueLabel} <ChevronRight className="ml-1.5 h-4 w-4" />
      </Button>
    </div>
  )

  return (
    <div className="min-h-screen bg-background pb-20">
      <main className="container mx-auto max-w-2xl px-4 py-5 sm:py-8 space-y-5">
        <Link href="/journey">
          <Button variant="ghost" size="sm" className="-ml-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Journey
          </Button>
        </Link>

        {activeStep === 0 ? (
          <div className="space-y-5">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">{KIND_LABELS[module.kind]}</Badge>
                <Badge variant="outline">{module.category}</Badge>
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock3 className="h-3.5 w-3.5" /> about {module.estimatedMinutes} min
                </span>
              </div>
              <p className="text-xs font-medium uppercase tracking-wider text-primary">Journey step {moduleNumber}</p>
              <h1 className="text-3xl sm:text-4xl font-bold leading-tight text-pretty">{module.title}</h1>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed text-pretty">{module.description}</p>
            </div>

            <Card className="overflow-hidden border-primary/20 bg-primary/5">
              <CardContent className="p-5 sm:p-6 space-y-5">
                <div className="flex gap-3">
                  <Lightbulb className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold mb-1">Why this one matters</p>
                    <p className="text-sm sm:text-base leading-relaxed text-foreground/85">{module.whyItMatters}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-3">What you will learn</p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {module.sections.slice(0, 4).map((section, index) => (
                      <div key={`${module.slug}-cover-${index}`} className="rounded-lg border border-border/60 bg-background/75 px-3 py-2.5 text-sm font-medium leading-snug">
                        {section.title}
                      </div>
                    ))}
                  </div>
                  {module.sections.length > 4 && (
                    <p className="mt-2 text-xs text-muted-foreground">Plus {module.sections.length - 4} more short idea{module.sections.length - 4 === 1 ? "" : "s"}.</p>
                  )}
                </div>

                <div className="rounded-xl border border-border/60 bg-background/75 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-1.5">How you will learn it</p>
                  <p className="text-sm leading-relaxed text-foreground/80">
                    We will use short explanations, everyday examples and visual ideas where they help. Then you will do one quick learning check and a hands-on exercise built for this topic.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Button onClick={() => setActiveStep(1)} size="lg" className="w-full">
              Start module <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{module.title}</span>
                <span>Part {activeStep} of {finishStep}</span>
              </div>
              <div className="h-2 rounded-full bg-secondary overflow-hidden">
                <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>

            {learningSectionIndex >= 0 && (() => {
              const section = module.sections[learningSectionIndex]
              const showCoreValues = learningSectionIndex === 0 && coreValues.length > 0 && (module.slug === "discovering-values" || module.slug === "values-to-action")

              return (
                <Card>
                  <CardHeader className="pb-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-primary">Idea {learningSectionIndex + 1} of {module.sections.length}</p>
                    <CardTitle className="text-xl sm:text-2xl leading-tight">{section.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      {section.body.split("\n\n").map((paragraph, index) => (
                        <p key={`${module.slug}-section-${learningSectionIndex}-paragraph-${index}`} className="text-base text-foreground/88 leading-7">
                          {paragraph}
                        </p>
                      ))}
                    </div>

                    {showCoreValues && (
                      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                        <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-1">From your Life Garden</p>
                        <p className="text-sm leading-relaxed">
                          You narrowed your core values to <span className="font-semibold">{coreValues.join(", ")}</span>. You can use one of these in the exercise, or choose another value that fits better now.
                        </p>
                      </div>
                    )}

                    <JourneyConceptVisual moduleSlug={module.slug} sectionIndex={learningSectionIndex} />

                    {section.bullets && section.bullets.length > 0 && (
                      <div className="rounded-xl bg-secondary/30 border border-border/60 p-4">
                        <ul className="space-y-2 text-sm text-foreground/80">
                          {section.bullets.map((bullet) => (
                            <li key={bullet} className="flex items-start gap-2">
                              <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {navigation()}
                  </CardContent>
                </Card>
              )
            })()}

            {activeStep === checkStep && (
              <Card className="border-primary/25">
                <CardHeader className="pb-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary">Quick check</p>
                  <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
                    <BookOpen className="h-5 w-5 text-primary" />
                    See if the main idea landed
                  </CardTitle>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Pick the answer that makes the most sense. The explanation appears after you choose.
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="font-medium text-sm sm:text-base">{module.check.prompt}</p>
                  <RadioGroup value={selectedCheck} onValueChange={setSelectedCheck} className="space-y-3">
                    {module.check.options.map((option, index) => (
                      <div key={`${module.slug}-check-${index}`} className="flex items-start gap-3 rounded-xl border border-border p-3">
                        <RadioGroupItem value={String(index)} id={`check-${index}`} className="mt-0.5" />
                        <Label htmlFor={`check-${index}`} className="font-normal leading-relaxed cursor-pointer flex-1">{option.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>

                  {selectedOption && (
                    <div className={`rounded-xl p-4 text-sm ${selectedOption.correct ? "bg-emerald-500/10 border border-emerald-500/25" : "bg-amber-500/10 border border-amber-500/25"}`}>
                      <p className="font-semibold mb-1">{selectedOption.correct ? "Yes — that is the idea." : "Not quite — here is the difference."}</p>
                      <p className="text-foreground/80 leading-relaxed">{selectedOption.feedback}</p>
                    </div>
                  )}

                  {selectedOption && idealOption && !selectedOption.correct && (
                    <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/8 p-4 text-sm space-y-2">
                      <p className="font-semibold text-emerald-700 dark:text-emerald-300">The answer to remember</p>
                      <p className="font-medium text-foreground">{idealOption.label}</p>
                      <p className="text-foreground/80 leading-relaxed">{idealOption.feedback}</p>
                    </div>
                  )}

                  {navigation(Boolean(selectedOption), "Try the exercise")}
                </CardContent>
              </Card>
            )}

            <div className={activeStep === exerciseStep ? "block" : "hidden"} aria-hidden={activeStep !== exerciseStep}>
              <Card>
                <CardHeader className="pb-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary">Try it</p>
                  <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Put the idea to work
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <JourneyExercise exercise={exercise} coreValues={coreValues} onReadyChange={setExerciseReady} />
                  {navigation(exerciseReady, "Finish module")}
                </CardContent>
              </Card>
            </div>

            {activeStep === finishStep && (
              <div className="space-y-4">
                <Card className="border-emerald-500/25 bg-emerald-500/5">
                  <CardContent className="p-5 space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-6 w-6 text-emerald-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">What to take with you</p>
                        <p className="text-base text-foreground/90 leading-relaxed">{module.keyLearning}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {attemptedCompletion && !canComplete && (
                  <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm space-y-1">
                    {!selectedOption && <p>Choose an answer in the quick check first.</p>}
                    {!exerciseReady && <p>Finish the module exercise first.</p>}
                  </div>
                )}

                <div className="flex flex-col-reverse sm:flex-row gap-3">
                  <Button variant="outline" onClick={moveBack}>
                    <ChevronLeft className="mr-1.5 h-4 w-4" /> Back
                  </Button>
                  <Button onClick={handleComplete} disabled={isCompleting} size="lg" className="flex-1">
                    {isCompleting ? "Recording..." : "Complete module"}
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <ModuleCompletionDialog
        open={showCompletion}
        onOpenChange={setShowCompletion}
        moduleTitle={module.title}
        keyLearning={module.keyLearning}
        creditsAwarded={1}
      />
    </div>
  )
}
