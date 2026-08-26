import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { sql } from "@/lib/db"
import Image from "next/image"
import Link from "next/link"
import {
  Brain,
  CheckCircle2,
  ChevronRight,
  Compass,
  Heart,
  MessageCircle,
  PauseCircle,
  Shield,
  Sparkles,
  Wrench,
} from "lucide-react"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import MobileNav from "@/components/dashboard/mobile-nav"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  JOURNEY_CATEGORY_ORDER,
  JOURNEY_MODULES,
  type JourneyCategory,
} from "@/lib/journey-curriculum"
import { GAMBLING_PROTECTION_ITEMS } from "@/lib/gambling-protection-guide"

const CATEGORY_META: Record<JourneyCategory, {
  description: string
  Icon: typeof Brain
  borderClass: string
  iconClass: string
  progressClass: string
}> = {
  "Getting Started": {
    description: "Understand what is happening and what may help change become possible.",
    Icon: Compass,
    borderClass: "border-sky-500/35 bg-sky-500/5",
    iconClass: "bg-sky-500/15 border-sky-500/30 text-sky-500",
    progressClass: "bg-sky-500",
  },
  "Mindfulness & Awareness": {
    description: "Notice thoughts, emotions, urges and choice points before reacting automatically.",
    Icon: Brain,
    borderClass: "border-blue-500/35 bg-blue-500/5",
    iconClass: "bg-blue-500/15 border-blue-500/30 text-blue-500",
    progressClass: "bg-blue-500",
  },
  "Emotions & Responses": {
    description: "Understand emotions and practise different ways of responding.",
    Icon: Sparkles,
    borderClass: "border-violet-500/35 bg-violet-500/5",
    iconClass: "bg-violet-500/15 border-violet-500/30 text-violet-500",
    progressClass: "bg-violet-500",
  },
  "Values & Direction": {
    description: "Reconnect with values and strengths, then turn them into realistic action.",
    Icon: Heart,
    borderClass: "border-pink-500/35 bg-pink-500/5",
    iconClass: "bg-pink-500/15 border-pink-500/30 text-pink-500",
    progressClass: "bg-pink-500",
  },
  "Distress & Problem Solving": {
    description: "Build options for intense moments and problems that can be acted on.",
    Icon: Wrench,
    borderClass: "border-emerald-500/35 bg-emerald-500/5",
    iconClass: "bg-emerald-500/15 border-emerald-500/30 text-emerald-500",
    progressClass: "bg-emerald-500",
  },
  "Relationships & Connection": {
    description: "Practise communication while keeping needs, relationships and self-respect in view.",
    Icon: MessageCircle,
    borderClass: "border-amber-500/35 bg-amber-500/5",
    iconClass: "bg-amber-500/15 border-amber-500/30 text-amber-500",
    progressClass: "bg-amber-500",
  },
  "Putting It Together": {
    description: "Bring the learning into one practical plan you can return to.",
    Icon: CheckCircle2,
    borderClass: "border-primary/35 bg-primary/5",
    iconClass: "bg-primary/15 border-primary/30 text-primary",
    progressClass: "bg-primary",
  },
}

function toStringList(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((item): item is string => typeof item === "string")
  if (typeof value !== "string") return []

  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : []
  } catch {
    return []
  }
}

export default async function JourneyPage() {
  const user = await getSession()
  if (!user) redirect("/auth/signin")

  const profileResult = await sql`
    SELECT onboarding_completed, journey_types
    FROM user_profiles
    WHERE user_id = ${user.id}
  `
  const profile = profileResult[0]

  if (!profile?.onboarding_completed) redirect("/onboarding")

  const journeyTypes = toStringList(profile.journey_types)
  const hasGambling = journeyTypes.includes("gambling")

  const completedResult = await sql`
    SELECT module_slug
    FROM journey_completions
    WHERE user_id = ${user.id}
  `
  const completedModules = new Set(completedResult.map((row) => row.module_slug))
  const knownSlugs = new Set(JOURNEY_MODULES.map((module) => module.slug))

  const valuesResult = await sql`
    SELECT value_name
    FROM user_values
    WHERE user_id = ${user.id} AND is_core_value = true
    ORDER BY rank
    LIMIT 3
  `
  const coreValues = valuesResult.map((v) => v.value_name)

  let activeSafeguardCount = 0
  if (hasGambling) {
    const safeguardCountResult = await sql`
      SELECT COUNT(*)::int AS active_count
      FROM user_safeguard_checklist
      WHERE user_id = ${user.id} AND is_active = TRUE
    `
    activeSafeguardCount = Number(safeguardCountResult[0]?.active_count || 0)
  }

  const totalModules = JOURNEY_MODULES.length
  const completedCount = Array.from(completedModules).filter((slug) => knownSlugs.has(slug)).length
  const nextModule = JOURNEY_MODULES.find((module) => !completedModules.has(module.slug)) || null
  const currentCategory: JourneyCategory = nextModule?.category || "Putting It Together"

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-6">
      <DashboardHeader
        userName={user.full_name || "there"}
        userEmail={user.email}
        journeyProgress={{ completed: completedCount, total: totalModules }}
      />

      <main className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-6">
        <div className="relative overflow-hidden rounded-2xl border border-primary/30 min-h-[220px] sm:min-h-[245px]">
          <Image src="/images/journey-hero.jpg" alt="A path through a green valley representing personal growth" fill className="object-cover object-center" priority />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/84 to-background/45" />
          <div className="relative p-6 sm:p-8 flex flex-col justify-center min-h-[220px] sm:min-h-[245px] max-w-2xl">
            <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">Your Learning Journey</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 text-pretty leading-tight">One step at a time.</h1>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
              This Journey is meant to unfold over weeks, not in one sitting. A useful pace is one module on a harder day, or up to two when you have more capacity. Then stop and give the ideas time to settle into real life.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge className="bg-card/85 text-foreground border-border/60 hover:bg-card/85">
                {completedCount > 0 ? `${completedCount} explored` : "Start when you are ready"}
              </Badge>
              <Badge variant="outline" className="bg-card/70">Suggested pace: 1–2 modules a day</Badge>
            </div>
          </div>
        </div>

        {hasGambling && (
          <div className="rounded-2xl border-2 border-orange-500/30 bg-orange-500/5 p-4 sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex min-w-0 flex-1 items-start gap-3">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-orange-500/30 bg-orange-500/15">
                  <Shield className="size-5 text-orange-500" />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-xs font-semibold uppercase tracking-wider text-orange-600 dark:text-orange-400">Optional first protection step</p>
                    <Badge variant="outline" className="border-orange-500/30 text-[10px] text-orange-700 dark:text-orange-300">
                      {activeSafeguardCount}/{GAMBLING_PROTECTION_ITEMS.length} marked active
                    </Badge>
                  </div>
                  <h2 className="mt-1 text-lg font-bold text-foreground sm:text-xl">Put practical gambling barriers in place</h2>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    Before or alongside the learning modules, review blocking, self-exclusion, account and payment controls you can choose to set up in the real world.
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">This guide is optional and never blocks access to the 27 Journey modules.</p>
                </div>
              </div>
              <Link href="/journey/protection-setup" className="shrink-0">
                <Button variant="outline" className="w-full border-orange-500/35 text-orange-700 hover:bg-orange-500/10 dark:text-orange-300 sm:w-auto">
                  Review protection guide <ChevronRight className="ml-1.5 size-4" />
                </Button>
              </Link>
            </div>
          </div>
        )}

        {nextModule ? (
          <div className="rounded-2xl border-2 border-primary/30 bg-primary/5 p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-1">Your next small step</p>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">{nextModule.title}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{nextModule.description}</p>
                <p className="text-xs text-muted-foreground mt-2">About {nextModule.estimatedMinutes} minutes. You can pause part-way through.</p>
              </div>
              <Link href={`/journey/learn/${nextModule.slug}`} className="flex-shrink-0">
                <Button size="lg" className="w-full sm:w-auto">
                  Continue Journey <ChevronRight className="ml-1.5 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">Journey explored</p>
            <h2 className="text-xl font-bold text-foreground mb-2">You have explored every module.</h2>
            <p className="text-sm text-muted-foreground">There is no requirement to keep moving forward. Revisit individual modules when a skill or idea becomes relevant again.</p>
          </div>
        )}

        {coreValues.length > 0 && (
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground">
              Values you narrowed down during onboarding: <span className="font-medium text-foreground">{coreValues.join(", ")}</span>. They can change in priority over time.
            </p>
          </div>
        )}

        <div>
          <div className="mb-4">
            <h2 className="text-xl font-bold text-foreground">The seven stages</h2>
            <p className="text-sm text-muted-foreground mt-1">Only your current stage is opened for you. The others stay folded away unless you choose to look ahead or revisit them.</p>
          </div>

          <div className="space-y-3">
            {JOURNEY_CATEGORY_ORDER.map((category) => {
              const modules = JOURNEY_MODULES.filter((module) => module.category === category)
              const meta = CATEGORY_META[category]
              const { Icon } = meta
              const completedInCategory = modules.filter((module) => completedModules.has(module.slug)).length
              const progressPct = modules.length > 0 ? (completedInCategory / modules.length) * 100 : 0
              const categoryComplete = completedInCategory === modules.length
              const isCurrentCategory = category === currentCategory

              return (
                <details key={category} open={isCurrentCategory} className={`group rounded-xl border ${meta.borderClass} overflow-hidden`}>
                  <summary className="list-none cursor-pointer p-4 sm:p-5 select-none">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-lg border flex items-center justify-center flex-shrink-0 ${meta.iconClass}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="text-base sm:text-lg font-bold text-foreground">{category}</h3>
                          {isCurrentCategory && !categoryComplete && <Badge className="text-[10px] py-0">Current stage</Badge>}
                          {categoryComplete && <Badge className="bg-emerald-500/15 text-emerald-500 border-emerald-500/30 text-[10px] py-0">Explored</Badge>}
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{meta.description}</p>
                      </div>
                      <span className="text-xs font-semibold text-muted-foreground whitespace-nowrap">{completedInCategory}/{modules.length}</span>
                    </div>
                    <div className="mt-3 bg-background/50 rounded-full h-1.5 overflow-hidden">
                      <div className={`${meta.progressClass} h-full transition-all duration-500`} style={{ width: `${progressPct}%` }} />
                    </div>
                  </summary>

                  <div className="border-t border-border/40 bg-background/35 p-3 sm:p-4 space-y-2">
                    {modules.map((module) => {
                      const isCompleted = completedModules.has(module.slug)
                      const isNext = nextModule?.slug === module.slug

                      return (
                        <Link key={module.slug} href={`/journey/learn/${module.slug}`} className="block">
                          <div className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all hover:border-primary/50 hover:bg-secondary/30 ${isNext ? "border-primary/40 bg-primary/5" : isCompleted ? "border-emerald-500/25 bg-emerald-500/5" : "border-border/50 bg-card"}`}>
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${isCompleted ? "bg-emerald-500/20" : "bg-secondary/50"}`}>
                              {isCompleted ? <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500" /> : <span className="w-2 h-2 rounded-full bg-muted-foreground/50" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2 mb-0.5">
                                <h4 className="font-semibold text-sm sm:text-base text-foreground">{module.title}</h4>
                                {isNext && <Badge variant="outline" className="text-[10px] py-0 border-primary/40 text-primary">Next</Badge>}
                              </div>
                              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{module.description}</p>
                              <p className="text-[11px] text-muted-foreground/75 mt-1">About {module.estimatedMinutes} min</p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                </details>
              )
            })}
          </div>
        </div>

        <div className="relative overflow-hidden rounded-xl border border-orange-500/30 bg-card">
          <div className="absolute inset-0 pointer-events-none">
            <Image src="/images/safeguards-shield.jpg" alt="" fill className="object-cover object-right opacity-15" />
            <div className="absolute inset-0 bg-gradient-to-r from-card/95 via-card/85 to-card/50" />
          </div>
          <div className="relative flex items-center gap-4 px-5 py-4">
            <div className="w-10 h-10 rounded-lg bg-orange-500/15 border border-orange-500/30 flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-orange-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">Learning works alongside practical safeguards</p>
              <p className="text-xs text-muted-foreground">Support, environment changes and barriers can create extra space while you practise new responses.</p>
            </div>
            <Link href="/safeguards">
              <Button variant="outline" size="sm" className="flex-shrink-0 border-orange-500/40 text-orange-400 hover:bg-orange-500/10">
                Safety options <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="rounded-xl border border-primary/20 bg-card p-5 sm:p-6 flex gap-3">
          <PauseCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-foreground mb-1">Do not race the Journey.</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The aim is not to collect completions. Learn one thing, try it, notice what happens, and come back later. At one or two modules a day, this becomes a multi-week process rather than another task to finish as quickly as possible.
            </p>
          </div>
        </div>
      </main>

      <MobileNav />
    </div>
  )
}
