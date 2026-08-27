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
    <Card className="gap-3 border-border/50 bg-gradient-to-br from-card to-secondary/30 py-4 soft-shadow sm:gap-6 sm:py-6">
      <CardContent className="space-y-3 px-4 sm:space-y-6 sm:px-8">
        <div className="space-y-1.5 text-center sm:space-y-3">
          <h2 className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-xl font-bold text-transparent sm:text-3xl">
            Choose How You Want to See Progress
          </h2>
          <p className="mx-auto max-w-2xl text-xs text-muted-foreground text-pretty sm:text-base">
            Use a Growth Companion or keep a Progress only view. Both use the same Growth Credits, engagement levels and milestones.
          </p>
          <p className="mx-auto max-w-xl text-[11px] leading-snug text-muted-foreground text-pretty sm:text-xs">
            This reflects activity in Waypoint, not recovery, health or personal worth. You can switch later without resetting progress.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setSelectedAvatar(NO_COMPANION_ID)}
          aria-pressed={selectedAvatar === NO_COMPANION_ID}
          className={`w-full rounded-xl border-2 p-2.5 text-left transition-all sm:p-4 ${
            selectedAvatar === NO_COMPANION_ID
              ? "border-primary bg-primary/5 shadow-md"
              : "border-border/50 bg-card/50 hover:border-primary/50"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 sm:size-20">
              <Sparkles className="size-5 text-primary sm:size-7" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-foreground">Progress only</h3>
                {selectedAvatar === NO_COMPANION_ID && <Check className="size-4 shrink-0 text-primary sm:size-5" strokeWidth={3} />}
              </div>
              <p className="text-[11px] font-medium text-primary/70 sm:text-xs">No character or creature</p>
              <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground text-pretty sm:text-xs">
                Keep credits, levels and milestones without using a companion.
              </p>
            </div>
          </div>
        </button>

        <div className="space-y-2">
          <div className="flex items-end justify-between gap-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground sm:text-xs">Growth Companions</p>
            <p className="text-[10px] text-muted-foreground sm:hidden">Swipe to browse</p>
          </div>

          <div className="-mx-1 flex snap-x snap-mandatory gap-2 overflow-x-auto px-1 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:px-0 sm:pb-0">
            {AVATAR_OPTIONS.map((avatar) => {
              const isSelected = selectedAvatar === avatar.id
              return (
                <button
                  type="button"
                  key={avatar.id}
                  onClick={() => setSelectedAvatar(avatar.id)}
                  aria-pressed={isSelected}
                  className={`min-w-[164px] snap-start rounded-xl border-2 p-2.5 text-left transition-all sm:min-w-0 sm:p-4 ${
                    isSelected
                      ? "border-primary bg-primary/5 shadow-md"
                      : "border-border/50 bg-card/50 hover:border-primary/50"
                  }`}
                >
                  <div className="relative h-24 w-full overflow-hidden rounded-lg bg-muted sm:h-20 sm:w-20 sm:float-left sm:mr-3">
                    <Image
                      src={avatar.previewImage || "/placeholder.svg"}
                      alt={avatar.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 639px) 164px, 80px"
                    />
                  </div>

                  <div className="mt-2 min-w-0 sm:mt-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-bold leading-tight text-foreground">{avatar.name}</h3>
                      {isSelected && <Check className="size-4 shrink-0 text-primary sm:size-5" strokeWidth={3} />}
                    </div>
                    <p className="mt-0.5 text-[10px] font-medium text-primary/70 sm:text-xs">{avatar.theme}</p>
                    <p className="mt-1 line-clamp-2 text-[10px] leading-snug text-muted-foreground text-pretty sm:text-xs">{avatar.description}</p>
                    <span className="mt-1.5 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-medium text-primary sm:hidden">
                      Starts as {avatar.stages[0]}
                    </span>
                    <div className="mt-2 hidden flex-wrap gap-1 sm:flex">
                      {avatar.stages.map((stage, idx) => (
                        <span key={idx} className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] text-primary">
                          {stage}
                        </span>
                      ))}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <div className="rounded-lg border border-border/30 bg-muted/50 px-3 py-2">
          <p className="text-center text-[10px] leading-snug text-muted-foreground text-pretty sm:text-xs">
            Change this later in Settings. Existing progress, credits and levels carry over.
          </p>
        </div>

        <StepButtonFooter onBack={onBack} onNext={handleNext} disabled={!selectedAvatar} />
      </CardContent>
    </Card>
  )
}
