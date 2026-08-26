"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import useSWR from "swr"
import {
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

interface MobileDashboardHomeProps {
  userName: string
  journeyProgress?: {
    completed: number
    total: number
  }
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
  const { data: preferencesData } = useSWR(
    shouldLoadMobileData ? "/api/user/waypoint-preferences" : null,
    fetcher,
  )

  useEffect(() => {
    if (pathname !== "/dashboard" || !isMobileViewport) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [pathname, isMobileViewport])

  if (pathname !== "/dashboard") return null

  const checkInDone = checkInData?.completed === true
  const growthAvatar = typeof preferencesData?.growthAvatar === "string" ? preferencesData.growthAvatar : "growth_tree"
  const progressOnly = growthAvatar === NO_COMPANION_ID
  const companion = AVATAR_OPTIONS.find((avatar) => avatar.id === growthAvatar) || AVATAR_OPTIONS[0]
  const journeyCompleted = journeyProgress?.completed || 0
  const journeyTotal = journeyProgress?.total || 0
  const journeyPercent = journeyTotal > 0 ? Math.round((journeyCompleted / journeyTotal) * 100) : 0

  return (
    <div className="fixed inset-x-0 bottom-[76px] top-16 z-30 overflow-y-auto overscroll-contain bg-background lg:hidden">
      <main className="mx-auto flex min-h-full max-w-lg flex-col gap-2.5 px-3.5 py-3 sm:px-5 sm:py-4">
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
          className="group flex min-h-[96px] items-center gap-3.5 rounded-[1.4rem] border border-primary/25 bg-gradient-to-br from-primary/15 via-primary/7 to-card p-3.5 shadow-sm transition-transform active:scale-[0.99]"
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

        <div className="grid grid-cols-2 gap-2.5">
          <Link
            href="/dashboard/today"
            className={`group flex min-h-[124px] flex-col justify-between rounded-2xl border p-3.5 shadow-sm transition-transform active:scale-[0.99] ${
              checkInDone ? "border-emerald-500/25 bg-emerald-500/5" : "border-border/70 bg-card"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className={`flex size-9 items-center justify-center rounded-xl ${checkInDone ? "bg-emerald-500/10" : "bg-primary/10"}`}>
                {checkInDone ? <CheckCircle2 className="size-4.5 text-emerald-600" /> : <CalendarDays className="size-4.5 text-primary" />}
              </div>
              <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">Today</p>
              <p className={`mt-0.5 text-[10px] font-semibold ${checkInDone ? "text-emerald-700 dark:text-emerald-300" : "text-primary"}`}>
                {checkInDone ? "Check-in recorded" : "Check in or choose a next step"}
              </p>
            </div>
          </Link>

          <Link
            href="/dashboard/learning"
            className="group flex min-h-[124px] flex-col justify-between rounded-2xl border border-border/70 bg-card p-3.5 shadow-sm transition-transform active:scale-[0.99]"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10">
                <BookOpenCheck className="size-4.5 text-primary" />
              </div>
              <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </div>
            <div>
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-bold text-foreground">Journey</p>
                {journeyTotal > 0 && <span className="text-[10px] font-semibold text-primary">{journeyCompleted}/{journeyTotal}</span>}
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-secondary">
                <div className="h-full rounded-full bg-primary" style={{ width: `${journeyPercent}%` }} />
              </div>
              <p className="mt-1 text-[10px] leading-snug text-muted-foreground">Continue where you left off or browse.</p>
            </div>
          </Link>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
          <Link href="/dashboard/check-ins" className="group flex min-h-[58px] items-center gap-3 px-3.5 py-2.5 transition-colors hover:bg-secondary/40">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <CheckCircle2 className="size-4 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground">Check-in history</p>
              <p className="truncate text-[11px] text-muted-foreground">Recent entries and seven-day patterns</p>
            </div>
            <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </Link>

          <Link href="/dashboard/direction" className="group flex min-h-[58px] items-center gap-3 border-t border-border/60 px-3.5 py-2.5 transition-colors hover:bg-secondary/40">
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

        <p className="mt-auto px-2 pt-0.5 text-center text-[10px] leading-snug text-muted-foreground">
          The bottom bar keeps Journey, Check-in, Safety and Community one tap away without crowding your home screen.
        </p>
      </main>
    </div>
  )
}
