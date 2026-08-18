import Link from "next/link"
import { AppLogo } from "@/components/layout/app-logo"
import { Button } from "@/components/ui/button"
import { supportResources } from "@/lib/support-resources"

const TERMS_VERSION = "0.3"
const EFFECTIVE_DATE = "18 August 2026"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2"><AppLogo size="sm" showText={true} /></Link>
          <div className="flex items-center gap-4">
            <Link href="/auth/signin"><Button variant="ghost">Sign In</Button></Link>
            <Link href="/auth/signup"><Button>Get Started</Button></Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold text-primary mb-2">Terms and Conditions</h1>
        <p className="text-muted-foreground mb-8">Version {TERMS_VERSION} · Effective {EFFECTIVE_DATE}</p>

        <div className="prose prose-slate max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-primary mb-3">1. About Waypoint</h2>
            <p className="text-foreground/80">Waypoint is a developing recovery-support platform that provides self-guided learning, reflection, progress tracking and support resources. The current product is an early-stage functional MVP and is not a registered health service or emergency-response service.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-primary mb-3">2. Not medical or emergency care</h2>
            <p className="text-foreground/80">Waypoint does not provide medical advice, diagnosis, treatment or emergency monitoring. It is designed to complement, not replace, qualified healthcare, counselling, addiction treatment or emergency services.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-primary mb-3">3. Immediate safety</h2>
            <p className="text-foreground/80">
              If you or someone else is in immediate danger in New Zealand, call {supportResources.emergency.phone} or go to the nearest hospital emergency department. For free brief emotional support, call or text {supportResources.emotionalSupport.phone}. Waypoint does not notify a clinician or support worker when you use its support resources unless a future feature explicitly states that a verified monitored connection is active.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-primary mb-3">4. User responsibilities</h2>
            <p className="text-foreground/80 mb-2">You agree to:</p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/80">
              <li>provide accurate information when creating and using your account;</li>
              <li>keep your account credentials confidential;</li>
              <li>use Waypoint lawfully and respectfully;</li>
              <li>not misuse another person's information or community account;</li>
              <li>seek appropriate professional or emergency help when needed.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-primary mb-3">5. Sensitive information</h2>
            <p className="text-foreground/80">Waypoint can store sensitive wellbeing and recovery information that you choose to provide, including information about gambling, alcohol or substance use, mental wellbeing, urges, self-harm, values, reflections and progress. The platform is still undergoing privacy, security and clinical-governance development before any formal research or health-service deployment.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-primary mb-3">6. Future research preference</h2>
            <p className="text-foreground/80">Any option to indicate interest in contributing information to future research is separate from ordinary use of Waypoint. The current optional research-preference setting does not enrol you in a formal study and is not, by itself, consent for a future study. Any formal research project will require its own approved participant information, consent process, data rules and governance arrangements.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-primary mb-3">7. Community features</h2>
            <p className="text-foreground/80">Community spaces are intended for peer discussion and encouragement. They are not professional counselling services and are not guaranteed to be monitored continuously. A community alias is displayed to other members, but Waypoint links that alias to your account internally. Do not use community messages as a substitute for emergency or clinical support.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-primary mb-3">8. Age</h2>
            <p className="text-foreground/80">The current Waypoint MVP is intended for people aged 18 years and over. A youth version would require a separate consent, privacy and safeguarding model.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-primary mb-3">9. Changes to Waypoint</h2>
            <p className="text-foreground/80">Because Waypoint is under active development, features and these terms may change. Material future versions should use a new version number and effective date rather than silently changing the terms a user previously accepted.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-primary mb-3">10. Current status</h2>
            <p className="text-foreground/80">These terms are an interim MVP notice and should be reviewed by appropriate New Zealand privacy and legal advisers before formal health-service or research deployment.</p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t"><Link href="/auth/signup"><Button>Return to Sign Up</Button></Link></div>
      </div>
    </div>
  )
}
