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
        return { problem: gamblingProblem, lastDate: gamblingProblem?.last_bet_date || gamblingProblem?.last_occurrence_date, dateLabel: "Last gambling date recorded" }
      case "alcohol":
        return { problem: alcoholProblem, lastDate: alcoholProblem?.last_occurrence_date || profile?.last_drink_date, dateLabel: "Last alcohol-use date recorded" }
      case "substances":
        return { problem: substancesProblem, lastDate: substancesProblem?.last_occurrence_date || profile?.last_substance_date, dateLabel: "Last substance-use date recorded" }
      case "mental_health":
        return { problem: mentalHealthProblem, lastDate: null, dateLabel: "Mental wellbeing focus" }
      case "personal_growth":
        return { problem: personalGrowthProblem, lastDate: null, dateLabel: "Personal growth focus" }
      case "gaming":
        return { problem: null, lastDate: null, dateLabel: "Gaming or internet focus" }
      default:
        return { problem: null, lastDate: null, dateLabel: "" }
    }
  }

  const datedTypes = journeyTypes.filter((type) => ["gambling", "alcohol", "substances"].includes(type))
  const otherTypes = journeyTypes.filter((type) => ["mental_health", "personal_growth", "gaming"].includes(type))

  return (
    <Card className="soft-shadow border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg sm:text-xl text-foreground flex items-center gap-2"><Map className="w-5 h-5 text-primary" /> Your Focus Areas</CardTitle>
        <p className="text-sm text-muted-foreground">
          This card summarises the areas and dates you recorded in Waypoint. It is not a clinical progress score and does not assume that abstinence is every person's goal.
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {datedTypes.length > 0 && (
          <div className="space-y-3">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Dates you recorded</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {datedTypes.map((type) => {
                const config = JOURNEY_CONFIG[type]
                const data = getJourneyData(type)
                const dateKey = normaliseDateKey(data.lastDate)
                const daysSince = calculateDaysSince(data.lastDate)
                const Icon = config.icon

                return (
                  <div key={type} className={`${config.bgColor} ${config.borderColor} border rounded-xl p-4 space-y-2`}>
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full ${config.bgColor} flex items-center justify-center border ${config.borderColor}`}><Icon className={`w-4 h-4 ${config.color}`} /></div>
                      <span className={`font-semibold ${config.color}`}>{config.label}</span>
                    </div>

                    {dateKey && daysSince !== null ? (
                      <>
                        <div className="flex items-baseline gap-1"><span className={`text-3xl font-bold ${config.color}`}>{daysSince}</span><span className="text-sm text-muted-foreground">days</span></div>
                        <p className="text-xs text-muted-foreground">Since the last date you recorded for this behaviour.</p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground pt-1 border-t border-border/20">
                          <Calendar className="w-3 h-3" />
                          <span>{data.dateLabel}: {formatDateKeyEnNz(dateKey)}</span>
                        </div>
                      </>
                    ) : (
                      <p className="text-xs text-muted-foreground">No last-occurrence date has been recorded for this area.</p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {otherTypes.length > 0 && (
          <div className="space-y-3">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Other focus areas</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {otherTypes.map((type) => {
                const config = JOURNEY_CONFIG[type]
                const data = getJourneyData(type)
                const Icon = config.icon

                let focusAreas: string[] = []
                if ((type === "mental_health" || type === "personal_growth") && data.problem?.specific_types) {
                  focusAreas = typeof data.problem.specific_types === "string" ? JSON.parse(data.problem.specific_types) : data.problem.specific_types
                }

                return (
                  <div key={type} className={`${config.bgColor} ${config.borderColor} border rounded-xl p-4 space-y-2`}>
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full ${config.bgColor} flex items-center justify-center border ${config.borderColor}`}><Icon className={`w-4 h-4 ${config.color}`} /></div>
                      <span className={`font-semibold ${config.color}`}>{config.label}</span>
                    </div>

                    {focusAreas.length > 0 ? (
                      <div className="space-y-1">
                        <div className="text-xs text-muted-foreground">Areas you selected:</div>
                        <div className="flex flex-wrap gap-1">
                          {focusAreas.slice(0, 3).map((area, index) => <span key={`${area}-${index}`} className={`px-2 py-0.5 rounded-full text-xs ${config.bgColor} ${config.color} border ${config.borderColor}`}>{area}</span>)}
                          {focusAreas.length > 3 && <span className="text-xs text-muted-foreground">+{focusAreas.length - 3} more</span>}
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground">Selected as a Waypoint focus area.</p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 mt-4">
          <p className="text-sm text-muted-foreground">
            Dates, focus areas and app activity can help you reflect on patterns, but they do not by themselves show whether your health or recovery is improving.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
