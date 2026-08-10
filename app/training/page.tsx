import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import Link from "next/link"
import MobileNav from "@/components/dashboard/mobile-nav"

export default async function TrainingPage() {
  const session = await getSession()

  if (!session) {
    redirect("/auth/signin")
  }

  const trainingModules = [
    {
      category: "Interpersonal Understanding",
      description: "Learn frameworks for effective communication and relationship management",
      modules: [
        {
          name: "DEAR MAN",
          slug: "interpersonal/dear-man",
          description: "Objective effectiveness - Getting what you need while maintaining relationships",
          icon: "🎯",
          focus: "Assertiveness training",
        },
        {
          name: "GIVE",
          slug: "interpersonal/give",
          description: "Relationship effectiveness - Building and maintaining healthy relationships",
          icon: "🤝",
          focus: "Connection building",
        },
        {
          name: "FAST",
          slug: "interpersonal/fast",
          description: "Self-respect effectiveness - Maintaining your values and self-respect",
          icon: "💎",
          focus: "Self-respect boundaries",
        },
        {
          name: "Problem Solving",
          slug: "interpersonal/problem-solving",
          description: "Six steps to solve problems effectively without avoidance",
          icon: "🧩",
          focus: "Structured approach",
        },
      ],
    },
    {
      category: "Psychological Flexibility",
      description: "Train your mind to respond with openness, awareness, and values-alignment",
      modules: [
        {
          name: "Reality Acceptance",
          slug: "reality-acceptance",
          description: "Moving from suffering and resistance to psychological agility and growth mindset",
          icon: "🧘",
          focus: "Radical acceptance",
        },
        {
          name: "Willingness",
          slug: "willingness",
          description: "Cultivate a willing response to situations - Replace wilfulness with willingness",
          icon: "🌱",
          focus: "Openness to experience",
        },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-0">
      <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-4"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Link>

          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">Training Your Mind</h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl">
            These lessons focus on understanding concepts and training your mindset over time. Unlike moment-to-moment
            skills, these frameworks help reshape how you think about relationships, acceptance, and problem-solving.
          </p>
        </div>

        {/* Training Modules by Category */}
        <div className="space-y-8">
          {trainingModules.map((category) => (
            <div key={category.category} className="space-y-4">
              <div className="border-l-4 border-primary pl-4">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">{category.category}</h2>
                <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {category.modules.map((module) => (
                  <Link
                    key={module.slug}
                    href={`/skills/${module.slug}`}
                    className="block bg-card border border-border rounded-lg p-5 hover:border-primary hover:shadow-md transition-all group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">{module.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                            {module.name}
                          </h3>
                          <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                            {module.focus}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{module.description}</p>
                        <div className="mt-3 flex items-center text-xs text-primary font-medium">
                          Learn this framework
                          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Distinction Box */}
        <div className="mt-12 p-6 bg-secondary/50 rounded-lg border border-border">
          <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Training vs. Skills
          </h3>
          <p className="text-sm text-muted-foreground mb-3">
            <strong>Training modules</strong> are frameworks that reshape your thinking over time through repeated
            practice and reflection. <strong>Coping skills</strong> are techniques you use in specific moments to manage
            urges, emotions, or crisis situations.
          </p>
          <Link href="/skills" className="inline-flex items-center text-sm font-medium text-primary hover:underline">
            Browse Coping Skills
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
      <MobileNav />
    </div>
  )
}
