import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { sql } from "@/lib/db"
import { addCalendarDays, differenceInCalendarDays, getAotearoaDateKey } from "@/lib/aotearoa-date"
import Image from "next/image"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import CurrentStateCard from "@/components/dashboard/current-state-card"
import CoreValuesCard from "@/components/dashboard/core-values-card"
import SuggestedSkillsCard from "@/components/dashboard/suggested-skills-card"
import QuickActionsBar from "@/components/dashboard/quick-actions-bar"
import MobileNav from "@/components/dashboard/mobile-nav"
import WeeklyOverviewCard from "@/components/dashboard/weekly-overview-card"
import SafeguardsCard from "@/components/dashboard/safeguards-card"
import JourneyProgressCard from "@/components/dashboard/journey-progress-card"
import Link from "next/link"
import { Map, ClipboardCheck, Sparkles, ArrowRight } from "lucide-react"
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
    SELECT COUNT(DISTINCT module_slug) as count
    FROM journey_completions
    WHERE user_id = ${user.id}
  `

  const completedModulesCount = Number(completedModulesResult[0]?.count || 0)
  const totalModulesCount = 11
  const incompleteModulesCount = Math.max(0, totalModulesCount - completedModulesCount)

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
    <div className="min-h-screen bg-background pb-24 lg:pb-6">
      <DashboardHeader
        userName={user.full_name || "there"}
        userEmail={user.email}
        journeyProgress={{ completed: completedModulesCount, total: totalModulesCount }}
      />

      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-5 sm:space-y-6">
        {!todayCheckIn && (
          <div className="relative overflow-hidden rounded-xl border border-primary/25 bg-card">
            <div className="absolute inset-0 pointer-events-none">
              <Image src="/images/daily-reflection.jpg" alt="" fill className="object-cover object-center opacity-15" />
              <div className="absolute inset-0 bg-gradient-to-r from-card/95 via-card/80 to-card/50" />
            </div>
            <div className="relative flex items-center gap-4 px-5 py-4">
              <div className="w-10 h-10 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
                <ClipboardCheck className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">Optional daily check-in</p>
                <p className="text-xs text-muted-foreground">Take a few minutes to record your mood, urges and anything that stood out today.</p>
              </div>
              <Link href="/check-in" className="flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">
                Check in <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        {incompleteModulesCount > 0 && (
          <div className="relative overflow-hidden rounded-xl border border-primary/30 bg-card">
            <div className="absolute inset-0 pointer-events-none">
              <Image src="/images/growth-journey.jpg" alt="" fill className="object-cover object-center opacity-10" />
              <div className="absolute inset-0 bg-gradient-to-r from-card/95 via-card/85 to-card/60" />
            </div>

            <div className="relative p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/15 border border-primary/25 flex items-center justify-center flex-shrink-0">
                    <Map className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-primary uppercase tracking-wide">Your Journey</p>
                    <h3 className="text-base font-bold text-foreground leading-tight">
                      {incompleteModulesCount} {incompleteModulesCount === 1 ? "module" : "modules"} available to explore
                    </h3>
                  </div>
                </div>
                <Link href="/journey" className="flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">
                  Explore modules
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                </Link>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Journey modules provide self-guided learning and practice around awareness, urges, values, communication and coping. Use the ones that feel relevant to you at your own pace.
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {["Notice patterns", "Practise coping skills", "Explore values", "Reflect on choices"].map((label) => (
                  <span key={label} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                    {label}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-3 rounded-lg bg-secondary/10 border border-secondary/25 px-4 py-3">
                <div className="w-8 h-8 rounded-full bg-secondary/20 border border-secondary/30 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-secondary" />
                </div>
                <p className="text-xs text-foreground/80 leading-relaxed">
                  <span className="font-semibold text-foreground">Your Growth Companion reflects Waypoint activity.</span>{" "}
                  Completing modules and check-ins can earn growth credits. Companion levels represent engagement with the app, not a clinical measure of recovery or wellbeing.
                </p>
              </div>
            </div>
          </div>
        )}

        {todayCheckIn && hadPrimaryTrackedBehaviorToday && daysSinceLastPrimaryBehavior !== null && (
          <RelapseSupportCard
            journeyType={primaryProblemType}
            daysSinceRelapse={Math.max(0, daysSinceLastPrimaryBehavior)}
            todayMood={todayCheckIn.mood_rating}
          />
        )}

        <QuickActionsBar />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-1">
            <GrowthAvatarCard
              avatarType={profile.growth_avatar || "growth_tree"}
              level={profile.tree_growth_level}
              levelCredits={profile.level_credits || 0}
              streak={profile.check_in_streak || 0}
              longestStreak={profile.longest_streak || 0}
            />
          </div>

          <div className="lg:col-span-2">
            <CurrentStateCard awareness={latestAwareness} problems={primaryProblem} todayCheckIn={todayCheckIn} />
          </div>
        </div>

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

        <WeeklyOverviewCard checkins={weeklyCheckins} journeyTypes={journeyTypes} accountCreatedAt={user.created_at} />

        <CoreValuesCard values={values} />
        <SafeguardsCard />
        <SuggestedSkillsCard awareness={latestAwareness} problems={primaryProblem} values={values} weeklyCheckins={weeklyCheckins} />
      </main>

      <MobileNav />
    </div>
  )
}
