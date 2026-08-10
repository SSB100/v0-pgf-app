"use client"

import { CardContent } from "@/components/ui/card"

import { CardTitle } from "@/components/ui/card"

import { CardHeader } from "@/components/ui/card"

import { Card } from "@/components/ui/card"

import { useState } from "react"
import { Target } from "lucide-react" // Import Target component

interface Props {
  journeyTypes: string[]
  problemAreas: any[]
}

export default function RecognizingTriggersClient({ journeyTypes, problemAreas }: Props) {
  const [triggerChain, setTriggerChain] = useState({
    trigger: "",
    feeling: "",
    thoughts: "",
    location: "",
    nextTime: "",
  })
  const [isCompleting, setIsCompleting] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const [errors, setErrors] = useState<Record<string, boolean>>({})

  const behaviorTerm = journeyTypes.includes("gambling")
    ? "gamble"
    : journeyTypes.includes("alcohol")
      ? "drink"
      : journeyTypes.includes("substances")
        ? "use"
        : journeyTypes.includes("gaming")
          ? "game excessively"
          : "engage in unwanted behavior"

  const behaviorNoun = journeyTypes.includes("gambling")
    ? "gambling"
    : journeyTypes.includes("alcohol")
      ? "drinking"
      : journeyTypes.includes("substances")
        ? "substance use"
        : journeyTypes.includes("gaming")
          ? "gaming"
          : "this behavior"

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-6 h-6 text-primary" />
              What Are Triggers?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm">
              A <span className="font-semibold text-primary">trigger</span> is anything that increases your urge to{" "}
              {behaviorTerm}. It could be a feeling, a place, a person, a thought, or even a time of day.
            </p>
            <p className="text-sm">
              Understanding your personal triggers is one of the most important parts of recovery. When you know what
              sets off your urges, you can prepare yourself and use skills before the urge gets too strong.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 space-y-6">
            <h3 className="text-xl font-bold text-foreground">The 5 Types of Triggers</h3>

            <div className="space-y-3">
              {/* Emotional Triggers */}
              <div className="bg-gradient-to-r from-red-500/10 to-red-600/10 border-l-4 border-red-500 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">😰</span>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-bold text-foreground">1. Emotional Triggers</h4>
                    <p className="text-sm text-foreground/80">
                      Certain feelings make you want to {behaviorTerm} to escape, numb, or feel different.
                    </p>
                    <div className="bg-card rounded p-3 text-sm">
                      <p className="font-semibold mb-1">Common examples:</p>
                      <ul className="space-y-1 pl-4 text-foreground/70">
                        <li>• Stress, anxiety, or overwhelm</li>
                        <li>• Loneliness or boredom</li>
                        <li>• Sadness or depression</li>
                        <li>• Anger or frustration</li>
                        <li>• Even positive emotions like excitement or celebration</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Environmental Triggers - personalized */}
              <div className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 border-l-4 border-blue-500 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">📍</span>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-bold text-foreground">2. Environmental Triggers</h4>
                    <p className="text-sm text-foreground/80">
                      Specific places or situations that you associate with {behaviorNoun}.
                    </p>
                    <div className="bg-card rounded p-3 text-sm">
                      <p className="font-semibold mb-1">Common examples:</p>
                      <ul className="space-y-1 pl-4 text-foreground/70">
                        {journeyTypes.includes("gambling") && (
                          <>
                            <li>• Passing by a casino or TAB</li>
                            <li>• Payday or having money in your account</li>
                            <li>• Seeing gambling ads or sports on TV</li>
                          </>
                        )}
                        {journeyTypes.includes("alcohol") && (
                          <>
                            <li>• Passing by a bottle shop or pub</li>
                            <li>• Social events where alcohol is present</li>
                            <li>• Seeing alcohol ads or drinks on TV</li>
                          </>
                        )}
                        {journeyTypes.includes("substances") && (
                          <>
                            <li>• Places where you used to use</li>
                            <li>• Being around people who use</li>
                            <li>• Having cash on hand</li>
                          </>
                        )}
                        {journeyTypes.includes("gaming") && (
                          <>
                            <li>• Seeing your gaming setup</li>
                            <li>• Gaming ads or streamers</li>
                            <li>• Being home alone with free time</li>
                          </>
                        )}
                        <li>• Being alone at home with access to your phone/computer</li>
                        <li>• Certain streets, areas, or times of day</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Triggers - personalized */}
              <div className="bg-gradient-to-r from-purple-500/10 to-purple-600/10 border-l-4 border-purple-500 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">👥</span>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-bold text-foreground">3. Social Triggers</h4>
                    <p className="text-sm text-foreground/80">
                      Certain people or social situations that make urges stronger.
                    </p>
                    <div className="bg-card rounded p-3 text-sm">
                      <p className="font-semibold mb-1">Common examples:</p>
                      <ul className="space-y-1 pl-4 text-foreground/70">
                        {journeyTypes.includes("gambling") && (
                          <>
                            <li>• Friends who gamble or talk about gambling</li>
                            <li>• Social events where others are gambling</li>
                            <li>• Peer pressure to 'just have a punt'</li>
                          </>
                        )}
                        {journeyTypes.includes("alcohol") && (
                          <>
                            <li>• Friends who drink or party</li>
                            <li>• Social events centered around drinking</li>
                            <li>• Peer pressure to 'just have one'</li>
                          </>
                        )}
                        {journeyTypes.includes("substances") && (
                          <>
                            <li>• Friends who use or talk about using</li>
                            <li>• People connected to your past use</li>
                            <li>• Being offered substances</li>
                          </>
                        )}
                        <li>• Arguments or conflict with loved ones</li>
                        <li>• Feeling judged or criticized</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Thought Triggers - personalized */}
              <div className="bg-gradient-to-r from-green-500/10 to-green-600/10 border-l-4 border-green-500 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">💭</span>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-bold text-foreground">4. Thought Triggers</h4>
                    <p className="text-sm text-foreground/80">Specific thoughts or beliefs that lead to urges.</p>
                    <div className="bg-card rounded p-3 text-sm">
                      <p className="font-semibold mb-1">Common examples:</p>
                      <ul className="space-y-1 pl-4 text-foreground/70">
                        {journeyTypes.includes("gambling") && (
                          <>
                            <li>• 'I could win back what I lost'</li>
                            <li>• 'I'm feeling lucky today'</li>
                          </>
                        )}
                        {(journeyTypes.includes("alcohol") || journeyTypes.includes("substances")) && (
                          <>
                            <li>• 'I can handle just one'</li>
                            <li>• 'I'll quit tomorrow'</li>
                          </>
                        )}
                        <li>• 'Just one more time won't hurt'</li>
                        <li>• 'I deserve to treat myself'</li>
                        <li>• 'This time will be different'</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Time-Based Triggers */}
              <div className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 border-l-4 border-orange-500 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">🕐</span>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-bold text-foreground">5. Time-Based Triggers</h4>
                    <p className="text-sm text-foreground/80">Certain times or patterns that increase your risk.</p>
                    <div className="bg-card rounded p-3 text-sm">
                      <p className="font-semibold mb-1">Common examples:</p>
                      <ul className="space-y-1 pl-4 text-foreground/70">
                        <li>• Late at night when you can't sleep</li>
                        <li>• Weekends or days off with unstructured time</li>
                        <li>• After work before going home</li>
                        {journeyTypes.includes("gambling") && <li>• During sporting events or race days</li>}
                        {journeyTypes.includes("alcohol") && <li>• Friday nights or social occasions</li>}
                        <li>• Anniversaries or difficult dates</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-primary">
          <CardContent className="pt-6 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-foreground mb-4">Your Trigger Chain</h3>
              <p className="text-sm text-foreground/80 mb-6">
                Think about a recent time when you felt a strong urge to {behaviorTerm}. Work through this trigger chain
                to understand what led up to that moment.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-foreground block mb-2">
                    What happened right before the urge? (The Trigger)
                  </label>
                  <input
                    type="text"
                    value={triggerChain.trigger}
                    onChange={(e) => {
                      setTriggerChain({ ...triggerChain, trigger: e.target.value })
                      if (errors.trigger) setErrors({ ...errors, trigger: false })
                    }}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                      errors.trigger ? "border-red-500 border-2" : "border-gray-300"
                    }`}
                    placeholder={
                      journeyTypes.includes("gambling")
                        ? "Example: Got paid, saw a gambling ad, had an argument"
                        : journeyTypes.includes("alcohol")
                          ? "Example: Saw friends drinking, got stressed at work, drove past a pub"
                          : journeyTypes.includes("substances")
                            ? "Example: Ran into old friends, got cash, felt overwhelmed"
                            : "Example: Had a stressful day, felt lonely, saw a triggering situation"
                    }
                  />
                  {errors.trigger && <p className="text-sm text-red-600 mt-1">This field is required</p>}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
