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

export default function ValuesSelectionStep({ data, updateData, onNext, onBack }: ValuesSelectionStepProps) {
  const [selectedValues, setSelectedValues] = useState<string[]>(data.initialValuesShortlist || [])
  const [showEncouragementDialog, setShowEncouragementDialog] = useState(false)

  function toggleValue(value: string) {
    if (selectedValues.includes(value)) {
      setSelectedValues((prev) => prev.filter((v) => v !== value))
    } else {
      setSelectedValues((prev) => [...prev, value])
    }
  }

  function handleNext() {
    updateData({ initialValuesShortlist: selectedValues })

    if (selectedValues.length < 8) {
      setShowEncouragementDialog(true)
    } else {
      onNext()
    }
  }

  function handleContinueAnyway() {
    setShowEncouragementDialog(false)
    onNext()
  }

  function handleSelectMore() {
    setShowEncouragementDialog(false)
  }

  const canContinue = selectedValues.length > 0

  return (
    <>
      <Card className="soft-shadow-lg border-border/50">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl text-foreground">The Life Garden: Round 1</CardTitle>
          <p className="text-xs sm:text-sm text-muted-foreground text-pretty">
            Select values that resonate with you
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="bg-info/10 border border-info/20 rounded-lg p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-foreground text-pretty">
              Choose the values that make you think "Yes, that matters to me." Don't overthink it—select as many as feel right.
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
                  <span className="text-sm">{domain.icon}</span>
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

      <Dialog open={showEncouragementDialog} onOpenChange={setShowEncouragementDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl">You Deserve More Values in Your Life</DialogTitle>
            <DialogDescription className="text-base pt-2">
              You've selected {selectedValues.length} {selectedValues.length === 1 ? "value" : "values"} so far. That's
              a start, but let's explore a bit more.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="text-sm text-foreground/90 space-y-3">
              <p className="text-pretty">
                <span className="font-semibold">Understanding Values:</span> Values aren't goals or feelings—they're the
                principles and qualities that matter most to you, like kindness, honesty, connection, or growth.
              </p>

              <p className="text-pretty">
                <span className="font-semibold">Why Multiple Values?</span> Life is rich and multifaceted. We need
                values across different areas—relationships, personal growth, health, character, and purpose. Each value
                supports a different part of who you want to be.
              </p>

              <p className="text-pretty">
                <span className="font-semibold">You Deserve This:</span> Having strong values isn't selfish—it's
                essential. When you know what matters to you, you can make choices that lead to a life you're proud of.
              </p>
            </div>

            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
              <p className="text-sm font-medium text-foreground mb-2">Think about:</p>
              <ul className="text-sm text-foreground/90 space-y-1">
                <li>• What kind of friend, family member, or partner do you want to be?</li>
                <li>• What personal qualities would make you feel proud?</li>
                <li>• How do you want to treat yourself and others?</li>
                <li>• What gives your life meaning and direction?</li>
              </ul>
            </div>

            <p className="text-sm font-medium text-center text-primary">
              We encourage you to select at least 8 values to create a strong foundation for your journey.
            </p>
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <Button type="button" variant="outline" onClick={handleSelectMore} className="flex-1 bg-transparent">
              Select More Values
            </Button>
            <Button
              type="button"
              onClick={handleContinueAnyway}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Continue Anyway
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
