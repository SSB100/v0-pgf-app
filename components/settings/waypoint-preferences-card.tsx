"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { Check, Compass, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AVATAR_OPTIONS } from "@/lib/onboarding-data"
import { NO_COMPANION_ID } from "@/lib/waypoint-preferences-policy.mjs"

const FOCUS_OPTIONS = [
  { id: "gambling", label: "Gambling", description: "Gambling, betting, casinos, pokies or related spending and urges" },
  { id: "alcohol", label: "Alcohol", description: "Understanding or changing your alcohol use in a way that fits your goals" },
  { id: "substances", label: "Substance use", description: "Understanding or changing use of drugs or other substances" },
  { id: "gaming", label: "Gaming or internet", description: "Gaming, online activity or digital spending you want to understand or change" },
  { id: "mental_health", label: "Mental wellbeing", description: "Stress, mood, anxiety, attention, trauma-related concerns or other wellbeing areas" },
  { id: "personal_growth", label: "Personal growth", description: "Values, habits, relationships, confidence or other areas you want to work on" },
] as const

type Preferences = {
  journeyTypes: string[]
  growthAvatar: string
}

export default function WaypointPreferencesCard() {
  const [preferences, setPreferences] = useState<Preferences>({ journeyTypes: [], growthAvatar: "" })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")

  useEffect(() => {
    let cancelled = false

    async function loadPreferences() {
      try {
        const response = await fetch("/api/user/waypoint-preferences", { cache: "no-store" })
        const data = await response.json()
        if (!response.ok) throw new Error(data.error || "Unable to load Waypoint preferences")
        if (!cancelled) {
          setPreferences({
            journeyTypes: Array.isArray(data.journeyTypes) ? data.journeyTypes : [],
            growthAvatar: typeof data.growthAvatar === "string" ? data.growthAvatar : "growth_tree",
          })
        }
      } catch (caught) {
        if (!cancelled) setError(caught instanceof Error ? caught.message : "Unable to load Waypoint preferences")
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    void loadPreferences()
    return () => { cancelled = true }
  }, [])

  function toggleFocus(id: string) {
    setMessage("")
    setPreferences((current) => ({
      ...current,
      journeyTypes: current.journeyTypes.includes(id)
        ? current.journeyTypes.filter((item) => item !== id)
        : [...current.journeyTypes, id],
    }))
  }

  async function savePreferences() {
    if (isSaving || preferences.journeyTypes.length === 0 || !preferences.growthAvatar) return
    setError("")
    setMessage("")
    setIsSaving(true)

    try {
      const response = await fetch("/api/user/waypoint-preferences", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(preferences),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Unable to update Waypoint preferences")

      setPreferences({
        journeyTypes: Array.isArray(data.journeyTypes) ? data.journeyTypes : preferences.journeyTypes,
        growthAvatar: typeof data.growthAvatar === "string" ? data.growthAvatar : preferences.growthAvatar,
      })
      setMessage("Your Waypoint preferences have been updated. Your existing progress and history have not been reset.")
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to update Waypoint preferences")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card className="p-4 sm:p-6">
      <div className="mb-5 flex items-start gap-3">
        <div className="rounded-lg bg-primary/10 p-2"><Compass className="size-5 text-primary" /></div>
        <div>
          <h2 className="text-xl font-semibold">Waypoint preferences</h2>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            Change what Waypoint prioritises and how your engagement progress is represented. These choices do not erase your history, credits, Journey progress or sharing settings.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">Loading your Waypoint preferences...</div>
      ) : (
        <div className="space-y-6">
          <section>
            <div className="mb-3">
              <h3 className="font-semibold text-foreground">Focus areas</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Choose one or more areas. This changes what Waypoint can prioritise or suggest; it does not delete earlier entries or decide a diagnosis.
              </p>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {FOCUS_OPTIONS.map((option) => {
                const selected = preferences.journeyTypes.includes(option.id)
                return (
                  <button
                    key={option.id}
                    type="button"
                    disabled={isSaving}
                    onClick={() => toggleFocus(option.id)}
                    className={`rounded-xl border-2 p-3 text-left transition-colors ${selected ? "border-primary bg-primary/10" : "border-border bg-card hover:border-primary/40"}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-foreground">{option.label}</p>
                        <p className="mt-1 text-xs leading-5 text-muted-foreground">{option.description}</p>
                      </div>
                      {selected && <Check className="mt-0.5 size-4 shrink-0 text-primary" />}
                    </div>
                  </button>
                )
              })}
            </div>
            {preferences.journeyTypes.length === 0 && (
              <p className="mt-2 text-xs text-destructive">Keep at least one focus area selected.</p>
            )}
          </section>

          <section>
            <div className="mb-3">
              <h3 className="font-semibold text-foreground">Growth display</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                A companion is optional. Companion mode and Progress only use the same Growth Credits and engagement levels, and you can switch later without resetting them.
              </p>
            </div>

            <button
              type="button"
              disabled={isSaving}
              onClick={() => { setMessage(""); setPreferences((current) => ({ ...current, growthAvatar: NO_COMPANION_ID })) }}
              className={`mb-3 w-full rounded-xl border-2 p-4 text-left transition-colors ${preferences.growthAvatar === NO_COMPANION_ID ? "border-primary bg-primary/10" : "border-border bg-card hover:border-primary/40"}`}
            >
              <div className="flex items-center gap-3">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10"><Sparkles className="size-5 text-primary" /></div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2"><p className="font-semibold text-foreground">Progress only</p>{preferences.growthAvatar === NO_COMPANION_ID && <Check className="size-4 text-primary" />}</div>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">Use credits, engagement levels and milestones without a character or creature.</p>
                </div>
              </div>
            </button>

            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Fantasy Companions</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {AVATAR_OPTIONS.map((avatar) => {
                const selected = preferences.growthAvatar === avatar.id
                return (
                  <button
                    key={avatar.id}
                    type="button"
                    disabled={isSaving}
                    onClick={() => { setMessage(""); setPreferences((current) => ({ ...current, growthAvatar: avatar.id })) }}
                    className={`rounded-xl border-2 p-3 text-left transition-colors ${selected ? "border-primary bg-primary/10" : "border-border bg-card hover:border-primary/40"}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative size-14 shrink-0 overflow-hidden rounded-lg border bg-secondary/20">
                        <Image src={avatar.previewImage || "/placeholder.svg"} alt="" fill className="object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2"><p className="text-sm font-semibold text-foreground">{avatar.name}</p>{selected && <Check className="size-4 text-primary" />}</div>
                        <p className="mt-0.5 text-xs text-primary/80">{avatar.theme}</p>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </section>

          {error && <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive" role="alert">{error}</div>}
          {message && <div className="rounded-lg border border-primary/20 bg-primary/10 p-3 text-sm text-foreground" role="status">{message}</div>}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-5 text-muted-foreground">
              Growth display is an engagement preference. It does not represent recovery, health or personal worth.
            </p>
            <Button type="button" onClick={savePreferences} disabled={isSaving || preferences.journeyTypes.length === 0 || !preferences.growthAvatar} className="shrink-0">
              {isSaving ? "Saving..." : "Save Waypoint preferences"}
            </Button>
          </div>
        </div>
      )}
    </Card>
  )
}
