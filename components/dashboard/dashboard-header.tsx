"use client"

import UserMenu from "@/components/layout/user-menu"
import AppLogo from "@/components/layout/app-logo"
import MobileDashboardHome from "@/components/dashboard/mobile-dashboard-home"
import DesktopDashboardRail from "@/components/dashboard/desktop-dashboard-rail"
import Link from "next/link"
import { LifeBuoy } from "lucide-react"

interface DashboardHeaderProps {
  userName: string
  userEmail: string
  journeyProgress?: {
    completed: number
    total: number
  }
}

export default function DashboardHeader({ userName, userEmail, journeyProgress }: DashboardHeaderProps) {
  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border/60 bg-card/90 shadow-sm backdrop-blur-xl">
        <div className="mx-auto flex min-h-16 max-w-[1440px] items-center justify-between gap-3 px-4 sm:px-6 lg:min-h-14 lg:px-8">
          <Link href="/dashboard" className="shrink-0 transition-opacity hover:opacity-80" aria-label="Waypoint dashboard">
            <AppLogo size="sm" showText={true} />
          </Link>

          <div className="mx-3 hidden min-w-0 flex-1 md:block lg:mx-4">
            <p className="truncate text-sm font-semibold text-foreground">
              Welcome back, <span className="text-primary">{userName}</span>
            </p>
            <p className="hidden truncate text-xs text-muted-foreground xl:block">Check in, learn, reflect and keep track of what matters to you.</p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <DesktopDashboardRail />

            <Link
              href="/support"
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-destructive/20 bg-destructive/5 px-3 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/10 lg:hidden"
              aria-label="Get support"
            >
              <LifeBuoy className="size-4" />
              <span className="hidden sm:inline">Support</span>
            </Link>

            <UserMenu userName={userName} userEmail={userEmail} />
          </div>
        </div>
      </header>

      <MobileDashboardHome userName={userName} journeyProgress={journeyProgress} />
    </>
  )
}
