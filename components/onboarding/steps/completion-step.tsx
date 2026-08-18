"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { OnboardingData } from "../onboarding-flow"
import { StepButtonFooter } from "./step-button-footer"
import { AVATAR_OPTIONS } from "@/lib/onboarding-data"
import { supportResources } from "@/lib/support-resources"

interface CompletionStepProps {
  data: OnboardingData
  onComplete: () => void
  onBack: () => void
}

export default function CompletionStep({ data, onComplete, onBack }: CompletionStepProps) {
  const perceivedStrengths = data.perceivedStrengths || []
  const identifiedStrengths = data.identifiedStrengths || []
  const inBothStrengths = identifiedStrengths.filter((s) => perceivedStrengths.includes(s))

  const hasRecentSafetyConcern =
    data.selfHarmThoughts === "Frequently" ||
    data.selfHarmActions === "Yes, recently" ||
    data.suicidalThoughts === "Yes, recently or currently"

  const getValueName = (value: any) => (typeof value === "string" ? value : value?.name || String(value))

  return (
    <Card className="soft-shadow-lg border-border/50 bg-gradient-to-br from-card via-card/95 to-secondary/5 w-full max-w-4xl mx-auto">
      <CardHeader className="space-y-4 px-4 sm:px-6">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-primary via-secondary to-primary shadow-lg">
            <svg className="w-12 h-12 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div>
            <CardTitle className="text-4xl font-bold text-foreground bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              Your Waypoint Is Set Up
            </CardTitle>
            <p className="text-muted-foreground text-pretty mt-3 text-lg">
              Here's a summary of some of the information you chose during onboarding.
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5 px-4 sm:px-6 pb-6 sm:pb-8">
        {data.growthAvatar && (() => {
          const companion = AVATAR_OPTIONS.find((a) => a.id === data.growthAvatar)
          if (!companion) return null
          return (
            <div className="bg-card border-2 border-primary/30 rounded-xl p-5 shadow-sm">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Your Growth Companion</p>
              <div className="flex items-center gap-4">
                <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-muted">
                  <Image src={companion.previewImage} alt={companion.name} fill className="object-cover" />
                </div>
                <div className="space-y-1 flex-1 min-w-0">
                  <p className="font-bold text-foreground text-base">{companion.name}</p>
                  <p className="text-xs text-primary/70 font-medium">{companion.theme}</p>
                  <p className="text-xs text-muted-foreground text-pretty">{companion.description}</p>
                  <span className="inline-block text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20 mt-1">Starting stage: {companion.stages[0]}</span>
                </div>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">Your companion reflects activity in Waypoint. Its level is not a clinical measure of recovery or wellbeing.</p>
            </div>
          )
        })()}

        {data.selectedValues.length > 0 && (
          <div className="bg-card border-2 border-primary/30 rounded-xl p-5 shadow-sm">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Values You Chose</p>
            <div className="flex flex-wrap gap-2">
              {data.selectedValues.map((value, index) => (
                <span key={`${getValueName(value)}-${index}`} className={`px-3 py-1.5 rounded-full text-sm font-semibold ${index < 3 ? "bg-primary text-primary-foreground" : "bg-secondary/20 text-foreground border border-secondary/30"}`}>
                  {index < 3 && `${index + 1}. `}{getValueName(value)}
                </span>
              ))}
            </div>
          </div>
        )}

        {(perceivedStrengths.length > 0 || identifiedStrengths.length > 0) && (
          <div className="bg-card border-2 border-secondary/30 rounded-xl p-5 shadow-sm space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Strengths You Identified</p>
            {inBothStrengths.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-primary">Selected in more than one strengths exercise</p>
                <div className="flex flex-wrap gap-2">{inBothStrengths.map((s) => <span key={s} className="px-3 py-1.5 rounded-full text-sm font-medium bg-primary/20 text-foreground border border-primary/30">{s}</span>)}</div>
              </div>
            )}
            {identifiedStrengths.filter((s) => !perceivedStrengths.includes(s)).length > 0 && (
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">{identifiedStrengths.filter((s) => !perceivedStrengths.includes(s)).map((s) => <span key={s} className="px-3 py-1.5 rounded-full text-sm font-medium bg-secondary/10 text-foreground border border-secondary/20">{s}</span>)}</div>
              </div>
            )}
          </div>
        )}

        <div className="bg-card/80 rounded-xl p-4 border border-border">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">What happens next</p>
          <p className="text-sm text-foreground/90 leading-relaxed">
            Your answers will personalise parts of the dashboard, check-ins and journey content. They describe what you reported today; they are not a diagnosis or a score of how well you are doing.
          </p>
        </div>

        {hasRecentSafetyConcern && (
          <div className="border-2 border-amber-500/30 rounded-xl p-5 space-y-3 bg-amber-500/5">
            <p className="text-sm font-semibold text-foreground">Support is available</p>
            <p className="text-sm text-foreground/90 leading-relaxed">
              You reported a recent safety concern. Waypoint does not assess your level of risk or notify someone automatically. If you are worried about your safety, call or text {supportResources.emotionalSupport.phone} for free support. If you or someone else is in immediate danger, call {supportResources.emergency.phone} or go to the nearest hospital emergency department.
            </p>
            <Link href="/support" className="inline-block text-sm font-semibold text-primary underline underline-offset-2">View support options</Link>
          </div>
        )}

        <div className="bg-primary/10 border-2 border-primary/40 rounded-2xl p-6 text-center space-y-3 shadow-lg">
          <h3 className="text-xl font-bold text-foreground">Continue When You're Ready</h3>
          <p className="text-sm text-foreground/90 text-pretty leading-relaxed max-w-md mx-auto">
            Your dashboard includes optional check-ins, self-guided modules, practical safeguards, your Growth Companion and community features. You do not need to use everything at once.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 w-full">
          <StepButtonFooter onBack={onBack} onNext={onComplete} />
        </div>
      </CardContent>
    </Card>
  )
}
