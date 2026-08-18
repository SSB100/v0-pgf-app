import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import Link from "next/link"
import MobileNav from "@/components/dashboard/mobile-nav"

export default async function TrainingPage() {
  const session = await getSession()
  if (!session) redirect("/auth/signin")

  const trainingModules = [
    {
      category: "Interpersonal Understanding",
      description: "Explore structured approaches to communication, relationships and problem-solving",
      modules: [
        { name: "DEAR MAN", slug: "interpersonal/dear-man", description: "A DBT-informed structure for making a request or setting a boundary", icon: "🎯", focus: "Assertive communication" },
        { name: "GIVE", slug: "interpersonal/give", description: "A DBT-informed reminder for maintaining relationships during conversations", icon: "🤝", focus: "Relationship skills" },
        { name: "FAST", slug: "interpersonal/fast", description: "A DBT-informed reminder for keeping self-respect and values in view", icon: "💎", focus: "Self-respect" },
        { name: "Problem Solving", slug: "interpersonal/problem-solving", description: "A structured way to define a problem, consider options and choose a next step", icon: "🧩", focus: "Structured reflection" },
      ],
    },
    {
      category: "Acceptance and Flexibility",
      description: "Explore ways of responding to difficult situations with awareness, openness and values in view",
      modules: [
        { name: "Reality Acceptance", slug: "reality-acceptance", description: "Explore acceptance when a situation cannot be changed right now", icon: "🧘", focus: "Acceptance" },
        { name: "Willingness", slug: "willingness", description: "Explore the difference between willingness and fighting against what is already happening", icon: "🌱", focus: "Openness" },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-0">
      <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
        <div className="mb-8">
          <Link href="/dashboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-4">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Back to Dashboard
          </Link>

          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">Training Your Mind</h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl">
            These self-guided lessons introduce frameworks used in approaches such as DBT and acceptance-based work. They are options for reflection and practice, not a substitute for therapy or individual clinical advice.
          </p>
        </div>

        <div className="space-y-8">
          {trainingModules.map((category) => (
            <div key={category.category} className="space-y-4">
              <div className="border-l-4 border-primary pl-4">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">{category.category}</h2>
                <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {category.modules.map((module) => (
                  <Link key={module.slug} href={`/skills/${module.slug}`} className="block bg-card border border-border rounded-lg p-5 hover:border-primary hover:shadow-md transition-all group">
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">{module.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">{module.name}</h3>
                          <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">{module.focus}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{module.description}</p>
                        <div className="mt-3 flex items-center text-xs text-primary font-medium">
                          Explore this framework
                          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 bg-secondary/50 rounded-lg border border-border">
          <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Frameworks and coping skills
          </h3>
          <p className="text-sm text-muted-foreground mb-3">
            These training pages explore broader frameworks through reflection and practice. The Coping Skills Library contains shorter techniques that may be useful in specific moments. Different approaches work differently for different people.
          </p>
          <Link href="/skills" className="inline-flex items-center text-sm font-medium text-primary hover:underline">
            Browse Coping Skills
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </Link>
        </div>
      </div>
      <MobileNav />
    </div>
  )
}
