"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface CheckInFormProps {
  userId: string
  journeyTypes: string[]
  problems: any[]
}

export default function CheckInForm({ userId, journeyTypes, problems }: CheckInFormProps) {
  const router = useRouter()

  const [formData, setFormData] = useState({
    moodRating: 5,
    overallRating: 5,
    urgeStrength: 0,
    gamblingOccurred: false,
    alcoholOccurred: false,
    substanceOccurred: false,
    selfHarmThoughts: false,
    selfHarmActions: false,
    usedSkills: false,
    skillsUsed: [] as string[],
    badThings: "",
    goodThings: "",
    emotionsFelt: [] as string[],
    strongestEmotion: "",
    emotionContext: "",
  })
  const [submitting, setSubmitting] = useState(false)

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

  const safeJourneyTypes = Array.isArray(journeyTypes) ? journeyTypes : []
  const hasGambling = safeJourneyTypes.includes("gambling")
  const hasAlcohol = safeJourneyTypes.includes("alcohol")
  const hasSubstances = safeJourneyTypes.includes("substances")
  const hasMentalHealth = safeJourneyTypes.includes("mental_health")
  const hasPersonalGrowth = safeJourneyTypes.includes("personal_growth")

  const toggleSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skillsUsed: prev.skillsUsed.includes(skill)
        ? prev.skillsUsed.filter((s) => s !== skill)
        : [...prev.skillsUsed, skill],
    }))
  }

  const toggleEmotion = (emotion: string) => {
    setFormData((prev) => ({
      ...prev,
      emotionsFelt: prev.emotionsFelt.includes(emotion)
        ? prev.emotionsFelt.filter((e) => e !== emotion)
        : [...prev.emotionsFelt, emotion],
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)

    try {
      const behaviorOccurred =
        formData.gamblingOccurred || formData.alcoholOccurred || formData.substanceOccurred || formData.selfHarmActions

      const payload = {
        userId,
        moodRating: formData.moodRating,
        overallRating: formData.overallRating,
        urgeStrength: formData.urgeStrength,
        behaviorOccurred,
        gamblingOccurred: formData.gamblingOccurred,
        alcoholOccurred: formData.alcoholOccurred,
        substanceOccurred: formData.substanceOccurred,
        selfHarmThoughts: formData.selfHarmThoughts,
        selfHarmActions: formData.selfHarmActions,
        skillsUsed: formData.skillsUsed,
        badThings: formData.badThings,
        goodThings: formData.goodThings,
        emotionsFelt: formData.emotionsFelt,
        strongestEmotion: formData.strongestEmotion,
        emotionContext: formData.emotionContext,
      }

      const response = await fetch("/api/check-in/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const responseData = await response.json()

      if (!response.ok) {
        const errorMessage = responseData.error || "Failed to submit check-in"
        throw new Error(errorMessage)
      }

      router.push("/dashboard")
    } catch (error) {
      console.error("[v0] Check-in submission error:", error)
      const errorMsg = error instanceof Error ? error.message : "Failed to submit check-in. Please try again."
      alert(errorMsg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Mood Rating */}
      <div className="space-y-3">
        <label htmlFor="mood-rating" className="block text-sm font-semibold text-foreground">
          How are you feeling today? <span className="text-destructive">*</span>
        </label>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Poor</span>
          <input
            type="range"
            id="mood-rating"
            name="moodRating"
            min="1"
            max="10"
            value={formData.moodRating}
            onChange={(e) => setFormData((prev) => ({ ...prev, moodRating: Number.parseInt(e.target.value) }))}
            className="flex-1 h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <span className="text-xs text-muted-foreground">Great</span>
          <div className="min-w-[2rem] text-center">
            <span className="text-lg font-bold text-primary">{formData.moodRating}</span>
          </div>
        </div>
      </div>

      {/* Overall Rating */}
      <div className="space-y-3">
        <label htmlFor="overall-rating" className="block text-sm font-semibold text-foreground">
          How was today overall? <span className="text-destructive">*</span>
        </label>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Terrible</span>
          <input
            type="range"
            id="overall-rating"
            name="overallRating"
            min="1"
            max="10"
            value={formData.overallRating}
            onChange={(e) => setFormData((prev) => ({ ...prev, overallRating: Number.parseInt(e.target.value) }))}
            className="flex-1 h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <span className="text-xs text-muted-foreground">Excellent</span>
          <div className="min-w-[2rem] text-center">
            <span className="text-lg font-bold text-primary">{formData.overallRating}</span>
          </div>
        </div>
      </div>

      {/* Emotions Felt */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-foreground">What emotions have you felt today?</label>
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
        <label htmlFor="strongest-emotion" className="block text-sm font-semibold text-foreground">
          What was your strongest emotion?
        </label>
        {formData.emotionsFelt.length > 0 ? (
          <select
            id="strongest-emotion"
            name="strongestEmotion"
            value={formData.strongestEmotion}
            onChange={(e) => setFormData((prev) => ({ ...prev, strongestEmotion: e.target.value }))}
            className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Select your strongest emotion...</option>
            {formData.emotionsFelt.map((emotion) => (
              <option key={emotion} value={emotion}>
                {emotion}
              </option>
            ))}
          </select>
        ) : (
          <p className="text-sm text-muted-foreground italic">Please select emotions above first</p>
        )}
      </div>

      <div className="space-y-3">
        <label htmlFor="emotion-context" className="block text-sm font-semibold text-foreground">
          What was happening at the time?
        </label>
        <textarea
          id="emotion-context"
          name="emotionContext"
          value={formData.emotionContext}
          onChange={(e) => setFormData((prev) => ({ ...prev, emotionContext: e.target.value }))}
          rows={3}
          className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Describe the situation when you felt this emotion..."
        />
      </div>

      {/* Skills Used */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-foreground">
          Did you use any coping skills or tips today?
        </label>
        <div className="flex gap-3">
          <Button
            type="button"
            variant={formData.usedSkills ? "default" : "outline"}
            onClick={() =>
              setFormData((prev) => ({
                ...prev,
                usedSkills: true,
              }))
            }
            className="flex-1"
          >
            Yes
          </Button>
          <Button
            type="button"
            variant={!formData.usedSkills ? "default" : "outline"}
            onClick={() =>
              setFormData((prev) => ({
                ...prev,
                usedSkills: false,
                skillsUsed: [],
              }))
            }
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
            <label htmlFor="urge-strength-gambling" className="block text-sm font-semibold text-foreground">
              Gambling urge strength since your last check-in? <span className="text-destructive">*</span>
            </label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">None</span>
              <input
                type="range"
                id="urge-strength-gambling"
                name="urgeStrength"
                min="0"
                max="10"
                value={formData.urgeStrength}
                onChange={(e) => setFormData((prev) => ({ ...prev, urgeStrength: Number.parseInt(e.target.value) }))}
                className="flex-1 h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <span className="text-xs text-muted-foreground">Extreme</span>
              <div className="min-w-[2rem] text-center">
                <span className="text-lg font-bold text-primary">{formData.urgeStrength}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-semibold text-foreground">
              Have you gambled since your last check-in? <span className="text-destructive">*</span>
            </label>
            <div className="flex gap-3">
              <Button
                type="button"
                variant={formData.gamblingOccurred ? "default" : "outline"}
                onClick={() => setFormData((prev) => ({ ...prev, gamblingOccurred: true }))}
                className="flex-1"
              >
                Yes
              </Button>
              <Button
                type="button"
                variant={!formData.gamblingOccurred ? "default" : "outline"}
                onClick={() => setFormData((prev) => ({ ...prev, gamblingOccurred: false }))}
                className="flex-1"
              >
                No
              </Button>
            </div>
          </div>
        </>
      )}

      {hasAlcohol && (
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-foreground">
            Have you drunk alcohol since your last check-in? <span className="text-destructive">*</span>
          </label>
          <div className="flex gap-3">
            <Button
              type="button"
              variant={formData.alcoholOccurred ? "default" : "outline"}
              onClick={() => setFormData((prev) => ({ ...prev, alcoholOccurred: true }))}
              className="flex-1"
            >
              Yes
            </Button>
            <Button
              type="button"
              variant={!formData.alcoholOccurred ? "default" : "outline"}
              onClick={() => setFormData((prev) => ({ ...prev, alcoholOccurred: false }))}
              className="flex-1"
            >
              No
            </Button>
          </div>
        </div>
      )}

      {hasSubstances && (
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-foreground">
            Have you used substances since your last check-in? <span className="text-destructive">*</span>
          </label>
          <div className="flex gap-3">
            <Button
              type="button"
              variant={formData.substanceOccurred ? "default" : "outline"}
              onClick={() => setFormData((prev) => ({ ...prev, substanceOccurred: true }))}
              className="flex-1"
            >
              Yes
            </Button>
            <Button
              type="button"
              variant={!formData.substanceOccurred ? "default" : "outline"}
              onClick={() => setFormData((prev) => ({ ...prev, substanceOccurred: false }))}
              className="flex-1"
            >
              No
            </Button>
          </div>
        </div>
      )}

      {hasMentalHealth && (
        <>
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-foreground">
              Have you had thoughts of self-harm since your last check-in? <span className="text-destructive">*</span>
            </label>
            <div className="flex gap-3">
              <Button
                type="button"
                variant={formData.selfHarmThoughts ? "default" : "outline"}
                onClick={() => setFormData((prev) => ({ ...prev, selfHarmThoughts: true }))}
                className="flex-1"
              >
                Yes
              </Button>
              <Button
                type="button"
                variant={!formData.selfHarmThoughts ? "default" : "outline"}
                onClick={() => setFormData((prev) => ({ ...prev, selfHarmThoughts: false }))}
                className="flex-1"
              >
                No
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-semibold text-foreground">
              Have you engaged in any self-harm behaviors since your last check-in? <span className="text-destructive">*</span>
            </label>
            <div className="flex gap-3">
              <Button
                type="button"
                variant={formData.selfHarmActions ? "default" : "outline"}
                onClick={() => setFormData((prev) => ({ ...prev, selfHarmActions: true }))}
                className="flex-1"
              >
                Yes
              </Button>
              <Button
                type="button"
                variant={!formData.selfHarmActions ? "default" : "outline"}
                onClick={() => setFormData((prev) => ({ ...prev, selfHarmActions: false }))}
                className="flex-1"
              >
                No
              </Button>
            </div>
          </div>
        </>
      )}

      {(hasMentalHealth || hasPersonalGrowth) && !hasGambling && !hasAlcohol && !hasSubstances && (
        <div className="space-y-3">
          <label htmlFor="urge-strength-general" className="block text-sm font-semibold text-foreground">
            How strong were any difficult urges or impulses today?
          </label>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">None</span>
            <input
              type="range"
              id="urge-strength-general"
              name="urgeStrength"
              min="0"
              max="10"
              value={formData.urgeStrength}
              onChange={(e) => setFormData((prev) => ({ ...prev, urgeStrength: Number.parseInt(e.target.value) }))}
              className="flex-1 h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <span className="text-xs text-muted-foreground">Extreme</span>
            <div className="min-w-[2rem] text-center">
              <span className="text-lg font-bold text-primary">{formData.urgeStrength}</span>
            </div>
          </div>
        </div>
      )}

      {/* Reflection Fields */}
      <div className="space-y-3">
        <label htmlFor="challenges" className="block text-sm font-semibold text-foreground">
          Challenges or difficult moments today
        </label>
        <textarea
          id="challenges"
          name="badThings"
          value={formData.badThings}
          onChange={(e) => setFormData((prev) => ({ ...prev, badThings: e.target.value }))}
          rows={3}
          className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="What were the challenges or difficult moments today?"
        />
      </div>

      <div className="space-y-3">
        <label htmlFor="positive-moments" className="block text-sm font-semibold text-foreground">
          Positive moments or gratitude today
        </label>
        <textarea
          id="positive-moments"
          name="goodThings"
          value={formData.goodThings}
          onChange={(e) => setFormData((prev) => ({ ...prev, goodThings: e.target.value }))}
          rows={3}
          className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="What went well or what are you grateful for today?"
        />
      </div>

      {/* Submit */}
      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" onClick={() => router.push("/dashboard")} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" disabled={submitting} className="flex-1 bg-primary hover:bg-primary/90 text-white">
          {submitting ? "Saving..." : "Complete Check-In"}
        </Button>
      </div>
    </form>
  )
}
