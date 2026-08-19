"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookOpenCheck, Calendar, CheckCircle2, Home, Shield, Users } from "lucide-react"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((response) => response.json())

export default function MobileNav() {
  const pathname = usePathname()

  const { data: checkInData } = useSWR("/api/check-in/check-today", fetcher, {
    refreshInterval: 60000,
  })
  const checkInDone = checkInData?.completed === true

  const { data: communityData } = useSWR("/api/community/profile", fetcher)
  const { data: membershipData } = useSWR(
    communityData?.profile ? "/api/community/group/join" : null,
    fetcher,
  )
  const communityHref =
    communityData?.profile && membershipData?.membership?.groupId
      ? `/community/chat/${membershipData.membership.groupId}`
      : "/community/join"

  const navItems = [
    { href: "/dashboard", icon: Home, label: "Home", active: pathname === "/dashboard" },
    {
      href: "/journey",
      icon: BookOpenCheck,
      label: "Journey",
      active: pathname.startsWith("/journey") || pathname.startsWith("/skills") || pathname.startsWith("/training"),
    },
    { href: "/check-in", icon: Calendar, label: "Check-in", active: pathname.startsWith("/check-in"), isDone: checkInDone },
    { href: "/safeguards", icon: Shield, label: "Safety", active: pathname.startsWith("/safeguards") },
    { href: communityHref, icon: Users, label: "Community", active: pathname.startsWith("/community") },
  ]

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border/70 bg-card/95 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] backdrop-blur-xl lg:hidden" aria-label="Primary navigation">
      <div className="mx-auto grid max-w-lg grid-cols-5 gap-0.5 px-1.5 pt-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        {navItems.map((item) => {
          const Icon = item.icon

          return (
            <Link
              key={item.label}
              href={item.href}
              aria-current={item.active ? "page" : undefined}
              className={`relative flex min-h-[58px] min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-1.5 py-1.5 text-center transition-colors ${
                item.active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
              }`}
            >
              {item.active && <span className="absolute top-0 h-0.5 w-7 rounded-full bg-primary" aria-hidden="true" />}

              <div className="relative flex size-7 items-center justify-center">
                <Icon className={`size-5 ${item.active ? "stroke-[2.4]" : "stroke-2"}`} />
                {item.isDone && (
                  <CheckCircle2 className="absolute -right-1 -top-1 size-3.5 fill-card text-primary stroke-[2.5]" aria-label="Today's check-in recorded" />
                )}
              </div>

              <span className={`max-w-full truncate text-[11px] leading-none ${item.active ? "font-bold" : "font-medium"}`}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
