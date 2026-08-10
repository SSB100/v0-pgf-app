import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import SkillFeedback from "@/components/skills/skill-feedback"

export default async function TIPSkillPage() {
  const user = await getSession()
  if (!user) redirect("/auth/signin")

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-muted/50">
      <header className="bg-card/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
          <Button asChild variant="ghost" size="sm">
            <Link href="/dashboard">← Back to Dashboard</Link>
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-3 sm:px-4 py-6 space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-5xl">❄️</span>
              <div>
                <CardTitle className="text-2xl sm:text-3xl">TIP Skills</CardTitle>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Temperature, Intense Exercise, Paced Breathing
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">What are TIP Skills?</h3>
              <p className="text-foreground leading-relaxed">
                TIP skills are crisis survival techniques from DBT that help you quickly reduce intense emotions by
                changing your body chemistry. They're especially useful when emotions feel overwhelming and you need
                immediate relief.
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-secondary/50 rounded-lg p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="text-2xl">🧊</span>
                  <span>T - Temperature</span>
                </h4>
                <p className="text-sm text-foreground mb-3">
                  Cold water activates your body's "dive reflex," which slows your heart rate and helps calm intense
                  emotions quickly.
                </p>
                <ul className="text-sm space-y-1 list-disc list-inside text-foreground">
                  <li>Splash cold water on your face</li>
                  <li>Hold an ice pack to your face or neck for 30 seconds</li>
                  <li>Take a cold shower</li>
                </ul>
              </div>

              <div className="bg-secondary/50 rounded-lg p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="text-2xl">🏃</span>
                  <span>I - Intense Exercise</span>
                </h4>
                <p className="text-sm text-foreground mb-3">
                  Physical activity releases built-up tension and emotional energy, helping shift your body out of
                  crisis mode.
                </p>
                <ul className="text-sm space-y-1 list-disc list-inside text-foreground">
                  <li>Do jumping jacks or push-ups for 5-10 minutes</li>
                  <li>Go for a fast walk or run</li>
                  <li>Dance intensely to music</li>
                </ul>
              </div>

              <div className="bg-secondary/50 rounded-lg p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="text-2xl">🫁</span>
                  <span>P - Paced Breathing</span>
                </h4>
                <p className="text-sm text-foreground mb-3">
                  Slow, deep breathing activates your parasympathetic nervous system, which helps calm your body and
                  mind.
                </p>
                <ul className="text-sm space-y-1 list-disc list-inside text-foreground">
                  <li>Breathe in slowly for 5 counts</li>
                  <li>Breathe out slowly for 7 counts</li>
                  <li>Repeat for 3-5 minutes</li>
                </ul>
              </div>
            </div>

            <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
              <h3 className="font-semibold mb-2">When to Use TIP Skills</h3>
              <ul className="text-sm space-y-1 list-disc list-inside text-foreground">
                <li>When emotions feel overwhelming (intensity 7+)</li>
                <li>Before a strong urge to gamble</li>
                <li>During a panic attack or crisis moment</li>
                <li>When you need to calm down before using other skills</li>
              </ul>
            </div>

            <div className="flex gap-3 flex-col sm:flex-row">
              <Button asChild className="bg-primary hover:bg-primary/90 text-white flex-1">
                <Link href="/dashboard">Return to Dashboard</Link>
              </Button>
              <Button asChild variant="outline" className="flex-1 bg-transparent">
                <Link href="/skills">Browse More Skills</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <SkillFeedback skillSlug="tip" />
      </main>
    </div>
  )
}
