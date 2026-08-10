"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { getAddictionTerms } from "@/lib/journey-personalization"

export default function StopSkillClient({ journeyTypes }: { journeyTypes: string[] }) {
  const { addictionTerm, verb } = getAddictionTerms(journeyTypes)

  // Declare variables
  const [scenario, setScenario] = useState("")
  const [errors, setErrors] = useState({ scenario: false })

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
              <p className="text-xs font-semibold text-primary uppercase tracking-wide">Module 7 of 11</p>
              <CardTitle className="text-xl font-bold text-foreground">STOP Skill</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-primary/10 p-4 rounded-lg">
            <p className="text-lg leading-relaxed">
              STOP is your emergency brake. When urges to {verb} hit hard, this four-step skill creates the pause you
              need to make a values-based choice.
            </p>
          </div>

          <div>
            <label className="text-sm font-semibold block mb-2">Describe your scenario (recent or hypothetical):</label>
            <Textarea
              placeholder={`Example: Got a notification/trigger while feeling stressed, saw ${addictionTerm} cues...`}
              value={scenario}
              onChange={(e) => {
                setScenario(e.target.value)
                if (errors.scenario) setErrors({ ...errors, scenario: false })
              }}
              className={errors.scenario ? "border-red-500 border-2" : ""}
              rows={3}
            />
            {errors.scenario && <p className="text-sm text-red-600 mt-1">This field is required</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
