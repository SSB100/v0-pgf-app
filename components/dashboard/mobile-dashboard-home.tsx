"use client"

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
  HeartHandshake,
  LifeBuoy,
  Shield,
  Sparkles,
  Users,
} from "lucide-react"

const fetcher = (url: string) => fetch(url).then((response) => response.json())

interface MobileDashboardHomeProps {
  userName: string
  journeyProgress?: {
    completed: number
    total: number
  }
}

interface HubItem {
  title: string
  description: string
  href: string
  icon: typeof Sparkles
  status?: string
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

  const { data: communityData } = useSWR(shouldLoadMobileData ? "/api/community/profile" : null, fetcher)
  const { data: membershipData } = useSWR(
    shouldLoadMobileData && communityData?.profile ? "/api/community/group/join" : null,
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

  const communityHref =
    communityData?.profile && membershipData?.membership?.groupId
      ? `/community/chat/${membershipData.membership.groupId}`
      : "/community/join"

  const checkInDone = checkInData?.completed === true

  const items: HubItem[] = [
    {
      title: "Today",
      description: "Check in or choose something useful for today.",
      href: "/dashboard/today",
      icon: CalendarDays,
      status: checkInDone ? "Check-in recorded" : "Open options",
    },
    {
      title: "Check-ins",
      description: "See your recent entries and seven-day pattern.",
      href: "/dashboard/check-ins",
      icon: CheckCircle2,
    },
    {
      title: "Learning",
      description: "Find a Journey module without being told what you must do next.",
      href: "/dashboard/learning",
      icon: BookOpenCheck,
      status: journeyProgress ? `${journeyProgress.completed}/${journeyProgress.total} explored` : undefined,
    },
    {
      title: "Values & Focus",
      description: "Reconnect with what matters and the areas you chose to work on.",
      href: "/dashboard/direction",
      icon: Compass,
    },
    {
      title: "Safeguards",
      description: "Practical barriers and support options you can choose from.",
      href: "/dashboard/safeguards",
      icon: Shield,
    },
    {
      title: "Community",
      description: "Optional peer conversation using your community alias.",
      href: communityHref,
      icon: Users,
    },
    {
      title: "Support",
      description: "Find support options when you want another person involved.",
      href: "/support",
      icon: LifeBuoy,
    },
  ]

  return (
    <div className="fixed inset-x-0 bottom-[76px] top-16 z-30 overflow-y-auto overscroll-contain bg-background lg:hidden">
      <main className="mx-auto flex min-h-full max-w-lg flex-col px-4 py-4 sm:px-5">
        <div className="mb-4">
          <p className="text-sm font-medium text-muted-foreground">Welcome back, {userName}</p>
          <h1 className="mt-0.5 text-2xl font-bold tracking-tight text-foreground">Your Waypoint</h1>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            Open the part that feels useful. There is no order you need to follow.
          </p>
        </div>

        <Link
          href="/dashboard/growth"
          className="group mb-3 flex min-h-[108px] items-center gap-4 rounded-[1.6rem] border border-primary/25 bg-gradient-to-br from-primary/15 via-primary/8 to-card p-4 shadow-sm transition-transform active:scale-[0.99]"
        >
          <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-primary/25 bg-primary/15">
            <Sparkles className="size-7 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-foreground">Growth Companion</h2>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">Avatar</span>
            </div>
            <p className="mt-1 text-sm leading-snug text-muted-foreground">
              See your avatar, Growth Credits, current level and how it changes as you use Waypoint.
            </p>
          </div>
          <ChevronRight className="size-5 shrink-0 text-primary transition-transform group-hover:translate-x-0.5" />
        </Link>

        <div className="grid flex-1 grid-cols-2 gap-3">
          {items.map((item) => {
            const Icon = item.icon
            const isSupport = item.title === "Support"

            return (
              <Link
                key={item.title}
                href={item.href}
                className={`group flex min-h-[104px] flex-col justify-between rounded-2xl border p-3.5 shadow-sm transition-transform active:scale-[0.99] ${
                  isSupport ? "border-destructive/20 bg-destructive/5" : "border-border/70 bg-card"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className={`flex size-9 items-center justify-center rounded-xl ${isSupport ? "bg-destructive/10" : "bg-primary/10"}`}>
                    <Icon className={`size-4.5 ${isSupport ? "text-destructive" : "text-primary"}`} />
                  </div>
                  <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </div>
                <div className="mt-2">
                  <h2 className="text-sm font-bold leading-tight text-foreground">{item.title}</h2>
                  <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-muted-foreground">{item.description}</p>
                  {item.status && (
                    <p className="mt-1 text-[10px] font-semibold text-primary">{item.status}</p>
                  )}
                </div>
              </Link>
            )
          })}
        </div>

        <div className="mt-3 flex items-center gap-2 rounded-xl border border-border/60 bg-muted/25 px-3 py-2 text-[11px] leading-relaxed text-muted-foreground">
          <HeartHandshake className="size-4 shrink-0 text-primary" />
          Waypoint is a self-guided companion. Support and emergency services remain separate from the app.
        </div>
      </main>
    </div>
  )
}
