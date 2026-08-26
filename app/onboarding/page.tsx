import { redirect } from "next/navigation"
import Link from "next/link"
import { Home } from "lucide-react"
import { getSession } from "@/lib/session"
import { sql } from "@/lib/db"
import OnboardingFlow, { type OnboardingData } from "@/components/onboarding/onboarding-flow"
import UserMenu from "@/components/layout/user-menu"
import { Button } from "@/components/ui/button"

export default async function OnboardingPage() {
  const user = await getSession()
  if (!user) redirect("/auth/signin")
  if (user.role !== "client") redirect("/professional")

  let savedStep = 1
  let savedData: OnboardingData | undefined
  let onboardingCompleted = false

  try {
    const result = await sql`
      SELECT onboarding_completed, onboarding_current_step, onboarding_data
      FROM user_profiles
      WHERE user_id = ${user.id}::uuid
      LIMIT 1
    `

    if (result[0]) {
      onboardingCompleted = result[0].onboarding_completed === true
      const requestedStep = Number(result[0].onboarding_current_step)
      savedStep = Number.isInteger(requestedStep) && requestedStep >= 1 && requestedStep <= 50 ? requestedStep : 1
      savedData = result[0].onboarding_data && typeof result[0].onboarding_data === "object"
        ? result[0].onboarding_data as OnboardingData
        : undefined
    }
  } catch (error) {
    console.error("[waypoint] Unable to load onboarding baseline state", error)
    redirect("/auth/signin")
  }

  if (onboardingCompleted) redirect("/dashboard")

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-muted/40">
      <header className="sticky top-0 z-50 border-b border-border bg-card/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4">
          <div className="flex min-w-0 items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="icon" aria-label="Back to home"><Home className="size-4" /></Button>
            </Link>
            <div className="min-w-0">
              <h1 className="text-xl font-bold text-foreground">Set up your Waypoint baseline</h1>
              <p className="truncate text-sm text-muted-foreground">A guided setup covering your focus areas, values, strengths and first check-in.</p>
            </div>
          </div>
          <UserMenu userName={user.full_name || "there"} userEmail={user.email} />
        </div>
      </header>

      <OnboardingFlow
        userId={user.id}
        userName={user.full_name || "there"}
        initialStep={savedStep}
        initialData={savedData}
      />
    </div>
  )
}
