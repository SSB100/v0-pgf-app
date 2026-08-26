"use client"

import Link from "next/link"
import {
  BarChart3,
  BookOpenCheck,
  CalendarDays,
  Home,
  LifeBuoy,
  Shield,
  Users,
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const items = [
  { label: "Dashboard", href: "/dashboard", icon: Home },
  { label: "Check in", href: "/check-in", icon: CalendarDays },
  { label: "Journey", href: "/journey", icon: BookOpenCheck },
  { label: "Weekly overview", href: "#weekly-overview", icon: BarChart3 },
  { label: "Safeguards", href: "/safeguards", icon: Shield },
  { label: "Community", href: "/community", icon: Users },
  { label: "Support", href: "/support", icon: LifeBuoy, urgent: true },
]

export default function DesktopDashboardRail() {
  return (
    <aside className="hidden w-[68px] shrink-0 lg:block" aria-label="Dashboard shortcuts">
      <div className="sticky top-20 flex flex-col items-center gap-1.5 rounded-2xl border border-border/60 bg-card/85 p-2 shadow-sm backdrop-blur-xl">
        <TooltipProvider delayDuration={150}>
          {items.map((item) => {
            const Icon = item.icon
            return (
              <Tooltip key={item.label}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    aria-label={item.label}
                    className={`flex size-11 items-center justify-center rounded-xl transition-colors ${
                      item.urgent
                        ? "text-destructive hover:bg-destructive/10"
                        : item.href === "/dashboard"
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                    }`}
                  >
                    <Icon className="size-[18px]" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={8}>
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            )
          })}
        </TooltipProvider>
      </div>
    </aside>
  )
}
