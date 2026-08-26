import { redirect } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { getSession } from "@/lib/session"
import { sql } from "@/lib/db"
import { JOURNEY_MODULES } from "@/lib/journey-curriculum"
import {
  isGamblingProtectionKey,
  type GamblingProtectionKey,
} from "@/lib/gambling-protection-guide"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import MobileNav from "@/components/dashboard/mobile-nav"
import GamblingProtectionChecklist from "@/components/journey/gambling-protection-checklist"

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

export default async function GamblingProtectionSetupPage() {
  const user = await getSession()
  if (!user) redirect("/auth/signin")
  if (user.role !== "client") redirect("/dashboard")

  const profileResult = await sql`
    SELECT onboarding_completed, journey_types
    FROM user_profiles
    WHERE user_id = ${user.id}
    LIMIT 1
  `
  const profile = profileResult[0]
  if (!profile?.onboarding_completed) redirect("/onboarding")

  const journeyTypes = toStringList(profile.journey_types)
  if (!journeyTypes.includes("gambling")) redirect("/journey")

  const [checklistResult, completedResult] = await Promise.all([
    sql`
      SELECT safeguard_key
      FROM user_safeguard_checklist
      WHERE user_id = ${user.id} AND is_active = TRUE
    `,
    sql`
      SELECT module_slug
      FROM journey_completions
      WHERE user_id = ${user.id}
    `,
  ])

  const initialActiveKeys = checklistResult
    .map((row) => row.safeguard_key)
    .filter(isGamblingProtectionKey) as GamblingProtectionKey[]

  const knownSlugs = new Set(JOURNEY_MODULES.map((module) => module.slug))
  const completedCount = completedResult.filter((row) => knownSlugs.has(row.module_slug)).length

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-6">
      <DashboardHeader
        userName={user.full_name || "there"}
        userEmail={user.email}
        journeyProgress={{ completed: completedCount, total: JOURNEY_MODULES.length }}
      />

      <main className="mx-auto max-w-4xl space-y-4 px-3 py-4 sm:px-4 sm:py-6">
        <Link href="/journey" className="inline-flex min-h-10 items-center gap-2 rounded-lg px-2 text-sm font-medium text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> Back to Journey
        </Link>

        <GamblingProtectionChecklist initialActiveKeys={initialActiveKeys} />
      </main>

      <MobileNav />
    </div>
  )
}
