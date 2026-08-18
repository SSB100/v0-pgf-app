import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { SkillFeedback } from "@/components/skills/skill-feedback"

export default async function IMPROVESkillPage() {
  const user = await getSession()
  if (!user) redirect("/auth/signin")

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-muted/50">
      <header className="bg-card/80 backdrop-blur-sm border-b border-border"><div className="max-w-4xl mx-auto px-3 sm:px-4 py-3 sm:py-4"><Button asChild variant="ghost" size="sm"><Link href="/skills">← Back to Skills</Link></Button></div></header>
      <main className="max-w-4xl mx-auto px-3 sm:px-4 py-6 space-y-6">
        <Card>
          <CardHeader><div className="flex items-center gap-3 mb-2"><span className="text-5xl">✨</span><div><CardTitle className="text-2xl sm:text-3xl">IMPROVE the Moment</CardTitle><p className="text-muted-foreground text-sm sm:text-base">Options for making a difficult moment a little more manageable</p></div></div></CardHeader>
          <CardContent className="space-y-6">
            <div><h3 className="font-semibold text-lg mb-3">What is IMPROVE?</h3><p className="text-foreground leading-relaxed">IMPROVE is a DBT-informed distress-tolerance framework. It offers several different ways to respond to a difficult moment. You do not need to use every part, and a strategy that helps one day may not help another.</p></div>

            <div className="space-y-4">
              <div className="bg-secondary/50 rounded-lg p-4"><h4 className="font-semibold mb-2">I — Imagery</h4><p className="text-sm text-foreground">Bring to mind a place, image or memory that feels steady or comforting. If imagery is uncomfortable or brings up difficult memories, skip this option.</p></div>
              <div className="bg-secondary/50 rounded-lg p-4"><h4 className="font-semibold mb-2">M — Meaning</h4><p className="text-sm text-foreground">If it feels useful, consider what matters to you in this moment or what value you want to bring to your next step. You do not need to find a lesson or positive meaning in painful events.</p></div>
              <div className="bg-secondary/50 rounded-lg p-4"><h4 className="font-semibold mb-2">P — Purposeful activity</h4><p className="text-sm text-foreground">Choose one manageable activity that gives the moment some structure: a small task, something creative, movement, or time with another person.</p></div>
              <div className="bg-secondary/50 rounded-lg p-4"><h4 className="font-semibold mb-2">R — Relaxation</h4><p className="text-sm text-foreground">Try an activity that helps your body settle, such as a slower breath, stretching, a warm drink, music or a short walk.</p></div>
              <div className="bg-secondary/50 rounded-lg p-4"><h4 className="font-semibold mb-2">O — One thing at a time</h4><p className="text-sm text-foreground">Narrow your attention to the next small thing rather than solving everything at once.</p></div>
              <div className="bg-secondary/50 rounded-lg p-4"><h4 className="font-semibold mb-2">V — Vacation</h4><p className="text-sm text-foreground">Take a brief, intentional break from demands where possible. A short break can be useful without requiring you to abandon important responsibilities or avoid a safety issue that needs action.</p></div>
              <div className="bg-secondary/50 rounded-lg p-4"><h4 className="font-semibold mb-2">E — Encouragement</h4><p className="text-sm text-foreground">Use language with yourself that is realistic and supportive, such as “This is difficult, and I can focus on the next step” or “I can ask for help with this.”</p></div>
            </div>

            <div className="bg-primary/10 border border-primary/30 rounded-lg p-4"><h3 className="font-semibold mb-2">Build a personal set of options</h3><p className="text-sm text-foreground mb-3">Rather than forcing daily practice, notice which options are useful for you and keep a few available for harder moments.</p><Link href="/skills/improve/worksheet" className="inline-flex items-center text-sm font-medium text-primary hover:underline">Open planning worksheet →</Link></div>

            <div className="flex gap-3 flex-col sm:flex-row"><Button asChild className="bg-primary hover:bg-primary/90 text-white flex-1"><Link href="/dashboard">Return to Dashboard</Link></Button><Button asChild variant="outline" className="flex-1 bg-transparent"><Link href="/skills">Browse More Skills</Link></Button></div>
          </CardContent>
        </Card>
        <SkillFeedback skillName="IMPROVE" />
      </main>
    </div>
  )
}
