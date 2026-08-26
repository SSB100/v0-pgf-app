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
        skill: "Creating Space: STOP & TIP",
        reason: "Your recent urge ratings were on the higher end of the scale",
        description: "A DBT-informed module on pausing before action and optional body-based ways of working with high intensity.",
        link: "/journey/learn/stop-skill",
      },
      {
        skill: "Grounding, Breath, RAIN & Urge Surfing",
        reason: "You recorded stronger urges recently",
        description: "Several present-moment practices for noticing an urge without automatically following it.",
        link: "/journey/learn/grounding-and-urge-surfing",
      },
    )
  }

  if (avgMood !== null && avgMood <= 4) {
    suggestions.push(
      {
        skill: "Opposite Action",
        reason: "Your recent mood ratings were toward the lower end of the scale",
        description: "A DBT-informed skill for considering whether a different action may be useful when an emotional urge does not fit the facts or your goals.",
        link: "/journey/learn/opposite-action",
      },
      {
        skill: "ABC PLEASE",
        reason: "Lower mood ratings can be a useful prompt to review basic wellbeing routines",
        description: "A DBT-informed module connecting physical foundations, positive experiences and achievable mastery-building activities.",
        link: "/journey/learn/abc-please",
      },
    )
  }

  if (
    commonEmotions.some((emotion) => ["Anxious", "Scared", "Angry", "Sad", "Frustrated", "Worried"].includes(emotion)) ||
    ["Anxious", "Scared", "Angry", "Sad", "Frustrated", "Worried"].includes(awareness?.emotion)
  ) {
    suggestions.push(
      {
        skill: "Grounding, Breath, RAIN & Urge Surfing",
        reason: "You have recorded some difficult emotions",
        description: "A set of mindfulness-based ways to orient attention and create space around emotions, thoughts or urges.",
        link: "/journey/learn/grounding-and-urge-surfing",
      },
      {
        skill: "ACCEPTS & IMPROVE",
        reason: "You have recorded some difficult emotions",
        description: "A DBT-informed menu of short-term options for making a difficult period more manageable.",
        link: "/journey/learn/accepts-improve",
      },
    )
  }

  if (problems?.patterns) {
    suggestions.push({
      skill: "Six-Step Problem Solving",
      reason: "You recorded patterns you want to understand or change",
      description: "A structured framework for defining a solvable problem, comparing options and choosing a concrete next step.",
      link: "/journey/learn/problem-solving",
    })
  }

  if (avgMood !== null && avgMood <= 5 && avgUrges !== null && avgUrges >= 6) {
    suggestions.push({
      skill: "Reality Acceptance",
      reason: "Your recent check-ins included lower mood and stronger urges",
      description: "An acceptance-based module for facts that cannot be changed right now while preserving boundaries, safety and available action.",
      link: "/journey/learn/reality-acceptance",
    })
  }

  const hasPersonalisedSuggestions = suggestions.length > 0

  if (!hasPersonalisedSuggestions) {
    suggestions.push(
      {
        skill: "Creating Space: STOP & TIP",
        reason: "A general pause-and-observe option",
        description: "A short framework for creating space before deciding what to do next.",
        link: "/journey/learn/stop-skill",
      },
      {
        skill: "Mindfulness Foundations",
        reason: "A general awareness option",
        description: "Learn Observe, Describe and Participate, plus the DBT ‘How’ skills for bringing attention to the present.",
        link: "/journey/learn/mindfulness-foundations",
      },
      {
        skill: "DEAR MAN",
        reason: "A general communication option",
        description: "A DBT-informed structure for making a request, saying no or setting a boundary.",
        link: "/journey/learn/dear-man",
      },
    )
  }

  const uniqueSuggestions = Array.from(new Map(suggestions.map((item) => [item.skill, item])).values()).slice(0, 3)

  return (
    <Card className="overflow-hidden border-border/50">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/images/dashboard-skills.jpg" alt="" fill className="object-cover object-center opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-card via-card/90 to-card/70" />
        </div>
        <CardHeader className="relative pb-3">
          <CardTitle className="flex items-center gap-2.5 text-lg font-bold text-foreground">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-primary/25 bg-primary/15"><BookOpen className="size-4 text-primary" /></div>
            Modules that may be useful next
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {hasPersonalisedSuggestions
              ? "These suggestions are shaped by information you recorded. They are not clinical recommendations, diagnoses or a substitute for individual professional advice."
              : "These are general starting points rather than personalised suggestions. They are not clinical recommendations, diagnoses or a substitute for individual professional advice."}
          </p>
        </CardHeader>
      </div>

      <CardContent className="space-y-4 pt-0">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {uniqueSuggestions.map((suggestion) => (
            <div key={suggestion.skill} className="flex flex-col rounded-xl border border-border/60 bg-secondary/20 p-4 transition-all hover:border-primary/40 hover:bg-secondary/40">
              <div className="mb-3 flex items-start gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10"><BookOpen className="size-4 text-primary" /></div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold leading-tight text-foreground">{suggestion.skill}</h3>
                  <p className="mt-0.5 text-[11px] font-medium text-primary/70">Why it is being shown</p>
                </div>
              </div>
              <p className="mb-2 text-xs leading-relaxed text-muted-foreground">{suggestion.reason}</p>
              <p className="mb-4 flex-1 text-pretty text-sm leading-relaxed text-muted-foreground">{suggestion.description}</p>
              <Link href={suggestion.link} className="inline-flex min-h-10 items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary/80">
                Explore module <ArrowRight className="size-3.5" />
              </Link>
            </div>
          ))}
        </div>

        <Link href="/journey" className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-primary hover:underline">
          Browse all Journey modules <ArrowRight className="size-4" />
        </Link>
      </CardContent>
    </Card>
  )
}
