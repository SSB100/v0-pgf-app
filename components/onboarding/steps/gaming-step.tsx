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
    if (skipInitialQuestion) setPlaysGames(true)
  }, [skipInitialQuestion])

  function handleNext() {
    if (playsGames === false) {
      updateData({ playsVideoGames: false })
      onNext()
      return
    }

    updateData({
      playsVideoGames: true,
      gamingFrequency,
      gamingImpact,
      lootBoxExposure,
      inGamePurchases,
    })
    onNext()
  }

  const canContinue = playsGames === false || (playsGames && gamingFrequency && gamingImpact && lootBoxExposure && inGamePurchases)

  return (
    <Card className="soft-shadow-lg border-border/50">
      <CardHeader>
        <CardTitle className="text-2xl text-foreground">Gaming and In-Game Spending</CardTitle>
        <p className="text-muted-foreground text-pretty">
          These questions help Waypoint understand whether gaming, chance-based rewards or in-game spending are relevant to you. They are for personalisation, not a diagnosis or risk score.
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {!skipInitialQuestion && (
          <div className="space-y-3">
            <Label className="text-lg font-semibold text-foreground">Do you play video games?</Label>
            <p className="text-sm text-muted-foreground">
              This includes console, computer and mobile games. Gambling websites and betting services are covered separately.
            </p>
            <div className="space-y-2">
              {[{ value: true, label: "Yes" }, { value: false, label: "No" }].map((option) => (
                <button key={option.label} type="button" onClick={() => setPlaysGames(option.value)} className={`w-full p-3 rounded-lg border-2 text-left font-medium transition-all ${playsGames === option.value ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-foreground hover:border-primary/50"}`}>
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {playsGames === true && (
          <>
            <div className="space-y-2">
              <Label className="text-lg font-semibold text-foreground">How often do you usually play?</Label>
              <div className="space-y-1.5">
                {["Rarely", "1–2 times a week", "3–5 times a week", "Daily", "More than once most days"].map((option) => (
                  <button key={option} type="button" onClick={() => setGamingFrequency(option)} className={`w-full px-3 py-2 rounded-lg border-2 text-left text-sm font-medium transition-all ${gamingFrequency === option ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-foreground hover:border-primary/50"}`}>
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-lg font-semibold text-foreground">How much, if at all, has gaming affected other parts of your life?</Label>
              <p className="text-sm text-muted-foreground">You might think about time, sleep, relationships, work or study, responsibilities, or spending.</p>
              <div className="space-y-1.5">
                {["No noticeable impact", "A small impact", "A moderate impact", "A significant impact"].map((option) => (
                  <button key={option} type="button" onClick={() => setGamingImpact(option)} className={`w-full px-3 py-2 rounded-lg border-2 text-left text-sm font-medium transition-all ${gamingImpact === option ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-foreground hover:border-primary/50"}`}>
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-lg font-semibold text-foreground">Have games you play included loot boxes or similar randomised rewards?</Label>
              <p className="text-sm text-muted-foreground">These are rewards whose contents are not known before they are opened, and some games allow them to be bought with money or in-game currency.</p>
              <div className="space-y-1.5">
                {["I have not encountered them", "Yes, but I have not bought them", "Yes, I have bought them occasionally", "Yes, I have bought them regularly"].map((option) => (
                  <button key={option} type="button" onClick={() => setLootBoxExposure(option)} className={`w-full px-3 py-2 rounded-lg border-2 text-left text-sm font-medium transition-all ${lootBoxExposure === option ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-foreground hover:border-primary/50"}`}>
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-lg font-semibold text-foreground">About how much do you spend on in-game purchases in a typical month?</Label>
              <div className="space-y-1.5">
                {["Nothing", "Less than NZ$20", "NZ$20–50", "NZ$51–100", "More than NZ$100"].map((option) => (
                  <button key={option} type="button" onClick={() => setInGamePurchases(option)} className={`w-full px-3 py-2 rounded-lg border-2 text-left text-sm font-medium transition-all ${inGamePurchases === option ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-foreground hover:border-primary/50"}`}>
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-info/10 border border-info/20 rounded-lg p-4">
              <p className="text-sm text-foreground text-pretty">
                Some games include paid or chance-based features that can feel relevant to gambling or spending concerns. Waypoint records what you report so you can decide whether these patterns matter to the goals you have chosen.
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
