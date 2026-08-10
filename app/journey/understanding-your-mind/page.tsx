"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Lightbulb } from "lucide-react"
import Link from "next/link"
import { ModuleCompletionDialog } from "@/components/journey/module-completion-dialog"

export default function UnderstandingYourMindPage() {
  const router = useRouter()
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
    console.log("[v0] Starting module completion...")

    const newErrors: Record<string, boolean> = {}

    if (!scenario1) newErrors.scenario1 = true
    if (!scenario2) newErrors.scenario2 = true
    if (!scenario3) newErrors.scenario3 = true
    if (!reflection || reflection.trim().length === 0) newErrors.reflection = true
    if (!currentMindState) newErrors.currentMindState = true
    if (!mindStateReflection || mindStateReflection.trim().length === 0) newErrors.mindStateReflection = true

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      alert("Please complete all exercises before finishing the module.")
      return
    }

    setIsCompleting(true)
    try {
      const response = await fetch("/api/journey/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          moduleSlug: "understanding-your-mind",
          moduleTitle: "Understanding Your Mind",
        }),
      })

      console.log("[v0] Response status:", response.status)
      const data = await response.json()
      console.log("[v0] Response data:", data)

      if (response.ok) {
        console.log("[v0] Module completed successfully, showing dialog")
        setShowCompletion(true)
      } else {
        console.error("[v0] Failed to complete module:", data.error)
        alert(`Failed to complete module: ${data.error || "Unknown error"}`)
      }
    } catch (error) {
      console.error("[v0] Error completing module:", error)
      alert("Failed to complete module. Please try again.")
    } finally {
      setIsCompleting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-3xl mx-auto px-4 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/journey">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Understanding Your Mind</h1>
            <p className="text-muted-foreground">Module 1 of 11</p>
          </div>
        </div>

        {/* Introduction */}
        <Card>
          <CardHeader>
            <CardTitle>The Three Mind States</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm">
              Understanding the three mind states—Emotional Mind, Reasonable Mind, and Wise Mind—helps you recognize how
              you're thinking and make better decisions in difficult moments.
            </p>
          </CardContent>
        </Card>

        {/* Emotional Mind */}
        <Card className="border-2 border-destructive/30 bg-destructive/5">
          <CardHeader>
            <CardTitle className="text-destructive">Emotional Mind</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm">
              <span className="font-semibold">Driven by feelings.</span> When you're in emotional mind, your emotions
              are in control. Decisions feel urgent and impulsive. This is often when gambling urges feel strongest.
            </p>
            <div className="bg-card/50 rounded-lg p-3">
              <p className="text-xs font-semibold mb-2">Examples:</p>
              <ul className="text-xs text-muted-foreground space-y-1 list-disc pl-4">
                <li>"I need to gamble RIGHT NOW to feel better"</li>
                <li>"I can't stand this feeling, I have to do something"</li>
                <li>Acting on impulse without thinking of consequences</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Reasonable Mind */}
        <Card className="border-2 border-blue-300 bg-blue-50/50">
          <CardHeader>
            <CardTitle className="text-blue-700">Reasonable Mind</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm">
              <span className="font-semibold">Driven by logic and facts.</span> When you're in reasonable mind, you're
              thinking rationally and planning. You might ignore or dismiss your emotions entirely.
            </p>
            <div className="bg-card/50 rounded-lg p-3">
              <p className="text-xs font-semibold mb-2">Examples:</p>
              <ul className="text-xs text-muted-foreground space-y-1 list-disc pl-4">
                <li>"Statistically, I'll lose money if I gamble"</li>
                <li>"I should just ignore these feelings and push through"</li>
                <li>Making plans without considering how you actually feel</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Wise Mind */}
        <Card className="border-2 border-green-300 bg-green-50/50">
          <CardHeader>
            <CardTitle className="text-green-700">Wise Mind</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm">
              <span className="font-semibold">The integration of emotion and reason.</span> Wise mind is where your
              emotions and logic work together. You acknowledge your feelings AND consider the facts. This is where the
              best decisions happen.
            </p>
            <div className="bg-card/50 rounded-lg p-3">
              <p className="text-xs font-semibold mb-2">Examples:</p>
              <ul className="text-xs text-muted-foreground space-y-1 list-disc pl-4">
                <li>"I feel the urge to gamble, AND I know it won't solve my problem"</li>
                <li>"This is difficult AND I can handle it with the right support"</li>
                <li>Taking action that honors both your feelings and your values</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Interactive Exercise */}
        <Card className="border-2 border-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-primary" />
              Practice: Identify the Mind State
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-sm">Read each scenario and identify which mind state the person is in.</p>

            {/* Scenario 1 */}
            <div className="space-y-3">
              <p className="text-sm font-medium">
                Scenario 1: "I just got paid and I feel lucky today. I'm going to win big this time!"
              </p>
              <RadioGroup
                value={scenario1}
                onValueChange={(value) => {
                  setScenario1(value)
                  if (errors.scenario1) setErrors({ ...errors, scenario1: false })
                }}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="emotional" id="s1-emotional" />
                  <Label htmlFor="s1-emotional">Emotional Mind</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="reasonable" id="s1-reasonable" />
                  <Label htmlFor="s1-reasonable">Reasonable Mind</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="wise" id="s1-wise" />
                  <Label htmlFor="s1-wise">Wise Mind</Label>
                </div>
              </RadioGroup>
              {errors.scenario1 && <p className="text-sm text-red-600 font-medium">Please select an answer</p>}
              {scenario1 === "emotional" && (
                <p className="text-xs text-green-600 bg-green-50 p-2 rounded">
                  Correct! This is emotional mind—driven by feelings of excitement and impulse.
                </p>
              )}
            </div>

            {/* Scenario 2 */}
            <div className="space-y-3">
              <p className="text-sm font-medium">
                Scenario 2: "The odds are against me. I should never gamble because it's mathematically impossible to
                win."
              </p>
              <RadioGroup
                value={scenario2}
                onValueChange={(value) => {
                  setScenario2(value)
                  if (errors.scenario2) setErrors({ ...errors, scenario2: false })
                }}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="emotional" id="s2-emotional" />
                  <Label htmlFor="s2-emotional">Emotional Mind</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="reasonable" id="s2-reasonable" />
                  <Label htmlFor="s2-reasonable">Reasonable Mind</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="wise" id="s2-wise" />
                  <Label htmlFor="s2-wise">Wise Mind</Label>
                </div>
              </RadioGroup>
              {errors.scenario2 && <p className="text-sm text-red-600 font-medium">Please select an answer</p>}
              {scenario2 === "reasonable" && (
                <p className="text-xs text-green-600 bg-green-50 p-2 rounded">
                  Correct! This is reasonable mind—focused on logic and facts, potentially ignoring emotional needs.
                </p>
              )}
            </div>

            {/* Scenario 3 */}
            <div className="space-y-3">
              <p className="text-sm font-medium">
                Scenario 3: "I'm feeling the urge to gamble right now, and I know from experience it won't help. I'll
                call my support person instead."
              </p>
              <RadioGroup
                value={scenario3}
                onValueChange={(value) => {
                  setScenario3(value)
                  if (errors.scenario3) setErrors({ ...errors, scenario3: false })
                }}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="emotional" id="s3-emotional" />
                  <Label htmlFor="s3-emotional">Emotional Mind</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="reasonable" id="s3-reasonable" />
                  <Label htmlFor="s3-reasonable">Reasonable Mind</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="wise" id="s3-wise" />
                  <Label htmlFor="s3-wise">Wise Mind</Label>
                </div>
              </RadioGroup>
              {errors.scenario3 && <p className="text-sm text-red-600 font-medium">Please select an answer</p>}
              {scenario3 === "wise" && (
                <p className="text-xs text-green-600 bg-green-50 p-2 rounded">
                  Correct! This is wise mind—acknowledging both the feeling and what's needed, then taking values-based
                  action.
                </p>
              )}
            </div>

            {/* Personal Reflection */}
            <div className="space-y-3 pt-4 border-t">
              <Label htmlFor="reflection">
                Personal Reflection: Think of a recent time you felt the urge to gamble. Which mind state were you in?
              </Label>
              <Textarea
                id="reflection"
                value={reflection}
                onChange={(e) => {
                  setReflection(e.target.value)
                  if (errors.reflection) setErrors({ ...errors, reflection: false })
                }}
                placeholder="Write your reflection here..."
                rows={4}
                className={errors.reflection ? "border-red-500 border-2" : ""}
              />
              {errors.reflection && <p className="text-sm text-red-600 mt-1">This field is required</p>}
            </div>
          </CardContent>
        </Card>

        {/* Moving to Wise Mind */}
        <Card className="bg-green-50/50 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-700">Moving to Wise Mind</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-700">
              You'll move between these states throughout the day. The goal isn't to always be in wise mind—that's
              impossible. The goal is to recognize which state you're in and gently guide yourself toward wise mind when
              making important decisions.
            </p>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">When you're in Emotion Mind:</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">•</span>
                    <span>Pause and take several deep breaths</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">•</span>
                    <span>Ask yourself: "What are the facts of this situation?"</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">•</span>
                    <span>Wait before making important decisions</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">When you're in Reasonable Mind:</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">•</span>
                    <span>Check in with your feelings: "How do I feel about this?"</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">•</span>
                    <span>Consider your values and what matters to you</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">•</span>
                    <span>Ask: "What does my intuition say?"</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Practice: Identify Your Current Mind State */}
        <Card className="border-2 border-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-primary" />
              Practice: Identify Your Current Mind State
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm">Take a moment to reflect on which mind state you're in right now.</p>

            <div className="space-y-3">
              <Label htmlFor="currentMindState">Which mind state are you in right now?</Label>
              <select
                id="currentMindState"
                value={currentMindState}
                onChange={(e) => {
                  setCurrentMindState(e.target.value)
                  if (errors.currentMindState) setErrors({ ...errors, currentMindState: false })
                }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.currentMindState ? "border-red-500 border-2" : "border-gray-300"
                }`}
              >
                <option value="">Select a mind state...</option>
                <option value="wise">Wise Mind</option>
                <option value="emotion">Emotion Mind</option>
                <option value="reasonable">Reasonable Mind</option>
              </select>
              {errors.currentMindState && (
                <p className="text-sm text-red-600 mt-1">Please select your current mind state</p>
              )}
            </div>

            <div className="space-y-3">
              <Label htmlFor="mindStateReflection">What tells you you're in this mind state? What do you notice?</Label>
              <Textarea
                id="mindStateReflection"
                value={mindStateReflection}
                onChange={(e) => {
                  setMindStateReflection(e.target.value)
                  if (errors.mindStateReflection) setErrors({ ...errors, mindStateReflection: false })
                }}
                placeholder="For example: 'I'm feeling calm and can think clearly while also being aware of my feelings...'"
                rows={4}
                className={errors.mindStateReflection ? "border-red-500 border-2" : ""}
              />
              {errors.mindStateReflection && <p className="text-sm text-red-600 mt-1">This field is required</p>}
            </div>
          </CardContent>
        </Card>

        {/* Key Takeaways */}
        <Card className="bg-primary/10 border-primary/30">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-2">Key Takeaways</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold mt-0.5">1.</span>
                <span>We all move between different mind states throughout the day</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold mt-0.5">2.</span>
                <span>No mind state is "bad"—they each serve a purpose</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold mt-0.5">3.</span>
                <span>Wise Mind balances emotion and reason for better decisions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold mt-0.5">4.</span>
                <span>Recognizing your mind state is the first step to shifting it</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Complete Button */}
        <Card>
          <CardContent className="pt-6">
            <Button onClick={handleComplete} disabled={isCompleting} className="w-full" size="lg">
              {isCompleting ? "Completing..." : "Complete Module"}
            </Button>
          </CardContent>
        </Card>

        <ModuleCompletionDialog
          open={showCompletion}
          onOpenChange={setShowCompletion}
          moduleTitle="Understanding Your Mind"
          keyLearning="You learned to recognize three mind states—Emotional Mind (feeling-driven), Reasonable Mind (logic-driven), and Wise Mind (the integration of both)—and practiced identifying which state you're in to make better decisions."
          creditsAwarded={1}
          nextModule={{ title: "Building Awareness", slug: "building-awareness" }}
        />
      </div>
    </div>
  )
}
