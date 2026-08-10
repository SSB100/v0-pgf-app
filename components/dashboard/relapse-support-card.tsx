"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Heart } from "lucide-react"

interface RelapseSupportCardProps {
  journeyType: string
  daysSinceRelapse: number
  todayMood?: number
}

export default function RelapseSupportCard({ journeyType, daysSinceRelapse, todayMood }: RelapseSupportCardProps) {
  const getBehaviorLabel = () => {
    switch (journeyType) {
      case "gambling":
        return "gambling"
      case "alcohol":
        return "drinking"
      case "substances":
        return "using"
      case "gaming":
        return "excessive gaming"
      default:
        return "the challenging behavior"
    }
  }

  const getEncouragingMessages = () => {
    if (daysSinceRelapse === 0) {
      return {
        title: "You're Still on Your Journey",
        messages: [
          "Recovery isn't about being perfect - it's about getting back up every time you fall.",
          "This doesn't erase all the progress you've made. Each day clean was a real achievement.",
          "What matters most is that you're here right now, facing this honestly.",
          "Many people in recovery experience setbacks. You're not alone in this.",
        ],
        actionMessage: "Let's focus on what you can do right now to support yourself.",
      }
    } else if (daysSinceRelapse === 1) {
      return {
        title: "One Day at a Time",
        messages: [
          "You made it through today without " + getBehaviorLabel() + ". That's a victory worth celebrating.",
          "Every single day is a fresh start and a new opportunity to choose your recovery.",
          "The fact that you're back on track shows incredible strength and resilience.",
        ],
        actionMessage: "Keep building on this momentum. You're doing great.",
      }
    } else if (daysSinceRelapse <= 7) {
      return {
        title: "Building Momentum",
        messages: [
          `${daysSinceRelapse} days is real progress. You're proving to yourself that you can do this.`,
          "Each day you're building stronger patterns and reinforcing your commitment to recovery.",
          "Notice how you're feeling better and stronger with each passing day.",
        ],
        actionMessage: "Keep using your coping skills and reaching out for support.",
      }
    } else {
      return {
        title: "You're Doing Amazing",
        messages: [
          `${daysSinceRelapse} days clean is a significant achievement. You should be proud of yourself.`,
          "You've shown that you have what it takes to maintain your recovery.",
          "Every day you're becoming stronger and more confident in your ability to stay on track.",
        ],
        actionMessage: "Continue practicing the skills that have been working for you.",
      }
    }
  }

  const messages = getEncouragingMessages()

  return (
    <Card className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-2 border-blue-200 shadow-lg">
      <CardContent className="pt-6 space-y-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-foreground mb-2">{messages.title}</h3>
            <div className="space-y-2">
              {messages.messages.map((msg, i) => (
                <p key={i} className="text-sm text-foreground/80 leading-relaxed">
                  {msg}
                </p>
              ))}
            </div>
          </div>
        </div>

        {daysSinceRelapse === 0 && todayMood && todayMood < 5 && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <p className="text-xs text-orange-800 leading-relaxed">
              <strong>Need extra support right now?</strong> Consider reaching out to your peer supporter or using one
              of your emergency coping skills. You don't have to go through this alone.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
