"use client"

import Link from "next/link"
import {
  BarChart3,
  BookOpenCheck,
  CalendarDays,
  Home,
  LifeBuoy,
  Share2,
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
  { label: "Privacy & sharing", href: "/privacy#professional-sharing", icon: Share2 },
  { label: "Community", href: "/community", icon: Users },
  { label: "Support", href: "/support", icon: LifeBuoy, urgent: true },
]

function NavItems({ side = false }: { side?: boolean }) {
  return (
    <TooltipProvider delayDuration={120}>
      {items.map((item) => {
        const Icon = item.icon
        return (
          <Tooltip key={`${side ? "side" : "inline"}-${item.label}`}>
            <TooltipTrigger asChild>
              <Link
                href={item.href}
                aria-label={item.label}
                className={`flex items-center justify-center rounded-xl transition-colors ${
                  side ? "size-10" : "size-9"
                } ${
                  item.urgent
                    ? "text-destructive hover:bg-destructive/10"
                    : item.href === "/dashboard"
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                }`}
              >
                <Icon className="size-[17px]" />
              </Link>
            </TooltipTrigger>
            <TooltipContent side={side ? "right" : "bottom"} sideOffset={8}>
              <p>{item.label}</p>
            </TooltipContent>
          </Tooltip>
        )
      })}
    </TooltipProvider>
  )
}

export default function DesktopDashboardRail() {
  return (
    <>
      <nav
        className="hidden items-center gap-0.5 rounded-xl border border-border/60 bg-background/70 p-1 lg:flex 2xl:hidden"
        aria-label="Dashboard shortcuts"
      >
        <NavItems />
      </nav>

      <aside
        className="fixed left-1.5 top-20 z-30 hidden 2xl:block"
        aria-label="Dashboard shortcuts"
      >
        <div className="flex flex-col items-center gap-1 rounded-2xl border border-border/60 bg-card/90 p-1.5 shadow-sm backdrop-blur-xl">
          <NavItems side />
        </div>
      </aside>
    </>
  )
}
