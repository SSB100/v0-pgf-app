"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { AlertTriangle, BookOpenCheck, BrainCircuit, CheckCircle2, Calendar, Shield, Users } from "lucide-react"
import { useState, useEffect } from "react"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function MobileNav() {
  const pathname = usePathname()
  const [sosLoading, setSosLoading] = useState(false)
  const router = useRouter()

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
    { href: "/safeguards", icon: Shield, label: "Safety" },
    { href: "/skills", icon: BookOpenCheck, label: "Skills" },
    { href: "/training", icon: BrainCircuit, label: "Training" },
    { href: "/check-in", icon: Calendar, label: "Check-in", isDone: checkInDone },
    { href: communityHref, icon: Users, label: "Community" },
  ]

  async function handleSOS() {
    setSosLoading(true)
    try {
      const response = await fetch("/api/sos/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })

      const data = await response.json()

      if (data.needsSetup) {
        // Redirect to setup page if not configured
        router.push("/sos-setup")
      } else if (response.ok) {
        alert(data.message || "SOS sent. Support will reach out soon.")
      } else {
        alert("Failed to send SOS. Please try again.")
      }
    } catch (error) {
      alert("Failed to send SOS. Please try again.")
    } finally {
      setSosLoading(false)
    }
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-t-2 border-primary/20 shadow-2xl lg:hidden">
      <div className="flex items-center justify-around px-1 py-2 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href
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

        <button
          onClick={handleSOS}
          disabled={sosLoading}
          className="flex flex-col items-center gap-1 px-2 py-2 rounded-lg transition-all bg-destructive/90 text-white shadow-lg hover:bg-destructive"
        >
          <AlertTriangle className="w-6 h-6 stroke-[2.5]" />
          <span className="text-xs font-bold">{sosLoading ? "..." : "SOS"}</span>
        </button>
      </div>
    </nav>
  )
}
