import Link from "next/link"
import { redirect } from "next/navigation"
import { BookOpenCheck, Building2, ShieldAlert, ShieldCheck, UserCheck } from "lucide-react"
import { getAdminSession } from "@/lib/admin-access"
import PrivacyRequestClient from "@/components/admin/privacy-request-client"

export default async function AdminPrivacyPage() {
  const admin = await getAdminSession()
  if (!admin.user) redirect("/auth/signin?from=/admin/privacy")
  if (admin.user.role !== "admin") redirect(admin.user.role === "professional" ? "/professional" : "/dashboard")
  if (!admin.authorised) redirect("/security/mfa")

  return (
    <main className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="border-b pb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-primary"><ShieldCheck className="size-5" /><p className="text-xs font-semibold uppercase tracking-[0.18em]">Waypoint administration</p></div>
              <h1 className="mt-2 text-3xl font-bold tracking-tight">Privacy requests</h1>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/admin/professionals" className="inline-flex items-center gap-2 rounded-lg border bg-card px-4 py-2 text-sm font-medium shadow-sm hover:bg-muted/50"><UserCheck className="size-4" /> Professionals</Link>
              <Link href="/admin/organisations" className="inline-flex items-center gap-2 rounded-lg border bg-card px-4 py-2 text-sm font-medium shadow-sm hover:bg-muted/50"><Building2 className="size-4" /> Organisations</Link>
              <Link href="/admin/security" className="inline-flex items-center gap-2 rounded-lg border bg-card px-4 py-2 text-sm font-medium shadow-sm hover:bg-muted/50"><ShieldAlert className="size-4" /> Security & incidents</Link>
              <Link href="/admin/content-registry" className="inline-flex items-center gap-2 rounded-lg border bg-card px-4 py-2 text-sm font-medium shadow-sm hover:bg-muted/50"><BookOpenCheck className="size-4" /> Content & evidence register</Link>
            </div>
          </div>
          <p className="mt-2 max-w-3xl leading-6 text-muted-foreground">Review correction and deletion requests. Client deletion is deliberately destructive, MFA-gated and audited; professional or administrator accounts require their separate governed offboarding pathway.</p>
        </header>
        <PrivacyRequestClient />
      </div>
    </main>
  )
}
