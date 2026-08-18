"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, GitBranch } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import ModuleCompletionDialog from "@/components/journey/module-completion-dialog"

export default function ChoicePointsClient({ journeyTypes }: { journeyTypes: string[] }) {
  const [situation, setSituation] = useState("")
  const [urge, setUrge] = useState("")
  const [options, setOptions] = useState("")
  const [valuesStep, setValuesStep] = useState("")
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
          : "a pattern you want to understand"

  const complete = [situation, urge, options, valuesStep].every((value) => value.trim().length > 0)

  async function recordActivity() {
    if (!complete) return
    setSaving(true)
    try {
      const response = await fetch("/api/journey/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moduleSlug: "choice-points", moduleTitle: "Your Choice Points" }),
      })
      if (!response.ok) throw new Error("Failed to record module activity")
      setShowCompletion(true)
    } catch (error) {
      console.error("[v0] Error recording choice-points module:", error)
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
            <CardTitle className="flex items-center gap-2"><GitBranch className="w-5 h-5 text-primary" />Your Choice Points</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <p className="text-sm text-foreground/90">
              Waypoint uses “choice point” as a simple reflection idea for moments when more than one next step is possible. It can help you notice an urge, consider the options available and bring your values into the decision.
            </p>
            <div className="rounded-lg border border-info/20 bg-info/10 p-4 text-sm text-foreground/90">
              Having options does not mean every decision is easy or completely within your control. Strong emotions, dependence, safety, health, finances and other circumstances can all affect what is possible in a moment. The aim is to notice choices where they exist, not to blame yourself when change is difficult.
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">A choice point might include</h3>
              <div className="grid gap-3">
                <div className="rounded-lg border p-4"><p className="font-semibold text-sm">1. A situation or cue</p><p className="text-sm text-muted-foreground">Something happens internally or around you.</p></div>
                <div className="rounded-lg border p-4"><p className="font-semibold text-sm">2. An urge, thought or feeling</p><p className="text-sm text-muted-foreground">You notice a pull toward one response.</p></div>
                <div className="rounded-lg border p-4"><p className="font-semibold text-sm">3. More than one possible next step</p><p className="text-sm text-muted-foreground">You consider what is realistically available, including asking for support.</p></div>
                <div className="rounded-lg border p-4"><p className="font-semibold text-sm">4. What matters to you</p><p className="text-sm text-muted-foreground">You can ask which option best fits your values, goals and safety right now.</p></div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              If {focusLabel} is one of your focus areas, you can apply this reflection there or use an unrelated example. A hypothetical situation is also fine.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Map one choice point</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label htmlFor="choice-situation">What was happening?</Label><Textarea id="choice-situation" value={situation} onChange={(event) => setSituation(event.target.value)} placeholder="Describe the situation or cue..." /></div>
            <div><Label htmlFor="choice-urge">What urge, thought or feeling showed up?</Label><Textarea id="choice-urge" value={urge} onChange={(event) => setUrge(event.target.value)} placeholder="What did you notice in that moment?" /></div>
            <div><Label htmlFor="choice-options">What options were realistically available?</Label><Textarea id="choice-options" value={options} onChange={(event) => setOptions(event.target.value)} placeholder="Include asking for support, pausing, leaving a situation or doing nothing yet if those were genuine options..." /></div>
            <div><Label htmlFor="choice-values">Which option felt most consistent with your values, goals or safety?</Label><Textarea id="choice-values" value={valuesStep} onChange={(event) => setValuesStep(event.target.value)} placeholder="There is no required answer. Describe what mattered to you..." /></div>
          </CardContent>
        </Card>

        <div className="rounded-lg border border-border bg-muted/20 p-4 text-sm text-muted-foreground">
          Looking back at a choice does not mean you should have made a different one. The exercise is for noticing what influenced the moment and what options you may want available in the future.
        </div>

        <Button onClick={recordActivity} disabled={saving || !complete} className="w-full">{saving ? "Saving activity..." : "Record Module Activity"}</Button>
      </div>

      <ModuleCompletionDialog
        open={showCompletion}
        onOpenChange={setShowCompletion}
        moduleTitle="Your Choice Points"
        keyLearning="A choice point is a way to notice an urge or situation, consider the options that are realistically available, and bring your values and safety into the decision without blaming yourself when change is difficult."
        creditsAwarded={1}
        nextModule={{ title: "Discovering Your Values", slug: "discovering-values" }}
      />
    </div>
  )
}
