"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell } from "recharts"
import { AlertCircle, BarChart3, Heart, Smile, TrendingDown, TrendingUp } from "lucide-react"

interface CheckinData {
  date: string
  mood_rating: number
  overall_rating: number | null
  urge_strength: number
  behavior_occurred?: boolean
  gambling_occurred: boolean
  emotions_felt: string[] | null
  strongest_emotion: string | null
  good_things: string | null
  bad_things: string | null
}

interface WeeklyOverviewCardProps {
  checkins: CheckinData[]
  journeyTypes?: string[]
  accountCreatedAt?: string | Date | null
}

const chartConfig = {
  mood: { label: "Mood", color: "var(--chart-1)" },
  overall: { label: "Overall", color: "var(--chart-2)" },
  urges: { label: "Urges", color: "var(--chart-3)" },
}

export default function WeeklyOverviewCard({ checkins, journeyTypes = [], accountCreatedAt = null }: WeeklyOverviewCardProps) {
  const getPrimaryJourney = () => {
    if (journeyTypes.includes("gambling")) return "gambling"
    if (journeyTypes.includes("alcohol")) return "alcohol"
    if (journeyTypes.includes("substances")) return "substances"
    if (journeyTypes.includes("gaming")) return "gaming"
    return "personal_growth"
  }

  const primaryJourney = getPrimaryJourney()
  const challengingLabel = primaryJourney === "alcohol" ? "drinking" : primaryJourney === "substances" ? "using" : primaryJourney === "gaming" ? "excessive gaming" : primaryJourney === "gambling" ? "gambling" : "challenging behavior"
  const cleanLabel = primaryJourney === "gaming" ? "Balanced Days" : primaryJourney === "alcohol" ? "Sober Days" : "Clean Days"

  const toDateKey = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Normalize account creation date to midnight so we can tell which days in the
  // 7-day window existed for this account vs. days before they signed up.
  const accountCreatedDate = accountCreatedAt ? new Date(accountCreatedAt) : null
  if (accountCreatedDate) accountCreatedDate.setHours(0, 0, 0, 0)

  // Only consider check-ins that fall on or before today (defends against clock skew / future dates).
  const validCheckins = checkins.filter((checkin) => new Date(`${checkin.date}T00:00:00`) <= today)
  const checkinMap = new Map(validCheckins.map((checkin) => [checkin.date.slice(0, 10), checkin]))
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const chartData = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today)
    date.setDate(today.getDate() - (6 - index))
    const checkin = checkinMap.get(toDateKey(date))
    const previous = index > 0 ? checkinMap.get(toDateKey(new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1))) : undefined
    const mood = checkin?.mood_rating ?? null
    const overall = checkin?.overall_rating ?? null
    const urges = checkin?.urge_strength ?? null
    const previousAverage = previous?.overall_rating ?? previous?.mood_rating ?? null
    const currentAverage = overall ?? mood
    const delta = currentAverage !== null && previousAverage !== null ? currentAverage - previousAverage : null
    const behaviorOccurred = checkin ? (checkin.behavior_occurred ?? checkin.gambling_occurred) : false

    // A day only counts as "missed" if the account already existed on that day.
    // Days before sign-up should never be flagged as a missed check-in.
    const beforeAccount = accountCreatedDate ? date < accountCreatedDate : false
    const missed = !checkin && !beforeAccount

    return {
      day: days[date.getDay()],
      dateLabel: `${date.getMonth() + 1}/${date.getDate()}`,
      hasData: Boolean(checkin),
      beforeAccount,
      missed,
      mood,
      overall,
      urges,
      relapse: behaviorOccurred,
      delta,
      feedback: beforeAccount ? "Before you joined" : !checkin ? "No check-in" : delta !== null && delta >= 2 ? "Positive shift" : delta !== null && delta <= -2 ? "A harder day — be kind to yourself" : "Steady day",
    }
  })

  const accountDaysInWindow = chartData.filter((day) => !day.beforeAccount).length
  const completedDays = chartData.filter((day) => day.hasData).length
  const missingDays = chartData.filter((day) => day.missed).length
  const behaviorDays = validCheckins.filter((checkin) => checkin.behavior_occurred ?? checkin.gambling_occurred).length
  const cleanDays = validCheckins.length - behaviorDays
  const avgMood = validCheckins.length ? validCheckins.reduce((sum, checkin) => sum + checkin.mood_rating, 0) / validCheckins.length : 0
  const avgUrges = validCheckins.length ? validCheckins.reduce((sum, checkin) => sum + checkin.urge_strength, 0) / validCheckins.length : 0

  const positiveRatio = validCheckins.length ? validCheckins.filter((checkin) => checkin.good_things?.trim()).length / validCheckins.length : 0
  const positiveDays = chartData.filter((day) => day.delta !== null && day.delta >= 2)
  const harderDays = chartData.filter((day) => day.delta !== null && day.delta <= -2)

  const hasAnyHistory = validCheckins.length > 0

  return (
    <Card className="soft-shadow border-border/50">
      <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2 text-base text-foreground sm:text-lg"><BarChart3 className="size-5 text-primary" />Weekly Overview<span className="ml-auto text-xs font-normal text-muted-foreground">{completedDays}/{accountDaysInWindow} days</span></CardTitle></CardHeader>
      <CardContent className="space-y-3 pb-3">
        {!hasAnyHistory && (
          <div className="rounded-lg border-2 border-primary/20 bg-primary/10 p-3">
            <p className="mb-1 text-sm font-medium text-primary">Complete your first check-in to get started</p>
            <p className="text-xs text-muted-foreground">Daily check-ins will appear here as separate bars for mood, overall rating, urges, and relapse status.</p>
          </div>
        )}

        {missingDays > 0 && <div className="flex items-start gap-2 rounded-lg border border-border bg-muted/40 p-2.5 text-xs"><AlertCircle className="mt-0.5 size-4 shrink-0 text-muted-foreground" /><p className="text-muted-foreground"><span className="font-medium text-foreground">{missingDays} day{missingDays === 1 ? "" : "s"} without an update.</span> Gray columns are intentionally left empty so your chart only reflects recorded check-ins.</p></div>}

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
          <span className="font-semibold text-foreground">Daily check-ins</span>
          <span className="flex items-center gap-1"><i className="size-2 rounded-sm bg-[var(--chart-1)]" />Mood</span>
          <span className="flex items-center gap-1"><i className="size-2 rounded-sm bg-[var(--chart-2)]" />Overall</span>
          <span className="flex items-center gap-1"><i className="size-2 rounded-sm bg-[var(--chart-3)]" />Urges</span>
          <span className="flex items-center gap-1"><i className="size-2 rounded-full bg-destructive" />Relapse</span>
        </div>

        <ChartContainer config={chartConfig} className="h-[220px] w-full">
          <BarChart data={chartData} margin={{ top: 8, right: 4, left: -20, bottom: 0 }} barGap={1} barCategoryGap="18%">
            <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeDasharray="3 3" opacity={0.35} />
            <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={11} tickFormatter={(value, index) => `${value}\n${chartData[index]?.dateLabel ?? ""}`} />
            <YAxis domain={[0, 10]} ticks={[0, 5, 10]} tickLine={false} axisLine={false} fontSize={10} width={24} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="mood" name="Mood" fill="var(--color-mood)" radius={[2, 2, 0, 0]}>{chartData.map((day) => <Cell key={`mood-${day.dateLabel}`} fill={day.hasData ? "var(--color-mood)" : "hsl(var(--muted))"} opacity={day.mood === null ? (day.beforeAccount ? 0.08 : 0.25) : 1} />)}</Bar>
            <Bar dataKey="overall" name="Overall" fill="var(--color-overall)" radius={[2, 2, 0, 0]}>{chartData.map((day) => <Cell key={`overall-${day.dateLabel}`} fill={day.hasData ? "var(--color-overall)" : "hsl(var(--muted))"} opacity={day.overall === null ? (day.beforeAccount ? 0.08 : 0.25) : 1} />)}</Bar>
            <Bar dataKey="urges" name="Urges" fill="var(--color-urges)" radius={[2, 2, 0, 0]}>{chartData.map((day) => <Cell key={`urges-${day.dateLabel}`} fill={day.hasData ? "var(--color-urges)" : "hsl(var(--muted))"} opacity={day.urges === null ? (day.beforeAccount ? 0.08 : 0.25) : 1} />)}</Bar>
          </BarChart>
        </ChartContainer>

        <div className="grid grid-cols-7 gap-1" aria-label="Daily check-in status">
          {chartData.map((day) => <div key={day.dateLabel} className="flex min-w-0 flex-col items-center gap-1 text-center" title={day.feedback}><div className={`flex size-5 items-center justify-center rounded-full text-[10px] font-bold ${day.beforeAccount ? "bg-muted/40 text-muted-foreground/50" : !day.hasData ? "bg-muted text-muted-foreground" : day.relapse ? "bg-destructive/15 text-destructive" : "bg-primary/15 text-primary"}`}>{day.beforeAccount ? "" : day.hasData ? (day.relapse ? "!" : "✓") : "–"}</div>{day.delta !== null && day.delta >= 2 && <TrendingUp className="size-3 text-emerald-500" />}{day.delta !== null && day.delta <= -2 && <TrendingDown className="size-3 text-amber-500" />}</div>)}
        </div>

        {(positiveDays.length > 0 || harderDays.length > 0) && <div className="grid gap-2 sm:grid-cols-2">{positiveDays.length > 0 && <div className="flex items-start gap-2 rounded-lg bg-emerald-500/10 p-2 text-xs text-emerald-700"><Smile className="mt-0.5 size-3.5 shrink-0" /><span><span className="font-semibold">Positive shift:</span> {positiveDays.length} day{positiveDays.length === 1 ? "" : "s"} improved from the previous day.</span></div>}{harderDays.length > 0 && <div className="flex items-start gap-2 rounded-lg bg-amber-500/10 p-2 text-xs text-amber-700"><Heart className="mt-0.5 size-3.5 shrink-0" /><span><span className="font-semibold">A gentler note:</span> {harderDays.length === 1 ? "One day felt significantly harder. Use your supports and be kind to yourself." : `${harderDays.length} days felt significantly harder. Your continued check-ins still matter.`}</span></div>}</div>}

        {cleanDays > 0 && <div className="flex items-center justify-between rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-2.5"><div><div className="text-xs font-medium text-emerald-700">{cleanLabel} This Week</div><div className="text-2xl font-bold text-emerald-600">{cleanDays}</div></div><Heart className="size-7 text-emerald-500" /> </div>}
        {behaviorDays > 0 && <div className="rounded-lg border border-primary/20 bg-primary/10 p-2.5 text-xs text-muted-foreground"><span className="font-semibold text-foreground">{behaviorDays === 1 ? "One challenging day" : `${behaviorDays} challenging days`} with {challengingLabel}.</span> Setbacks are part of recovery. What matters is that you kept checking in.</div>}
        {hasAnyHistory && <div className="flex flex-wrap gap-2 text-[11px] text-muted-foreground"><span>Average mood {avgMood.toFixed(1)}</span><span>Average urges {avgUrges.toFixed(1)}</span>{positiveRatio > 0.7 && <span className="font-medium text-emerald-600">Strong positive mindset</span>}{avgUrges > 7 && <span className="font-medium text-amber-600">Urges are high — review coping skills</span>}</div>}
      </CardContent>
    </Card>
  )
}
