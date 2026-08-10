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
                  Moving From Suffering to Psychological Agility
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-3">What is Reality Acceptance?</h3>
              <p className="text-foreground leading-relaxed mb-4">
                Acceptance of Reality means all the way, fully and whole heartedly 'Observing' then 'Describing' reality
                'As It Is'. The fighting stops: it's when the all-consuming effort to alter the facts of reality because
                of discomfort or dislike stops. We let go of resentment and practice gratitude. Total and complete
                acceptance with commitment.
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-secondary/50 rounded-lg p-4">
                <h4 className="font-semibold mb-3">Why Accept Reality?</h4>
                <p className="text-lg font-medium text-primary mb-2">The Answer is Simple, Because 'It Is'.</p>
                <p className="text-sm text-foreground mb-3">
                  No matter how much we may dislike 'What Is', our rejection of it does not change it.
                </p>
                <p className="text-sm text-foreground">
                  Our rejection of 'What Is' can cause pain to escalate into suffering, not allowing for effective
                  problem-solving if it is possible. This prevents us from moving forward in the face of life's
                  challenges.
                </p>
              </div>

              <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
                <h4 className="font-semibold mb-2 text-destructive">Acceptance of Reality is 'Not'...</h4>
                <ul className="text-sm space-y-2 list-disc list-inside text-foreground">
                  <li>Approval, compassion, being passive, being weak, against change or not problem-solving</li>
                  <li>
                    Thinking that if you accept painful events or situations you then approve of them, and that nothing
                    can or will change the present or future
                  </li>
                  <li>Being stuck in the 'Emotional Mind'</li>
                  <li>Demanding that life should or shouldn't be 'As It Is'</li>
                  <li>Believing generally that it's all unfair or a personal injustice</li>
                </ul>
              </div>

              <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                <h4 className="font-semibold mb-2">What Needs to Be Accepted?</h4>
                <ul className="text-sm space-y-2 list-disc list-inside text-foreground">
                  <li>Reality 'Is What It Is'</li>
                  <li>The facts about the past and present 'are' whether we like them or not</li>
                  <li>Everything has a cause, including situations that cause us pain</li>
                  <li>Life is worth living with painful events in it</li>
                </ul>
              </div>

              <div className="bg-secondary/50 rounded-lg p-4">
                <h4 className="font-semibold mb-3">Barriers to Acceptance</h4>
                <p className="text-sm text-foreground mb-2">
                  It is easy to accept things that happen in life that we enjoy, or which benefit us. However, it can be
                  very difficult to accept the not so good things, either those things that happened to us, aspects of
                  ourselves, or those that we care for.
                </p>
                <p className="text-sm text-foreground">
                  Not fully accepting something, with understanding that everything has a cause, can be a significant
                  barrier to change.
                </p>
              </div>

              <div className="bg-accent/50 rounded-lg p-4">
                <p className="text-sm font-medium text-foreground italic mb-2">
                  "The Curious Paradox is That When I Accept Myself Just 'As I Am', Then I Can Change"
                </p>
                <p className="text-xs text-muted-foreground text-right">- Carl Rogers</p>
              </div>

              <div className="bg-accent/50 rounded-lg p-4">
                <p className="text-sm font-medium text-foreground italic mb-2">
                  "Our Greatest Freedom is the Freedom to Choose Our Attitude."
                </p>
                <p className="text-xs text-muted-foreground text-right">- Viktor Frankl</p>
              </div>
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
