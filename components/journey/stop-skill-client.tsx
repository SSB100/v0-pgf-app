"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { getAddictionTerms } from "@/lib/journey-personalization"

export default function StopSkillClient({ journeyTypes }: { journeyTypes: string[] }) {
  const { addictionTerm, verb } = getAddictionTerms(journeyTypes)
  const [scenario, setScenario] = useState("")

  return (
    <div className="pb-24 lg:pb-6">
      <Card className="border border-border/60">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-lg bg-primary/15 border border-primary/25 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10h6v4H9z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold text-primary uppercase tracking-wide">Journey module</p>
              <CardTitle className="text-xl font-bold text-foreground">STOP Skill</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-primary/10 p-4 rounded-lg space-y-2">
            <p className="text-base leading-relaxed">
              STOP is a DBT-informed pause skill: Stop, Take a step back, Observe and Proceed mindfully. It can be used when an urge or emotion feels strong and you want a little more time before deciding what to do next.
            </p>
            <p className="text-xs text-muted-foreground">
              It does not guarantee that an urge will disappear, and it is not an emergency-response tool. If you are in immediate danger, use Waypoint's Support page or emergency services.
            </p>
          </div>

          <div>
            <label className="text-sm font-semibold block mb-2">Think of a recent or hypothetical situation where a pause might be useful:</label>
            <Textarea
              placeholder={`For example: I noticed an urge to ${verb || "act"} after a stressful moment or seeing ${addictionTerm || "a familiar"} cue...`}
              value={scenario}
              onChange={(event) => setScenario(event.target.value)}
              rows={3}
            />
            <p className="mt-2 text-xs text-muted-foreground">This reflection is optional. You can use a hypothetical example if you do not want to revisit a recent experience.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
