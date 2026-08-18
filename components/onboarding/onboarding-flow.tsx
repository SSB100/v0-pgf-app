"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Save } from "lucide-react"
import WelcomeStep from "./steps/welcome-step"
import JourneyTypeStep from "./steps/journey-type-step"
import ProblemsStep from "./steps/problems-step"
import AlcoholStep from "./steps/alcohol-step"
import SubstancesStep from "./steps/substances-step"
import MentalHealthStep from "./steps/mental-health-step"
import PersonalGrowthStep from "./steps/personal-growth-step"
import PhysicalHarmStep from "./steps/physical-harm-step"
import SubstanceUseStep from "./steps/substance-use-step"
import GamingStep from "./steps/gaming-step"
import AwarenessIntroStep from "./steps/awareness-intro-step"
import AwarenessStep from "./steps/awareness-step"
import ValuesIntroStep from "./steps/values-intro-step"
import ValuesSelectionStep from "./steps/values-selection-step"
import ValuesRankingStep from "./steps/values-ranking-step"
import ValuesSummaryStep from "./steps/values-summary-step"
import StrengthsStep from "./steps/strengths-step"
import DailyCheckInStep from "./steps/daily-checkin-step"
import AvatarSelectionStep from "./steps/avatar-selection-step"
import CompletionStep from "./steps/completion-step"

interface OnboardingFlowProps {
  userId: string
  userName: string
  initialStep?: number
  initialData?: OnboardingData
}

export type InitialDailyCheckIn = {
  dateKey?: string
  moodRating: number
  overallRating: number
  urgeStrength: number
  gamblingOccurred: boolean
  alcoholOccurred: boolean
  substanceOccurred: boolean
  selfHarmThoughts: boolean
  selfHarmActions: boolean
  usedSkills: boolean
  skillsUsed: string[]
  badThings: string
  goodThings: string
  emotionsFelt: string[]
  strongestEmotion: string
  emotionContext: string
}

export type OnboardingData = {
  journeyTypes?: string[]
  growthAvatar?: string

  // Awareness data
  currentEmotions?: string[]
  strongestEmotion?: string
  situationDescription?: string
  selfTalk?: string
  stillExperiencing?: boolean | null

  // Choice points
  recognizedChoicePoints?: string[]

  // Values and strengths
  selectedValues: Array<{
    name: string
    importance: number
    category: string
  }>
  initialValuesShortlist?: string[]
  secondRoundValues?: string[]
  perceivedStrengths?: string[]
  identifiedStrengths?: string[]

  // First daily check-in
  initialDailyCheckIn?: InitialDailyCheckIn

  // Gambling-specific
  gamblingFrequency?: string
  lastBetDate?: string
  gamblingForms?: string[]
  mostUsedGamblingForms?: string[]
  illegalGambling?: string
  gamblingTriggers: string[]
  impactAreas: string[]
  seekingHelp?: string

  // Alcohol-specific
  alcoholFrequency?: string
  lastDrinkDate?: string
  drinkingTypes?: string[]
  alcoholTriggers?: string[]
  alcoholImpactAreas?: string[]

  // Substance-specific
  substanceFrequency?: string
  lastSubstanceDate?: string
  substanceTypes?: string[]
  substanceTriggers?: string[]
  substanceImpactAreas?: string[]

  // Gaming / internet
  playsVideoGames?: boolean
  gamingFrequency?: string
  gamingImpact?: string
  lootBoxExposure?: string
  inGamePurchases?: string

  // Mental wellbeing
  mentalHealthAreas?: string[]
  mentalHealthFrequency?: string
  currentCopingMethods?: string[]
  mentalHealthSupportNeeds?: string[]
  receivingMentalHealthTreatment?: string

  // Personal growth
  growthGoals?: string[]
  growthMotivation?: string
  growthChallenges?: string[]

  // Physical harm / safety
  selfHarmThoughts?: string
  selfHarmActions?: string
  suicidalThoughts?: string

  // Substance use (legacy)
  alcoholUse?: string
  drugUse?: string
  substanceGamblingLink?: string
  substanceMentalHealthLink?: string
}

type StepType =
  | "welcome"
  | "journey_type"
  | "gambling"
  | "alcohol"
  | "substances"
  | "mental_health"
  | "personal_growth"
  | "gaming"
  | "physical_harm"
  | "substance_use"
  | "awareness_intro"
  | "awareness"
  | "values_intro"
  | "values_selection"
  | "values_ranking"
  | "values_summary"
  | "strengths"
  | "daily_checkin"
  | "avatar_selection"
  | "completion"

export default function OnboardingFlow({ userId, userName, initialStep = 1, initialData }: OnboardingFlowProps) {
  const router = useRouter()
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [data, setData] = useState<OnboardingData>(
    initialData || {
      journeyTypes: [],
      selectedValues: [],
      gamblingTriggers: [],
      impactAreas: [],
      recognizedChoicePoints: [],
    },
  )
  const [isSaving, setIsSaving] = useState(false)

  const stepList = useMemo(() => {
    const baseSteps: StepType[] = ["welcome", "journey_type"]
    const journeyTypes = data.journeyTypes || []

    if (journeyTypes.includes("gambling")) baseSteps.push("gambling")
    if (journeyTypes.includes("alcohol")) baseSteps.push("alcohol")
    if (journeyTypes.includes("substances")) baseSteps.push("substances")
    if (journeyTypes.includes("mental_health")) baseSteps.push("mental_health")
    if (journeyTypes.includes("personal_growth")) baseSteps.push("personal_growth")
    if (journeyTypes.includes("gaming") || journeyTypes.includes("gambling")) baseSteps.push("gaming")

    const hasAddiction = journeyTypes.some((type) => ["gambling", "alcohol", "substances", "gaming"].includes(type))
    if (hasAddiction || journeyTypes.includes("mental_health")) baseSteps.push("physical_harm")

    baseSteps.push(
      "awareness_intro",
      "awareness",
      "values_intro",
      "values_selection",
      "values_ranking",
      "values_summary",
      "strengths",
      "daily_checkin",
      "avatar_selection",
      "completion",
    )

    return baseSteps
  }, [data.journeyTypes])

  const totalSteps = stepList.length
  const currentStep = stepList[currentStepIndex]

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [currentStepIndex])

  useEffect(() => {
    if (initialStep > 1 && initialData) {
      const targetIndex = Math.min(initialStep - 1, stepList.length - 1)
      setCurrentStepIndex(targetIndex)
    }
  }, [initialStep, initialData, stepList.length])

  function updateData(newData: Partial<OnboardingData>) {
    setData((previous) => ({ ...previous, ...newData }))
  }

  async function saveProgress() {
    setIsSaving(true)
    try {
      const response = await fetch("/api/onboarding/save-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, currentStep: currentStepIndex + 1, data }),
      })

      if (response.ok) {
        alert("Your progress has been saved. You can return later to continue where you left off.")
        router.push("/auth/signin")
      } else {
        alert("Failed to save progress. Please try again.")
      }
    } catch (error) {
      console.error("[v0] Error saving progress:", error)
      alert("Failed to save progress. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  function nextStep() {
    if (currentStepIndex < totalSteps - 1) setCurrentStepIndex((previous) => previous + 1)
  }

  function prevStep() {
    if (currentStepIndex > 0) setCurrentStepIndex((previous) => previous - 1)
  }

  async function completeOnboarding() {
    try {
      setIsSaving(true)
      const response = await fetch("/api/onboarding/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, data }),
      })

      const responseData = await response.json()
      if (response.ok) {
        router.replace("/dashboard")
      } else {
        alert(`There was an error completing your onboarding: ${responseData.error || "Unknown error"}. ${responseData.details || ""}`)
        setIsSaving(false)
      }
    } catch (error) {
      console.error("[v0] Onboarding completion error:", error)
      alert(`There was an error completing your onboarding: ${error instanceof Error ? error.message : "Unknown error"}`)
      setIsSaving(false)
    }
  }

  function renderCurrentStep() {
    switch (currentStep) {
      case "welcome":
        return <WelcomeStep userName={userName} onNext={nextStep} />
      case "journey_type":
        return <JourneyTypeStep data={data} updateData={updateData} onNext={nextStep} onBack={prevStep} />
      case "gambling":
        return <ProblemsStep data={data} updateData={updateData} onNext={nextStep} onBack={prevStep} />
      case "alcohol":
        return <AlcoholStep data={data} updateData={updateData} onNext={nextStep} onBack={prevStep} />
      case "substances":
        return <SubstancesStep data={data} updateData={updateData} onNext={nextStep} onBack={prevStep} />
      case "mental_health":
        return <MentalHealthStep data={data} updateData={updateData} onNext={nextStep} onBack={prevStep} />
      case "personal_growth":
        return <PersonalGrowthStep data={data} updateData={updateData} onNext={nextStep} onBack={prevStep} />
      case "gaming":
        return <GamingStep data={data} updateData={updateData} onNext={nextStep} onBack={prevStep} />
      case "physical_harm":
        return <PhysicalHarmStep data={data} updateData={updateData} onNext={nextStep} onBack={prevStep} />
      case "substance_use":
        return <SubstanceUseStep data={data} updateData={updateData} onNext={nextStep} onBack={prevStep} />
      case "awareness_intro":
        return <AwarenessIntroStep onNext={nextStep} onBack={prevStep} />
      case "awareness":
        return <AwarenessStep data={data} updateData={updateData} onNext={nextStep} onBack={prevStep} />
      case "values_intro":
        return <ValuesIntroStep onNext={nextStep} onBack={prevStep} />
      case "values_selection":
        return <ValuesSelectionStep data={data} updateData={updateData} onNext={nextStep} onBack={prevStep} />
      case "values_ranking":
        return <ValuesRankingStep data={data} updateData={updateData} onNext={nextStep} onBack={prevStep} />
      case "values_summary":
        return <ValuesSummaryStep data={data} onNext={nextStep} onBack={prevStep} />
      case "strengths":
        return <StrengthsStep data={data} updateData={updateData} onNext={nextStep} onBack={prevStep} />
      case "daily_checkin":
        return <DailyCheckInStep data={data} updateData={updateData} onNext={nextStep} onBack={prevStep} />
      case "avatar_selection":
        return <AvatarSelectionStep data={data} updateData={updateData} onNext={nextStep} onBack={prevStep} />
      case "completion":
        return <CompletionStep data={data} onComplete={completeOnboarding} onBack={prevStep} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary via-background to-muted">
      {currentStep !== "completion" && (
        <div className="sticky top-[73px] z-40 bg-card/80 backdrop-blur-sm border-b border-border">
          <div className="max-w-2xl mx-auto px-4 py-2 flex justify-end">
            <Button variant="ghost" size="sm" onClick={saveProgress} disabled={isSaving} className="text-xs">
              <Save className="h-3 w-3 mr-1" />
              {isSaving ? "Saving..." : "Save & Finish Later"}
            </Button>
          </div>
        </div>
      )}

      <div className="py-6 px-4 pb-[60vh]">
        <div className="max-w-2xl mx-auto">{renderCurrentStep()}</div>
      </div>
    </div>
  )
}
