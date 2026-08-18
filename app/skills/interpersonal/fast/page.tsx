import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { SkillFeedback } from "@/components/skills/skill-feedback"

export default async function FastPage() {
  const user = await getSession()
  if (!user) redirect("/auth/signin")

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-muted/50">
      <header className="bg-card/80 backdrop-blur-sm border-b border-border"><div className="max-w-4xl mx-auto px-3 sm:px-4 py-3 sm:py-4"><Button asChild variant="ghost" size="sm"><Link href="/skills">← Back to Skills</Link></Button></div></header>
      <main className="max-w-4xl mx-auto px-3 sm:px-4 py-6 space-y-6">
        <Card>
          <CardHeader><div className="flex items-center gap-3 mb-2"><span className="text-5xl">💎</span><div><CardTitle className="text-2xl sm:text-3xl">FAST</CardTitle><p className="text-muted-foreground text-sm sm:text-base">A DBT-informed framework for self-respect in communication</p></div></div><Badge variant="secondary" className="w-fit">Interpersonal Effectiveness</Badge></CardHeader>
          <CardContent className="space-y-6">
            <div><h3 className="font-semibold text-lg mb-3">What is FAST?</h3><p className="text-foreground leading-relaxed">FAST is a communication framework for situations where you want to look after your own values and self-respect while interacting with someone else. It is not a rule for how you must communicate, and safety takes priority over assertiveness.</p></div>

            <div className="space-y-4">
              <div className="bg-primary/10 border border-primary/30 rounded-lg p-5"><h4 className="font-semibold mb-2">F — Fair</h4><p className="text-sm text-foreground">Try to be fair to yourself and the other person. Both perspectives can matter even when you disagree.</p></div>
              <div className="bg-primary/10 border border-primary/30 rounded-lg p-5"><h4 className="font-semibold mb-2">A — Apologies when appropriate</h4><p className="text-sm text-foreground">Apologise when you believe you have caused harm or made a mistake. You do not need to apologise simply for having a need, opinion, boundary or different point of view.</p></div>
              <div className="bg-primary/10 border border-primary/30 rounded-lg p-5"><h4 className="font-semibold mb-2">S — Stick to your values</h4><p className="text-sm text-foreground">Keep what matters to you in view. If a situation puts your safety, integrity or important boundaries at risk, it may be more useful to step away or seek support than to continue the conversation.</p></div>
              <div className="bg-primary/10 border border-primary/30 rounded-lg p-5"><h4 className="font-semibold mb-2">T — Truthful</h4><p className="text-sm text-foreground">Aim for clear, accurate communication without exaggerating or minimising what is happening. You can be honest about uncertainty, fear or needing help.</p></div>
            </div>

            <div className="bg-secondary/50 rounded-lg p-4"><h4 className="font-semibold mb-3">When FAST may be useful</h4><ul className="text-sm space-y-2 list-disc list-inside text-foreground"><li>When you feel pressure to agree to something you do not want</li><li>When you are worried about over-apologising</li><li>When a decision conflicts with an important value or boundary</li><li>When you want to communicate honestly without attacking yourself or the other person</li></ul></div>

            <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4"><h4 className="font-semibold mb-2 text-destructive">Safety first</h4><p className="text-sm text-foreground">FAST is not intended to keep you in an unsafe, abusive or coercive conversation. You do not owe someone continued engagement, eye contact, explanation or negotiation when leaving or getting support is safer.</p></div>

            <div className="flex gap-3 flex-col sm:flex-row"><Button asChild className="bg-primary hover:bg-primary/90 text-white flex-1"><Link href="/dashboard">Return to Dashboard</Link></Button><Button asChild variant="outline" className="flex-1 bg-transparent"><Link href="/skills">Browse More Skills</Link></Button></div>
          </CardContent>
        </Card>
        <SkillFeedback skillName="FAST" />
      </main>
    </div>
  )
}
