import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { SkillFeedback } from "@/components/skills/skill-feedback"

export default async function OppositeActionPage() {
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
              <span className="text-5xl">↔️</span>
              <div>
                <CardTitle className="text-2xl sm:text-3xl">Opposite Action</CardTitle>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Change emotions by acting opposite to urges
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">What is Opposite Action?</h3>
              <p className="text-foreground leading-relaxed">
                Opposite Action is a DBT emotion regulation skill where you do the opposite of what your emotion is
                urging you to do, but only when that urge doesn't fit the facts of the situation. This powerful
                technique helps you change unwanted emotions by changing your behavior first.
              </p>
            </div>

            <div className="bg-secondary/50 rounded-lg p-4">
              <h3 className="font-semibold mb-3">How It Works</h3>
              <p className="text-sm text-foreground mb-3">
                Our emotions come with "action urges": things they make us want to do. Sometimes these urges help us
                (like running from danger), but often with problem gambling, our emotional urges lead us away from our
                values.
              </p>
              <p className="text-sm text-foreground">
                By acting opposite to the urge, you send your brain a different message, which actually changes the
                emotion itself over time.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Common Scenarios for Problem Gambling</h3>

              <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Boredom → Urge to gamble for excitement</h4>
                <p className="text-sm text-foreground mb-2">
                  <strong>Opposite Action:</strong>
                </p>
                <ul className="text-sm space-y-1 list-disc list-inside text-foreground">
                  <li>Engage in a different activity that brings meaning or joy</li>
                  <li>Connect with someone you care about</li>
                  <li>Work on a personal project or hobby</li>
                  <li>Do something that aligns with your values</li>
                </ul>
              </div>

              <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Shame → Urge to isolate or escape through gambling</h4>
                <p className="text-sm text-foreground mb-2">
                  <strong>Opposite Action:</strong>
                </p>
                <ul className="text-sm space-y-1 list-disc list-inside text-foreground">
                  <li>Reach out to a supportive friend or peer</li>
                  <li>Practice self-compassion instead of self-criticism</li>
                  <li>Do something that makes you feel capable or accomplished</li>
                  <li>Remind yourself of your values and progress</li>
                </ul>
              </div>

              <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Anxiety → Urge to gamble to relieve tension</h4>
                <p className="text-sm text-foreground mb-2">
                  <strong>Opposite Action:</strong>
                </p>
                <ul className="text-sm space-y-1 list-disc list-inside text-foreground">
                  <li>Approach the situation you're avoiding instead of escaping</li>
                  <li>Use TIP skills to calm your body</li>
                  <li>Do gentle, grounding activities like walking or stretching</li>
                  <li>Talk through your worries with someone</li>
                </ul>
              </div>
            </div>

            <div className="bg-secondary/50 rounded-lg p-4">
              <h3 className="font-semibold mb-2">When to Use Opposite Action</h3>
              <ul className="text-sm space-y-2 text-foreground">
                <li>
                  <strong>✓ Use it when:</strong> Your emotion doesn't fit the facts, is too intense for the situation,
                  or acting on it would hurt your long-term goals
                </li>
                <li>
                  <strong>✗ Don't use it when:</strong> Your emotion fits the facts and acting on it is effective (like
                  fear that keeps you safe)
                </li>
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

        <SkillFeedback skillName="Opposite Action" />
      </main>
    </div>
  )
}
