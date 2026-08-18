"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Heart } from "lucide-react"

interface RelapseSupportCardProps {
  journeyType: string
  daysSinceRelapse: number
  todayMood?: number
}

export default function RelapseSupportCard({ journeyType, daysSinceRelapse, todayMood }: RelapseSupportCardProps) {
  const behaviourLabel =
    journeyType === "gambling"
      ? "gambling"
      : journeyType === "alcohol"
        ? "alcohol use"
        : journeyType === "substances"
          ? "substance use"
          : "the behaviour you are tracking"

  return (
    <Card className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-2 border-blue-200 shadow-lg dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-purple-950/20 dark:border-blue-900">
      <CardContent className="pt-6 space-y-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 space-y-2">
            <h3 className="text-lg font-bold text-foreground">You recorded {behaviourLabel} today.</h3>
            <p className="text-sm text-foreground/80 leading-relaxed">
              Recording what happened does not erase earlier progress or define how your journey is going. If it feels useful, you can reflect on what was happening beforehand, what you needed in that moment and what support or skill might help next.
            </p>
            {daysSinceRelapse > 0 && (
              <p className="text-xs text-muted-foreground">
                Before today, your Waypoint record showed {daysSinceRelapse} day{daysSinceRelapse === 1 ? "" : "s"} since this behaviour was last recorded. That number is descriptive only; it is not a recovery score.
              </p>
            )}
          </div>
        </div>

        {todayMood !== undefined && todayMood < 5 && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 dark:bg-orange-950/20 dark:border-orange-900">
            <p className="text-xs text-orange-900 dark:text-orange-100 leading-relaxed">
              Your mood rating today was below the middle of the scale. If you would like extra support, consider contacting someone you trust or using Waypoint's verified New Zealand support options.
            </p>
            <Link href="/support" className="mt-2 inline-block text-xs font-semibold text-orange-900 underline underline-offset-2 dark:text-orange-100">
              View support options
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
