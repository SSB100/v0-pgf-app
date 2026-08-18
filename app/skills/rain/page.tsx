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
          <Button asChild variant="ghost" size="sm"><Link href="/dashboard">← Back to Dashboard</Link></Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-3 sm:px-4 py-6 space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-5xl">🌧️</span>
              <div>
                <CardTitle className="text-2xl sm:text-3xl">RAIN Mindfulness</CardTitle>
                <p className="text-muted-foreground text-sm sm:text-base">A way to pause and notice difficult experiences</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">What is RAIN?</h3>
              <p className="text-foreground leading-relaxed">
                RAIN is a mindfulness-based reflection practice. It can help create a little space around an emotion,
                thought or urge so you can notice what is happening before deciding what to do next. It is a tool to
                experiment with, not a guarantee that distress or urges will disappear.
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-secondary/50 rounded-lg p-4"><h4 className="font-semibold mb-2">R — Recognise</h4><p className="text-sm text-foreground">Notice what is present and name it as simply as you can: an urge, emotion, thought or body sensation.</p></div>
              <div className="bg-secondary/50 rounded-lg p-4"><h4 className="font-semibold mb-2">A — Allow</h4><p className="text-sm text-foreground">If it feels safe to do so, let the experience be present for a moment without immediately trying to solve, suppress or obey it.</p></div>
              <div className="bg-secondary/50 rounded-lg p-4"><h4 className="font-semibold mb-2">I — Investigate</h4><p className="text-sm text-foreground mb-2">Get curious without interrogating yourself.</p><ul className="text-sm space-y-1 list-disc list-inside text-foreground"><li>What sensations am I noticing?</li><li>What thoughts or emotions are present?</li><li>What might I be needing right now: relief, connection, rest, stimulation or something else?</li></ul></div>
              <div className="bg-secondary/50 rounded-lg p-4"><h4 className="font-semibold mb-2">N — Nurture / Non-identify</h4><p className="text-sm text-foreground">Try to relate to the experience with some distance and kindness. An urge or thought is something you are experiencing; it does not define who you are or require you to act.</p></div>
            </div>

            <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Using RAIN with urges</h3>
              <p className="text-sm text-foreground mb-2">
                Urges often change in intensity over time. You might use RAIN to observe that change while also using practical safeguards,
                contacting someone you trust or stepping away from access to gambling, alcohol or another behaviour you are trying to change.
              </p>
              <p className="text-sm text-muted-foreground">
                If focusing inward makes you feel more distressed, unsafe or overwhelmed, stop the exercise and choose a grounding activity or seek support instead.
              </p>
            </div>

            <div className="flex gap-3 flex-col sm:flex-row">
              <Button asChild className="bg-primary hover:bg-primary/90 text-white flex-1"><Link href="/dashboard">Return to Dashboard</Link></Button>
              <Button asChild variant="outline" className="flex-1 bg-transparent"><Link href="/skills">Browse More Skills</Link></Button>
            </div>
          </CardContent>
        </Card>
        <SkillFeedback skillSlug="rain" />
      </main>
    </div>
  )
}
