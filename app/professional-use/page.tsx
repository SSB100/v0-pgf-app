import Link from "next/link"
import { AppLogo } from "@/components/layout/app-logo"
import { Button } from "@/components/ui/button"
import { PROFESSIONAL_USE_VERSION } from "@/lib/professional-access"

export default function ProfessionalUsePage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/70">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <Link href="/"><AppLogo size="sm" showText /></Link>
          <Link href="/auth/signin"><Button variant="ghost">Sign in</Button></Link>
        </div>
      </header>
      <main className="container mx-auto max-w-4xl px-4 py-12">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Professional access</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight">Professional use notice</h1>
        <p className="mt-2 text-sm text-muted-foreground">Version {PROFESSIONAL_USE_VERSION}</p>

        <div className="mt-8 space-y-7 text-foreground/85">
          <section>
            <h2 className="text-xl font-semibold text-foreground">Purpose</h2>
            <p className="mt-2 leading-7">Waypoint professional access is designed to support conversations with people who already use Waypoint. It provides a user-authorised view of selected progress information. It is not intended to replace clinical assessment, record keeping, professional judgement or an organisation's own care systems.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-foreground">No live monitoring</h2>
            <p className="mt-2 leading-7">Waypoint is not a continuously monitored safety or emergency system. A professional must not tell a user that Waypoint will be watched in real time unless a future service has explicitly established and communicated that monitored arrangement.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-foreground">User control</h2>
            <p className="mt-2 leading-7">A professional may only access a client after the client accepts a connection and grants specific data categories. The client can change or revoke those permissions. Access outside the granted scope is prohibited.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-foreground">Appropriate use</h2>
            <p className="mt-2 leading-7">Information shown by Waypoint is primarily self-reported. Trend summaries must be interpreted in context and should not be treated as diagnosis, validated risk scoring or proof that a person is improving or deteriorating.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-foreground">Accountability</h2>
            <p className="mt-2 leading-7">Sensitive professional views and exports may be recorded in Waypoint's access history. Professional accounts must not be shared, and suspected unauthorised access should be reported promptly.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-foreground">Current product status</h2>
            <p className="mt-2 leading-7">Professional access is under active development and review. Verification by Waypoint confirms only that the account has passed Waypoint's current access-verification process. It is not an endorsement of the professional, their organisation or the services they provide.</p>
          </section>
        </div>
      </main>
    </div>
  )
}
