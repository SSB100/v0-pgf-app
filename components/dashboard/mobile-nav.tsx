"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookOpenCheck, CheckCircle2, Calendar, Home, Shield, Users } from "lucide-react"
import { useState, useEffect } from "react"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function MobileNav() {
  const pathname = usePathname()

  // Fetch current user id from session, then check today's check-in
  const [userId, setUserId] = useState<string | null>(null)
  useEffect(() => {
    fetch("/api/auth/session").then((r) => r.json()).then((d) => { if (d?.user?.id) setUserId(d.user.id) }).catch(() => {})
  }, [])

  const { data: checkInData } = useSWR(
    userId ? `/api/check-in/check-today?userId=${userId}` : null,
    fetcher,
    { refreshInterval: 60000 }
  )
  const checkInDone = checkInData?.completed === true

  // Determine community destination (join flow vs existing chat)
  const { data: communityData } = useSWR("/api/community/profile", fetcher)
  const { data: membershipData } = useSWR(
    communityData?.profile ? "/api/community/group/join" : null,
    fetcher
  )
  const communityHref =
    communityData?.profile && membershipData?.membership?.groupId
      ? `/community/chat/${membershipData.membership.groupId}`
      : "/community/join"

  const navItems = [
    { href: "/dashboard", icon: Home, label: "Home" },
    { href: "/journey", icon: BookOpenCheck, label: "Journey" },
    { href: "/check-in", icon: Calendar, label: "Check-in", isDone: checkInDone },
    { href: "/safeguards", icon: Shield, label: "Safety" },
    { href: communityHref, icon: Users, label: "Community" },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-t-2 border-primary/20 shadow-2xl lg:hidden">
      <div className="flex items-center justify-around px-1 py-2 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isJourney = item.href === "/journey"
          const isActive = isJourney ? pathname.startsWith("/journey") || pathname.startsWith("/skills") || pathname.startsWith("/training") : pathname === item.href
          const Icon = item.icon
          const isDone = "isDone" in item && item.isDone

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-col items-center gap-1 px-2 py-2 rounded-lg transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-lg scale-110"
                  : isDone
                  ? "text-primary/70 hover:bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
            >
              <div className="relative">
                <Icon className={`w-6 h-6 ${isActive ? "stroke-[2.5]" : "stroke-2"}`} />
                {isDone && !isActive && (
                  <CheckCircle2 className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 fill-primary text-primary-foreground stroke-[2]" />
                )}
              </div>
              <span className={`text-xs font-medium ${isActive ? "font-bold" : ""}`}>
                {isDone && !isActive ? "Done" : item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
