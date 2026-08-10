"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"
import { getAddictionTerms, getRelevantExamples } from "@/lib/journey-personalization"

export default function ChoicePointsClient({ journeyTypes }: { journeyTypes: string[] }) {
  const { addictionTerm, verb } = getAddictionTerms(journeyTypes)
  const examples = getRelevantExamples(journeyTypes, "triggers")

  // Declare the variables and their setters
  const [choicePointExercise, setChoicePointExercise] = useState({ trigger: "" })
  const [errors, setErrors] = useState({ trigger: false })

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-6">
      <Card className="border-2 border-primary/30">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">🛤️ Your Choice Points</CardTitle>
          <p className="text-muted-foreground">Module 4 of 11</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-primary/10 p-4 rounded-lg">
            <p className="text-lg leading-relaxed">
              A <strong>choice point</strong> is a moment where you can pause and decide: Do I follow my urge to {verb},
              or do I choose an action that aligns with my values?
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">What is a Choice Point?</h3>
            <p className="leading-relaxed">
              Every day, you face moments where you feel an urge to {verb}. These are not failures—they're
              opportunities. A choice point is the space between feeling the urge and taking action. In that space, you
              have the power to choose.
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              1. What was the trigger? (What happened just before the urge?)
            </label>
            <input
              type="text"
              value={choicePointExercise.trigger}
              onChange={(e) => {
                setChoicePointExercise({ ...choicePointExercise, trigger: e.target.value })
                if (errors.trigger) setErrors({ ...errors, trigger: false })
              }}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                errors.trigger ? "border-red-500 border-2" : "border-gray-300"
              }`}
              placeholder={`Examples: ${examples.triggers.slice(0, 3).join(", ")}`}
            />
            {errors.trigger && <p className="text-sm text-red-600 mt-1">This field is required</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
