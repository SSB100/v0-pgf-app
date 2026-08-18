import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export default async function TurningTheMindPage() {
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
              <span className="text-5xl">🔄</span>
              <div>
                <CardTitle className="text-2xl sm:text-3xl">Turning the Mind</CardTitle>
                <p className="text-muted-foreground text-sm sm:text-base">
                  A DBT-informed practice for repeatedly returning attention to what is workable now
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="w-fit">Acceptance skill</Badge>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">What is Turning the Mind?</h3>
              <p className="text-foreground leading-relaxed">
                Turning the Mind is the idea that acceptance is rarely a one-time decision. You may acknowledge a difficult reality and then notice yourself arguing with it again minutes later. The practice is simply to notice that shift and return to the facts and choices available to you.
              </p>
            </div>

            <div className="bg-secondary/50 rounded-lg p-4">
              <p className="text-sm text-foreground">
                Resistance can be understandable, especially after loss, harm, unfairness or a major change. This skill is not about blaming yourself for resisting or treating painful emotions as evidence that you are doing recovery incorrectly.
              </p>
            </div>

            <div className="bg-primary/10 border border-primary/30 rounded-lg p-5 space-y-3">
              <h3 className="font-semibold">A simple sequence</h3>
              <ol className="text-sm space-y-2 list-decimal pl-5 text-foreground">
                <li><strong>Notice.</strong> “I'm fighting with the fact that this happened / is happening.”</li>
                <li><strong>Name the facts.</strong> Describe what is known without adding blame or judgement.</li>
                <li><strong>Check safety and boundaries.</strong> Is there something that needs protection, support or practical action?</li>
                <li><strong>Choose again.</strong> Decide what you want to do with the part that is actually within your control.</li>
                <li><strong>Repeat when needed.</strong> Returning to acceptance many times is normal.</li>
              </ol>
            </div>

            <div className="bg-accent/50 rounded-lg p-4 space-y-2">
              <h4 className="font-semibold">Example</h4>
              <p className="text-sm text-foreground">
                “I wish this were different. It isn't different right now. I can still decide whether I need support, a boundary, a practical plan, or some time before I act.”
              </p>
            </div>

            <div className="border border-amber-500/30 bg-amber-500/5 rounded-lg p-4">
              <p className="text-sm text-foreground">
                <strong>Acceptance does not cancel action.</strong> Turning the Mind is not a reason to stay in danger, tolerate abuse, give up legal or complaint options, or stop trying to change something that can realistically be changed.
              </p>
            </div>

            <div className="flex gap-3 flex-col sm:flex-row">
              <Button asChild className="bg-primary hover:bg-primary/90 text-white flex-1"><Link href="/dashboard">Return to Dashboard</Link></Button>
              <Button asChild variant="outline" className="flex-1 bg-transparent"><Link href="/skills/reality-acceptance">Reality Acceptance</Link></Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
