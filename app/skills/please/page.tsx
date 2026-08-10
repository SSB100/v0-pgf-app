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
                  Taking Care of Your Mind by Taking Care of Your Body
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-3">What are PLEASE Skills?</h3>
              <p className="text-foreground leading-relaxed mb-4">
                PLEASE skills help you build resilience by addressing physical factors that affect emotional
                vulnerability. When your body is healthier, you're better equipped to manage emotional distress.
              </p>
              <p className="text-sm text-muted-foreground italic">
                Looking After You ~ Supporting Resilience while Minimising Vulnerabilities.
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-secondary/50 rounded-lg p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="text-2xl">💊</span>
                  <span>P - Treat Physical Illness</span>
                </h4>
                <p className="text-sm text-foreground">
                  Take care of and be kind to you. If you are feeling medically or physically unwell, see your doctor.
                  Take prescribed medication as set by your doctor.
                </p>
              </div>

              <div className="bg-secondary/50 rounded-lg p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="text-2xl">🍎</span>
                  <span>L - Balanced Eating</span>
                </h4>
                <p className="text-sm text-foreground mb-2">
                  Develop a nutritional plan; don't eat too much or too little.
                </p>
                <ul className="text-sm space-y-1 list-disc list-inside text-foreground">
                  <li>Eat regularly and mindfully throughout the day</li>
                  <li>Stay away from foods you know prompt an emotional uprising</li>
                  <li>Know and keep to your portion size</li>
                  <li>Stay hydrated</li>
                </ul>
              </div>

              <div className="bg-secondary/50 rounded-lg p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="text-2xl">🚫</span>
                  <span>E - Avoid Alcohol and Drugs</span>
                </h4>
                <p className="text-sm text-foreground">
                  Use medications as prescribed. Avoid mood-altering substances that can increase emotional
                  vulnerability.
                </p>
              </div>

              <div className="bg-secondary/50 rounded-lg p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="text-2xl">😴</span>
                  <span>A - Balanced Sleep</span>
                </h4>
                <p className="text-sm text-foreground mb-2">
                  Aim for between seven and nine hours of sleep a night, or at least a sleep schedule that enables you
                  feel rested and refreshed when you wake.
                </p>
                <ul className="text-sm space-y-1 list-disc list-inside text-foreground">
                  <li>Attempt to keep your sleep schedule consistent</li>
                  <li>If sleep is a problem for you, refer to the Sleep Hygiene Practice work sheet (pg.34)</li>
                </ul>
              </div>

              <div className="bg-secondary/50 rounded-lg p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="text-2xl">🏃</span>
                  <span>S - Get Exercise</span>
                </h4>
                <p className="text-sm text-foreground mb-2">
                  Do some sort of exercise every day; build up to at least 30-minutes daily.
                </p>
                <p className="text-xs text-muted-foreground italic">
                  Note: If you do have any medical concerns, please consult with your doctor prior to starting an
                  exercise program.
                </p>
              </div>

              <div className="bg-secondary/50 rounded-lg p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="text-2xl">💚</span>
                  <span>E - Get Exercise (Second E)</span>
                </h4>
                <p className="text-sm text-foreground">
                  The last E reminds us that exercise is so important, it appears twice! Regular physical activity
                  improves mood, reduces stress, and builds emotional resilience.
                </p>
              </div>
            </div>

            <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Why PLEASE Matters</h3>
              <p className="text-sm text-foreground mb-3">
                Physical self-care creates a foundation for emotional regulation. When you're physically depleted, sick,
                or exhausted, everything feels harder. PLEASE skills help you stay balanced.
              </p>
              <p className="text-sm font-medium text-primary">
                Remember: These are everyday skills to build resilience and minimize vulnerability. Practice them daily,
                not just in crisis.
              </p>
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

        <SkillFeedback skillSlug="please" />
      </main>
    </div>
  )
}
