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
    <Card className="gap-4 border-border/50 py-4 soft-shadow-lg sm:gap-6 sm:py-6">
      <CardHeader className="gap-1.5 px-4 sm:gap-2 sm:px-6">
        <CardTitle className="text-xl text-foreground sm:text-2xl">What would you like to focus on?</CardTitle>
        <p className="text-xs leading-relaxed text-muted-foreground text-pretty sm:text-sm">
          Choose one or more areas that feel relevant. These choices personalise Waypoint; they do not diagnose you or decide what your goals should be.
        </p>
      </CardHeader>

      <CardContent className="space-y-3 px-4 sm:space-y-4 sm:px-6">
        <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 sm:gap-2">
          {JOURNEY_TYPES.map((type) => {
            const Icon = type.icon
            const isSelected = selectedTypes.includes(type.id)
            return (
              <button
                key={type.id}
                type="button"
                onClick={() => toggleType(type.id)}
                className={`rounded-xl border-2 px-3 py-2 text-left transition-all sm:py-2.5 ${
                  isSelected ? "border-primary bg-primary/10 shadow-sm" : "border-border bg-card hover:border-primary/50 hover:bg-secondary/50"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`flex size-8 flex-shrink-0 items-center justify-center rounded-full ${type.bgColor}`}><Icon className={`size-4 ${type.color}`} /></div>
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm font-semibold ${isSelected ? "text-primary" : "text-foreground"}`}>{type.label}</p>
                    <p className="line-clamp-2 text-[11px] leading-snug text-muted-foreground sm:text-xs">{type.description}</p>
                  </div>
                  {isSelected && (
                    <div className="flex size-4 flex-shrink-0 items-center justify-center rounded-full bg-primary">
                      <svg className="size-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </div>
                  )}
                </div>
              </button>
            )
          })}
        </div>

        <div className="rounded-lg border border-info/20 bg-info/10 p-2.5 sm:p-3">
          <p className="text-[11px] leading-relaxed text-foreground text-pretty sm:text-sm">
            Your selections are saved to your Waypoint account and used to tailor relevant questions and content. Privacy and data-handling information remains available in Waypoint&apos;s privacy information.
          </p>
        </div>

        <StepButtonFooter onBack={onBack} onNext={handleNext} disabled={!canContinue} />
      </CardContent>
    </Card>
  )
}
