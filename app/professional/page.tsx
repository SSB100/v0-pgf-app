import Link from "next/link"
import { redirect } from "next/navigation"
import { Building2, Clock3, ShieldCheck, UserRoundCheck } from "lucide-react"
import { getProfessionalSession, professionalCanAccessClientData } from "@/lib/professional-access"
import ProfessionalDashboardClient from "@/components/professional/professional-dashboard-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function ProfessionalPage() {
  const { user, professional, mfaVerified } = await getProfessionalSession()
  if (!user) redirect("/auth/signin?from=/professional")
  if (!professional) redirect("/dashboard")
  if (professional.mfa_status !== "active") redirect("/security/mfa")
  if (!mfaVerified) redirect("/auth/signin?from=/professional&reauth=1")

  if (!professionalCanAccessClientData(professional, mfaVerified)) {
    const suspended = professional.verification_status === "suspended"
    const membershipSuspended = professional.membership_status === "suspended"
    return (
      <main className="min-h-screen bg-background px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-4xl space-y-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Waypoint professional portal</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">Access verification</h1>
            <p className="mt-2 text-muted-foreground">Client information remains unavailable unless your professional identity, organisation, current organisation membership and authenticator session all satisfy Waypoint's access controls.</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">{suspended || membershipSuspended ? <ShieldCheck className="size-5 text-destructive" /> : <Clock3 className="size-5 text-primary" />} {suspended ? "Professional access suspended" : membershipSuspended ? "Organisation membership suspended" : "Verification pending"}</CardTitle>
              <CardDescription>{professional.display_name}{professional.professional_role ? ` · ${professional.professional_role}` : ""}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg border p-4"><p className="font-medium">Authenticator</p><p className="mt-1 capitalize text-muted-foreground">{professional.mfa_status}</p></div>
                <div className="rounded-lg border p-4"><p className="font-medium">Professional identity</p><p className="mt-1 capitalize text-muted-foreground">{professional.verification_status}</p></div>
                <div className="rounded-lg border p-4"><p className="flex items-center gap-2 font-medium"><Building2 className="size-4" /> Organisation</p><p className="mt-1 text-muted-foreground">{professional.organisation_name || professional.claimed_organisation_name || "Not supplied"}</p><p className="mt-1 capitalize text-xs text-muted-foreground">{professional.organisation_verification_status || "Not yet linked to a verified organisation"}</p></div>
                <div className="rounded-lg border p-4"><p className="flex items-center gap-2 font-medium"><UserRoundCheck className="size-4" /> Membership</p><p className="mt-1 capitalize text-muted-foreground">{professional.membership_status || "Not verified"}</p><p className="mt-1 text-xs text-muted-foreground">{professional.membership_verified_at ? `Verified ${new Intl.DateTimeFormat("en-NZ", { dateStyle: "medium" }).format(new Date(professional.membership_verified_at))}` : "Current affiliation has not been verified"}</p></div>
              </div>
              <div className="rounded-lg border bg-muted/20 p-4 leading-6 text-muted-foreground">Creating a professional account does not verify credentials or current employment or service affiliation. A Waypoint administrator must record independent verification. If an organisation or membership has been suspended, access remains unavailable until the relevant trust gate has been reviewed again.</div>
              {membershipSuspended && <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 leading-6 text-muted-foreground">Your professional identity may still be verified, but your current organisation affiliation is suspended. Re-activation of the organisation alone does not restore professional membership. Waypoint must independently re-verify the affiliation before professional features return.</div>}
              <div className="flex flex-wrap gap-3"><Link href="/security/mfa"><Button variant="outline">Security settings</Button></Link><Link href="/professional-use"><Button variant="outline">Professional use notice</Button></Link><Link href="/privacy-policy"><Button variant="ghost">Privacy policy</Button></Link></div>
            </CardContent>
          </Card>
        </div>
      </main>
    )
  }

  return <ProfessionalDashboardClient professional={{ display_name: professional.display_name, professional_role: professional.professional_role, organisation_name: professional.organisation_name }} />
}
