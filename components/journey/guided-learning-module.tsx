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
  PauseCircle,
  ShieldAlert,
  Sparkles,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { ModuleCompletionDialog } from "@/components/journey/module-completion-dialog"
import JourneyConceptVisual from "@/components/journey/journey-concept-visual"
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

export default function GuidedLearningModule({ module, moduleNumber, coreValues = [] }: GuidedLearningModuleProps) {
  const [activeStep, setActiveStep] = useState(0)
  const [hasRestoredStep, setHasRestoredStep] = useState(false)
  const [selectedCheck, setSelectedCheck] = useState("")
  const [practice, setPractice] = useState<Record<string, string>>({})
  const [reflectedPrivately, setReflectedPrivately] = useState(false)
  const [showCompletion, setShowCompletion] = useState(false)
  const [isCompleting, setIsCompleting] = useState(false)
  const [attemptedCompletion, setAttemptedCompletion] = useState(false)

  const checkStep = 1 + module.sections.length
  const practiceStartStep = checkStep + 1
  const finishStep = practiceStartStep + module.practicePrompts.length
  const totalSteps = finishStep + 1
  const storageKey = `waypoint-journey-place:${module.slug}`

  useEffect(() => {
    try {
      const saved = Number(window.localStorage.getItem(storageKey))
      if (Number.isInteger(saved) && saved > 0) {
        // Learning progress is safe to remember. Knowledge-check choices and
        // free-text reflections are deliberately not persisted.
        setActiveStep(Math.min(saved, checkStep))
      }
    } catch {
      // Local storage is optional. The module still works without it.
    } finally {
      setHasRestoredStep(true)
    }
  }, [checkStep, storageKey])

  useEffect(() => {
    if (!hasRestoredStep) return
    try {
      window.localStorage.setItem(storageKey, String(Math.min(activeStep, checkStep)))
    } catch {
      // Ignore storage failures.
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

  const practiceComplete = reflectedPrivately || module.practicePrompts.every((prompt) => (practice[prompt.id] || "").trim().length > 0)
  const canComplete = Boolean(selectedOption) && practiceComplete
  const learningSectionIndex = activeStep >= 1 && activeStep < checkStep ? activeStep - 1 : -1
  const practicePromptIndex = activeStep >= practiceStartStep && activeStep < finishStep ? activeStep - practiceStartStep : -1
  const currentPracticePrompt = practicePromptIndex >= 0 ? module.practicePrompts[practicePromptIndex] : undefined
  const currentPracticeAnswered = currentPracticePrompt ? (practice[currentPracticePrompt.id] || "").trim().length > 0 : false
  const progressPercent = Math.round(((activeStep + 1) / totalSteps) * 100)

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
        // Storage is optional.
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
      <Button variant="outline" onClick={moveBack} disabled={activeStep === 0} className="sm:w-auto">
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
        <div>
          <Link href="/journey">
            <Button variant="ghost" size="sm" className="mb-3 -ml-2">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Pause and return to Journey
            </Button>
          </Link>

          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Badge variant="secondary">{KIND_LABELS[module.kind]}</Badge>
            <Badge variant="outline">{module.category}</Badge>
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Clock3 className="h-3.5 w-3.5" /> about {module.estimatedMinutes} min
            </span>
          </div>

          <p className="text-xs font-medium uppercase tracking-wider text-primary mb-2">Journey step {moduleNumber}</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight text-pretty">{module.title}</h1>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed text-pretty">{module.description}</p>

          <div className="mt-5 space-y-2">
            <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
              <span>Part {activeStep + 1} of {totalSteps}</span>
              <span>{progressPercent}% through this module</span>
            </div>
            <div className="h-2 rounded-full bg-secondary overflow-hidden">
              <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
        </div>

        {activeStep === 0 && (
          <div className="space-y-4">
            <Card className="border-primary/25 bg-primary/5">
              <CardContent className="p-5 space-y-4">
                <div className="flex gap-3">
                  <Lightbulb className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-sm mb-1">Why this might be useful</p>
                    <p className="text-sm text-foreground/85 leading-relaxed">{module.whyItMatters}</p>
                  </div>
                </div>
                <div className="rounded-lg bg-background/70 border border-border/60 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-1">Go at the pace the idea needs</p>
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    Some Journey modules are short and some need more room. You will move through the teaching in small pieces, then a learning check and reflection. There is no prize for rushing, and you can pause whenever you have had enough for now.
                  </p>
                </div>
              </CardContent>
            </Card>

            {coreValues.length > 0 && (module.slug === "discovering-values" || module.slug === "values-to-action") && (
              <Card className="border-pink-500/25 bg-pink-500/5">
                <CardContent className="p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-pink-500 mb-1">From your onboarding</p>
                  <p className="text-sm text-foreground/85">Values you narrowed down: <span className="font-semibold text-foreground">{coreValues.join(", ")}</span></p>
                  <p className="text-xs text-muted-foreground mt-1">Use them if they still feel right. They are a starting point, not permanent labels.</p>
                </CardContent>
              </Card>
            )}

            {module.safetyNote && (
              <div className="rounded-xl border border-orange-500/30 bg-orange-500/5 p-4 flex gap-3">
                <ShieldAlert className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-sm mb-1">Before you begin</p>
                  <p className="text-sm text-foreground/80 leading-relaxed">{module.safetyNote}</p>
                </div>
              </div>
            )}

            <Button onClick={moveNext} size="lg" className="w-full">
              Start with the first idea <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}

        {learningSectionIndex >= 0 && (() => {
          const section = module.sections[learningSectionIndex]

          return (
            <Card>
              <CardHeader className="pb-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">Learn · idea {learningSectionIndex + 1} of {module.sections.length}</p>
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

                <JourneyConceptVisual moduleSlug={module.slug} sectionIndex={learningSectionIndex} />

                {section.bullets && section.bullets.length > 0 && (
                  <div className="rounded-lg bg-secondary/30 border border-border/60 p-4">
                    <ul className="space-y-2 text-sm text-foreground/80">
                      {section.bullets.map((bullet) => (
                        <li key={bullet} className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
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
                See if the idea landed
              </CardTitle>
              <p className="text-sm text-muted-foreground leading-relaxed">
                This is not a pass-or-fail test. Pick the answer that makes the most sense to you. Waypoint will only show the explanation after you make a choice, and if your choice is not the best fit it will also show the answer we most want you to take away.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="font-medium text-sm sm:text-base">{module.check.prompt}</p>
              <RadioGroup value={selectedCheck} onValueChange={setSelectedCheck} className="space-y-3">
                {module.check.options.map((option, index) => (
                  <div key={`${module.slug}-check-${index}`} className="flex items-start gap-3 rounded-lg border border-border p-3">
                    <RadioGroupItem value={String(index)} id={`check-${index}`} className="mt-0.5" />
                    <Label htmlFor={`check-${index}`} className="font-normal leading-relaxed cursor-pointer flex-1">{option.label}</Label>
                  </div>
                ))}
              </RadioGroup>

              {selectedOption && (
                <div className={`rounded-lg p-4 text-sm ${selectedOption.correct ? "bg-emerald-500/10 border border-emerald-500/25" : "bg-amber-500/10 border border-amber-500/25"}`}>
                  <p className="font-semibold mb-1">{selectedOption.correct ? "Yep — that is the idea." : "Not quite — here is what is different."}</p>
                  <p className="text-foreground/80 leading-relaxed">{selectedOption.feedback}</p>
                </div>
              )}

              {selectedOption && idealOption && !selectedOption.correct && (
                <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/8 p-4 text-sm space-y-2">
                  <p className="font-semibold text-emerald-700 dark:text-emerald-300">The answer to take with you</p>
                  <p className="font-medium text-foreground">{idealOption.label}</p>
                  <p className="text-foreground/80 leading-relaxed">{idealOption.feedback}</p>
                </div>
              )}

              {navigation(Boolean(selectedOption), "Continue to practice")}
            </CardContent>
          </Card>
        )}

        {practicePromptIndex >= 0 && currentPracticePrompt && (
          <Card>
            <CardHeader className="pb-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">Try it · reflection {practicePromptIndex + 1} of {module.practicePrompts.length}</p>
              <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
                <Sparkles className="h-5 w-5 text-primary" />
                {practicePromptIndex === 0 ? module.practiceTitle : "Keep going with the same example"}
              </CardTitle>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {practicePromptIndex === 0 ? module.practiceIntro : "You are not writing an assignment. A sentence or two is enough to connect the idea to real life."}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {module.safetyNote && practicePromptIndex === 0 && (
                <div className="rounded-lg border border-orange-500/30 bg-orange-500/5 p-3 flex gap-2.5">
                  <ShieldAlert className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                  <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed">{module.safetyNote}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor={`practice-${currentPracticePrompt.id}`} className="text-base leading-relaxed">{currentPracticePrompt.label}</Label>
                <Textarea
                  id={`practice-${currentPracticePrompt.id}`}
                  value={practice[currentPracticePrompt.id] || ""}
                  onChange={(event) => setPractice((current) => ({ ...current, [currentPracticePrompt.id]: event.target.value }))}
                  placeholder={currentPracticePrompt.placeholder}
                  rows={4}
                  disabled={reflectedPrivately}
                />
                <p className="text-xs text-muted-foreground">Your writing stays on this page and is not sent when the module is recorded.</p>
              </div>

              <div className="rounded-lg border border-border bg-muted/20 p-4">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="private-reflection"
                    checked={reflectedPrivately}
                    onCheckedChange={(checked) => setReflectedPrivately(checked === true)}
                    className="mt-0.5"
                  />
                  <Label htmlFor="private-reflection" className="font-normal leading-relaxed cursor-pointer">
                    I would rather think this through privately and not type the details into Waypoint.
                  </Label>
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
                <Button variant="outline" onClick={moveBack}>
                  <ChevronLeft className="mr-1.5 h-4 w-4" /> Back
                </Button>
                <Button
                  onClick={() => setActiveStep(reflectedPrivately ? finishStep : Math.min(finishStep, activeStep + 1))}
                  disabled={!reflectedPrivately && !currentPracticeAnswered}
                  className="flex-1"
                >
                  {practicePromptIndex === module.practicePrompts.length - 1 || reflectedPrivately ? "Finish reflection" : "Next reflection"}
                  <ChevronRight className="ml-1.5 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {activeStep === finishStep && (
          <div className="space-y-4">
            <Card className="border-emerald-500/25 bg-emerald-500/5">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">What to take with you</p>
                    <p className="text-base text-foreground/90 leading-relaxed">{module.keyLearning}</p>
                  </div>
                </div>
                <div className="rounded-lg bg-background/70 border border-border/60 p-4 flex gap-3">
                  <PauseCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    You do not need to jump straight into another module. Sometimes the useful part is noticing this idea once in ordinary life before you learn another one.
                  </p>
                </div>
              </CardContent>
            </Card>

            {attemptedCompletion && !canComplete && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm">
                {!selectedOption && <p>Choose an answer in the quick check before recording the module.</p>}
                {!practiceComplete && <p>Complete the reflection, or choose the private-reflection option.</p>}
              </div>
            )}

            <div className="flex flex-col-reverse sm:flex-row gap-3">
              <Button variant="outline" onClick={moveBack}>
                <ChevronLeft className="mr-1.5 h-4 w-4" /> Back
              </Button>
              <Button onClick={handleComplete} disabled={isCompleting} size="lg" className="flex-1">
                {isCompleting ? "Recording activity..." : "Record this module"}
              </Button>
            </div>
          </div>
        )}

        <div className="rounded-lg border border-border/60 bg-muted/15 p-3 flex items-start gap-2.5">
          <PauseCircle className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            Stop whenever you have had enough for now. Waypoint remembers your place through the learning section on this device, but it does not save your knowledge-check choice or practice writing.
          </p>
        </div>

        <p className="text-xs text-center text-muted-foreground px-4">
          Self-guided support and skills practice, not a clinical assessment or a test of recovery.
        </p>
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
