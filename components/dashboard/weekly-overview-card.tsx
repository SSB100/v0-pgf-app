"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { AlertCircle, Smile, Frown, TrendingUp, Heart } from "lucide-react"

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
}

export default function WeeklyOverviewCard({ checkins, journeyTypes = [] }: WeeklyOverviewCardProps) {
  const getPrimaryJourney = () => {
    if (journeyTypes.includes("gambling")) return "gambling"
    if (journeyTypes.includes("alcohol")) return "alcohol"
    if (journeyTypes.includes("substances")) return "substances"
    if (journeyTypes.includes("gaming")) return "gaming"
    return "personal_growth"
  }

  const primaryJourney = getPrimaryJourney()

  const getCleanDaysLabel = () => {
    switch (primaryJourney) {
      case "gambling":
        return "Clean Days"
      case "alcohol":
        return "Sober Days"
      case "substances":
        return "Clean Days"
      case "gaming":
        return "Balanced Days"
      default:
        return "Positive Days"
    }
  }

  const getChallengingDaysLabel = () => {
    switch (primaryJourney) {
      case "gambling":
        return "gambling"
      case "alcohol":
        return "drinking"
      case "substances":
        return "using"
      case "gaming":
        return "excessive gaming"
      default:
        return "challenging"
    }
  }

  const interpolateMissingDays = (data: any[]) => {
    const result = [...data]

    for (let i = 0; i < result.length; i++) {
      if (!result[i].hasData) {
        let prevIndex = i - 1
        while (prevIndex >= 0 && !result[prevIndex].hasData) {
          prevIndex--
        }

        let nextIndex = i + 1
        while (nextIndex < result.length && !result[nextIndex].hasData) {
          nextIndex++
        }

        if (prevIndex >= 0 && nextIndex < result.length) {
          const prevData = result[prevIndex]
          const nextData = result[nextIndex]
          const gap = nextIndex - prevIndex
          const position = i - prevIndex

          result[i].mood =
            prevData.mood !== null && nextData.mood !== null
              ? Math.round((prevData.mood * (gap - position) + nextData.mood * position) / gap)
              : null

          result[i].overall =
            prevData.overall !== null && nextData.overall !== null
              ? Math.round((prevData.overall * (gap - position) + nextData.overall * position) / gap)
              : null

          result[i].urges =
            prevData.urges !== null && nextData.urges !== null
              ? Math.round((prevData.urges * (gap - position) + nextData.urges * position) / gap)
              : null

          result[i].isInterpolated = true
        }
      }
    }

    return result
  }

  const getWeekDays = () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const checkinMap = new Map(
      checkins.map((c) => {
        const date = new Date(c.date)
        date.setHours(0, 0, 0, 0)
        return [date.toISOString().split("T")[0], c]
      }),
    )

    const rawData = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(today)
      date.setDate(today.getDate() - (6 - index))
      const dateKey = date.toISOString().split("T")[0]
      const checkin = checkinMap.get(dateKey)
      const dayIndex = date.getDay()

      return {
        day: days[dayIndex],
        fullDate: date,
        mood: checkin?.mood_rating ?? null,
        urges: checkin?.urge_strength ?? null,
        overall: checkin?.overall_rating ?? null,
        hasData: !!checkin,
        isInterpolated: false,
      }
    })

    return interpolateMissingDays(rawData)
  }

  const chartData = getWeekDays()
  const completedDays = chartData.filter((d) => d.hasData).length
  const missingDays = 7 - completedDays

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const validCheckins = checkins.filter((c) => new Date(c.date) <= today)

  if (validCheckins.length === 0) {
    return (
      <Card className="soft-shadow border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg text-foreground flex items-center gap-2">
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            Weekly Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-3">
          <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border-2 border-blue-500/20 rounded-lg p-3">
            <p className="text-sm font-medium text-blue-700 mb-2">Complete your first check-in to get started</p>
            <p className="text-xs text-blue-600">Daily check-ins help you track mood, urges, emotions, and progress. This chart will show your weekly trends once you begin.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const avgMood = validCheckins.reduce((sum, c) => sum + c.mood_rating, 0) / validCheckins.length
  const avgUrges = validCheckins.reduce((sum, c) => sum + c.urge_strength, 0) / validCheckins.length
  const behaviorDays = validCheckins.filter((c) =>
    c.behavior_occurred !== undefined && c.behavior_occurred !== null ? c.behavior_occurred : c.gambling_occurred,
  ).length
  const cleanDays = validCheckins.length - behaviorDays

  const daysWithData = chartData.filter((d) => d.hasData && d.mood !== null)
  const moodImprovement =
    daysWithData.length >= 2 ? daysWithData[daysWithData.length - 1].mood! - daysWithData[0].mood! : 0
  const urgeImprovement =
    daysWithData.length >= 2 ? daysWithData[0].urges! - daysWithData[daysWithData.length - 1].urges! : 0

  const allEmotions = validCheckins
    .filter((c) => c.emotions_felt && c.emotions_felt.length > 0)
    .flatMap((c) => c.emotions_felt || [])
  const emotionCounts: Record<string, number> = {}
  allEmotions.forEach((emotion) => {
    emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1
  })
  const topEmotions = Object.entries(emotionCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)

  const positiveReflections = validCheckins.filter((c) => c.good_things && c.good_things.trim().length > 0).length
  const positiveRatio = positiveReflections / validCheckins.length

  return (
    <Card className="soft-shadow border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-base sm:text-lg text-foreground flex items-center gap-2">
          <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          Weekly Overview
          <span className="text-xs font-normal text-muted-foreground ml-auto">{completedDays}/7 days</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pb-3">
        {missingDays > 0 && missingDays < 7 && (
          <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border-2 border-blue-500/30 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-xs font-medium text-blue-700 mb-0.5">Keep your streak going!</div>
                <p className="text-xs text-blue-600">
                  {completedDays} check-in{completedDays !== 1 ? "s" : ""} this week. {missingDays === 1 ? "1 more day" : `${missingDays} more days`} to complete!
                </p>
              </div>
            </div>
          </div>
        )}

        {cleanDays > 0 && (
          <div className="bg-gradient-to-br from-green-500/20 via-emerald-500/15 to-teal-500/10 border-2 border-green-500/30 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-green-700 font-medium mb-0.5">{getCleanDaysLabel()} This Week</div>
                <div className="text-2xl font-bold text-green-600">{cleanDays}</div>
                <p className="text-xs text-green-600 mt-0.5">
                  {cleanDays === validCheckins.length && "Perfect week!"}
                  {cleanDays > validCheckins.length * 0.7 && cleanDays < validCheckins.length && "Great progress!"}
                  {cleanDays <= validCheckins.length * 0.7 && "Keep going!"}
                </p>
              </div>
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-foreground">Mood & Overall Rating</h3>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-muted-foreground text-xs">Mood</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-muted-foreground text-xs">Overall</span>
              </div>
            </div>
          </div>
          <ChartContainer
            config={{
              mood: { label: "Mood", color: "hsl(217, 91%, 60%)" },
              overall: { label: "Overall", color: "hsl(142, 71%, 45%)" },
            }}
            className="h-[120px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis
                  dataKey="day"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  domain={[0, 10]}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="mood"
                  stroke="hsl(217, 91%, 60%)"
                  strokeWidth={2}
                  dot={{ fill: "hsl(217, 91%, 60%)", r: 4 }}
                  activeDot={{ r: 6 }}
                  connectNulls={false}
                />
                <Line
                  type="monotone"
                  dataKey="overall"
                  stroke="hsl(142, 71%, 45%)"
                  strokeWidth={2}
                  dot={{ fill: "hsl(142, 71%, 45%)", r: 4 }}
                  activeDot={{ r: 6 }}
                  connectNulls={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
          {moodImprovement > 1 && (
            <p className="text-xs text-green-600 flex items-center gap-1">
              <Smile className="w-3 h-3" />
              Your mood improved by {moodImprovement.toFixed(1)} points this week!
            </p>
          )}
          {moodImprovement < -1 && (
            <p className="text-xs text-orange-600 flex items-center gap-1">
              <Frown className="w-3 h-3" />
              Your mood decreased by {Math.abs(moodImprovement).toFixed(1)} points - consider extra self-care
            </p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-foreground">Urge Strength</h3>
            <div className="flex items-center gap-1 text-xs">
              <div className="w-2 h-2 rounded-full bg-orange-500" />
              <span className="text-muted-foreground text-xs">Urges</span>
            </div>
          </div>
          <ChartContainer
            config={{
              urges: { label: "Urge Strength", color: "hsl(25, 95%, 53%)" },
            }}
            className="h-[100px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis
                  dataKey="day"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  domain={[0, 10]}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="urges"
                  stroke="hsl(25, 95%, 53%)"
                  strokeWidth={2}
                  dot={{ fill: "hsl(25, 95%, 53%)", r: 4 }}
                  activeDot={{ r: 6 }}
                  connectNulls={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
          {urgeImprovement > 1 && (
            <p className="text-xs text-green-600 flex items-center gap-1">
              <Smile className="w-3 h-3" />
              Your urges decreased by {urgeImprovement.toFixed(1)} points - great work!
            </p>
          )}
          {urgeImprovement < -1 && (
            <p className="text-xs text-orange-600 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              Urges increased by {Math.abs(urgeImprovement).toFixed(1)} points - use your coping skills
            </p>
          )}
        </div>

        {topEmotions.length > 0 && (
          <div className="bg-gradient-to-br from-purple-500/5 to-purple-500/10 border border-purple-500/20 rounded-lg p-3">
            <div className="text-xs text-muted-foreground font-medium mb-2">Top Emotions</div>
            <div className="space-y-1">
              {topEmotions.map(([emotion, count]) => (
                <div key={emotion} className="flex items-center justify-between text-xs">
                  <span className="text-foreground capitalize">{emotion}</span>
                  <span className="text-xs text-muted-foreground">{count}x</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {behaviorDays > 0 && (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <div className="text-xs">
                <div className="font-bold text-blue-900 mb-1">
                  {behaviorDays === 1 ? "Challenging day" : `${behaviorDays} challenging days`}
                </div>
                <p className="text-blue-800 leading-tight">
                  {behaviorDays === 1
                    ? "You experienced a setback. Remember - recovery isn't perfection. You're still moving forward."
                    : `You had ${behaviorDays} days with ${getChallengingDaysLabel()} this week. Setbacks are part of recovery. What matters: You completed ${completedDays} check-ins. That's engagement. That's progress.`}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <div className="text-xs text-muted-foreground font-medium">Quick Insights</div>
          <div className="space-y-1">
            {moodImprovement > 1 && (
              <div className="flex items-start gap-2 text-xs text-green-700 bg-green-50 p-2 rounded">
                <Smile className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <span>Mood improved by {moodImprovement.toFixed(1)} points</span>
              </div>
            )}
            {urgeImprovement > 1 && (
              <div className="flex items-start gap-2 text-xs text-green-700 bg-green-50 p-2 rounded">
                <Smile className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <span>Urges decreased by {urgeImprovement.toFixed(1)} points</span>
              </div>
            )}
            {positiveRatio > 0.7 && (
              <div className="flex items-start gap-2 text-xs text-green-700 bg-green-50 p-2 rounded">
                <Smile className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <span>Strong positive mindset this week!</span>
              </div>
            )}
            {avgMood < 4 && (
              <div className="flex items-start gap-2 text-xs text-orange-700 bg-orange-50 p-2 rounded">
                <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <span>Consider self-care or reaching out for support</span>
              </div>
            )}
            {avgUrges > 7 && (
              <div className="flex items-start gap-2 text-xs text-orange-700 bg-orange-50 p-2 rounded">
                <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <span>Urges high - review your coping skills</span>
              </div>
            )}
            {cleanDays === validCheckins.length && checkins.length >= 5 && (
              <div className="flex items-start gap-2 text-xs text-green-700 bg-green-50 p-2 rounded">
                <Smile className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <span>Perfect week! You're building incredible momentum.</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
