"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, MessageCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import ModuleCompletionDialog from "@/components/journey/module-completion-dialog"

export default function DearManPage() {
  const [situation, setSituation] = useState("")
  const [describe, setDescribe] = useState("")
  const [express, setExpress] = useState("")
  const [assertText, setAssertText] = useState("")
  const [reinforce, setReinforce] = useState("")
  const [mindful, setMindful] = useState("")
  const [confident, setConfident] = useState("")
  const [negotiate, setNegotiate] = useState("")
  const [showDialog, setShowDialog] = useState(false)
  const [saving, setSaving] = useState(false)

  const complete = [situation, describe, express, assertText, reinforce, mindful, confident, negotiate].every((value) => value.trim())

  async function recordActivity() {
    if (!complete) return
    setSaving(true)
    try {
      const response = await fetch("/api/journey/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moduleSlug: "dear-man", moduleTitle: "DEAR MAN Communication" }),
      })
      if (!response.ok) throw new Error("Failed to record module activity")
      setShowDialog(true)
    } catch (error) {
      console.error("[v0] Error completing DEAR MAN module:", error)
      alert("Unable to record this module right now. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const fields = [
    { id: "describe", title: "Describe", prompt: "What are the relevant facts, stated as neutrally as you can?", value: describe, set: setDescribe, placeholder: "For example: We agreed on a time to talk, and the conversation did not happen." },
    { id: "express", title: "Express", prompt: "What do you want the other person to understand about how this affects you?", value: express, set: setExpress, placeholder: "For example: I felt disappointed and unsure what to expect." },
    { id: "assert", title: "Assert", prompt: "What are you asking for, declining or setting a boundary around?", value: assertText, set: setAssertText, placeholder: "For example: I'd like us to choose another time, or tell me if you can't make it." },
    { id: "reinforce", title: "Reinforce", prompt: "Why might this request or boundary be useful for the relationship or situation?", value: reinforce, set: setReinforce, placeholder: "For example: Clear plans would help us both know what to expect." },
    { id: "mindful", title: "Mindful", prompt: "What will help you stay focused on the main point rather than getting pulled into every side issue?", value: mindful, set: setMindful, placeholder: "A phrase you can return to, a pause, or a reminder of the main request..." },
    { id: "confident", title: "Appear confident", prompt: "What would calm, clear communication look like for you?", value: confident, set: setConfident, placeholder: "For example: slow down, speak clearly, avoid apologising for having a reasonable boundary..." },
    { id: "negotiate", title: "Negotiate", prompt: "If compromise is appropriate, what alternatives could you consider?", value: negotiate, set: setNegotiate, placeholder: "For example: another time, a smaller request, or deciding that no agreement is possible right now." },
  ]

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        <Link href="/journey"><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4 mr-2" />Back to Journey</Button></Link>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><MessageCircle className="w-5 h-5 text-primary" />DEAR MAN Communication</CardTitle>
            <CardDescription className="text-base">A DBT-informed structure for making a request, saying no or setting a boundary more clearly.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <p className="text-sm text-foreground/90">
              DEAR MAN can help organise what you want to say. It cannot guarantee that another person will agree, respond well or change their behaviour. You are still allowed to decide that a conversation is not useful or safe.
            </p>
            <div className="rounded-lg border border-amber-300/60 bg-amber-50 p-4 text-sm text-amber-950 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-100">
              Do not use a communication framework as a reason to confront someone when you are worried about violence, coercion or retaliation. Safety planning or professional support may be more appropriate in an unsafe relationship or situation.
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {["D · Describe", "E · Express", "A · Assert", "R · Reinforce", "M · Mindful", "A · Appear confident", "N · Negotiate"].map((item) => <div key={item} className="rounded-lg border bg-muted/20 p-2 font-medium text-center">{item}</div>)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Practice with a recent or hypothetical conversation</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">Use a low-risk hypothetical example if a real conversation feels too personal or unsafe to revisit.</p>
            <div>
              <Label htmlFor="dear-situation">What is the situation?</Label>
              <Textarea id="dear-situation" value={situation} onChange={(event) => setSituation(event.target.value)} placeholder="A request, boundary or conversation you want to think through..." />
            </div>
            {fields.map((field) => (
              <div key={field.id} className="rounded-lg border border-border p-4 space-y-2">
                <Label htmlFor={`dear-${field.id}`} className="font-semibold">{field.title}</Label>
                <p className="text-xs text-muted-foreground">{field.prompt}</p>
                <Textarea id={`dear-${field.id}`} value={field.value} onChange={(event) => field.set(event.target.value)} placeholder={field.placeholder} />
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="rounded-lg border border-info/20 bg-info/10 p-4 text-sm text-foreground/90">
          Clear communication can be useful even when the answer is no. The goal of this exercise is to help you organise your message and boundaries, not to make you responsible for another person's response.
        </div>

        <Button onClick={recordActivity} disabled={saving || !complete} className="w-full">{saving ? "Saving activity..." : "Record Module Activity"}</Button>
      </div>

      <ModuleCompletionDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        moduleTitle="DEAR MAN Communication"
        keyLearning="DEAR MAN is a DBT-informed structure for organising a request or boundary. It can support clearer communication without guaranteeing another person's response or requiring you to stay in an unsafe conversation."
        creditsAwarded={1}
        nextModule={{ title: "Reality Acceptance", slug: "reality-acceptance" }}
      />
    </div>
  )
}
