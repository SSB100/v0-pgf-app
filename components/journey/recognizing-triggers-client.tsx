"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Target } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import ModuleCompletionDialog from "@/components/journey/module-completion-dialog"

interface Props {
  journeyTypes: string[]
  problemAreas: any[]
}

export default function RecognizingTriggersClient({ journeyTypes, problemAreas }: Props) {
  const [triggerChain, setTriggerChain] = useState({ situation: "", thoughts: "", feelings: "", urges: "", action: "" })
  const [showCompletion, setShowCompletion] = useState(false)
  const [saving, setSaving] = useState(false)

  const onboardingTriggers = useMemo(() => {
    const triggers = problemAreas.flatMap((area) => {
      if (!area?.triggers) return []
      if (Array.isArray(area.triggers)) return area.triggers
      try {
        const parsed = JSON.parse(area.triggers)
        return Array.isArray(parsed) ? parsed : []
      } catch {
        return []
      }
    })
    return Array.from(new Set(triggers.map((trigger) => String(trigger)))).slice(0, 8)
  }, [problemAreas])

  const focusLabel = journeyTypes.includes("gambling")
    ? "gambling"
    : journeyTypes.includes("alcohol")
      ? "alcohol use"
      : journeyTypes.includes("substances")
        ? "substance use"
        : journeyTypes.includes("gaming")
          ? "gaming or internet use"
          : "a pattern you want to understand"

  const isComplete = Object.values(triggerChain).every((value) => value.trim().length > 0)

  async function saveActivity() {
    if (!isComplete) return
    setSaving(true)
    try {
      const response = await fetch("/api/journey/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moduleSlug: "recognizing-triggers", moduleTitle: "Recognising Your Triggers" }),
      })
      if (!response.ok) throw new Error("Failed to record module activity")
      setShowCompletion(true)
    } catch (error) {
      console.error("[v0] Error recording trigger module:", error)
      alert("Unable to record this module right now. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const updateChain = (key: keyof typeof triggerChain, value: string) => {
    setTriggerChain((current) => ({ ...current, [key]: value }))
  }

  return (
    <div className="min-h-screen bg-background py-8 pb-24 lg:pb-8">
      <div className="max-w-3xl mx-auto px-4 space-y-6">
        <Link href="/journey"><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4 mr-2" />Back to Journey</Button></Link>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Target className="w-5 h-5 text-primary" />Recognising Your Triggers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <p className="text-sm text-foreground/90">
              In Waypoint, a trigger is a cue or situation that seems to make a thought, emotion or urge more likely or more intense for you. It is not necessarily the sole cause of what happens next, and having a trigger does not mean you are weak or destined to act on it.
            </p>

            {onboardingTriggers.length > 0 && (
              <div className="rounded-lg border border-border bg-muted/20 p-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Cues you selected during onboarding</p>
                <div className="flex flex-wrap gap-2">
                  {onboardingTriggers.map((trigger) => <span key={trigger} className="rounded-full border border-border bg-background px-2.5 py-1 text-xs">{trigger}</span>)}
                </div>
              </div>
            )}

            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Look for a chain, not a single cause</h3>
              <p className="text-sm text-muted-foreground">
                A useful reflection can include the situation, what you were thinking, what you felt, the urge that showed up, and what happened next. Looking at the whole chain can reveal more than blaming one moment or one emotion.
              </p>
            </div>

            <p className="text-sm text-muted-foreground">
              If {focusLabel} is one of your focus areas, this exercise can help you look for patterns around it. You can use a hypothetical example if a recent experience feels too personal or uncomfortable to revisit.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Map one situation</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label htmlFor="trigger-situation">Situation or cue</Label><Textarea id="trigger-situation" value={triggerChain.situation} onChange={(event) => updateChain("situation", event.target.value)} placeholder="What was happening around you?" /></div>
            <div><Label htmlFor="trigger-thoughts">Thoughts or interpretations</Label><Textarea id="trigger-thoughts" value={triggerChain.thoughts} onChange={(event) => updateChain("thoughts", event.target.value)} placeholder="What was going through your mind?" /></div>
            <div><Label htmlFor="trigger-feelings">Emotions or body sensations</Label><Textarea id="trigger-feelings" value={triggerChain.feelings} onChange={(event) => updateChain("feelings", event.target.value)} placeholder="What did you notice emotionally or physically?" /></div>
            <div><Label htmlFor="trigger-urges">Urges</Label><Textarea id="trigger-urges" value={triggerChain.urges} onChange={(event) => updateChain("urges", event.target.value)} placeholder="What did you feel pulled toward doing?" /></div>
            <div><Label htmlFor="trigger-action">What happened next?</Label><Textarea id="trigger-action" value={triggerChain.action} onChange={(event) => updateChain("action", event.target.value)} placeholder="Record what happened without judging it as success or failure." /></div>
          </CardContent>
        </Card>

        <div className="rounded-lg border border-info/20 bg-info/10 p-4 text-sm text-foreground/90">
          Recognising a pattern does not mean every similar situation will end the same way. It gives you information you can use when deciding what support, boundary or skill may be useful next time.
        </div>

        <Button onClick={saveActivity} disabled={saving || !isComplete} className="w-full">{saving ? "Saving activity..." : "Record Module Activity"}</Button>
      </div>

      <ModuleCompletionDialog
        open={showCompletion}
        onOpenChange={setShowCompletion}
        moduleTitle="Recognising Your Triggers"
        keyLearning="Triggers are cues or situations that may be part of a larger pattern. Mapping the situation, thoughts, feelings, urges and actions can give you information without treating any one factor as the whole cause."
        creditsAwarded={1}
        nextModule={{ title: "Your Choice Points", slug: "choice-points" }}
      />
    </div>
  )
}
