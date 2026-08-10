import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { SkillFeedback } from "@/components/skills/skill-feedback"

export default async function DearManPage() {
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
              <span className="text-5xl">🎯</span>
              <div>
                <CardTitle className="text-2xl sm:text-3xl">DEAR MAN</CardTitle>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Objective Effectiveness - Getting What You Need
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
                <li>How to clearly communicate your needs without damaging relationships</li>
                <li>Specific steps to ask for what you want effectively</li>
                <li>Techniques to maintain your position during difficult conversations</li>
                <li>How to negotiate win-win solutions</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">What is DEAR MAN?</h3>
              <p className="text-foreground leading-relaxed mb-4">
                DEAR MAN is a communication skill to help you get what you need while maintaining relationships. It's
                about being clear, assertive, and effective in asking for what you want or saying no to requests.
              </p>
              <div className="bg-secondary/50 rounded-lg p-3 text-sm text-foreground mb-4">
                <p className="font-medium mb-2">When to use DEAR MAN:</p>
                <ul className="space-y-1 list-disc list-inside text-muted-foreground">
                  <li>You need to ask for something important</li>
                  <li>Someone is making an unreasonable request</li>
                  <li>You want to set or maintain a boundary</li>
                  <li>Your needs are not being met in a relationship</li>
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-primary/10 border border-primary/30 rounded-lg p-5">
                <h4 className="font-semibold text-lg mb-4">The DEAR MAN Steps</h4>

                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0">
                      D
                    </div>
                    <div>
                      <h5 className="font-semibold mb-1">Describe</h5>
                      <p className="text-sm text-foreground">
                        Describe the situation - stick to the facts and avoid 'Judgmental' statements. Example: "This is
                        the third time this week that you've asked me for a ride home."
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0">
                      E
                    </div>
                    <div>
                      <h5 className="font-semibold mb-1">Express</h5>
                      <p className="text-sm text-foreground">
                        Express emotions and opinions about the situation clearly. Describe what you believe about the
                        situation. Don't expect the other person to read your mind or know your experience. "I'm getting
                        home so late that it is really hard for me and my family, I also really enjoy giving you rides
                        home, and it is hard for me to say no."
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0">
                      A
                    </div>
                    <div>
                      <h5 className="font-semibold mb-1">Assert</h5>
                      <p className="text-sm text-foreground">
                        Assert your wishes. Ask for what you want. Say no clearly. Don't expect the other person to know
                        what you want them to do if you don't tell them. Don't beat around the bush or procrastinate. "I
                        am unable to give you a ride home, as I just don't have the time."
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0">
                      R
                    </div>
                    <div>
                      <h5 className="font-semibold mb-1">Reinforce</h5>
                      <p className="text-sm text-foreground">
                        Reward people who respond positively to you when you ask for something, say no, or express an
                        opinion. Sometimes it helps to reinforce people before they respond by telling them the positive
                        effects of getting what you want or need. "Thanks for being so understanding, I really
                        appreciate it."
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0">
                      M
                    </div>
                    <div>
                      <h5 className="font-semibold mb-1">Mindful</h5>
                      <p className="text-sm text-foreground">
                        Remain mindful; fully participate in keeping the focus on your objectives in the situation.
                        Maintain your position. Don't allow yourself to be distracted by another topic.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0">
                      A
                    </div>
                    <div>
                      <h5 className="font-semibold mb-1">Appear Confident</h5>
                      <p className="text-sm text-foreground">
                        Maintain a confident tone of voice, posture and eye contact. Your level of confidence in a
                        situation also needs to be assessed, there is a fine line between appearing arrogant, and
                        appearing too apologetic.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0">
                      N
                    </div>
                    <div>
                      <h5 className="font-semibold mb-1">Negotiate</h5>
                      <p className="text-sm text-foreground">
                        Be willing to 'Give to Get'. Offer and ask for alternative solutions. "What do you think we can
                        do?" "I am not able to say yes, but you really seem to want this. What can we do here?" Look for
                        a win, win solution.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-accent/50 rounded-lg p-5">
                <h4 className="font-semibold mb-4">Practical Examples</h4>

                <div className="space-y-4">
                  <div className="border-l-4 border-primary pl-4">
                    <p className="font-semibold text-sm mb-2">Example 1: Setting Boundaries with a Friend</p>
                    <div className="space-y-2 text-sm text-foreground">
                      <p>
                        <strong className="text-primary">D:</strong> "You've asked me for money three times this month,
                        and each time I've lent you $50."
                      </p>
                      <p>
                        <strong className="text-primary">E:</strong> "I care about our friendship deeply, but I'm
                        feeling uncomfortable and worried about my own finances. I also feel it's becoming hard for me
                        to say no to you."
                      </p>
                      <p>
                        <strong className="text-primary">A:</strong> "I'm not able to lend you money anymore. I need to
                        stick to this boundary."
                      </p>
                      <p>
                        <strong className="text-primary">R:</strong> "I really appreciate you understanding. It means a
                        lot that you respect my decision."
                      </p>
                      <p>
                        <strong className="text-primary">M:</strong> If they try to guilt-trip you or change the
                        subject, stay focused: "I understand this is hard, but I need to stick to my boundary about
                        lending money."
                      </p>
                      <p>
                        <strong className="text-primary">A:</strong> Maintain steady eye contact, keep your voice calm
                        and confident.
                      </p>
                      <p>
                        <strong className="text-primary">N:</strong> "I can't lend money, but I'm happy to help you look
                        into other resources, like community assistance programs or budgeting apps."
                      </p>
                    </div>
                  </div>

                  <div className="border-l-4 border-primary pl-4">
                    <p className="font-semibold text-sm mb-2">Example 2: Asking for Help at Work</p>
                    <div className="space-y-2 text-sm text-foreground">
                      <p>
                        <strong className="text-primary">D:</strong> "I've been assigned four major projects this week,
                        and each one has a tight deadline."
                      </p>
                      <p>
                        <strong className="text-primary">E:</strong> "I'm feeling overwhelmed and worried that I won't
                        be able to give each project the attention it deserves. I want to do quality work."
                      </p>
                      <p>
                        <strong className="text-primary">A:</strong> "I'd like to discuss prioritizing these projects or
                        getting support from a team member."
                      </p>
                      <p>
                        <strong className="text-primary">R:</strong> "If we can work this out together, I'll be able to
                        deliver better results on each project."
                      </p>
                      <p>
                        <strong className="text-primary">M:</strong> Stay focused on the workload issue, don't get
                        sidetracked into discussing other topics.
                      </p>
                      <p>
                        <strong className="text-primary">A:</strong> Use a professional tone, make eye contact, sit up
                        straight.
                      </p>
                      <p>
                        <strong className="text-primary">N:</strong> "What if I focus on projects A and B this week, and
                        we push C and D to next week? Or could Sarah assist with one of them?"
                      </p>
                    </div>
                  </div>

                  <div className="border-l-4 border-primary pl-4">
                    <p className="font-semibold text-sm mb-2">Example 3: Saying No to Family Obligations</p>
                    <div className="space-y-2 text-sm text-foreground">
                      <p>
                        <strong className="text-primary">D:</strong> "You've asked me to host Thanksgiving dinner, which
                        involves cooking for 20 people and cleaning my house."
                      </p>
                      <p>
                        <strong className="text-primary">E:</strong> "I love spending holidays with family, but I'm
                        exhausted from work and don't have the energy to host this year."
                      </p>
                      <p>
                        <strong className="text-primary">A:</strong> "I won't be able to host this year."
                      </p>
                      <p>
                        <strong className="text-primary">R:</strong> "Thanks for understanding. I really appreciate not
                        being pressured about this."
                      </p>
                      <p>
                        <strong className="text-primary">M:</strong> If guilt-tripping occurs ("But we always do it at
                        your place!"), repeat: "I understand it's been tradition, but I can't host this year."
                      </p>
                      <p>
                        <strong className="text-primary">A:</strong> Stay calm, don't over-apologize or appear guilty.
                      </p>
                      <p>
                        <strong className="text-primary">N:</strong> "I'd be happy to attend at someone else's house and
                        bring a dish, or we could look into restaurant reservations for everyone."
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-secondary/50 rounded-lg p-4">
                <h4 className="font-semibold mb-3">Techniques for Difficult Situations</h4>

                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-medium">Broken Record</p>
                    <p className="text-muted-foreground mb-2">
                      Keep asking, saying 'No' or expressing your opinion, over and over. You don't have to think up
                      something new each time, just keep saying the exact same thing. Keep a mellow tone of voice, your
                      strength comes from maintaining your position.
                    </p>
                    <p className="text-foreground italic text-xs">
                      Example: "I understand, but I'm not able to do that." (Repeat 3-4 times if needed)
                    </p>
                  </div>

                  <div>
                    <p className="font-medium">Ignore</p>
                    <p className="text-muted-foreground mb-2">
                      If the other person attacks, threatens or tries to change the subject...'Ignore' the threats,
                      comments, or efforts to divert you. Just keep making your point. "We will discuss this issue at
                      another time"
                    </p>
                    <p className="text-foreground italic text-xs">
                      Example: If they say "You're being selfish!", respond with: "I hear that you're upset. My answer
                      is still no."
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
                <h4 className="font-semibold mb-3 text-destructive">Common Mistakes to Avoid</h4>
                <ul className="text-sm space-y-2 list-disc list-inside text-foreground">
                  <li>
                    <strong>Being vague:</strong> "Maybe we could try something..." → Be specific: "I need X by Friday."
                  </li>
                  <li>
                    <strong>Over-apologizing:</strong> "I'm so sorry, but..." → "I'm unable to do that."
                  </li>
                  <li>
                    <strong>Justifying excessively:</strong> You don't need to explain every reason. One clear
                    explanation is enough.
                  </li>
                  <li>
                    <strong>Backing down too quickly:</strong> Use Broken Record if they push back.
                  </li>
                  <li>
                    <strong>Getting defensive:</strong> Stay calm and focused on your objective.
                  </li>
                </ul>
              </div>

              <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                <h4 className="font-semibold mb-3">Practice Exercise</h4>
                <p className="text-sm text-foreground mb-3">
                  Think of a current situation where you need to ask for something or say no. Write out your DEAR MAN
                  script:
                </p>
                <div className="space-y-2 text-sm">
                  <div className="bg-background/50 rounded p-2">
                    <p className="font-medium">D - Describe:</p>
                    <p className="text-muted-foreground text-xs">What are the facts?</p>
                  </div>
                  <div className="bg-background/50 rounded p-2">
                    <p className="font-medium">E - Express:</p>
                    <p className="text-muted-foreground text-xs">How do you feel?</p>
                  </div>
                  <div className="bg-background/50 rounded p-2">
                    <p className="font-medium">A - Assert:</p>
                    <p className="text-muted-foreground text-xs">What do you want?</p>
                  </div>
                  <div className="bg-background/50 rounded p-2">
                    <p className="font-medium">R - Reinforce:</p>
                    <p className="text-muted-foreground text-xs">What's the positive outcome?</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Key Takeaways</h3>
              <ul className="text-sm text-foreground space-y-2 list-disc list-inside">
                <li>DEAR MAN helps you be clear, direct, and effective in communication</li>
                <li>Practice in low-stakes situations first before using in high-pressure moments</li>
                <li>You don't need to justify your every decision - one clear explanation is enough</li>
                <li>The goal is getting your needs met while maintaining respect for yourself and others</li>
                <li>Using DEAR MAN regularly builds confidence and improves relationships over time</li>
              </ul>
            </div>

            <div className="flex gap-3 flex-col sm:flex-row">
              <Button asChild className="bg-primary hover:bg-primary/90 text-white flex-1">
                <Link href="/skills/interpersonal/give">Next: GIVE →</Link>
              </Button>
              <Button asChild variant="outline" className="flex-1 bg-transparent">
                <Link href="/skills">Back to Skills Library</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <SkillFeedback skillName="DEAR MAN" />
      </main>
    </div>
  )
}
