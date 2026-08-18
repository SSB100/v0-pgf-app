"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Lightbulb } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { ModuleCompletionDialog } from "@/components/journey/module-completion-dialog"

export default function UnderstandingYourMindPage() {
  const [scenario1, setScenario1] = useState("")
  const [scenario2, setScenario2] = useState("")
  const [scenario3, setScenario3] = useState("")
  const [reflection, setReflection] = useState("")
  const [currentMindState, setCurrentMindState] = useState("")
  const [mindStateReflection, setMindStateReflection] = useState("")
  const [showCompletion, setShowCompletion] = useState(false)
  const [isCompleting, setIsCompleting] = useState(false)
  const [errors, setErrors] = useState<Record<string, boolean>>({})

  const handleComplete = async () => {
    const newErrors: Record<string, boolean> = {}
    if (!scenario1) newErrors.scenario1 = true
    if (!scenario2) newErrors.scenario2 = true
    if (!scenario3) newErrors.scenario3 = true
    if (!reflection.trim()) newErrors.reflection = true
    if (!currentMindState) newErrors.currentMindState = true
    if (!mindStateReflection.trim()) newErrors.mindStateReflection = true

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsCompleting(true)
    try {
      const response = await fetch("/api/journey/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moduleSlug: "understanding-your-mind", moduleTitle: "Understanding Your Mind" }),
      })
      if (!response.ok) throw new Error("Failed to record module activity")
      setShowCompletion(true)
    } catch (error) {
      console.error("[v0] Error completing module:", error)
      alert("Unable to record this module right now. Please try again.")
    } finally {
      setIsCompleting(false)
    }
  }

  const scenario = (
    id: string,
    prompt: string,
    value: string,
    setValue: (value: string) => void,
    expected: string,
  ) => (
    <div className="space-y-3">
      <p className="text-sm font-medium">{prompt}</p>
      <RadioGroup value={value} onValueChange={(next) => { setValue(next); setErrors((current) => ({ ...current, [id]: false })) }}>
        {["emotional", "reasonable", "wise"].map((option) => (
          <div key={option} className="flex items-center space-x-2">
            <RadioGroupItem value={option} id={`${id}-${option}`} />
            <Label htmlFor={`${id}-${option}`}>{option === "emotional" ? "Emotional Mind" : option === "reasonable" ? "Reasonable Mind" : "Wise Mind"}</Label>
          </div>
        ))}
      </RadioGroup>
      {errors[id] && <p className="text-sm text-red-600">Choose an option to continue.</p>}
      {value && (
        <p className={`text-xs rounded p-2 ${value === expected ? "bg-green-500/10 text-green-800 dark:text-green-200" : "bg-muted text-muted-foreground"}`}>
          {value === expected ? "That matches the way this example is being used in the DBT model." : `For this exercise, the intended example is ${expected === "emotional" ? "Emotional Mind" : expected === "reasonable" ? "Reasonable Mind" : "Wise Mind"}. Real situations can be more mixed than short examples like these.`}
        </p>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-3xl mx-auto px-4 space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/journey"><Button variant="ghost" size="icon"><ArrowLeft className="w-5 h-5" /></Button></Link>
          <div><h1 className="text-3xl font-bold">Understanding Your Mind</h1><p className="text-muted-foreground">Journey module</p></div>
        </div>

        <Card>
          <CardHeader><CardTitle>The Three Mind States</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm text-foreground/90">
            <p>
              Emotional Mind, Reasonable Mind and Wise Mind are concepts used in Dialectical Behaviour Therapy (DBT). Waypoint presents them as a reflection model, not as fixed personality types or a test of whether a decision is good or bad.
            </p>
            <p>
              <span className="font-semibold">Emotional Mind</span> describes moments when feelings and urges are especially prominent. <span className="font-semibold">Reasonable Mind</span> describes moments when facts and logic are especially prominent. <span className="font-semibold">Wise Mind</span> describes bringing emotion and reason together when considering a response.
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-primary/30">
          <CardHeader><CardTitle className="flex items-center gap-2"><Lightbulb className="w-5 h-5 text-primary" />Practice identifying the model</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            {scenario("scenario1", "Example 1: “I feel overwhelmed and I need to do something right now so this feeling stops.”", scenario1, setScenario1, "emotional")}
            {scenario("scenario2", "Example 2: “I have listed the facts and made a plan, but I am not really acknowledging how I feel about it.”", scenario2, setScenario2, "reasonable")}
            {scenario("scenario3", "Example 3: “I can notice how strongly I feel about this, consider the facts, and choose a next step that fits what matters to me.”", scenario3, setScenario3, "wise")}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Personal reflection</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="reflection">Think of a recent or hypothetical decision. What was happening?</Label>
              <Textarea id="reflection" value={reflection} onChange={(event) => { setReflection(event.target.value); setErrors((current) => ({ ...current, reflection: false })) }} placeholder="Use a hypothetical example if you prefer..." rows={3} className={errors.reflection ? "border-red-500 border-2" : ""} />
              {errors.reflection && <p className="text-sm text-red-600 mt-1">Add a reflection or hypothetical example to continue.</p>}
            </div>

            <div>
              <Label className="mb-2 block">Which mind-state description feels closest to that example?</Label>
              <RadioGroup value={currentMindState} onValueChange={(value) => { setCurrentMindState(value); setErrors((current) => ({ ...current, currentMindState: false })) }}>
                {["emotional", "reasonable", "wise", "mixed"].map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={`current-${option}`} />
                    <Label htmlFor={`current-${option}`}>{option === "emotional" ? "Mostly Emotional Mind" : option === "reasonable" ? "Mostly Reasonable Mind" : option === "wise" ? "Mostly Wise Mind" : "A mixture / not sure"}</Label>
                  </div>
                ))}
              </RadioGroup>
              {errors.currentMindState && <p className="text-sm text-red-600 mt-1">Choose the closest option to continue.</p>}
            </div>

            <div>
              <Label htmlFor="mindStateReflection">What did you notice by looking at it this way?</Label>
              <Textarea id="mindStateReflection" value={mindStateReflection} onChange={(event) => { setMindStateReflection(event.target.value); setErrors((current) => ({ ...current, mindStateReflection: false })) }} placeholder="There is no required insight or conclusion..." rows={3} className={errors.mindStateReflection ? "border-red-500 border-2" : ""} />
              {errors.mindStateReflection && <p className="text-sm text-red-600 mt-1">Add a short reflection to continue.</p>}
            </div>
          </CardContent>
        </Card>

        <div className="rounded-lg border border-border bg-muted/20 p-4 text-sm text-muted-foreground">
          The aim is not to stay in one mind state all the time. The model is simply one way to pause and notice which parts of your experience are most prominent.
        </div>

        <Button onClick={handleComplete} disabled={isCompleting} className="w-full">{isCompleting ? "Saving activity..." : "Record Module Activity"}</Button>
      </div>

      <ModuleCompletionDialog
        open={showCompletion}
        onOpenChange={setShowCompletion}
        moduleTitle="Understanding Your Mind"
        keyLearning="The DBT mind-states model can be used to notice when emotion, logic or a combination of both is most prominent. It is a reflection tool rather than a judgement about whether you are thinking correctly."
        creditsAwarded={1}
        nextModule={{ title: "Building Daily Awareness", slug: "building-awareness" }}
      />
    </div>
  )
}
