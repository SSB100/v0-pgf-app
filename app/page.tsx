import Link from "next/link"
import Image from "next/image"
import { getSession } from "@/lib/session"
import { redirect } from "next/navigation"
import { ArrowRight, CheckCircle, TrendingUp, Calendar, Target, Shield, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PublicHeader } from "@/components/layout/public-header"
import { PublicFooter } from "@/components/layout/public-footer"

export default async function Home() {
  const user = await getSession()

  if (user) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PublicHeader />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden min-h-[620px] md:min-h-[720px] flex items-center">
        <Image
          src="/images/hero-family-sunrise.jpg"
          alt="Father and child walking at sunrise"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-background/20" />

        <div className="relative z-10 container mx-auto px-6 py-20 md:py-28">
          <div className="max-w-2xl space-y-6">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">Your recovery. Your terms.</p>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight text-balance">
              A new chapter{" "}
              <span className="text-primary">starts today</span>
            </h1>
            <p className="text-lg md:text-xl text-foreground/80 leading-relaxed max-w-xl text-pretty">
              Waypoint gives you the evidence-based tools, daily structure, and peer support to break free from addiction and build the life you want — for yourself and the people you love.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link href="/auth/signup">
                <Button size="lg" className="text-base px-8 font-semibold shadow-lg w-full sm:w-auto">
                  Start for free <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/auth/signin">
                <Button size="lg" variant="outline" className="text-base px-8 w-full sm:w-auto">
                  Sign in
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST TICKER ── */}
      <section className="border-y border-border bg-card/60 overflow-hidden">
        <div className="container mx-auto px-6 py-6">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-5">Supported by</p>
          <div className="relative flex">
            <div className="flex animate-scroll whitespace-nowrap gap-16">
              {Array(2).fill(0).map((_, i) => (
                <span key={i} className="text-sm font-semibold text-foreground/50 flex-shrink-0">Insert supporting service names here</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SPLIT SECTION: Growth ── */}
      <section className="container mx-auto px-6 py-20 md:py-28">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-2xl">
            <Image
              src="/images/growth-journey.jpg"
              alt="Person standing on a hilltop at dawn, symbolising personal growth"
              fill
              className="object-cover"
            />
          </div>
          <div className="space-y-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Grow every day</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground leading-tight text-balance">
              Real tools. Real progress. Real change.
            </h2>
            <p className="text-foreground/75 leading-relaxed text-pretty">
              Waypoint's 11 journey modules are built on evidence-based therapy — covering urge management, emotional regulation, values alignment, and relapse prevention. Work through them at your own pace, and watch your growth compound over time.
            </p>
            <ul className="space-y-3">
              {[
                "11 skill-building modules grounded in CBT and ACT",
                "Daily check-ins that track mood, urges and patterns",
                "A Growth Companion that evolves as you do",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground/80">{item}</span>
                </li>
              ))}
            </ul>
            <Link href="/auth/signup">
              <Button className="mt-2 font-semibold">Begin your journey <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── SPLIT SECTION: Family (reversed) ── */}
      <section className="bg-card border-y border-border">
        <div className="container mx-auto px-6 py-20 md:py-28">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-5 order-2 md:order-1">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary">For those you love</p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground leading-tight text-balance">
                Recovery isn't just about you — it's about coming home.
              </h2>
              <p className="text-foreground/75 leading-relaxed text-pretty">
                The impact of addiction reaches everyone around you. Waypoint helps you rebuild trust, reconnect with the people who matter, and show up as the person you want to be — day after day.
              </p>
              <ul className="space-y-3">
                {[
                  "Values-based goals tied to what matters most",
                  "Track your streak and celebrate milestones",
                  "Community support from people who understand",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground/80">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-2xl order-1 md:order-2">
              <Image
                src="/images/family-reconnection.jpg"
                alt="Family embracing in a sunny park, representing reconnection"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES GRID ── */}
      <section className="container mx-auto px-6 py-20 md:py-28">
        <div className="text-center mb-14 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Everything you need</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground text-balance">Built for every stage of recovery</h2>
          <p className="text-foreground/70 max-w-2xl mx-auto text-pretty">
            Whether you're on day one or year three, Waypoint meets you where you are.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: Target,
              title: "Guided Journey Modules",
              desc: "11 interactive modules covering awareness, coping strategies, emotional regulation, and healthy habits. Built on CBT and ACT frameworks.",
              img: "/images/building-skills.jpg",
            },
            {
              icon: Calendar,
              title: "Daily Check-Ins",
              desc: "Track your mood, urges and emotional patterns every day. Spot your triggers and celebrate the wins — big and small.",
              img: "/images/daily-reflection.jpg",
            },
            {
              icon: Users,
              title: "Community Connection",
              desc: "Connect with others who truly understand. Share experiences, find encouragement, and build the support network recovery requires.",
              img: "/images/community-connection.jpg",
            },
            {
              icon: TrendingUp,
              title: "Visual Progress",
              desc: "Watch your Growth Companion evolve and see weekly trends that show exactly how far you've come.",
            },
            {
              icon: CheckCircle,
              title: "Values Alignment",
              desc: "Identify your core values and ensure daily actions point toward the life you actually want.",
            },
            {
              icon: Shield,
              title: "24/7 Crisis Support",
              desc: "Immediate access to crisis resources, helplines, and personalised safety plans whenever you need them.",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/40 transition-all hover:shadow-lg group"
            >
              {feature.img && (
                <div className="relative h-44 overflow-hidden">
                  <Image
                    src={feature.img}
                    alt={feature.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
                </div>
              )}
              <div className={`p-6 space-y-3 ${!feature.img ? "pt-8" : ""}`}>
                <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-base font-bold text-foreground">{feature.title}</h3>
                <p className="text-sm text-foreground/70 leading-relaxed">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="bg-card border-y border-border">
        <div className="container mx-auto px-6 py-20 md:py-28">
          <div className="text-center mb-14 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Simple to start</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">How Waypoint works</h2>
          </div>

          <div className="max-w-3xl mx-auto grid sm:grid-cols-2 gap-8">
            {[
              {
                n: "01",
                title: "Complete your assessment",
                desc: "A guided onboarding identifies your values, strengths, triggers, and goals. Takes about 10 minutes.",
              },
              {
                n: "02",
                title: "Work through the modules",
                desc: "11 skill-building modules at your own pace. Each builds on the last.",
              },
              {
                n: "03",
                title: "Check in daily",
                desc: "A 3-minute daily reflection tracks your mood, urges, and progress. Earns XP for your companion.",
              },
              {
                n: "04",
                title: "Grow and connect",
                desc: "Join your community group, celebrate milestones, and support others on the same path.",
              },
            ].map((step) => (
              <div key={step.n} className="flex gap-5 items-start">
                <span className="text-3xl font-black text-primary/20 leading-none flex-shrink-0">{step.n}</span>
                <div className="space-y-1">
                  <h3 className="font-bold text-foreground">{step.title}</h3>
                  <p className="text-sm text-foreground/70 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative overflow-hidden">
        <Image
          src="/images/community-connection.jpg"
          alt="People connecting and supporting each other"
          fill
          className="object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/60" />
        <div className="relative z-10 container mx-auto px-6 py-24 md:py-32">
          <div className="max-w-xl space-y-6">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground text-balance leading-tight">
              Ready to take the first step?
            </h2>
            <p className="text-lg text-foreground/75 leading-relaxed text-pretty">
              Join Waypoint today. Build the skills, find your community, and start living in line with your values — whatever you're recovering from.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/auth/signup">
                <Button size="lg" className="text-base px-10 font-semibold shadow-xl w-full sm:w-auto">
                  Get started free <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/auth/signin">
                <Button size="lg" variant="outline" className="text-base px-8 w-full sm:w-auto bg-transparent">
                  I already have an account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}
