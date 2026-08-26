"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import {
  Ban,
  Check,
  ChevronDown,
  CreditCard,
  ExternalLink,
  Laptop,
  Loader2,
  Shield,
  Users,
} from "lucide-react"
import {
  GAMBLING_PROTECTION_INFO_LAST_VERIFIED,
  GAMBLING_PROTECTION_ITEMS,
  type GamblingProtectionKey,
} from "@/lib/gambling-protection-guide"

const ICONS: Record<GamblingProtectionKey, typeof Shield> = {
  "device-blocking": Laptop,
  "venue-self-exclusion": Ban,
  "online-account-controls": Shield,
  "bank-payment-block": CreditCard,
  "money-support-friction": Users,
}

export default function GamblingProtectionChecklist({ initialActiveKeys }: { initialActiveKeys: GamblingProtectionKey[] }) {
  const [activeKeys, setActiveKeys] = useState<Set<GamblingProtectionKey>>(() => new Set(initialActiveKeys))
  const [pendingKeys, setPendingKeys] = useState<Set<GamblingProtectionKey>>(() => new Set())
  const [error, setError] = useState<string | null>(null)

  const activeCount = activeKeys.size
  const progress = useMemo(
    () => Math.round((activeCount / GAMBLING_PROTECTION_ITEMS.length) * 100),
    [activeCount],
  )

  async function toggleSafeguard(key: GamblingProtectionKey) {
    if (pendingKeys.has(key)) return

    const wasActive = activeKeys.has(key)
    const nextActive = !wasActive
    setError(null)
    setActiveKeys((current) => {
      const next = new Set(current)
      if (nextActive) next.add(key)
      else next.delete(key)
      return next
    })
    setPendingKeys((current) => new Set(current).add(key))

    try {
      const response = await fetch("/api/safeguards/checklist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ safeguardKey: key, isActive: nextActive }),
      })

      if (!response.ok) throw new Error("Could not save this safeguard status")
    } catch {
      setActiveKeys((current) => {
        const next = new Set(current)
        if (wasActive) next.add(key)
        else next.delete(key)
        return next
      })
      setError("That change could not be saved. Your previous checklist status has been restored.")
    } finally {
      setPendingKeys((current) => {
        const next = new Set(current)
        next.delete(key)
        return next
      })
    }
  }

  return (
    <div className="space-y-4 sm:space-y-5">
      <section className="rounded-2xl border border-orange-500/30 bg-gradient-to-br from-orange-500/10 via-card to-card p-4 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-orange-500/30 bg-orange-500/15">
            <Shield className="size-5 text-orange-500" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-orange-600 dark:text-orange-400">Optional protection setup</p>
            <h1 className="mt-1 text-2xl font-bold text-foreground sm:text-3xl">Put some barriers in place first</h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              When gambling has become hard to control, knowing what practical protections exist can be as important as learning new skills. Choose the safeguards that fit you, set them up in the real world, then mark what you have activated here.
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-border/60 bg-background/70 p-3.5">
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="font-semibold text-foreground">{activeCount} of {GAMBLING_PROTECTION_ITEMS.length} marked active</span>
            <span className="text-xs text-muted-foreground">Optional</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
            <div className="h-full rounded-full bg-orange-500 transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          Waypoint does not verify that a safeguard is active and cannot guarantee that a block will stop every gambling route. Ticking an item only records what you say you have set up. You can change it later, and this checklist does not affect your 27-module Journey progress or Growth Credits.
        </p>
      </section>

      {error && (
        <div role="alert" className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="space-y-3">
        {GAMBLING_PROTECTION_ITEMS.map((item, index) => {
          const Icon = ICONS[item.key]
          const isActive = activeKeys.has(item.key)
          const isPending = pendingKeys.has(item.key)

          return (
            <section key={item.key} className={`overflow-hidden rounded-2xl border bg-card transition-colors ${isActive ? "border-emerald-500/35" : "border-border/70"}`}>
              <div className="p-4 sm:p-5">
                <div className="flex items-start gap-3">
                  <div className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${isActive ? "bg-emerald-500/12 text-emerald-600 dark:text-emerald-400" : "bg-orange-500/10 text-orange-500"}`}>
                    {isActive ? <Check className="size-5" /> : <Icon className="size-5" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Protection {index + 1}</p>
                    <h2 className="mt-0.5 text-base font-bold text-foreground sm:text-lg">{item.title}</h2>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.summary}</p>
                  </div>
                </div>

                <button
                  type="button"
                  aria-pressed={isActive}
                  disabled={isPending}
                  onClick={() => toggleSafeguard(item.key)}
                  className={`mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border px-4 text-sm font-semibold transition-colors disabled:opacity-60 ${isActive ? "border-emerald-500/35 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : "border-orange-500/30 bg-orange-500/5 text-orange-700 hover:bg-orange-500/10 dark:text-orange-300"}`}
                >
                  {isPending ? <Loader2 className="size-4 animate-spin" /> : isActive ? <Check className="size-4" /> : <Shield className="size-4" />}
                  {isPending ? "Saving..." : isActive ? "Marked active — tap to change" : "Mark as active"}
                </button>
              </div>

              <details className="group border-t border-border/60 bg-muted/20">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-semibold text-foreground sm:px-5">
                  How to set this up
                  <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
                </summary>
                <div className="space-y-4 px-4 pb-4 sm:px-5 sm:pb-5">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Why it may help</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.whyItHelps}</p>
                  </div>

                  <ol className="space-y-2.5">
                    {item.steps.map((step, stepIndex) => (
                      <li key={step} className="flex gap-3 text-sm leading-relaxed text-foreground">
                        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-orange-500/10 text-xs font-bold text-orange-600 dark:text-orange-400">{stepIndex + 1}</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>

                  {item.note && (
                    <div className="rounded-xl border border-border/70 bg-background p-3 text-xs leading-relaxed text-muted-foreground">{item.note}</div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {item.links.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-xs font-medium text-foreground hover:border-orange-500/40"
                      >
                        {link.label} <ExternalLink className="size-3" />
                      </a>
                    ))}
                  </div>
                </div>
              </details>
            </section>
          )
        })}
      </div>

      <section className="rounded-2xl border border-primary/20 bg-primary/5 p-4 sm:p-5">
        <h2 className="font-bold text-foreground">You do not need to finish this before learning</h2>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          These protections can be set up now, later, or with support from someone you trust. The Journey stays available regardless of how many items you mark active.
        </p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <Link href="/journey" className="inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground">
            Continue to Journey
          </Link>
          <Link href="/safeguards" className="inline-flex min-h-11 items-center justify-center rounded-xl border border-border bg-background px-4 text-sm font-semibold text-foreground">
            Explore all safeguards
          </Link>
        </div>
      </section>

      <p className="px-2 text-center text-[11px] leading-relaxed text-muted-foreground">
        Safeguard information last checked {GAMBLING_PROTECTION_INFO_LAST_VERIFIED}. Provider features and processes can change, so confirm current details with the provider before relying on a safeguard.
      </p>
    </div>
  )
}
