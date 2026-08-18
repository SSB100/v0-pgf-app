import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { SkillFeedback } from "@/components/skills/skill-feedback"

export default async function GivePage() {
  const user = await getSession()
  if (!user) redirect("/auth/signin")

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-muted/50">
      <header className="bg-card/80 backdrop-blur-sm border-b border-border"><div className="max-w-4xl mx-auto px-3 sm:px-4 py-3 sm:py-4"><Button asChild variant="ghost" size="sm"><Link href="/skills">← Back to Skills</Link></Button></div></header>
      <main className="max-w-4xl mx-auto px-3 sm:px-4 py-6 space-y-6">
        <Card>
          <CardHeader><div className="flex items-center gap-3 mb-2"><span className="text-5xl">🤝</span><div><CardTitle className="text-2xl sm:text-3xl">GIVE</CardTitle><p className="text-muted-foreground text-sm sm:text-base">A DBT-informed framework for relationship-focused communication</p></div></div><Badge variant="secondary" className="w-fit">Interpersonal Effectiveness</Badge></CardHeader>
          <CardContent className="space-y-6">
            <div><h3 className="font-semibold text-lg mb-3">What is GIVE?</h3><p className="text-foreground leading-relaxed">GIVE offers four reminders for conversations where maintaining the relationship matters to you. It can support respectful communication, but it does not require you to preserve a relationship at the expense of your safety, boundaries or wellbeing.</p></div>

            <div className="space-y-4">
              <div className="bg-primary/10 border border-primary/30 rounded-lg p-5"><h4 className="font-semibold mb-2">G — Gentle</h4><p className="text-sm text-foreground">Try to avoid insults, threats, humiliation or deliberate guilt. You can still be direct and set a clear boundary.</p></div>
              <div className="bg-primary/10 border border-primary/30 rounded-lg p-5"><h4 className="font-semibold mb-2">I — Interested</h4><p className="text-sm text-foreground">If it is safe and useful, make space to hear the other person’s perspective. Listening does not mean agreeing, accepting blame or staying in a conversation you need to leave.</p></div>
              <div className="bg-primary/10 border border-primary/30 rounded-lg p-5"><h4 className="font-semibold mb-2">V — Validate</h4><p className="text-sm text-foreground">Acknowledge the part of their experience that makes sense to you without pretending something is acceptable when it is not. For example: “I can see this matters a lot to you, and my answer is still no.”</p></div>
              <div className="bg-primary/10 border border-primary/30 rounded-lg p-5"><h4 className="font-semibold mb-2">E — Easy manner</h4><p className="text-sm text-foreground">Where it fits naturally, keep your tone steady and reduce unnecessary intensity. Humour can help in some relationships, but it is optional and should not be used to dismiss someone’s feelings.</p></div>
            </div>

            <div className="bg-secondary/50 rounded-lg p-4"><h4 className="font-semibold mb-3">Balancing relationship goals</h4><p className="text-sm text-foreground">Sometimes the relationship matters and so do your own needs, safety and self-respect. GIVE is one option for balancing those things; it is not a requirement to keep another person comfortable or prevent them from feeling disappointed.</p></div>

            <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4"><h4 className="font-semibold mb-2 text-destructive">When not to prioritise relationship effectiveness</h4><p className="text-sm text-foreground">If there are threats, violence, coercive control, stalking or other safety concerns, focus on getting safe and seeking appropriate support. Communication skills are not a substitute for a safety plan.</p></div>

            <div className="flex gap-3 flex-col sm:flex-row"><Button asChild className="bg-primary hover:bg-primary/90 text-white flex-1"><Link href="/dashboard">Return to Dashboard</Link></Button><Button asChild variant="outline" className="flex-1 bg-transparent"><Link href="/skills">Browse More Skills</Link></Button></div>
          </CardContent>
        </Card>
        <SkillFeedback skillName="GIVE" />
      </main>
    </div>
  )
}
