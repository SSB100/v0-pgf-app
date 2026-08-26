"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell } from "recharts"
import { AlertCircle, BarChart3, TrendingDown, TrendingUp } from "lucide-react"

interface CheckinData {
  date: string
  mood_rating: number
  overall_rating: number | null
  urge_strength: number
  behavior_occurred?: boolean
  gambling_occurred: boolean
  alcohol_occurred?: boolean
  substance_occurred?: boolean
  self_harm_actions?: boolean
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
  const tracksSpecificBehaviour = ["gambling", "alcohol", "substances"].includes(primaryJourney)

  const behaviourLabel =
    primaryJourney === "alcohol"
      ? "alcohol use"
      : primaryJourney === "substances"
        ? "substance use"
        : "gambling"

  const didRecordPrimaryBehaviour = (checkin: CheckinData) => {
    if (primaryJourney === "gambling") return checkin.gambling_occurred === true
    if (primaryJourney === "alcohol") return checkin.alcohol_occurred === true
    if (primaryJourney === "substances") return checkin.substance_occurred === true
    return false
  }

  const toDateKey = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const accountCreatedDate = accountCreatedAt ? new Date(accountCreatedAt) : null
  if (accountCreatedDate) accountCreatedDate.setHours(0, 0, 0, 0)

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
    const previousRating = previous?.overall_rating ?? previous?.mood_rating ?? null
    const currentRating = overall ?? mood
    const delta = currentRating !== null && previousRating !== null ? currentRating - previousRating : null
    const behaviourRecorded = Boolean(checkin && tracksSpecificBehaviour && didRecordPrimaryBehaviour(checkin))

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
      behaviourRecorded,
      delta,
      feedback:
        beforeAccount
          ? "Before you joined"
          : !checkin
            ? "No check-in recorded"
            : delta !== null && delta >= 2
              ? "Your self-reported rating increased from the previous recorded day"
              : delta !== null && delta <= -2
                ? "Your self-reported rating decreased from the previous recorded day"
                : "Your rating was similar to the previous recorded day",
    }
  })

  const accountDaysInWindow = chartData.filter((day) => !day.beforeAccount).length
  const completedDays = chartData.filter((day) => day.hasData).length
  const missingDays = chartData.filter((day) => day.missed).length
  const behaviourDays = tracksSpecificBehaviour ? validCheckins.filter(didRecordPrimaryBehaviour).length : 0
  const noBehaviourDays = tracksSpecificBehaviour ? validCheckins.length - behaviourDays : 0
  const avgMood = validCheckins.length ? validCheckins.reduce((sum, checkin) => sum + checkin.mood_rating, 0) / validCheckins.length : 0
  const avgUrges = validCheckins.length ? validCheckins.reduce((sum, checkin) => sum + checkin.urge_strength, 0) / validCheckins.length : 0
  const increasedDays = chartData.filter((day) => day.delta !== null && day.delta >= 2)
  const decreasedDays = chartData.filter((day) => day.delta !== null && day.delta <= -2)
  const hasAnyHistory = validCheckins.length > 0

  return (
    <Card className="soft-shadow border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base text-foreground sm:text-lg">
          <BarChart3 className="size-5 text-primary" />
          Weekly Overview
          <span className="ml-auto text-xs font-normal text-muted-foreground">{completedDays}/{accountDaysInWindow} days</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pb-3">
        {!hasAnyHistory && (
          <div className="rounded-lg border-2 border-primary/20 bg-primary/10 p-3">
            <p className="mb-1 text-sm font-medium text-primary">No check-ins in this 7-day view yet</p>
            <p className="text-xs text-muted-foreground">When you record a check-in, your self-reported mood, overall rating and urges will appear here. Missing a day is not a failure.</p>
          </div>
        )}

        {missingDays > 0 && (
          <div className="flex items-start gap-2 rounded-lg border border-border bg-muted/40 p-2.5 text-xs">
            <AlertCircle className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <p className="text-muted-foreground">
              <span className="font-medium text-foreground">{missingDays} day{missingDays === 1 ? "" : "s"} without a check-in.</span>{" "}
              Those days are left empty rather than treated as good or bad days. Missing a check-in is not a failure.
            </p>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
          <span className="font-semibold text-foreground">Self-reported check-ins</span>
          <span className="flex items-center gap-1"><i className="size-2 rounded-sm bg-[var(--chart-1)]" />Mood</span>
          <span className="flex items-center gap-1"><i className="size-2 rounded-sm bg-[var(--chart-2)]" />Overall</span>
          <span className="flex items-center gap-1"><i className="size-2 rounded-sm bg-[var(--chart-3)]" />Urges</span>
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
          {chartData.map((day) => (
            <div key={day.dateLabel} className="flex min-w-0 flex-col items-center gap-1 text-center" title={day.feedback}>
              <div className={`flex size-5 items-center justify-center rounded-full text-[10px] font-bold ${day.beforeAccount ? "bg-muted/40 text-muted-foreground/50" : !day.hasData ? "bg-muted text-muted-foreground" : "bg-primary/15 text-primary"}`}>
                {day.beforeAccount ? "" : day.hasData ? "•" : "–"}
              </div>
              {day.delta !== null && day.delta >= 2 && <TrendingUp className="size-3 text-emerald-500" />}
              {day.delta !== null && day.delta <= -2 && <TrendingDown className="size-3 text-amber-500" />}
            </div>
          ))}
        </div>

        {(increasedDays.length > 0 || decreasedDays.length > 0) && (
          <div className="grid gap-2 sm:grid-cols-2">
            {increasedDays.length > 0 && <div className="rounded-lg border border-border bg-muted/30 p-2 text-xs text-muted-foreground">Your self-reported overall or mood rating increased by 2 or more points on {increasedDays.length} recorded day{increasedDays.length === 1 ? "" : "s"} compared with the previous recorded day.</div>}
            {decreasedDays.length > 0 && <div className="rounded-lg border border-border bg-muted/30 p-2 text-xs text-muted-foreground">Your self-reported overall or mood rating decreased by 2 or more points on {decreasedDays.length} recorded day{decreasedDays.length === 1 ? "" : "s"} compared with the previous recorded day.</div>}
          </div>
        )}

        {tracksSpecificBehaviour && validCheckins.length > 0 && (
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="rounded-lg border border-border bg-muted/30 p-2.5">
              <div className="text-xs font-medium text-muted-foreground">Recorded days with {behaviourLabel} reported</div>
              <div className="text-2xl font-bold text-foreground">{behaviourDays}</div>
            </div>
            <div className="rounded-lg border border-border bg-muted/30 p-2.5">
              <div className="text-xs font-medium text-muted-foreground">Recorded days without {behaviourLabel} reported</div>
              <div className="text-2xl font-bold text-foreground">{noBehaviourDays}</div>
            </div>
            <p className="text-xs text-muted-foreground sm:col-span-2">These counts describe what you entered. Waypoint does not assume that one pattern defines your goals, recovery status or progress.</p>
          </div>
        )}

        {hasAnyHistory && (
          <div className="flex flex-wrap gap-2 text-[11px] text-muted-foreground">
            <span>Average self-reported mood {avgMood.toFixed(1)}/10</span>
            <span>Average self-reported urges {avgUrges.toFixed(1)}/10</span>
            {avgUrges > 7 && <span className="font-medium">Average urge rating is above 7/10</span>}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
