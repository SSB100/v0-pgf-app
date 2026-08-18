import DashboardHeader from "@/components/dashboard/dashboard-header"
import MobileNav from "@/components/dashboard/mobile-nav"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { getSession } from "@/lib/session"
import { redirect } from "next/navigation"
import { sql } from "@/lib/db"
import StopSkillClient from "@/components/journey/stop-skill-client"

async function getUserJourneyData(userId: string) {
  const profile = await sql`
    SELECT journey_types
    FROM user_profiles
    WHERE user_id = ${userId}
  `

  const journeyTypes: string[] = profile[0]?.journey_types
    ? typeof profile[0].journey_types === "string"
      ? JSON.parse(profile[0].journey_types)
      : profile[0].journey_types
    : []

  return { journeyTypes }
}

export default async function StopSkillPage() {
  const user = await getSession()
  if (!user) redirect("/auth/signin")

  const { journeyTypes } = await getUserJourneyData(user.id)

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-6">
      <DashboardHeader userName={user.full_name || "there"} userEmail={user.email} />

      <main className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-6">
        <Link href="/journey">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Journey
          </Button>
        </Link>

        <StopSkillClient journeyTypes={journeyTypes} />
      </main>

      <MobileNav />
    </div>
  )
}
