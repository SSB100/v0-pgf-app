"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import ModuleCompletionDialog from "@/components/journey/module-completion-dialog"
import { useState } from "react"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import MobileNav from "@/components/dashboard/mobile-nav"

export default function OppositeActionPage() {
  const [isCompleting, setIsCompleting] = useState(false)
  const [showDialog, setShowDialog] = useState(false)

  const [emotion, setEmotion] = useState("")
  const [actionUrge, setActionUrge] = useState("")
  const [oppositeAction, setOppositeAction] = useState("")
  const [errors, setErrors] = useState<Record<string, boolean>>({})

  const handleComplete = async () => {
    const newErrors: Record<string, boolean> = {}

    if (!emotion || emotion.trim().length === 0) newErrors.emotion = true
    if (!actionUrge || actionUrge.trim().length === 0) newErrors.actionUrge = true
    if (!oppositeAction || oppositeAction.trim().length === 0) newErrors.oppositeAction = true

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      alert("Please complete all practice exercises before finishing the module.")
      return
    }

    console.log("[v0] Starting module completion for opposite-action")
    setIsCompleting(true)

    try {
      const response = await fetch("/api/journey/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          moduleSlug: "opposite-action",
          moduleTitle: "Opposite Action",
        }),
      })

      console.log("[v0] API response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.error("[v0] Error completing module:", errorData)
        alert(`Failed to complete module: ${errorData.error || "Unknown error"}`)
        return
      }

      const data = await response.json()
      console.log("[v0] Module completion successful:", data)
      setShowDialog(true)
    } catch (error) {
      console.error("[v0] Error in handleComplete:", error)
      alert("An error occurred. Please try again.")
    } finally {
      setIsCompleting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-6">
      <DashboardHeader userName="there" userEmail="" />

      <main className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-6">
        <Link href="/journey">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Journey
          </Button>
        </Link>

        <Card className="border-2 border-primary/30">
          <CardHeader>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-3xl">↔️</div>
              <div>
                <CardTitle className="text-2xl sm:text-3xl">Opposite Action</CardTitle>
                <p className="text-sm text-muted-foreground mb-1">Module 9 of 11</p>
                <CardDescription className="text-base">
                  Practice doing the opposite of what your emotion urges you to do
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="bg-info/10 border border-info/20 rounded-lg p-4">
              <p className="text-sm text-foreground">
                <span className="font-semibold">Core Concept:</span> When an emotion doesn't fit the facts or isn't
                helping you, acting opposite to its urge can change how you feel.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold text-foreground">Understanding Opposite Action</h3>
              <p className="text-foreground/90">
                Opposite Action is a skill from Dialectical Behavior Therapy (DBT) that helps you change unwanted
                emotions by doing the opposite of what they urge you to do. This works because our actions and emotions
                are deeply connected—when you act differently, your emotions often follow.
              </p>
            </div>

            <div className="border-l-4 border-primary pl-4 py-2 bg-primary/5">
              <p className="text-sm italic text-foreground/90">
                "You can't always control how you feel, but you can control what you do. And what you do can change how
                you feel."
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold text-foreground">When to Use Opposite Action</h3>
              <div className="grid gap-4">
                <div className="bg-card border border-border rounded-lg p-4">
                  <h4 className="font-semibold text-foreground mb-2">✓ Use Opposite Action When:</h4>
                  <ul className="space-y-2 text-sm text-foreground/90">
                    <li>• The emotion doesn't fit the facts of the situation</li>
                    <li>• Acting on the emotion will make things worse</li>
                    <li>• The emotion is more intense than the situation warrants</li>
                    <li>• You want to change how you're feeling</li>
                  </ul>
                </div>

                <div className="bg-card border border-border rounded-lg p-4">
                  <h4 className="font-semibold text-foreground mb-2">✗ Don't Use When:</h4>
                  <ul className="space-y-2 text-sm text-foreground/90">
                    <li>• The emotion fits the facts perfectly</li>
                    <li>• Acting on the emotion will help solve a problem</li>
                    <li>• The emotion intensity matches the situation</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold text-foreground">Common Gambling Emotions & Opposite Actions</h3>
              <div className="space-y-3">
                <div className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 border border-orange-500/30 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-xl">😰</span>
                    </div>
                    <div className="flex-1 space-y-2">
                      <h4 className="font-bold text-foreground">Fear/Anxiety</h4>
                      <p className="text-sm text-foreground/80">
                        <span className="font-semibold">Urge:</span> Avoid, escape, gamble to numb the feeling
                      </p>
                      <p className="text-sm text-foreground/80">
                        <span className="font-semibold text-primary">Opposite Action:</span> Approach the situation,
                        stay present, do something calming instead
                      </p>
                      <div className="bg-card/50 rounded p-3 text-xs">
                        <span className="font-semibold">Example:</span> Feeling anxious about bills → Instead of
                        gambling to "win money back," review your budget and make a realistic plan
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/30 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-xl">😡</span>
                    </div>
                    <div className="flex-1 space-y-2">
                      <h4 className="font-bold text-foreground">Anger</h4>
                      <p className="text-sm text-foreground/80">
                        <span className="font-semibold">Urge:</span> Attack, lash out, gamble to feel power/control
                      </p>
                      <p className="text-sm text-foreground/80">
                        <span className="font-semibold text-primary">Opposite Action:</span> Be gentle with yourself and
                        others, step away, do something kind
                      </p>
                      <div className="bg-card/50 rounded p-3 text-xs">
                        <span className="font-semibold">Example:</span> Angry after an argument → Instead of gambling to
                        "show them," go for a walk or text a supportive friend
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-500/30 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-xl">😢</span>
                    </div>
                    <div className="flex-1 space-y-2">
                      <h4 className="font-bold text-foreground">Sadness</h4>
                      <p className="text-sm text-foreground/80">
                        <span className="font-semibold">Urge:</span> Isolate, withdraw, gamble for temporary escape
                      </p>
                      <p className="text-sm text-foreground/80">
                        <span className="font-semibold text-primary">Opposite Action:</span> Get active, reach out to
                        others, engage with life
                      </p>
                      <div className="bg-card/50 rounded p-3 text-xs">
                        <span className="font-semibold">Example:</span> Feeling lonely and sad → Instead of gambling to
                        fill the void, call a friend or join a support group
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-500/10 to-purple-600/10 border border-purple-500/30 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-xl">😔</span>
                    </div>
                    <div className="flex-1 space-y-2">
                      <h4 className="font-bold text-foreground">Shame/Guilt</h4>
                      <p className="text-sm text-foreground/80">
                        <span className="font-semibold">Urge:</span> Hide, isolate, gamble to punish yourself or escape
                      </p>
                      <p className="text-sm text-foreground/80">
                        <span className="font-semibold text-primary">Opposite Action:</span> Make eye contact, be open
                        about mistakes, show self-compassion
                      </p>
                      <div className="bg-card/50 rounded p-3 text-xs">
                        <span className="font-semibold">Example:</span> Ashamed after gambling → Instead of hiding, tell
                        someone you trust and ask for support
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold text-foreground">How to Practice Opposite Action</h3>
              <ol className="space-y-4">
                <li className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Identify the Emotion</h4>
                    <p className="text-sm text-foreground/80">
                      Name what you're feeling. "I'm feeling anxious/angry/sad/ashamed."
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Check If It Fits the Facts</h4>
                    <p className="text-sm text-foreground/80">
                      Does this emotion match what's really happening? Is the intensity appropriate?
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Identify the Action Urge</h4>
                    <p className="text-sm text-foreground/80">
                      What does this emotion want you to do? (Gamble, hide, lash out, etc.)
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Do the Opposite—All the Way</h4>
                    <p className="text-sm text-foreground/80">
                      Act opposite to the urge with your body language, facial expression, posture, and actions. Go all
                      in!
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                    5
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Repeat Until It Shifts</h4>
                    <p className="text-sm text-foreground/80">
                      Keep doing opposite action until you notice your emotion starting to change.
                    </p>
                  </div>
                </li>
              </ol>
            </div>

            <div className="bg-primary/10 border border-primary/20 rounded-lg p-5">
              <h4 className="font-semibold text-foreground mb-3">💡 Key Insight</h4>
              <p className="text-sm text-foreground/90">
                Opposite Action works best when you do it <span className="font-bold">completely</span>. Halfhearted
                opposite action won't change your emotions. If you're going to smile when you're sad, smile big. If
                you're going to approach when you're anxious, approach fully. All or nothing!
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-5 space-y-4">
              <h4 className="font-semibold text-foreground">Practice Exercise</h4>
              <p className="text-sm text-foreground/80">
                Think about the last time you had an urge to gamble. What emotion were you feeling? What was the action
                urge? What would the opposite action have been?
              </p>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="emotion">Emotion I felt:</Label>
                  <Textarea
                    id="emotion"
                    value={emotion}
                    onChange={(e) => {
                      setEmotion(e.target.value)
                      if (errors.emotion) setErrors({ ...errors, emotion: false })
                    }}
                    placeholder="e.g., Anxious about money, angry after an argument, lonely..."
                    className={errors.emotion ? "border-red-500 border-2" : ""}
                  />
                  {errors.emotion && <p className="text-sm text-red-500 mt-1">This field is required</p>}
                </div>

                <div>
                  <Label htmlFor="actionUrge">Action urge:</Label>
                  <Textarea
                    id="actionUrge"
                    value={actionUrge}
                    onChange={(e) => {
                      setActionUrge(e.target.value)
                      if (errors.actionUrge) setErrors({ ...errors, actionUrge: false })
                    }}
                    placeholder="e.g., Gamble to escape the feeling, numb the anxiety..."
                    className={errors.actionUrge ? "border-red-500 border-2" : ""}
                  />
                  {errors.actionUrge && <p className="text-sm text-red-500 mt-1">This field is required</p>}
                </div>

                <div>
                  <Label htmlFor="oppositeAction">Opposite action would have been:</Label>
                  <Textarea
                    id="oppositeAction"
                    value={oppositeAction}
                    onChange={(e) => {
                      setOppositeAction(e.target.value)
                      if (errors.oppositeAction) setErrors({ ...errors, oppositeAction: false })
                    }}
                    placeholder="e.g., Call a friend, go for a walk, review my budget..."
                    className={errors.oppositeAction ? "border-red-500 border-2" : ""}
                  />
                  {errors.oppositeAction && <p className="text-sm text-red-500 mt-1">This field is required</p>}
                </div>
              </div>
            </div>

            <Button onClick={handleComplete} disabled={isCompleting} size="lg" className="w-full">
              {isCompleting ? "Completing..." : "Complete Module"}
            </Button>

            {showDialog && (
              <ModuleCompletionDialog
                moduleSlug="opposite-action"
                moduleTitle="Opposite Action"
                keyLearning="When emotions don't fit the facts, acting opposite to their urge can change how you feel."
                creditsAwarded={1}
                nextModule={{
                  title: "DEAR MAN",
                  slug: "dear-man",
                }}
                open={showDialog}
                onOpenChange={setShowDialog}
              />
            )}
          </CardContent>
        </Card>
      </main>

      <MobileNav />
    </div>
  )
}
