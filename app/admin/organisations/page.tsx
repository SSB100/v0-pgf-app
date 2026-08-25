import Link from "next/link"
import { redirect } from "next/navigation"
import { Building2, BookOpenCheck, ShieldAlert, ShieldCheck, UserRoundCheck } from "lucide-react"
import { getAdminSession } from "@/lib/admin-access"
import OrganisationLifecycleClient from "@/components/admin/organisation-lifecycle-client"

export default async function AdminOrganisationsPage() {
  const admin = await getAdminSession()
  if (!admin.user) redirect("/auth/signin?from=/admin/organisations")
  if (admin.user.role !== "admin") redirect(admin.user.role === "professional" ? "/professional" : "/dashboard")
  if (!admin.authorised) redirect("/security/mfa")

  return (
    <main className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="border-b pb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-primary"><ShieldCheck className="size-5" /><p className="text-xs font-semibold uppercase tracking-[0.18em]">Waypoint administration</p></div>
              <h1 className="mt-2 flex items-center gap-3 text-3xl font-bold tracking-tight"><Building2 className="size-7" /> Organisations</h1>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/admin/professionals" className="inline-flex items-center gap-2 rounded-lg border bg-card px-4 py-2 text-sm font-medium shadow-sm hover:bg-muted/50"><UserRoundCheck className="size-4" /> Professional verification</Link>
              <Link href="/admin/security" className="inline-flex items-center gap-2 rounded-lg border bg-card px-4 py-2 text-sm font-medium shadow-sm hover:bg-muted/50"><ShieldAlert className="size-4" /> Security & incidents</Link>
              <Link href="/admin/content-registry" className="inline-flex items-center gap-2 rounded-lg border bg-card px-4 py-2 text-sm font-medium shadow-sm hover:bg-muted/50"><BookOpenCheck className="size-4" /> Content & evidence register</Link>
            </div>
          </div>
          <p className="mt-2 max-w-3xl leading-6 text-muted-foreground">Manage the organisation trust gate and current professional memberships. Organisation administrators are not created here and organisation-level administration does not grant access to client health or recovery information.</p>
        </header>
        <OrganisationLifecycleClient />
      </div>
    </main>
  )
}
