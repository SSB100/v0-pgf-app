import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { sql } from "@/lib/db"
import Image from "next/image"
import Link from "next/link"
import {
  Brain,
  CheckCircle2,
  ChevronRight,
  Circle,
  Compass,
  Heart,
  MessageCircle,
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
  type JourneyModuleKind,
} from "@/lib/journey-curriculum"

const CATEGORY_META: Record<JourneyCategory, {
  description: string
  Icon: typeof Brain
  borderClass: string
  iconClass: string
  progressClass: string
}> = {
  "Getting Started": {
    description: "Understand the pattern, motivation and the wider change process before jumping straight to solutions.",
    Icon: Compass,
    borderClass: "border-sky-500/35 bg-sky-500/5",
    iconClass: "bg-sky-500/15 border-sky-500/30 text-sky-500",
    progressClass: "bg-sky-500",
  },
  "Mindfulness & Awareness": {
    description: "Learn how to notice thoughts, emotions, urges and choice points before responding automatically.",
    Icon: Brain,
    borderClass: "border-blue-500/35 bg-blue-500/5",
    iconClass: "bg-blue-500/15 border-blue-500/30 text-blue-500",
    progressClass: "bg-blue-500",
  },
  "Emotions & Responses": {
    description: "Understand emotional experience, check interpretations and practise different ways of responding.",
    Icon: Sparkles,
    borderClass: "border-violet-500/35 bg-violet-500/5",
    iconClass: "bg-violet-500/15 border-violet-500/30 text-violet-500",
    progressClass: "bg-violet-500",
  },
  "Values & Direction": {
    description: "Reconnect with values and strengths, then turn them into realistic actions and support.",
    Icon: Heart,
    borderClass: "border-pink-500/35 bg-pink-500/5",
    iconClass: "bg-pink-500/15 border-pink-500/30 text-pink-500",
    progressClass: "bg-pink-500",
  },
  "Distress & Problem Solving": {
    description: "Build options for intense moments, acceptance and problems that can be acted on.",
    Icon: Wrench,
    borderClass: "border-emerald-500/35 bg-emerald-500/5",
    iconClass: "bg-emerald-500/15 border-emerald-500/30 text-emerald-500",
    progressClass: "bg-emerald-500",
  },
  "Relationships & Connection": {
    description: "Practise communication while balancing your objective, the relationship and self-respect.",
    Icon: MessageCircle,
    borderClass: "border-amber-500/35 bg-amber-500/5",
    iconClass: "bg-amber-500/15 border-amber-500/30 text-amber-500",
    progressClass: "bg-amber-500",
  },
  "Putting It Together": {
    description: "Bring the learning into one practical plan for direction, skills, safeguards, resources and support.",
    Icon: CheckCircle2,
    borderClass: "border-primary/35 bg-primary/5",
    iconClass: "bg-primary/15 border-primary/30 text-primary",
    progressClass: "bg-primary",
  },
}

const KIND_LABELS: Record<JourneyModuleKind, string> = {
  foundation: "Foundation",
  learning: "Learn",
  skill: "Practice skill",
  integration: "Put it together",
}

export default async function JourneyPage() {
  const user = await getSession()
  if (!user) redirect("/auth/signin")

  const profileResult = await sql`
    SELECT onboarding_completed
    FROM user_profiles
    WHERE user_id = ${user.id}
  `

  if (!profileResult[0]?.onboarding_completed) redirect("/onboarding")

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

  const totalModules = JOURNEY_MODULES.length
  const completedCount = Array.from(completedModules).filter((slug) => knownSlugs.has(slug)).length

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-6">
      <DashboardHeader
        userName={user.full_name || "there"}
        userEmail={user.email}
        journeyProgress={{ completed: completedCount, total: totalModules }}
      />

      <main className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-6">
        <div className="relative overflow-hidden rounded-2xl border border-primary/30 min-h-[230px] sm:min-h-[260px]">
          <Image src="/images/journey-hero.jpg" alt="A path through a green valley representing personal growth" fill className="object-cover object-center" priority />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/82 to-background/45" />
          <div className="relative p-6 sm:p-8 flex flex-col justify-center min-h-[230px] sm:min-h-[260px] max-w-2xl">
            <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">Your Learning Journey</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 text-pretty leading-tight">Learn it. Check it. Practise it.</h1>
            <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
              The Journey now brings the learning modules and practical skills into one sequence. Each module explains the idea, gives you a quick understanding check and finishes with a small exercise so you can practise what you have just learned.
            </p>
            <p className="text-xs text-muted-foreground mb-4">
              The material is informed by established approaches including DBT, ACT, CBT, mindfulness and behaviour-change frameworks. It is self-guided learning, not a clinical assessment or replacement for treatment.
            </p>
            {coreValues.length > 0 && (
              <p className="text-sm text-muted-foreground mb-4 text-pretty">
                Values you narrowed down during onboarding: <span className="text-foreground font-medium">{coreValues.join(", ")}</span>
              </p>
            )}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 bg-card/85 backdrop-blur-sm rounded-lg px-3 py-2 border border-border/50">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span className="text-sm font-semibold text-foreground">{completedCount} explored</span>
              </div>
              <div className="flex items-center gap-2 bg-card/85 backdrop-blur-sm rounded-lg px-3 py-2 border border-border/50">
                <Circle className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">{totalModules - completedCount} available</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-3">
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">1. Learn</p>
            <p className="text-sm text-muted-foreground">Short explanations rebuild the depth behind each concept rather than presenting only an acronym or tip.</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">2. Check</p>
            <p className="text-sm text-muted-foreground">A one-question knowledge check confirms the core idea before the activity is recorded.</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">3. Practise</p>
            <p className="text-sm text-muted-foreground">Every module ends with a small exercise. Personal details can be reflected on privately rather than typed.</p>
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
              <p className="text-xs text-muted-foreground">Environment changes, support and barriers can create extra space while you practise new responses.</p>
            </div>
            <Link href="/safeguards">
              <Button variant="outline" size="sm" className="flex-shrink-0 border-orange-500/40 text-orange-400 hover:bg-orange-500/10">
                View options <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="space-y-9">
          {JOURNEY_CATEGORY_ORDER.map((category) => {
            const modules = JOURNEY_MODULES.filter((module) => module.category === category)
            const meta = CATEGORY_META[category]
            const { Icon } = meta
            const completedInCategory = modules.filter((module) => completedModules.has(module.slug)).length
            const progressPct = modules.length > 0 ? (completedInCategory / modules.length) * 100 : 0

            return (
              <section key={category} className="space-y-3">
                <div className={`rounded-xl border ${meta.borderClass} p-4 sm:p-5`}>
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-lg border flex items-center justify-center flex-shrink-0 ${meta.iconClass}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg sm:text-xl font-bold text-foreground">{category}</h2>
                      <p className="text-xs sm:text-sm text-muted-foreground text-pretty leading-relaxed max-w-2xl">{meta.description}</p>
                    </div>
                    <span className="text-xs font-semibold text-muted-foreground whitespace-nowrap">{completedInCategory}/{modules.length}</span>
                  </div>
                  <div className="bg-background/50 rounded-full h-1.5 overflow-hidden">
                    <div className={`${meta.progressClass} h-full transition-all duration-500`} style={{ width: `${progressPct}%` }} />
                  </div>
                </div>

                <div className="space-y-2 sm:pl-3">
                  {modules.map((module) => {
                    const isCompleted = completedModules.has(module.slug)
                    const globalIndex = JOURNEY_MODULES.findIndex((item) => item.slug === module.slug)

                    return (
                      <Link key={module.slug} href={`/journey/learn/${module.slug}`} className="block">
                        <div className={`flex items-center gap-3 sm:gap-4 p-4 rounded-xl border transition-all hover:border-primary/50 hover:bg-secondary/30 cursor-pointer ${isCompleted ? "border-emerald-500/30 bg-emerald-500/5" : "border-border/50 bg-card"}`}>
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${isCompleted ? "bg-emerald-500/20" : "bg-secondary/50"}`}>
                            {isCompleted ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <span className="text-sm font-bold text-muted-foreground">{globalIndex + 1}</span>}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <h3 className="font-semibold text-sm sm:text-base text-foreground">{module.title}</h3>
                              <Badge variant="outline" className="text-[10px] sm:text-xs py-0 font-normal">{KIND_LABELS[module.kind]}</Badge>
                              {isCompleted && <Badge className="bg-emerald-500/15 text-emerald-500 border-emerald-500/30 text-[10px] sm:text-xs py-0">Explored</Badge>}
                            </div>
                            <p className="text-xs sm:text-sm text-muted-foreground text-pretty leading-relaxed">{module.description}</p>
                            <p className="text-[11px] text-muted-foreground/80 mt-1">About {module.estimatedMinutes} min · {module.approaches.join(" · ")}</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </section>
            )
          })}
        </div>

        <div className="relative overflow-hidden rounded-xl border border-primary/20 bg-card p-6 text-center">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
          <p className="relative text-sm text-foreground/80 text-balance leading-relaxed">
            The order is designed to build from understanding and awareness into emotion skills, values, distress tolerance and relationships, but you can revisit any module. Taking a break does not undo earlier learning.
          </p>
        </div>
      </main>

      <MobileNav />
    </div>
  )
}
