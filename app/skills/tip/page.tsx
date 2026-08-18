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
                  Temperature, brief physical activity and paced breathing
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">What are TIP skills?</h3>
              <p className="text-foreground leading-relaxed">
                TIP is a DBT distress-tolerance approach that uses changes in body state to help some people reduce very high arousal long enough to choose what to do next. It is a coping skill, not medical treatment or emergency care.
              </p>
            </div>

            <div className="border border-amber-500/30 bg-amber-500/5 rounded-lg p-4">
              <p className="text-sm text-foreground">
                <strong>Use the physical parts cautiously.</strong> Cold exposure and intense exercise can affect heart rate and circulation and are not suitable for everyone. If you have heart problems or another medical condition that could make these unsafe, use a gentler option such as paced breathing and check with a clinician before trying the temperature or intense-exercise parts.
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-secondary/50 rounded-lg p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2"><span className="text-2xl">🧊</span><span>T - Temperature</span></h4>
                <p className="text-sm text-foreground mb-3">
                  A brief cool sensation can help shift attention and body arousal for some people. Keep it mild and stop if you feel dizzy, faint, painful or unwell.
                </p>
                <ul className="text-sm space-y-1 list-disc pl-5 text-foreground">
                  <li>Splash cool water on your face.</li>
                  <li>Hold a wrapped cool pack against your cheeks for a short period.</li>
                  <li>Skip this part if cold exposure is not safe or comfortable for you.</li>
                </ul>
              </div>

              <div className="bg-secondary/50 rounded-lg p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2"><span className="text-2xl">🏃</span><span>I - Intense or Brisk Movement</span></h4>
                <p className="text-sm text-foreground mb-3">
                  Brief movement can help discharge physical tension. Choose an intensity that is appropriate for your body rather than pushing through pain or medical symptoms.
                </p>
                <ul className="text-sm space-y-1 list-disc pl-5 text-foreground">
                  <li>Try a brisk walk, a short set of comfortable body-weight movements, or energetic dancing.</li>
                  <li>Stop if you feel chest pain, faintness, unusual shortness of breath or another concerning symptom.</li>
                </ul>
              </div>

              <div className="bg-secondary/50 rounded-lg p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2"><span className="text-2xl">🫁</span><span>P - Paced Breathing</span></h4>
                <p className="text-sm text-foreground mb-3">
                  Slow your breathing gently, with a slightly longer exhale than inhale if that feels comfortable. Do not force a breath-hold or a pace that makes you light-headed.
                </p>
                <ul className="text-sm space-y-1 list-disc pl-5 text-foreground">
                  <li>Let your breathing settle into a slower rhythm.</li>
                  <li>Keep the breath comfortable rather than trying to hit an exact count.</li>
                  <li>Return to normal breathing if you feel dizzy or uncomfortable.</li>
                </ul>
              </div>
            </div>

            <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
              <h3 className="font-semibold mb-2">When might this be useful?</h3>
              <ul className="text-sm space-y-1 list-disc pl-5 text-foreground">
                <li>When emotion or an urge feels unusually intense.</li>
                <li>When you want a short pause before choosing another coping strategy.</li>
                <li>When you are physically safe and the technique itself is appropriate for you.</li>
              </ul>
              <p className="text-xs text-muted-foreground mt-3">
                If you or someone else is in immediate danger, use emergency or crisis support rather than relying on a Waypoint skill.
              </p>
            </div>

            <div className="flex gap-3 flex-col sm:flex-row">
              <Button asChild className="bg-primary hover:bg-primary/90 text-white flex-1"><Link href="/dashboard">Return to Dashboard</Link></Button>
              <Button asChild variant="outline" className="flex-1 bg-transparent"><Link href="/skills">Browse More Skills</Link></Button>
            </div>
          </CardContent>
        </Card>

        <SkillFeedback skillSlug="tip" />
      </main>
    </div>
  )
}
