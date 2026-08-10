"use client"

import DashboardHeader from "@/components/dashboard/dashboard-header"
import MobileNav from "@/components/dashboard/mobile-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { getAddictionTerms, getRelevantExamples } from "@/lib/journey-personalization"

export default function DistressToleranceClient({ journeyTypes }: { journeyTypes: string[] }) {
  const { addictionTerm, verb, verbIng } = getAddictionTerms(journeyTypes)
  const examples = getRelevantExamples(journeyTypes, "distress")

  const [isCompleting, setIsCompleting] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const [lowIntensity, setLowIntensity] = useState("")
  const [highIntensity, setHighIntensity] = useState("")
  const [fadingUrge, setFadingUrge] = useState("")
  const [errors, setErrors] = useState<Record<string, boolean>>({})

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-6">
      <DashboardHeader userName="there" userEmail="" />

      <main className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-6">
        <Card className="border-2 border-primary/30">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">💪 Distress Tolerance</CardTitle>
            <p className="text-muted-foreground">Module 8 of 11</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-primary/10 p-4 rounded-lg">
              <p className="text-lg leading-relaxed">
                Distress tolerance is your ability to sit with uncomfortable feelings—like urges, cravings, anxiety, or
                boredom—without trying to escape them through {addictionTerm}.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Why Distress Tolerance Matters</h3>
              <p className="leading-relaxed">
                Here's the truth: urges to {verb} are uncomfortable, but they're not dangerous. They feel intense, but
                they won't last forever. Most urges peak within 15-20 minutes and then start to fade—if you don't act on
                them.
              </p>
              <p className="leading-relaxed">
                The problem is, our brains want to escape discomfort immediately.{" "}
                {addictionTerm.charAt(0).toUpperCase() + addictionTerm.slice(1)} has been your escape route. Distress
                tolerance teaches you to ride out the discomfort instead of running from it.
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg border">
              <p className="font-semibold text-sm mb-2">When the urge is building (low-medium intensity):</p>
              <Textarea
                placeholder={`Example: I'll go for a walk while listening to my favorite podcast (distraction + self-soothe). Common triggers: ${examples.distress.slice(0, 2).join(", ")}`}
                value={lowIntensity}
                onChange={(e) => {
                  setLowIntensity(e.target.value)
                  if (errors.lowIntensity) setErrors({ ...errors, lowIntensity: false })
                }}
                className={errors.lowIntensity ? "border-red-500 border-2" : ""}
                rows={3}
              />
              {errors.lowIntensity && <p className="text-sm text-red-600 mt-1">This field is required</p>}
            </div>

            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-6">
                <h4 className="font-semibold text-green-900 mb-2">Key Takeaway</h4>
                <p className="text-green-800">
                  Distress tolerance isn't about eliminating urges—it's about surviving them without making things
                  worse. Every time you ride out an urge to {verb} without acting on it, you're rewiring your brain and
                  proving to yourself that you're stronger than the urge.
                </p>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </main>

      <MobileNav />
    </div>
  )
}
