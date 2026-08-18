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
            <CardTitle className="text-2xl sm:text-3xl">Distress Tolerance</CardTitle>
            <p className="text-muted-foreground text-sm">
              DBT-informed skills for getting through difficult moments without automatically acting on an urge
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">What is distress tolerance?</h3>
              <p className="text-sm text-foreground leading-relaxed">
                Distress tolerance is the practice of making room for uncomfortable feelings, thoughts or urges long enough to choose your next action. It does not mean liking the situation, suppressing emotion, or proving that you can cope without help.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="bg-secondary/50 rounded-lg p-4">
                <h4 className="font-semibold mb-2 text-primary">Short-term skills</h4>
                <p className="text-sm text-foreground">
                  Skills such as STOP, paced breathing, grounding or an appropriate TIP technique can create a pause when arousal or an urge feels very strong.
                </p>
              </div>

              <div className="bg-secondary/50 rounded-lg p-4">
                <h4 className="font-semibold mb-2 text-primary">Longer-term support</h4>
                <p className="text-sm text-foreground">
                  Sleep, routines, relationships, professional support, practical safeguards and problem-solving may reduce how often difficult moments become overwhelming.
                </p>
              </div>
            </div>

            <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 space-y-3">
              <h3 className="font-semibold">A useful sequence</h3>
              <ol className="text-sm list-decimal pl-5 space-y-2 text-foreground">
                <li>Notice what is happening in your body, thoughts and urges.</li>
                <li>Check whether there is an immediate safety issue that needs practical action or outside help.</li>
                <li>If you are safe, choose a short-term skill that fits the situation.</li>
                <li>When the intensity has shifted enough, decide what support, boundary or problem-solving step comes next.</li>
              </ol>
            </div>

            <div className="border border-amber-500/30 bg-amber-500/5 rounded-lg p-4">
              <p className="text-sm text-foreground">
                <strong>Distress tolerance is not emergency care.</strong> If you or someone else is in immediate danger, or you need urgent medical or mental-health help, use the Support page or emergency services rather than relying on a Waypoint skill.
              </p>
            </div>

            <p className="text-sm text-muted-foreground">
              There is no requirement to practise every skill or to use a skill perfectly. The goal is to build options, not to turn coping into another pass-or-fail task.
            </p>

            <div className="flex gap-3 flex-col sm:flex-row">
              <Button asChild className="bg-primary hover:bg-primary/90 text-white flex-1"><Link href="/dashboard">Return to Dashboard</Link></Button>
              <Button asChild variant="outline" className="flex-1 bg-transparent"><Link href="/skills">Browse Skills</Link></Button>
            </div>
          </CardContent>
        </Card>

        <SkillFeedback skillName="Distress Tolerance" />
      </main>
    </div>
  )
}
