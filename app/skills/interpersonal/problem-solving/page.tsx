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
      <header className="bg-card/80 backdrop-blur-sm border-b border-border"><div className="max-w-4xl mx-auto px-3 sm:px-4 py-3 sm:py-4"><Button asChild variant="ghost" size="sm"><Link href="/skills">← Back to Skills</Link></Button></div></header>
      <main className="max-w-4xl mx-auto px-3 sm:px-4 py-6 space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-2"><span className="text-5xl">🧩</span><div><CardTitle className="text-2xl sm:text-3xl">Six Steps for Problem Solving</CardTitle><p className="text-muted-foreground text-sm sm:text-base">A structured way to work through something that feels stuck</p></div></div>
            <Badge variant="secondary" className="w-fit">Problem Solving</Badge>
          </CardHeader>
          <CardContent className="space-y-6">
            <div><h3 className="font-semibold text-lg mb-3">Why use a framework?</h3><p className="text-foreground leading-relaxed mb-3">When a problem feels overwhelming, it can be difficult to know where to start. Avoidance, uncertainty or strong emotions can all make planning harder. A simple framework can reduce the task into smaller decisions.</p><p className="text-sm text-muted-foreground">Not every problem is fully solvable, and difficulty taking action is not a personal failure. Sometimes the most useful next step is support, more information, a boundary, or accepting what is outside your control.</p></div>

            <div className="bg-secondary/50 rounded-lg p-4"><h4 className="font-semibold mb-2">Before you start</h4><p className="text-sm text-foreground">Ask whether this is something you can influence right now. If yes, work through the steps below. If not, consider what support, acceptance, safety planning or waiting for more information might be appropriate.</p></div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">The six-step framework</h3>
              {[ 
                ["1", "Define the problem", "Describe the problem as specifically and neutrally as you can. If it is large, break it into smaller parts."],
                ["2", "Generate options", "List several possible responses, including asking for help or doing nothing for now if that is a realistic option."],
                ["3", "Compare options", "Consider likely benefits, downsides, safety, effort, timing and how each option fits with what matters to you."],
                ["4", "Choose a next step", "Pick one option or a small first part of it. You do not need a perfect plan before beginning."],
                ["5", "Try the plan", "Put the next step into practice. If the situation is sensitive or high-stakes, consider rehearsing it or involving someone you trust."],
                ["6", "Review what happened", "Notice what helped, what did not, and what you learned. If needed, adjust the plan or return to an earlier step."],
              ].map(([number, title, copy]) => (
                <div key={number} className="bg-primary/10 border border-primary/30 rounded-lg p-5 flex gap-3"><div className="bg-primary text-primary-foreground w-9 h-9 rounded-full flex items-center justify-center font-bold shrink-0">{number}</div><div><h5 className="font-semibold mb-1">{title}</h5><p className="text-sm text-foreground">{copy}</p></div></div>
              ))}
            </div>

            <div className="bg-primary/10 border border-primary/30 rounded-lg p-4"><h3 className="font-semibold mb-2">Keep the goal realistic</h3><p className="text-sm text-foreground">Problem solving is about increasing your options, not proving you can handle everything alone. If the issue involves violence, coercion, medical risk, legal problems or another situation outside the scope of a self-guided tool, professional or specialist support may be the better next step.</p></div>

            <div className="flex gap-3 flex-col sm:flex-row"><Button asChild className="bg-primary hover:bg-primary/90 text-white flex-1"><Link href="/skills/interpersonal/turning-the-mind">Next: Turning the Mind →</Link></Button><Button asChild variant="outline" className="flex-1 bg-transparent"><Link href="/skills/interpersonal/fast">← FAST</Link></Button></div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
