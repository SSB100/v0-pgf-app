import Link from "next/link"
import { redirect } from "next/navigation"
import { BookOpenCheck, Building2, ShieldAlert, UserRoundCheck } from "lucide-react"
import { getAdminSession } from "@/lib/admin-access"
import { SECURITY_ASSURANCE_REGISTER } from "@/lib/security-assurance-register"
import SecurityIncidentRegisterClient from "@/components/admin/security-incident-register-client"

const statusLabel: Record<string, string> = {
  implemented_internal: "Implemented internally",
  partially_implemented: "Partially implemented",
  pending_external: "External assurance pending",
  pending: "Pending",
}

export default async function AdminSecurityPage() {
  const admin = await getAdminSession()
  if (!admin.user) redirect("/auth/signin?from=/admin/security")
  if (admin.user.role !== "admin") redirect(admin.user.role === "professional" ? "/professional" : "/dashboard")
  if (!admin.authorised) redirect("/security/mfa")

  return (
    <main className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="border-b pb-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-primary"><ShieldAlert className="size-5" /><p className="text-xs font-semibold uppercase tracking-[0.18em]">Waypoint administration</p></div>
              <h1 className="mt-2 text-3xl font-bold tracking-tight">Security, incidents & privacy breaches</h1>
              <p className="mt-2 max-w-4xl leading-6 text-muted-foreground">Operational register for security and privacy incidents, serious-harm decisions, containment and notification status. This is not a place to store copies of breached data or client narratives.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/admin/professionals" className="inline-flex items-center gap-2 rounded-lg border bg-card px-4 py-2 text-sm font-medium shadow-sm hover:bg-muted/50"><UserRoundCheck className="size-4" /> Professionals</Link>
              <Link href="/admin/organisations" className="inline-flex items-center gap-2 rounded-lg border bg-card px-4 py-2 text-sm font-medium shadow-sm hover:bg-muted/50"><Building2 className="size-4" /> Organisations</Link>
              <Link href="/admin/content-registry" className="inline-flex items-center gap-2 rounded-lg border bg-card px-4 py-2 text-sm font-medium shadow-sm hover:bg-muted/50"><BookOpenCheck className="size-4" /> Content register</Link>
            </div>
          </div>
          <div className="mt-4 rounded-xl border border-amber-400/50 bg-amber-500/10 p-4 text-sm leading-6 text-amber-950 dark:text-amber-100">
            <strong>NZ privacy-breach rule:</strong> if a breach has caused or is likely to cause serious harm, notify the Office of the Privacy Commissioner as soon as practicable and notify affected people as soon as practicable unless a lawful exception applies. Waypoint uses 72 hours as an internal escalation target, not as a substitute for the statutory “as soon as practicable” requirement.
          </div>
        </header>

        <section className="space-y-4">
          <div><h2 className="text-xl font-semibold">Security assurance register</h2><p className="mt-1 text-sm text-muted-foreground">Separates controls Waypoint has implemented internally from work that still requires external or operational assurance.</p></div>
          <div className="grid gap-4 md:grid-cols-2">
            {SECURITY_ASSURANCE_REGISTER.map((record) => (
              <article key={record.id} className="rounded-xl border bg-card p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3"><h3 className="font-semibold">{record.control}</h3><span className="rounded-full border px-2.5 py-1 text-xs">{statusLabel[record.status] ?? record.status}</span></div>
                <p className="mt-3 text-sm leading-6">{record.evidence}</p>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">{record.boundary}</p>
              </article>
            ))}
          </div>
        </section>

        <SecurityIncidentRegisterClient />
      </div>
    </main>
  )
}
