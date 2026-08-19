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

interface DashboardSectionIntroProps {
  id: string
  eyebrow: string
  title: string
  description: string
}

function DashboardSectionIntro({ id, eyebrow, title, description }: DashboardSectionIntroProps) {
  return (
    <div className="max-w-3xl">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{eyebrow}</p>
      <h2 id={id} className="mt-1 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
        {title}
      </h2>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
        {description}
      </p>
    </div>
  )
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

      <main className="mx-auto max-w-[1440px] space-y-9 px-4 py-5 sm:px-6 sm:py-7 lg:px-8 lg:py-8">
        <section className="space-y-4" aria-labelledby="companion-heading">
          <DashboardSectionIntro
            id="companion-heading"
            eyebrow="Growth Companion"
            title="See how your companion grows with the time you put into Waypoint"
            description="Your companion is a visual record of app engagement. This section explains how Growth Credits are earned and used, shows your current stage, and keeps the game-like part of Waypoint separate from any judgement about recovery or wellbeing."
          />
          <GrowthAvatarCard
            avatarType={profile.growth_avatar || "growth_tree"}
            level={profile.tree_growth_level}
            levelCredits={profile.level_credits || 0}
            streak={profile.check_in_streak || 0}
            longestStreak={profile.longest_streak || 0}
          />
        </section>

        {todayCheckIn && hadPrimaryTrackedBehaviorToday && daysSinceLastPrimaryBehavior !== null && (
          <RelapseSupportCard
            journeyType={primaryProblemType}
            daysSinceRelapse={Math.max(0, daysSinceLastPrimaryBehavior)}
            todayMood={todayCheckIn.mood_rating}
          />
        )}

        <section className="space-y-4" aria-labelledby="today-heading">
          <DashboardSectionIntro
            id="today-heading"
            eyebrow="Today"
            title="Use Waypoint in the way that helps today"
            description="This is not a task list. You can check in, spend a little time learning, do both, or leave them for another day. The aim is to make useful options easy to find without turning them into obligations."
          />

          <div className="grid gap-4 lg:grid-cols-2">
            {nextJourneyModule ? (
              <div className="relative min-h-[245px] overflow-hidden rounded-2xl border border-primary/25 bg-card shadow-sm">
                <div className="absolute inset-0 pointer-events-none">
                  <Image src="/images/growth-journey.jpg" alt="" fill className="object-cover object-center opacity-15" />
                  <div className="absolute inset-0 bg-gradient-to-r from-card via-card/95 to-card/70" />
                </div>

                <div className="relative flex h-full flex-col justify-between gap-5 p-5 sm:p-6">
                  <div>
                    <div className="mb-4 flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                        <Map className="size-3.5" />
                        Learning option
                      </span>
                      <span className="text-xs font-medium text-muted-foreground">
                        Module {nextJourneyModuleNumber} of {totalModulesCount} · about {nextJourneyModule.estimatedMinutes} min
                      </span>
                    </div>

                    <h3 className="text-xl font-bold leading-tight tracking-tight text-foreground sm:text-2xl">
                      {nextJourneyModule.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      This is the first Journey module you have not explored yet. Open it if the topic feels useful now, or browse the Journey and choose something else.
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {nextJourneyModule.description}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="mb-1.5 flex items-center justify-between text-xs text-muted-foreground">
                        <span>Your Journey so far</span>
                        <span>{completedModulesCount}/{totalModulesCount} explored</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-secondary">
                        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${journeyProgressPercent}%` }} />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row">
                      <Link
                        href={`/journey/learn/${nextJourneyModule.slug}`}
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
                      >
                        Open this module <ArrowRight className="size-4" />
                      </Link>
                      <Link
                        href="/journey"
                        className="inline-flex min-h-11 items-center justify-center rounded-xl border border-border bg-background/80 px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary/50"
                      >
                        Browse Journey
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex min-h-[245px] flex-col justify-between rounded-2xl border border-primary/25 bg-primary/5 p-5 shadow-sm sm:p-6">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                    <CheckCircle2 className="size-3.5" />
                    Journey library explored
                  </span>
                  <h3 className="mt-5 text-xl font-bold tracking-tight text-foreground sm:text-2xl">Everything stays available to revisit</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    You have explored every current module. Revisit any skill or idea when it is useful. Finishing the library is an app milestone, not a measure of recovery or wellbeing.
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
                {todayCheckIn ? "Today's check-in is recorded" : "A quick check-in, if it would be useful"}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {todayCheckIn
                  ? "Your entry is saved. The recent picture below shows what you recorded alongside your wider weekly pattern."
                  : "A daily check-in gives you a small snapshot of mood, urges and what stood out. It also earns one Growth Credit, but missing a day does not take anything away from your companion."}
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
                  <a href="#recent-picture" className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary/50">
                    See what you recorded <ArrowRight className="size-4" />
                  </a>
                </>
              ) : (
                <Link href="/check-in" className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
                  Open daily check-in <ArrowRight className="size-4" />
                </Link>
              )}
            </div>
          </div>
        </section>

        <section id="recent-picture" className="scroll-mt-24 space-y-4" aria-labelledby="recent-picture-heading">
          <DashboardSectionIntro
            id="recent-picture-heading"
            eyebrow="Your check-ins"
            title="A recent picture, not a score"
            description="These cards reflect what you have recorded in Waypoint. They can help you remember how recent days felt and notice patterns over time, but they do not grade the day or decide whether you are doing well or badly."
          />
          <div className="grid gap-5 xl:grid-cols-[minmax(340px,0.9fr)_minmax(0,1.5fr)] xl:gap-6">
            <CurrentStateCard awareness={latestAwareness} problems={primaryProblem} todayCheckIn={todayCheckIn} />
            <WeeklyOverviewCard checkins={weeklyCheckins} journeyTypes={journeyTypes} accountCreatedAt={user.created_at} />
          </div>
        </section>

        <section className="space-y-4" aria-labelledby="learning-heading">
          <DashboardSectionIntro
            id="learning-heading"
            eyebrow="Learning ideas"
            title="Skills and modules that may be worth a look"
            description="Waypoint uses information you have entered to surface a few relevant learning options. These are suggestions, not instructions or clinical recommendations, and you can always ignore them and choose something else from the Journey."
          />
          <SuggestedSkillsCard awareness={latestAwareness} problems={primaryProblem} values={values} weeklyCheckins={weeklyCheckins} />
        </section>

        <section className="space-y-4" aria-labelledby="direction-heading">
          <DashboardSectionIntro
            id="direction-heading"
            eyebrow="Your direction"
            title="What matters to you and the areas you chose to focus on"
            description="Your values are reminders of the kind of direction that matters to you. Your focus areas summarise what you selected during onboarding and any dates you chose to record. Neither section is a judgement about progress."
          />
          <div className="grid gap-5 xl:grid-cols-[minmax(300px,0.75fr)_minmax(0,1.55fr)] xl:gap-6">
            <CoreValuesCard values={values} />
            {journeyTypes.length > 0 ? (
              <JourneyProgressCard
                journeyTypes={journeyTypes}
                gamblingProblem={gamblingProblem}
                alcoholProblem={alcoholProblem}
                substancesProblem={substancesProblem}
                mentalHealthProblem={mentalHealthProblem}
                personalGrowthProblem={personalGrowthProblem}
                profile={profile}
              />
            ) : (
              <div className="rounded-2xl border border-dashed border-border p-5 text-sm text-muted-foreground">
                No focus areas are currently recorded. You can still use Journey modules, check-ins and safeguards without choosing one.
              </div>
            )}
          </div>
        </section>

        <section className="space-y-4" aria-labelledby="safeguards-heading">
          <DashboardSectionIntro
            id="safeguards-heading"
            eyebrow="Practical support"
            title="Add a little more space between an urge and an action"
            description="Safeguards are optional practical barriers and support ideas. They can include device controls, money and payment changes, self-exclusion information, routines and people you trust. Choose only what fits your circumstances."
          />
          <SafeguardsCard />
        </section>

        <section className="hidden space-y-4 lg:block" aria-labelledby="more-heading">
          <DashboardSectionIntro
            id="more-heading"
            eyebrow="More of Waypoint"
            title="Other places you can use when they are relevant"
            description="Support, safety information, community and the sharing preview live here so they stay easy to find without competing with the main dashboard sections."
          />
          <QuickActionsBar />
        </section>
      </main>

      <MobileNav />
    </div>
  )
}
