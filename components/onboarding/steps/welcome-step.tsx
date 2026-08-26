"use client"

import { Card, CardContent } from "@/components/ui/card"
import AppLogo from "@/components/layout/app-logo"
import { Heart, Shield, Users, Sparkles, CheckCircle, Star } from "lucide-react"
import { StepButtonFooter } from "./step-button-footer"

interface WelcomeStepProps {
  userName: string
  onNext: () => void
}

export default function WelcomeStep({ userName, onNext }: WelcomeStepProps) {
  return (
    <Card className="soft-shadow-lg border-border/50">
      <CardContent className="space-y-3 px-4 pb-4 pt-3 sm:space-y-6 sm:px-8 sm:pb-8 sm:pt-8">
        <div className="space-y-2 text-center sm:space-y-4">
          <AppLogo size="lg" showText={true} className="mb-4 hidden justify-center sm:flex" />
          <div>
            <h1 className="text-2xl font-bold text-foreground text-balance sm:mb-3 sm:text-3xl">Welcome, {userName}</h1>
            <p className="mt-1 text-sm font-medium text-primary text-pretty sm:mb-2 sm:text-lg">Set up Waypoint around what matters to you</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground text-pretty sm:text-sm">
              People come to Waypoint for different reasons. There is no single right way to use it, and these questions are here to personalise your experience rather than diagnose you.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-green-500/20 bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-transparent p-3.5 sm:p-5">
          <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground sm:mb-3 sm:text-base"><Star className="size-4.5 text-green-600 sm:size-5" /> Start with your own goals</h2>
          <div className="space-y-1.5 sm:space-y-2">
            {[
              "Choose the areas you want to focus on",
              "Record only what you are comfortable sharing",
              "Use the tools and modules that feel relevant",
            ].map((item) => (
              <div key={item} className="flex items-start gap-2">
                <CheckCircle className="mt-0.5 size-3.5 flex-shrink-0 text-green-600 sm:size-4" />
                <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-3.5 sm:p-5">
          <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground sm:mb-3 sm:text-base"><Sparkles className="size-4.5 text-primary sm:size-5" /> What Waypoint includes</h2>
          <div className="grid gap-2 sm:grid-cols-3 sm:gap-3">
            <div className="flex items-start gap-2 sm:block">
              <Shield className="mt-0.5 size-4 shrink-0 text-green-600 sm:mb-1.5 sm:size-5" />
              <div><p className="text-xs font-semibold text-foreground sm:text-sm">Self-guided tools</p><p className="text-[11px] leading-snug text-muted-foreground sm:text-xs">Practical skills informed by established therapeutic approaches.</p></div>
            </div>
            <div className="flex items-start gap-2 sm:block">
              <Heart className="mt-0.5 size-4 shrink-0 text-blue-600 sm:mb-1.5 sm:size-5" />
              <div><p className="text-xs font-semibold text-foreground sm:text-sm">Personalisation</p><p className="text-[11px] leading-snug text-muted-foreground sm:text-xs">Your goals, values and focus areas shape parts of Waypoint.</p></div>
            </div>
            <div className="flex items-start gap-2 sm:block">
              <Users className="mt-0.5 size-4 shrink-0 text-purple-600 sm:mb-1.5 sm:size-5" />
              <div><p className="text-xs font-semibold text-foreground sm:text-sm">Optional community</p><p className="text-[11px] leading-snug text-muted-foreground sm:text-xs">Peer discussion through a community alias, not counselling.</p></div>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-secondary/50 p-3.5 sm:p-5">
          <h2 className="mb-2 text-sm font-semibold text-foreground sm:text-base">What happens next</h2>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[
              ["1", "Focus", "Choose areas"],
              ["2", "Patterns", "Add context"],
              ["3", "Values", "Name strengths"],
              ["4", "Check-in", "Set a baseline"],
            ].map(([number, title, description]) => (
              <div key={number} className="rounded-lg border border-border/50 bg-background/60 p-2.5">
                <div className="mb-1 flex size-5 items-center justify-center rounded-full bg-primary/15 text-[10px] font-bold text-primary">{number}</div>
                <p className="text-xs font-semibold text-foreground">{title}</p>
                <p className="text-[10px] text-muted-foreground">{description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-green-500/20 bg-gradient-to-r from-green-500/10 to-emerald-500/10 p-3 sm:p-4">
          <p className="text-xs leading-relaxed text-foreground text-pretty sm:text-sm">
            Move at your own pace. Difficult answers do not mean you have failed, and Waypoint does not decide what your progress should look like.
          </p>
        </div>

        <StepButtonFooter onNext={onNext} />
      </CardContent>
    </Card>
  )
}
