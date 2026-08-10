import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export default async function ProblemSolvingPage() {
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
              <span className="text-5xl">🧩</span>
              <div>
                <CardTitle className="text-2xl sm:text-3xl">Six Steps to Successful Problem Solving</CardTitle>
                <p className="text-muted-foreground text-sm sm:text-base">Moving from avoidance to effective action</p>
              </div>
            </div>
            <Badge variant="secondary" className="w-fit">
              Interpersonal Effectiveness
            </Badge>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-3">Why Problem Solving Matters</h3>
              <p className="text-foreground leading-relaxed mb-4">
                Have you ever found yourself confronted with problems that just won't go away? Often, we do everything
                we can to avoid, push away, or simply deny to ourselves that the problem exists. This is a problem in
                itself. Problems keep coming and we keep avoiding until we find ourselves getting overwhelmed and our
                'Emotional Mind' takes over.
              </p>
              <p className="text-foreground leading-relaxed">
                We begin acting impulsively to further avoid, not only our problems, but also the uncomfortable
                emotional experience. Our self-appraisals become unhelpful with thoughts like "I am hopeless", "life for
                me is unmanageable", "I am worthless".
              </p>
            </div>

            <div className="bg-secondary/50 rounded-lg p-4">
              <h4 className="font-semibold mb-2">The Reality</h4>
              <p className="text-sm text-foreground">
                We will never feel better until we solve the problem. Often this may not be manageable in the moment,
                however by developing a plan alone, we can keep our emotional experience and distress at a more
                manageable level for us. Doing this relieves the need for impulsive actions, which may include the
                behaviours we are attempting to change.
              </p>
            </div>

            <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
              <p className="text-sm text-foreground italic text-center">
                Viktor Frankel stated in the text of 'A man's search for meaning', that "the meaning of life is life
                itself, and being responsible for the problems that life will inevitably conjure up."
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">The Six Step Framework</h3>

              <div className="bg-accent/50 rounded-lg p-4 mb-4">
                <p className="text-sm font-medium text-foreground mb-2">Check the Facts:</p>
                <p className="text-sm text-muted-foreground">
                  Before attempting to solve a problem, you must ask yourself; is this a problem that can be solved? If
                  the answer is 'No' then practice your 'Mindfulness' and 'Acceptance' skills; if the answer is yes,
                  then get started now!
                </p>
                <p className="text-sm text-primary font-medium mt-3">
                  Remember - Be creative, adventurous, and practice being 'Non-Judgmental'. Schedule tasks and
                  activities in your 'Day Planner'.
                </p>
              </div>

              <div className="bg-primary/10 border border-primary/30 rounded-lg p-5">
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0">
                      1
                    </div>
                    <div>
                      <h5 className="font-semibold mb-1">Define the Problem</h5>
                      <p className="text-sm text-foreground">
                        Define exactly what the problem is: Make sure the problem is specific, if necessary, break it
                        down into several sub-problems.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0">
                      2
                    </div>
                    <div>
                      <h5 className="font-semibold mb-1">Brainstorm Options</h5>
                      <p className="text-sm text-foreground">
                        Brainstorm options to deal with the problem: Think of all options, be creative, explore with
                        others.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0">
                      3
                    </div>
                    <div>
                      <h5 className="font-semibold mb-1">Evaluate Options</h5>
                      <p className="text-sm text-foreground">
                        Choose the best option(s) by examining the 'Disadvantages' and 'Advantages' of each potential
                        solution. Which solution will work best?
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0">
                      4
                    </div>
                    <div>
                      <h5 className="font-semibold mb-1">Create Action Plan</h5>
                      <p className="text-sm text-foreground">
                        Generate a detailed action plan: Plan the 'when, where, how and with whom' of the selected
                        solution.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0">
                      5
                    </div>
                    <div>
                      <h5 className="font-semibold mb-1">Take Action</h5>
                      <p className="text-sm text-foreground">
                        Put the plan into action: Use your 'Coping Ahead' Skills to rehearse the plan and then actually
                        carry it out.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0">
                      6
                    </div>
                    <div>
                      <h5 className="font-semibold mb-1">Evaluate Results</h5>
                      <p className="text-sm text-foreground">
                        Evaluate the results to see how well the selected solution worked: If the solution didn't work,
                        reflect on what was not 'Effective' then go back to step three and try again!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-secondary/50 rounded-lg p-4">
              <h4 className="font-semibold mb-3 text-center text-2xl">Practice, Practice, Practice....</h4>
            </div>

            <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Key Insight</h3>
              <p className="text-sm text-foreground">
                Here is a simple and very effective problem-solving framework. It is time to stop avoiding and to start
                being responsible. This may sound like a task, however solving problems promptly and effectively will
                assist in your maintenance of 'Wellbeing'.
              </p>
            </div>

            <div className="flex gap-3 flex-col sm:flex-row">
              <Button asChild className="bg-primary hover:bg-primary/90 text-white flex-1">
                <Link href="/skills/interpersonal/turning-the-mind">Next: Turning the Mind →</Link>
              </Button>
              <Button asChild variant="outline" className="flex-1 bg-transparent">
                <Link href="/skills/interpersonal/fast">← FAST</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
