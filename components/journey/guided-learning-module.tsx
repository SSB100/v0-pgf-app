"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ArrowLeft, BookOpen, CheckCircle2, Clock3, Lightbulb, ShieldAlert, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { ModuleCompletionDialog } from "@/components/journey/module-completion-dialog"
import type { JourneyModuleDefinition } from "@/lib/journey-curriculum"

interface GuidedLearningModuleProps {
  module: JourneyModuleDefinition
  moduleNumber: number
  totalModules: number
  coreValues?: string[]
}

const KIND_LABELS: Record<JourneyModuleDefinition["kind"], string> = {
  foundation: "Foundation",
  learning: "Learning module",
  skill: "Practice skill",
  integration: "Put it together",
}

export default function GuidedLearningModule({ module, moduleNumber, totalModules, coreValues = [] }: GuidedLearningModuleProps) {
  const [selectedCheck, setSelectedCheck] = useState("")
  const [practice, setPractice] = useState<Record<string, string>>({})
  const [reflectedPrivately, setReflectedPrivately] = useState(false)
  const [showCompletion, setShowCompletion] = useState(false)
  const [isCompleting, setIsCompleting] = useState(false)
  const [attemptedCompletion, setAttemptedCompletion] = useState(false)

  const selectedOption = useMemo(() => {
    const index = Number(selectedCheck)
    return Number.isInteger(index) && index >= 0 ? module.check.options[index] : undefined
  }, [module.check.options, selectedCheck])

  const checkIsCorrect = Boolean(selectedOption?.correct)
  const practiceComplete = reflectedPrivately || module.practicePrompts.every((prompt) => (practice[prompt.id] || "").trim().length > 0)
  const canComplete = checkIsCorrect && practiceComplete

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
      setShowCompletion(true)
    } catch (error) {
      console.error("Error recording guided module activity:", error)
      alert("Unable to record this module right now. Please try again.")
    } finally {
      setIsCompleting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <main className="container mx-auto max-w-3xl px-4 py-5 sm:py-8 space-y-6">
        <div>
          <Link href="/journey">
            <Button variant="ghost" size="sm" className="mb-3 -ml-2">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Journey
            </Button>
          </Link>

          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Badge variant="secondary">{KIND_LABELS[module.kind]}</Badge>
            <Badge variant="outline">{module.category}</Badge>
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Clock3 className="h-3.5 w-3.5" /> about {module.estimatedMinutes} min
            </span>
          </div>

          <p className="text-xs font-medium uppercase tracking-wider text-primary mb-2">Module {moduleNumber} of {totalModules}</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight text-pretty">{module.title}</h1>
          <p className="mt-3 text-muted-foreground leading-relaxed text-pretty">{module.description}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {module.approaches.map((approach) => <Badge key={approach} variant="outline" className="font-normal">{approach}</Badge>)}
          </div>
        </div>

        <Card className="border-primary/25 bg-primary/5">
          <CardContent className="p-5 flex gap-3">
            <Lightbulb className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-sm mb-1">Why this matters</p>
              <p className="text-sm text-foreground/85 leading-relaxed">{module.whyItMatters}</p>
            </div>
          </CardContent>
        </Card>

        {coreValues.length > 0 && (module.slug === "discovering-values" || module.slug === "values-to-action") && (
          <Card className="border-pink-500/25 bg-pink-500/5">
            <CardContent className="p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-pink-500 mb-2">From your onboarding</p>
              <p className="text-sm text-foreground/85">Core values you narrowed down: <span className="font-semibold text-foreground">{coreValues.join(", ")}</span></p>
              <p className="text-xs text-muted-foreground mt-2">These are a starting point, not permanent labels. You can notice if your priorities change over time.</p>
            </CardContent>
          </Card>
        )}

        <section className="space-y-4">
          {module.sections.map((section, index) => (
            <Card key={`${module.slug}-${index}`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-start gap-2">
                  <span className="w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{index + 1}</span>
                  <span>{section.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm sm:text-base text-foreground/85 leading-relaxed">{section.body}</p>
                {section.bullets && section.bullets.length > 0 && (
                  <ul className="space-y-2 text-sm text-foreground/80">
                    {section.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          ))}
        </section>

        {module.safetyNote && (
          <div className="rounded-xl border border-orange-500/30 bg-orange-500/5 p-4 flex gap-3">
            <ShieldAlert className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-sm mb-1">Safety note</p>
              <p className="text-sm text-foreground/80 leading-relaxed">{module.safetyNote}</p>
            </div>
          </div>
        )}

        <Card className="border-2 border-primary/25">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <BookOpen className="h-5 w-5 text-primary" />
              Quick understanding check
            </CardTitle>
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
              <div className={`rounded-lg p-3 text-sm ${selectedOption.correct ? "bg-emerald-500/10 border border-emerald-500/25" : "bg-amber-500/10 border border-amber-500/25"}`}>
                <p className="font-semibold mb-1">{selectedOption.correct ? "That’s the key idea." : "Have another look."}</p>
                <p className="text-foreground/80">{selectedOption.feedback}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Sparkles className="h-5 w-5 text-primary" />
              {module.practiceTitle}
            </CardTitle>
            <p className="text-sm text-muted-foreground leading-relaxed">{module.practiceIntro}</p>
          </CardHeader>
          <CardContent className="space-y-5">
            {module.practicePrompts.map((prompt) => (
              <div key={prompt.id} className="space-y-2">
                <Label htmlFor={`practice-${prompt.id}`} className="leading-relaxed">{prompt.label}</Label>
                <Textarea
                  id={`practice-${prompt.id}`}
                  value={practice[prompt.id] || ""}
                  onChange={(event) => setPractice((current) => ({ ...current, [prompt.id]: event.target.value }))}
                  placeholder={prompt.placeholder}
                  rows={3}
                  disabled={reflectedPrivately}
                />
              </div>
            ))}

            <div className="rounded-lg border border-border bg-muted/20 p-4 space-y-3">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="private-reflection"
                  checked={reflectedPrivately}
                  onCheckedChange={(checked) => setReflectedPrivately(checked === true)}
                  className="mt-0.5"
                />
                <Label htmlFor="private-reflection" className="font-normal leading-relaxed cursor-pointer">
                  I would rather complete this reflection privately without typing the details into Waypoint.
                </Label>
              </div>
              <p className="text-xs text-muted-foreground">
                These practice answers stay on this page in your browser and are not sent when you record the module. Waypoint only records that you explored the module.
              </p>
            </div>
          </CardContent>
        </Card>

        {attemptedCompletion && !canComplete && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm">
            {!checkIsCorrect && <p>Choose the answer that matches the module’s key idea before recording the activity.</p>}
            {!practiceComplete && <p>Complete the short practice, or select the private-reflection option.</p>}
          </div>
        )}

        <Button onClick={handleComplete} disabled={isCompleting} size="lg" className="w-full">
          {isCompleting ? "Recording activity..." : "Record Module Activity"}
        </Button>

        <p className="text-xs text-center text-muted-foreground px-4">
          This is self-guided learning and practice, not a clinical assessment or a test of recovery. You can return to any module as often as you like.
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
