import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import Link from "next/link"
import MobileNav from "@/components/dashboard/mobile-nav"

export default async function SkillsPage() {
  const session = await getSession()

  if (!session) {
    redirect("/auth/signin")
  }

  const skillCategories = [
    {
      category: "Distress Tolerance",
      description: "Skills to help you tolerate and survive crisis situations without making things worse",
      skills: [
        {
          name: "TIP",
          slug: "tip",
          description: "Temperature, Intense exercise, Paced breathing - rapid crisis intervention",
          icon: "🧊",
        },
        {
          name: "STOP",
          slug: "stop",
          description: "Stop, Take a step back, Observe, Proceed mindfully",
          icon: "🛑",
        },
        {
          name: "PLEASE",
          slug: "please",
          description:
            "Take care of your mind by taking care of your body - Physical health, Eating, Avoiding substances, Sleep, Exercise",
          icon: "🌟",
        },
        {
          name: "IMPROVE",
          slug: "improve",
          description: "Improve the moment - Imagery, Meaning, Planning, Relaxing, One-thing, Vacation, Encouragement",
          icon: "✨",
        },
      ],
    },
    {
      category: "Mindfulness",
      description: "Skills to help you stay present and aware without judgment",
      skills: [
        {
          name: "RAIN",
          slug: "rain",
          description: "Recognize, Allow, Investigate, Nurture - mindful awareness practice",
          icon: "🌧️",
        },
      ],
    },
    {
      category: "Emotion Regulation",
      description: "Skills to help you understand and manage difficult emotions",
      skills: [
        {
          name: "Opposite Action",
          slug: "opposite-action",
          description: "Act opposite to your emotional urge to change the emotion",
          icon: "↔️",
        },
      ],
    },
    {
      category: "Interpersonal Skills",
      description: "Quick techniques for in-the-moment relationship navigation",
      skills: [
        {
          name: "Turning the Mind",
          slug: "interpersonal/turning-the-mind",
          description: "Moving from resistance to acceptance - A practice for willingness",
          icon: "🔄",
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

          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">Coping Skills Library</h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl">
            Learn evidence-based skills from DBT and ACT to manage urges, emotions, and challenging situations in the
            moment. Practice regularly to build resilience.
          </p>
        </div>

        {/* Skills by Category */}
        <div className="space-y-8">
          {skillCategories.map((category) => (
            <div key={category.category} className="space-y-4">
              <div className="border-l-4 border-primary pl-4">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">{category.category}</h2>
                <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {category.skills.map((skill) => (
                  <Link
                    key={skill.slug}
                    href={`/skills/${skill.slug}`}
                    className="block bg-card border border-border rounded-lg p-5 hover:border-primary hover:shadow-md transition-all group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">{skill.icon}</div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
                          {skill.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">{skill.description}</p>
                        <div className="mt-3 flex items-center text-xs text-primary font-medium">
                          Learn this skill
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

        <div className="mt-12 p-6 bg-primary/10 rounded-lg border border-primary/30">
          <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            Looking for deeper learning?
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Explore our Training Your Mind modules for frameworks that help reshape your thinking about relationships,
            acceptance, and problem-solving over time.
          </p>
          <Link href="/training" className="inline-flex items-center text-sm font-medium text-primary hover:underline">
            Browse Training Modules
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-8 p-6 bg-secondary/50 rounded-lg border border-border">
          <h3 className="font-semibold text-foreground mb-2">Building Your Skills</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Skills become more effective with practice. Start with one skill that resonates with you, practice it
            regularly, and gradually add more to your toolkit. Remember: progress over perfection.
          </p>
          <Link href="/dashboard" className="inline-flex items-center text-sm font-medium text-primary hover:underline">
            Return to Dashboard
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
