import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function TrainingCard() {
  const featuredModules = [
    {
      name: "DEAR MAN",
      icon: "🎯",
      description: "Get your needs met effectively",
      link: "/skills/interpersonal/dear-man",
    },
    {
      name: "Reality Acceptance",
      icon: "🧘",
      description: "Move from resistance to growth",
      link: "/skills/reality-acceptance",
    },
    {
      name: "Problem Solving",
      icon: "🧩",
      description: "Break cycles with structure",
      link: "/skills/interpersonal/problem-solving",
    },
  ]

  return (
    <Card className="soft-shadow border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg sm:text-xl text-foreground flex items-center gap-2">
          <svg className="w-5 h-5 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          <span>Training Your Mind</span>
        </CardTitle>
        <p className="text-xs sm:text-sm text-muted-foreground">Learn frameworks that reshape thinking over time</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          {featuredModules.map((module) => (
            <Link
              key={module.name}
              href={module.link}
              className="p-4 bg-secondary/50 rounded-lg border border-border hover:border-primary/50 transition-all group"
            >
              <div className="text-3xl mb-2">{module.icon}</div>
              <h4 className="font-semibold text-foreground text-sm mb-1 group-hover:text-primary transition-colors">
                {module.name}
              </h4>
              <p className="text-xs text-muted-foreground">{module.description}</p>
            </Link>
          ))}
        </div>
        <Button asChild variant="outline" className="w-full bg-transparent">
          <Link href="/training">View All Training Modules</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
