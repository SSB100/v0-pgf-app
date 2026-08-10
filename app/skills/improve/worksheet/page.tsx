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
          <Button asChild variant="ghost" size="sm">
            <Link href="/skills/improve">← Back to IMPROVE</Link>
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-3 sm:px-4 py-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl sm:text-3xl">IMPROVE Planning Worksheet</CardTitle>
            <p className="text-muted-foreground text-sm">
              Plan how you'll practice each IMPROVE skill in your daily life
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-secondary/50 rounded-lg p-4">
              <h3 className="font-semibold mb-3">How to Use This Worksheet</h3>
              <p className="text-sm text-foreground mb-3">
                For each letter in IMPROVE, write a specific plan for how you'll practice that skill. The example above
                shows one person's completed worksheet.
              </p>
              <ul className="text-sm space-y-2 list-disc list-inside text-foreground">
                <li>
                  <strong>Imagery:</strong> Describe your safe, peaceful place
                </li>
                <li>
                  <strong>Meaning:</strong> How will you find purpose and gratitude?
                </li>
                <li>
                  <strong>Planning:</strong> What daily routines will you establish?
                </li>
                <li>
                  <strong>Relaxing:</strong> What relaxation activities work for you?
                </li>
                <li>
                  <strong>One-Thing:</strong> How will you practice full presence?
                </li>
                <li>
                  <strong>Vacation:</strong> When will you schedule breaks?
                </li>
                <li>
                  <strong>Encouragement:</strong> How will you validate yourself?
                </li>
              </ul>
            </div>

            <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
              <p className="text-sm text-foreground font-medium">
                💡 Tip: Keep your worksheet somewhere you can see it daily. Review and adjust your plan as you discover
                what works best for you.
              </p>
            </div>

            <div className="flex gap-3 flex-col sm:flex-row">
              <Button asChild className="bg-primary hover:bg-primary/90 text-white flex-1">
                <Link href="/skills/improve">Back to IMPROVE Skill</Link>
              </Button>
              <Button asChild variant="outline" className="flex-1 bg-transparent">
                <Link href="/dashboard">Return to Dashboard</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
