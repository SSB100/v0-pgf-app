"use client"

import { useState } from "react"
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
    updateData({ initialDailyCheckIn: formData })
    onNext()
  }

  return (
    <Card className="soft-shadow-lg border-border/50">
      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl text-foreground">Your First Daily Check-In</CardTitle>
        <p className="text-sm text-muted-foreground text-pretty">
          Before you finish setting up Waypoint, try the check-in you can use day to day.
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-2">
          <p className="text-sm font-semibold text-foreground">Why check in?</p>
          <p className="text-sm text-foreground/90 text-pretty">
            A check-in gives you a consistent record of what you noticed that day. Over time, those entries can make
            patterns easier to see across mood, urges, behaviours, coping tools and meaningful moments.
          </p>
          <p className="text-sm text-foreground/90 text-pretty">
            This is your first real check-in, not a demo. When you finish onboarding, the answers you enter here will
            appear on your dashboard as today&apos;s check-in and become the starting point for your weekly view.
          </p>
        </div>

        <div className="rounded-lg border border-border bg-muted/30 p-3 text-xs sm:text-sm text-muted-foreground">
          Your answers are self-reported and are not a diagnosis, risk assessment or clinical judgement. Waypoint is not
          monitored in real time.
        </div>

        <div className="space-y-3">
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
        </div>

        <div className="space-y-3">
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
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-semibold text-foreground">What emotions have you noticed today?</label>
          <div className="flex flex-wrap gap-2">
            {commonEmotions.map((emotion) => (
              <Button
                key={emotion}
                type="button"
                size="sm"
                variant={formData.emotionsFelt.includes(emotion) ? "default" : "outline"}
                onClick={() => toggleEmotion(emotion)}
                className="text-xs"
              >
                {emotion}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label htmlFor="onboarding-strongest-emotion" className="block text-sm font-semibold text-foreground">
            Which emotion felt strongest?
          </label>
          {formData.emotionsFelt.length > 0 ? (
            <select
              id="onboarding-strongest-emotion"
              value={formData.strongestEmotion}
              onChange={(event) => setFormData((previous) => ({ ...previous, strongestEmotion: event.target.value }))}
              className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select an emotion...</option>
              {formData.emotionsFelt.map((emotion) => (
                <option key={emotion} value={emotion}>
                  {emotion}
                </option>
              ))}
            </select>
          ) : (
            <p className="text-sm text-muted-foreground italic">Select any emotions above first, if you want to.</p>
          )}
        </div>

        <div className="space-y-3">
          <label htmlFor="onboarding-emotion-context" className="block text-sm font-semibold text-foreground">
            What was happening around that time?
          </label>
          <textarea
            id="onboarding-emotion-context"
            value={formData.emotionContext}
            onChange={(event) => setFormData((previous) => ({ ...previous, emotionContext: event.target.value }))}
            rows={3}
            className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Add any context you want to remember..."
          />
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-semibold text-foreground">Did you use any coping skills or tools today?</label>
          <p className="text-xs text-muted-foreground">
            These can be tools you already use. If the Waypoint skill names below are new to you, that&apos;s completely fine.
          </p>
          <div className="flex gap-3">
            <Button
              type="button"
              variant={formData.usedSkills ? "default" : "outline"}
              onClick={() => setFormData((previous) => ({ ...previous, usedSkills: true }))}
              className="flex-1"
            >
              Yes
            </Button>
            <Button
              type="button"
              variant={!formData.usedSkills ? "default" : "outline"}
              onClick={() => setFormData((previous) => ({ ...previous, usedSkills: false, skillsUsed: [] }))}
              className="flex-1"
            >
              No
            </Button>
          </div>
        </div>

        {formData.usedSkills && (
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-foreground">Which skills did you use?</label>
            <div className="flex flex-wrap gap-2">
              {availableSkills.map((skill) => (
                <Button
                  key={skill}
                  type="button"
                  size="sm"
                  variant={formData.skillsUsed.includes(skill) ? "default" : "outline"}
                  onClick={() => toggleSkill(skill)}
                  className="text-xs"
                >
                  {skill}
                </Button>
              ))}
            </div>
          </div>
        )}

        {hasGambling && (
          <>
            <div className="space-y-3">
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
            </div>
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
              <div className="rounded-lg border border-amber-300/70 bg-amber-50 p-4 text-sm text-amber-950 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-100 space-y-2">
                <p>
                  Thank you for recording this. Waypoint does not assess your level of risk or notify someone automatically.
                  If you are worried about your safety, call or text {supportResources.emotionalSupport.phone} for free
                  support. If you or someone else is in immediate danger, call {supportResources.emergency.phone} or go to
                  the nearest hospital emergency department.
                </p>
                <Link href="/support" className="inline-block font-semibold underline underline-offset-2">
                  View support options
                </Link>
              </div>
            )}
          </>
        )}

        {(hasMentalHealth || hasPersonalGrowth) && !hasGambling && !hasAlcohol && !hasSubstances && (
          <div className="space-y-3">
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
          </div>
        )}

        <div className="space-y-3">
          <label htmlFor="onboarding-challenges" className="block text-sm font-semibold text-foreground">
            Challenges or difficult moments today
          </label>
          <textarea
            id="onboarding-challenges"
            value={formData.badThings}
            onChange={(event) => setFormData((previous) => ({ ...previous, badThings: event.target.value }))}
            rows={3}
            className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Anything difficult that you want to remember or reflect on?"
          />
        </div>

        <div className="space-y-3">
          <label htmlFor="onboarding-positive-moments" className="block text-sm font-semibold text-foreground">
            Positive or meaningful moments today
          </label>
          <textarea
            id="onboarding-positive-moments"
            value={formData.goodThings}
            onChange={(event) => setFormData((previous) => ({ ...previous, goodThings: event.target.value }))}
            rows={3}
            className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Anything that felt helpful, meaningful or worth noticing?"
          />
        </div>

        <div className="rounded-lg border border-border bg-secondary/20 p-4">
          <p className="text-sm text-foreground/90 text-pretty">
            Future check-ins use the same basic structure. They help build your weekly view from what you actually report,
            rather than Waypoint guessing how you are doing.
          </p>
        </div>

        <StepButtonFooter onBack={onBack} onNext={handleNext} nextText="Save First Check-In & Continue" />
      </CardContent>
    </Card>
  )
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
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground">{minLabel}</span>
      <input
        type="range"
        id={id}
        min={min}
        max={10}
        value={value}
        onChange={(event) => onChange(Number.parseInt(event.target.value))}
        className="flex-1 h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
      />
      <span className="text-xs text-muted-foreground">{maxLabel}</span>
      <div className="min-w-[2rem] text-center">
        <span className="text-lg font-bold text-primary">{value}</span>
      </div>
    </div>
  )
}

function YesNoQuestion({ label, value, onChange }: { label: string; value: boolean; onChange: (value: boolean) => void }) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-foreground">{label}</label>
      <div className="flex gap-3">
        <Button type="button" variant={value ? "default" : "outline"} onClick={() => onChange(true)} className="flex-1">
          Yes
        </Button>
        <Button type="button" variant={!value ? "default" : "outline"} onClick={() => onChange(false)} className="flex-1">
          No
        </Button>
      </div>
    </div>
  )
}
