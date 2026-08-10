import { getSession } from "@/lib/session"
import { redirect } from "next/navigation"
import { neon } from "@neondatabase/serverless"
import ChoicePointsClient from "@/components/journey/choice-points-client"

const sql = neon(process.env.NEON_DATABASE_URL!)

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

export default async function ChoicePointsPage() {
  const user = await getSession()

  if (!user) {
    redirect("/auth/signin")
  }

  const { journeyTypes } = await getUserJourneyData(user.id)

  return <ChoicePointsClient journeyTypes={journeyTypes} />
}
