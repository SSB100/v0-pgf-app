"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Heart, Users, Briefcase, Home, Sparkles, Book } from "lucide-react"
import ModuleCompletionDialog from "@/components/journey/module-completion-dialog"

export default function DiscoveringValuesPage() {
  const [selectedValues, setSelectedValues] = useState<string[]>([])
  const [topValue, setTopValue] = useState("")
  const [valueConnection, setValueConnection] = useState("")
  const [isCompleting, setIsCompleting] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const [errors, setErrors] = useState<Record<string, boolean>>({})

  const valueCategories = [
    { category: "Relationships", icon: Heart, color: "text-pink-600", values: ["Family", "Friendship", "Love", "Connection", "Trust", "Loyalty"] },
    { category: "Personal Growth", icon: Sparkles, color: "text-purple-600", values: ["Learning", "Creativity", "Independence", "Self-awareness", "Courage", "Authenticity"] },
    { category: "Community", icon: Users, color: "text-blue-600", values: ["Helping others", "Justice", "Compassion", "Respect", "Belonging", "Contribution"] },
    { category: "Work and Contribution", icon: Briefcase, color: "text-green-600", values: ["Achievement", "Responsibility", "Reliability", "Curiosity", "Craft", "Innovation"] },
    { category: "Health and Wellbeing", icon: Home, color: "text-orange-600", values: ["Physical health", "Mental wellbeing", "Balance", "Peace", "Safety", "Rest"] },
    { category: "Meaning and Beliefs", icon: Book, color: "text-indigo-600", values: ["Purpose", "Faith", "Wisdom", "Gratitude", "Nature", "Tradition"] },
  ]

  const toggleValue = (value: string) => {
    setSelectedValues((current) => current.includes(value) ? current.filter((item) => item !== value) : [...current, value])
  }

  const handleComplete = async () => {
    const newErrors: Record<string, boolean> = {}
    if (selectedValues.length === 0) newErrors.values = true
    if (!topValue.trim()) newErrors.topValue = true
    if (!valueConnection.trim()) newErrors.connection = true

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsCompleting(true)
    try {
      const response = await fetch("/api/journey/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moduleSlug: "discovering-values", moduleTitle: "Discovering Your Values" }),
      })
      if (!response.ok) throw new Error("Failed to record module activity")
      setShowDialog(true)
    } catch (error) {
      console.error("[v0] Error completing values module:", error)
      alert("Unable to record this module right now. Please try again.")
    } finally {
      setIsCompleting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 py-4 sm:py-6 max-w-4xl">
        <Link href="/journey"><Button variant="ghost" size="sm" className="mb-3"><ArrowLeft className="mr-2 h-4 w-4" />Back to Journey</Button></Link>

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0"><Heart className="w-5 h-5 sm:w-6 sm:h-6 text-purple-700" /></div>
            <div className="min-w-0"><h1 className="text-2xl sm:text-3xl font-bold text-foreground">Discovering Your Values</h1><p className="text-xs sm:text-sm text-muted-foreground">Journey module</p></div>
          </div>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Explore what matters to you and how values can be one source of direction when you are deciding what to do next.
          </p>
        </div>

        <Card className="p-4 sm:p-6 mb-5">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 text-foreground">What are values?</h2>
          <p className="text-sm text-foreground/85 mb-3 leading-relaxed">
            In this module, values are qualities or directions that you want to bring into your life. They are different from goals: a goal can often be completed, while a value can guide many different actions over time.
          </p>
          <div className="bg-purple-500/10 p-3 rounded-lg text-sm">
            <p className="text-foreground/80"><strong>Goal:</strong> “Have dinner with my whānau this week.”</p>
            <p className="text-foreground/80"><strong>Value:</strong> “Connection.”</p>
          </div>
        </Card>

        <Card className="p-4 sm:p-6 mb-5">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 text-foreground">How values can be useful</h2>
          <ul className="space-y-2 text-sm text-foreground/80">
            <li>• They can help you describe what matters to you.</li>
            <li>• They can give you another perspective when a decision feels difficult.</li>
            <li>• They can help you notice whether a possible action fits the kind of person you want to be in that moment.</li>
            <li>• They do not guarantee a particular emotional, health or recovery outcome.</li>
          </ul>
        </Card>

        <Card className="p-4 sm:p-6 mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold mb-2 text-foreground">Explore Values</h2>
          <p className="text-sm text-muted-foreground mb-5">Choose any that feel important to you right now. Values can change in priority over time.</p>

          <div className="space-y-4">
            {valueCategories.map((category) => {
              const Icon = category.icon
              return (
                <div key={category.category}>
                  <div className="flex items-center gap-2 mb-2 pb-2 border-b border-border">
                    <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${category.color} flex-shrink-0`} />
                    <span className="text-xs sm:text-sm font-medium text-muted-foreground">{category.category}</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                    {category.values.map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => {
                          toggleValue(value)
                          if (errors.values) setErrors((current) => ({ ...current, values: false }))
                        }}
                        className={`px-3 py-2 text-xs sm:text-sm rounded-lg border transition-all font-medium ${selectedValues.includes(value) ? "bg-primary text-primary-foreground border-primary" : "bg-card text-foreground border-border hover:border-primary/50"}`}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          {errors.values && <p className="mt-3 text-sm text-destructive">Choose at least one value or return to this module later.</p>}
        </Card>

        <Card className="p-4 sm:p-6 mb-5">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 text-foreground">Reflection</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Which value feels especially relevant right now?</label>
              {selectedValues.length > 0 ? (
                <select
                  value={topValue}
                  onChange={(event) => {
                    setTopValue(event.target.value)
                    if (errors.topValue) setErrors((current) => ({ ...current, topValue: false }))
                  }}
                  className={`w-full px-3 py-2 text-sm border rounded-lg bg-background focus:ring-2 focus:ring-primary ${errors.topValue ? "border-destructive" : "border-border"}`}
                >
                  <option value="">Select a value...</option>
                  {selectedValues.map((value) => <option key={value} value={value}>{value}</option>)}
                </select>
              ) : <p className="text-sm text-muted-foreground">Choose a value above first.</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">How could this value show up in a small action or decision?</label>
              <textarea
                value={valueConnection}
                onChange={(event) => {
                  setValueConnection(event.target.value)
                  if (errors.connection) setErrors((current) => ({ ...current, connection: false }))
                }}
                className={`w-full px-3 py-2 text-sm border rounded-lg bg-background focus:ring-2 focus:ring-primary min-h-[90px] ${errors.connection ? "border-destructive" : "border-border"}`}
                placeholder="A small action, boundary, conversation, routine or choice..."
              />
              {errors.connection && <p className="text-xs text-destructive mt-1">Add a reflection to continue.</p>}
            </div>
          </div>
        </Card>

        <div className="rounded-lg border border-border bg-muted/20 p-4 mb-6 text-sm text-muted-foreground">
          Values are not rules you have to follow perfectly. They are one way to think about direction. Acting differently from a value on one day does not make you a bad person or erase earlier progress.
        </div>

        <Button onClick={handleComplete} disabled={isCompleting} size="lg" className="w-full">{isCompleting ? "Saving activity..." : "Record Module Activity"}</Button>

        <ModuleCompletionDialog
          open={showDialog}
          onOpenChange={setShowDialog}
          moduleTitle="Discovering Your Values"
          keyLearning="Values can describe qualities and directions that matter to you. They can inform choices without becoming rules you have to follow perfectly or guarantees of a particular outcome."
          creditsAwarded={1}
          nextModule={{ title: "Recognising Your Strengths", slug: "recognizing-strengths" }}
        />
      </div>
    </div>
  )
}
