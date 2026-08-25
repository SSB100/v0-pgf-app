import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import PrivacyCentreClient from "@/components/privacy/privacy-centre-client"

export default async function PrivacyPage() {
  const user = await getSession()
  if (!user) redirect("/auth/signin")

  return <PrivacyCentreClient />
}
