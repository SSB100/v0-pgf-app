import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import ShareJourneyClient from "@/components/share-journey/share-journey-client"

export default async function ShareJourneyPage() {
  const user = await getSession()
  if (!user) redirect("/auth/signin")

  // Prototype only: do not derive a display code from the user's database ID.
  // A real implementation should generate a random, expiring invitation token
  // only when consent-based professional sharing actually exists.
  return <ShareJourneyClient identifyingCode="WPT-DEMO" />
}
