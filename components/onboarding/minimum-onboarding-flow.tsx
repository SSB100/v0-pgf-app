"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Brain,
  Check,
  Dice1 as Dice,
  Gamepad2,
  HeartHandshake,
  Pill,
  Save,
  ShieldCheck,
  Sparkles,
  Wine,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AVATAR_OPTIONS } from "@/lib/onboarding-data"
import { NO_COMPANION_ID } from "@/lib/minimum-onboarding-policy.mjs"

const FOCUS_OPTIONS = [
  { id: "gambling", label: "Gambling", description: "Gambling, betting, casinos, pokies or related spending and urges", icon: Dice },
  { id: "alcohol", label: "Alcohol", description: "Understanding or changing your alcohol use in a way that fits your goals", icon: Wine },
  { id: "substances", label: "Substance use", description: "Understanding or changing use of drugs or other substances", icon: Pill },
  { id: "gaming", label: "Gaming or internet", description: "Gaming, online activity or digital spending you want to understand or change", icon: Gamepad2 },
  { id: "mental_health", label: "Mental wellbeing", description: "Stress, mood, anxiety, attention, trauma-related concerns or other areas of wellbeing", icon: Brain },
  { id: "personal_growth", label: "Personal growth", description: "Values, habits, relationships, confidence or other areas you want to work on", icon: Sparkles },
] as const

type MinimumOnboardingData = {
  journeyTypes: string[]
  growthAvatar: string
}

type Props = {
  userName: string
  initialStep?: number
  initialData?: Record<string, unknown> | null
}

function initialState(initialData?: Record<string, unknown> | null): MinimumOnboardingData {
  const journeyTypes = Array.isArray(initialData?.journeyTypes)
    ? initialData.journeyTypes.filter((item): item is string => typeof item === "string")
    : []
  const growthAvatar = typeof initialData?.growthAvatar === "string" ? initialData.growthAvatar : ""
  return { journeyTypes, growthAvatar }
}

function initialStepFor(initialStep: number, initialData?: Record<string, unknown> | null) {
  const requested = Math.min(3, Math.max(1, Number.isInteger(initialStep) ? initialStep : 1))
  const savedAvatar = typeof initialData?.growthAvatar === "string" ? initialData.growthAvatar : ""
  if (requested === 3 && !savedAvatar) return 2
  return requested
}

export default function MinimumOnboardingFlow({ userName, initialStep = 1, initialData = null }: Props) {
  const router = useRouter()
  const [step, setStep] = useState(() => initialStepFor(initialStep, initialData))
  const [data, setData] = useState<MinimumOnboardingData>(() => initialState(initialData))
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")

  const selectedAvatar = useMemo(
    () => AVATAR_OPTIONS.find((avatar) => avatar.id === data.growthAvatar) || null,
    [data.growthAvatar],
  )
  const progressOnly = data.growthAvatar === NO_COMPANION_ID

  function toggleFocus(id: string) {
    setData((current) => ({
      ...current,
      journeyTypes: current.journeyTypes.includes(id)
        ? current.journeyTypes.filter((item) => item !== id)
        : [...current.journeyTypes, id],
    }))
  }

  async function saveAndExit() {
    if (busy) return
    setBusy(true)
    setError("")
    try {
      const response = await fetch("/api/onboarding/save-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentStep: step, data }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || "Unable to save your setup")
      window.location.href = "/auth/signin"
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to save your setup")
      setBusy(false)
    }
  }

  async function completeMinimumSetup() {
    if (busy) return
    setBusy(true)
    setError("")
    try {
      const response = await fetch("/api/onboarding/minimum-complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || "Unable to finish setup")
      router.push("/dashboard")
      router.refresh()
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to finish setup")
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 sm:py-10">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Getting started</p>
          <p className="mt-1 text-sm text-muted-foreground">Step {step} of 3 · you can personalise more later</p>
        </div>
        {step < 3 && (
          <Button type="button" variant="ghost" size="sm" className="gap-2 text-muted-foreground" disabled={busy} onClick={saveAndExit}>
            <Save className="size-4" /> Save & finish later
          </Button>
        )}
      </div>

      <div className="mb-6 h-1.5 overflow-hidden rounded-full bg-secondary">
        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(step / 3) * 100}%` }} />
      </div>

      {error && <div className="mb-5 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">{error}</div>}

      {step === 1 && (
        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl sm:text-3xl">What would you like Waypoint to help with?</CardTitle>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
              Choose one or more areas that feel relevant. This helps Waypoint surface useful content. It does not diagnose a condition or decide what your goals should be.
            </p>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-3 sm:grid-cols-2">
              {FOCUS_OPTIONS.map((option) => {
                const Icon = option.icon
                const selected = data.journeyTypes.includes(option.id)
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => toggleFocus(option.id)}
                    className={`rounded-xl border-2 p-4 text-left transition-colors ${selected ? "border-primary bg-primary/10" : "border-border bg-card hover:border-primary/40 hover:bg-secondary/30"}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"><Icon className="size-4.5" /></div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2"><p className="font-semibold text-foreground">{option.label}</p>{selected && <Check className="size-4 text-primary" />}</div>
                        <p className="mt-1 text-xs leading-5 text-muted-foreground">{option.description}</p>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>

            <div className="flex justify-end">
              <Button disabled={data.journeyTypes.length === 0 || busy} onClick={() => setStep(2)}>Continue</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl sm:text-3xl">Choose how you want to see progress</CardTitle>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
              You can use a Growth Companion or keep things simple with Progress only. Both use the same Growth Credits and engagement levels, and you can change this later.
            </p>
          </CardHeader>
          <CardContent className="space-y-5">
            <button
              type="button"
              onClick={() => setData((current) => ({ ...current, growthAvatar: NO_COMPANION_ID }))}
              className={`w-full rounded-xl border-2 p-4 text-left transition-colors ${progressOnly ? "border-primary bg-primary/10" : "border-border bg-card hover:border-primary/40 hover:bg-secondary/30"}`}
            >
              <div className="flex items-center gap-3">
                <div className="flex size-16 shrink-0 items-center justify-center rounded-xl border bg-primary/10"><Sparkles className="size-6 text-primary" /></div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2"><p className="font-semibold text-foreground">Progress only</p>{progressOnly && <Check className="size-4 text-primary" />}</div>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">See credits, levels and milestones without using a character or creature.</p>
                </div>
              </div>
            </button>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Fantasy Companions</p>
              <div className="grid gap-3 md:grid-cols-2">
                {AVATAR_OPTIONS.map((avatar) => {
                  const selected = data.growthAvatar === avatar.id
                  return (
                    <button
                      key={avatar.id}
                      type="button"
                      onClick={() => setData((current) => ({ ...current, growthAvatar: avatar.id }))}
                      className={`rounded-xl border-2 p-4 text-left transition-colors ${selected ? "border-primary bg-primary/10" : "border-border bg-card hover:border-primary/40 hover:bg-secondary/30"}`}
                    >
                      <div className="flex gap-3">
                        <div className="relative size-20 shrink-0 overflow-hidden rounded-xl border bg-secondary/30">
                          <Image src={avatar.previewImage || "/placeholder.svg"} alt="" fill className="object-cover" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2"><p className="font-semibold text-foreground">{avatar.name}</p>{selected && <Check className="size-4 text-primary" />}</div>
                          <p className="mt-0.5 text-xs font-medium text-primary/80">{avatar.theme}</p>
                          <p className="mt-1 text-xs leading-5 text-muted-foreground">{avatar.description}</p>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            <p className="text-xs leading-5 text-muted-foreground">
              Companion changes represent engagement with Waypoint, not recovery, health or personal worth. Choosing Progress only is an equally supported way to use the app.
            </p>

            <div className="flex items-center justify-between gap-3">
              <Button variant="outline" disabled={busy} onClick={() => setStep(1)}>Back</Button>
              <Button disabled={!data.growthAvatar || busy} onClick={() => setStep(3)}>Continue</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <Card className="overflow-hidden border-primary/25 shadow-sm">
          <CardContent className="space-y-6 p-6 sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              {progressOnly ? (
                <div className="flex size-28 shrink-0 items-center justify-center rounded-2xl border border-primary/25 bg-primary/10">
                  <Sparkles className="size-10 text-primary" />
                </div>
              ) : selectedAvatar ? (
                <div className="relative size-28 shrink-0 overflow-hidden rounded-2xl border border-primary/25 bg-secondary/20">
                  <Image src={selectedAvatar.previewImage || "/placeholder.svg"} alt={selectedAvatar.name} fill className="object-cover" />
                </div>
              ) : null}
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Ready to explore</p>
                <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">Your Waypoint is ready, {userName}</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                  You do not need to complete a long assessment before using the app. Start with what feels useful, then add values, strengths, check-ins and more context later if you want to.
                </p>
                <p className="mt-2 text-sm font-medium text-foreground">
                  Progress display: {progressOnly ? "Progress only" : selectedAvatar?.name || "Not selected"}
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border p-4">
                <ShieldCheck className="size-5 text-primary" />
                <p className="mt-3 font-semibold">Support companion, not monitoring</p>
                <p className="mt-1 text-sm leading-5 text-muted-foreground">Waypoint is self-guided support. It is not an emergency monitoring service, diagnosis or replacement for professional care.</p>
              </div>
              <div className="rounded-xl border p-4">
                <HeartHandshake className="size-5 text-primary" />
                <p className="mt-3 font-semibold">You stay in control</p>
                <p className="mt-1 text-sm leading-5 text-muted-foreground">Optional personal details and professional sharing are managed separately. Missing information is not treated as a negative result.</p>
              </div>
            </div>

            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm leading-6 text-muted-foreground">
              Completing this setup does not create a Daily Check-in or award a Growth Credit. Your first check-in will only be recorded when you choose to complete one.
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Button variant="outline" disabled={busy} onClick={() => setStep(2)}>Back</Button>
              <div className="flex flex-col gap-2 sm:items-end">
                <Button className="min-w-44" disabled={busy || !data.growthAvatar} onClick={completeMinimumSetup}>{busy ? "Opening Waypoint…" : "Start using Waypoint"}</Button>
                <Link href="/support" className="text-center text-xs text-muted-foreground hover:text-primary sm:text-right">Need support now? View NZ support options</Link>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
