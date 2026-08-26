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
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">Your wellbeing. Your goals. Your pace.</p>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight text-balance">
              A place to reflect, practise and{" "}
              <span className="text-primary">keep moving forward</span>
            </h1>
            <p className="text-lg md:text-xl text-foreground/80 leading-relaxed max-w-xl text-pretty">
              Waypoint is a self-guided recovery and wellbeing companion for adults. It helps you notice patterns, practise useful skills,
              check in with yourself and stay connected to the goals and values that matter to you.
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

      <section className="border-y border-border bg-card/60">
        <div className="container mx-auto px-6 py-5 text-center">
          <p className="text-sm text-muted-foreground">
            A developing recovery-support platform for adults in Aotearoa New Zealand. Waypoint complements professional care; it does not replace it.
          </p>
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
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Build skills over time</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground leading-tight text-balance">
              Practical tools for everyday moments.
            </h2>
            <p className="text-foreground/75 leading-relaxed text-pretty">
              Waypoint's 11 journey modules are informed by established ideas used in CBT, DBT, ACT and mindfulness.
              They cover awareness, urges, emotional regulation, values, communication and coping skills. Work through them at your own pace.
            </p>
            <ul className="space-y-3">
              {[
                "11 interactive learning and skills modules",
                "Daily check-ins for mood, urges and patterns you choose to track",
                "A Growth Companion that reflects your engagement with Waypoint",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground/80">{item}</span>
                </li>
              ))}
            </ul>
            <Link href="/auth/signup">
              <Button className="mt-2 font-semibold">Explore Waypoint <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── SPLIT SECTION: Family (reversed) ── */}
      <section className="bg-card border-y border-border">
        <div className="container mx-auto px-6 py-20 md:py-28">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-5 order-2 md:order-1">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary">What matters to you</p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground leading-tight text-balance">
                Keep your values and whānau in view.
              </h2>
              <p className="text-foreground/75 leading-relaxed text-pretty">
                Recovery and behaviour change can affect relationships, routines and everyday life. Waypoint helps you reflect on what matters to you,
                notice the choices you are making, and recognise progress without expecting every day to look the same.
              </p>
              <ul className="space-y-3">
                {[
                  "Values-based goals connected to what matters most",
                  "Track engagement and acknowledge milestones without treating a missed day as failure",
                  "Optional peer community for shared experience and encouragement",
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
                alt="Family embracing in a sunny park, representing connection"
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
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Tools you can use</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground text-balance">Choose what is useful for you</h2>
          <p className="text-foreground/70 max-w-2xl mx-auto text-pretty">
            You can use Waypoint as a fuller guided journey or focus on the parts that fit where you are right now.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: Target,
              title: "Guided Journey Modules",
              desc: "11 interactive modules covering awareness, coping skills, emotional regulation, values and communication, informed by established therapeutic approaches.",
              img: "/images/building-skills.jpg",
            },
            {
              icon: Calendar,
              title: "Daily Check-Ins",
              desc: "Record your self-reported mood, urges, emotions and relevant behaviours so you can look back at patterns over time.",
              img: "/images/daily-reflection.jpg",
            },
            {
              icon: Users,
              title: "Community Connection",
              desc: "An optional peer space for sharing experiences and encouragement. Community discussion is not professional counselling or emergency support.",
              img: "/images/community-connection.jpg",
            },
            {
              icon: TrendingUp,
              title: "Visual Progress",
              desc: "See trends in your own check-ins and Waypoint activity without treating engagement scores as a clinical measure of recovery.",
            },
            {
              icon: CheckCircle,
              title: "Values Alignment",
              desc: "Identify what matters to you and reflect on whether your everyday choices are moving in that direction.",
            },
            {
              icon: Shield,
              title: "Support Resources",
              desc: "Quick access to verified New Zealand helplines and emergency information. Waypoint itself is not a monitored crisis service.",
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
                title: "Set up your Waypoint",
                desc: "Create your account, choose the areas you want Waypoint to support, and pick a Growth Companion. You can personalise the experience further later.",
              },
              {
                n: "02",
                title: "Explore the modules",
                desc: "Work through 11 learning and skills modules at your own pace, in the order that is useful for you.",
              },
              {
                n: "03",
                title: "Check in when it helps",
                desc: "Record your mood, urges, emotions and reflections. Your entries are self-reported and appear in your personal dashboard.",
              },
              {
                n: "04",
                title: "Reflect and connect",
                desc: "Review your patterns, use practical skills and choose whether to take part in the peer community.",
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
              Ready to explore Waypoint?
            </h2>
            <p className="text-lg text-foreground/75 leading-relaxed text-pretty">
              Start with the parts that feel useful to you. Reflect on your patterns, practise skills and keep your values in view as you work toward change.
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
