import { redirect } from "next/navigation"
import { ShieldCheck } from "lucide-react"
import { getAdminSession } from "@/lib/admin-access"
import ProfessionalVerificationClient from "@/components/admin/professional-verification-client"

export default async function AdminProfessionalsPage() {
  const admin = await getAdminSession()
  if (!admin.user) redirect("/auth/signin?from=/admin/professionals")
  if (admin.user.role !== "admin") redirect(admin.user.role === "professional" ? "/professional" : "/dashboard")
  if (!admin.authorised) redirect("/security/mfa")

  return (
    <main className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="border-b pb-6">
          <div className="flex items-center gap-2 text-primary"><ShieldCheck className="size-5" /><p className="text-xs font-semibold uppercase tracking-[0.18em]">Waypoint administration</p></div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Professional verification</h1>
          <p className="mt-2 max-w-3xl leading-6 text-muted-foreground">Review professional applications, confirm organisation affiliation, suspend access, reset MFA after controlled identity recovery, or offboard an account. Every action is recorded in the administrative audit history.</p>
        </header>
        <ProfessionalVerificationClient />
      </div>
    </main>
  )
}
