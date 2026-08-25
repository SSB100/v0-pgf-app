import { redirect } from "next/navigation"
import { ShieldCheck } from "lucide-react"
import { getSession } from "@/lib/session"
import MfaSetupClient from "@/components/security/mfa-setup-client"

export default async function MfaSetupPage() {
  const user = await getSession()
  if (!user) redirect("/auth/signin?from=/security/mfa")
  if (user.role !== "professional" && user.role !== "admin") redirect("/settings")

  return (
    <main className="min-h-screen bg-background px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <div className="flex items-center gap-2 text-primary"><ShieldCheck className="size-5" /><p className="text-xs font-semibold uppercase tracking-[0.18em]">Strong authentication</p></div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Protect professional access</h1>
          <p className="mt-2 leading-6 text-muted-foreground">Waypoint requires an authenticator app before a professional or administrator can access sensitive professional functions. Password sign-in alone is not enough.</p>
        </div>
        <MfaSetupClient />
      </div>
    </main>
  )
}
