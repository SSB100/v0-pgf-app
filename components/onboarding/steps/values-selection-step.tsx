"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { OnboardingData } from "../onboarding-flow"
import { VALUE_DOMAINS } from "@/lib/onboarding-data"
import { StepButtonFooter } from "./step-button-footer"

interface ValuesSelectionStepProps {
  data: OnboardingData
  updateData: (data: Partial<OnboardingData>) => void
  onNext: () => void
  onBack: () => void
}

const MINIMUM_VALUES = 3
const RECOMMENDED_VALUES = 8

export default function ValuesSelectionStep({ data, updateData, onNext, onBack }: ValuesSelectionStepProps) {
  const [selectedValues, setSelectedValues] = useState<string[]>(data.initialValuesShortlist || [])
  const [showSelectionDialog, setShowSelectionDialog] = useState(false)

  function toggleValue(value: string) {
    if (selectedValues.includes(value)) {
      setSelectedValues((previous) => previous.filter((item) => item !== value))
    } else {
      setSelectedValues((previous) => [...previous, value])
    }
  }

  function prepareRefinement() {
    updateData({
      initialValuesShortlist: selectedValues,
      secondRoundValues: [],
      selectedValues: [],
    })
  }

  function handleNext() {
    prepareRefinement()

    if (selectedValues.length < RECOMMENDED_VALUES) {
      setShowSelectionDialog(true)
      return
    }

    onNext()
  }

  function handleContinueAnyway() {
    if (selectedValues.length < MINIMUM_VALUES) return
    setShowSelectionDialog(false)
    onNext()
  }

  function handleSelectMore() {
    setShowSelectionDialog(false)
  }

  const canContinue = selectedValues.length > 0
  const belowMinimum = selectedValues.length < MINIMUM_VALUES

  return (
    <>
      <Card className="gap-3 border-border/50 py-4 soft-shadow-lg sm:gap-6 sm:py-6">
        <CardHeader className="gap-1.5 px-4 sm:gap-2 sm:px-6">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <CardTitle className="text-xl text-foreground sm:text-2xl">The Life Garden: Choose Your Values</CardTitle>
              <p className="mt-1 text-xs text-muted-foreground text-pretty sm:text-sm">
                Start broad. You will narrow these down gradually in the next part of the exercise.
              </p>
            </div>
            <span className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-bold ${canContinue ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
              {selectedValues.length} selected
            </span>
          </div>
        </CardHeader>

        <CardContent className="space-y-3 px-4 sm:space-y-4 sm:px-6">
          <div className="rounded-lg border border-info/20 bg-info/10 p-2.5 sm:p-4">
            <p className="text-xs text-foreground text-pretty sm:text-sm">
              Choose anything that makes you think, “Yes, that matters to me.” You do not need to rank anything yet.
            </p>
          </div>

          <div className="space-y-2.5 sm:space-y-4">
            {VALUE_DOMAINS.map((domain) => (
              <div key={domain.domain}>
                <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground sm:hidden">
                  {domain.icon} {domain.domain}
                </p>
                <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 sm:gap-2 lg:grid-cols-4">
                  {domain.values.map((value) => {
                    const isSelected = selectedValues.includes(value)
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => toggleValue(value)}
                        aria-pressed={isSelected}
                        className={`min-h-9 rounded-lg border px-2 py-1.5 text-xs font-medium transition-all sm:min-h-0 sm:px-3 sm:py-2 ${
                          isSelected
                            ? "border-primary bg-primary text-primary-foreground shadow-sm"
                            : "border-border bg-card text-foreground hover:border-primary/50"
                        }`}
                      >
                        <span className="sm:hidden">{value}</span>
                        <span className="hidden flex-col items-center gap-1 sm:flex">
                          <span className="text-sm" aria-hidden="true">{domain.icon}</span>
                          <span>{value}</span>
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-lg border border-border/70 bg-muted/25 px-3 py-2 text-center text-[11px] leading-snug text-muted-foreground sm:text-sm">
            You will keep narrowing this list until three core values remain. Nothing you set aside is treated as unimportant.
          </div>

          <StepButtonFooter onBack={onBack} onNext={handleNext} disabled={!canContinue} />
        </CardContent>
      </Card>

      <Dialog open={showSelectionDialog} onOpenChange={setShowSelectionDialog}>
        <DialogContent className="max-h-[85dvh] max-w-lg overflow-y-auto p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">
              {belowMinimum ? "Choose at least 3 values" : "Want a broader starting garden?"}
            </DialogTitle>
            <DialogDescription className="pt-1 text-sm sm:pt-2 sm:text-base">
              {belowMinimum
                ? `You have selected ${selectedValues.length}. The Life Garden finishes with three core values, so choose at least three before continuing.`
                : `You have selected ${selectedValues.length} values. You can continue now, or choose a few more if they also feel meaningful to you.`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 sm:space-y-4 sm:py-4">
            <p className="text-sm text-foreground/90 text-pretty">
              Values are qualities or directions that matter to you, such as honesty, connection, curiosity, health or creativity. They are not goals you have to complete perfectly.
            </p>

            {!belowMinimum && (
              <div className="rounded-lg border border-primary/20 bg-primary/10 p-3 sm:p-4">
                <p className="text-sm font-medium text-foreground">A broader starting list can make the narrowing exercise more useful, but you do not need to force extra choices.</p>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <Button type="button" variant="outline" onClick={handleSelectMore} className="flex-1 bg-transparent">
              Select more
            </Button>
            {!belowMinimum && (
              <Button
                type="button"
                onClick={handleContinueAnyway}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Continue with {selectedValues.length}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
