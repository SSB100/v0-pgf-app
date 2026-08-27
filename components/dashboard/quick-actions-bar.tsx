"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import CommunityButton from "./community-button"
import { Share2, Shield } from "lucide-react"

export default function QuickActionsBar() {
  const router = useRouter()

  return (
    <div className="hidden items-center justify-between gap-4 rounded-xl border border-border/60 bg-card/70 px-3 py-2.5 shadow-sm lg:flex">
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Quick links</p>
        <p className="text-xs text-muted-foreground">Useful places that do not need to compete with today's main actions.</p>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <Button
          onClick={() => router.push("/safeguards")}
          variant="outline"
          className="border-primary/20 font-medium hover:border-primary/40 hover:bg-primary/5"
        >
          <Shield className="mr-2 size-4" />
          Safeguards
        </Button>

        <Button
          onClick={() => router.push("/privacy#professional-sharing")}
          variant="outline"
          className="gap-2 border-primary/20 font-medium hover:border-primary/40 hover:bg-primary/5"
        >
          <Share2 className="size-4" />
          Privacy & sharing
        </Button>

        <CommunityButton />
      </div>
    </div>
  )
}
