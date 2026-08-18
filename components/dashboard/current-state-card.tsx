"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { differenceInCalendarDays, getAotearoaDateKey, normaliseDateKey } from "@/lib/aotearoa-date"

interface CurrentStateCardProps {
  awareness: any
  problems: any
  todayCheckIn?: any
}

export default function CurrentStateCard({ awareness, problems, todayCheckIn }: CurrentStateCardProps) {
  const allEmotions: string[] = todayCheckIn?.emotions_felt
    ? todayCheckIn.emotions_felt
    : awareness?.all_emotions
      ? typeof awareness.all_emotions === "string"
        ? JSON.parse(awareness.all_emotions)
        : awareness.all_emotions
      : []

  const strongestEmotion = todayCheckIn?.strongest_emotion || awareness?.strongest_emotion || awareness?.emotion || null

  const lastOccurrenceDateKey = normaliseDateKey(problems?.last_occurrence_date || problems?.last_bet_date)
  const daysSinceLastBehavior = lastOccurrenceDateKey
    ? Math.max(0, differenceInCalendarDays(getAotearoaDateKey(), lastOccurrenceDateKey))
    : null

  const behaviorLabel =
    problems?.problem_type === "gambling"
      ? "gambling"
      : problems?.problem_type === "alcohol"
        ? "alcohol use"
        : problems?.problem_type === "substances"
          ? "substance use"
          : "the behaviour you are tracking"

  return (
    <Card className="soft-shadow border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg sm:text-xl text-foreground flex items-center gap-2">
          <svg className="w-5 h-5 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Your Recent Check-In</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {todayCheckIn ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 rounded-lg p-3">
                <div className="text-[10px] text-muted-foreground font-medium mb-0.5">Self-reported mood</div>
                <div className="text-lg font-bold text-foreground">{todayCheckIn.mood_rating}/10</div>
              </div>

              <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20 rounded-lg p-3">
                <div className="text-[10px] text-muted-foreground font-medium mb-0.5">Overall today</div>
                <div className="text-lg font-bold text-foreground">{todayCheckIn.overall_rating ?? "—"}{todayCheckIn.overall_rating != null ? "/10" : ""}</div>
              </div>

              {todayCheckIn.urge_strength != null && (
                <div className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 border border-amber-500/20 rounded-lg p-3">
                  <div className="text-[10px] text-muted-foreground font-medium mb-0.5">Self-reported urges</div>
                  <div className="text-lg font-bold text-foreground">{todayCheckIn.urge_strength}/10</div>
                </div>
              )}
            </div>

            {allEmotions.length > 0 && (
              <div className="space-y-2 rounded-lg border border-border bg-muted/20 p-3">
                <div className="text-xs font-medium text-muted-foreground">Emotions you recorded</div>
                <div className="flex flex-wrap gap-2">
                  {allEmotions.map((emotion, index) => (
                    <span key={`${emotion}-${index}`} className={`px-2.5 py-1 rounded-full text-xs border ${emotion === strongestEmotion ? "border-primary/40 bg-primary/10 text-primary font-semibold" : "border-border bg-background text-muted-foreground"}`}>
                      {emotion}{emotion === strongestEmotion ? " · strongest" : ""}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {(todayCheckIn.good_things || todayCheckIn.bad_things) && (
              <div className="grid gap-3 sm:grid-cols-2">
                {todayCheckIn.bad_things && (
                  <div className="rounded-lg border border-border p-3">
                    <p className="text-xs font-semibold text-muted-foreground mb-1">Difficult moments you recorded</p>
                    <p className="text-sm text-foreground/80 whitespace-pre-wrap">{todayCheckIn.bad_things}</p>
                  </div>
                )}
                {todayCheckIn.good_things && (
                  <div className="rounded-lg border border-border p-3">
                    <p className="text-xs font-semibold text-muted-foreground mb-1">Positive or meaningful moments you recorded</p>
                    <p className="text-sm text-foreground/80 whitespace-pre-wrap">{todayCheckIn.good_things}</p>
                  </div>
                )}
              </div>
            )}
          </>
        ) : awareness ? (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Your latest available reflection is from onboarding.</p>
            {allEmotions.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {allEmotions.map((emotion, index) => <span key={`${emotion}-${index}`} className="px-2.5 py-1 rounded-full text-xs border border-border bg-muted/20">{emotion}</span>)}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-muted-foreground">No check-in recorded yet</p>
            <p className="text-sm text-muted-foreground mt-1">Check-ins are optional and can help you look back at patterns over time.</p>
          </div>
        )}

        {daysSinceLastBehavior !== null && ["gambling", "alcohol", "substances"].includes(problems?.problem_type) && (
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm text-muted-foreground">
            Waypoint's current record shows {daysSinceLastBehavior === 0 ? `${behaviorLabel} recorded today` : `${daysSinceLastBehavior} day${daysSinceLastBehavior === 1 ? "" : "s"} since ${behaviorLabel} was last recorded`}.
            This is a description of the dates you entered, not a recovery score or judgement about your progress.
          </div>
        )}

        <Link href="/journey" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
          Explore journey modules <ArrowRight className="w-4 h-4" />
        </Link>
      </CardContent>
    </Card>
  )
}
