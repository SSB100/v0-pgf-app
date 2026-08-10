import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, BookOpen } from "lucide-react"

interface SuggestedSkillsCardProps {
  awareness: any
  problems: any
  values: any[]
  weeklyCheckins?: any[]
}

export default function SuggestedSkillsCard({ awareness, problems, weeklyCheckins = [] }: SuggestedSkillsCardProps) {
  const suggestions = []

  // Analyze weekly check-ins for patterns
  const hasRecentCheckins = weeklyCheckins && weeklyCheckins.length > 0
  let avgMood = 5
  let avgUrges = 5
  let commonEmotions: string[] = []

  if (hasRecentCheckins) {
    const moodRatings = weeklyCheckins.filter((c: any) => c.mood_rating).map((c: any) => c.mood_rating)
    const urgeStrengths = weeklyCheckins.filter((c: any) => c.urge_strength).map((c: any) => c.urge_strength)

    if (moodRatings.length > 0) avgMood = moodRatings.reduce((a: number, b: number) => a + b, 0) / moodRatings.length
    if (urgeStrengths.length > 0)
      avgUrges = urgeStrengths.reduce((a: number, b: number) => a + b, 0) / urgeStrengths.length

    // Collect all emotions from the week
    const allEmotions = weeklyCheckins.flatMap((c: any) => c.emotions_felt || [])
    const emotionCounts: { [key: string]: number } = {}
    allEmotions.forEach((emotion: string) => {
      emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1
    })
    commonEmotions = Object.entries(emotionCounts)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 3)
      .map(([emotion]) => emotion)
  }

  // HIGH URGES - Suggest crisis skills
  if (avgUrges >= 7 || awareness?.emotion_intensity >= 7) {
    suggestions.push({
      skill: "TIP Skills",
      reason: "High urge intensity detected",
      description: "Quick techniques to reduce intense emotions and urges in the moment",
      icon: "🧊",
      link: "/skills/tip",
    })

    suggestions.push({
      skill: "STOP Skill",
      reason: "Crisis intervention needed",
      description: "Create space between urge and action to make wise choices",
      icon: "🛑",
      link: "/skills/stop",
    })
  }

  // LOW MOOD - Suggest emotion regulation
  if (avgMood <= 4) {
    suggestions.push({
      skill: "Opposite Action",
      reason: "Low mood patterns",
      description: "Change your emotions by acting opposite to the urge",
      icon: "↔️",
      link: "/skills/opposite-action",
    })

    suggestions.push({
      skill: "PLEASE Skills",
      reason: "Build resilience",
      description: "Take care of your mind by taking care of your body",
      icon: "🌟",
      link: "/skills/please",
    })
  }

  // NEGATIVE EMOTIONS (Anxiety, Fear, Anger, Sadness)
  if (
    commonEmotions.some((e) => ["Anxious", "Fearful", "Angry", "Sad", "Overwhelmed"].includes(e)) ||
    awareness?.emotion === "Anxious" ||
    awareness?.emotion === "Overwhelmed"
  ) {
    suggestions.push({
      skill: "RAIN Mindfulness",
      reason: "Managing difficult emotions",
      description: "Recognize, Allow, Investigate, Nurture - mindful awareness practice",
      icon: "🌧️",
      link: "/skills/rain",
    })

    suggestions.push({
      skill: "IMPROVE Skills",
      reason: "Distress tolerance needed",
      description: "Make painful moments more tolerable through positive actions",
      icon: "✨",
      link: "/skills/improve",
    })
  }

  // RELATIONSHIP/INTERPERSONAL ISSUES
  if (problems?.relationship_issues || problems?.communication_difficulties) {
    suggestions.push({
      skill: "DEAR MAN",
      reason: "Relationship challenges",
      description: "Get your needs met while maintaining relationships effectively",
      icon: "🎯",
      link: "/skills/interpersonal/dear-man",
    })

    suggestions.push({
      skill: "GIVE",
      reason: "Strengthen connections",
      description: "Build relationships through gentle, interested, validating interactions",
      icon: "🤝",
      link: "/skills/interpersonal/give",
    })
  }

  // SELF-RESPECT ISSUES
  if (awareness?.self_respect_low || problems?.boundary_issues) {
    suggestions.push({
      skill: "FAST",
      reason: "Self-respect needs attention",
      description: "Maintain your values and self-respect in interactions",
      icon: "💎",
      link: "/skills/interpersonal/fast",
    })
  }

  // STUCK IN PATTERNS
  if (problems?.recurring_issues || problems?.patterns) {
    suggestions.push({
      skill: "Problem Solving",
      reason: "Breaking old patterns",
      description: "Six-step framework to solve problems without avoidance",
      icon: "🧩",
      link: "/skills/interpersonal/problem-solving",
    })
  }

  // ACCEPTANCE NEEDED
  if (avgMood <= 5 && avgUrges >= 6) {
    suggestions.push({
      skill: "Reality Acceptance",
      reason: "Finding peace",
      description: "Let go of fighting reality to reduce suffering",
      icon: "🕊️",
      link: "/skills/reality-acceptance",
    })

    suggestions.push({
      skill: "Turning the Mind",
      reason: "Choose willingness",
      description: "Move from resistance to acceptance through intentional choice",
      icon: "🔄",
      link: "/skills/interpersonal/turning-the-mind",
    })
  }

  // If no specific needs detected, suggest foundational skills
  if (suggestions.length === 0) {
    suggestions.push(
      {
        skill: "STOP Skill",
        reason: "Essential foundation",
        description: "Pause before acting on impulses - a critical skill for everyone",
        icon: "🛑",
        link: "/skills/stop",
      },
      {
        skill: "RAIN Mindfulness",
        reason: "Build awareness",
        description: "Practice mindful awareness of urges and emotions",
        icon: "🌧️",
        link: "/skills/rain",
      },
      {
        skill: "DEAR MAN",
        reason: "Communication skills",
        description: "Essential interpersonal effectiveness for daily life",
        icon: "🎯",
        link: "/skills/interpersonal/dear-man",
      },
    )
  }

  // Remove duplicates and limit to top 6 suggestions
  const uniqueSuggestions = Array.from(new Map(suggestions.map((item) => [item.skill, item])).values()).slice(0, 6)

  return (
    <Card className="border-border/50 overflow-hidden">
      {/* Header with image backdrop */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/images/dashboard-skills.jpg" alt="" fill className="object-cover object-center opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-card via-card/90 to-card/70" />
        </div>
        <CardHeader className="relative pb-3">
          <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/25 flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-4 h-4 text-primary" />
            </div>
            Skills Suggested for You
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Based on your daily reflections, emotions, and current patterns
          </p>
        </CardHeader>
      </div>

      <CardContent className="pt-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {uniqueSuggestions.map((suggestion, i) => (
            <div
              key={i}
              className="flex flex-col rounded-xl border border-border/60 bg-secondary/20 hover:bg-secondary/40 hover:border-primary/40 transition-all p-4"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm text-foreground leading-tight">{suggestion.skill}</h3>
                  <p className="text-[11px] text-primary/70 font-medium mt-0.5">{suggestion.reason}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4 text-pretty leading-relaxed flex-1">{suggestion.description}</p>
              <Link
                href={suggestion.link}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
              >
                Learn this skill <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
