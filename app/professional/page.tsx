import Link from "next/link"
import { redirect } from "next/navigation"
import { Building2, Clock3, ShieldCheck } from "lucide-react"
import { getSession } from "@/lib/session"
import { getProfessionalAccountForUser, professionalCanAccessClientData } from "@/lib/professional-access"
import ProfessionalDashboardClient from "@/components/professional/professional-dashboard-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function ProfessionalPage() {
  const user = await getSession()
  if (!user) redirect("/auth/signin?from=/professional")

  const professional = await getProfessionalAccountForUser(user.id)
  if (!professional) redirect("/dashboard")

  if (!professionalCanAccessClientData(professional)) {
    const suspended = professional.verification_status === "suspended"
    return (
      <main className="min-h-screen bg-background px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-3xl space-y-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Waypoint professional portal</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">Access verification</h1>
            <p className="mt-2 text-muted-foreground">Professional access is intentionally separate from ordinary Waypoint use. Client information remains unavailable until both the professional identity and organisation have been verified.</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">{suspended ? <ShieldCheck className="size-5 text-destructive" /> : <Clock3 className="size-5 text-primary" />} {suspended ? "Professional access suspended" : "Verification pending"}</CardTitle>
              <CardDescription>{professional.display_name}{professional.professional_role ? ` · ${professional.professional_role}` : ""}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border p-4"><p className="font-medium">Professional identity</p><p className="mt-1 capitalize text-muted-foreground">{professional.verification_status}</p></div>
                <div className="rounded-lg border p-4"><p className="flex items-center gap-2 font-medium"><Building2 className="size-4" /> Organisation</p><p className="mt-1 text-muted-foreground">{professional.organisation_name || professional.claimed_organisation_name || "Not supplied"}</p><p className="mt-1 capitalize text-xs text-muted-foreground">{professional.organisation_verification_status || "Not yet linked to a verified organisation"}</p></div>
              </div>
              <div className="rounded-lg border bg-muted/20 p-4 leading-6 text-muted-foreground">Creating a professional account does not verify credentials or affiliation. During this development phase, Waypoint will verify professional and organisation records through a controlled administrative process before invitation or client-summary access is enabled.</div>
              <div className="flex flex-wrap gap-3"><Link href="/professional-use"><Button variant="outline">Professional use notice</Button></Link><Link href="/privacy-policy"><Button variant="ghost">Privacy policy</Button></Link></div>
            </CardContent>
          </Card>
        </div>
      </main>
    )
  }

  return <ProfessionalDashboardClient professional={{ display_name: professional.display_name, professional_role: professional.professional_role, organisation_name: professional.organisation_name }} />
}
