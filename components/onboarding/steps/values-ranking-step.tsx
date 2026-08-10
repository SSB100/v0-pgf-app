"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GripVertical } from "lucide-react"
import type { OnboardingData } from "../onboarding-flow"
import { VALUE_DOMAINS } from "@/lib/onboarding-data"
import { StepButtonFooter } from "./step-button-footer"

interface ValuesRankingStepProps {
  data: OnboardingData
  updateData: (data: Partial<OnboardingData>) => void
  onNext: () => void
  onBack: () => void
}

export default function ValuesRankingStep({ data, updateData, onNext, onBack }: ValuesRankingStepProps) {
  const [rankedValues, setRankedValues] = useState<string[]>(
    data.secondRoundValues || data.initialValuesShortlist || [],
  )
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  function handleDragStart(index: number) {
    setDraggedIndex(index)
  }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return

    const newValues = [...rankedValues]
    const draggedValue = newValues[draggedIndex]
    newValues.splice(draggedIndex, 1)
    newValues.splice(index, 0, draggedValue)
    setRankedValues(newValues)
    setDraggedIndex(index)
  }

  function handleDragEnd() {
    setDraggedIndex(null)
  }

  function moveUp(index: number) {
    if (index === 0) return
    const newValues = [...rankedValues]
    ;[newValues[index], newValues[index - 1]] = [newValues[index - 1], newValues[index]]
    setRankedValues(newValues)
  }

  function moveDown(index: number) {
    if (index === rankedValues.length - 1) return
    const newValues = [...rankedValues]
    ;[newValues[index], newValues[index + 1]] = [newValues[index + 1], newValues[index]]
    setRankedValues(newValues)
  }

  function handleNext() {
    const valuesData = rankedValues.map((name, index) => {
      const domain = VALUE_DOMAINS.find((d) => d.values.includes(name))
      return {
        name,
        importance: 8 - index,
        category: domain?.domain || "other",
      }
    })

    updateData({ selectedValues: valuesData })
    onNext()
  }

  return (
    <Card className="soft-shadow-lg border-border/50 w-full max-w-4xl mx-auto">
      <CardHeader className="px-4 sm:px-6">
        <CardTitle className="text-xl sm:text-2xl text-foreground">Rank Your Core Values</CardTitle>
        <p className="text-sm sm:text-base text-muted-foreground text-pretty">
          Drag to reorder from most important (top) to least important (bottom)
        </p>
      </CardHeader>

      <CardContent className="space-y-3 sm:space-y-4 px-4 sm:px-6">
        <div className="bg-info/10 border border-info/20 rounded-lg p-3 sm:p-4">
          <p className="text-xs sm:text-sm text-foreground text-pretty">
            <span className="font-semibold">Tip:</span> Drag or use arrows to reorder. This highlights your compass values—the ones guiding your decisions.
          </p>
        </div>

        <div className="space-y-2">
          {rankedValues.map((value, index) => (
            <div
              key={value}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`flex items-center gap-2 sm:gap-3 bg-card border border-border rounded-lg p-2 sm:p-3 cursor-move hover:border-primary/50 transition-all ${
                draggedIndex === index ? "opacity-50" : ""
              }`}
            >
              <GripVertical className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="text-base sm:text-lg font-bold text-primary">#{index + 1}</span>
                  <span className="text-sm sm:text-base font-medium text-foreground">{value}</span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => moveUp(index)}
                  disabled={index === 0}
                  className="h-5 px-1.5 text-xs"
                >
                  ↑
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => moveDown(index)}
                  disabled={index === rankedValues.length - 1}
                  className="h-5 px-1.5 text-xs"
                >
                  ↓
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-secondary/50 rounded-lg p-3 sm:p-4 mt-4">
          <p className="text-xs sm:text-sm text-foreground/90 text-pretty italic">
            "Values at the bottom aren't less important—they guide your decisions and authentic living."
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4 w-full">
          <StepButtonFooter onBack={onBack} onNext={handleNext} />
        </div>
      </CardContent>
    </Card>
  )
}
