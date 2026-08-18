"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { OnboardingData } from "../onboarding-flow"
import { VALUE_DOMAINS } from "@/lib/onboarding-data"
import { StepButtonFooter } from "./step-button-footer"

interface ValuesRankingStepProps {
  data: OnboardingData
  updateData: (data: Partial<OnboardingData>) => void
  onNext: () => void
  onBack: () => void
}

function getNextTarget(currentCount: number) {
  if (currentCount <= 3) return 3

  // Keep the pruning gradual so the exercise feels reflective rather than like
  // another ranking task. With all 24 values selected the path is 24 → 18 → 13 → 9 → 6 → 3.
  const targets = [18, 13, 9, 6, 3]
  return targets.find((target) => target < currentCount) || 3
}

function getValueDomain(value: string) {
  return VALUE_DOMAINS.find((domain) => domain.values.includes(value))
}

export default function ValuesRankingStep({ data, updateData, onNext, onBack }: ValuesRankingStepProps) {
  const initialValues = data.initialValuesShortlist || []
  const savedRefinement = data.secondRoundValues || []
  const startingValues =
    savedRefinement.length >= 3 && savedRefinement.length <= initialValues.length ? savedRefinement : initialValues

  const [currentPool, setCurrentPool] = useState<string[]>(startingValues)
  const [keptValues, setKeptValues] = useState<string[]>(startingValues)
  const [history, setHistory] = useState<string[][]>([])

  const targetCount = useMemo(() => getNextTarget(currentPool.length), [currentPool.length])
  const valuesToSetAside = Math.max(0, currentPool.length - targetCount)
  const valuesAlreadySetAside = currentPool.length - keptValues.length
  const remainingToSetAside = Math.max(0, keptValues.length - targetCount)
  const isFinalRound = targetCount === 3
  const canContinue = keptValues.length === targetCount

  function toggleValue(value: string) {
    if (keptValues.includes(value)) {
      if (keptValues.length <= targetCount) return
      setKeptValues((previous) => previous.filter((item) => item !== value))
      return
    }

    setKeptValues((previous) => [...previous, value])
  }

  function finaliseCoreValues(values: string[]) {
    const coreValues = values.slice(0, 3).map((name) => {
      const domain = getValueDomain(name)
      return {
        name,
        importance: 10,
        category: domain?.domain || "other",
      }
    })

    updateData({
      secondRoundValues: values.slice(0, 3),
      selectedValues: coreValues,
    })
    onNext()
  }

  function handleNext() {
    if (!canContinue) return

    if (isFinalRound || currentPool.length <= 3) {
      finaliseCoreValues(keptValues)
      return
    }

    setHistory((previous) => [...previous, currentPool])
    setCurrentPool(keptValues)
    setKeptValues(keptValues)
    updateData({ secondRoundValues: keptValues, selectedValues: [] })
  }

  function handleBack() {
    if (history.length === 0) {
      onBack()
      return
    }

    const previousPool = history[history.length - 1]
    const nextHistory = history.slice(0, -1)

    setHistory(nextHistory)
    setCurrentPool(previousPool)
    setKeptValues(previousPool)
    updateData({
      secondRoundValues: previousPool.length === initialValues.length ? [] : previousPool,
      selectedValues: [],
    })
  }

  if (initialValues.length < 3) {
    return (
      <Card className="soft-shadow-lg border-border/50 w-full max-w-4xl mx-auto">
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-xl sm:text-2xl text-foreground">The Life Garden</CardTitle>
          <p className="text-sm text-muted-foreground">Choose at least 3 values before refining your garden.</p>
        </CardHeader>
        <CardContent>
          <StepButtonFooter onBack={onBack} onNext={onBack} nextText="Return to values" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="soft-shadow-lg border-border/50 w-full max-w-4xl mx-auto">
      <CardHeader className="px-4 sm:px-6">
        <CardTitle className="text-xl sm:text-2xl text-foreground">
          The Life Garden: {currentPool.length <= 3 ? "Your Core Values" : "Narrowing the Garden"}
        </CardTitle>
        <p className="text-sm sm:text-base text-muted-foreground text-pretty">
          {currentPool.length <= 3
            ? "You have narrowed your garden to three core values."
            : `This round, keep ${targetCount} of the ${currentPool.length} values still in your garden.`}
        </p>
      </CardHeader>

      <CardContent className="space-y-5 px-4 sm:px-6">
        <div className="bg-info/10 border border-info/20 rounded-lg p-4 space-y-2">
          <p className="text-sm text-foreground text-pretty">
            All {initialValues.length} values you chose still matter. This exercise simply helps you notice which three
            feel most central when you have to make a choice between things that all matter to you.
          </p>
          {currentPool.length > 3 && (
            <p className="text-sm font-medium text-foreground">
              Tap {valuesToSetAside === 1 ? "1 value" : `${valuesToSetAside} values`} to set aside for this round.
              You can change your mind before continuing.
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {currentPool.map((value) => {
            const domain = getValueDomain(value)
            const isKept = keptValues.includes(value)

            return (
              <button
                key={value}
                type="button"
                onClick={() => toggleValue(value)}
                className={`min-h-20 px-3 py-3 rounded-lg border-2 transition-all flex flex-col items-center justify-center gap-1 text-center ${
                  isKept
                    ? "bg-primary/10 border-primary text-foreground"
                    : "bg-muted/40 border-border text-muted-foreground opacity-70"
                }`}
              >
                <span className="text-lg" aria-hidden="true">{domain?.icon || "🌱"}</span>
                <span className="text-sm font-medium">{value}</span>
                <span className="text-[11px]">{isKept ? "Keep" : "Set aside"}</span>
              </button>
            )
          })}
        </div>

        {currentPool.length > 3 && (
          <div className="rounded-lg bg-secondary/40 border border-border p-3 text-center">
            <p className="text-sm font-medium text-foreground">
              {keptValues.length} of {targetCount} kept
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {remainingToSetAside > 0
                ? `Set aside ${remainingToSetAside} more ${remainingToSetAside === 1 ? "value" : "values"} to continue.`
                : valuesAlreadySetAside === valuesToSetAside
                  ? "This round is ready. You can continue or swap values before moving on."
                  : "You can adjust your choices before continuing."}
            </p>
          </div>
        )}

        {isFinalRound && canContinue && (
          <div className="rounded-lg bg-primary/10 border border-primary/20 p-4">
            <p className="text-sm text-foreground text-pretty">
              These three will be saved as your <span className="font-semibold">core values</span>. The full set you
              chose at the start will also be kept as part of your wider values picture.
            </p>
          </div>
        )}

        <StepButtonFooter
          onBack={handleBack}
          onNext={handleNext}
          disabled={!canContinue}
          nextText={isFinalRound ? "Confirm core values" : "Continue narrowing"}
        />
      </CardContent>
    </Card>
  )
}
