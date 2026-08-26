"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Wine, Pill, Gamepad2, Brain, Sparkles, Dice1 as Dice, Calendar, Map } from "lucide-react"
import { differenceInCalendarDays, formatDateKeyEnNz, getAotearoaDateKey, normaliseDateKey } from "@/lib/aotearoa-date"

interface JourneyProgressCardProps {
  journeyTypes: string[]
  gamblingProblem: any
  alcoholProblem: any
  substancesProblem: any
  mentalHealthProblem: any
  personalGrowthProblem: any
  profile: any
}

const JOURNEY_CONFIG: Record<string, { label: string; icon: any; color: string; bgColor: string; borderColor: string }> = {
  gambling: { label: "Gambling", icon: Dice, color: "text-orange-600", bgColor: "bg-orange-500/10", borderColor: "border-orange-500/20" },
  alcohol: { label: "Alcohol", icon: Wine, color: "text-red-600", bgColor: "bg-red-500/10", borderColor: "border-red-500/20" },
  substances: { label: "Substance Use", icon: Pill, color: "text-purple-600", bgColor: "bg-purple-500/10", borderColor: "border-purple-500/20" },
  gaming: { label: "Gaming or Internet", icon: Gamepad2, color: "text-blue-600", bgColor: "bg-blue-500/10", borderColor: "border-blue-500/20" },
  mental_health: { label: "Mental Wellbeing", icon: Brain, color: "text-teal-600", bgColor: "bg-teal-500/10", borderColor: "border-teal-500/20" },
  personal_growth: { label: "Personal Growth", icon: Sparkles, color: "text-green-600", bgColor: "bg-green-500/10", borderColor: "border-green-500/20" },
}

function calculateDaysSince(value: unknown): number | null {
  const dateKey = normaliseDateKey(value)
  if (!dateKey) return null
  return Math.max(0, differenceInCalendarDays(getAotearoaDateKey(), dateKey))
}

export default function JourneyProgressCard({
  journeyTypes,
  gamblingProblem,
  alcoholProblem,
  substancesProblem,
  mentalHealthProblem,
  personalGrowthProblem,
  profile,
}: JourneyProgressCardProps) {
  const getJourneyData = (type: string) => {
    switch (type) {
      case "gambling":
        return { problem: gamblingProblem, lastDate: gamblingProblem?.last_bet_date || gamblingProblem?.last_occurrence_date }
      case "alcohol":
        return { problem: alcoholProblem, lastDate: alcoholProblem?.last_occurrence_date || profile?.last_drink_date }
      case "substances":
        return { problem: substancesProblem, lastDate: substancesProblem?.last_occurrence_date || profile?.last_substance_date }
      case "mental_health":
        return { problem: mentalHealthProblem, lastDate: null }
      case "personal_growth":
        return { problem: personalGrowthProblem, lastDate: null }
      default:
        return { problem: null, lastDate: null }
    }
  }

  return (
    <Card className="gap-3 border-border/50 py-4 soft-shadow">
      <CardHeader className="px-4 pb-0">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10">
              <Map className="size-4 text-primary" />
            </div>
            <div className="min-w-0">
              <CardTitle className="text-base text-foreground">Your Focus Areas</CardTitle>
              <p className="mt-0.5 text-[10px] leading-snug text-muted-foreground">Your recorded areas and dates, not a clinical progress score.</p>
            </div>
          </div>
          <span className="shrink-0 rounded-full bg-secondary/50 px-2 py-1 text-[10px] font-semibold text-muted-foreground">{journeyTypes.length} selected</span>
        </div>
      </CardHeader>

      <CardContent className="px-4">
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {journeyTypes.map((type) => {
            const config = JOURNEY_CONFIG[type]
            if (!config) return null

            const data = getJourneyData(type)
            const dateKey = normaliseDateKey(data.lastDate)
            const daysSince = calculateDaysSince(data.lastDate)
            const Icon = config.icon
            const dated = ["gambling", "alcohol", "substances"].includes(type)

            let focusAreas: string[] = []
            if ((type === "mental_health" || type === "personal_growth") && data.problem?.specific_types) {
              try {
                focusAreas = typeof data.problem.specific_types === "string" ? JSON.parse(data.problem.specific_types) : data.problem.specific_types
              } catch {
                focusAreas = []
              }
            }

            return (
              <div key={type} className={`min-w-0 rounded-xl border ${config.borderColor} ${config.bgColor} p-3`}>
                <div className="flex items-center gap-2">
                  <div className={`flex size-7 shrink-0 items-center justify-center rounded-lg border ${config.borderColor} bg-background/55`}>
                    <Icon className={`size-3.5 ${config.color}`} />
                  </div>
                  <span className={`truncate text-xs font-semibold ${config.color}`}>{config.label}</span>
                </div>

                {dated ? (
                  dateKey && daysSince !== null ? (
                    <div className="mt-2 flex items-end justify-between gap-2">
                      <div className="flex items-baseline gap-1">
                        <span className={`text-xl font-bold leading-none ${config.color}`}>{daysSince}</span>
                        <span className="text-[10px] text-muted-foreground">days since recorded date</span>
                      </div>
                      <span className="flex shrink-0 items-center gap-1 text-[9px] text-muted-foreground"><Calendar className="size-2.5" />{formatDateKeyEnNz(dateKey)}</span>
                    </div>
                  ) : (
                    <p className="mt-2 text-[10px] leading-snug text-muted-foreground">No last-occurrence date recorded.</p>
                  )
                ) : focusAreas.length > 0 ? (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {focusAreas.slice(0, 2).map((area, index) => (
                      <span key={`${area}-${index}`} className="max-w-full truncate rounded-full border border-border/50 bg-background/55 px-2 py-0.5 text-[9px] text-foreground">{area}</span>
                    ))}
                    {focusAreas.length > 2 && <span className="px-1 text-[9px] text-muted-foreground">+{focusAreas.length - 2}</span>}
                  </div>
                ) : (
                  <p className="mt-2 text-[10px] leading-snug text-muted-foreground">Selected as a Waypoint focus area.</p>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
