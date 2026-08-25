import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"

export default async function ShareJourneyPage() {
  const user = await getSession()
  if (!user) redirect("/auth/signin")

  // Professional sharing is now managed from the signed-in Privacy & Sharing
  // Centre. Keep this legacy route as a safe bridge for existing navigation.
  redirect("/privacy#professional-sharing")
}
