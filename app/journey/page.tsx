import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { sql } from "@/lib/db"
import Image from "next/image"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import MobileNav from "@/components/dashboard/mobile-nav"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Circle, Shield, ChevronRight, Eye, Heart, Wrench } from "lucide-react"
import Link from "next/link"

export default async function JourneyPage() {
  const user = await getSession()

  if (!user) {
    redirect("/auth/signin")
  }

  // Get user profile and values
  const profileResult = await sql`
    SELECT onboarding_completed
    FROM user_profiles
    WHERE user_id = ${user.id}
  `

  if (!profileResult[0]?.onboarding_completed) {
    redirect("/onboarding")
  }

  const completedResult = await sql`
    SELECT module_slug
    FROM journey_completions
    WHERE user_id = ${user.id}
  `

  const completedModules = completedResult.map((row) => row.module_slug)

  // Get user's core values to personalize recommendations
  const valuesResult = await sql`
    SELECT value_name, category
    FROM user_values
    WHERE user_id = ${user.id} AND is_core_value = true
    ORDER BY rank
    LIMIT 3
  `

  const coreValues = valuesResult.map((v) => v.value_name)

  const moduleCategories = [
    {
      name: "Awareness",
      description: "Building the foundation of self-awareness and understanding your patterns",
      Icon: Eye,
      image: "/images/journey-awareness.jpg",
      accentClass: "border-blue-500/40 bg-blue-500/5",
      iconClass: "bg-blue-500/15 border-blue-500/30 text-blue-400",
      progressClass: "bg-blue-500",
      modules: [
        {
          slug: "understanding-your-mind",
          title: "Understanding Your Mind",
          description: "Learn about the three mind states and how they influence your decisions",
          link: "/journey/understanding-your-mind",
        },
        {
          slug: "building-awareness",
          title: "Building Daily Awareness",
          description: "Practice noticing your emotions, thoughts, and urges without judgment",
          link: "/journey/building-awareness",
        },
        {
          slug: "recognizing-triggers",
          title: "Recognizing Your Triggers",
          description: "Identify what situations, emotions, and thoughts that trigger urges",
          link: "/journey/recognizing-triggers",
        },
        {
          slug: "choice-points",
          title: "Your Choice Points",
          description: "Identify moments where you can choose values-driven actions",
          link: "/journey/choice-points",
        },
      ],
    },
    {
      name: "Values",
      description: "Discovering what matters most and aligning your actions with your values",
      Icon: Heart,
      image: "/images/journey-values.jpg",
      accentClass: "border-primary/40 bg-primary/5",
      iconClass: "bg-primary/15 border-primary/30 text-primary",
      progressClass: "bg-primary",
      modules: [
        {
          slug: "discovering-values",
          title: "Discovering Your Values",
          description: "Explore what truly matters to you and what kind of person you want to be",
          link: "/journey/discovering-values",
        },
        {
          slug: "recognizing-strengths",
          title: "Recognizing Your Strengths",
          description: "Identify the strengths that will support your recovery journey",
          link: "/journey/recognizing-strengths",
        },
      ],
    },
    {
      name: "Skills",
      description: "Learning practical skills to manage urges and build your Living Well Plan",
      Icon: Wrench,
      image: "/images/journey-skills.jpg",
      accentClass: "border-emerald-500/40 bg-emerald-500/5",
      iconClass: "bg-emerald-500/15 border-emerald-500/30 text-emerald-400",
      progressClass: "bg-emerald-500",
      modules: [
        {
          slug: "stop-skill",
          title: "STOP Skill",
          description: "Learn to pause and create space between urges and actions",
          link: "/journey/stop-skill",
        },
        {
          slug: "distress-tolerance",
          title: "Distress Tolerance",
          description: "Build capacity to sit with discomfort without acting on urges",
          link: "/journey/distress-tolerance",
        },
        {
          slug: "opposite-action",
          title: "Opposite Action",
          description: "Practice doing the opposite of what your emotion urges you to do",
          link: "/journey/opposite-action",
        },
        {
          slug: "dear-man",
          title: "DEAR MAN Communication",
          description: "Master effective communication to get your needs met respectfully",
          link: "/journey/dear-man",
        },
        {
          slug: "reality-acceptance",
          title: "Reality Acceptance",
          description: "Learn to accept what you cannot change and move forward with wisdom",
          link: "/journey/reality-acceptance",
        },
      ],
    },
  ]

  // Calculate total modules and completion
  const totalModules = moduleCategories.reduce((sum, cat) => sum + cat.modules.length, 0)
  const completedCount = completedModules.length

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-6">
      <DashboardHeader
        userName={user.full_name || "there"}
        userEmail={user.email}
        journeyProgress={{ completed: completedCount, total: totalModules }}
      />

      <main className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-6">

        {/* Hero with cinematic image */}
        <div className="relative overflow-hidden rounded-2xl border border-primary/30 min-h-[200px] sm:min-h-[240px]">
          <Image
            src="/images/journey-hero.jpg"
            alt="A path through a green valley representing your personal growth journey"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/40" />
          <div className="relative p-6 sm:p-8 flex flex-col justify-center min-h-[200px] sm:min-h-[240px]">
            <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">Your Living Well Plan</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 text-pretty leading-tight">
              Your path forward starts here
            </h1>
            {coreValues.length > 0 && (
              <p className="text-sm text-muted-foreground mb-4 text-pretty max-w-md">
                Personalised around your values: <span className="text-foreground font-medium">{coreValues.join(", ")}</span>
              </p>
            )}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-card/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-border/50">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span className="text-sm font-semibold text-foreground">{completedCount} completed</span>
              </div>
              <div className="flex items-center gap-2 bg-card/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-border/50">
                <Circle className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">{totalModules - completedCount} remaining</span>
              </div>
            </div>
          </div>
        </div>

        {/* Safeguards callout — image-backed */}
        <div className="relative overflow-hidden rounded-xl border border-orange-500/30 bg-card">
          <div className="absolute inset-0 pointer-events-none">
            <Image src="/images/safeguards-shield.jpg" alt="" fill className="object-cover object-right opacity-15" />
            <div className="absolute inset-0 bg-gradient-to-r from-card/95 via-card/85 to-card/50" />
          </div>
          <div className="relative flex items-center gap-4 px-5 py-4">
            <div className="w-10 h-10 rounded-lg bg-orange-500/15 border border-orange-500/30 flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-orange-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">Essential: Set Up Your Safeguards First</p>
              <p className="text-xs text-muted-foreground">Blocking software, money management and self-exclusion create the space to make better choices.</p>
            </div>
            <Link href="/safeguards">
              <Button variant="outline" size="sm" className="flex-shrink-0 border-orange-500/40 text-orange-400 hover:bg-orange-500/10">
                View Guide <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Module categories */}
        <div className="space-y-10">
          {moduleCategories.map((category, categoryIndex) => {
            const { Icon } = category
            const completedInCategory = category.modules.filter((m) => completedModules.includes(m.slug)).length
            const progressPct = (completedInCategory / category.modules.length) * 100

            return (
              <div key={category.name} className="space-y-3">
                {/* Category header with image */}
                <div className={`relative overflow-hidden rounded-xl border ${category.accentClass} min-h-[100px]`}>
                  <div className="absolute right-0 top-0 bottom-0 w-48 sm:w-64">
                    <Image
                      src={category.image}
                      alt=""
                      fill
                      className="object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-card via-card/60 to-transparent" />
                  </div>
                  <div className="relative p-4 sm:p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-9 h-9 rounded-lg border flex items-center justify-center flex-shrink-0 ${category.iconClass}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-foreground">{category.name}</h2>
                        <p className="text-xs text-muted-foreground max-w-xs text-pretty">{category.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 max-w-xs">
                      <div className="flex-1 bg-background/50 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`${category.progressClass} h-full transition-all duration-500`}
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-muted-foreground whitespace-nowrap">
                        {completedInCategory}/{category.modules.length}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Modules list */}
                <div className="space-y-2 pl-0 sm:pl-3">
                  {category.modules.map((module, moduleIndex) => {
                    const isCompleted = completedModules.includes(module.slug)
                    const globalIndex =
                      moduleCategories.slice(0, categoryIndex).reduce((sum, cat) => sum + cat.modules.length, 0) +
                      moduleIndex

                    return (
                      <Link key={module.slug} href={module.link} className="block">
                        <div
                          className={`flex items-center gap-4 p-4 rounded-xl border transition-all hover:border-primary/50 hover:bg-secondary/30 cursor-pointer ${
                            isCompleted
                              ? "border-emerald-500/30 bg-emerald-500/5"
                              : "border-border/50 bg-card"
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                            isCompleted ? "bg-emerald-500/20" : "bg-secondary/50"
                          }`}>
                            {isCompleted ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                            ) : (
                              <span className="text-sm font-bold text-muted-foreground">{globalIndex + 1}</span>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <h3 className="font-semibold text-sm sm:text-base text-foreground">{module.title}</h3>
                              {isCompleted && (
                                <Badge className="flex-shrink-0 bg-emerald-500/15 text-emerald-500 border-emerald-500/30 text-xs py-0">
                                  Done
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs sm:text-sm text-muted-foreground text-pretty leading-relaxed">{module.description}</p>
                          </div>

                          <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {/* Encouragement footer */}
        <div className="relative overflow-hidden rounded-xl border border-primary/20 bg-card p-6 text-center">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
          <p className="relative text-sm italic text-foreground/80 text-balance leading-relaxed">
            "Recovery is not a race. You don't have to feel guilty if it takes you longer than you thought it would."
          </p>
          <p className="relative text-xs text-muted-foreground mt-2">
            Take your time. Every step forward is progress.
          </p>
        </div>

      </main>

      <MobileNav />
    </div>
  )
}
