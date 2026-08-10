"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import ModuleCompletionDialog from "@/components/journey/module-completion-dialog"
import { useState } from "react"

export default function DearManPage() {
  const [isCompleting, setIsCompleting] = useState(false)
  const [showDialog, setShowDialog] = useState(false)

  const [describe, setDescribe] = useState("")
  const [express, setExpress] = useState("")
  const [assert, setAssert] = useState("")
  const [reinforce, setReinforce] = useState("")
  const [errors, setErrors] = useState<Record<string, boolean>>({})

  const handleComplete = async () => {
    const newErrors: Record<string, boolean> = {}

    if (!describe || describe.trim().length === 0) newErrors.describe = true
    if (!express || express.trim().length === 0) newErrors.express = true
    if (!assert || assert.trim().length === 0) newErrors.assert = true
    if (!reinforce || reinforce.trim().length === 0) newErrors.reinforce = true

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      alert("Please complete all parts of the DEAR MAN practice exercise before finishing the module.")
      return
    }

    setIsCompleting(true)

    try {
      const response = await fetch("/api/journey/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          moduleSlug: "dear-man",
          moduleTitle: "DEAR MAN",
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
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-3xl">💬</div>
              <div>
                <CardTitle className="text-2xl sm:text-3xl">DEAR MAN Communication</CardTitle>
                <CardDescription className="text-base">
                  Master effective communication to get your needs met respectfully
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="bg-info/10 border border-info/20 rounded-lg p-4">
              <p className="text-sm text-foreground">
                <span className="font-semibold">Core Concept:</span> DEAR MAN is a structured approach to asking for
                what you need while maintaining relationships and self-respect.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold text-foreground">Understanding DEAR MAN</h3>
              <p className="text-foreground/90">
                DEAR MAN is an interpersonal effectiveness skill from DBT that helps you communicate clearly and
                effectively when you need to ask for something, set boundaries, or express your needs. It's especially
                helpful in recovery when you need support from others.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold text-foreground">The DEAR MAN Framework</h3>
              <div className="space-y-3">
                <div className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 border-l-4 border-blue-500 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 font-bold text-blue-700">
                      D
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-bold text-foreground">Describe</h4>
                      <p className="text-sm text-foreground/80">
                        Describe the facts of the situation. Stick to what actually happened, not your interpretation.
                      </p>
                      <div className="bg-card rounded p-3 text-sm space-y-1">
                        <p className="font-semibold text-green-700">✓ Good:</p>
                        <p className="text-foreground/70">"I gambled last night and I'm feeling overwhelmed."</p>
                        <p className="font-semibold text-red-700 mt-2">✗ Not:</p>
                        <p className="text-foreground/70">"I'm a complete failure and ruined everything."</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-500/10 to-purple-600/10 border-l-4 border-purple-500 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 font-bold text-purple-700">
                      E
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-bold text-foreground">Express</h4>
                      <p className="text-sm text-foreground/80">
                        Express your feelings and opinions about the situation using "I" statements.
                      </p>
                      <div className="bg-card rounded p-3 text-sm space-y-1">
                        <p className="font-semibold text-green-700">✓ Good:</p>
                        <p className="text-foreground/70">"I feel scared and need some help right now."</p>
                        <p className="font-semibold text-red-700 mt-2">✗ Not:</p>
                        <p className="text-foreground/70">"You never help me when I need you."</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-500/10 to-green-600/10 border-l-4 border-green-500 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 font-bold text-green-700">
                      A
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-bold text-foreground">Assert</h4>
                      <p className="text-sm text-foreground/80">
                        Ask clearly for what you want or say no clearly. Be specific.
                      </p>
                      <div className="bg-card rounded p-3 text-sm space-y-1">
                        <p className="font-semibold text-green-700">✓ Good:</p>
                        <p className="text-foreground/70">"I need you to hold onto my bank card for the next week."</p>
                        <p className="font-semibold text-red-700 mt-2">✗ Not:</p>
                        <p className="text-foreground/70">"Maybe you could help me somehow?"</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 border-l-4 border-orange-500 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0 font-bold text-orange-700">
                      R
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-bold text-foreground">Reinforce</h4>
                      <p className="text-sm text-foreground/80">
                        Explain the positive effects of getting what you want or need.
                      </p>
                      <div className="bg-card rounded p-3 text-sm">
                        <p className="font-semibold text-green-700">Example:</p>
                        <p className="text-foreground/70">
                          "If you hold my card, I'll feel safer and we can rebuild trust together."
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-pink-500/10 to-pink-600/10 border-l-4 border-pink-500 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center flex-shrink-0 font-bold text-pink-700">
                      M
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-bold text-foreground">Mindful</h4>
                      <p className="text-sm text-foreground/80">
                        Stay focused on your goal. Don't get distracted or defensive. Keep asking.
                      </p>
                      <div className="bg-card rounded p-3 text-sm">
                        <p className="text-foreground/70">
                          Use the "broken record" technique: calmly repeat your request if they try to change the
                          subject.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-teal-500/10 to-teal-600/10 border-l-4 border-teal-500 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center flex-shrink-0 font-bold text-teal-700">
                      A
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-bold text-foreground">Appear Confident</h4>
                      <p className="text-sm text-foreground/80">
                        Use a confident tone and body language. Make eye contact. Stand or sit up straight.
                      </p>
                      <div className="bg-card rounded p-3 text-sm">
                        <p className="text-foreground/70">
                          Even if you don't feel confident, appearing confident increases the chance you'll be taken
                          seriously.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-indigo-500/10 to-indigo-600/10 border-l-4 border-indigo-500 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0 font-bold text-indigo-700">
                      N
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-bold text-foreground">Negotiate</h4>
                      <p className="text-sm text-foreground/80">
                        Be willing to give to get. Offer and ask for alternative solutions.
                      </p>
                      <div className="bg-card rounded p-3 text-sm">
                        <p className="font-semibold text-green-700">Example:</p>
                        <p className="text-foreground/70">
                          "If holding my card is too much responsibility, could you help me set up app blockers
                          instead?"
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold text-foreground">DEAR MAN in Recovery: Complete Example</h3>
              <div className="bg-card border border-border rounded-lg p-5 space-y-3 text-sm">
                <p className="font-semibold text-foreground">
                  Scenario: Asking a partner to help with financial boundaries
                </p>
                <div className="space-y-2 pl-4">
                  <p>
                    <span className="font-bold text-blue-700">D:</span> "I gambled twice this week and lost $300 from
                    our savings account."
                  </p>
                  <p>
                    <span className="font-bold text-purple-700">E:</span> "I feel ashamed and scared that I'll do it
                    again. I don't trust myself with money right now."
                  </p>
                  <p>
                    <span className="font-bold text-green-700">A:</span> "I need you to manage our finances for the next
                    month while I work on my recovery."
                  </p>
                  <p>
                    <span className="font-bold text-orange-700">R:</span> "This will help me stay accountable and
                    protect our future together."
                  </p>
                  <p>
                    <span className="font-bold text-pink-700">M:</span> [If they say "I'm too busy"] "I understand
                    you're busy, and I still need this support right now."
                  </p>
                  <p>
                    <span className="font-bold text-teal-700">A:</span> [Maintain eye contact, speak calmly and clearly]
                  </p>
                  <p>
                    <span className="font-bold text-indigo-700">N:</span> "If managing everything is too much, could we
                    start with just the savings account?"
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-primary/10 border border-primary/20 rounded-lg p-5">
              <h4 className="font-semibold text-foreground mb-3">💡 Remember</h4>
              <p className="text-sm text-foreground/90 mb-2">
                DEAR MAN doesn't guarantee you'll get what you want—but it dramatically increases your chances by
                helping you communicate clearly and respectfully.
              </p>
              <p className="text-sm text-foreground/90">
                In recovery, asking for help isn't weakness—it's wisdom. DEAR MAN gives you the tools to ask
                effectively.
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-5 space-y-4">
              <h4 className="font-semibold text-foreground">Practice Exercise</h4>
              <p className="text-sm text-foreground/80 mb-4">
                Think of something you need help with in your recovery. Write out a DEAR MAN script:
              </p>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="describe">D - Describe:</Label>
                  <Textarea
                    id="describe"
                    value={describe}
                    onChange={(e) => {
                      setDescribe(e.target.value)
                      if (errors.describe) setErrors({ ...errors, describe: false })
                    }}
                    placeholder="Describe the facts of the situation..."
                    className={errors.describe ? "border-red-500 border-2" : ""}
                  />
                  {errors.describe && <p className="text-sm text-red-500 mt-1">This field is required</p>}
                </div>

                <div>
                  <Label htmlFor="express">E - Express:</Label>
                  <Textarea
                    id="express"
                    value={express}
                    onChange={(e) => {
                      setExpress(e.target.value)
                      if (errors.express) setErrors({ ...errors, express: false })
                    }}
                    placeholder="Express your feelings using 'I' statements..."
                    className={errors.express ? "border-red-500 border-2" : ""}
                  />
                  {errors.express && <p className="text-sm text-red-500 mt-1">This field is required</p>}
                </div>

                <div>
                  <Label htmlFor="assert">A - Assert:</Label>
                  <Textarea
                    id="assert"
                    value={assert}
                    onChange={(e) => {
                      setAssert(e.target.value)
                      if (errors.assert) setErrors({ ...errors, assert: false })
                    }}
                    placeholder="Ask clearly for what you need..."
                    className={errors.assert ? "border-red-500 border-2" : ""}
                  />
                  {errors.assert && <p className="text-sm text-red-500 mt-1">This field is required</p>}
                </div>

                <div>
                  <Label htmlFor="reinforce">R - Reinforce:</Label>
                  <Textarea
                    id="reinforce"
                    value={reinforce}
                    onChange={(e) => {
                      setReinforce(e.target.value)
                      if (errors.reinforce) setErrors({ ...errors, reinforce: false })
                    }}
                    placeholder="Explain the positive effects..."
                    className={errors.reinforce ? "border-red-500 border-2" : ""}
                  />
                  {errors.reinforce && <p className="text-sm text-red-500 mt-1">This field is required</p>}
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
                moduleSlug="dear-man"
                moduleName="DEAR MAN Communication"
                keyLearning="How to communicate effectively using DEAR MAN framework to ask for what you need while maintaining relationships"
                nextModule={{
                  name: "Reality Acceptance",
                  slug: "reality-acceptance",
                }}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
