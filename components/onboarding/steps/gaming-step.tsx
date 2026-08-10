"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import type { OnboardingData } from "../onboarding-flow"
import { StepButtonFooter } from "./step-button-footer"

interface GamingStepProps {
  data: OnboardingData
  updateData: (data: Partial<OnboardingData>) => void
  onNext: () => void
  onBack: () => void
}

export default function GamingStep({ data, updateData, onNext, onBack }: GamingStepProps) {
  const journeyTypes = data.journeyTypes || []
  const skipInitialQuestion = journeyTypes.includes("gaming")

  const [playsGames, setPlaysGames] = useState<boolean | null>(
    skipInitialQuestion ? true : (data.playsVideoGames ?? null),
  )
  const [gamingFrequency, setGamingFrequency] = useState(data.gamingFrequency || "")
  const [gamingImpact, setGamingImpact] = useState(data.gamingImpact || "")
  const [lootBoxExposure, setLootBoxExposure] = useState(data.lootBoxExposure || "")
  const [inGamePurchases, setInGamePurchases] = useState(data.inGamePurchases || "")

  useEffect(() => {
    if (skipInitialQuestion) {
      setPlaysGames(true)
    }
  }, [skipInitialQuestion])

  function handleNext() {
    if (playsGames === false) {
      updateData({ playsVideoGames: false })
      onNext()
    } else {
      updateData({
        playsVideoGames: true,
        gamingFrequency,
        gamingImpact,
        lootBoxExposure,
        inGamePurchases,
      })
      onNext()
    }
  }

  const canContinue =
    playsGames === false || (playsGames && gamingFrequency && gamingImpact && lootBoxExposure && inGamePurchases)

  return (
    <Card className="soft-shadow-lg border-border/50">
      <CardHeader>
        <CardTitle className="text-2xl text-foreground">Online Video Games</CardTitle>
        <p className="text-muted-foreground text-pretty">
          Understanding your gaming habits helps us identify potential risk factors.
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {!skipInitialQuestion && (
          <div className="space-y-3">
            <Label className="text-lg font-semibold text-foreground">Do you play online video games?</Label>
            <p className="text-sm text-muted-foreground">
              This refers to games like Fortnite, FIFA, Call of Duty, League of Legends, etc. Not casino or betting
              sites.
            </p>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setPlaysGames(true)}
                className={`w-full p-3 rounded-lg border-2 text-left font-medium transition-all ${
                  playsGames === true
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-foreground hover:border-primary/50"
                }`}
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => setPlaysGames(false)}
                className={`w-full p-3 rounded-lg border-2 text-left font-medium transition-all ${
                  playsGames === false
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-foreground hover:border-primary/50"
                }`}
              >
                No
              </button>
            </div>
          </div>
        )}

        {playsGames === true && (
          <>
            <div className="space-y-2">
              <Label             className="text-lg font-semibold text-foreground">How often do you play?</Label>
              <div className="space-y-1.5">
                {["Rarely", "1-2 times/week", "3-5 times/week", "Daily", "Multiple times daily"].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setGamingFrequency(option)}
                    className={`w-full px-3 py-2 rounded-lg border-2 text-left text-sm font-medium transition-all ${
                      gamingFrequency === option
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-card text-foreground hover:border-primary/50"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label             className="text-lg font-semibold text-foreground">
                Has gaming ever negatively impacted your life?
              </Label>
              <p className="text-sm text-muted-foreground">
                Consider time spent, relationships, responsibilities, or financial impact.
              </p>
              <div className="space-y-1.5">
                {["No impact", "Minor impact", "Moderate impact", "Significant impact"].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setGamingImpact(option)}
                    className={`w-full px-3 py-2 rounded-lg border-2 text-left text-sm font-medium transition-all ${
                      gamingImpact === option
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-card text-foreground hover:border-primary/50"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label             className="text-lg font-semibold text-foreground">
                Have you encountered loot boxes or mystery rewards in games?
              </Label>
              <p className="text-sm text-muted-foreground">
                These are randomized rewards you can buy or earn in games.
              </p>
              <div className="space-y-1.5">
                {[
                  "Never encountered",
                  "Yes, but never purchased",
                  "Yes, purchased occasionally",
                  "Yes, purchased regularly",
                ].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setLootBoxExposure(option)}
                    className={`w-full px-3 py-2 rounded-lg border-2 text-left text-sm font-medium transition-all ${
                      lootBoxExposure === option
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-card text-foreground hover:border-primary/50"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label             className="text-lg font-semibold text-foreground">
                How much do you typically spend on in-game purchases per month?
              </Label>
              <div className="space-y-1.5">
                {["Nothing", "Less than $20", "$20-$50", "$50-$100", "More than $100"].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setInGamePurchases(option)}
                    className={`w-full px-3 py-2 rounded-lg border-2 text-left text-sm font-medium transition-all ${
                      inGamePurchases === option
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-card text-foreground hover:border-primary/50"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-info/10 border border-info/20 rounded-lg p-4">
              <p className="text-sm text-foreground text-pretty">
                Many modern games include gambling-like features. Being aware of these patterns helps you make informed
                choices about your gaming habits.
              </p>
            </div>
          </>
        )}

        <div className="flex gap-3 pt-2">
          <StepButtonFooter onBack={onBack} onNext={handleNext} disabled={!canContinue} />
        </div>
      </CardContent>
    </Card>
  )
}
