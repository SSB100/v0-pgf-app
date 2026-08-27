import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Target, Users, Shield, Compass } from "lucide-react"
import { PublicHeader } from "@/components/layout/public-header"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />

      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-primary">About Waypoint</h1>
            <p className="text-xl text-primary/70">
              A self-guided companion for reflection, recovery and personal growth.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-primary">Our Purpose</h2>
              <p className="text-lg text-primary/70">
                Waypoint is being developed to make practical recovery and wellbeing tools easier to use between appointments and in everyday life.
                It can support people working on gambling, alcohol or other substance use, mental wellbeing, gaming-related concerns or personal growth.
                It is not a diagnosis, treatment service or replacement for professional care.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto space-y-12">
            <h2 className="text-3xl font-bold text-primary text-center">What Waypoint Offers</h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4 p-6 rounded-lg border bg-card">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10"><Target className="h-6 w-6 text-primary" /></div>
                  <h3 className="text-xl font-semibold text-primary">Skills and Learning</h3>
                </div>
                <p className="text-primary/70">
                  Journey modules are informed by established concepts used in CBT, DBT, ACT and mindfulness. They are designed for self-guided learning and practice.
                  Waypoint's content is still undergoing formal clinical and research review.
                </p>
              </div>

              <div className="space-y-4 p-6 rounded-lg border bg-card">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10"><Compass className="h-6 w-6 text-primary" /></div>
                  <h3 className="text-xl font-semibold text-primary">A Personalised Journey</h3>
                </div>
                <p className="text-primary/70">
                  Daily Reflections, values, goals and selected journey areas help tailor what you see. Progress visuals reflect your activity in Waypoint, not a clinical score of how recovered or well you are.
                </p>
              </div>

              <div className="space-y-4 p-6 rounded-lg border bg-card">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10"><Users className="h-6 w-6 text-primary" /></div>
                  <h3 className="text-xl font-semibold text-primary">Peer Community</h3>
                </div>
                <p className="text-primary/70">
                  The optional community provides a place to share experiences and encouragement with other users. It is not professional counselling and is not guaranteed to be monitored continuously.
                </p>
              </div>

              <div className="space-y-4 p-6 rounded-lg border bg-card">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10"><Shield className="h-6 w-6 text-primary" /></div>
                  <h3 className="text-xl font-semibold text-primary">Support Information</h3>
                </div>
                <p className="text-primary/70">
                  Waypoint provides quick access to verified New Zealand helplines, emergency information and practical safeguards. Waypoint itself is not an emergency-response or crisis-monitoring service.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-3xl font-bold text-primary text-center">Our Approach</h2>
            <div className="space-y-6 text-primary/70">
              <p className="text-lg">
                Change rarely follows a straight line. Waypoint is designed to make room for progress, difficult days, pauses and fresh starts without treating a setback or missed Daily Reflection as failure.
              </p>
              <p className="text-lg">
                The platform combines self-reflection, skills practice, values-based work, progress tracking and optional peer connection. The aim is to help people notice patterns and make more deliberate choices, not to tell them what recovery should look like.
              </p>
              <p className="text-lg">
                Waypoint is an early-stage functional MVP. Clinical, cultural, privacy and research governance will continue to be developed with appropriate professionals and communities in Aotearoa New Zealand.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-primary">Want to explore Waypoint?</h2>
            <p className="text-lg text-primary/70">Start with the tools that feel useful for where you are right now.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/auth/signup"><Button size="lg" className="bg-gradient-to-r from-primary to-primary/80 text-lg px-8">Get Started Free</Button></Link>
              <Link href="/faq"><Button size="lg" variant="outline" className="text-lg px-8 bg-transparent">Learn More</Button></Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t py-8 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-primary/60">© 2026 Waypoint. Supporting reflection, recovery and wellbeing.</p>
            <div className="flex gap-6">
              <Link href="/about" className="text-sm text-primary/60 hover:text-primary transition-colors">About</Link>
              <Link href="/faq" className="text-sm text-primary/60 hover:text-primary transition-colors">FAQ</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
