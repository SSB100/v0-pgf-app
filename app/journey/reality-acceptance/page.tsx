"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import ModuleCompletionDialog from "@/components/journey/module-completion-dialog"

export default function RealityAcceptancePage() {
  const [isCompleting, setIsCompleting] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const [fighting, setFighting] = useState("")
  const [reality, setReality] = useState("")
  const [stuckHow, setStuckHow] = useState("")
  const [possible, setPossible] = useState("")
  const [errors, setErrors] = useState<Record<string, boolean>>({})

  const handleComplete = async () => {
    const newErrors: Record<string, boolean> = {}
    if (!fighting.trim()) newErrors.fighting = true
    if (!reality.trim()) newErrors.reality = true
    if (!stuckHow.trim()) newErrors.stuckHow = true
    if (!possible.trim()) newErrors.possible = true

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsCompleting(true)
    try {
      const response = await fetch("/api/journey/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moduleSlug: "reality-acceptance", moduleTitle: "Reality Acceptance" }),
      })
      if (!response.ok) throw new Error("Failed to record module activity")
      setShowDialog(true)
    } catch (error) {
      console.error("[v0] Error completing reality-acceptance module:", error)
      alert("Unable to record this module right now. Please try again.")
    } finally {
      setIsCompleting(false)
    }
  }

  const field = (
    id: string,
    label: string,
    value: string,
    setValue: (value: string) => void,
    placeholder: string,
  ) => (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Textarea
        id={id}
        value={value}
        onChange={(event) => {
          setValue(event.target.value)
          setErrors((current) => ({ ...current, [id]: false }))
        }}
        placeholder={placeholder}
        className={errors[id] ? "border-red-500 border-2" : ""}
      />
      {errors[id] && <p className="text-sm text-red-500 mt-1">Add a response or use a hypothetical example to continue.</p>}
    </div>
  )

  return (
    <div className="min-h-screen bg-background pb-12">
      <div className="max-w-3xl mx-auto px-3 sm:px-4 py-6 space-y-6">
        <Link href="/journey"><Button variant="ghost" size="sm" className="mb-4"><ArrowLeft className="w-4 h-4 mr-2" />Back to Journey</Button></Link>

        <Card className="border-2 border-primary/30">
          <CardHeader>
            <CardTitle className="text-2xl sm:text-3xl">Reality Acceptance</CardTitle>
            <CardDescription className="text-base">
              An acceptance-based practice for noticing what is true right now, especially when part of a situation cannot be changed immediately.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="bg-info/10 border border-info/20 rounded-lg p-4 space-y-2">
              <p className="text-sm text-foreground">
                Acceptance does not mean approval, forgiveness, forgetting, giving up or saying that something was okay. It can simply mean acknowledging what is already true so you can decide what is possible from here.
              </p>
              <p className="text-xs text-muted-foreground">
                Acceptance should never be used to encourage someone to remain in danger, abuse or an unsafe situation. If something can and should be changed for safety, taking action or seeking help may be the appropriate response.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-bold text-foreground">What this can look like</h3>
              <div className="rounded-lg border p-4 text-sm text-foreground/85">
                <p><span className="font-semibold">Acknowledge:</span> “This happened, and I cannot change the fact that it happened.”</p>
              </div>
              <div className="rounded-lg border p-4 text-sm text-foreground/85">
                <p><span className="font-semibold">Make room for emotion:</span> You can feel angry, sad, disappointed, relieved or something else without needing to judge the feeling.</p>
              </div>
              <div className="rounded-lg border p-4 text-sm text-foreground/85">
                <p><span className="font-semibold">Look at what is still possible:</span> Ask what you can influence now, what support you may want, and what next step fits your values.</p>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-muted/20 p-4 text-sm text-muted-foreground">
              You do not have to turn a painful experience into a lesson, forgive someone, “move on,” or feel calm for this practice to count. Acceptance can be partial and may need to be revisited.
            </div>

            <div className="bg-card border border-border rounded-lg p-5 space-y-4">
              <h4 className="font-semibold text-foreground">Practice with a recent or hypothetical situation</h4>
              <p className="text-sm text-muted-foreground">Choose something that feels safe enough to reflect on. A hypothetical example is fine.</p>
              {field("fighting", "What feels difficult to accept or acknowledge?", fighting, setFighting, "Describe the part of the situation you find yourself resisting...")}
              {field("reality", "What are the facts you know right now?", reality, setReality, "State the facts as simply as you can, without adding blame or judgement...")}
              {field("stuckHow", "How does fighting with those facts affect you?", stuckHow, setStuckHow, "What happens in your thoughts, emotions or behaviour when you get caught in the struggle with it?")}
              {field("possible", "What is still within your influence?", possible, setPossible, "A small action, boundary, support request, value or decision you can consider from here...")}
            </div>

            <Button onClick={handleComplete} disabled={isCompleting} className="w-full">
              {isCompleting ? "Saving activity..." : "Record Module Activity"}
            </Button>
          </CardContent>
        </Card>
      </div>

      <ModuleCompletionDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        moduleTitle="Reality Acceptance"
        keyLearning="Acceptance can mean acknowledging what is already true without approving of it. It can create space to consider what is still within your influence, while safety and change remain important where action is possible."
        creditsAwarded={1}
      />
    </div>
  )
}
