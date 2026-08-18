import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { SkillFeedback } from "@/components/skills/skill-feedback"

export default async function RealityAcceptancePage() {
  const user = await getSession()
  if (!user) redirect("/auth/signin")

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-muted/50">
      <header className="bg-card/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
          <Button asChild variant="ghost" size="sm">
            <Link href="/skills">← Back to Skills</Link>
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-3 sm:px-4 py-6 space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-5xl">🧘</span>
              <div>
                <CardTitle className="text-2xl sm:text-3xl">Reality Acceptance</CardTitle>
                <p className="text-muted-foreground text-sm sm:text-base">
                  A DBT-informed way to notice what is true right now and choose what you can do next
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">What does acceptance mean here?</h3>
              <p className="text-foreground leading-relaxed">
                Reality acceptance means acknowledging facts that are already true or cannot be changed in this moment.
                The aim is not to force yourself to feel okay about what happened. It is to spend less energy arguing with
                an unchangeable fact so you have more room to decide what matters now.
              </p>
              <p className="text-sm text-muted-foreground">
                You can practise this with a neutral or hypothetical example. You do not need to revisit a traumatic or unsafe situation to use this skill.
              </p>
            </div>

            <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
              <h4 className="font-semibold mb-2 text-destructive">Acceptance does not mean...</h4>
              <ul className="text-sm space-y-2 list-disc pl-5 text-foreground">
                <li>approving of harm, abuse, injustice or another person's behaviour;</li>
                <li>forgiving someone, dropping boundaries or giving up your right to seek help or accountability;</li>
                <li>blaming yourself for something that happened to you;</li>
                <li>remaining in a situation that is unsafe;</li>
                <li>giving up on changes that are still possible.</li>
              </ul>
            </div>

            <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 space-y-3">
              <h4 className="font-semibold">A simple way to practise</h4>
              <ol className="text-sm space-y-2 list-decimal pl-5 text-foreground">
                <li><strong>Name the facts.</strong> Describe what is known without adding blame or judgement.</li>
                <li><strong>Notice the reaction.</strong> What thoughts, feelings or body sensations show up?</li>
                <li><strong>Separate what is fixed from what is changeable.</strong> Some parts may be in the past while other choices remain open now.</li>
                <li><strong>Choose the next useful action.</strong> That might be asking for support, setting a boundary, solving a practical problem, resting, or doing nothing immediately.</li>
              </ol>
            </div>

            <div className="bg-secondary/50 rounded-lg p-4 space-y-2">
              <h4 className="font-semibold">Example</h4>
              <p className="text-sm text-foreground">
                “I cannot change that this happened. I do not have to approve of it. I can decide what support, boundary or action is useful for me now.”
              </p>
            </div>

            <div className="border border-amber-500/30 bg-amber-500/5 rounded-lg p-4">
              <p className="text-sm text-foreground">
                <strong>Safety comes first.</strong> If a situation involves violence, coercion, abuse, exploitation or immediate danger, acceptance is not a reason to stay in it or confront someone. Use appropriate support or emergency services instead.
              </p>
            </div>

            <div className="flex gap-3 flex-col sm:flex-row">
              <Button asChild className="bg-primary hover:bg-primary/90 text-white flex-1">
                <Link href="/dashboard">Return to Dashboard</Link>
              </Button>
              <Button asChild variant="outline" className="flex-1 bg-transparent">
                <Link href="/skills/willingness">Learn About Willingness →</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <SkillFeedback skillName="Reality Acceptance" />
      </main>
    </div>
  )
}
