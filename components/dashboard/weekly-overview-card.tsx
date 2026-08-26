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
    const beforeAccount = accountCreatedDate ? date < accountCreatedDate : false

    return {
      day: days[date.getDay()],
      dateLabel: `${date.getMonth() + 1}/${date.getDate()}`,
      hasData: Boolean(checkin),
      beforeAccount,
      missed: !checkin && !beforeAccount,
      mood,
      overall,
      urges,
      delta,
    }
  })

  const accountDaysInWindow = chartData.filter((day) => !day.beforeAccount).length
  const completedDays = chartData.filter((day) => day.hasData).length
  const missingDays = chartData.filter((day) => day.missed).length
  const behaviourDays = tracksSpecificBehaviour ? validCheckins.filter(didRecordPrimaryBehaviour).length : 0
  const avgMood = validCheckins.length ? validCheckins.reduce((sum, checkin) => sum + checkin.mood_rating, 0) / validCheckins.length : null
  const avgUrges = validCheckins.length ? validCheckins.reduce((sum, checkin) => sum + checkin.urge_strength, 0) / validCheckins.length : null
  const increasedDays = chartData.filter((day) => day.delta !== null && day.delta >= 2).length
  const decreasedDays = chartData.filter((day) => day.delta !== null && day.delta <= -2).length
  const hasAnyHistory = validCheckins.length > 0

  return (
    <Card className="gap-3 border-border/50 py-4 soft-shadow">
      <CardHeader className="px-4 pb-0">
        <div className="flex items-center justify-between gap-4">
          <CardTitle className="flex items-center gap-2 text-base text-foreground">
            <BarChart3 className="size-4 text-primary" />
            Weekly Overview
          </CardTitle>
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
            {increasedDays > 0 && <span className="inline-flex items-center gap-1"><TrendingUp className="size-3 text-emerald-500" />{increasedDays}</span>}
            {decreasedDays > 0 && <span className="inline-flex items-center gap-1"><TrendingDown className="size-3 text-amber-500" />{decreasedDays}</span>}
            <span className="rounded-full bg-secondary/50 px-2 py-1 font-semibold">{completedDays}/{accountDaysInWindow} recorded</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 px-4 pb-0">
        {!hasAnyHistory && (
          <div className="rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-xs text-muted-foreground">
            No check-ins in this 7-day view yet. Missing a day is left empty rather than treated as a result.
          </div>
        )}

        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-lg border border-border/60 bg-secondary/20 px-3 py-2">
            <p className="text-[9px] font-medium uppercase tracking-wide text-muted-foreground">Average mood</p>
            <p className="mt-0.5 text-lg font-bold text-foreground">{avgMood === null ? "—" : `${avgMood.toFixed(1)}/10`}</p>
          </div>
          <div className="rounded-lg border border-border/60 bg-secondary/20 px-3 py-2">
            <p className="text-[9px] font-medium uppercase tracking-wide text-muted-foreground">Average urges</p>
            <p className="mt-0.5 text-lg font-bold text-foreground">{avgUrges === null ? "—" : `${avgUrges.toFixed(1)}/10`}</p>
          </div>
          <div className="rounded-lg border border-border/60 bg-secondary/20 px-3 py-2">
            <p className="truncate text-[9px] font-medium uppercase tracking-wide text-muted-foreground">{tracksSpecificBehaviour ? `${behaviourLabel} reported` : "Days recorded"}</p>
            <p className="mt-0.5 text-lg font-bold text-foreground">{tracksSpecificBehaviour ? behaviourDays : completedDays}</p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-muted-foreground">
            <span className="font-semibold text-foreground">Self-reported</span>
            <span className="flex items-center gap-1"><i className="size-2 rounded-sm bg-[var(--chart-1)]" />Mood</span>
            <span className="flex items-center gap-1"><i className="size-2 rounded-sm bg-[var(--chart-2)]" />Overall</span>
            <span className="flex items-center gap-1"><i className="size-2 rounded-sm bg-[var(--chart-3)]" />Urges</span>
          </div>
          {missingDays > 0 && (
            <span className="inline-flex shrink-0 items-center gap-1 text-[10px] text-muted-foreground" title="Missing days are left empty and are not treated as good or bad results.">
              <AlertCircle className="size-3" /> {missingDays} empty
            </span>
          )}
        </div>

        <ChartContainer config={chartConfig} className="h-[160px] w-full">
          <BarChart data={chartData} margin={{ top: 4, right: 2, left: -22, bottom: 0 }} barGap={1} barCategoryGap="20%">
            <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeDasharray="3 3" opacity={0.3} />
            <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={10} />
            <YAxis domain={[0, 10]} ticks={[0, 5, 10]} tickLine={false} axisLine={false} fontSize={9} width={22} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="mood" name="Mood" fill="var(--color-mood)" radius={[2, 2, 0, 0]}>{chartData.map((day) => <Cell key={`mood-${day.dateLabel}`} fill={day.hasData ? "var(--color-mood)" : "hsl(var(--muted))"} opacity={day.mood === null ? (day.beforeAccount ? 0.08 : 0.22) : 1} />)}</Bar>
            <Bar dataKey="overall" name="Overall" fill="var(--color-overall)" radius={[2, 2, 0, 0]}>{chartData.map((day) => <Cell key={`overall-${day.dateLabel}`} fill={day.hasData ? "var(--color-overall)" : "hsl(var(--muted))"} opacity={day.overall === null ? (day.beforeAccount ? 0.08 : 0.22) : 1} />)}</Bar>
            <Bar dataKey="urges" name="Urges" fill="var(--color-urges)" radius={[2, 2, 0, 0]}>{chartData.map((day) => <Cell key={`urges-${day.dateLabel}`} fill={day.hasData ? "var(--color-urges)" : "hsl(var(--muted))"} opacity={day.urges === null ? (day.beforeAccount ? 0.08 : 0.22) : 1} />)}</Bar>
          </BarChart>
        </ChartContainer>

        <p className="border-t border-border/60 pt-2 text-[9px] leading-snug text-muted-foreground">
          These summaries describe what you entered. They do not determine recovery status, treatment outcome or whether your goals are being met.
        </p>
      </CardContent>
    </Card>
  )
}
