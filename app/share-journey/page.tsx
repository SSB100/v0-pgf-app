import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import ShareJourneyClient from "@/components/share-journey/share-journey-client"

export default async function ShareJourneyPage() {
  const user = await getSession()

  if (!user) {
    redirect("/auth/signin")
  }

  const identifyingCode = `PGF-${user.id.replace(/[^a-zA-Z0-9]/g, "").slice(0, 8).toUpperCase().padEnd(8, "0")}`

  return <ShareJourneyClient identifyingCode={identifyingCode} />
}
