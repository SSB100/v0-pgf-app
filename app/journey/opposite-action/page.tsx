"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import MobileNav from "@/components/dashboard/mobile-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import ModuleCompletionDialog from "@/components/journey/module-completion-dialog"

export default function OppositeActionPage() {
  const [isCompleting, setIsCompleting] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const [emotion, setEmotion] = useState("")
  const [actionUrge, setActionUrge] = useState("")
  const [oppositeAction, setOppositeAction] = useState("")
  const [errors, setErrors] = useState<Record<string, boolean>>({})

  const handleComplete = async () => {
    const newErrors: Record<string, boolean> = {}
    if (!emotion.trim()) newErrors.emotion = true
    if (!actionUrge.trim()) newErrors.actionUrge = true
    if (!oppositeAction.trim()) newErrors.oppositeAction = true

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsCompleting(true)
    try {
      const response = await fetch("/api/journey/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moduleSlug: "opposite-action", moduleTitle: "Opposite Action" }),
      })

      if (!response.ok) throw new Error("Failed to record module activity")
      setShowDialog(true)
    } catch (error) {
      console.error("[v0] Error completing opposite-action module:", error)
      alert("Unable to record this module right now. Please try again.")
    } finally {
      setIsCompleting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-6">
      <DashboardHeader userName="there" userEmail="" />
      <main className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-6">
        <Link href="/journey"><Button variant="ghost" size="sm" className="mb-4"><ArrowLeft className="w-4 h-4 mr-2" />Back to Journey</Button></Link>

        <Card className="border-2 border-primary/30">
          <CardHeader>
            <CardTitle className="text-2xl sm:text-3xl">Opposite Action</CardTitle>
            <CardDescription className="text-base">
              A DBT-informed skill for considering a different action when an emotional urge does not fit the facts or your goals.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="rounded-lg border border-info/20 bg-info/10 p-4 space-y-2">
              <p className="text-sm text-foreground">
                Emotions can carry useful information. Opposite Action is not about ignoring emotions or forcing yourself to feel differently. The skill starts by checking the facts and asking whether following the urge would be useful in the situation.
              </p>
              <p className="text-xs text-muted-foreground">
                Do not use “opposite action” to override a genuine safety signal. If there is real danger, abuse, a medical concern or another urgent risk, take appropriate safety action or seek support.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold text-foreground">A simple way to explore it</h3>
              <ol className="space-y-3 text-sm text-foreground/90">
                <li><span className="font-semibold">1. Name the emotion.</span> What are you noticing?</li>
                <li><span className="font-semibold">2. Check the facts.</span> Does the emotion fit what is actually happening, and is the intensity understandable in context?</li>
                <li><span className="font-semibold">3. Notice the action urge.</span> What does the emotion pull you toward doing?</li>
                <li><span className="font-semibold">4. Consider alternatives.</span> If acting on the urge would move you away from your goals and the situation is safe, what different action could you try?</li>
                <li><span className="font-semibold">5. Notice what happens.</span> The emotion may change, stay the same or take time to shift. There is no required result.</li>
              </ol>
            </div>

            <div className="rounded-lg border border-border bg-muted/20 p-4 text-sm text-muted-foreground">
              Example: if anxiety is pulling you to avoid a safe conversation you want to have, an alternative might be to take a small step toward the conversation. If fear is warning you about real danger, getting safer is not something to act opposite to.
            </div>

            <div className="bg-card border border-border rounded-lg p-5 space-y-4">
              <h4 className="font-semibold text-foreground">Practice with a recent or hypothetical example</h4>
              <p className="text-sm text-muted-foreground">You can use a hypothetical situation if you do not want to revisit something personal.</p>

              <div>
                <Label htmlFor="emotion">Emotion or feeling</Label>
                <Textarea id="emotion" value={emotion} onChange={(event) => { setEmotion(event.target.value); setErrors((current) => ({ ...current, emotion: false })) }} placeholder="What emotion would you like to explore?" className={errors.emotion ? "border-red-500 border-2" : ""} />
                {errors.emotion && <p className="text-sm text-red-500 mt-1">Add an emotion or a hypothetical example to continue.</p>}
              </div>

              <div>
                <Label htmlFor="actionUrge">Action urge</Label>
                <Textarea id="actionUrge" value={actionUrge} onChange={(event) => { setActionUrge(event.target.value); setErrors((current) => ({ ...current, actionUrge: false })) }} placeholder="What did the emotion make you want to do?" className={errors.actionUrge ? "border-red-500 border-2" : ""} />
                {errors.actionUrge && <p className="text-sm text-red-500 mt-1">Add an action urge or hypothetical example to continue.</p>}
              </div>

              <div>
                <Label htmlFor="oppositeAction">A different action you could consider</Label>
                <Textarea id="oppositeAction" value={oppositeAction} onChange={(event) => { setOppositeAction(event.target.value); setErrors((current) => ({ ...current, oppositeAction: false })) }} placeholder="If the situation is safe and the urge does not fit your goals, what else could you try?" className={errors.oppositeAction ? "border-red-500 border-2" : ""} />
                {errors.oppositeAction && <p className="text-sm text-red-500 mt-1">Add an alternative action or hypothetical example to continue.</p>}
              </div>
            </div>

            <Button onClick={handleComplete} disabled={isCompleting} className="w-full">
              {isCompleting ? "Saving activity..." : "Record Module Activity"}
            </Button>
          </CardContent>
        </Card>
      </main>

      <ModuleCompletionDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        moduleTitle="Opposite Action"
        keyLearning="Opposite Action begins with checking the facts. When an emotional urge does not fit the situation or your goals, you can consider a different action without treating the emotion itself as wrong."
        creditsAwarded={1}
        nextModule={{ title: "DEAR MAN", slug: "dear-man" }}
      />
      <MobileNav />
    </div>
  )
}
