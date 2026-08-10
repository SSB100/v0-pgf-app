"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import type { OnboardingData } from "../onboarding-flow"
import { StepButtonFooter } from "./step-button-footer"

interface MentalHealthStepProps {
  data: OnboardingData
  updateData: (data: Partial<OnboardingData>) => void
  onNext: () => void
  onBack: () => void
}

const MENTAL_HEALTH_AREAS = [
  "Anxiety",
  "Depression",
  "Stress",
  "PTSD/Trauma",
  "Bipolar",
  "OCD",
  "ADHD",
  "Eating concerns",
  "Grief/Loss",
  "Anger management",
  "Self-esteem",
  "Other",
]

const SYMPTOM_FREQUENCY = ["Daily", "Several times a week", "Weekly", "Occasionally", "Rarely"]

const COPING_METHODS = [
  "Talking to friends/family",
  "Exercise",
  "Meditation/mindfulness",
  "Therapy/counseling",
  "Medication",
  "Journaling",
  "Creative activities",
  "Nature/outdoors",
  "None currently",
]

const SUPPORT_NEEDS = [
  "Better coping strategies",
  "Emotional regulation skills",
  "Understanding my patterns",
  "Building healthy habits",
  "Reducing negative thoughts",
  "Improving relationships",
  "Managing stress",
  "Building self-compassion",
]

export default function MentalHealthStep({ data, updateData, onNext, onBack }: MentalHealthStepProps) {
  const [mentalHealthAreas, setMentalHealthAreas] = useState<string[]>(data.mentalHealthAreas || [])
  const [symptomFrequency, setSymptomFrequency] = useState(data.mentalHealthFrequency || "")
  const [currentCoping, setCurrentCoping] = useState<string[]>(data.currentCopingMethods || [])
  const [supportNeeds, setSupportNeeds] = useState<string[]>(data.mentalHealthSupportNeeds || [])
  const [receivingTreatment, setReceivingTreatment] = useState(data.receivingMentalHealthTreatment || "")

  function toggleArea(area: string) {
    setMentalHealthAreas((prev) => (prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]))
  }

  function toggleCoping(method: string) {
    setCurrentCoping((prev) => (prev.includes(method) ? prev.filter((m) => m !== method) : [...prev, method]))
  }

  function toggleSupportNeed(need: string) {
    setSupportNeeds((prev) => (prev.includes(need) ? prev.filter((n) => n !== need) : [...prev, need]))
  }

  function handleNext() {
    updateData({
      mentalHealthAreas,
      mentalHealthFrequency: symptomFrequency,
      currentCopingMethods: currentCoping,
      mentalHealthSupportNeeds: supportNeeds,
      receivingMentalHealthTreatment: receivingTreatment,
    })
    onNext()
  }

  const canContinue = mentalHealthAreas.length > 0 && symptomFrequency && supportNeeds.length > 0

  return (
    <Card className="soft-shadow-lg border-border/50">
      <CardHeader>
        <CardTitle className="text-2xl text-foreground">Understanding Your Mental Health</CardTitle>
        <p className="text-muted-foreground text-pretty">
          Help us understand what you're experiencing so we can provide personalized support.
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="text-lg font-semibold text-foreground">
            What areas would you like support with? (select all that apply)
          </Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
            {MENTAL_HEALTH_AREAS.map((area) => (
              <button
                key={area}
                type="button"
                onClick={() => toggleArea(area)}
                className={`px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                  mentalHealthAreas.includes(area)
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-foreground hover:border-primary/50"
                }`}
              >
                {area}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label             className="text-lg font-semibold text-foreground">
            How often do these challenges affect your daily life?
          </Label>
          <div className="space-y-1.5">
            {SYMPTOM_FREQUENCY.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setSymptomFrequency(option)}
                className={`w-full px-3 py-2 rounded-lg border-2 text-left text-sm font-medium transition-all ${
                  symptomFrequency === option
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-foreground hover:border-primary/50"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label             className="text-lg font-semibold text-foreground">
            Are you currently receiving professional mental health support?
          </Label>
          <div className="space-y-1.5">
            <button
              type="button"
              onClick={() => setReceivingTreatment("yes")}
              className={`w-full px-3 py-2 rounded-lg border-2 text-left text-sm font-medium transition-all ${
                receivingTreatment === "yes"
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-card text-foreground hover:border-primary/50"
              }`}
            >
              Yes, I'm working with a professional
            </button>
            <button
              type="button"
              onClick={() => setReceivingTreatment("no")}
              className={`w-full px-3 py-2 rounded-lg border-2 text-left text-sm font-medium transition-all ${
                receivingTreatment === "no"
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-card text-foreground hover:border-primary/50"
              }`}
            >
              Not currently
            </button>
            <button
              type="button"
              onClick={() => setReceivingTreatment("seeking")}
              className={`w-full px-3 py-2 rounded-lg border-2 text-left text-sm font-medium transition-all ${
                receivingTreatment === "seeking"
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-card text-foreground hover:border-primary/50"
              }`}
            >
              I'm looking for professional support
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <Label             className="text-lg font-semibold text-foreground">
            What coping methods do you currently use? <span className="text-xs text-muted-foreground">(Optional)</span>
          </Label>
          <div className="grid grid-cols-2 gap-1.5">
            {COPING_METHODS.map((method) => (
              <button
                key={method}
                type="button"
                onClick={() => toggleCoping(method)}
                className={`px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                  currentCoping.includes(method)
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-foreground hover:border-primary/50"
                }`}
              >
                {method}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label             className="text-lg font-semibold text-foreground">
            What kind of support would help you most? (select all that apply)
          </Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {SUPPORT_NEEDS.map((need) => (
              <button
                key={need}
                type="button"
                onClick={() => toggleSupportNeed(need)}
                className={`px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                  supportNeeds.includes(need)
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-foreground hover:border-primary/50"
                }`}
              >
                {need}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-info/10 border border-info/20 rounded-lg p-3">
          <p className="text-sm text-foreground text-pretty">
            Mental health is just as important as physical health. The skills you'll learn here complement professional
            treatment and help build lasting resilience.
          </p>
        </div>

        <div className="flex gap-3 pt-2">
          <StepButtonFooter onBack={onBack} onNext={handleNext} disabled={!canContinue} />
        </div>
      </CardContent>
    </Card>
  )
}
