import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import SkillFeedback from "@/components/skills/skill-feedback"

export default async function STOPSkillPage() {
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
              <span className="text-5xl">🛑</span>
              <div>
                <CardTitle className="text-2xl sm:text-3xl">STOP Skill</CardTitle>
                <p className="text-muted-foreground text-sm sm:text-base">Pause before acting on impulses</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">What is the STOP Skill?</h3>
              <p className="text-foreground leading-relaxed">
                STOP is a DBT skill that helps you create space between an urge and your action. It's especially
                powerful when you're in "emotional mind" and about to do something you might regret, like gambling when
                triggered.
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-secondary/50 rounded-lg p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="text-2xl">🖐️</span>
                  <span>S - Stop</span>
                </h4>
                <p className="text-sm text-foreground">
                  Freeze. Don't move. Don't do anything. Just pause right where you are and resist the urge to act on
                  your impulse.
                </p>
              </div>

              <div className="bg-secondary/50 rounded-lg p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="text-2xl">👣</span>
                  <span>T - Take a Step Back</span>
                </h4>
                <p className="text-sm text-foreground mb-2">
                  Get some distance from the situation, both physically and mentally.
                </p>
                <ul className="text-sm space-y-1 list-disc list-inside text-foreground">
                  <li>Take a few deep breaths</li>
                  <li>Step away from the computer or phone</li>
                  <li>Count to 10 slowly</li>
                </ul>
              </div>

              <div className="bg-secondary/50 rounded-lg p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="text-2xl">👁️</span>
                  <span>O - Observe</span>
                </h4>
                <p className="text-sm text-foreground mb-2">
                  Notice what's happening inside and outside you without judgment.
                </p>
                <ul className="text-sm space-y-1 list-disc list-inside text-foreground">
                  <li>What emotion am I feeling right now?</li>
                  <li>What thoughts are going through my mind?</li>
                  <li>What triggered this urge?</li>
                  <li>What sensations do I notice in my body?</li>
                </ul>
              </div>

              <div className="bg-secondary/50 rounded-lg p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="text-2xl">🧭</span>
                  <span>P - Proceed Mindfully</span>
                </h4>
                <p className="text-sm text-foreground mb-2">
                  Ask yourself: What action would be most effective right now? What aligns with my values?
                </p>
                <ul className="text-sm space-y-1 list-disc list-inside text-foreground">
                  <li>Consider your goals and values</li>
                  <li>Think about consequences</li>
                  <li>Choose a wise mind action</li>
                  <li>Act in line with your long-term wellbeing</li>
                </ul>
              </div>
            </div>

            <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
              <h3 className="font-semibold mb-2">When to Use STOP</h3>
              <ul className="text-sm space-y-1 list-disc list-inside text-foreground">
                <li>When you feel a strong urge to gamble</li>
                <li>Before making an impulsive decision</li>
                <li>When you notice you're in emotional mind</li>
                <li>Anytime you need to pause and recenter</li>
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

        <SkillFeedback skillSlug="stop" />
      </main>
    </div>
  )
}
