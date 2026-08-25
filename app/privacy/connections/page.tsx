import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import ProfessionalConnectionsClient from "@/components/privacy/professional-connections-client"

export default async function ProfessionalConnectionsPage() {
  const user = await getSession()
  if (!user) redirect("/auth/signin?from=/privacy/connections")
  return <ProfessionalConnectionsClient />
}
