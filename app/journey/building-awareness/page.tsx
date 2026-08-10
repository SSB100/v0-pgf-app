import { sql } from "@/lib/db"
import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import BuildingAwarenessClient from "@/components/journey/building-awareness-client"

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

export default async function BuildingAwarenessPage() {
  const session = await getSession()
  if (!session) {
    redirect("/auth/signin")
  }

  const { journeyTypes } = await getUserJourneyData(session.userId)

  return <BuildingAwarenessClient journeyTypes={journeyTypes} />
}
