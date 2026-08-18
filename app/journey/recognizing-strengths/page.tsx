"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import ModuleCompletionDialog from "@/components/journey/module-completion-dialog"

export default function RecognizingStrengthsPage() {
  const [selectedStrengths, setSelectedStrengths] = useState<string[]>([])
  const [strengthStory, setStrengthStory] = useState("")
  const [futureUse, setFutureUse] = useState("")
  const [isCompleting, setIsCompleting] = useState(false)
  const [showDialog, setShowDialog] = useState(false)

  const strengthCategories = [
    { category: "Personal qualities", strengths: ["Patient", "Honest", "Loyal", "Kind", "Adaptable", "Open-minded", "Curious", "Persistent", "Reflective", "Independent"] },
    { category: "With other people", strengths: ["Good listener", "Empathetic", "Supportive", "Communicative", "Friendly", "Trustworthy", "Generous", "Understanding", "Fair", "Co-operative"] },
    { category: "Practical strengths", strengths: ["Problem solving", "Organisation", "Creativity", "Reliability", "Resourcefulness", "Planning", "Focus", "Practical skills", "Learning", "Follow-through"] },
    { category: "Ways of coping", strengths: ["Self-awareness", "Humour", "Hope", "Mindfulness", "Flexibility", "Asking for help", "Taking a pause", "Trying again", "Setting boundaries", "Finding perspective"] },
  ]

  const toggleStrength = (strength: string) => {
    setSelectedStrengths((current) => current.includes(strength) ? current.filter((item) => item !== strength) : [...current, strength])
  }

  const canComplete = selectedStrengths.length > 0 && strengthStory.trim() && futureUse.trim()

  const handleComplete = async () => {
    if (!canComplete) return
    setIsCompleting(true)
    try {
      const response = await fetch("/api/journey/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moduleSlug: "recognizing-strengths", moduleTitle: "Recognising Your Strengths" }),
      })
      if (!response.ok) throw new Error("Failed to record module activity")
      setShowDialog(true)
    } catch (error) {
      console.error("[v0] Error completing strengths module:", error)
      alert("Unable to record this module right now. Please try again.")
    } finally {
      setIsCompleting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 py-6 max-w-4xl space-y-6">
        <Link href="/journey"><Button variant="ghost" size="sm"><ArrowLeft className="mr-2 h-4 w-4" />Back to Journey</Button></Link>

        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-11 h-11 rounded-full bg-amber-500/15 flex items-center justify-center"><Star className="w-5 h-5 text-amber-600" /></div>
            <div><h1 className="text-2xl sm:text-3xl font-bold text-foreground">Recognising Your Strengths</h1><p className="text-sm text-muted-foreground">Journey module</p></div>
          </div>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Notice qualities, skills and resources that you may be able to draw on. You do not need to feel confident or positive about yourself to use this exercise.
          </p>
        </div>

        <Card className="p-5 sm:p-6 space-y-4">
          <h2 className="text-xl font-semibold text-foreground">What counts as a strength?</h2>
          <p className="text-sm text-foreground/85 leading-relaxed">
            A strength can be a quality, skill, relationship resource or way of coping that has sometimes helped you. It does not have to describe you all the time, and choosing a strength does not mean you have to live up to it perfectly.
          </p>
          <p className="text-sm text-muted-foreground">
            If a strengths-focused exercise does not feel useful today, you can use a neutral example or return to the module later.
          </p>
        </Card>

        <Card className="p-5 sm:p-6 space-y-5">
          <div><h2 className="text-xl font-semibold text-foreground">Choose any that feel familiar</h2><p className="text-sm text-muted-foreground mt-1">Select at least one. These are prompts, not a personality assessment.</p></div>
          {strengthCategories.map((category) => (
            <div key={category.category}>
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">{category.category}</h3>
              <div className="flex flex-wrap gap-2">
                {category.strengths.map((strength) => (
                  <button
                    key={strength}
                    type="button"
                    onClick={() => toggleStrength(strength)}
                    className={`px-3 py-2 rounded-full border text-sm transition-all ${selectedStrengths.includes(strength) ? "bg-primary text-primary-foreground border-primary" : "bg-card text-foreground border-border hover:border-primary/50"}`}
                  >
                    {strength}
                  </button>
                ))}
              </div>
            </div>
          ))}
          {selectedStrengths.length > 0 && (
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm text-muted-foreground">
              Selected: <span className="text-foreground">{selectedStrengths.join(", ")}</span>
            </div>
          )}
        </Card>

        <Card className="p-5 sm:p-6 space-y-5">
          <h2 className="text-xl font-semibold text-foreground">Reflection</h2>
          <div>
            <label htmlFor="strength-story" className="block text-sm font-medium text-foreground mb-2">Think of a recent or hypothetical situation where one of these strengths could be useful.</label>
            <textarea id="strength-story" value={strengthStory} onChange={(event) => setStrengthStory(event.target.value)} className="w-full p-3 border border-border rounded-lg bg-background min-h-[100px]" placeholder="What was happening, and which strength might have helped?" />
          </div>
          <div>
            <label htmlFor="strength-future" className="block text-sm font-medium text-foreground mb-2">How might you use or ask for this strength or resource in the future?</label>
            <textarea id="strength-future" value={futureUse} onChange={(event) => setFutureUse(event.target.value)} className="w-full p-3 border border-border rounded-lg bg-background min-h-[100px]" placeholder="A small action, reminder, support request or way of approaching a situation..." />
          </div>
        </Card>

        <div className="rounded-lg border border-border bg-muted/20 p-4 text-sm text-muted-foreground">
          Strengths are not proof that you should be able to handle everything alone. Asking for help, changing plans or needing professional support can sit alongside personal strengths.
        </div>

        <Button onClick={handleComplete} disabled={isCompleting || !canComplete} size="lg" className="w-full">{isCompleting ? "Saving activity..." : "Record Module Activity"}</Button>

        <ModuleCompletionDialog
          open={showDialog}
          onOpenChange={setShowDialog}
          moduleTitle="Recognising Your Strengths"
          keyLearning="A strength can be a quality, skill, relationship resource or way of coping that is available some of the time. Strengths can support change without creating an expectation that you should manage everything alone."
          creditsAwarded={1}
          nextModule={{ title: "STOP Skill", slug: "stop-skill" }}
        />
      </div>
    </div>
  )
}
