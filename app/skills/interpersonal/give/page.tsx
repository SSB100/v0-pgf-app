import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { SkillFeedback } from "@/components/skills/skill-feedback"

export default async function GivePage() {
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
              <span className="text-5xl">🤝</span>
              <div>
                <CardTitle className="text-2xl sm:text-3xl">GIVE</CardTitle>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Relationship Effectiveness - Fostering the Relationships You Want
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
                <li>How to maintain and strengthen relationships while getting your needs met</li>
                <li>Ways to show genuine interest and validation in conversations</li>
                <li>Balancing kindness with assertiveness</li>
                <li>Recognizing when relationship patterns are unhealthy</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">What is GIVE?</h3>
              <p className="text-foreground leading-relaxed mb-4">
                GIVE is about maintaining or improving interpersonal relationships while having your 'Wants' and 'Needs'
                met. If this works well, you will get what you want, and the person may respect you more than before.
                Developing a 'Win, Win' stance to situations.
              </p>
              <div className="bg-secondary/50 rounded-lg p-3 text-sm text-foreground mb-4">
                <p className="font-medium mb-2">When to use GIVE:</p>
                <ul className="space-y-1 list-disc list-inside text-muted-foreground">
                  <li>You want to keep a relationship positive while also addressing an issue</li>
                  <li>You're having a difficult conversation with someone you care about</li>
                  <li>You want to show someone they matter even when setting boundaries</li>
                  <li>You need to repair or strengthen a relationship</li>
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-primary/10 border border-primary/30 rounded-lg p-5">
                <h4 className="font-semibold mb-4">The GIVE Skills</h4>

                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0">
                      G
                    </div>
                    <div>
                      <h5 className="font-semibold mb-1">Gentle</h5>
                      <p className="text-sm text-foreground mb-2">
                        Be Gentle - People tend to respond to gentleness more than they do to harshness. Avoid attacks,
                        threats, and judgmental statements.
                      </p>
                      <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                        <li>No attacks - This one is pretty clear. People won't like you if you threaten them</li>
                        <li>
                          Stay in the discussion even if it gets painful, then exit gracefully. Avoid 'Judgmental'
                          statements
                        </li>
                        <li>No name calling, put downs in voice or manner, no guilt trips</li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0">
                      I
                    </div>
                    <div>
                      <h5 className="font-semibold mb-1">Interested</h5>
                      <p className="text-sm text-foreground mb-2">
                        Act Interested - This involves being attentive to and actively interested in the other person.
                      </p>
                      <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                        <li>
                          People tend to respond more positively if you are interested in them, and if you give them
                          time and space to respond to you
                        </li>
                        <li>
                          Listen to what they have to say, don't interrupt or talk over the other person. Be sensitive
                          to the other person's desire to have the discussion at another time if that is what the person
                          wants
                        </li>
                        <li>Be patient</li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0">
                      V
                    </div>
                    <div>
                      <h5 className="font-semibold mb-1">Validate</h5>
                      <p className="text-sm text-foreground mb-2">
                        Validate - Be non-judgmental, out loud. Validate the other person's emotional experience, wants,
                        difficulties and opinions about the situation.
                      </p>
                      <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                        <li>
                          Find the 'Grain of Truth' in what the other person is saying. Try to figure out what problems
                          the other person might be having, then acknowledge this to them
                        </li>
                        <li>
                          "I know you are very busy, however.." "I can see that this is very important to you...." "I
                          know that this will take you out of your way a bit...."
                        </li>
                        <li>
                          This is a good skill to practice even if no conflict exists. More than any other skill, this
                          one has the potential to affect the quality of your relationships
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0">
                      E
                    </div>
                    <div>
                      <h5 className="font-semibold mb-1">Easy Manner</h5>
                      <p className="text-sm text-foreground mb-2">
                        Use an Easy Manner - Try to be light-hearted. Use a little humour. Smile. Ease the other person
                        along.
                      </p>
                      <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                        <li>
                          This is the difference between 'Soft Sell' and 'Hard Sell'. People don't like to be bullied,
                          pushed around or made to feel guilty
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-accent/50 rounded-lg p-5">
                <h4 className="font-semibold mb-4">GIVE in Action: Real-Life Scenarios</h4>

                <div className="space-y-4">
                  <div className="border-l-4 border-primary pl-4">
                    <p className="font-semibold text-sm mb-2">Scenario 1: Roommate Conflict</p>
                    <p className="text-xs text-muted-foreground mb-3">
                      Your roommate keeps leaving dishes in the sink, and you need to address it without damaging the
                      friendship.
                    </p>

                    <div className="space-y-2 text-sm text-foreground">
                      <p>
                        <strong className="text-primary">G - Gentle:</strong> "Hey, I wanted to talk to you about the
                        kitchen. I know we're both busy." (No attacks or blame)
                      </p>
                      <p>
                        <strong className="text-primary">I - Interested:</strong> "Is everything okay? I've noticed
                        you've been leaving dishes more often lately - are you really stressed with work?" (Show genuine
                        curiosity)
                      </p>
                      <p>
                        <strong className="text-primary">V - Validate:</strong> "I totally get that when you're
                        exhausted, dishes are the last thing you want to deal with. I've been there too." (Find the
                        grain of truth)
                      </p>
                      <p>
                        <strong className="text-primary">E - Easy Manner:</strong> "The dishes are staging a rebellion
                        in the sink!" (Keep it light, not heavy-handed)
                      </p>
                    </div>
                  </div>

                  <div className="border-l-4 border-primary pl-4">
                    <p className="font-semibold text-sm mb-2">Scenario 2: Partner Conversation</p>
                    <p className="text-xs text-muted-foreground mb-3">
                      Your partner forgot an important date, and you're hurt but want to address it constructively.
                    </p>

                    <div className="space-y-2 text-sm text-foreground">
                      <p>
                        <strong className="text-primary">G - Gentle:</strong> "I want to talk about what happened
                        yesterday. I'm not trying to make you feel bad." (Soft approach, no guilting)
                      </p>
                      <p>
                        <strong className="text-primary">I - Interested:</strong> Let them explain what happened. Listen
                        without interrupting. "What was going on for you yesterday?" (Give space to respond)
                      </p>
                      <p>
                        <strong className="text-primary">V - Validate:</strong> "I can see you've had a really
                        overwhelming week at work. I know you didn't forget on purpose." (Acknowledge their reality)
                      </p>
                      <p>
                        <strong className="text-primary">E - Easy Manner:</strong> "Next time, maybe we can set a phone
                        reminder together? We're both forgetful sometimes!" (Friendly, solution-focused)
                      </p>
                    </div>
                  </div>

                  <div className="border-l-4 border-primary pl-4">
                    <p className="font-semibold text-sm mb-2">Scenario 3: Workplace Feedback</p>
                    <p className="text-xs text-muted-foreground mb-3">
                      You need to give a colleague feedback about missing deadlines.
                    </p>

                    <div className="space-y-2 text-sm text-foreground">
                      <p>
                        <strong className="text-primary">G - Gentle:</strong> "I wanted to check in with you about the
                        project timeline. No judgment - I'm here to help us figure this out together." (Non-threatening
                        approach)
                      </p>
                      <p>
                        <strong className="text-primary">I - Interested:</strong> "I've noticed you've been missing some
                        deadlines. What's been getting in the way? Is there something I don't know about?" (Ask
                        genuinely)
                      </p>
                      <p>
                        <strong className="text-primary">V - Validate:</strong> "I know this project has been
                        challenging, and the timeline is tight. I can see you're putting in effort." (Recognize their
                        struggle)
                      </p>
                      <p>
                        <strong className="text-primary">E - Easy Manner:</strong> "How about we grab coffee and
                        brainstorm ways to make this more manageable?" (Friendly, solution-focused)
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-secondary/50 rounded-lg p-4">
                <h4 className="font-semibold mb-3">What Does This Look Like? GIVE vs. Without GIVE</h4>

                <div className="space-y-3">
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="bg-destructive/10 border border-destructive/30 rounded p-3">
                      <p className="font-semibold text-sm text-destructive mb-2">❌ Without GIVE</p>
                      <p className="text-xs text-foreground italic">
                        "You ALWAYS leave dishes in the sink! I'm sick of cleaning up after you. You're so
                        inconsiderate!"
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Result: Defensive response, damaged relationship, problem likely continues
                      </p>
                    </div>

                    <div className="bg-primary/10 border border-primary/30 rounded p-3">
                      <p className="font-semibold text-sm text-primary mb-2">✓ With GIVE</p>
                      <p className="text-xs text-foreground italic">
                        "Hey, I've noticed dishes piling up. I know you're busy - is everything okay? I'd love to figure
                        out a system that works for both of us."
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Result: Open conversation, relationship maintained, collaborative problem-solving
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-secondary/50 rounded-lg p-4">
                <h4 className="font-semibold mb-3">Using GIVE in Difficult Situations</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  'GIVE' skills can make even difficult situations a bit more palatable. For instance, there will be
                  times where you have to stand up for yourself and allow the other person to be angry, sad or
                  disappointed.
                </p>
                <p className="text-sm text-foreground italic">
                  "I know that you are disappointed that I have responded to your request in this way. I am going to
                  have to live with you feeling disappointed in me for now."
                </p>
              </div>

              <div className="bg-accent/50 rounded-lg p-4">
                <h4 className="font-semibold mb-3">The Balance</h4>
                <p className="text-sm text-foreground">
                  It is also important to remember that you have to balance 'Relationship' goals with the other two
                  types of goals – 'Objective' and 'Self-Respect'. Continually sacrificing your 'Values' and 'Goals' for
                  the sake of the relationship won't guarantee that the relationship will develop in a positive way, and
                  that no problems will arise. The key problem with this approach is that it just doesn't work long term
                  and we tend to lose 'Who We Are'.
                </p>
              </div>

              <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                <h4 className="font-semibold mb-3">Example Relationship Patterns</h4>

                <div className="space-y-3">
                  <div className="p-3 bg-destructive/10 border border-destructive/30 rounded">
                    <p className="font-medium text-sm text-destructive mb-1">Unhelpful Relationship Style</p>
                    <p className="text-sm text-foreground">
                      Relationship begins → Person sacrifices needs and wants to keep the relationship → Frustration due
                      to unmet needs, huge inequities → Relationship hot and conflictual
                    </p>
                  </div>

                  <div className="p-3 bg-primary/10 border border-primary/30 rounded">
                    <p className="font-medium text-sm text-primary mb-1">Helpful Relationship Style</p>
                    <p className="text-sm text-foreground">
                      Relationship begins → Difficult situations dealt with → Unmet needs assessed → Inequity assessed →
                      Big issues addressed → Relationship calm and connected
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
                <h4 className="font-semibold mb-3 text-destructive">Warning Signs You're Not Using GIVE</h4>
                <ul className="text-sm space-y-2 list-disc list-inside text-foreground">
                  <li>Conversations frequently escalate into arguments</li>
                  <li>People become defensive when you bring up issues</li>
                  <li>You feel frustrated that "no one listens"</li>
                  <li>Relationships feel tense or distant after difficult conversations</li>
                  <li>You notice yourself using "always" or "never" statements</li>
                  <li>You interrupt or talk over others frequently</li>
                </ul>
              </div>

              <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                <h4 className="font-semibold mb-3">Practice This Week</h4>
                <p className="text-sm text-foreground mb-3">Pick one GIVE skill to focus on in your interactions:</p>
                <div className="space-y-2 text-sm">
                  <div className="bg-background/50 rounded p-2">
                    <p className="font-medium">Day 1-2: Practice Gentle</p>
                    <p className="text-muted-foreground text-xs">Notice your tone of voice. Soften harsh language.</p>
                  </div>
                  <div className="bg-background/50 rounded p-2">
                    <p className="font-medium">Day 3-4: Practice Interested</p>
                    <p className="text-muted-foreground text-xs">
                      Listen fully before responding. Ask genuine questions.
                    </p>
                  </div>
                  <div className="bg-background/50 rounded p-2">
                    <p className="font-medium">Day 5-6: Practice Validate</p>
                    <p className="text-muted-foreground text-xs">Find one thing to validate in each conversation.</p>
                  </div>
                  <div className="bg-background/50 rounded p-2">
                    <p className="font-medium">Day 7: Practice Easy Manner</p>
                    <p className="text-muted-foreground text-xs">Bring lightness to a difficult topic.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Remember</h3>
              <p className="text-sm text-foreground">
                'DEAR MAN' Skills also double as 'Relationship Effectiveness' Skills: When you use 'DEAR MAN'
                effectively you are clear about what you need, want, and are willing to do for others in return. You
                make it easier for the other person to know what you want, and how to meet your needs. Communicating
                effectively removes the burden of always trying to guess what you want or need and increases the chances
                of them 'Getting It Right'.
              </p>
            </div>

            <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Key Takeaways</h3>
              <ul className="text-sm text-foreground space-y-2 list-disc list-inside">
                <li>GIVE helps you address issues without damaging relationships</li>
                <li>Validation doesn't mean agreement - it means acknowledging the other person's reality</li>
                <li>Combining GIVE with DEAR MAN creates powerful, effective communication</li>
                <li>Small changes in tone and approach can dramatically improve relationship outcomes</li>
                <li>Practice one skill at a time until it becomes natural</li>
              </ul>
            </div>

            <div className="flex gap-3 flex-col sm:flex-row">
              <Button asChild className="bg-primary hover:bg-primary/90 text-white flex-1">
                <Link href="/skills/interpersonal/fast">Next: FAST →</Link>
              </Button>
              <Button asChild variant="outline" className="flex-1 bg-transparent">
                <Link href="/skills/interpersonal/dear-man">← DEAR MAN</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <SkillFeedback skillName="GIVE" />
      </main>
    </div>
  )
}
