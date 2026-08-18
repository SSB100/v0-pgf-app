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
      <Card className="soft-shadow-lg border-border/50">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl text-foreground">The Life Garden: Choose Your Values</CardTitle>
          <p className="text-xs sm:text-sm text-muted-foreground text-pretty">
            Start broad. You will narrow these down gradually in the next part of the exercise.
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="bg-info/10 border border-info/20 rounded-lg p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-foreground text-pretty">
              Choose anything that makes you think, "Yes, that matters to me." There is no need to rank them yet. The
              next rounds will help you compare the values you chose and gradually narrow them to three core values.
            </p>
          </div>

          {VALUE_DOMAINS.map((domain) => (
            <div key={domain.domain} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {domain.values.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => toggleValue(value)}
                  className={`px-3 py-2 text-xs rounded-lg border transition-all font-medium flex flex-col items-center gap-1 ${
                    selectedValues.includes(value)
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-foreground border-border hover:border-primary/50"
                  }`}
                >
                  <span className="text-sm" aria-hidden="true">{domain.icon}</span>
                  <span>{value}</span>
                </button>
              ))}
            </div>
          ))}

          <div className="sticky bottom-0 bg-card/95 backdrop-blur-sm border-t border-border pt-3 -mx-6 px-4 sm:px-6 -mb-6 pb-6">
            <div
              className={`text-xs sm:text-sm text-center mb-3 font-medium ${canContinue ? "text-primary" : "text-muted-foreground"}`}
            >
              {selectedValues.length} selected
            </div>
            <StepButtonFooter onBack={onBack} onNext={handleNext} disabled={!canContinue} />
          </div>
        </CardContent>
      </Card>

      <Dialog open={showSelectionDialog} onOpenChange={setShowSelectionDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {belowMinimum ? "Choose at least 3 values" : "Want a broader starting garden?"}
            </DialogTitle>
            <DialogDescription className="text-base pt-2">
              {belowMinimum
                ? `You have selected ${selectedValues.length}. The Life Garden finishes with three core values, so choose at least three before continuing.`
                : `You have selected ${selectedValues.length} values. You can continue now, or choose a few more if they also feel meaningful to you.`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="text-sm text-foreground/90 space-y-3">
              <p className="text-pretty">
                Values are qualities or directions that matter to you, such as honesty, connection, curiosity, health or
                creativity. They are not goals you have to complete or standards you have to meet perfectly.
              </p>
              {!belowMinimum && (
                <p className="text-pretty">
                  Starting with around {RECOMMENDED_VALUES} or more can make the narrowing exercise more useful because
                  you get to compare several things that genuinely matter to you.
                </p>
              )}
            </div>

            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
              <p className="text-sm font-medium text-foreground mb-2">If you want to look again, consider:</p>
              <ul className="text-sm text-foreground/90 space-y-1">
                <li>• How you want to show up in your relationships and whānau</li>
                <li>• The qualities you want to bring to difficult moments</li>
                <li>• What supports your wellbeing and sense of balance</li>
                <li>• What gives your life meaning, curiosity or direction</li>
              </ul>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <Button type="button" variant="outline" onClick={handleSelectMore} className="flex-1 bg-transparent">
              Select More Values
            </Button>
            {!belowMinimum && (
              <Button
                type="button"
                onClick={handleContinueAnyway}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
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
