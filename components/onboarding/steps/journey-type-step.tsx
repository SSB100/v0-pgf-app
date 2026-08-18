"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Wine, Pill, Gamepad2, Brain, Sparkles, Dice1 as Dice } from "lucide-react"
import type { OnboardingData } from "../onboarding-flow"
import { StepButtonFooter } from "./step-button-footer"

interface JourneyTypeStepProps {
  data: OnboardingData
  updateData: (data: Partial<OnboardingData>) => void
  onNext: () => void
  onBack: () => void
}

const JOURNEY_TYPES = [
  { id: "gambling", label: "Gambling", description: "Gambling, betting, casinos, pokies or related spending and urges", icon: Dice, color: "text-orange-600", bgColor: "bg-orange-500/20" },
  { id: "alcohol", label: "Alcohol", description: "Understanding or changing your alcohol use in a way that fits your goals", icon: Wine, color: "text-red-600", bgColor: "bg-red-500/20" },
  { id: "substances", label: "Substance Use", description: "Understanding or changing use of drugs or other substances", icon: Pill, color: "text-purple-600", bgColor: "bg-purple-500/20" },
  { id: "gaming", label: "Gaming or Internet", description: "Gaming, online activity or digital spending that you want to understand or change", icon: Gamepad2, color: "text-blue-600", bgColor: "bg-blue-500/20" },
  { id: "mental_health", label: "Mental Wellbeing", description: "Stress, mood, anxiety, attention, trauma-related concerns or other areas of mental wellbeing", icon: Brain, color: "text-teal-600", bgColor: "bg-teal-500/20" },
  { id: "personal_growth", label: "Personal Growth", description: "Values, habits, relationships, confidence or other areas you want to work on", icon: Sparkles, color: "text-green-600", bgColor: "bg-green-500/20" },
]

export default function JourneyTypeStep({ data, updateData, onNext, onBack }: JourneyTypeStepProps) {
  const [selectedTypes, setSelectedTypes] = useState<string[]>(data.journeyTypes || [])

  function toggleType(typeId: string) {
    setSelectedTypes((prev) => (prev.includes(typeId) ? prev.filter((t) => t !== typeId) : [...prev, typeId]))
  }

  function handleNext() {
    updateData({ journeyTypes: selectedTypes })
    onNext()
  }

  const canContinue = selectedTypes.length > 0

  return (
    <Card className="soft-shadow-lg border-border/50">
      <CardHeader>
        <CardTitle className="text-2xl text-foreground">What Would You Like to Focus On?</CardTitle>
        <p className="text-muted-foreground text-pretty">
          Select the areas that feel relevant to you. You can choose more than one. These choices personalise parts of Waypoint; they do not diagnose a condition or define what your goals should be.
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {JOURNEY_TYPES.map((type) => {
            const Icon = type.icon
            const isSelected = selectedTypes.includes(type.id)
            return (
              <button key={type.id} type="button" onClick={() => toggleType(type.id)} className={`px-3 py-2.5 rounded-xl border-2 text-left transition-all ${isSelected ? "border-primary bg-primary/10 shadow-md" : "border-border bg-card hover:border-primary/50 hover:bg-secondary/50"}`}>
                <div className="flex items-center gap-2.5">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full ${type.bgColor} flex items-center justify-center`}><Icon className={`w-4 h-4 ${type.color}`} /></div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold text-sm ${isSelected ? "text-primary" : "text-foreground"}`}>{type.label}</p>
                    <p className="text-xs text-muted-foreground leading-snug">{type.description}</p>
                  </div>
                  {isSelected && (
                    <div className="flex-shrink-0 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </div>
                  )}
                </div>
              </button>
            )
          })}
        </div>

        <div className="bg-info/10 border border-info/20 rounded-lg p-3">
          <p className="text-sm text-foreground text-pretty">
            Your selections are stored with your Waypoint account and used to tailor relevant questions and content. Privacy and data-handling information should be read alongside Waypoint's Terms and future Privacy Policy.
          </p>
        </div>

        {selectedTypes.length > 0 && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
            <p className="text-sm text-green-700 text-pretty">
              Waypoint will use these selections to decide which onboarding questions and journey information to show you.
            </p>
          </div>
        )}

        <div className="flex gap-3 pt-2"><StepButtonFooter onBack={onBack} onNext={handleNext} disabled={!canContinue} /></div>
      </CardContent>
    </Card>
  )
}
