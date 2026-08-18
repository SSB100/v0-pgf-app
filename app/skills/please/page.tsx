import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import SkillFeedback from "@/components/skills/skill-feedback"

export default async function PLEASESkillPage() {
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
              <span className="text-5xl">🌟</span>
              <div>
                <CardTitle className="text-2xl sm:text-3xl">PLEASE Skills</CardTitle>
                <p className="text-muted-foreground text-sm sm:text-base">
                  A DBT-informed reminder to look after physical factors that can affect emotional vulnerability
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-3">
              <p className="text-foreground leading-relaxed">
                Sleep, food, physical health, movement, medication and alcohol or other drug use can all affect how easy or difficult it feels to regulate emotions. This page is a self-care prompt, not a medical treatment plan.
              </p>
              <p className="text-sm text-muted-foreground">
                You do not need to do every item perfectly. Choose what is realistic and appropriate for your body, circumstances and goals.
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-secondary/50 rounded-lg p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2"><span className="text-2xl">💊</span><span>Attend to physical health</span></h4>
                <p className="text-sm text-foreground">
                  If you are unwell, injured or concerned about a health problem, consider appropriate medical care. Take prescribed medicines only as directed by your prescriber and do not start, stop or change medication because of Waypoint.
                </p>
              </div>

              <div className="bg-secondary/50 rounded-lg p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2"><span className="text-2xl">🍎</span><span>Regular food and hydration</span></h4>
                <p className="text-sm text-foreground">
                  Notice whether long gaps without food, dehydration or eating patterns are affecting your energy or mood. Aim for a routine that works for you rather than treating this as a diet or weight-control rule.
                </p>
              </div>

              <div className="bg-secondary/50 rounded-lg p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2"><span className="text-2xl">🍷</span><span>Alcohol and other substances</span></h4>
                <p className="text-sm text-foreground mb-2">
                  Alcohol and other substances can affect sleep, mood, judgement and urges. If changing your use is one of your goals, consider doing it with appropriate support.
                </p>
                <p className="text-sm text-foreground font-medium">
                  If you drink heavily, use substances regularly, or are concerned you may be dependent, do not make a sudden reduction or stop based only on this page. Withdrawal can require medical or addiction-service support.
                </p>
              </div>

              <div className="bg-secondary/50 rounded-lg p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2"><span className="text-2xl">😴</span><span>Sleep</span></h4>
                <p className="text-sm text-foreground">
                  Notice whether your current sleep routine is leaving you rested enough to function. If sleep problems are persistent, severe or connected with another health condition, consider discussing them with a healthcare professional rather than relying on a fixed sleep target from an app.
                </p>
              </div>

              <div className="bg-secondary/50 rounded-lg p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2"><span className="text-2xl">🏃</span><span>Movement</span></h4>
                <p className="text-sm text-foreground">
                  If movement helps you, choose an amount and intensity that suit your body and health. A short walk, stretching or another accessible activity can count. Stop if something feels unsafe or medically concerning.
                </p>
              </div>
            </div>

            <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Use this as a check-in, not a score</h3>
              <p className="text-sm text-foreground">
                The point is to notice factors that may be making today harder and identify one practical adjustment or support option. Completing these items does not measure recovery, resilience or mental health.
              </p>
            </div>

            <div className="flex gap-3 flex-col sm:flex-row">
              <Button asChild className="bg-primary hover:bg-primary/90 text-white flex-1"><Link href="/dashboard">Return to Dashboard</Link></Button>
              <Button asChild variant="outline" className="flex-1 bg-transparent"><Link href="/skills">Browse More Skills</Link></Button>
            </div>
          </CardContent>
        </Card>

        <SkillFeedback skillSlug="please" />
      </main>
    </div>
  )
}
