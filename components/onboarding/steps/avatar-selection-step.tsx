"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Check, Sparkles } from "lucide-react"
import Image from "next/image"
import type { OnboardingData } from "../onboarding-flow"
import { StepButtonFooter } from "./step-button-footer"
import { AVATAR_OPTIONS } from "@/lib/onboarding-data"
import { NO_COMPANION_ID } from "@/lib/waypoint-preferences-policy.mjs"

interface AvatarSelectionStepProps {
  data: OnboardingData
  updateData: (data: Partial<OnboardingData>) => void
  onNext: () => void
  onBack: () => void
}

export default function AvatarSelectionStep({ data, updateData, onNext, onBack }: AvatarSelectionStepProps) {
  const [selectedAvatar, setSelectedAvatar] = useState<string>(data.growthAvatar || "")

  const handleNext = () => {
    if (!selectedAvatar) return
    updateData({ growthAvatar: selectedAvatar })
    onNext()
  }

  return (
    <Card className="border-border/50 bg-gradient-to-br from-card to-secondary/30 soft-shadow">
      <CardContent className="p-6 sm:p-8 space-y-6">
        <div className="text-center space-y-3">
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Choose How You Want to See Progress
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto text-pretty">
            Your growth display is optional. You can use a Growth Companion or keep a Progress only view. Both use the same Growth Credits, engagement levels and milestones.
          </p>
          <p className="text-xs text-muted-foreground max-w-xl mx-auto text-pretty">
            This reflects your activity in Waypoint. It is not a measure of recovery, health or personal worth, and you can switch later without resetting your progress.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setSelectedAvatar(NO_COMPANION_ID)}
          className={`w-full text-left p-4 rounded-lg border-2 transition-all hover:scale-[1.01] ${
            selectedAvatar === NO_COMPANION_ID
              ? "border-primary bg-primary/5 shadow-lg"
              : "border-border/50 bg-card/50 hover:border-primary/50"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="flex w-20 h-20 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
              <Sparkles className="w-7 h-7 text-primary" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-foreground">Progress only</h3>
                {selectedAvatar === NO_COMPANION_ID && <Check className="w-5 h-5 text-primary flex-shrink-0" strokeWidth={3} />}
              </div>
              <p className="text-xs text-primary/70 font-medium">No character or creature</p>
              <p className="text-xs text-muted-foreground text-pretty">
                Keep your credits, engagement levels and milestones without using a Growth Companion.
              </p>
            </div>
          </div>
        </button>

        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Fantasy Companions</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {AVATAR_OPTIONS.map((avatar) => (
              <button
                type="button"
                key={avatar.id}
                onClick={() => setSelectedAvatar(avatar.id)}
                className={`text-left p-4 rounded-lg border-2 transition-all hover:scale-[1.02] ${
                  selectedAvatar === avatar.id
                    ? "border-primary bg-primary/5 shadow-lg"
                    : "border-border/50 bg-card/50 hover:border-primary/50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                    <Image
                      src={avatar.previewImage || "/placeholder.svg"}
                      alt={avatar.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-foreground">{avatar.name}</h3>
                      {selectedAvatar === avatar.id && (
                        <Check className="w-5 h-5 text-primary flex-shrink-0" strokeWidth={3} />
                      )}
                    </div>
                    <p className="text-xs text-primary/70 font-medium">{avatar.theme}</p>
                    <p className="text-xs text-muted-foreground text-pretty">{avatar.description}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {avatar.stages.map((stage, idx) => (
                        <span key={idx} className="text-[10px] px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                          {stage}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 border border-border/30">
          <p className="text-xs text-muted-foreground text-center text-pretty">
            You can change between Progress only and a Growth Companion later in Settings. Your existing progress, credits and level carry over.
          </p>
        </div>

        <StepButtonFooter onBack={onBack} onNext={handleNext} disabled={!selectedAvatar} />
      </CardContent>
    </Card>
  )
}
