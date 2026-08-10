import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { SkillFeedback } from "@/components/skills/skill-feedback"

export default async function FastPage() {
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
              <span className="text-5xl">💎</span>
              <div>
                <CardTitle className="text-2xl sm:text-3xl">FAST</CardTitle>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Self-Respect Effectiveness - Fostering Self-Respect
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="w-fit">
              Interpersonal Effectiveness
            </Badge>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-accent/50 rounded-lg p-4 border border-accent">
              <h3 className="font-semibold text-lg mb-3">What You'll Learn</h3>
              <ul className="text-sm space-y-2 list-disc list-inside text-foreground">
                <li>How to maintain self-respect while navigating relationships</li>
                <li>When and how to apologize appropriately</li>
                <li>Staying true to your values even under pressure</li>
                <li>Building long-term confidence through authentic communication</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">What is Self-Respect Effectiveness?</h3>
              <p className="text-foreground leading-relaxed mb-4">
                Self-respect effectiveness involves maintaining or improving your relationship with yourself and
                respecting your own values and beliefs, while you work to get what you want. It includes behaving in
                ways that fit with your values, and in a manner that allows you to feel competent.
              </p>
            </div>

            <div className="bg-secondary/50 rounded-lg p-4">
              <h4 className="font-semibold mb-3">Things That Diminish Self-Respect Over the Long Term</h4>
              <ul className="text-sm space-y-2 list-disc list-inside text-foreground">
                <li>Being 'Stuck' in the 'Unwell Mind'</li>
                <li>Giving in for the sake of approval</li>
                <li>Lying to please others</li>
                <li>Acting helpless; this also diminishes your sense of mastery and competence</li>
              </ul>
            </div>

            <div className="space-y-4">
              <div className="bg-primary/10 border border-primary/30 rounded-lg p-5">
                <h4 className="font-semibold text-lg mb-4 text-primary">The FAST Skills</h4>

                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0">
                      F
                    </div>
                    <div>
                      <h5 className="font-semibold mb-1">Fair</h5>
                      <p className="text-sm text-foreground">
                        Be Fair - This means being fair and compassionate towards yourself and the other person in your
                        attempts to meet your objectives. The idea here is that it is hard to like yourself in the long
                        haul if you consistently take advantage of other people, always look for the 'Win, Win'
                        solution.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0">
                      A
                    </div>
                    <div>
                      <h5 className="font-semibold mb-1">Apologies</h5>
                      <p className="text-sm text-foreground mb-2">
                        Apologies - Apologise when apologies are appropriate. Don't be overly apologetic.
                      </p>
                      <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                        <li>No apologising for being alive</li>
                        <li>No apologising for making the request</li>
                        <li>No apologising for having an opinion</li>
                        <li>No apologising for disagreeing</li>
                      </ul>
                      <p className="text-sm text-foreground mt-2">
                        Apologising implies that you are in the wrong somehow, apologising when you do not believe you
                        are in the wrong will reduce your sense of effectiveness over time. Being able to apologise is a
                        very important skill, and is important for maintaining relationships, however, if it is
                        inappropriate and continuous it can reduce relationship effectiveness.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0">
                      S
                    </div>
                    <div>
                      <h5 className="font-semibold mb-1">Stick</h5>
                      <p className="text-sm text-foreground">
                        Stick to 'Your' Values - Don't sell out your values or integrity, just to get what you want or
                        keep the other person liking you. Always be true to who you are (Authenticity), you will
                        struggle with self-respect if you are not behaving and thinking in a manner that is supportive
                        of your values.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0">
                      T
                    </div>
                    <div>
                      <h5 className="font-semibold mb-1">Truthful</h5>
                      <p className="text-sm text-foreground">
                        Be Truthful - Don't lie or act helpless when you are not. Don't exaggerate the situation, keep
                        it 'As It Is'. A pattern of dishonesty over time will erode your self-respect, and respect from
                        others. Acting helpless is the opposite of 'Building Mastery'.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-secondary/50 rounded-lg p-3 text-sm text-foreground mb-4">
                <p className="font-medium mb-2">When to use FAST:</p>
                <ul className="space-y-1 list-disc list-inside text-muted-foreground">
                  <li>You're tempted to compromise your values to please someone</li>
                  <li>You feel pressured to say yes when you want to say no</li>
                  <li>You notice yourself over-apologizing or acting helpless</li>
                  <li>You want to build confidence in standing up for yourself</li>
                </ul>
              </div>

              <div className="bg-accent/50 rounded-lg p-4">
                <h4 className="font-semibold mb-3">Factors That Reduce Interpersonal Effectiveness</h4>
                <p className="text-sm text-foreground mb-3">
                  Lack of skill; you actually don't know what to say or how to behave. You don't know how you could
                  behave to obtain your objectives and achieve your goals. You struggle to know what will work. Lack of
                  skill is frequently assumed to be a lack of motivation. If you don't know what to say or do, all the
                  motivation in the world will not show you how to do it.
                </p>
              </div>

              <div className="bg-secondary/50 rounded-lg p-4">
                <h4 className="font-semibold mb-3">We Learn Interpersonal Skills the Same Way We Learn Other Skills</h4>
                <ul className="text-sm space-y-2 list-disc list-inside text-foreground">
                  <li>By observing others doing them</li>
                  <li>By practicing the skills, ourselves</li>
                  <li>By refining the skills until desired results are achieved</li>
                </ul>
              </div>

              <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                <h4 className="font-semibold mb-3">Lack of Interpersonal Skills Can Occur When...</h4>
                <ul className="text-sm space-y-2 list-disc list-inside text-foreground">
                  <li>You are 'Stuck' in the 'Unwell Mind'</li>
                  <li>You don't have anyone to model the skills</li>
                  <li>You don't have the opportunity to observe the skills being modelled</li>
                  <li>
                    You don't have the chance to practice the skills. The degree of interpersonal effectiveness often
                    varies from one situation to another, from one frame of mind to another, from one mood to another
                  </li>
                </ul>
              </div>

              <div className="bg-accent/50 rounded-lg p-5">
                <h4 className="font-semibold mb-4">FAST in Real Life: Practical Examples</h4>

                <div className="space-y-4">
                  <div className="border-l-4 border-primary pl-4">
                    <p className="font-semibold text-sm mb-2">Example 1: Values Conflict at Work</p>
                    <p className="text-xs text-muted-foreground mb-3">
                      Your boss asks you to do something that goes against your ethics.
                    </p>

                    <div className="space-y-2 text-sm text-foreground">
                      <p>
                        <strong className="text-primary">F - Fair:</strong> "I want to find a solution that works for
                        both the company and maintains ethical standards." (Consider both perspectives)
                      </p>
                      <p>
                        <strong className="text-primary">A - Apologies:</strong> "I'm not apologizing for my concern
                        about this approach." (Don't apologize for your values)
                      </p>
                      <p>
                        <strong className="text-primary">S - Stick to Values:</strong> "Honesty with clients is really
                        important to me. I can't misrepresent the product." (Stay true to what matters)
                      </p>
                      <p>
                        <strong className="text-primary">T - Truthful:</strong> "I'm concerned this approach could harm
                        client trust and potentially create legal issues." (Be honest, not dramatic)
                      </p>
                    </div>
                  </div>

                  <div className="border-l-4 border-primary pl-4">
                    <p className="font-semibold text-sm mb-2">Example 2: Family Pressure</p>
                    <p className="text-xs text-muted-foreground mb-3">
                      Your family pressures you to attend an event that conflicts with your self-care needs.
                    </p>

                    <div className="space-y-2 text-sm text-foreground">
                      <p>
                        <strong className="text-primary">F - Fair:</strong> "I know this event is important to you, and
                        my well-being is important to me. Both matter." (Balance both needs)
                      </p>
                      <p>
                        <strong className="text-primary">A - Apologies:</strong> "I'm not going to apologize for
                        prioritizing my mental health." (No guilt for self-care)
                      </p>
                      <p>
                        <strong className="text-primary">S - Stick to Values:</strong> "Taking care of myself is
                        something I'm committed to, even when it's disappointing to others." (Hold your ground)
                      </p>
                      <p>
                        <strong className="text-primary">T - Truthful:</strong> "I've been feeling burned out, and I
                        need this weekend to recharge." (Honest, not making excuses)
                      </p>
                    </div>
                  </div>

                  <div className="border-l-4 border-primary pl-4">
                    <p className="font-semibold text-sm mb-2">Example 3: Inappropriate Apology Pattern</p>
                    <p className="text-xs text-muted-foreground mb-3">
                      You realize you apologize for things that don't warrant an apology.
                    </p>

                    <div className="grid sm:grid-cols-2 gap-3 text-sm">
                      <div className="bg-destructive/10 rounded p-2">
                        <p className="font-semibold text-xs text-destructive mb-1">❌ Over-Apologizing</p>
                        <ul className="text-xs space-y-1 text-foreground">
                          <li>"Sorry, can I ask a question?"</li>
                          <li>"Sorry for bothering you, but..."</li>
                          <li>"Sorry for having an opinion"</li>
                          <li>"Sorry I can't help you"</li>
                        </ul>
                      </div>

                      <div className="bg-primary/10 rounded p-2">
                        <p className="font-semibold text-xs text-primary mb-1">✓ Appropriate Communication</p>
                        <ul className="text-xs space-y-1 text-foreground">
                          <li>"I have a question."</li>
                          <li>"I'd like to discuss..."</li>
                          <li>"I see it differently..."</li>
                          <li>"I'm unable to help with that"</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="border-l-4 border-primary pl-4">
                    <p className="font-semibold text-sm mb-2">Example 4: When Apologies ARE Appropriate</p>
                    <div className="space-y-2 text-sm text-foreground">
                      <p>
                        <strong>Situation:</strong> You snapped at a friend because you were stressed.
                      </p>
                      <p className="text-primary">
                        "I'm sorry I snapped at you earlier. I was stressed, but that's not an excuse. You didn't
                        deserve that."
                      </p>
                      <p className="text-xs text-muted-foreground">
                        This is appropriate - you actually did something wrong, and apologizing is the right thing to
                        do.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-secondary/50 rounded-lg p-4">
                <h4 className="font-semibold mb-3">How Self-Respect Gets Eroded</h4>
                <p className="text-sm text-foreground mb-3">
                  Self-respect doesn't disappear overnight. It erodes gradually through small compromises:
                </p>

                <div className="space-y-3">
                  <div className="flex gap-3 items-start">
                    <div className="bg-destructive text-destructive-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs shrink-0">
                      1
                    </div>
                    <div className="text-sm">
                      <p className="font-medium">The Ask:</p>
                      <p className="text-muted-foreground">
                        Someone asks you to do something against your values, "just this once."
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 items-start">
                    <div className="bg-destructive text-destructive-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs shrink-0">
                      2
                    </div>
                    <div className="text-sm">
                      <p className="font-medium">The Compromise:</p>
                      <p className="text-muted-foreground">
                        You agree to keep the peace or because you want them to like you.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 items-start">
                    <div className="bg-destructive text-destructive-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs shrink-0">
                      3
                    </div>
                    <div className="text-sm">
                      <p className="font-medium">The Pattern:</p>
                      <p className="text-muted-foreground">
                        It becomes easier to say yes next time. Your boundaries blur.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 items-start">
                    <div className="bg-destructive text-destructive-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs shrink-0">
                      4
                    </div>
                    <div className="text-sm">
                      <p className="font-medium">The Result:</p>
                      <p className="text-muted-foreground">
                        You feel resentful, lose respect for yourself, and question "who am I?"
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                <h4 className="font-semibold mb-3">Self-Reflection Exercise</h4>
                <p className="text-sm text-foreground mb-3">Think about your recent interactions. Ask yourself:</p>
                <div className="space-y-2 text-sm">
                  <div className="bg-background/50 rounded p-3">
                    <p className="font-medium mb-1">Fair: Are you being fair to yourself?</p>
                    <p className="text-muted-foreground text-xs">
                      Are you consistently putting others' needs above your own? Or being unfair to others to get what
                      you want?
                    </p>
                  </div>
                  <div className="bg-background/50 rounded p-3">
                    <p className="font-medium mb-1">Apologies: Are you over-apologizing?</p>
                    <p className="text-muted-foreground text-xs">
                      Count how many times you say "sorry" in a day. Are most justified? Or are you apologizing for
                      existing?
                    </p>
                  </div>
                  <div className="bg-background/50 rounded p-3">
                    <p className="font-medium mb-1">Stick: Have you compromised your values lately?</p>
                    <p className="text-muted-foreground text-xs">
                      Did you say yes when you wanted to say no? Did you go along with something you disagreed with?
                    </p>
                  </div>
                  <div className="bg-background/50 rounded p-3">
                    <p className="font-medium mb-1">Truthful: Are you being honest?</p>
                    <p className="text-muted-foreground text-xs">
                      Are you exaggerating to get sympathy? Downplaying to avoid conflict? Or telling it like it is?
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
                <h4 className="font-semibold mb-3 text-destructive">Signs You Need More FAST</h4>
                <ul className="text-sm space-y-2 list-disc list-inside text-foreground">
                  <li>You feel resentful after agreeing to things</li>
                  <li>You say "sorry" multiple times per conversation</li>
                  <li>You feel like you're losing yourself in relationships</li>
                  <li>You lie or exaggerate to avoid disappointing people</li>
                  <li>You feel like an imposter or fraud</li>
                  <li>You have low confidence even though others see you as capable</li>
                  <li>You act helpless when you're actually competent</li>
                </ul>
              </div>
            </div>

            <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Remember</h3>
              <p className="text-sm text-foreground mb-3">
                You have the ability to 'Change Your Story' even when constrained by the 'Facts', allowing you to move
                from being trapped towards developing a 'Growth Mindset'.
              </p>
              <p className="text-sm text-muted-foreground">
                Using the 'GIVE' skills when they are needed and putting them away when harshness and boldness are
                necessary, might be the best path to self-respect. 'FAST' Skills are a constant, remaining 'Authentic'
                to who you are and fostering self-respect in any level of communication, in any type of relationship, is
                important for 'You'.
              </p>
            </div>

            <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Key Takeaways</h3>
              <ul className="text-sm text-foreground space-y-2 list-disc list-inside">
                <li>Self-respect is built through consistent small choices to honor your values</li>
                <li>Appropriate apologies maintain relationships; over-apologizing erodes self-respect</li>
                <li>
                  Being truthful creates authenticity; exaggerating or acting helpless creates distance from yourself
                </li>
                <li>You can be kind AND maintain boundaries - these aren't mutually exclusive</li>
                <li>FAST skills work best combined with GIVE and DEAR MAN for balanced communication</li>
              </ul>
            </div>

            <div className="flex gap-3 flex-col sm:flex-row">
              <Button asChild className="bg-primary hover:bg-primary/90 text-white flex-1">
                <Link href="/skills/interpersonal/problem-solving">Next: Problem Solving →</Link>
              </Button>
              <Button asChild variant="outline" className="flex-1 bg-transparent">
                <Link href="/skills/interpersonal/give">← GIVE</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <SkillFeedback skillName="FAST" />
      </main>
    </div>
  )
}
