import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import SkillFeedback from "@/components/skills/skill-feedback"

export default async function STOPSkillPage() {
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
            <div className="flex items-center gap-3 mb-2"><span className="text-5xl">🛑</span><div><CardTitle className="text-2xl sm:text-3xl">STOP Skill</CardTitle><p className="text-muted-foreground text-sm sm:text-base">Create a pause before deciding what to do</p></div></div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div><h3 className="font-semibold text-lg mb-2">What is STOP?</h3><p className="text-foreground leading-relaxed">STOP is a DBT-informed skill for moments when emotions or urges are strong. The aim is not to suppress what you are feeling. It is to create enough space to notice what is happening and choose your next step more deliberately.</p></div>

            <div className="space-y-4">
              <div className="bg-secondary/50 rounded-lg p-4"><h4 className="font-semibold mb-2">S — Stop</h4><p className="text-sm text-foreground">Pause the action if it is safe to do so. You do not have to make the next decision immediately.</p></div>
              <div className="bg-secondary/50 rounded-lg p-4"><h4 className="font-semibold mb-2">T — Take a step back</h4><p className="text-sm text-foreground mb-2">Create a little distance from the situation.</p><ul className="text-sm space-y-1 list-disc list-inside text-foreground"><li>Take a slower breath</li><li>Put down the phone or step away from the screen</li><li>Move to another room or a safer environment if that helps</li></ul></div>
              <div className="bg-secondary/50 rounded-lg p-4"><h4 className="font-semibold mb-2">O — Observe</h4><p className="text-sm text-foreground mb-2">Notice what is happening without grading yourself for it.</p><ul className="text-sm space-y-1 list-disc list-inside text-foreground"><li>What am I feeling?</li><li>What thoughts are present?</li><li>What happened just before this?</li><li>What does my body feel like?</li></ul></div>
              <div className="bg-secondary/50 rounded-lg p-4"><h4 className="font-semibold mb-2">P — Proceed mindfully</h4><p className="text-sm text-foreground">Choose the next action that seems most useful and safe. That might mean using another skill, leaving the situation, contacting someone, using a safeguard, or simply waiting a little longer before deciding.</p></div>
            </div>

            <div className="bg-primary/10 border border-primary/30 rounded-lg p-4"><h3 className="font-semibold mb-2">When STOP may be useful</h3><ul className="text-sm space-y-1 list-disc list-inside text-foreground"><li>When an urge feels strong</li><li>Before an impulsive decision</li><li>During a difficult conversation</li><li>When you notice you are reacting faster than you want to</li></ul><p className="text-sm text-muted-foreground mt-3">STOP is not a substitute for getting to safety. If there is immediate danger, prioritise leaving the situation and getting appropriate help.</p></div>

            <div className="flex gap-3 flex-col sm:flex-row"><Button asChild className="bg-primary hover:bg-primary/90 text-white flex-1"><Link href="/dashboard">Return to Dashboard</Link></Button><Button asChild variant="outline" className="flex-1 bg-transparent"><Link href="/skills">Browse More Skills</Link></Button></div>
          </CardContent>
        </Card>
        <SkillFeedback skillSlug="stop" />
      </main>
    </div>
  )
}
