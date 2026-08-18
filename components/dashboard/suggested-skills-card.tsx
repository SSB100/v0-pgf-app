import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, BookOpen } from "lucide-react"

interface SuggestedSkillsCardProps {
  awareness: any
  problems: any
  values: any[]
  weeklyCheckins?: any[]
}

type SkillSuggestion = {
  skill: string
  reason: string
  description: string
  link: string
}

export default function SuggestedSkillsCard({ awareness, problems, weeklyCheckins = [] }: SuggestedSkillsCardProps) {
  const suggestions: SkillSuggestion[] = []

  const moodRatings = weeklyCheckins.filter((checkin: any) => typeof checkin.mood_rating === "number").map((checkin: any) => checkin.mood_rating)
  const urgeStrengths = weeklyCheckins.filter((checkin: any) => typeof checkin.urge_strength === "number").map((checkin: any) => checkin.urge_strength)
  const avgMood = moodRatings.length ? moodRatings.reduce((a: number, b: number) => a + b, 0) / moodRatings.length : null
  const avgUrges = urgeStrengths.length ? urgeStrengths.reduce((a: number, b: number) => a + b, 0) / urgeStrengths.length : null

  const allEmotions = weeklyCheckins.flatMap((checkin: any) => checkin.emotions_felt || [])
  const emotionCounts: Record<string, number> = {}
  allEmotions.forEach((emotion: string) => { emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1 })
  const commonEmotions = Object.entries(emotionCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([emotion]) => emotion)

  if ((avgUrges !== null && avgUrges >= 7) || awareness?.emotion_intensity >= 7) {
    suggestions.push(
      {
        skill: "TIP Skills",
        reason: "Your recent urge ratings were on the higher end of the scale",
        description: "A DBT-informed set of body-based techniques that some people use when emotional intensity feels high.",
        link: "/skills/tip",
      },
      {
        skill: "STOP Skill",
        reason: "You recorded stronger urges recently",
        description: "A short pause-and-observe framework that can create time before deciding what to do next.",
        link: "/skills/stop",
      },
    )
  }

  if (avgMood !== null && avgMood <= 4) {
    suggestions.push(
      {
        skill: "Opposite Action",
        reason: "Your recent mood ratings were toward the lower end of the scale",
        description: "A DBT-informed skill for considering whether a different action may be useful when an emotional urge does not fit the facts or your goals.",
        link: "/skills/opposite-action",
      },
      {
        skill: "PLEASE Skills",
        reason: "Lower mood ratings can be a useful prompt to review basic wellbeing routines",
        description: "A DBT-informed reminder to consider physical health, eating, sleep, substances and movement as factors that can affect emotional wellbeing.",
        link: "/skills/please",
      },
    )
  }

  if (
    commonEmotions.some((emotion) => ["Anxious", "Scared", "Angry", "Sad", "Frustrated", "Worried"].includes(emotion)) ||
    ["Anxious", "Scared", "Angry", "Sad", "Frustrated", "Worried"].includes(awareness?.emotion)
  ) {
    suggestions.push(
      {
        skill: "RAIN Mindfulness",
        reason: "You have recorded some difficult emotions",
        description: "A mindfulness-based reflection practice: Recognise, Allow, Investigate and Nurture.",
        link: "/skills/rain",
      },
      {
        skill: "IMPROVE Skills",
        reason: "You have recorded some difficult emotions",
        description: "A DBT-informed collection of options for making a difficult moment more manageable.",
        link: "/skills/improve",
      },
    )
  }

  if (problems?.patterns) {
    suggestions.push({
      skill: "Problem Solving",
      reason: "You recorded patterns you want to understand or change",
      description: "A structured framework for defining a problem, considering options and choosing a next step.",
      link: "/skills/interpersonal/problem-solving",
    })
  }

  if (avgMood !== null && avgMood <= 5 && avgUrges !== null && avgUrges >= 6) {
    suggestions.push({
      skill: "Reality Acceptance",
      reason: "Your recent check-ins included lower mood and stronger urges",
      description: "An acceptance-based skill for situations that cannot be changed right now. It is not about approving of what happened or giving up on change.",
      link: "/skills/reality-acceptance",
    })
  }

  if (suggestions.length === 0) {
    suggestions.push(
      {
        skill: "STOP Skill",
        reason: "A general pause-and-observe option",
        description: "A short framework for creating space before deciding what to do next.",
        link: "/skills/stop",
      },
      {
        skill: "RAIN Mindfulness",
        reason: "A general awareness option",
        description: "A mindfulness-based practice for noticing emotions and urges with less judgement.",
        link: "/skills/rain",
      },
      {
        skill: "DEAR MAN",
        reason: "A general communication option",
        description: "A DBT-informed structure for making a request or setting a boundary.",
        link: "/skills/interpersonal/dear-man",
      },
    )
  }

  const uniqueSuggestions = Array.from(new Map(suggestions.map((item) => [item.skill, item])).values()).slice(0, 6)

  return (
    <Card className="border-border/50 overflow-hidden">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/images/dashboard-skills.jpg" alt="" fill className="object-cover object-center opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-card via-card/90 to-card/70" />
        </div>
        <CardHeader className="relative pb-3">
          <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/25 flex items-center justify-center flex-shrink-0"><BookOpen className="w-4 h-4 text-primary" /></div>
            Skills You Could Explore
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            These are simple app suggestions based on information you recorded. They are not clinical recommendations, diagnoses or a substitute for individual professional advice.
          </p>
        </CardHeader>
      </div>

      <CardContent className="pt-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {uniqueSuggestions.map((suggestion) => (
            <div key={suggestion.skill} className="flex flex-col rounded-xl border border-border/60 bg-secondary/20 hover:bg-secondary/40 hover:border-primary/40 transition-all p-4">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0"><BookOpen className="w-4 h-4 text-primary" /></div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm text-foreground leading-tight">{suggestion.skill}</h3>
                  <p className="text-[11px] text-primary/70 font-medium mt-0.5">Why it is being shown</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mb-2 leading-relaxed">{suggestion.reason}</p>
              <p className="text-sm text-muted-foreground mb-4 text-pretty leading-relaxed flex-1">{suggestion.description}</p>
              <Link href={suggestion.link} className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
                Explore this skill <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
