import Link from "next/link"
import { AppLogo } from "@/components/layout/app-logo"
import { Button } from "@/components/ui/button"

const PRIVACY_VERSION = "0.1"
const EFFECTIVE_DATE = "25 August 2026"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-card/90 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-2"><AppLogo size="sm" showText={true} /></Link>
          <div className="flex items-center gap-3">
            <Link href="/terms"><Button variant="ghost">Terms</Button></Link>
            <Link href="/auth/signin"><Button>Sign in</Button></Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-4xl px-4 py-12">
        <h1 className="mb-2 text-4xl font-bold text-primary">Privacy Policy</h1>
        <p className="mb-3 text-muted-foreground">Version {PRIVACY_VERSION} · Effective {EFFECTIVE_DATE}</p>
        <div className="mb-8 rounded-lg border border-amber-300/60 bg-amber-50 p-4 text-sm text-amber-950 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-100">
          This is Waypoint&apos;s interim MVP privacy notice. It is intended to make current data practices transparent while the platform&apos;s formal privacy, Māori data-governance, security and clinical-governance arrangements are being developed and externally reviewed before wider health-service or research deployment.
        </div>

        <div className="space-y-8 leading-7 text-foreground/85">
          <section>
            <h2 className="mb-3 text-2xl font-semibold text-primary">1. What Waypoint is</h2>
            <p>Waypoint is a developing self-guided wellbeing and recovery-support platform. The current version is an early functional MVP. It is not an emergency-response service and does not currently provide a live clinician-monitoring service.</p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-primary">2. Information we currently collect</h2>
            <p className="mb-3">Depending on the features you use, Waypoint may hold:</p>
            <ul className="list-disc space-y-2 pl-6">
              <li>account information such as your name, email address and password hash;</li>
              <li>age-eligibility and demographic information currently collected at signup, including date of birth, country and gender;</li>
              <li>onboarding information about goals, challenges, values, strengths, wellbeing and recovery context;</li>
              <li>daily check-ins, urges, behaviour information, skills practice, Journey progress and reflections you choose to enter;</li>
              <li>safeguard/support-plan information you choose to save;</li>
              <li>community profile, membership, posts, messages and reports where community features are used;</li>
              <li>account-security, consent, sharing and access records as those governance features are introduced.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-primary">3. Why we collect it</h2>
            <p>Information should be collected only for a defined Waypoint purpose: running your account, providing the features you choose to use, personalising your experience, showing your own progress, supporting safety features, operating community functions, maintaining security and accountability, or enabling a separately authorised professional-sharing or research activity. We are reviewing the current MVP against a data-minimisation standard and may remove fields that are more detailed than the final purpose requires.</p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-primary">4. Professional sharing</h2>
            <p>The current production sharing screen is a prototype and does not give a healthcare professional access to your Waypoint information. Before professional sharing is enabled, Waypoint is being designed to require a verified professional relationship, explicit user approval, category-by-category sharing permissions, revocation, expiry where appropriate and access logging. Private free-text reflections will not be included simply because summary check-in sharing is enabled.</p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-primary">5. Future research interest is not research consent</h2>
            <p>You may currently indicate that you are interested in contributing Waypoint activity data to future research. That preference does not enrol you in a study and is not permission to use your information in a future formal study. Any formal research activity would require its own approved participant information, consent, governance, access, retention and withdrawal rules. Leaving the preference off does not limit ordinary use of Waypoint.</p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-primary">6. Who can see your information</h2>
            <p>Ordinary private Waypoint information is intended to be available to you and to the minimum application functions needed to provide the service. Community information may be visible to other community members according to the community feature involved. Waypoint is developing role-based professional and governance access so that organisation staff, clinicians, researchers and administrators do not receive broad access merely because they have an account.</p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-primary">7. Storage, service providers and data location</h2>
            <p>Waypoint currently uses third-party cloud infrastructure to host and operate the MVP. The full production data-residency and subprocessor model is still being documented. Waypoint should therefore not be understood as claiming that every database, backup, log or service is currently hosted only in Aotearoa New Zealand. Data-location, cross-border processing and supplier access will be formally reviewed before wider clinical or research deployment.</p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-primary">8. Māori data sovereignty</h2>
            <p>Waypoint recognises that privacy compliance alone is not the same as Māori data sovereignty. The platform is developing a Māori data-governance approach covering collection, access, control, provenance, interpretation, secondary use, dissemination and data-location decisions. That framework requires genuine co-design and governance with appropriate Māori leadership before Waypoint makes claims that it satisfies Māori data-sovereignty expectations.</p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-primary">9. Security</h2>
            <p>Waypoint uses account authentication and application security controls and is undergoing further security hardening. Before real clinical or research deployment, the programme includes stronger role-based access controls, professional MFA, rate limiting, security testing, backup/restore procedures, environment separation, audit logging and incident-response processes. No internet service can promise absolute security.</p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-primary">10. Retention and deletion</h2>
            <p>The MVP does not yet have a final approved retention schedule for every data category. Waypoint is documenting category-specific retention, deletion and anonymisation rules before pilot deployment. The signed-in Privacy &amp; Sharing Centre is being developed to support access/export, correction and deletion workflows. Where a future study or legal obligation requires a different retention rule, that exception should be stated clearly before the information is collected or used for that purpose.</p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-primary">11. Access and correction</h2>
            <p>Users should be able to understand what Waypoint holds about them, obtain a copy, correct inaccurate information where appropriate and request deletion subject to documented exceptions. The MVP is adding these controls as part of the current trust-and-sharing workstream. Formal privacy contact details and operational response procedures must be published before wider external deployment.</p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-primary">12. Changes to this policy</h2>
            <p>Material changes should receive a new policy version and effective date. Waypoint is introducing versioned policy-acceptance records so that historical agreement is not silently rewritten when a policy changes.</p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-primary">13. Current review status</h2>
            <p>This interim notice should be reviewed by appropriate New Zealand privacy/legal advisers and Māori data-governance partners before formal health-service or research deployment. It describes the direction and current MVP boundaries; it is not a certification of compliance.</p>
          </section>
        </div>

        <div className="mt-12 flex flex-wrap gap-3 border-t pt-8">
          <Link href="/terms"><Button variant="outline">Read Terms</Button></Link>
          <Link href="/auth/signup"><Button>Return to sign up</Button></Link>
        </div>
      </main>
    </div>
  )
}
