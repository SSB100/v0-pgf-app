import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { sql } from "@/lib/db"
import { addCalendarDays, differenceInCalendarDays, getAotearoaDateKey } from "@/lib/aotearoa-date"
import { JOURNEY_MODULES } from "@/lib/journey-curriculum"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, CheckCircle2, ClipboardCheck, Map } from "lucide-react"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import CurrentStateCard from "@/components/dashboard/current-state-card"
import CoreValuesCard from "@/components/dashboard/core-values-card"
import SuggestedSkillsCard from "@/components/dashboard/suggested-skills-card"
import QuickActionsBar from "@/components/dashboard/quick-actions-bar"
import MobileNav from "@/components/dashboard/mobile-nav"
import WeeklyOverviewCard from "@/components/dashboard/weekly-overview-card"
import SafeguardsCard from "@/components/dashboard/safeguards-card"
import JourneyProgressCard from "@/components/dashboard/journey-progress-card"
import GrowthAvatarCard from "@/components/dashboard/growth-avatar-card"
import RelapseSupportCard from "@/components/dashboard/relapse-support-card"

function toDateKey(value: unknown): string | null {
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value)) return value.slice(0, 10)
  return null
}

export default async function DashboardPage() {
  const user = await getSession()

  if (!user) redirect("/auth/signin")

  const today = getAotearoaDateKey()
  const weekStart = addCalendarDays(today, -6)

  let profileResult
  try {
    profileResult = await sql`
      SELECT
        onboarding_completed,
        tree_growth_level,
        level_credits,
        check_in_streak,
        longest_streak,
        journey_types,
        last_drink_date,
        last_substance_date,
        mental_health_areas,
        growth_goals,
        growth_avatar
      FROM user_profiles
      WHERE user_id = ${user.id}
    `

    if (!profileResult || profileResult.length === 0) redirect("/auth/signin")
  } catch (error) {
    console.log("[v0] Error fetching user profile:", error)
    redirect("/auth/signin")
  }

  if (!profileResult[0]?.onboarding_completed) redirect("/onboarding")

  const completedModulesResult = await sql`
    SELECT DISTINCT module_slug
    FROM journey_completions
    WHERE user_id = ${user.id}
  `

  const knownJourneySlugs = new Set(JOURNEY_MODULES.map((module) => module.slug))
  const completedJourneySlugs = new Set(
    completedModulesResult
      .map((row: any) => row.module_slug)
      .filter((slug: string) => knownJourneySlugs.has(slug)),
  )
  const completedModulesCount = completedJourneySlugs.size
  const totalModulesCount = JOURNEY_MODULES.length
  const nextJourneyModule = JOURNEY_MODULES.find((module) => !completedJourneySlugs.has(module.slug)) || null
  const nextJourneyModuleNumber = nextJourneyModule
    ? JOURNEY_MODULES.findIndex((module) => module.slug === nextJourneyModule.slug) + 1
    : totalModulesCount
  const journeyProgressPercent = totalModulesCount > 0
    ? Math.round((completedModulesCount / totalModulesCount) * 100)
    : 0

  const awarenessResult = await sql`
    SELECT emotion, all_emotions, strongest_emotion, situation_context, created_at
    FROM awareness_checkins
    WHERE user_id = ${user.id}
    ORDER BY created_at DESC
    LIMIT 1
  `

  const valuesResult = await sql`
    SELECT value_name, rank, category
    FROM user_values
    WHERE user_id = ${user.id} AND is_core_value = true
    ORDER BY rank ASC
    LIMIT 3
  `

  const problemsResult = await sql`
    SELECT
      problem_type,
      triggers,
      patterns,
      last_bet_date,
      frequency,
      last_occurrence_date,
      specific_types,
      impact_areas
    FROM problem_areas
    WHERE user_id = ${user.id}
    ORDER BY identified_at DESC
  `

  const weeklyCheckinsResult = await sql`
    SELECT
      date,
      mood_rating,
      overall_rating,
      urge_strength,
      behavior_occurred,
      gambling_occurred,
      alcohol_occurred,
      substance_occurred,
      self_harm_actions,
      emotions_felt,
      strongest_emotion,
      good_things,
      bad_things
    FROM daily_checkins
    WHERE user_id = ${user.id}
      AND date >= ${weekStart}::date
      AND date <= ${today}::date
    ORDER BY date ASC
  `

  const todayCheckInResult = await sql`
    SELECT
      mood_rating,
      overall_rating,
      urge_strength,
      emotions_felt,
      strongest_emotion,
      emotion_context,
      good_things,
      bad_things,
      behavior_occurred,
      gambling_occurred,
      alcohol_occurred,
      substance_occurred,
      self_harm_thoughts,
      self_harm_actions,
      created_at
    FROM daily_checkins
    WHERE user_id = ${user.id} AND date = ${today}::date
    LIMIT 1
  `

  const profile = profileResult[0]
  const latestAwareness = awarenessResult[0] || null
  const values = valuesResult || []
  const allProblems = problemsResult || []
  const weeklyCheckins = (weeklyCheckinsResult || []).map((checkin: any) => ({
    ...checkin,
    date: toDateKey(checkin.date) || String(checkin.date).slice(0, 10),
  }))
  const todayCheckIn = todayCheckInResult[0] || null

  const journeyTypes: string[] = profile.journey_types
    ? typeof profile.journey_types === "string"
      ? JSON.parse(profile.journey_types)
      : profile.journey_types
    : []

  const gamblingProblem = allProblems.find((problem: any) => problem.problem_type === "gambling")
  const alcoholProblem = allProblems.find((problem: any) => problem.problem_type === "alcohol")
  const substancesProblem = allProblems.find((problem: any) => problem.problem_type === "substances")
  const mentalHealthProblem = allProblems.find((problem: any) => problem.problem_type === "mental_health")
  const personalGrowthProblem = allProblems.find((problem: any) => problem.problem_type === "personal_growth")

  const primaryProblem = gamblingProblem || alcoholProblem || substancesProblem || allProblems[0] || null
  const primaryProblemType = primaryProblem?.problem_type || ""

  const hadPrimaryTrackedBehaviorToday =
    primaryProblemType === "gambling"
      ? todayCheckIn?.gambling_occurred === true
      : primaryProblemType === "alcohol"
        ? todayCheckIn?.alcohol_occurred === true
        : primaryProblemType === "substances"
          ? todayCheckIn?.substance_occurred === true
          : false

  const lastPrimaryBehaviorDate = toDateKey(primaryProblem?.last_occurrence_date || primaryProblem?.last_bet_date)
  const daysSinceLastPrimaryBehavior = lastPrimaryBehaviorDate
    ? differenceInCalendarDays(today, lastPrimaryBehaviorDate)
    : null

  return (
    <div className="min-h-screen bg-background pb-28 lg:pb-8">
      <DashboardHeader
        userName={user.full_name || "there"}
        userEmail={user.email}
        journeyProgress={{ completed: completedModulesCount, total: totalModulesCount }}
      />

      <main className="mx-auto max-w-[1440px] space-y-6 px-3 py-3 min-[380px]:px-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        <section className="space-y-3 sm:space-y-4" aria-labelledby="companion-heading">
          <div className="flex items-end justify-between gap-4 px-1 sm:px-0">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary sm:text-xs">Your Waypoint</p>
              <h1 id="companion-heading" className="mt-1 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                Start with you
              </h1>
            </div>
            <p className="hidden max-w-md text-right text-sm text-muted-foreground md:block">
              Your companion stays visible as a simple record of your activity and progress in Waypoint.
            </p>
          </div>

          <GrowthAvatarCard
            avatarType={profile.growth_avatar || "growth_tree"}
            level={profile.tree_growth_level}
            levelCredits={profile.level_credits || 0}
            streak={profile.check_in_streak || 0}
            longestStreak={profile.longest_streak || 0}
          />
        </section>

        <section className="space-y-3 sm:space-y-4" aria-labelledby="today-heading">
          <div className="flex items-end justify-between gap-4 px-1 sm:px-0">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary sm:text-xs">Today</p>
              <h2 id="today-heading" className="mt-1 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                What would help next?
              </h2>
            </div>
            <p className="hidden max-w-md text-right text-sm text-muted-foreground md:block">
              One useful next action first. Everything else can wait until you need it.
            </p>
          </div>

          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,0.85fr)]">
            {nextJourneyModule ? (
              <div className="relative min-h-[250px] overflow-hidden rounded-2xl border border-primary/25 bg-card shadow-sm sm:min-h-[270px]">
                <div className="pointer-events-none absolute inset-0">
                  <Image src="/images/growth-journey.jpg" alt="" fill className="object-cover object-center opacity-20" priority />
                  <div className="absolute inset-0 bg-gradient-to-r from-card via-card/95 to-card/65" />
                </div>

                <div className="relative flex h-full flex-col justify-between gap-6 p-5 sm:p-6 lg:p-7">
                  <div>
                    <div className="mb-5 flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                        <Map className="size-3.5" />
                        Next Journey step
                      </span>
                      <span className="text-xs font-medium text-muted-foreground">
                        Module {nextJourneyModuleNumber} of {totalModulesCount} · about {nextJourneyModule.estimatedMinutes} min
                      </span>
                    </div>

                    <h3 className="max-w-2xl text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-3xl">
                      {nextJourneyModule.title}
                    </h3>
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                      {nextJourneyModule.description}
                    </p>
                  </div>

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div className="min-w-0 flex-1 sm:max-w-md">
                      <div className="mb-1.5 flex items-center justify-between text-xs text-muted-foreground">
                        <span>Your Journey</span>
                        <span>{completedModulesCount}/{totalModulesCount} explored</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-secondary">
                        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${journeyProgressPercent}%` }} />
                      </div>
                    </div>

                    <Link
                      href={`/journey/learn/${nextJourneyModule.slug}`}
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
                    >
                      Continue Journey <ArrowRight className="size-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex min-h-[250px] flex-col justify-between rounded-2xl border border-primary/25 bg-primary/5 p-5 shadow-sm sm:p-6 lg:p-7">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                    <CheckCircle2 className="size-3.5" />
                    Journey explored
                  </span>
                  <h3 className="mt-5 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">You have explored every current module</h3>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                    Revisit any module when a skill or idea would be useful. Completing the library is an app milestone, not a measure of recovery or wellbeing.
                  </p>
                </div>
                <Link href="/journey" className="mt-6 inline-flex min-h-11 w-fit items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">
                  Browse Journey <ArrowRight className="size-4" />
                </Link>
              </div>
            )}

            <div className={`rounded-2xl border p-5 shadow-sm sm:p-6 ${todayCheckIn ? "border-emerald-500/25 bg-emerald-500/5" : "border-border/70 bg-card"}`}>
              <div className="flex items-start justify-between gap-3">
                <div className={`flex size-11 shrink-0 items-center justify-center rounded-xl border ${todayCheckIn ? "border-emerald-500/25 bg-emerald-500/10" : "border-primary/25 bg-primary/10"}`}>
                  {todayCheckIn ? <CheckCircle2 className="size-5 text-emerald-600" /> : <ClipboardCheck className="size-5 text-primary" />}
                </div>
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${todayCheckIn ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : "bg-secondary text-muted-foreground"}`}>
                  {todayCheckIn ? "Recorded today" : "Optional"}
                </span>
              </div>

              <h3 className="mt-5 text-xl font-bold tracking-tight text-foreground">
                {todayCheckIn ? "Today's check-in is done" : "How are things today?"}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {todayCheckIn
                  ? "Your entry is saved. Use the snapshot below to see what you recorded and the weekly view to notice patterns over time."
                  : "A short check-in can capture your mood, urges and anything that stood out. Skip it if today is not the day for it."}
              </p>

              {todayCheckIn ? (
                <>
                  <div className="mt-5 grid grid-cols-2 gap-2">
                    <div className="rounded-xl border border-border/60 bg-background/70 p-3">
                      <p className="text-[11px] font-medium text-muted-foreground">Mood</p>
                      <p className="mt-0.5 text-xl font-bold text-foreground">{todayCheckIn.mood_rating}/10</p>
                    </div>
                    <div className="rounded-xl border border-border/60 bg-background/70 p-3">
                      <p className="text-[11px] font-medium text-muted-foreground">Overall</p>
                      <p className="mt-0.5 text-xl font-bold text-foreground">
                        {todayCheckIn.overall_rating ?? "—"}{todayCheckIn.overall_rating != null ? "/10" : ""}
                      </p>
                    </div>
                  </div>
                  <a href="#recent-check-in" className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary/50">
                    Review today's snapshot <ArrowRight className="size-4" />
                  </a>
                </>
              ) : (
                <Link href="/check-in" className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
                  Start check-in <ArrowRight className="size-4" />
                </Link>
              )}
            </div>
          </div>
        </section>

        {todayCheckIn && hadPrimaryTrackedBehaviorToday && daysSinceLastPrimaryBehavior !== null && (
          <RelapseSupportCard
            journeyType={primaryProblemType}
            daysSinceRelapse={Math.max(0, daysSinceLastPrimaryBehavior)}
            todayMood={todayCheckIn.mood_rating}
          />
        )}

        <QuickActionsBar />

        <section className="grid gap-5 xl:grid-cols-12 xl:gap-6" aria-label="Your Waypoint overview">
          <div className="space-y-5 xl:col-span-8 xl:space-y-6">
            <div id="recent-check-in" className="scroll-mt-24">
              <CurrentStateCard awareness={latestAwareness} problems={primaryProblem} todayCheckIn={todayCheckIn} />
            </div>

            <WeeklyOverviewCard checkins={weeklyCheckins} journeyTypes={journeyTypes} accountCreatedAt={user.created_at} />

            <SuggestedSkillsCard awareness={latestAwareness} problems={primaryProblem} values={values} weeklyCheckins={weeklyCheckins} />
          </div>

          <aside className="xl:col-span-4" aria-label="Your values">
            <CoreValuesCard values={values} />
          </aside>
        </section>

        {journeyTypes.length > 0 && (
          <JourneyProgressCard
            journeyTypes={journeyTypes}
            gamblingProblem={gamblingProblem}
            alcoholProblem={alcoholProblem}
            substancesProblem={substancesProblem}
            mentalHealthProblem={mentalHealthProblem}
            personalGrowthProblem={personalGrowthProblem}
            profile={profile}
          />
        )}

        <SafeguardsCard />
      </main>

      <MobileNav />
    </div>
  )
}
