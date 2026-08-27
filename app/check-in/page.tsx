import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import CheckInForm from "@/components/check-in/check-in-form"
import Link from "next/link"
import { sql } from "@/lib/db"
import { getAotearoaDateKey } from "@/lib/aotearoa-date"

export default async function CheckInPage() {
  const session = await getSession()

  if (!session) {
    redirect("/auth/signin")
  }

  const userId = session.id
  const today = getAotearoaDateKey()

  const [profileResult, problemsResult, todayCheckIn] = await Promise.all([
    sql`SELECT journey_types, onboarding_completed FROM user_profiles WHERE user_id = ${userId}`,
    sql`SELECT problem_type, specific_types FROM problem_areas WHERE user_id = ${userId}`,
    sql`SELECT id, created_at FROM daily_checkins WHERE user_id = ${userId}::uuid AND date = ${today}::date LIMIT 1`,
  ])

  if (!profileResult[0]?.onboarding_completed) {
    redirect("/onboarding")
  }

  let journeyTypes: string[] = []
  if (profileResult[0]?.journey_types) {
    const rawTypes = profileResult[0].journey_types
    if (typeof rawTypes === "string") {
      try {
        journeyTypes = JSON.parse(rawTypes)
      } catch {
        journeyTypes = []
      }
    } else if (Array.isArray(rawTypes)) {
      journeyTypes = rawTypes
    }
  }

  const problems = problemsResult || []
  const alreadyCompleted = todayCheckIn && todayCheckIn.length > 0

  return (
    <div className="min-h-screen bg-background pb-[60vh] lg:pb-6">
      <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8">
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Link>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 sm:p-8 soft-shadow">
          {alreadyCompleted ? (
            <div className="flex flex-col items-center justify-center py-10 space-y-4 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="space-y-1">
                <h1 className="text-2xl font-bold text-foreground">Daily Reflection Complete</h1>
                <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                  You've already completed today's Daily Reflection. Come back tomorrow for your next one.
                </p>
              </div>
              <Link
                href="/dashboard"
                className="mt-2 inline-flex items-center justify-center px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
              >
                Back to Dashboard
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Daily Reflection</h1>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Take a moment to reflect on your day and record what stands out. Daily Reflections can help you notice patterns
                  and stay aware of what is changing over time.
                </p>
              </div>
              <CheckInForm userId={userId} journeyTypes={journeyTypes} problems={problems} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
