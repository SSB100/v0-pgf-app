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
  "Depression or low mood",
  "Stress",
  "Trauma or PTSD",
  "Bipolar-related concerns",
  "OCD-related concerns",
  "ADHD or attention",
  "Eating concerns",
  "Grief or loss",
  "Anger",
  "Self-esteem",
  "Other",
]

const SYMPTOM_FREQUENCY = ["Daily", "Several times a week", "Weekly", "Occasionally", "Rarely"]

const COPING_METHODS = [
  "Talking to friends or whānau",
  "Exercise or movement",
  "Meditation or mindfulness",
  "Therapy or counselling",
  "Medication prescribed to me",
  "Journaling",
  "Creative activities",
  "Nature or outdoors",
  "None currently",
]

const SUPPORT_NEEDS = [
  "More coping strategies",
  "Emotional regulation skills",
  "Understanding my patterns",
  "Building helpful routines",
  "Working with difficult thoughts",
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
        <CardTitle className="text-2xl text-foreground">Understanding Your Mental Wellbeing</CardTitle>
        <p className="text-muted-foreground text-pretty">
          Choose the areas that feel relevant to you so Waypoint can personalise your experience. Selecting an area does not diagnose a condition, and you do not need a diagnosis to choose it.
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="text-lg font-semibold text-foreground">What areas would you like support with? (select all that apply)</Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
            {MENTAL_HEALTH_AREAS.map((area) => (
              <button key={area} type="button" onClick={() => toggleArea(area)} className={`px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all ${mentalHealthAreas.includes(area) ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-foreground hover:border-primary/50"}`}>
                {area}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-lg font-semibold text-foreground">How often do these concerns affect your day-to-day life?</Label>
          <div className="space-y-1.5">
            {SYMPTOM_FREQUENCY.map((option) => (
              <button key={option} type="button" onClick={() => setSymptomFrequency(option)} className={`w-full px-3 py-2 rounded-lg border-2 text-left text-sm font-medium transition-all ${symptomFrequency === option ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-foreground hover:border-primary/50"}`}>
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-lg font-semibold text-foreground">Are you currently receiving professional mental health support?</Label>
          <div className="space-y-1.5">
            {[{ value: "yes", label: "Yes, I'm working with a professional" }, { value: "no", label: "Not currently" }, { value: "seeking", label: "I'm looking for professional support" }, { value: "prefer-not-to-say", label: "Prefer not to say" }].map((option) => (
              <button key={option.value} type="button" onClick={() => setReceivingTreatment(option.value)} className={`w-full px-3 py-2 rounded-lg border-2 text-left text-sm font-medium transition-all ${receivingTreatment === option.value ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-foreground hover:border-primary/50"}`}>
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-lg font-semibold text-foreground">What do you currently use to support your wellbeing? <span className="text-xs text-muted-foreground">(Optional)</span></Label>
          <div className="grid grid-cols-2 gap-1.5">
            {COPING_METHODS.map((method) => (
              <button key={method} type="button" onClick={() => toggleCoping(method)} className={`px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all ${currentCoping.includes(method) ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-foreground hover:border-primary/50"}`}>
                {method}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-lg font-semibold text-foreground">What would you most like help with? (select all that apply)</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {SUPPORT_NEEDS.map((need) => (
              <button key={need} type="button" onClick={() => toggleSupportNeed(need)} className={`px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all ${supportNeeds.includes(need) ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-foreground hover:border-primary/50"}`}>
                {need}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-info/10 border border-info/20 rounded-lg p-3">
          <p className="text-sm text-foreground text-pretty">
            Waypoint can provide self-guided reflection and skills practice alongside professional care. It does not diagnose mental health conditions or replace treatment from a qualified professional.
          </p>
        </div>

        <div className="flex gap-3 pt-2">
          <StepButtonFooter onBack={onBack} onNext={handleNext} disabled={!canContinue} />
        </div>
      </CardContent>
    </Card>
  )
}
