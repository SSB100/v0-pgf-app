"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supportResources } from "@/lib/support-resources"
import type { InitialDailyCheckIn, OnboardingData } from "../onboarding-flow"
import { StepButtonFooter } from "./step-button-footer"

interface DailyCheckInStepProps {
  data: OnboardingData
  updateData: (data: Partial<OnboardingData>) => void
  onNext: () => void
  onBack: () => void
}

const availableSkills = [
  "TIP",
  "STOP",
  "RAIN",
  "Opposite Action",
  "Mindfulness",
  "Deep Breathing",
  "Grounding",
  "DEAR MAN",
  "GIVE",
  "FAST",
  "Problem Solving",
  "Turning the Mind",
  "IMPROVE",
  "PLEASE",
  "Reality Acceptance",
  "Willingness",
]

const commonEmotions = [
  "Happy",
  "Sad",
  "Anxious",
  "Angry",
  "Excited",
  "Frustrated",
  "Calm",
  "Worried",
  "Hopeful",
  "Scared",
  "Proud",
  "Ashamed",
  "Guilty",
  "Content",
  "Lonely",
  "Grateful",
]

const emptyCheckIn: InitialDailyCheckIn = {
  moodRating: 5,
  overallRating: 5,
  urgeStrength: 0,
  gamblingOccurred: false,
  alcoholOccurred: false,
  substanceOccurred: false,
  selfHarmThoughts: false,
  selfHarmActions: false,
  usedSkills: false,
  skillsUsed: [],
  badThings: "",
  goodThings: "",
  emotionsFelt: [],
  strongestEmotion: "",
  emotionContext: "",
}

export default function DailyCheckInStep({ data, updateData, onNext, onBack }: DailyCheckInStepProps) {
  const [formData, setFormData] = useState<InitialDailyCheckIn>({
    ...emptyCheckIn,
    ...(data.initialDailyCheckIn || {}),
    skillsUsed: data.initialDailyCheckIn?.skillsUsed || [],
    emotionsFelt: data.initialDailyCheckIn?.emotionsFelt || [],
  })
  const [dateError, setDateError] = useState("")

  useEffect(() => {
    if (formData.dateKey) return

    let cancelled = false

    async function loadAotearoaDate() {
      try {
        const response = await fetch("/api/check-in/check-today", { cache: "no-store" })
        const payload = await response.json()
        if (!response.ok || typeof payload.date !== "string") throw new Error("Unable to confirm today's date")
        if (!cancelled) {
          setFormData((previous) => ({ ...previous, dateKey: payload.date }))
          setDateError("")
        }
      } catch {
        if (!cancelled) setDateError("We couldn't confirm today's date. Please try again before continuing.")
      }
    }

    loadAotearoaDate()
    return () => {
      cancelled = true
    }
  }, [formData.dateKey])

  const journeyTypes = data.journeyTypes || []
  const hasGambling = journeyTypes.includes("gambling")
  const hasAlcohol = journeyTypes.includes("alcohol")
  const hasSubstances = journeyTypes.includes("substances")
  const hasMentalHealth = journeyTypes.includes("mental_health")
  const hasPersonalGrowth = journeyTypes.includes("personal_growth")
  const showSafetySupport = formData.selfHarmThoughts || formData.selfHarmActions

  function toggleSkill(skill: string) {
    setFormData((previous) => ({
      ...previous,
      skillsUsed: previous.skillsUsed.includes(skill)
        ? previous.skillsUsed.filter((item) => item !== skill)
        : [...previous.skillsUsed, skill],
    }))
  }

  function toggleEmotion(emotion: string) {
    setFormData((previous) => {
      const emotionsFelt = previous.emotionsFelt.includes(emotion)
        ? previous.emotionsFelt.filter((item) => item !== emotion)
        : [...previous.emotionsFelt, emotion]

      return {
        ...previous,
        emotionsFelt,
        strongestEmotion: emotionsFelt.includes(previous.strongestEmotion) ? previous.strongestEmotion : "",
      }
    })
  }

  function handleNext() {
    if (!formData.dateKey) return
    updateData({ initialDailyCheckIn: formData })
    onNext()
  }

  return (
    <Card className="gap-3 border-border/50 py-4 soft-shadow-lg sm:gap-6 sm:py-6">
      <CardHeader className="gap-1.5 px-4 sm:gap-2 sm:px-6">
        <CardTitle className="text-xl text-foreground sm:text-2xl">Your First Daily Check-In</CardTitle>
        <p className="text-xs leading-snug text-muted-foreground text-pretty sm:text-sm">
          Try the same check-in you can use day to day. This entry will become the starting point for your dashboard and weekly view.
        </p>
      </CardHeader>

      <CardContent className="space-y-4 px-4 sm:space-y-6 sm:px-6">
        <div className="rounded-lg border border-primary/20 bg-primary/5 px-3 py-2.5 sm:rounded-xl sm:p-4">
          <p className="text-[11px] leading-snug text-foreground/90 text-pretty sm:text-sm">
            <span className="font-semibold">Why check in?</span> A consistent record can make patterns across mood, urges, behaviours, coping tools and meaningful moments easier to notice over time.
          </p>
        </div>

        <div className="rounded-lg border border-border bg-muted/30 px-3 py-2 text-[10px] leading-snug text-muted-foreground sm:p-3 sm:text-sm">
          Your answers are self-reported. They are not a diagnosis, risk assessment or clinical judgement, and Waypoint is not monitored in real time.
        </div>

        {dateError && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive sm:text-sm">
            {dateError}
          </div>
        )}

        <QuestionBlock>
          <label htmlFor="onboarding-mood-rating" className="block text-sm font-semibold text-foreground">
            How are you feeling today?
          </label>
          <RatingSlider
            id="onboarding-mood-rating"
            minLabel="Very difficult"
            maxLabel="Very good"
            min={1}
            value={formData.moodRating}
            onChange={(value) => setFormData((previous) => ({ ...previous, moodRating: value }))}
          />
        </QuestionBlock>

        <QuestionBlock>
          <label htmlFor="onboarding-overall-rating" className="block text-sm font-semibold text-foreground">
            How would you rate today overall?
          </label>
          <RatingSlider
            id="onboarding-overall-rating"
            minLabel="Very difficult"
            maxLabel="Very good"
            min={1}
            value={formData.overallRating}
            onChange={(value) => setFormData((previous) => ({ ...previous, overallRating: value }))}
          />
        </QuestionBlock>

        <QuestionBlock>
          <label className="block text-sm font-semibold text-foreground">What emotions have you noticed today?</label>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {commonEmotions.map((emotion) => (
              <Button
                key={emotion}
                type="button"
                size="sm"
                variant={formData.emotionsFelt.includes(emotion) ? "default" : "outline"}
                onClick={() => toggleEmotion(emotion)}
                className="h-8 px-2 text-[11px] sm:h-9 sm:px-3 sm:text-xs"
              >
                {emotion}
              </Button>
            ))}
          </div>
        </QuestionBlock>

        <QuestionBlock>
          <label htmlFor="onboarding-strongest-emotion" className="block text-sm font-semibold text-foreground">
            Which emotion felt strongest?
          </label>
          {formData.emotionsFelt.length > 0 ? (
            <select
              id="onboarding-strongest-emotion"
              value={formData.strongestEmotion}
              onChange={(event) => setFormData((previous) => ({ ...previous, strongestEmotion: event.target.value }))}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select an emotion...</option>
              {formData.emotionsFelt.map((emotion) => (
                <option key={emotion} value={emotion}>
                  {emotion}
                </option>
              ))}
            </select>
          ) : (
            <p className="text-xs italic text-muted-foreground sm:text-sm">Select any emotions above first, if you want to.</p>
          )}
        </QuestionBlock>

        <QuestionBlock>
          <label htmlFor="onboarding-emotion-context" className="block text-sm font-semibold text-foreground">
            What was happening around that time?
          </label>
          <textarea
            id="onboarding-emotion-context"
            value={formData.emotionContext}
            onChange={(event) => setFormData((previous) => ({ ...previous, emotionContext: event.target.value }))}
            rows={2}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary sm:min-h-20"
            placeholder="Add any context you want to remember..."
          />
        </QuestionBlock>

        <QuestionBlock>
          <label className="block text-sm font-semibold text-foreground">Did you use any coping skills or tools today?</label>
          <p className="text-[11px] leading-snug text-muted-foreground sm:text-xs">
            These can be tools you already use. It is fine if the Waypoint skill names are new to you.
          </p>
          <div className="flex gap-2 sm:gap-3">
            <Button
              type="button"
              variant={formData.usedSkills ? "default" : "outline"}
              onClick={() => setFormData((previous) => ({ ...previous, usedSkills: true }))}
              className="h-10 flex-1"
            >
              Yes
            </Button>
            <Button
              type="button"
              variant={!formData.usedSkills ? "default" : "outline"}
              onClick={() => setFormData((previous) => ({ ...previous, usedSkills: false, skillsUsed: [] }))}
              className="h-10 flex-1"
            >
              No
            </Button>
          </div>
        </QuestionBlock>

        {formData.usedSkills && (
          <QuestionBlock>
            <label className="block text-sm font-semibold text-foreground">Which skills did you use?</label>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {availableSkills.map((skill) => (
                <Button
                  key={skill}
                  type="button"
                  size="sm"
                  variant={formData.skillsUsed.includes(skill) ? "default" : "outline"}
                  onClick={() => toggleSkill(skill)}
                  className="h-8 px-2 text-[11px] sm:h-9 sm:px-3 sm:text-xs"
                >
                  {skill}
                </Button>
              ))}
            </div>
          </QuestionBlock>
        )}

        {hasGambling && (
          <>
            <QuestionBlock>
              <label htmlFor="onboarding-urge-strength-gambling" className="block text-sm font-semibold text-foreground">
                How strong was your urge to gamble today?
              </label>
              <RatingSlider
                id="onboarding-urge-strength-gambling"
                minLabel="None"
                maxLabel="Very strong"
                min={0}
                value={formData.urgeStrength}
                onChange={(value) => setFormData((previous) => ({ ...previous, urgeStrength: value }))}
              />
            </QuestionBlock>
            <YesNoQuestion
              label="Have you gambled today?"
              value={formData.gamblingOccurred}
              onChange={(value) => setFormData((previous) => ({ ...previous, gamblingOccurred: value }))}
            />
          </>
        )}

        {hasAlcohol && (
          <YesNoQuestion
            label="Have you drunk alcohol today?"
            value={formData.alcoholOccurred}
            onChange={(value) => setFormData((previous) => ({ ...previous, alcoholOccurred: value }))}
          />
        )}

        {hasSubstances && (
          <YesNoQuestion
            label="Have you used substances today?"
            value={formData.substanceOccurred}
            onChange={(value) => setFormData((previous) => ({ ...previous, substanceOccurred: value }))}
          />
        )}

        {hasMentalHealth && (
          <>
            <YesNoQuestion
              label="Have you had thoughts of self-harm today?"
              value={formData.selfHarmThoughts}
              onChange={(value) => setFormData((previous) => ({ ...previous, selfHarmThoughts: value }))}
            />
            <YesNoQuestion
              label="Have you harmed yourself today?"
              value={formData.selfHarmActions}
              onChange={(value) => setFormData((previous) => ({ ...previous, selfHarmActions: value }))}
            />

            {showSafetySupport && (
              <div className="space-y-2 rounded-lg border border-amber-300/70 bg-amber-50 p-3 text-xs text-amber-950 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-100 sm:p-4 sm:text-sm">
                <p>
                  Thank you for recording this. Waypoint does not assess your level of risk or notify someone automatically.
                  If you are worried about your safety, call or text {supportResources.emotionalSupport.phone} for free support.
                  If you or someone else is in immediate danger, call {supportResources.emergency.phone} or go to the nearest hospital emergency department.
                </p>
                <Link href="/support" className="inline-block font-semibold underline underline-offset-2">
                  View support options
                </Link>
              </div>
            )}
          </>
        )}

        {(hasMentalHealth || hasPersonalGrowth) && !hasGambling && !hasAlcohol && !hasSubstances && (
          <QuestionBlock>
            <label htmlFor="onboarding-urge-strength-general" className="block text-sm font-semibold text-foreground">
              How strong were any difficult urges or impulses today?
            </label>
            <RatingSlider
              id="onboarding-urge-strength-general"
              minLabel="None"
              maxLabel="Very strong"
              min={0}
              value={formData.urgeStrength}
              onChange={(value) => setFormData((previous) => ({ ...previous, urgeStrength: value }))}
            />
          </QuestionBlock>
        )}

        <QuestionBlock>
          <label htmlFor="onboarding-challenges" className="block text-sm font-semibold text-foreground">
            Challenges or difficult moments today
          </label>
          <textarea
            id="onboarding-challenges"
            value={formData.badThings}
            onChange={(event) => setFormData((previous) => ({ ...previous, badThings: event.target.value }))}
            rows={2}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary sm:min-h-20"
            placeholder="Anything difficult that you want to remember or reflect on?"
          />
        </QuestionBlock>

        <QuestionBlock>
          <label htmlFor="onboarding-positive-moments" className="block text-sm font-semibold text-foreground">
            Positive or meaningful moments today
          </label>
          <textarea
            id="onboarding-positive-moments"
            value={formData.goodThings}
            onChange={(event) => setFormData((previous) => ({ ...previous, goodThings: event.target.value }))}
            rows={2}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary sm:min-h-20"
            placeholder="Anything that felt helpful, meaningful or worth noticing?"
          />
        </QuestionBlock>

        <div className="rounded-lg border border-border bg-secondary/20 px-3 py-2 text-[10px] leading-snug text-foreground/90 sm:p-4 sm:text-sm">
          Future check-ins use the same basic structure and build your weekly view from what you report rather than Waypoint guessing how you are doing.
        </div>

        <StepButtonFooter
          onBack={onBack}
          onNext={handleNext}
          nextText={formData.dateKey ? "Save First Check-In & Continue" : "Preparing Check-In..."}
          disabled={!formData.dateKey}
        />
      </CardContent>
    </Card>
  )
}

function QuestionBlock({ children }: { children: React.ReactNode }) {
  return <div className="space-y-2 sm:space-y-3">{children}</div>
}

function RatingSlider({
  id,
  minLabel,
  maxLabel,
  min,
  value,
  onChange,
}: {
  id: string
  minLabel: string
  maxLabel: string
  min: number
  value: number
  onChange: (value: number) => void
}) {
  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      <span className="hidden text-xs text-muted-foreground xs:inline">{minLabel}</span>
      <input
        type="range"
        id={id}
        min={min}
        max={10}
        value={value}
        onChange={(event) => onChange(Number.parseInt(event.target.value))}
        className="h-2 flex-1 cursor-pointer appearance-none rounded-lg bg-secondary accent-primary"
      />
      <span className="hidden text-xs text-muted-foreground xs:inline">{maxLabel}</span>
      <div className="min-w-8 text-center">
        <span className="text-lg font-bold text-primary">{value}</span>
      </div>
    </div>
  )
}

function YesNoQuestion({ label, value, onChange }: { label: string; value: boolean; onChange: (value: boolean) => void }) {
  return (
    <QuestionBlock>
      <label className="block text-sm font-semibold text-foreground">{label}</label>
      <div className="flex gap-2 sm:gap-3">
        <Button type="button" variant={value ? "default" : "outline"} onClick={() => onChange(true)} className="h-10 flex-1">
          Yes
        </Button>
        <Button type="button" variant={!value ? "default" : "outline"} onClick={() => onChange(false)} className="h-10 flex-1">
          No
        </Button>
      </div>
    </QuestionBlock>
  )
}
