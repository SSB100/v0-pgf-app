"use client"

import DashboardHeader from "@/components/dashboard/dashboard-header"
import MobileNav from "@/components/dashboard/mobile-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { getAddictionTerms, getRelevantExamples } from "@/lib/journey-personalization"

export default function DistressToleranceClient({ journeyTypes }: { journeyTypes: string[] }) {
  const { addictionTerm, verb } = getAddictionTerms(journeyTypes)
  const examples = getRelevantExamples(journeyTypes, "distress")
  const [lowIntensity, setLowIntensity] = useState("")

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-6">
      <DashboardHeader userName="there" userEmail="" />

      <main className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-6">
        <Card className="border-2 border-primary/30">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Distress Tolerance</CardTitle>
            <p className="text-muted-foreground">Self-guided journey module</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-primary/10 p-4 rounded-lg space-y-2">
              <p className="text-base leading-relaxed">
                Distress tolerance is a DBT-informed idea about getting through difficult emotions, urges or situations when the problem cannot be solved immediately.
              </p>
              <p className="text-xs text-muted-foreground">
                It does not mean you should ignore danger, tolerate abuse or avoid getting professional help. If a situation is unsafe, getting to safety comes first.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Why practise it?</h3>
              <p className="leading-relaxed">
                Urges and emotions can change in intensity over time, but there is no fixed timetable that applies to everyone. A distress-tolerance skill can give you something concrete to do while you decide what response fits your goals and circumstances.
              </p>
              <p className="leading-relaxed">
                If {addictionTerm || "a familiar behaviour"} has sometimes been one way you respond to discomfort, this module invites you to experiment with other options as well. It does not assume that every difficult feeling has the same cause or solution.
              </p>
            </div>

            <div className="bg-card p-4 rounded-lg border space-y-2">
              <p className="font-semibold text-sm">Plan one option you could try when an urge starts to build:</p>
              <Textarea
                placeholder={`For example: pause, change rooms, contact someone, go for a walk, or use another skill. Cues you have recorded may include: ${examples.distress.slice(0, 2).join(", ") || "a stressful situation"}.`}
                value={lowIntensity}
                onChange={(event) => setLowIntensity(event.target.value)}
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                This reflection is optional. You can use a hypothetical example if writing about a recent situation feels uncomfortable.
              </p>
            </div>

            <Card className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/20">
              <CardContent className="p-6 space-y-2">
                <h4 className="font-semibold text-green-900 dark:text-green-100">Key idea</h4>
                <p className="text-green-800 dark:text-green-200">
                  Distress tolerance is not about proving that you are stronger than an urge or making a feeling disappear. It is about having more than one option available while a difficult moment is happening.
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
