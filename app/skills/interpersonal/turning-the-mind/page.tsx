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
          <Button asChild variant="ghost" size="sm">
            <Link href="/skills">← Back to Skills</Link>
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-3 sm:px-4 py-6 space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-5xl">🔄</span>
              <div>
                <CardTitle className="text-2xl sm:text-3xl">Turning the Mind to Acceptance</CardTitle>
                <p className="text-muted-foreground text-sm sm:text-base">
                  The practice of choosing acceptance over resistance
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="w-fit">
              Interpersonal Effectiveness
            </Badge>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-3">What is Turning the Mind?</h3>
              <p className="text-foreground leading-relaxed mb-4">
                'Turning the Mind' to an accepting and willing stance is a choice. Once we have the space to 'Observe'
                then 'Describe' what our mind is doing and where it may be taking us, it is empowering ourselves to take
                responsibility for the acceptance of situations as they are, and our responses to them. Disempowering
                ourselves by choosing not to accept often leads to being 'Stuck' in the emotional responses of the
                moment and vulnerable to the 'Auto-Pilot' and 'Unwell Mind'.
              </p>
            </div>

            <div className="bg-secondary/50 rounded-lg p-4">
              <h4 className="font-semibold mb-3">
                Just as we may choose to travel on one road or another, we can explore the reality of the situation,
                then plan ahead for the path we choose.
              </h4>
              <p className="text-sm text-muted-foreground italic">
                There is an old story relating to 'Acceptance' and 'Change' that goes like this....
              </p>
            </div>

            <div className="bg-accent/50 rounded-lg p-5">
              <p className="text-sm text-foreground italic leading-relaxed">
                There is a lake with a few folk living on its shore on the opposite side to a small village where
                supplies were bought, and wares traded. Old Johnny had lived there since a nipper, and since a nipper
                had travelled the old road to the village for the family's needs and to trade his father's wares. The
                old road over time had become strewn with potholes and ruts, still, now old Johnny travelled it for four
                hours daily.
              </p>
              <p className="text-sm text-foreground italic leading-relaxed mt-3">
                A few years back a new road to the village was constructed, running around the lake the opposite way to
                the old road. The folk were over the moon to have a smooth, comfortable and shorter travel to the
                village, all, except old Johnny.
              </p>
              <p className="text-sm text-foreground italic leading-relaxed mt-3">
                Old Johnny knew every nook and cranny on that old road, it was his familiar place to travel. Being
                'Stuck' in his ways and rather 'Wilful', Old Johnny thought the new road was a blight on the landscape
                and refused to 'Accept' that both old road and he were worn out. One day when old Johnny did not show,
                as he did every day at the village market, the local folk set off to search. Old Johnny was found
                looking weathered and beaten with his old B1600 ute stuck in a rut. After a tow and lecture from the
                folk selling Old Johnny the benefits of the new road, he vowed and promised to the folk that the new
                road would be his new path.
              </p>
              <p className="text-sm text-foreground italic leading-relaxed mt-3">
                The next morning old Johnny woke from his slumber and rose to his daily tasks on 'Auto-Pilot' and off he
                launched in his B1600 ute towards the village. This was the time the old road took its last victim and
                was closed.
              </p>
            </div>

            <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
              <p className="text-sm text-foreground">
                Life may not always provide predictable outcomes, however choosing the 'Willingness' and 'Acceptance'
                road will always be a smoother path with less turmoil and discomfort.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Step by Step Turning the Mind</h3>

              <div className="bg-primary/10 border border-primary/30 rounded-lg p-5">
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0">
                      1
                    </div>
                    <div>
                      <p className="text-sm text-foreground">
                        'Observe' that you are not accepting; look inward at your experience; are emotions of anger,
                        resentment, annoyance or frustration arising, or are you actively avoiding your emotional
                        experience?
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0">
                      2
                    </div>
                    <div>
                      <p className="text-sm text-foreground">
                        Are you attaching to thoughts like 'I can't stand it', 'why me', 'why is this happening', 'it
                        shouldn't be this way'?
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0">
                      3
                    </div>
                    <div>
                      <p className="text-sm text-foreground">
                        Bring forth your commitment to acceptance of reality 'As It Is'.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0">
                      4
                    </div>
                    <div>
                      <p className="text-sm text-foreground">
                        Do it again, over and over. Keep turning your mind to acceptance every time you notice yourself
                        rejecting reality 'As It Is'.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0">
                      5
                    </div>
                    <div>
                      <p className="text-sm text-foreground">Practice willingness to accept with commitment.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-secondary/50 rounded-lg p-4">
              <h4 className="font-semibold mb-3">Practice Accepting by....</h4>
              <ul className="text-sm space-y-2 list-disc list-inside text-foreground">
                <li>
                  'Describing' the situation 'As It Is' without 'Excuses', 'Blame' or 'Judgment'. Remember - 'Check in
                  with describing the Facts' (pg. 25).
                </li>
                <li>
                  Allowing sadness, grief or disappointment to be there. Acknowledge that experiencing pain is human; it
                  is the natural order of things and often validates connection and relationships. Attempting to avoid
                  pain can make it worse.
                </li>
                <li>
                  Acknowledging that what has happened 'Is': empower yourself with the choice to accept 'What Is'. To
                  bring about change, the first step is to accept.
                </li>
                <li>Turning your mind from wilfulness to willingness.</li>
                <li>Turning your mind from non-acceptance to acceptance.</li>
              </ul>
            </div>

            <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
              <h3 className="font-semibold mb-2">The Basic Principles of Accepting Reality - Turning the Mind</h3>
              <p className="text-sm text-foreground mb-3">
                Just as we may choose to travel on one road or another, we can explore the reality of the situation,
                then plan ahead for the path we choose. Disempowering ourselves by choosing not to accept often leads to
                being 'Stuck' in the emotional responses of the moment and vulnerable to the 'Auto-Pilot' and 'Unwell
                Mind'.
              </p>
            </div>

            <div className="bg-accent/50 rounded-lg p-4">
              <h4 className="font-semibold mb-3 text-center">
                Focusing on the hurt keeps evoking suffering. Focusing on the lessons promotes growth.
              </h4>
              <p className="text-sm text-center text-muted-foreground italic">
                Change is ever present in our lives. Growth is optional. Choose wisely.
              </p>
              <p className="text-sm text-center text-foreground mt-3">
                Empower yourself with choice and use the skills to assist you in choosing wisely. Create 'Towards
                Moves'.
              </p>
            </div>

            <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
              <h3 className="font-semibold mb-2 text-center text-2xl">Practice, Practice, Practice....</h3>
            </div>

            <div className="flex gap-3 flex-col sm:flex-row">
              <Button asChild className="bg-primary hover:bg-primary/90 text-white flex-1">
                <Link href="/dashboard">Return to Dashboard</Link>
              </Button>
              <Button asChild variant="outline" className="flex-1 bg-transparent">
                <Link href="/skills">Back to Skills Library</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
