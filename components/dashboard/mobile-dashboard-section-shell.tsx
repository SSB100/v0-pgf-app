import Link from "next/link"
import { ChevronLeft, LifeBuoy } from "lucide-react"
import MobileNav from "@/components/dashboard/mobile-nav"

interface MobileDashboardSectionShellProps {
  title: string
  description: string
  children: React.ReactNode
}

export default function MobileDashboardSectionShell({ title, description, children }: MobileDashboardSectionShellProps) {
  const displayTitle = title === "Growth Companion" ? "Growth & Progress" : title
  const displayDescription = title === "Growth Companion" ? "Your credits, levels and optional companion" : description

  return (
    <div className="min-h-[100dvh] bg-background pb-24">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-card/95 backdrop-blur-xl">
        <div className="mx-auto flex min-h-16 max-w-lg items-center gap-3 px-4">
          <Link
            href="/dashboard"
            aria-label="Back to dashboard"
            className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-border bg-background text-foreground transition-colors hover:bg-secondary/60"
          >
            <ChevronLeft className="size-5" />
          </Link>
          <div className="min-w-0 flex-1">
            <p className="truncate text-base font-bold text-foreground">{displayTitle}</p>
            <p className="truncate text-xs text-muted-foreground">{displayDescription}</p>
          </div>
          <Link
            href="/support"
            aria-label="Support"
            className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-destructive/20 bg-destructive/5 text-destructive"
          >
            <LifeBuoy className="size-4.5" />
          </Link>
        </div>
      </header>

      <main className="mx-auto flex min-h-[calc(100dvh-10rem)] max-w-lg flex-col px-4 py-4 sm:px-5">
        {children}
      </main>

      <MobileNav />
    </div>
  )
}
