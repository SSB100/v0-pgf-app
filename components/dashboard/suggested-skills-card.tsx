import Link from "next/link"
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
        reason: "Recent urge ratings were toward the higher end",
        description: "Pause before action and consider optional body-based ways of working with high intensity.",
        link: "/journey/learn/stop-skill",
      },
      {
        skill: "Grounding, Breath, RAIN & Urge Surfing",
        reason: "You recorded stronger urges recently",
        description: "Present-moment practices for noticing an urge without automatically following it.",
        link: "/journey/learn/grounding-and-urge-surfing",
      },
    )
  }

  if (avgMood !== null && avgMood <= 4) {
    suggestions.push(
      {
        skill: "Opposite Action",
        reason: "Recent mood ratings were toward the lower end",
        description: "Consider whether a different action may be useful when an emotional urge does not fit the facts or your goals.",
        link: "/journey/learn/opposite-action",
      },
      {
        skill: "ABC PLEASE",
        reason: "Lower mood ratings can prompt a review of basic wellbeing routines",
        description: "Connect physical foundations, positive experiences and achievable mastery-building activities.",
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
        description: "Mindfulness-based ways to orient attention and create space around emotions, thoughts or urges.",
        link: "/journey/learn/grounding-and-urge-surfing",
      },
      {
        skill: "ACCEPTS & IMPROVE",
        reason: "You have recorded some difficult emotions",
        description: "A menu of short-term options for making a difficult period more manageable.",
        link: "/journey/learn/accepts-improve",
      },
    )
  }

  if (problems?.patterns) {
    suggestions.push({
      skill: "Six-Step Problem Solving",
      reason: "You recorded patterns you want to understand or change",
      description: "Define a solvable problem, compare options and choose a concrete next step.",
      link: "/journey/learn/problem-solving",
    })
  }

  if (avgMood !== null && avgMood <= 5 && avgUrges !== null && avgUrges >= 6) {
    suggestions.push({
      skill: "Reality Acceptance",
      reason: "Recent check-ins included lower mood and stronger urges",
      description: "Work with facts that cannot be changed right now while preserving boundaries, safety and available action.",
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
        description: "Observe, Describe and Participate, plus the DBT ‘How’ skills for present-moment attention.",
        link: "/journey/learn/mindfulness-foundations",
      },
      {
        skill: "DEAR MAN",
        reason: "A general communication option",
        description: "A structure for making a request, saying no or setting a boundary.",
        link: "/journey/learn/dear-man",
      },
    )
  }

  const uniqueSuggestions = Array.from(new Map(suggestions.map((item) => [item.skill, item])).values()).slice(0, 3)

  return (
    <Card className="gap-3 border-border/50 py-4">
      <CardHeader className="px-4 pb-0">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10">
              <BookOpen className="size-4 text-primary" />
            </div>
            <div className="min-w-0">
              <CardTitle className="text-base font-bold text-foreground">Modules that may be useful next</CardTitle>
              <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                {hasPersonalisedSuggestions
                  ? "These suggestions are shaped by information you recorded. They are not clinical recommendations."
                  : "These are general starting points rather than personalised suggestions. They are not clinical recommendations."}
              </p>
            </div>
          </div>
          <Link href="/journey" className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-primary hover:underline">
            Browse all <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </CardHeader>

      <CardContent className="px-4">
        <div className="grid grid-cols-1 gap-2 lg:grid-cols-3">
          {uniqueSuggestions.map((suggestion) => (
            <Link
              key={suggestion.skill}
              href={suggestion.link}
              className="group flex min-h-[118px] flex-col rounded-xl border border-border/60 bg-secondary/15 p-3 transition-colors hover:border-primary/35 hover:bg-secondary/30"
            >
              <div className="flex items-start gap-2">
                <BookOpen className="mt-0.5 size-3.5 shrink-0 text-primary" />
                <h3 className="text-xs font-semibold leading-snug text-foreground group-hover:text-primary">{suggestion.skill}</h3>
              </div>
              <p className="mt-2 line-clamp-2 text-[10px] font-medium leading-snug text-primary/75">{suggestion.reason}</p>
              <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-muted-foreground">{suggestion.description}</p>
              <span className="mt-auto pt-2 text-[11px] font-semibold text-primary">Open module →</span>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
