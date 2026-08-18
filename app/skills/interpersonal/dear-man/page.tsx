import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { SkillFeedback } from "@/components/skills/skill-feedback"

export default async function DearManPage() {
  const user = await getSession()
  if (!user) redirect("/auth/signin")

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-muted/50">
      <header className="bg-card/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
          <Button asChild variant="ghost" size="sm"><Link href="/skills">← Back to Skills</Link></Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-3 sm:px-4 py-6 space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-5xl">🎯</span>
              <div>
                <CardTitle className="text-2xl sm:text-3xl">DEAR MAN</CardTitle>
                <p className="text-muted-foreground text-sm sm:text-base">A DBT interpersonal-effectiveness framework for clear requests and boundaries</p>
              </div>
            </div>
            <Badge variant="secondary" className="w-fit">Interpersonal Effectiveness</Badge>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">What is DEAR MAN?</h3>
              <p className="text-foreground leading-relaxed">
                DEAR MAN is a structure for preparing a request, saying no, or discussing a boundary. It can help you organise what you want to say, but it cannot guarantee how another person will respond.
              </p>
            </div>

            <div className="bg-primary/10 border border-primary/30 rounded-lg p-5 space-y-4">
              <h4 className="font-semibold text-lg">The steps</h4>
              <div className="grid gap-3 text-sm text-foreground">
                <div><strong>D — Describe:</strong> State the relevant facts without insults or assumptions about motives.</div>
                <div><strong>E — Express:</strong> Say how the situation affects you, using your own perspective.</div>
                <div><strong>A — Assert:</strong> Make the request or boundary clear and specific.</div>
                <div><strong>R — Reinforce:</strong> Explain why the request or boundary could be useful, without threatening or manipulating.</div>
                <div><strong>M — Mindful:</strong> Stay with the main issue rather than getting pulled into unrelated arguments.</div>
                <div><strong>A — Appear confident:</strong> Communicate as steadily as you can. You do not need eye contact or a particular posture to be valid.</div>
                <div><strong>N — Negotiate:</strong> Consider alternatives only if they still respect your safety, limits and core needs.</div>
              </div>
            </div>

            <div className="bg-secondary/50 rounded-lg p-4 space-y-3">
              <h4 className="font-semibold">Example</h4>
              <p className="text-sm text-foreground"><strong>D:</strong> “We've talked about borrowing money several times this month.”</p>
              <p className="text-sm text-foreground"><strong>E:</strong> “I'm feeling stressed about my own finances.”</p>
              <p className="text-sm text-foreground"><strong>A:</strong> “I'm not able to lend money.”</p>
              <p className="text-sm text-foreground"><strong>R:</strong> “Keeping that boundary helps me manage my finances and keeps money from becoming a bigger issue between us.”</p>
              <p className="text-sm text-foreground"><strong>M/A/N:</strong> Repeat the boundary calmly if useful, and offer another option only if you genuinely want to.</p>
            </div>

            <div className="border border-amber-500/30 bg-amber-500/5 rounded-lg p-4 space-y-2">
              <h4 className="font-semibold">Safety overrides the script</h4>
              <p className="text-sm text-foreground">
                If someone threatens you, becomes violent, controls your movements or money, or you think asserting a boundary could put you at risk, do not keep repeating the script simply because DEAR MAN says to stay on topic. Prioritise getting to safety, ending the interaction, and contacting appropriate support.
              </p>
              <p className="text-sm text-foreground">
                You are responsible for communicating your needs as safely as you can, not for making another person respond respectfully.
              </p>
            </div>

            <div className="bg-accent/50 rounded-lg p-4">
              <p className="text-sm text-foreground">
                A useful version can be brief: “This is what happened. This is how it affects me. This is what I am asking for. If that is not possible, here is what I will do to look after my boundary.”
              </p>
            </div>

            <div className="flex gap-3 flex-col sm:flex-row">
              <Button asChild className="bg-primary hover:bg-primary/90 text-white flex-1"><Link href="/dashboard">Return to Dashboard</Link></Button>
              <Button asChild variant="outline" className="flex-1 bg-transparent"><Link href="/skills">Back to Skills Library</Link></Button>
            </div>
          </CardContent>
        </Card>

        <SkillFeedback skillName="DEAR MAN" />
      </main>
    </div>
  )
}
