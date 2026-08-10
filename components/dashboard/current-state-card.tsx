"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getQuoteForCheckin } from "@/lib/inspirational-quotes"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

interface CurrentStateCardProps {
  awareness: any
  problems: any
  userId: string
  todayCheckIn?: any
  journeyTypes?: string[]
}

export default function CurrentStateCard({
  awareness,
  problems,
  userId,
  todayCheckIn,
  journeyTypes = [],
}: CurrentStateCardProps) {
  const negativeEmotions = [
    "Anxious",
    "Scared",
    "Lonely",
    "Angry",
    "Helpless",
    "Frustrated",
    "Guilty",
    "Sad",
    "Ashamed",
    "Disappointed",
    "Confused",
    "Worried",
  ]

  const allEmotions: string[] = todayCheckIn?.emotions_felt
    ? todayCheckIn.emotions_felt
    : awareness?.all_emotions
      ? typeof awareness.all_emotions === "string"
        ? JSON.parse(awareness.all_emotions)
        : awareness.all_emotions
      : []

  const strongestEmotion = todayCheckIn?.strongest_emotion || awareness?.strongest_emotion || awareness?.emotion || null

  const positiveEmotions = allEmotions.filter((e) => !negativeEmotions.includes(e))
  const negativeEmotionsList = allEmotions.filter((e) => negativeEmotions.includes(e))

  const quote = getQuoteForCheckin(userId, awareness?.created_at)

  const getMoodLabel = (rating: number) => {
    if (rating >= 9) return "Excellent"
    if (rating >= 7) return "Good"
    if (rating >= 5) return "Okay"
    if (rating >= 3) return "Struggling"
    return "Very Difficult"
  }

  const getMoodColor = (rating: number) => {
    if (rating >= 8) return "text-green-600"
    if (rating >= 6) return "text-blue-600"
    if (rating >= 4) return "text-yellow-600"
    return "text-red-600"
  }

  const getMotivationalMessage = (emotion: string): string => {
    const messages: Record<string, string> = {
      Anxious: "Remember, you've overcome challenges before. Take it one breath at a time.",
      Scared: "Fear is temporary, but your courage is lasting. You're doing great by showing up today.",
      Lonely: "You're not alone in this journey. Your strength in seeking help shows great courage.",
      Angry: "It's okay to feel this way. Channel this energy into positive action and self-care.",
      Helpless: "Every small step forward is progress. You have more power than you realize.",
      Frustrated: "These feelings will pass. Be patient with yourself as you grow.",
      Guilty: "Past mistakes don't define you. Focus on the positive choices you're making now.",
      Sad: "It's okay to feel sad. Be gentle with yourself and remember brighter days are ahead.",
      Ashamed: "You are worthy of compassion and growth. Every day clean is a victory to celebrate.",
      Disappointed: "Setbacks are part of recovery. What matters is that you keep moving forward.",
      Confused: "Clarity comes with time. Trust your journey and the progress you're making.",
      Worried: "Worry shows you care about your future. Channel that energy into the steps you can take today.",
    }
    return messages[emotion] || "You're doing great by acknowledging your feelings. Keep going strong."
  }

  const getPrimaryJourney = () => {
    if (journeyTypes?.includes("gambling")) return "gambling"
    if (journeyTypes?.includes("alcohol")) return "alcohol"
    if (journeyTypes?.includes("substances")) return "substances"
    if (journeyTypes?.includes("gaming")) return "gaming"
    return "personal_growth"
  }

  const primaryJourney = getPrimaryJourney()

  const getLastOccurrenceDate = () => {
    if (!problems) return null

    if (problems.last_occurrence_date) return problems.last_occurrence_date
    if (problems.last_bet_date) return problems.last_bet_date

    return null
  }

  const daysSinceLastBehavior = getLastOccurrenceDate()
    ? Math.floor((new Date().getTime() - new Date(getLastOccurrenceDate()).getTime()) / (1000 * 60 * 60 * 24))
    : null

  const getCleanDaysLabel = () => {
    switch (primaryJourney) {
      case "gambling":
        return "Days Clean"
      case "alcohol":
        return "Days Sober"
      case "substances":
        return "Days Clean"
      case "gaming":
        return "Balanced Days"
      default:
        return "Positive Days"
    }
  }

  return (
    <Card className="soft-shadow border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-start sm:items-center justify-between gap-2 flex-col sm:flex-row">
          <CardTitle className="text-lg sm:text-xl text-foreground flex items-center gap-2">
            <svg className="w-5 h-5 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Your Daily Reflection</span>
          </CardTitle>
          {daysSinceLastBehavior !== null && daysSinceLastBehavior > 0 && daysSinceLastBehavior <= 30 && (
            <div className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded">
              {daysSinceLastBehavior === 1 && "🌱 Starting fresh!"}
              {daysSinceLastBehavior > 1 && daysSinceLastBehavior <= 7 && "💪 Building momentum!"}
              {daysSinceLastBehavior > 7 && daysSinceLastBehavior <= 30 && "🔥 Strong streak!"}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-l-4 border-primary p-3 rounded-r-lg">
          <p className="text-sm italic text-foreground/90 leading-relaxed">"{quote}"</p>
        </div>

        {(todayCheckIn || daysSinceLastBehavior !== null) && (
          <div className="grid grid-cols-3 gap-2">
            {todayCheckIn && (
              <>
                <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 rounded-lg p-2">
                  <div className="text-[10px] text-muted-foreground font-medium mb-0.5">Feeling</div>
                  <div className={`text-lg font-bold ${getMoodColor(todayCheckIn.mood_rating)}`}>
                    {todayCheckIn.mood_rating}/10
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20 rounded-lg p-2">
                  <div className="text-[10px] text-muted-foreground font-medium mb-0.5">Overall</div>
                  <div className={`text-lg font-bold ${getMoodColor(todayCheckIn.overall_rating || 5)}`}>
                    {todayCheckIn.overall_rating || 5}/10
                  </div>
                </div>
              </>
            )}

            {daysSinceLastBehavior !== null && (
              <div className={`rounded-lg p-2 ${
                daysSinceLastBehavior === 0
                  ? "bg-gradient-to-br from-orange-500/15 to-orange-500/5 border border-orange-500/30"
                  : "bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20"
              }`}>
                <div className="text-[10px] text-muted-foreground font-medium mb-0.5">{getCleanDaysLabel()}</div>
                {daysSinceLastBehavior === 0 ? (
                  <div className="text-xs font-semibold text-orange-700 leading-tight">
                    New start
                  </div>
                ) : (
                  <div className={`text-lg font-bold ${daysSinceLastBehavior === 0 ? "text-orange-700" : "text-primary"}`}>
                    {daysSinceLastBehavior}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {awareness || todayCheckIn ? (
          <>
            <div className="space-y-3">
              {positiveEmotions.length > 0 && (
                <div className="space-y-2 bg-gradient-to-br from-green-400/25 via-emerald-400/20 to-teal-400/15 border-2 border-green-500/40 rounded-xl p-4 shadow-lg">
                  <div className="flex items-center gap-2">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <div className="text-sm text-green-700 font-bold">Positive Emotions Today 🎉</div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {positiveEmotions.map((emotion, i) => {
                      const isStrongest = emotion === strongestEmotion
                      return (
                        <span
                          key={i}
                          className={`px-4 py-2 bg-gradient-to-r text-white rounded-full text-sm font-bold shadow-md transition-all ${
                            isStrongest
                              ? "from-yellow-500 to-orange-500 border-2 border-yellow-600 shadow-xl scale-110 animate-pulse"
                              : "from-green-500 to-emerald-500 border-2 border-green-600"
                          }`}
                        >
                          {isStrongest ? "⭐ " : "✨ "}
                          {emotion}
                        </span>
                      )
                    })}
                  </div>
                </div>
              )}

              {daysSinceLastBehavior === 0 && (
                <div className="space-y-3 bg-gradient-to-br from-orange-100/70 to-amber-100/50 border-2 border-orange-400/60 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">🌅</div>
                    <div className="flex-1">
                      <div className="text-sm text-orange-900 font-bold mb-2">A New Beginning</div>
                      <p className="text-sm text-orange-800 leading-relaxed mb-3">
                        Relapse is part of recovery. The only way from here is forward. Every moment is a chance to make a different choice. You're here, you're showing up—that takes real strength.
                      </p>
                      <Link
                        href="/journey"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-orange-700 hover:text-orange-900 bg-orange-200/50 hover:bg-orange-200/80 px-3 py-2 rounded-lg transition-colors"
                      >
                        Explore Skills & Modules
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {positiveEmotions.length === 0 && allEmotions.length > 0 && daysSinceLastBehavior !== 0 && (
                <div className="space-y-3 bg-gradient-to-br from-blue-100/60 to-indigo-100/40 border-2 border-blue-300/50 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">💙</div>
                    <div className="flex-1">
                      <div className="text-sm text-blue-900 font-bold mb-2">Not all days feel like good days</div>
                      <p className="text-sm text-blue-800 leading-relaxed mb-3">
                        That's exactly why we created the modules and skills resources. They're designed to help you navigate these moments and build towards feeling better. Every step you take is progress.
                      </p>
                      <Link
                        href="/journey"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900 bg-blue-200/50 hover:bg-blue-200/80 px-3 py-2 rounded-lg transition-colors"
                      >
                        Explore Skills & Modules
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {negativeEmotionsList.length > 0 && (
                <div className="space-y-2 bg-muted/20 border border-border/20 rounded-lg p-3">
                  <div className="text-[10px] text-muted-foreground/60 font-medium uppercase tracking-wide">
                    Challenging Emotions
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {negativeEmotionsList.map((emotion, i) => {
                      const isStrongest = emotion === strongestEmotion
                      return (
                        <span
                          key={i}
                          className={`px-2 py-0.5 rounded text-[11px] ${
                            isStrongest
                              ? "bg-muted/40 text-muted-foreground/70 border border-border/40"
                              : "bg-muted/20 text-muted-foreground/50 border border-border/20"
                          }`}
                        >
                          {emotion}
                        </span>
                      )
                    })}
                  </div>
                  {negativeEmotions.includes(strongestEmotion) && (
                    <div className="mt-2 pt-2 border-t border-border/20">
                      <p className="text-[10px] text-muted-foreground/60 leading-relaxed">
                        💙 {getMotivationalMessage(strongestEmotion)}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-6">
            <p className="text-muted-foreground">No recent check-ins</p>
            <p className="text-sm text-muted-foreground mt-1">Complete a daily check-in to track your state</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
