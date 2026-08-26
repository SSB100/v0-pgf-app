"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { LockKeyhole, UsersRound } from "lucide-react"
import { Button } from "@/components/ui/button"

type SharingGrant = {
  scope: string
  status: string
}

type ProfessionalConnection = {
  id: string
  status: string
  professional_name: string
  grants: SharingGrant[]
}

type PrivacyOverview = {
  connections?: ProfessionalConnection[]
}

export default function JourneyResponsePrivacyNotice() {
  const [overview, setOverview] = useState<PrivacyOverview | null>(null)
  const [loadFailed, setLoadFailed] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const response = await fetch("/api/privacy/overview", { cache: "no-store" })
        if (!response.ok) throw new Error("Unable to load sharing state")
        const data = await response.json()
        if (!cancelled) setOverview(data)
      } catch {
        if (!cancelled) setLoadFailed(true)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  const sharedWith = useMemo(() => {
    if (!overview?.connections) return []
    return overview.connections
      .filter((connection) => connection.status === "active")
      .filter((connection) => connection.grants.some((grant) => grant.scope === "journey_responses" && grant.status === "active"))
      .map((connection) => connection.professional_name)
      .filter(Boolean)
  }, [overview])

  const hasActiveSharing = sharedWith.length > 0
  const names = sharedWith.length <= 2
    ? sharedWith.join(" and ")
    : `${sharedWith.slice(0, 2).join(", ")} and ${sharedWith.length - 2} other professional${sharedWith.length - 2 === 1 ? "" : "s"}`

  return (
    <div className={`rounded-xl border p-4 ${hasActiveSharing ? "border-amber-300/60 bg-amber-50/70 dark:border-amber-800 dark:bg-amber-950/20" : "border-border bg-muted/20"}`}>
      <div className="flex items-start gap-3">
        {hasActiveSharing ? <UsersRound className="mt-0.5 h-4 w-4 shrink-0 text-amber-700 dark:text-amber-300" /> : <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0 text-primary" />}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">{hasActiveSharing ? "This completed response is currently shared" : "Your completed response is private by default"}</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            {hasActiveSharing
              ? `When you complete this module, your quick-check and exercise response will be saved to Waypoint and available to ${names} under your active Journey responses permission.`
              : loadFailed
                ? "Your completed response is saved to your Waypoint account. Any professional access is controlled separately in Privacy & Sharing."
                : "Your quick-check and exercise response will be saved to your Waypoint account. A connected professional cannot see it unless you explicitly enable the separate Journey responses permission."}
          </p>
          <Button asChild variant="link" size="sm" className="mt-1 h-auto px-0 py-0 text-xs">
            <Link href="/privacy#professional-sharing">Manage sharing</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
