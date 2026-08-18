import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { SkillFeedback } from "@/components/skills/skill-feedback"

export default async function WillingnessPage() {
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
              <span className="text-5xl">🌱</span>
              <div>
                <CardTitle className="text-2xl sm:text-3xl">Willingness</CardTitle>
                <p className="text-muted-foreground text-sm sm:text-base">A DBT-informed way to notice resistance without judging yourself</p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">What does willingness mean here?</h3>
              <p className="text-foreground leading-relaxed">
                Willingness means being open to doing what is workable in the situation you are actually in, especially when that action lines up with your values. It does not mean agreeing with everything, liking discomfort, or forcing yourself to accept harm.
              </p>
            </div>

            <div className="bg-secondary/50 rounded-lg p-4 space-y-3">
              <h4 className="font-semibold">Resistance is not a character flaw</h4>
              <p className="text-sm text-foreground">
                People naturally resist situations that feel painful, unfair, frightening or exhausting. You may notice thoughts such as “I don't want this,” “this shouldn't be happening,” or “I can't deal with this right now.” The aim is to notice those reactions rather than label yourself as difficult, weak or unwilling.
              </p>
            </div>

            <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 space-y-3">
              <h4 className="font-semibold">A willingness check-in</h4>
              <ul className="text-sm space-y-2 list-disc pl-5 text-foreground">
                <li>What facts can I identify about the situation right now?</li>
                <li>What am I feeling or wanting to avoid?</li>
                <li>Is there a genuine safety, boundary or practical problem that needs action?</li>
                <li>What is one action available to me that fits my values or helps the situation?</li>
                <li>Do I need support rather than trying to handle this alone?</li>
              </ul>
            </div>

            <div className="border border-amber-500/30 bg-amber-500/5 rounded-lg p-4">
              <p className="text-sm text-foreground">
                <strong>Willingness is not compliance.</strong> It does not require staying in an unsafe relationship or environment, tolerating abuse, abandoning a complaint, or doing what another person wants. Sometimes the most effective action is to leave, set a boundary, seek help or challenge something that can be changed.
              </p>
            </div>

            <div className="bg-accent/50 rounded-lg p-4">
              <p className="text-sm text-foreground">
                If you notice yourself stuck between “I hate that this is happening” and “I have to pretend I'm okay with it,” try a middle position: “I don't like this, and this is what I am dealing with right now. What can I do next?”
              </p>
            </div>

            <div className="flex gap-3 flex-col sm:flex-row">
              <Button asChild className="bg-primary hover:bg-primary/90 text-white flex-1"><Link href="/dashboard">Return to Dashboard</Link></Button>
              <Button asChild variant="outline" className="flex-1 bg-transparent"><Link href="/skills/reality-acceptance">← Reality Acceptance</Link></Button>
            </div>
          </CardContent>
        </Card>

        <SkillFeedback skillName="Willingness" />
      </main>
    </div>
  )
}
