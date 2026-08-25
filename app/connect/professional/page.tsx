import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import ConnectProfessionalClient from "@/components/professional/connect-professional-client"

export default async function ConnectProfessionalPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const user = await getSession()
  const params = await searchParams
  const token = params.token?.trim() || ""

  if (!user) {
    const destination = `/connect/professional?token=${encodeURIComponent(token)}`
    redirect(`/auth/signin?from=${encodeURIComponent(destination)}`)
  }
  if (!token) redirect("/dashboard")

  return (
    <main className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-10">
      <ConnectProfessionalClient token={token} />
    </main>
  )
}
