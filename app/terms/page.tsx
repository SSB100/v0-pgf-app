import Link from "next/link"
import { AppLogo } from "@/components/layout/app-logo"
import { Button } from "@/components/ui/button"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <AppLogo size="sm" showText={true} />
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/auth/signin">
              <Button variant="ghost" className="text-primary hover:text-primary/80">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold text-primary mb-2">Terms and Conditions</h1>
        <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="prose prose-slate max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-primary mb-3">1. Acceptance of Terms</h2>
            <p className="text-foreground/80">
              By accessing and using Waypoint, you accept and agree to be bound by these Terms and Conditions. If you do
              not agree to these terms, please do not use our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-primary mb-3">2. Service Description</h2>
            <p className="text-foreground/80">
              Waypoint is a recovery support platform designed to help individuals managing addiction and mental health
              challenges. We provide educational content, progress tracking tools, and support resources. Waypoint is
              not a substitute for professional medical or therapeutic treatment.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-primary mb-3">3. User Responsibilities</h2>
            <p className="text-foreground/80 mb-2">You agree to:</p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/80">
              <li>Provide accurate and truthful information when creating your account</li>
              <li>Maintain the confidentiality of your account credentials</li>
              <li>Use the service in compliance with all applicable laws and regulations</li>
              <li>Not share or misuse other users' personal information</li>
              <li>Seek professional help in emergency situations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-primary mb-3">4. Medical Disclaimer</h2>
            <p className="text-foreground/80">
              Waypoint provides educational and support resources but does not provide medical advice, diagnosis, or
              treatment. The content on our platform is for informational purposes only. Always seek the advice of
              qualified healthcare providers with questions regarding medical conditions or treatment.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-primary mb-3">5. Privacy and Data Protection</h2>
            <p className="text-foreground/80">
              We are committed to protecting your privacy. Your personal information is stored securely and will never
              be sold to third parties. If you consent to research data sharing, only anonymous, aggregated data will be
              used. See our Privacy Policy for details.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-primary mb-3">6. Limitation of Liability</h2>
            <p className="text-foreground/80">
              Waypoint and its creators are not liable for any direct, indirect, incidental, or consequential damages
              arising from your use of the service. This includes, but is not limited to, loss of data, interruption of
              service, or any outcomes related to your recovery journey.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-primary mb-3">7. Emergency Situations</h2>
            <p className="text-foreground/80">
              If you are experiencing a mental health crisis or emergency, please contact emergency services (911) or a
              crisis helpline immediately. Waypoint's SOS feature is not monitored 24/7 and should not be relied upon
              for emergency response.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-primary mb-3">8. Account Termination</h2>
            <p className="text-foreground/80">
              We reserve the right to suspend or terminate accounts that violate these terms or engage in harmful
              behavior. You may delete your account at any time through your account settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-primary mb-3">9. Changes to Terms</h2>
            <p className="text-foreground/80">
              We may update these Terms and Conditions from time to time. Continued use of Waypoint after changes
              constitutes acceptance of the revised terms. We will notify users of significant changes via email or
              in-app notification.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-primary mb-3">10. Contact Information</h2>
            <p className="text-foreground/80">
              If you have questions about these Terms and Conditions, please contact us through our support channels.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t">
          <Link href="/auth/signup">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Return to Sign Up</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
