"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import useSWR from "swr"
import {
  BarChart3,
  BookOpenCheck,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Compass,
  Sparkles,
} from "lucide-react"
import { AVATAR_OPTIONS } from "@/lib/onboarding-data"
import { NO_COMPANION_ID } from "@/lib/waypoint-preferences-policy.mjs"

const fetcher = (url: string) => fetch(url).then((response) => response.json())
const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"]

interface WeeklyCheckin {
  date: string
  moodRating: number | null
  overallRating: number | null
}

interface MobileDashboardHomeProps {
  userName: string
  journeyProgress?: {
    completed: number
    total: number
  }
}

function shiftDateKey(dateKey: string, offset: number) {
  const [year, month, day] = dateKey.split("-").map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  date.setUTCDate(date.getUTCDate() + offset)
  return date.toISOString().slice(0, 10)
}

function dayLabel(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number)
  return DAY_LABELS[new Date(Date.UTC(year, month - 1, day)).getUTCDay()]
}

function ratingHeight(value: number | null) {
  if (value == null) return "0%"
  const clamped = Math.max(0, Math.min(10, value))
  return `${Math.max(5, clamped * 10)}%`
}

export default function MobileDashboardHome({ userName, journeyProgress }: MobileDashboardHomeProps) {
  const pathname = usePathname()
  const [isMobileViewport, setIsMobileViewport] = useState(false)

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 1023px)")
    const syncViewport = () => setIsMobileViewport(mobileQuery.matches)

    syncViewport()
    mobileQuery.addEventListener("change", syncViewport)

    return () => mobileQuery.removeEventListener("change", syncViewport)
  }, [])

  const shouldLoadMobileData = pathname === "/dashboard" && isMobileViewport

  const { data: checkInData } = useSWR(shouldLoadMobileData ? "/api/check-in/check-today" : null, fetcher, {
    refreshInterval: 60000,
  })
  const { data: weeklyData } = useSWR(shouldLoadMobileData ? "/api/check-in/weekly-summary" : null, fetcher, {
    refreshInterval: 60000,
  })
  const { data: preferencesData } = useSWR(
    shouldLoadMobileData ? "/api/user/waypoint-preferences" : null,
    fetcher,
  )

  if (pathname !== "/dashboard") return null

  const checkInDone = checkInData?.completed === true
  const moodRating = typeof checkInData?.moodRating === "number" ? checkInData.moodRating : null
  const overallRating = typeof checkInData?.overallRating === "number" ? checkInData.overallRating : null
  const growthAvatar = typeof preferencesData?.growthAvatar === "string" ? preferencesData.growthAvatar : "growth_tree"
  const progressOnly = growthAvatar === NO_COMPANION_ID
  const companion = AVATAR_OPTIONS.find((avatar) => avatar.id === growthAvatar) || AVATAR_OPTIONS[0]
  const journeyCompleted = journeyProgress?.completed || 0
  const journeyTotal = journeyProgress?.total || 0
  const journeyPercent = journeyTotal > 0 ? Math.round((journeyCompleted / journeyTotal) * 100) : 0

  const weeklyCheckins: WeeklyCheckin[] = Array.isArray(weeklyData?.checkins) ? weeklyData.checkins : []
  const weeklyMap = new Map(weeklyCheckins.map((checkin) => [checkin.date, checkin]))
  const weeklyAnchor = typeof weeklyData?.today === "string"
    ? weeklyData.today
    : typeof checkInData?.date === "string"
      ? checkInData.date
      : null
  const weeklyDays = weeklyAnchor
    ? Array.from({ length: 7 }, (_, index) => {
        const date = shiftDateKey(weeklyAnchor, index - 6)
        return { date, checkin: weeklyMap.get(date) || null }
      })
    : []
  const moodValues = weeklyCheckins
    .map((checkin) => checkin.moodRating)
    .filter((value): value is number => typeof value === "number")
  const overallValues = weeklyCheckins
    .map((checkin) => checkin.overallRating)
    .filter((value): value is number => typeof value === "number")
  const averageMood = moodValues.length
    ? moodValues.reduce((sum, value) => sum + value, 0) / moodValues.length
    : null
  const averageOverall = overallValues.length
    ? overallValues.reduce((sum, value) => sum + value, 0) / overallValues.length
    : null

  return (
    <div className="fixed inset-x-0 bottom-[76px] top-16 z-30 max-w-full overflow-x-hidden overflow-y-auto overscroll-contain bg-background lg:hidden">
      <main className="mx-auto flex min-h-full w-full max-w-lg flex-col gap-2.5 px-3.5 py-3 sm:px-5 sm:py-4">
        <div className="flex items-end justify-between gap-3 px-1">
          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-muted-foreground">Welcome back, {userName}</p>
            <h1 className="mt-0.5 text-2xl font-bold tracking-tight text-foreground">Your Waypoint</h1>
          </div>
          <p className="max-w-[132px] text-right text-[10px] leading-snug text-muted-foreground">
            What feels useful today?
          </p>
        </div>

        <Link
          href="/dashboard/growth"
          className="group flex min-h-[96px] min-w-0 items-center gap-3.5 rounded-[1.4rem] border border-primary/25 bg-gradient-to-br from-primary/15 via-primary/7 to-card p-3.5 shadow-sm transition-transform active:scale-[0.99]"
        >
          {progressOnly ? (
            <div className="flex size-[68px] shrink-0 items-center justify-center rounded-2xl border border-primary/25 bg-primary/10">
              <Sparkles className="size-7 text-primary" />
            </div>
          ) : (
            <div className="relative size-[68px] shrink-0 overflow-hidden rounded-2xl border border-primary/25 bg-background">
              <Image src={companion.previewImage} alt="" fill className="object-cover" sizes="68px" priority />
            </div>
          )}

          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-primary">Growth &amp; Progress</p>
            <h2 className="mt-0.5 truncate text-lg font-bold text-foreground">
              {progressOnly ? "Your progress" : companion.name}
            </h2>
            <p className="mt-0.5 line-clamp-2 text-xs leading-snug text-muted-foreground">
              {progressOnly
                ? "Credits, levels and milestones without a character."
                : "See your companion, Growth Credits and current engagement level."}
            </p>
          </div>
          <ChevronRight className="size-5 shrink-0 text-primary transition-transform group-hover:translate-x-0.5" />
        </Link>

        <div className="grid min-w-0 grid-cols-2 gap-2.5">
          <Link
            href="/dashboard/today"
            className={`group flex min-h-[124px] min-w-0 flex-col justify-between rounded-2xl border p-3.5 shadow-sm transition-transform active:scale-[0.99] ${
              checkInDone ? "border-emerald-500/25 bg-emerald-500/5" : "border-border/70 bg-card"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className={`flex size-9 items-center justify-center rounded-xl ${checkInDone ? "bg-emerald-500/10" : "bg-primary/10"}`}>
                {checkInDone ? <CheckCircle2 className="size-4.5 text-emerald-600" /> : <CalendarDays className="size-4.5 text-primary" />}
              </div>
              <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-foreground">Today</p>
              {checkInDone ? (
                <div className="mt-1.5 grid grid-cols-2 gap-1.5">
                  <div className="rounded-lg border border-border/60 bg-background/70 px-2 py-1.5">
                    <p className="text-[9px] font-medium leading-none text-muted-foreground">Mood</p>
                    <p className="mt-1 text-xs font-bold leading-none text-foreground">
                      {moodRating ?? "—"}{moodRating != null ? "/10" : ""}
                    </p>
                  </div>
                  <div className="rounded-lg border border-border/60 bg-background/70 px-2 py-1.5">
                    <p className="text-[9px] font-medium leading-none text-muted-foreground">Overall</p>
                    <p className="mt-1 text-xs font-bold leading-none text-foreground">
                      {overallRating ?? "—"}{overallRating != null ? "/10" : ""}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="mt-0.5 text-[10px] font-semibold text-primary">Check in or choose a next step</p>
              )}
            </div>
          </Link>

          <Link
            href="/dashboard/learning"
            className="group flex min-h-[124px] min-w-0 flex-col justify-between rounded-2xl border border-border/70 bg-card p-3.5 shadow-sm transition-transform active:scale-[0.99]"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10">
                <BookOpenCheck className="size-4.5 text-primary" />
              </div>
              <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-bold text-foreground">Journey</p>
                {journeyTotal > 0 && <span className="shrink-0 text-[10px] font-semibold text-primary">{journeyCompleted}/{journeyTotal}</span>}
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-secondary">
                <div className="h-full rounded-full bg-primary" style={{ width: `${journeyPercent}%` }} />
              </div>
              <p className="mt-1 truncate text-[10px] leading-snug text-muted-foreground">Continue where you left off or browse.</p>
            </div>
          </Link>
        </div>

        <div className="min-w-0 overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
          <Link href="/dashboard/check-ins" className="group flex min-h-[58px] min-w-0 items-center gap-3 px-3.5 py-2.5 transition-colors hover:bg-secondary/40">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <CheckCircle2 className="size-4 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground">Check-in history</p>
              <p className="truncate text-[11px] text-muted-foreground">Recent entries and seven-day patterns</p>
            </div>
            <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </Link>

          <Link href="/dashboard/direction" className="group flex min-h-[58px] min-w-0 items-center gap-3 border-t border-border/60 px-3.5 py-2.5 transition-colors hover:bg-secondary/40">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <Compass className="size-4 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground">Values &amp; focus</p>
              <p className="truncate text-[11px] text-muted-foreground">Reconnect with what matters to you</p>
            </div>
            <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <Link
          href="/dashboard/check-ins"
          className="group min-w-0 rounded-2xl border border-border/70 bg-card px-3.5 py-3 shadow-sm transition-colors hover:bg-secondary/20"
          aria-label="Open seven-day check-in overview"
        >
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <BarChart3 className="size-4 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-foreground">7-day snapshot</p>
                <span className="shrink-0 text-[10px] font-medium text-muted-foreground">
                  {weeklyCheckins.length}/7 recorded
                </span>
              </div>
              <p className="text-[10px] leading-snug text-muted-foreground">Self-reported mood and overall ratings</p>
            </div>
            <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </div>

          {weeklyDays.length === 7 ? (
            <div className="mt-2.5 grid grid-cols-7 gap-1.5" aria-label="Seven-day self-reported ratings">
              {weeklyDays.map(({ date, checkin }) => (
                <div
                  key={date}
                  className="min-w-0 text-center"
                  aria-label={
                    checkin
                      ? `${date}: mood ${checkin.moodRating ?? "not recorded"} out of 10, overall ${checkin.overallRating ?? "not recorded"} out of 10`
                      : `${date}: no check-in recorded`
                  }
                >
                  <div className="flex h-9 items-end justify-center gap-0.5 rounded-md bg-secondary/35 px-1 pt-1">
                    {checkin ? (
                      <>
                        <span
                          className="w-1.5 rounded-t bg-primary/85"
                          style={{ height: ratingHeight(checkin.moodRating) }}
                          aria-hidden="true"
                        />
                        {checkin.overallRating != null ? (
                          <span
                            className="w-1.5 rounded-t bg-accent/80"
                            style={{ height: ratingHeight(checkin.overallRating) }}
                            aria-hidden="true"
                          />
                        ) : (
                          <span className="mb-1 h-px w-1.5 bg-muted-foreground/25" aria-hidden="true" />
                        )}
                      </>
                    ) : (
                      <span className="mb-1 h-px w-3 bg-muted-foreground/25" aria-hidden="true" />
                    )}
                  </div>
                  <span className="mt-0.5 block text-[9px] font-medium text-muted-foreground">{dayLabel(date)}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-2.5 grid grid-cols-7 gap-1.5" aria-hidden="true">
              {Array.from({ length: 7 }).map((_, index) => (
                <div key={index} className="h-9 animate-pulse rounded-md bg-secondary/35" />
              ))}
            </div>
          )}

          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[9px] text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <i className="size-1.5 rounded-sm bg-primary/85" />
              Mood {averageMood != null ? `${averageMood.toFixed(1)}/10 avg` : "—"}
            </span>
            <span className="inline-flex items-center gap-1">
              <i className="size-1.5 rounded-sm bg-accent/80" />
              Overall {averageOverall != null ? `${averageOverall.toFixed(1)}/10 avg` : "—"}
            </span>
          </div>
        </Link>
      </main>
    </div>
  )
}
