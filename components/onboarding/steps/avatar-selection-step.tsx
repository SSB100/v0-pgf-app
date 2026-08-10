"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Check } from "lucide-react"
import Image from "next/image"
import type { OnboardingData } from "../onboarding-flow"
import { StepButtonFooter } from "./step-button-footer"
import { AVATAR_OPTIONS } from "@/lib/onboarding-data"

interface AvatarSelectionStepProps {
  data: OnboardingData
  updateData: (data: Partial<OnboardingData>) => void
  onNext: () => void
  onBack: () => void
}

export default function AvatarSelectionStep({ data, updateData, onNext, onBack }: AvatarSelectionStepProps) {
  const [selectedAvatar, setSelectedAvatar] = useState<string>(data.growthAvatar || "growth_tree")

  const handleNext = () => {
    updateData({ growthAvatar: selectedAvatar })
    onNext()
  }

  return (
    <Card className="border-border/50 bg-gradient-to-br from-card to-secondary/30 soft-shadow">
      <CardContent className="p-6 sm:p-8 space-y-6">
        <div className="text-center space-y-3">
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Choose Your Growth Companion
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto text-pretty">
            Your Growth Companion is a visual representation of your progress. As you build skills, complete check-ins, and take steps toward your values, your companion evolves alongside you — a reminder that change is real and cumulative.
          </p>
          <p className="text-xs text-muted-foreground max-w-xl mx-auto text-pretty">
            Choose the one that feels like you — the qualities it represents are the ones you're growing into.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {AVATAR_OPTIONS.map((avatar) => (
            <button
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

        <div className="bg-muted/50 rounded-lg p-4 border border-border/30">
          <p className="text-xs text-muted-foreground text-center text-pretty">
            Don't worry, you can change your avatar later in your settings if you'd like to try a different one. Your
            progress and level will carry over.
          </p>
        </div>

        <div className="flex gap-3 pt-4">
          <StepButtonFooter onBack={onBack} onNext={handleNext} />
        </div>
      </CardContent>
    </Card>
  )
}
