"use client"

import UserMenu from "@/components/layout/user-menu"
import AppLogo from "@/components/layout/app-logo"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Map } from "lucide-react"

interface DashboardHeaderProps {
  userName: string
  userEmail: string
  journeyProgress?: {
    completed: number
    total: number
  }
}

export default function DashboardHeader({ userName, userEmail, journeyProgress }: DashboardHeaderProps) {
  const router = useRouter()

  async function handleSignOut() {
    await fetch("/api/auth/signout", { method: "POST" })
    router.push("/auth/signin")
    router.refresh()
  }

  return (
    <header className="bg-card/90 backdrop-blur-md border-b border-border/60 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-3.5 flex items-center justify-between gap-3">
        <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity flex-shrink-0">
          <AppLogo size="sm" showText={true} />
        </Link>

        <div className="min-w-0 flex-1 mx-4 hidden sm:block">
          <h1 className="text-base sm:text-lg font-bold text-foreground truncate leading-tight">
            Welcome back, <span className="text-primary">{userName}</span>
          </h1>
          <p className="text-xs text-muted-foreground">Continue your growth journey</p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <Link
            href="/journey"
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold text-sm shadow-md"
          >
            <Map className="w-4 h-4" />
            <span className="hidden sm:inline">My Journey</span>
            {journeyProgress && journeyProgress.completed > 0 && (
              <span className="text-xs font-bold bg-primary-foreground/20 px-1.5 py-0.5 rounded-md">
                {journeyProgress.completed} explored
              </span>
            )}
          </Link>
          <UserMenu userName={userName} userEmail={userEmail} />
        </div>
      </div>
    </header>
  )
}
