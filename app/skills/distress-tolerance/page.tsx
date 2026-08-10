import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { SkillFeedback } from "@/components/skills/skill-feedback"

export default async function DistressTolerancePage() {
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
            <CardTitle className="text-2xl sm:text-3xl">Tolerating Life's Distress Effectively</CardTitle>
            <p className="text-muted-foreground text-sm">
              Getting Through Painful Experiences, Without Making It Worse
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-3">Goals of Tolerating Distress</h3>
              <div className="space-y-4">
                <div className="bg-secondary/50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2 text-primary">To Survive Crisis Situations</h4>
                  <p className="text-sm text-foreground">
                    Having the ability to manage a crisis and distressing situations without making it 'Worse'.
                  </p>
                </div>

                <div className="bg-secondary/50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2 text-primary">Accept Reality</h4>
                  <p className="text-sm text-foreground">
                    To move from being 'Stuck' in the 'Unwell Mind' and suffering, to regaining a sense of 'Wellbeing'.
                  </p>
                </div>

                <div className="bg-secondary/50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2 text-primary">Experience Freedom</h4>
                  <p className="text-sm text-foreground">
                    Having the ability to choose not to engage in unhelpful behaviour. No longer having to engage with
                    urges or intense emotions; to have the space to decide. 'Experience self-empowerment'.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-accent/50 rounded-lg p-4">
              <h3 className="font-semibold mb-3">Understanding Stress vs Distress</h3>
              <p className="text-sm text-foreground mb-3">
                Stress is a part of daily life, and a little stress can be of benefit to us. Stress can motivate us to
                get what is needed to be done, done.
              </p>
              <p className="text-sm text-foreground">
                Distress is a different beast; it can present through accumulative stress, when we struggle to
                effectively problem-solve, fight against reality, don't have a lifestyle that allows sufficient recovery
                time, or it can just overwhelm our capacity in a moment. Often the behaviours we wish to change have
                developed as a way of 'coping' with distress, however they also keep the distress cycle active with dire
                consequences to our 'Wellbeing'.
              </p>
            </div>

            <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
              <h3 className="font-semibold mb-3">Two Types of Skills</h3>
              <p className="text-sm text-foreground mb-3">
                The first two sets of skills in this module, 'STOP' and 'TIP', are for those moments in time when your
                'Emotional Mind' is taking control, becoming overwhelmed and distressed and at risk of the 'Auto-Pilot'
                taking control and lapsing back to old coping behaviour.
              </p>
              <p className="text-sm text-foreground mb-3">
                In these moments, the likelihood of engaging in the behaviour you are working hard to change is
                increased by the strong urges and intense emotions. Getting fast effective relief by using these skills
                is the answer. When you are calm enough, you can engage in practicing the other skills in this, and the
                other modules, and connect with your support.
              </p>
              <p className="text-sm text-foreground">
                The rest of the skills in this module are for improving general 'Wellbeing' over time when practiced
                daily, 'Decreasing Vulnerability' and 'Increasing Resilience'. Develop a daily structure by entering
                practice times in your 'Day Planner' to assist in ensuring you get the practice you need; you will see
                the benefits. <span className="font-semibold text-destructive">Remember</span> - to build resilience and
                to maintain change; continued practice is critical.
              </p>
            </div>

            <div className="flex gap-3 flex-col sm:flex-row">
              <Button asChild className="bg-primary hover:bg-primary/90 text-white flex-1">
                <Link href="/dashboard">Return to Dashboard</Link>
              </Button>
              <Button asChild variant="outline" className="flex-1 bg-transparent">
                <Link href="/skills">Browse Skills</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <SkillFeedback skillName="Distress Tolerance" />
      </main>
    </div>
  )
}
