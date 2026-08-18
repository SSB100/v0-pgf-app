import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function IMPROVEWorksheetPage() {
  const user = await getSession()
  if (!user) redirect("/auth/signin")

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-muted/50">
      <header className="bg-card/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
          <Button asChild variant="ghost" size="sm"><Link href="/skills/improve">← Back to IMPROVE</Link></Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-3 sm:px-4 py-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl sm:text-3xl">IMPROVE Planning Worksheet</CardTitle>
            <p className="text-muted-foreground text-sm">Build a small set of options you can return to during difficult moments</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-secondary/50 rounded-lg p-4">
              <h3 className="font-semibold mb-3">How to use this worksheet</h3>
              <p className="text-sm text-foreground mb-3">
                You do not need a plan for every letter. Choose the ideas that feel realistic and safe for you, and change them as you learn what is useful.
              </p>
              <ul className="text-sm space-y-2 list-disc list-inside text-foreground">
                <li><strong>Imagery:</strong> Is there an image, memory or place that feels steady or comforting?</li>
                <li><strong>Meaning:</strong> Is there a value or purpose that helps guide your next step?</li>
                <li><strong>Purposeful activity:</strong> What small activity can give the moment some structure?</li>
                <li><strong>Relaxation:</strong> What helps your body settle?</li>
                <li><strong>One thing:</strong> What is the next small thing to focus on?</li>
                <li><strong>Vacation:</strong> What brief, intentional break could help?</li>
                <li><strong>Encouragement:</strong> What realistic, supportive words could you use with yourself?</li>
              </ul>
            </div>

            <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
              <p className="text-sm text-foreground font-medium">
                Tip: Keep only the strategies that actually help. If an exercise makes you feel more distressed or unsafe, stop and choose another option or seek support.
              </p>
            </div>

            <div className="flex gap-3 flex-col sm:flex-row">
              <Button asChild className="bg-primary hover:bg-primary/90 text-white flex-1"><Link href="/skills/improve">Back to IMPROVE Skill</Link></Button>
              <Button asChild variant="outline" className="flex-1 bg-transparent"><Link href="/dashboard">Return to Dashboard</Link></Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
