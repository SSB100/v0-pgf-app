import { getSession } from "@/lib/session"
import { redirect } from "next/navigation"
import { sql } from "@/lib/db"
import RecognizingTriggersClient from "@/components/journey/recognizing-triggers-client"

async function getUserJourneyData(userId: string) {
  const profile = await sql`
    SELECT journey_types
    FROM user_profiles
    WHERE user_id = ${userId}
  `

  const problemAreas = await sql`
    SELECT problem_type, triggers, specific_types
    FROM problem_areas
    WHERE user_id = ${userId}
  `

  const journeyTypes: string[] = profile[0]?.journey_types
    ? typeof profile[0].journey_types === "string"
      ? JSON.parse(profile[0].journey_types)
      : profile[0].journey_types
    : []

  return { journeyTypes, problemAreas }
}

export default async function RecognizingTriggersPage() {
  const user = await getSession()

  if (!user) {
    redirect("/auth/signin")
  }

  const { journeyTypes, problemAreas } = await getUserJourneyData(user.id)

  return <RecognizingTriggersClient journeyTypes={journeyTypes} problemAreas={problemAreas} />
}
