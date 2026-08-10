import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import SkillFeedback from "@/components/skills/skill-feedback"

export default async function RAINSkillPage() {
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
              <span className="text-5xl">🌧️</span>
              <div>
                <CardTitle className="text-2xl sm:text-3xl">RAIN Mindfulness</CardTitle>
                <p className="text-muted-foreground text-sm sm:text-base">Work with urges and triggers mindfully</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">What is RAIN?</h3>
              <p className="text-foreground leading-relaxed">
                RAIN is a mindfulness practice that helps you work with difficult emotions and urges without being
                controlled by them. It's rooted in both ACT (Acceptance and Commitment Therapy) and Buddhist psychology,
                teaching you to observe urges with compassion rather than fighting them.
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-secondary/50 rounded-lg p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="text-2xl">👁️</span>
                  <span>R - Recognize</span>
                </h4>
                <p className="text-sm text-foreground mb-2">
                  Acknowledge what's happening right now. Name the urge, emotion, or trigger without judgment.
                </p>
                <p className="text-sm text-muted-foreground italic">
                  "I'm noticing an urge to gamble. I'm feeling anxious and restless."
                </p>
              </div>

              <div className="bg-secondary/50 rounded-lg p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="text-2xl">🤝</span>
                  <span>A - Accept/Allow</span>
                </h4>
                <p className="text-sm text-foreground mb-2">
                  Let the experience be there without trying to push it away or fix it. Accept that urges are
                  uncomfortable but temporary.
                </p>
                <p className="text-sm text-muted-foreground italic">
                  "This urge is here, and that's okay. I don't have to act on it. I can make room for this discomfort."
                </p>
              </div>

              <div className="bg-secondary/50 rounded-lg p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="text-2xl">🔍</span>
                  <span>I - Investigate</span>
                </h4>
                <p className="text-sm text-foreground mb-2">
                  Get curious about the experience. Where do you feel it in your body? What thoughts are present?
                </p>
                <ul className="text-sm space-y-1 list-disc list-inside text-foreground">
                  <li>What sensations am I noticing? (tension, heat, tightness)</li>
                  <li>What thoughts are coming up?</li>
                  <li>What is this urge asking for? (relief, excitement, escape)</li>
                </ul>
              </div>

              <div className="bg-secondary/50 rounded-lg p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="text-2xl">🌱</span>
                  <span>N - Non-identify/Nurture</span>
                </h4>
                <p className="text-sm text-foreground mb-2">
                  Remember: You are not your urges. They're passing experiences, not who you are. Offer yourself
                  compassion.
                </p>
                <p className="text-sm text-muted-foreground italic">
                  "This urge is just a wave passing through me. I am the ocean, not the wave. I can ride this out with
                  kindness toward myself."
                </p>
              </div>
            </div>

            <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Why RAIN Works for Problem Gambling</h3>
              <p className="text-sm text-foreground mb-2">
                Instead of fighting urges (which often makes them stronger), RAIN teaches you to observe them with
                acceptance. Research shows that urges peak and naturally decrease if you don't act on them—usually
                within 20-30 minutes.
              </p>
              <p className="text-sm text-foreground">
                By practicing RAIN, you build the skill of "urge surfing"—riding out the wave of discomfort without
                being swept away by it.
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

        <SkillFeedback skillSlug="rain" />
      </main>
    </div>
  )
}
