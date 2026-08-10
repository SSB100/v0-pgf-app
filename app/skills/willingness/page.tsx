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
          <Button asChild variant="ghost" size="sm">
            <Link href="/skills">← Back to Skills</Link>
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-3 sm:px-4 py-6 space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-5xl">🌱</span>
              <div>
                <CardTitle className="text-2xl sm:text-3xl">Willingness</CardTitle>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Cultivate a 'Willing' Response to Each Situation 'As It' Arises
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-3">What is Willingness?</h3>
              <p className="text-foreground leading-relaxed mb-4">
                Willingness is doing what is needed in each situation, while being supportive of your values, with full
                participation and a focus on being effective. Willingness is developing attention to, and acting from,
                your 'Wise Mind'. Willingness is being fully and truly present in the moment 'As It Is', not trying to
                change it through expectations that it shouldn't be 'As It Is'.
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
                <h4 className="font-semibold mb-3 text-destructive">What is Wilfulness?</h4>
                <p className="text-sm text-foreground mb-3">
                  Wilfulness is an 'Emotional Mind' stance. It is a place where 'Personal Growth' and 'Acceptance'
                  cannot be fostered. Wilfulness is a closed space that has a strong problem-focus and can keep us stuck
                  in the 'Unwell Mind'.
                </p>
                <ul className="text-sm space-y-2 list-disc list-inside text-foreground">
                  <li>Wilfulness is refusing to tolerate the moment</li>
                  <li>Wilfulness is refusing to make the changes that are necessary</li>
                  <li>Wilfulness is giving up or thinking 'I can't'</li>
                  <li>Wilfulness is trying to fix every situation</li>
                  <li>Wilfulness is demanding that you have control - thinking it 'shouldn't' be this way</li>
                  <li>Wilfulness is over attachment to 'me, me, me, I want it now, why me'</li>
                </ul>
              </div>

              <div className="bg-secondary/50 rounded-lg p-4">
                <h4 className="font-semibold mb-3">Recognize Wilfulness</h4>
                <div className="space-y-2 text-sm text-foreground">
                  <p>
                    <strong>Refusing to Tolerate 'What Is':</strong> Demanding that 'What Is', isn't
                  </p>
                  <p>
                    <strong>Control Beliefs:</strong> Blaming, Excuses, "Why, why, why"
                  </p>
                  <p>
                    <strong>Believing 'you' don't have to put in the effort</strong>
                  </p>
                  <p>
                    <strong>Refusing to do 'What is Necessary'</strong>
                  </p>
                </div>
              </div>

              <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                <h4 className="font-semibold mb-3">Practice Willingness</h4>
                <div className="space-y-3 text-sm text-foreground">
                  <p className="font-medium text-primary">
                    Willingness is opening up to 'What Is' and doing 'What Is' 'Necessary', while supporting your
                    'Values'.
                  </p>
                  <ul className="space-y-2 list-disc list-inside">
                    <li>Willingness is 'Acceptance' of 'What Is'</li>
                    <li>Willingness is not fighting 'What Is'</li>
                    <li>Willingness is a 'Wise Mind' action</li>
                    <li>Willingness is always a 'Towards Move'</li>
                    <li>
                      Willingness is facing lifes challenges 'Authentically' with a 'Solution~Focus' and 'Growth
                      Mindset'
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-accent/50 rounded-lg p-4">
                <h4 className="font-semibold mb-3">Notice Wilfulness and Replace it With Willingness</h4>
                <p className="text-sm text-foreground mb-3">
                  When you notice yourself in wilfulness - refusing, demanding, fighting, or giving up - pause and ask
                  yourself:
                </p>
                <ul className="text-sm space-y-2 list-disc list-inside text-foreground">
                  <li>What is 'What Is' right now?</li>
                  <li>What would be the most effective action?</li>
                  <li>What aligns with my values?</li>
                  <li>What would my Wise Mind choose?</li>
                </ul>
              </div>
            </div>

            <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Key Insight</h3>
              <p className="text-sm text-foreground">
                Wilfulness keeps you stuck. Willingness moves you forward. When you catch yourself in wilfulness,
                recognize it without judgment, and gently shift toward willingness. This is a practice - it gets easier
                with repetition.
              </p>
            </div>

            <div className="flex gap-3 flex-col sm:flex-row">
              <Button asChild className="bg-primary hover:bg-primary/90 text-white flex-1">
                <Link href="/dashboard">Return to Dashboard</Link>
              </Button>
              <Button asChild variant="outline" className="flex-1 bg-transparent">
                <Link href="/skills/reality-acceptance">← Reality Acceptance</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <SkillFeedback skillName="Willingness" />
      </main>
    </div>
  )
}
