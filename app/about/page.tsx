import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Target, Users, Shield, Compass } from "lucide-react"
import { PublicHeader } from "@/components/layout/public-header"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />

      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-primary">About Waypoint</h1>
            <p className="text-xl text-primary/70">
              Your trusted companion on the journey to recovery and lasting change.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-primary">Our Mission</h2>
              <p className="text-lg text-primary/70">
                Waypoint exists to provide accessible, evidence-based support for anyone on their recovery journey.
                Whether you're struggling with addiction or managing mental health challenges, we believe everyone
                deserves tools, insights, and community to help them move forward.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto space-y-12">
            <h2 className="text-3xl font-bold text-primary text-center">What We Offer</h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4 p-6 rounded-lg border bg-card">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-primary">Evidence-Based Tools</h3>
                </div>
                <p className="text-primary/70">
                  Our journey modules are built on proven therapeutic approaches including DBT, CBT, and mindfulness
                  practices. Every tool is designed to help you build real skills for lasting change.
                </p>
              </div>

              <div className="space-y-4 p-6 rounded-lg border bg-card">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Compass className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-primary">Personalized Journey</h3>
                </div>
                <p className="text-primary/70">
                  Track your progress with daily reflections, earn credits as you complete modules, and watch your
                  growth tree flourish as you move forward on your path.
                </p>
              </div>

              <div className="space-y-4 p-6 rounded-lg border bg-card">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-primary">Supportive Community</h3>
                </div>
                <p className="text-primary/70">
                  Connect with others who understand your journey. Share experiences, celebrate victories, and find
                  encouragement when you need it most.
                </p>
              </div>

              <div className="space-y-4 p-6 rounded-lg border bg-card">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-primary">Crisis Support</h3>
                </div>
                <p className="text-primary/70">
                  Access your personalized SOS resources instantly when you need them. Set up safeguards and connect
                  with support services at any time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Approach */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-3xl font-bold text-primary text-center">Our Approach</h2>

            <div className="space-y-6 text-primary/70">
              <p className="text-lg">
                Recovery is not a straight line. It's a journey with progress, setbacks, and everything in between.
                Waypoint meets you where you are, providing structured guidance while honoring your unique path.
              </p>

              <p className="text-lg">
                We combine evidence-based therapeutic techniques with gamification and community support to create an
                engaging, sustainable recovery experience. Our modules help you understand your patterns, develop coping
                skills, recognize triggers, and build the life you want.
              </p>

              <p className="text-lg">
                Most importantly, you're not alone. Whether you're taking your first steps or maintaining long-term
                recovery, Waypoint is here to support you every step of the way.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-primary">Ready to Begin?</h2>
            <p className="text-lg text-primary/70">
              Start your recovery journey today with personalized tools and community support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/auth/signup">
                <Button size="lg" className="bg-gradient-to-r from-primary to-primary/80 text-lg px-8">
                  Get Started Free
                </Button>
              </Link>
              <Link href="/faq">
                <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-primary/60">© 2025 Waypoint. Supporting recovery journeys.</p>
            <div className="flex gap-6">
              <Link href="/about" className="text-sm text-primary/60 hover:text-primary transition-colors">
                About
              </Link>
              <Link href="/faq" className="text-sm text-primary/60 hover:text-primary transition-colors">
                FAQ
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
