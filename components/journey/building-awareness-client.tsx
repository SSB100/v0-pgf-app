"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import ModuleCompletionDialog from "@/components/journey/module-completion-dialog"

interface Props {
  journeyTypes: string[]
}

export default function BuildingAwarenessClient({ journeyTypes }: Props) {
  const [situation, setSituation] = useState("")
  const [noticed, setNoticed] = useState("")
  const [choice, setChoice] = useState("")
  const [showCompletion, setShowCompletion] = useState(false)
  const [saving, setSaving] = useState(false)

  const focusLabel = journeyTypes.includes("gambling")
    ? "gambling"
    : journeyTypes.includes("alcohol")
      ? "alcohol use"
      : journeyTypes.includes("substances")
        ? "substance use"
        : journeyTypes.includes("gaming")
          ? "gaming or internet use"
          : "a pattern or behaviour you want to understand"

  async function saveActivity() {
    if (!situation.trim() || !noticed.trim() || !choice.trim()) return
    setSaving(true)
    try {
      const response = await fetch("/api/journey/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moduleSlug: "building-awareness", moduleTitle: "Building Daily Awareness" }),
      })
      if (!response.ok) throw new Error("Failed to record module activity")
      setShowCompletion(true)
    } catch (error) {
      console.error("[v0] Error recording awareness module:", error)
      alert("Unable to record this module right now. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-background py-8 pb-24 lg:pb-8">
      <div className="max-w-3xl mx-auto px-4 space-y-6">
        <Link href="/journey"><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4 mr-2" />Back to Journey</Button></Link>

        <Card>
          <CardHeader>
            <CardTitle>Building Daily Awareness</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="rounded-lg border border-info/20 bg-info/10 p-4 text-sm text-foreground/90">
              Awareness in Waypoint means noticing what is happening in and around you before deciding what to do next. It is not about catching yourself doing something “wrong” or forcing an urge or emotion to disappear.
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Three things you can notice</h3>
              <div className="grid gap-3">
                <div className="rounded-lg border p-4">
                  <p className="font-semibold text-sm">1. The situation</p>
                  <p className="text-sm text-muted-foreground">Where were you, who was around, and what had just happened?</p>
                </div>
                <div className="rounded-lg border p-4">
                  <p className="font-semibold text-sm">2. Your internal experience</p>
                  <p className="text-sm text-muted-foreground">What thoughts, emotions, body sensations or urges did you notice?</p>
                </div>
                <div className="rounded-lg border p-4">
                  <p className="font-semibold text-sm">3. The next step</p>
                  <p className="text-sm text-muted-foreground">What options were available, and which one felt most aligned with what mattered to you?</p>
                </div>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              If {focusLabel} is one of your focus areas, awareness can help you look for patterns around it. A pattern is information, not proof of failure or a diagnosis.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Practice with a recent or hypothetical example</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">Use a hypothetical situation if you do not want to revisit something personal.</p>
            <div>
              <Label htmlFor="awareness-situation">What was happening?</Label>
              <Textarea id="awareness-situation" value={situation} onChange={(event) => setSituation(event.target.value)} placeholder="Describe the situation as simply as you can..." />
            </div>
            <div>
              <Label htmlFor="awareness-noticed">What did you notice in yourself?</Label>
              <Textarea id="awareness-noticed" value={noticed} onChange={(event) => setNoticed(event.target.value)} placeholder="Thoughts, emotions, body sensations or urges..." />
            </div>
            <div>
              <Label htmlFor="awareness-choice">What options or next steps were available?</Label>
              <Textarea id="awareness-choice" value={choice} onChange={(event) => setChoice(event.target.value)} placeholder="There is no required or perfect answer..." />
            </div>
          </CardContent>
        </Card>

        <div className="rounded-lg border border-border bg-muted/20 p-4 text-sm text-muted-foreground">
          Awareness does not guarantee a different outcome. Its purpose is to help you notice more of the situation so you have more information when you choose what to do next.
        </div>

        <Button onClick={saveActivity} disabled={saving || !situation.trim() || !noticed.trim() || !choice.trim()} className="w-full">
          {saving ? "Saving activity..." : "Record Module Activity"}
        </Button>
      </div>

      <ModuleCompletionDialog
        open={showCompletion}
        onOpenChange={setShowCompletion}
        moduleTitle="Building Daily Awareness"
        keyLearning="Awareness means noticing the situation, your internal experience and the choices available to you. It is information rather than a judgement about how you are doing."
        creditsAwarded={1}
        nextModule={{ title: "Recognising Your Triggers", slug: "recognizing-triggers" }}
      />
    </div>
  )
}
