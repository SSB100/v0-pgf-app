"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import ModuleCompletionDialog from "@/components/journey/module-completion-dialog"
import { useState } from "react"

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

    if (!fighting || fighting.trim().length === 0) newErrors.fighting = true
    if (!reality || reality.trim().length === 0) newErrors.reality = true
    if (!stuckHow || stuckHow.trim().length === 0) newErrors.stuckHow = true
    if (!possible || possible.trim().length === 0) newErrors.possible = true

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      alert("Please complete all parts of the Radical Acceptance exercise before finishing the module.")
      return
    }

    setIsCompleting(true)

    try {
      const response = await fetch("/api/journey/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          moduleSlug: "reality-acceptance",
          moduleTitle: "Reality Acceptance",
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        alert(`Failed to complete module: ${errorData.error || "Unknown error"}`)
        return
      }

      setShowDialog(true)
    } catch (error) {
      console.error("[v0] Error completing module:", error)
      alert("An error occurred. Please try again.")
    } finally {
      setIsCompleting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background pb-12">
      <div className="max-w-3xl mx-auto px-3 sm:px-4 py-6 space-y-6">
        <Link href="/journey">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Journey
          </Button>
        </Link>

        <Card className="border-2 border-primary/30">
          <CardHeader>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-3xl">🌊</div>
              <div>
                <CardTitle className="text-2xl sm:text-3xl">Reality Acceptance</CardTitle>
                <CardDescription className="text-base">
                  Learn to accept what you cannot change and move forward with wisdom
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="bg-info/10 border border-info/20 rounded-lg p-4">
              <p className="text-sm text-foreground">
                <span className="font-semibold">Core Concept:</span> Acceptance doesn't mean approval or giving up—it
                means acknowledging reality so you can stop fighting it and start living effectively.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold text-foreground">Understanding Reality Acceptance</h3>
              <p className="text-foreground/90">
                One of the most painful parts of recovery is facing what has happened—the losses, the hurt, the time you
                can't get back. Reality acceptance is about acknowledging these facts without judgment, so you can stop
                struggling against what is and start moving forward.
              </p>
            </div>

            <div className="border-l-4 border-primary pl-4 py-2 bg-primary/5">
              <p className="text-sm italic text-foreground/90">
                "Pain is inevitable. Suffering is optional. Pain is what reality gives us. Suffering is our struggle
                against that reality."
              </p>
              <p className="text-xs text-muted-foreground mt-2">— Inspired by Buddhist philosophy</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold text-foreground">What Acceptance Is NOT</h3>
              <div className="grid gap-3">
                <div className="bg-red-50/50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm font-semibold text-red-900 mb-2">✗ Acceptance is NOT approval</p>
                  <p className="text-sm text-red-800">
                    You can accept that you gambled away money without approving of it or thinking it was okay.
                  </p>
                </div>
                <div className="bg-red-50/50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm font-semibold text-red-900 mb-2">✗ Acceptance is NOT giving up</p>
                  <p className="text-sm text-red-800">
                    It's the opposite—acceptance frees you to take effective action instead of staying stuck.
                  </p>
                </div>
                <div className="bg-red-50/50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm font-semibold text-red-900 mb-2">✗ Acceptance is NOT forgetting</p>
                  <p className="text-sm text-red-800">
                    You can remember what happened while letting go of the endless replay and suffering.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold text-foreground">What Acceptance IS</h3>
              <div className="grid gap-3">
                <div className="bg-green-50/50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm font-semibold text-green-900 mb-2">✓ Acknowledging reality as it is</p>
                  <p className="text-sm text-green-800">"I gambled. I lost money. My partner is hurt. This is real."</p>
                </div>
                <div className="bg-green-50/50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm font-semibold text-green-900 mb-2">✓ Letting go of the fight</p>
                  <p className="text-sm text-green-800">
                    Stopping the "Why did this happen?" "How could I?" "If only..." loop.
                  </p>
                </div>
                <div className="bg-green-50/50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm font-semibold text-green-900 mb-2">✓ Opening the door to change</p>
                  <p className="text-sm text-green-800">
                    Once you accept reality, you can work with it instead of against it.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold text-foreground">The Reality Acceptance Process</h3>
              <div className="space-y-3">
                <div className="bg-card border-l-4 border-blue-500 rounded-lg p-4">
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-700 font-bold">
                      1
                    </span>
                    Notice Non-Acceptance
                  </h4>
                  <p className="text-sm text-foreground/80 ml-10">
                    Pay attention to signs you're fighting reality: rumination, "what if" thinking, bitterness, feeling
                    stuck.
                  </p>
                  <div className="bg-muted/50 rounded p-3 ml-10 mt-2 text-xs text-foreground/70">
                    <span className="font-semibold">Ask yourself:</span> "Am I fighting against something I can't
                    change?"
                  </div>
                </div>

                <div className="bg-card border-l-4 border-purple-500 rounded-lg p-4">
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-700 font-bold">
                      2
                    </span>
                    Acknowledge the Reality
                  </h4>
                  <p className="text-sm text-foreground/80 ml-10">
                    State the facts without judgment. Use clear, simple language about what actually is.
                  </p>
                  <div className="bg-muted/50 rounded p-3 ml-10 mt-2 text-xs text-foreground/70">
                    <span className="font-semibold">Example:</span> "I have a gambling problem. I've hurt people I love.
                    This is where I am right now."
                  </div>
                </div>

                <div className="bg-card border-l-4 border-green-500 rounded-lg p-4">
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-700 font-bold">
                      3
                    </span>
                    Feel the Emotions
                  </h4>
                  <p className="text-sm text-foreground/80 ml-10">
                    Allow yourself to feel sad, angry, disappointed—without acting on those feelings destructively.
                  </p>
                  <div className="bg-muted/50 rounded p-3 ml-10 mt-2 text-xs text-foreground/70">
                    Grief is part of acceptance. Let yourself mourn what was lost.
                  </div>
                </div>

                <div className="bg-card border-l-4 border-orange-500 rounded-lg p-4">
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-700 font-bold">
                      4
                    </span>
                    Practice Radical Acceptance
                  </h4>
                  <p className="text-sm text-foreground/80 ml-10">
                    Accept with your whole self—mind, body, and spirit. Not just intellectually, but emotionally.
                  </p>
                  <div className="bg-muted/50 rounded p-3 ml-10 mt-2 text-xs text-foreground/70">
                    This might take time. That's okay. Keep practicing.
                  </div>
                </div>

                <div className="bg-card border-l-4 border-teal-500 rounded-lg p-4">
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-700 font-bold">
                      5
                    </span>
                    Turn Toward the Future
                  </h4>
                  <p className="text-sm text-foreground/80 ml-10">
                    Once you've accepted what is, ask: "What can I do now? How can I move forward from here?"
                  </p>
                  <div className="bg-muted/50 rounded p-3 ml-10 mt-2 text-xs text-foreground/70">
                    <span className="font-semibold">Example:</span> "I can't change the past, but I can work on my
                    recovery today."
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold text-foreground">Things in Recovery That Often Require Acceptance</h3>
              <div className="space-y-3 text-sm">
                <div className="bg-card border border-border rounded-lg p-4">
                  <p className="font-semibold mb-1">💰 Financial Losses</p>
                  <p className="text-foreground/80">
                    The money is gone. Acceptance means: "I can't get it back, but I can stop losing more starting
                    today."
                  </p>
                </div>
                <div className="bg-card border border-border rounded-lg p-4">
                  <p className="font-semibold mb-1">💔 Damaged Relationships</p>
                  <p className="text-foreground/80">
                    Trust is broken. Acceptance means: "I hurt people I love. I can't undo it, but I can start making
                    amends now."
                  </p>
                </div>
                <div className="bg-card border border-border rounded-lg p-4">
                  <p className="font-semibold mb-1">⏰ Lost Time</p>
                  <p className="text-foreground/80">
                    Years spent gambling. Acceptance means: "I can't go back, but I can make the most of the time I have
                    left."
                  </p>
                </div>
                <div className="bg-card border border-border rounded-lg p-4">
                  <p className="font-semibold mb-1">🎭 Your Identity as Someone in Recovery</p>
                  <p className="text-foreground/80">
                    Acceptance means: "I have a gambling problem. This is part of my story, not something to be ashamed
                    of."
                  </p>
                </div>
                <div className="bg-card border border-border rounded-lg p-4">
                  <p className="font-semibold mb-1">📈 The Work Ahead</p>
                  <p className="text-foreground/80">
                    Recovery is hard. Acceptance means: "This will take effort and time. I'm willing to do the work."
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-primary/10 border border-primary/20 rounded-lg p-5 space-y-3">
              <h4 className="font-semibold text-foreground">💡 The Freedom in Acceptance</h4>
              <p className="text-sm text-foreground/90">
                Here's the paradox: when you stop fighting reality and accept it, you actually become free to change.
                Non-acceptance keeps you stuck in the past. Acceptance opens the door to a different future.
              </p>
              <p className="text-sm text-foreground/90 italic">
                "God, grant me the serenity to accept the things I cannot change, courage to change the things I can,
                and wisdom to know the difference."
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-5 space-y-4">
              <h4 className="font-semibold text-foreground">Practice Exercise: Radical Acceptance</h4>
              <p className="text-sm text-foreground/80 mb-4">
                Think of something in your recovery journey you've been fighting or resisting. Practice accepting it:
              </p>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="fighting">What I've been fighting:</Label>
                  <Textarea
                    id="fighting"
                    value={fighting}
                    onChange={(e) => {
                      setFighting(e.target.value)
                      if (errors.fighting) setErrors({ ...errors, fighting: false })
                    }}
                    placeholder="e.g., The money I lost, the trust I broke..."
                    className={errors.fighting ? "border-red-500 border-2" : ""}
                  />
                  {errors.fighting && <p className="text-sm text-red-500 mt-1">This field is required</p>}
                </div>

                <div>
                  <Label htmlFor="reality">The reality I need to accept:</Label>
                  <Textarea
                    id="reality"
                    value={reality}
                    onChange={(e) => {
                      setReality(e.target.value)
                      if (errors.reality) setErrors({ ...errors, reality: false })
                    }}
                    placeholder="State the facts without judgment..."
                    className={errors.reality ? "border-red-500 border-2" : ""}
                  />
                  {errors.reality && <p className="text-sm text-red-500 mt-1">This field is required</p>}
                </div>

                <div>
                  <Label htmlFor="stuckHow">How non-acceptance has kept me stuck:</Label>
                  <Textarea
                    id="stuckHow"
                    value={stuckHow}
                    onChange={(e) => {
                      setStuckHow(e.target.value)
                      if (errors.stuckHow) setErrors({ ...errors, stuckHow: false })
                    }}
                    placeholder="e.g., Ruminating instead of moving forward..."
                    className={errors.stuckHow ? "border-red-500 border-2" : ""}
                  />
                  {errors.stuckHow && <p className="text-sm text-red-500 mt-1">This field is required</p>}
                </div>

                <div>
                  <Label htmlFor="possible">What becomes possible if I accept this:</Label>
                  <Textarea
                    id="possible"
                    value={possible}
                    onChange={(e) => {
                      setPossible(e.target.value)
                      if (errors.possible) setErrors({ ...errors, possible: false })
                    }}
                    placeholder="e.g., I can focus on rebuilding, making amends..."
                    className={errors.possible ? "border-red-500 border-2" : ""}
                  />
                  {errors.possible && <p className="text-sm text-red-500 mt-1">This field is required</p>}
                </div>
              </div>
            </div>

            <Button onClick={handleComplete} disabled={isCompleting} size="lg" className="w-full">
              {isCompleting ? "Completing..." : "Complete Module"}
            </Button>

            {showDialog && (
              <ModuleCompletionDialog
                open={showDialog}
                onOpenChange={setShowDialog}
                moduleSlug="reality-acceptance"
                moduleTitle="Reality Acceptance"
                keyLearning="How to accept reality without approval, letting go of the fight against what is, and opening the door to real change"
                creditsAwarded={1}
                nextModule={{
                  title: "Journey Complete",
                  slug: "/journey",
                }}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
