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
      <header className="bg-card/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
          <Button asChild variant="ghost" size="sm">
            <Link href="/skills">← Back to Skills</Link>
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-3 sm:px-4 py-6 space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-5xl">✨</span>
              <div>
                <CardTitle className="text-2xl sm:text-3xl">IMPROVE the Moment</CardTitle>
                <p className="text-muted-foreground text-sm sm:text-base">Building Positive Experiences</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-3">What is IMPROVE?</h3>
              <p className="text-foreground leading-relaxed mb-4">
                IMPROVE skills help you make painful moments more tolerable by shifting your focus and creating positive
                experiences. These are the ACCEPTS, IMPROVE, and Reality Acceptance skills - everyday tools to build
                resilience and maintain wellbeing.
              </p>
              <p className="text-sm text-muted-foreground italic">
                Practice, Practice, Practice.... Remember - to build resilience and maintain change, continued practice
                is critical.
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-secondary/50 rounded-lg p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="text-2xl">🖼️</span>
                  <span>I - Imagery</span>
                </h4>
                <p className="text-sm text-foreground">
                  Create for yourself a place of pleasure, peace and joy in your mind. A place that is safe and serene.
                  Fully describe your place through your senses - what you see, what you feel (warmth or cool breeze),
                  what you smell or taste. Fully immerse yourself and be there.
                </p>
              </div>

              <div className="bg-secondary/50 rounded-lg p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="text-2xl">💡</span>
                  <span>M - Meaning</span>
                </h4>
                <p className="text-sm text-foreground">
                  Practice finding purpose and meaning in the moment; search for and find meaning in the painful and
                  joyful moments of each day. Be aware of 'What Is' and describe with 'Gratitude'.
                </p>
              </div>

              <div className="bg-secondary/50 rounded-lg p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="text-2xl">📋</span>
                  <span>P - Planning</span>
                </h4>
                <p className="text-sm text-foreground">
                  Have something to do and do it, the little things matter. Share your time with others, be present. Be
                  creative and active, plan your days ahead of time.
                </p>
              </div>

              <div className="bg-secondary/50 rounded-lg p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="text-2xl">🧘</span>
                  <span>R - Relaxing</span>
                </h4>
                <p className="text-sm text-foreground">
                  Take time to do nothing, just be. Take a mindful walk; 'Observe then Describe' the environment, create
                  yourself a place to relax and be there, fully 'Participate' with focus and awareness to 'What Is'.
                </p>
              </div>

              <div className="bg-secondary/50 rounded-lg p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="text-2xl">🎯</span>
                  <span>O - One-Thing</span>
                </h4>
                <p className="text-sm text-foreground">
                  Just do it, just one thing. Whatever the task or activity may be in the moment, fully participate,
                  with focus, awareness and attention to do what you are doing. Be willing with openness in your 'Wise
                  Mind', without judgment.
                </p>
              </div>

              <div className="bg-secondary/50 rounded-lg p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="text-2xl">🏖️</span>
                  <span>V - Vacation</span>
                </h4>
                <p className="text-sm text-foreground mb-2">
                  Take some time out, just some time to be with yourself, escape the rat race for a short while. Set
                  your vacations in your Day Planner.
                </p>
                <p className="text-sm font-medium text-destructive">
                  Remember - do not avoid your set tasks and commitments, that's not what a vacation is. Leave your
                  worries.
                </p>
              </div>

              <div className="bg-secondary/50 rounded-lg p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="text-2xl">💪</span>
                  <span>E - Encouragement</span>
                </h4>
                <p className="text-sm text-foreground">
                  Validate yourself, acknowledge your achievements no matter how large or small. Accept the reality of
                  the moment; remind yourself over and over that this will pass, 'I can manage this'. Be with people who
                  support you and your goals.
                </p>
              </div>
            </div>

            <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Building Your Practice</h3>
              <p className="text-sm text-foreground mb-3">
                The IMPROVE skills are a way of being in life. They help you develop resilience to distress and maintain
                your wellbeing through regular practice. Set out your plan and commit to practicing these skills daily.
              </p>
              <Link
                href="/skills/improve/worksheet"
                className="inline-flex items-center text-sm font-medium text-primary hover:underline"
              >
                Access Planning Worksheet →
              </Link>
            </div>

            <div className="flex gap-3 flex-col sm:flex-row">
              <Button asChild className="bg-primary hover:bg-primary/90 text-white flex-1">
                <Link href="/dashboard">Return to Dashboard</Link>
              </Button>
              <Button asChild variant="outline" className="flex-1 bg-transparent">
                <Link href="/skills">Browse More Skills</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <SkillFeedback skillName="IMPROVE" />
      </main>
    </div>
  )
}
