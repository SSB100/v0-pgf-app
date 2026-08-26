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
      <Card className="mx-auto w-full max-w-4xl gap-3 border-border/50 py-4 soft-shadow-lg sm:gap-6 sm:py-6">
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-xl text-foreground sm:text-2xl">The Life Garden</CardTitle>
          <p className="text-sm text-muted-foreground">Choose at least 3 values before refining your garden.</p>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <StepButtonFooter onBack={onBack} onNext={onBack} nextText="Return to values" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mx-auto w-full max-w-4xl gap-3 border-border/50 py-4 soft-shadow-lg sm:gap-6 sm:py-6">
      <CardHeader className="gap-1.5 px-4 sm:gap-2 sm:px-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <CardTitle className="text-xl text-foreground sm:text-2xl">
              The Life Garden: {currentPool.length <= 3 ? "Your Core Values" : "Narrowing the Garden"}
            </CardTitle>
            <p className="mt-1 text-xs text-muted-foreground text-pretty sm:text-base">
              {currentPool.length <= 3
                ? "You have narrowed your garden to three core values."
                : `Keep ${targetCount} of the ${currentPool.length} values in this round.`}
            </p>
          </div>
          {currentPool.length > 3 && (
            <span className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-bold ${canContinue ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
              {keptValues.length}/{targetCount}
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-3 px-4 sm:space-y-5 sm:px-6">
        <div className="space-y-1 rounded-lg border border-info/20 bg-info/10 p-2.5 sm:space-y-2 sm:p-4">
          <p className="text-xs text-foreground text-pretty sm:text-sm">
            All {initialValues.length} values still matter. This step simply helps you notice which ones feel most central when you have to choose.
          </p>
          {currentPool.length > 3 && (
            <p className="text-xs font-semibold text-foreground sm:text-sm">
              Tap {valuesToSetAside === 1 ? "1 value" : `${valuesToSetAside} values`} to set aside. You can change your mind before continuing.
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 sm:gap-2">
          {currentPool.map((value) => {
            const domain = getValueDomain(value)
            const isKept = keptValues.includes(value)

            return (
              <button
                key={value}
                type="button"
                onClick={() => toggleValue(value)}
                aria-pressed={isKept}
                className={`flex min-h-[58px] flex-col items-center justify-center gap-0.5 rounded-lg border-2 px-2 py-2 text-center transition-all sm:min-h-20 sm:gap-1 sm:px-3 sm:py-3 ${
                  isKept
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border bg-muted/40 text-muted-foreground opacity-70"
                }`}
              >
                <span className="text-sm sm:text-lg" aria-hidden="true">{domain?.icon || "🌱"}</span>
                <span className="text-xs font-semibold leading-tight sm:text-sm sm:font-medium">{value}</span>
                <span className="text-[9px] leading-none sm:text-[11px]">{isKept ? "Keep" : "Set aside"}</span>
              </button>
            )
          })}
        </div>

        {currentPool.length > 3 && (
          <div className={`rounded-lg border px-3 py-2 text-center ${canContinue ? "border-primary/25 bg-primary/5" : "border-border bg-secondary/30"}`}>
            <p className="text-xs font-semibold text-foreground sm:text-sm">
              {canContinue ? "This round is ready" : `${remainingToSetAside} more ${remainingToSetAside === 1 ? "value" : "values"} to set aside`}
            </p>
            <p className="mt-0.5 text-[10px] leading-snug text-muted-foreground sm:text-xs">
              {canContinue
                ? valuesAlreadySetAside === valuesToSetAside
                  ? "Continue now or swap choices first."
                  : "You can adjust your choices before continuing."
                : "Nothing is deleted; this is just the narrowing exercise."}
            </p>
          </div>
        )}

        {isFinalRound && canContinue && (
          <div className="rounded-lg border border-primary/20 bg-primary/10 px-3 py-2 sm:p-4">
            <p className="text-xs text-foreground text-pretty sm:text-sm">
              These three will be saved as your <span className="font-semibold">core values</span>. Your broader starting list is kept too.
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
