"use client"

import { useState, useEffect, useMemo, useRef } from "react"
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

  // Legacy awareness fields are retained in the saved-data shape so an older
  // partially completed onboarding session can still be read safely. The
  // separate awareness/emotion step is no longer part of the active flow;
  // Daily Check-in is the single onboarding place for emotion capture.
  currentEmotions?: string[]
  strongestEmotion?: string
  situationDescription?: string
  selfTalk?: string
  stillExperiencing?: boolean | null

  recognizedChoicePoints?: string[]

  selectedValues: Array<{
    name: string
    importance: number
    category: string
  }>
  initialValuesShortlist?: string[]
  secondRoundValues?: string[]
  perceivedStrengths?: string[]
  identifiedStrengths?: string[]

  initialDailyCheckIn?: InitialDailyCheckIn

  gamblingFrequency?: string
  lastBetDate?: string
  gamblingForms?: string[]
  mostUsedGamblingForms?: string[]
  illegalGambling?: string
  gamblingTriggers: string[]
  impactAreas: string[]
  seekingHelp?: string

  alcoholFrequency?: string
  lastDrinkDate?: string
  drinkingTypes?: string[]
  alcoholTriggers?: string[]
  alcoholImpactAreas?: string[]

  substanceFrequency?: string
  lastSubstanceDate?: string
  substanceTypes?: string[]
  substanceTriggers?: string[]
  substanceImpactAreas?: string[]

  playsVideoGames?: boolean
  gamingFrequency?: string
  gamingImpact?: string
  lootBoxExposure?: string
  inGamePurchases?: string

  mentalHealthAreas?: string[]
  mentalHealthFrequency?: string
  currentCopingMethods?: string[]
  mentalHealthSupportNeeds?: string[]
  receivingMentalHealthTreatment?: string

  growthGoals?: string[]
  growthMotivation?: string
  growthChallenges?: string[]

  selfHarmThoughts?: string
  selfHarmActions?: string
  suicidalThoughts?: string

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
  const scrollViewportRef = useRef<HTMLDivElement>(null)
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
  const progressPercent = totalSteps > 0 ? Math.round(((currentStepIndex + 1) / totalSteps) * 100) : 0

  useEffect(() => {
    scrollViewportRef.current?.scrollTo({ top: 0, behavior: "auto" })
    window.scrollTo({ top: 0, behavior: "auto" })
  }, [currentStepIndex])

  useEffect(() => {
    if (initialStep > 1 && initialData) {
      // Saved step numbers from the previous flow can be ahead by up to two
      // because the duplicate awareness intro + awareness screens were removed.
      // Clamp to a valid current step rather than losing saved onboarding data.
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
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-gradient-to-br from-secondary via-background to-muted lg:block lg:h-auto lg:min-h-screen lg:overflow-visible">
      {currentStep !== "completion" && (
        <>
          <div className="shrink-0 border-b border-border/70 bg-card/95 backdrop-blur-xl lg:hidden">
            <div className="mx-auto max-w-2xl px-4 pb-2.5 pt-[max(0.65rem,env(safe-area-inset-top))]">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-primary">Waypoint setup</p>
                  <p className="mt-0.5 text-sm font-semibold text-foreground">Step {currentStepIndex + 1} of {totalSteps}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={saveProgress}
                  disabled={isSaving}
                  className="h-9 shrink-0 px-2.5 text-xs text-muted-foreground"
                >
                  <Save className="mr-1.5 size-3.5" />
                  {isSaving ? "Saving..." : "Save for later"}
                </Button>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary">
                <div className="h-full rounded-full bg-primary transition-[width] duration-300" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>
          </div>

          <div className="sticky top-[73px] z-40 hidden border-b border-border bg-card/80 backdrop-blur-sm lg:block">
            <div className="mx-auto flex max-w-2xl justify-end px-4 py-2">
              <Button variant="ghost" size="sm" onClick={saveProgress} disabled={isSaving} className="text-xs">
                <Save className="mr-1 size-3" />
                {isSaving ? "Saving..." : "Save & Finish Later"}
              </Button>
            </div>
          </div>
        </>
      )}

      <div
        ref={scrollViewportRef}
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-3 pb-28 lg:overflow-visible lg:px-4 lg:py-6 lg:pb-20"
      >
        <div className="onboarding-step-viewport mx-auto max-w-2xl">{renderCurrentStep()}</div>
      </div>
    </div>
  )
}
