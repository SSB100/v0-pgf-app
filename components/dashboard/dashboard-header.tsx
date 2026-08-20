"use client"

import UserMenu from "@/components/layout/user-menu"
import AppLogo from "@/components/layout/app-logo"
import MobileDashboardHome from "@/components/dashboard/mobile-dashboard-home"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { LifeBuoy, Map } from "lucide-react"

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
    <>
      <header className="sticky top-0 z-40 border-b border-border/60 bg-card/90 shadow-sm backdrop-blur-xl">
        <div className="mx-auto flex min-h-16 max-w-[1440px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <Link href="/dashboard" className="shrink-0 transition-opacity hover:opacity-80" aria-label="Waypoint dashboard">
            <AppLogo size="sm" showText={true} />
          </Link>

          <div className="mx-4 hidden min-w-0 flex-1 md:block">
            <p className="truncate text-sm font-semibold text-foreground">
              Welcome back, <span className="text-primary">{userName}</span>
            </p>
            <p className="text-xs text-muted-foreground">Your space to check in, learn, reflect and keep track of what matters to you.</p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <Link
              href="/support"
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-destructive/20 bg-destructive/5 px-3 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/10"
              aria-label="Get support"
            >
              <LifeBuoy className="size-4" />
              <span className="hidden sm:inline">Support</span>
            </Link>

            <Link
              href="/journey"
              className="hidden min-h-10 items-center gap-2 rounded-lg bg-primary px-3.5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 lg:inline-flex"
            >
              <Map className="size-4" />
              <span>Journey</span>
              {journeyProgress && (
                <span className="rounded-md bg-primary-foreground/15 px-1.5 py-0.5 text-xs font-bold">
                  {journeyProgress.completed}/{journeyProgress.total}
                </span>
              )}
            </Link>

            <UserMenu userName={userName} userEmail={userEmail} />
          </div>
        </div>
      </header>

      <MobileDashboardHome userName={userName} journeyProgress={journeyProgress} />
    </>
  )
}
