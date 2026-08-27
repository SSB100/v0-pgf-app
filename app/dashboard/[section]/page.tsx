import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import {
  ArrowRight,
  Banknote,
  BookOpenCheck,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Compass,
  CreditCard,
  Heart,
  Laptop,
  Shield,
  Users,
} from "lucide-react"
import { getSession } from "@/lib/session"
import { sql } from "@/lib/db"
import { addCalendarDays, getAotearoaDateKey } from "@/lib/aotearoa-date"
import { JOURNEY_MODULES } from "@/lib/journey-curriculum"
import MobileDashboardSectionShell from "@/components/dashboard/mobile-dashboard-section-shell"
import MobileGrowthCompanion from "@/components/dashboard/mobile-growth-companion"

const VALID_SECTIONS = new Set(["growth", "today", "check-ins", "learning", "direction", "safeguards"])

function toDateKey(value: unknown): string | null {
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value)) return value.slice(0, 10)
  return null
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

const focusLabels: Record<string, string> = {
  gambling: "Gambling",
  alcohol: "Alcohol",
  substances: "Substance use",
  gaming: "Gaming or internet",
  mental_health: "Mental wellbeing",
  personal_growth: "Personal growth",
}

export default async function DashboardSectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params
  if (!VALID_SECTIONS.has(section)) notFound()

  const user = await getSession()
  if (!user) redirect("/auth/signin")

  if (section === "growth") {
    const profileResult = await sql`
      SELECT growth_avatar, tree_growth_level, level_credits, check_in_streak
      FROM user_profiles
      WHERE user_id = ${user.id}
      LIMIT 1
    `
    const profile = profileResult[0]
    if (!profile) redirect("/dashboard")

    return (
      <MobileDashboardSectionShell
        title="Growth Companion"
        description="Your avatar, credits and levels"
      >
        <MobileGrowthCompanion
          avatarType={profile.growth_avatar || "growth_tree"}
          level={profile.tree_growth_level || 0}
          levelCredits={profile.level_credits || 0}
          streak={profile.check_in_streak || 0}
        />
      </MobileDashboardSectionShell>
    )
  }

  if (section === "today") {
    const today = getAotearoaDateKey()
    const [todayResult, completedResult] = await Promise.all([
      sql`
        SELECT mood_rating, overall_rating, urge_strength
        FROM daily_checkins
        WHERE user_id = ${user.id} AND date = ${today}::date
        LIMIT 1
      `,
      sql`
        SELECT DISTINCT module_slug
        FROM journey_completions
        WHERE user_id = ${user.id}
      `,
    ])

    const completed = new Set(completedResult.map((row: any) => row.module_slug))
    const nextModule = JOURNEY_MODULES.find((module) => !completed.has(module.slug)) || null
    const todayCheckIn = todayResult[0] || null

    return (
      <MobileDashboardSectionShell title="Today" description="A couple of options, not a task list">
        <div className="flex flex-1 flex-col gap-3">
          <section className={`rounded-3xl border p-4 shadow-sm ${todayCheckIn ? "border-emerald-500/25 bg-emerald-500/5" : "border-border/70 bg-card"}`}>
            <div className="flex items-start justify-between gap-3">
              <div className={`flex size-11 items-center justify-center rounded-2xl ${todayCheckIn ? "bg-emerald-500/10" : "bg-primary/10"}`}>
                {todayCheckIn ? <CheckCircle2 className="size-5 text-emerald-600" /> : <CalendarDays className="size-5 text-primary" />}
              </div>
              <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${todayCheckIn ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : "invisible bg-secondary text-muted-foreground"}`} aria-hidden={!todayCheckIn}>
                {todayCheckIn ? "Recorded today" : "Optional"}
              </span>
            </div>
            <h1 className="mt-3 text-xl font-bold text-foreground">{todayCheckIn ? "Your Daily Reflection is saved" : "How are things today?"}</h1>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {todayCheckIn
                ? "You can leave it there for today or look back at what you recorded."
                : "A short Daily Reflection can capture mood, urges and what stood out. Skip it if it would not help today."}
            </p>
            {todayCheckIn && (
              <div className="mt-3 grid grid-cols-3 gap-2">
                <div className="rounded-xl bg-background/75 p-2.5 text-center"><p className="text-[10px] text-muted-foreground">Mood</p><p className="text-lg font-bold">{todayCheckIn.mood_rating}/10</p></div>
                <div className="rounded-xl bg-background/75 p-2.5 text-center"><p className="text-[10px] text-muted-foreground">Overall</p><p className="text-lg font-bold">{todayCheckIn.overall_rating ?? "—"}{todayCheckIn.overall_rating != null ? "/10" : ""}</p></div>
                <div className="rounded-xl bg-background/75 p-2.5 text-center"><p className="text-[10px] text-muted-foreground">Urges</p><p className="text-lg font-bold">{todayCheckIn.urge_strength ?? "—"}{todayCheckIn.urge_strength != null ? "/10" : ""}</p></div>
              </div>
            )}
            <Link href={todayCheckIn ? "/dashboard/check-ins" : "/check-in"} className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground">
              {todayCheckIn ? "View Daily Reflections" : "Open Daily Reflection"} <ArrowRight className="size-4" />
            </Link>
          </section>

          <section className="rounded-3xl border border-border/70 bg-card p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10"><BookOpenCheck className="size-5 text-primary" /></div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">Learning option</p>
                <h2 className="text-base font-bold text-foreground">{nextModule ? nextModule.title : "Revisit anything from your Journey"}</h2>
              </div>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {nextModule
                ? "This is simply the first module you have not explored yet. Choose it if it fits today, or browse for something else."
                : "You have explored the current library. Everything stays available whenever a topic becomes useful again."}
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {nextModule && (
                <Link href={`/journey/learn/${nextModule.slug}`} className="inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-3 text-center text-xs font-semibold text-primary-foreground">Open suggestion</Link>
              )}
              <Link href="/journey" className={`inline-flex min-h-11 items-center justify-center rounded-xl border border-border bg-background px-3 text-center text-xs font-semibold text-foreground ${nextModule ? "" : "col-span-2"}`}>Browse Journey</Link>
            </div>
          </section>

          <p className="mt-auto px-2 text-center text-[11px] leading-relaxed text-muted-foreground">
            You do not need to complete either option today. Waypoint is here to be used when it helps.
          </p>
        </div>
      </MobileDashboardSectionShell>
    )
  }

  if (section === "check-ins") {
    const today = getAotearoaDateKey()
    const weekStart = addCalendarDays(today, -6)
    const checkinsResult = await sql`
      SELECT date, mood_rating, overall_rating, urge_strength
      FROM daily_checkins
      WHERE user_id = ${user.id}
        AND date >= ${weekStart}::date
        AND date <= ${today}::date
      ORDER BY date ASC
    `

    const checkins = checkinsResult.map((row: any) => ({ ...row, date: toDateKey(row.date) || String(row.date).slice(0, 10) }))
    const byDate = new Map(checkins.map((row: any) => [row.date, row]))
    const days = Array.from({ length: 7 }, (_, index) => {
      const date = addCalendarDays(weekStart, index)
      const entry = byDate.get(date)
      const weekday = new Date(`${date}T12:00:00`).toLocaleDateString("en-NZ", { weekday: "short" })
      return { date, weekday, entry }
    })
    const recorded = checkins.length
    const avgMood = recorded ? checkins.reduce((sum: number, row: any) => sum + Number(row.mood_rating || 0), 0) / recorded : null
    const avgUrges = recorded ? checkins.reduce((sum: number, row: any) => sum + Number(row.urge_strength || 0), 0) / recorded : null
    const latest = checkins[checkins.length - 1] || null

    return (
      <MobileDashboardSectionShell title="Daily Reflections" description="Your recent entries at a glance">
        <div className="flex flex-1 flex-col gap-3">
          <section className="rounded-3xl border border-border/70 bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Last 7 days</p>
                <h1 className="text-xl font-bold text-foreground">{recorded} recorded day{recorded === 1 ? "" : "s"}</h1>
              </div>
              <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10"><CalendarDays className="size-5 text-primary" /></div>
            </div>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">Empty days stay empty. Missing a Daily Reflection is not treated as a good or bad result.</p>
            <div className="mt-4 grid grid-cols-7 gap-1.5">
              {days.map((day) => (
                <div key={day.date} className="text-center">
                  <p className="text-[9px] font-medium text-muted-foreground">{day.weekday}</p>
                  <div className={`mx-auto mt-1 flex size-8 items-center justify-center rounded-full text-[11px] font-bold ${day.entry ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`}>
                    {day.entry ? day.entry.mood_rating : "–"}
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-2 text-center text-[10px] text-muted-foreground">Numbers show the mood rating you entered for recorded days.</p>
          </section>

          <section className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-border/70 bg-card p-3.5">
              <p className="text-xs text-muted-foreground">Average mood</p>
              <p className="mt-1 text-2xl font-bold text-foreground">{avgMood === null ? "—" : `${avgMood.toFixed(1)}/10`}</p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-card p-3.5">
              <p className="text-xs text-muted-foreground">Average urges</p>
              <p className="mt-1 text-2xl font-bold text-foreground">{avgUrges === null ? "—" : `${avgUrges.toFixed(1)}/10`}</p>
            </div>
          </section>

          {latest ? (
            <section className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
              <p className="text-xs font-semibold text-primary">Most recent entry</p>
              <div className="mt-2 grid grid-cols-3 gap-2 text-center">
                <div><p className="text-[10px] text-muted-foreground">Mood</p><p className="font-bold">{latest.mood_rating}/10</p></div>
                <div><p className="text-[10px] text-muted-foreground">Overall</p><p className="font-bold">{latest.overall_rating ?? "—"}{latest.overall_rating != null ? "/10" : ""}</p></div>
                <div><p className="text-[10px] text-muted-foreground">Urges</p><p className="font-bold">{latest.urge_strength ?? "—"}{latest.urge_strength != null ? "/10" : ""}</p></div>
              </div>
            </section>
          ) : (
            <section className="rounded-2xl border border-dashed border-border p-4 text-center text-sm text-muted-foreground">No Daily Reflections have been recorded in this seven-day window.</section>
          )}

          <Link href="/check-in" className="mt-auto inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-primary/25 bg-primary/5 text-sm font-semibold text-primary">
            Open Daily Reflection <ArrowRight className="size-4" />
          </Link>
        </div>
      </MobileDashboardSectionShell>
    )
  }

  if (section === "learning") {
    const completedResult = await sql`
      SELECT DISTINCT module_slug
      FROM journey_completions
      WHERE user_id = ${user.id}
    `
    const completed = new Set(completedResult.map((row: any) => row.module_slug))
    const completedCount = JOURNEY_MODULES.filter((module) => completed.has(module.slug)).length
    const nextModule = JOURNEY_MODULES.find((module) => !completed.has(module.slug)) || null
    const progress = JOURNEY_MODULES.length ? Math.round((completedCount / JOURNEY_MODULES.length) * 100) : 0

    return (
      <MobileDashboardSectionShell title="Learning" description="Choose what feels useful, at your pace">
        <div className="flex flex-1 flex-col gap-3">
          <section className="rounded-3xl border border-primary/25 bg-gradient-to-br from-primary/12 to-card p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Your Journey</p>
                <h1 className="mt-1 text-2xl font-bold text-foreground">{completedCount} of {JOURNEY_MODULES.length} explored</h1>
              </div>
              <BookOpenCheck className="size-6 text-primary" />
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-secondary"><div className="h-full rounded-full bg-primary" style={{ width: `${progress}%` }} /></div>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">There is no deadline and no need to work through everything in order.</p>
          </section>

          <section className="flex flex-1 flex-col rounded-3xl border border-border/70 bg-card p-4 shadow-sm">
            {nextModule ? (
              <>
                <div className="flex items-center gap-2 text-xs font-semibold text-primary"><Clock3 className="size-4" /> About {nextModule.estimatedMinutes} minutes</div>
                <h2 className="mt-2 text-xl font-bold leading-tight text-foreground">{nextModule.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{nextModule.description}</p>
                <p className="mt-3 rounded-xl bg-secondary/30 p-3 text-xs leading-relaxed text-muted-foreground">This is shown because it is the first current module you have not explored. It is a suggestion, not an instruction.</p>
                <div className="mt-auto grid grid-cols-2 gap-2 pt-4">
                  <Link href={`/journey/learn/${nextModule.slug}`} className="inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-3 text-center text-xs font-semibold text-primary-foreground">Open this module</Link>
                  <Link href="/journey" className="inline-flex min-h-11 items-center justify-center rounded-xl border border-border bg-background px-3 text-center text-xs font-semibold text-foreground">Browse all</Link>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold text-foreground">The current library is explored</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Modules stay available to revisit whenever a skill or idea becomes useful again.</p>
                <Link href="/journey" className="mt-auto inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground">Browse Journey</Link>
              </>
            )}
          </section>
        </div>
      </MobileDashboardSectionShell>
    )
  }

  if (section === "direction") {
    const [valuesResult, profileResult] = await Promise.all([
      sql`
        SELECT value_name, category
        FROM user_values
        WHERE user_id = ${user.id} AND is_core_value = true
        ORDER BY rank ASC
        LIMIT 3
      `,
      sql`
        SELECT journey_types
        FROM user_profiles
        WHERE user_id = ${user.id}
        LIMIT 1
      `,
    ])
    const focusAreas = toStringList(profileResult[0]?.journey_types)

    return (
      <MobileDashboardSectionShell title="Values & Focus" description="The direction you chose for Waypoint">
        <div className="flex flex-1 flex-col gap-3">
          <section className="rounded-3xl border border-primary/20 bg-primary/5 p-4 shadow-sm">
            <div className="flex items-center gap-3"><div className="flex size-10 items-center justify-center rounded-2xl bg-primary/10"><Heart className="size-5 text-primary" /></div><div><p className="text-xs font-semibold text-primary">Core values</p><h1 className="text-lg font-bold text-foreground">What you want to keep close</h1></div></div>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">These are the three values you narrowed down in Life Garden. They sit alongside one another rather than being ranked.</p>
            <div className="mt-3 grid gap-2">
              {valuesResult.length > 0 ? valuesResult.map((value: any) => (
                <div key={value.value_name} className="flex items-center gap-3 rounded-xl border border-primary/15 bg-background/80 px-3 py-2.5">
                  <Compass className="size-4 text-primary" />
                  <div><p className="text-sm font-semibold text-foreground">{value.value_name}</p>{value.category && <p className="text-[10px] capitalize text-muted-foreground">{value.category}</p>}</div>
                </div>
              )) : <p className="rounded-xl border border-dashed border-border p-3 text-xs text-muted-foreground">No core values are currently recorded.</p>}
            </div>
          </section>

          <section className="rounded-3xl border border-border/70 bg-card p-4 shadow-sm">
            <div className="flex items-center gap-3"><div className="flex size-10 items-center justify-center rounded-2xl bg-secondary"><Compass className="size-5 text-primary" /></div><div><p className="text-xs font-semibold text-primary">Focus areas</p><h2 className="text-lg font-bold text-foreground">What you chose to work on</h2></div></div>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">Focus areas organise parts of Waypoint. They do not define you or act as a progress score.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {focusAreas.length > 0 ? focusAreas.map((area) => (
                <span key={area} className="rounded-full border border-border bg-secondary/40 px-3 py-1.5 text-xs font-semibold text-foreground">{focusLabels[area] || area}</span>
              )) : <span className="text-xs text-muted-foreground">No focus areas are currently recorded.</span>}
            </div>
          </section>

          <Link href="/journey/learn/discovering-values" className="mt-auto inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-primary/25 bg-primary/5 text-sm font-semibold text-primary">Revisit values learning <ArrowRight className="size-4" /></Link>
        </div>
      </MobileDashboardSectionShell>
    )
  }

  return (
    <MobileDashboardSectionShell title="Safeguards" description="Practical ways to add space around an urge">
      <div className="flex flex-1 flex-col gap-3">
        <section className="rounded-3xl border border-border/70 bg-card p-4 shadow-sm">
          <div className="flex items-center gap-3"><div className="flex size-11 items-center justify-center rounded-2xl bg-orange-500/10"><Shield className="size-5 text-orange-600" /></div><div><p className="text-xs font-semibold text-orange-600">Practical safeguards</p><h1 className="text-lg font-bold text-foreground">Choose the barriers that fit your life</h1></div></div>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">Safeguards are optional. Their job is to make an unwanted action a little harder or give you more time to choose what happens next.</p>
        </section>

        <section className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-border/70 bg-card p-3.5"><Laptop className="size-5 text-primary" /><p className="mt-2 text-sm font-bold text-foreground">Devices</p><p className="mt-1 text-[11px] leading-snug text-muted-foreground">Blocking tools and access controls.</p></div>
          <div className="rounded-2xl border border-border/70 bg-card p-3.5"><CreditCard className="size-5 text-primary" /><p className="mt-2 text-sm font-bold text-foreground">Money</p><p className="mt-1 text-[11px] leading-snug text-muted-foreground">Payment and banking barriers.</p></div>
          <div className="rounded-2xl border border-border/70 bg-card p-3.5"><Banknote className="size-5 text-primary" /><p className="mt-2 text-sm font-bold text-foreground">Self-exclusion</p><p className="mt-1 text-[11px] leading-snug text-muted-foreground">NZ gambling self-exclusion information.</p></div>
          <div className="rounded-2xl border border-border/70 bg-card p-3.5"><Users className="size-5 text-primary" /><p className="mt-2 text-sm font-bold text-foreground">People & routines</p><p className="mt-1 text-[11px] leading-snug text-muted-foreground">Support and environment changes.</p></div>
        </section>

        <div className="rounded-2xl border border-orange-500/20 bg-orange-500/5 p-3 text-xs leading-relaxed text-muted-foreground">You do not need to use every safeguard. A small barrier that you will actually use can be more helpful than a long list you ignore.</div>

        <Link href="/safeguards" className="mt-auto inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 text-sm font-semibold text-white">Explore all safeguards <ArrowRight className="size-4" /></Link>
      </div>
    </MobileDashboardSectionShell>
  )
}
