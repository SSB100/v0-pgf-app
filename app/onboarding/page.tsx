import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { sql } from "@/lib/db"
import OnboardingFlow from "@/components/onboarding/onboarding-flow"
import UserMenu from "@/components/layout/user-menu"
import Link from "next/link"
import { Home } from "lucide-react"
import { Button } from "@/components/ui/button"

export default async function OnboardingPage() {
  const user = await getSession()

  if (!user) {
    redirect("/auth/signin")
  }

  let savedStep = 1
  let savedData = null
  let onboardingCompleted = false

  try {
    const result = await sql`
      SELECT 
        onboarding_completed, 
        onboarding_current_step, 
        onboarding_data
      FROM user_profiles
      WHERE user_id = ${user.id}
    `

    if (result[0]) {
      onboardingCompleted = result[0].onboarding_completed || false
      savedStep = result[0].onboarding_current_step || 1
      savedData = result[0].onboarding_data || null
    }
  } catch (error) {
    // If columns don't exist yet, use defaults and continue
    console.log("[v0] Onboarding columns not found, using defaults:", error)

    // Check if onboarding is completed using the old method
    try {
      const oldResult = await sql`
        SELECT onboarding_completed
        FROM user_profiles
        WHERE user_id = ${user.id}
      `
      onboardingCompleted = oldResult[0]?.onboarding_completed || false
    } catch (oldError) {
      console.log("[v0] Could not check onboarding status:", oldError)
    }
  }

  if (onboardingCompleted) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-muted/50">
      <header className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/">
              <Button variant="ghost" size="icon" aria-label="Back to home">
                <Home className="w-4 h-4" />
              </Button>
            </Link>
            <div className="min-w-0">
              <h1 className="text-xl font-bold text-foreground">Getting Started</h1>
              <p className="text-sm text-muted-foreground truncate">
                {savedStep > 1
                  ? `Welcome back! Continuing your setup`
                  : "Complete your profile to begin your journey"}
              </p>
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
