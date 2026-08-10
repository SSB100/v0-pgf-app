"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Wine, Pill, Gamepad2, Brain, Sparkles, Dice1 as Dice, TrendingUp, Calendar } from "lucide-react"

interface JourneyProgressCardProps {
  journeyTypes: string[]
  gamblingProblem: any
  alcoholProblem: any
  substancesProblem: any
  mentalHealthProblem: any
  personalGrowthProblem: any
  profile: any
}

const JOURNEY_CONFIG: Record<
  string,
  {
    label: string
    icon: any
    color: string
    bgColor: string
    borderColor: string
  }
> = {
  gambling: {
    label: "Gambling",
    icon: Dice,
    color: "text-orange-600",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/20",
  },
  alcohol: {
    label: "Alcohol",
    icon: Wine,
    color: "text-red-600",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/20",
  },
  substances: {
    label: "Substances",
    icon: Pill,
    color: "text-purple-600",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
  },
  gaming: {
    label: "Gaming",
    icon: Gamepad2,
    color: "text-blue-600",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
  },
  mental_health: {
    label: "Mental Health",
    icon: Brain,
    color: "text-teal-600",
    bgColor: "bg-teal-500/10",
    borderColor: "border-teal-500/20",
  },
  personal_growth: {
    label: "Personal Growth",
    icon: Sparkles,
    color: "text-green-600",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/20",
  },
}

function calculateDaysSince(dateString: string | null): number | null {
  if (!dateString) return null
  const date = new Date(dateString)
  const now = new Date()
  return Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
}

function getProgressMessage(days: number | null, type: string): string {
  if (days === null) return "Start tracking your progress"

  if (days === 0) return "Stay strong today!"
  if (days === 1) return "1 day clean - great start!"
  if (days < 7) return `${days} days - you're building momentum!`
  if (days < 30) return `${days} days - over a week strong!`
  if (days < 90) return `${days} days - amazing progress!`
  if (days < 365) return `${days} days - incredible dedication!`
  return `${days} days - you're an inspiration!`
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
        return {
          problem: gamblingProblem,
          lastDate: gamblingProblem?.last_bet_date || gamblingProblem?.last_occurrence_date,
          dateLabel: "Days since last bet",
        }
      case "alcohol":
        return {
          problem: alcoholProblem,
          lastDate: alcoholProblem?.last_occurrence_date || profile?.last_drink_date,
          dateLabel: "Days since last drink",
        }
      case "substances":
        return {
          problem: substancesProblem,
          lastDate: substancesProblem?.last_occurrence_date || profile?.last_substance_date,
          dateLabel: "Days clean",
        }
      case "mental_health":
        return {
          problem: mentalHealthProblem,
          lastDate: null,
          dateLabel: "Wellness journey",
        }
      case "personal_growth":
        return {
          problem: personalGrowthProblem,
          lastDate: null,
          dateLabel: "Growth journey",
        }
      case "gaming":
        return {
          problem: null,
          lastDate: null,
          dateLabel: "Balance journey",
        }
      default:
        return { problem: null, lastDate: null, dateLabel: "" }
    }
  }

  // Filter to only addiction types that have day counters
  const addictionTypes = journeyTypes.filter((t) => ["gambling", "alcohol", "substances"].includes(t))
  const wellnessTypes = journeyTypes.filter((t) => ["mental_health", "personal_growth", "gaming"].includes(t))

  return (
    <Card className="soft-shadow border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg sm:text-xl text-foreground flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Your Recovery Journey
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Tracking progress across {journeyTypes.length} {journeyTypes.length === 1 ? "area" : "areas"}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Addiction recovery tracking with day counters */}
        {addictionTypes.length > 0 && (
          <div className="space-y-3">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Recovery Progress</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {addictionTypes.map((type) => {
                const config = JOURNEY_CONFIG[type]
                const data = getJourneyData(type)
                const daysSince = calculateDaysSince(data.lastDate)
                const Icon = config.icon

                return (
                  <div key={type} className={`${config.bgColor} ${config.borderColor} border rounded-xl p-4 space-y-2`}>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-8 h-8 rounded-full ${config.bgColor} flex items-center justify-center border ${config.borderColor}`}
                      >
                        <Icon className={`w-4 h-4 ${config.color}`} />
                      </div>
                      <span className={`font-semibold ${config.color}`}>{config.label}</span>
                    </div>

                    <div className="flex items-baseline gap-1">
                      <span className={`text-3xl font-bold ${config.color}`}>
                        {daysSince !== null ? daysSince : "-"}
                      </span>
                      <span className="text-sm text-muted-foreground">days</span>
                    </div>

                    <p className="text-xs text-muted-foreground">{getProgressMessage(daysSince, type)}</p>

                    {data.lastDate && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground pt-1 border-t border-border/20">
                        <Calendar className="w-3 h-3" />
                        <span>Since {new Date(data.lastDate).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Wellness tracking without day counters */}
        {wellnessTypes.length > 0 && (
          <div className="space-y-3">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Wellness & Growth Focus
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {wellnessTypes.map((type) => {
                const config = JOURNEY_CONFIG[type]
                const data = getJourneyData(type)
                const Icon = config.icon

                // Get specific data for mental health and personal growth
                let focusAreas: string[] = []
                if (type === "mental_health" && data.problem?.specific_types) {
                  focusAreas =
                    typeof data.problem.specific_types === "string"
                      ? JSON.parse(data.problem.specific_types)
                      : data.problem.specific_types
                } else if (type === "personal_growth" && data.problem?.specific_types) {
                  focusAreas =
                    typeof data.problem.specific_types === "string"
                      ? JSON.parse(data.problem.specific_types)
                      : data.problem.specific_types
                }

                return (
                  <div key={type} className={`${config.bgColor} ${config.borderColor} border rounded-xl p-4 space-y-2`}>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-8 h-8 rounded-full ${config.bgColor} flex items-center justify-center border ${config.borderColor}`}
                      >
                        <Icon className={`w-4 h-4 ${config.color}`} />
                      </div>
                      <span className={`font-semibold ${config.color}`}>{config.label}</span>
                    </div>

                    {focusAreas.length > 0 ? (
                      <div className="space-y-1">
                        <div className="text-xs text-muted-foreground">Focus areas:</div>
                        <div className="flex flex-wrap gap-1">
                          {focusAreas.slice(0, 3).map((area, i) => (
                            <span
                              key={i}
                              className={`px-2 py-0.5 rounded-full text-xs ${config.bgColor} ${config.color} border ${config.borderColor}`}
                            >
                              {area}
                            </span>
                          ))}
                          {focusAreas.length > 3 && (
                            <span className="text-xs text-muted-foreground">+{focusAreas.length - 3} more</span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground">Building skills and awareness</p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-3 mt-4">
          <p className="text-sm text-foreground">
            <span className="font-medium text-primary">Remember:</span> Every day is progress. The skills you're
            learning here support all areas of your journey.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
