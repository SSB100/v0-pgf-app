"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, ArrowRight, Gamepad2, Wine, Pill, Brain } from "lucide-react"

interface JourneyTypeSelectorProps {
  onJourneySelected: (groupId: string) => void
  isLoading?: boolean
}

const JOURNEY_OPTIONS = [
  {
    id: "gambling",
    label: "Gambling Recovery",
    description: "Connect with others overcoming gambling habits",
    icon: Users,
    color: "from-red-500 to-orange-500",
  },
  {
    id: "alcohol",
    label: "Alcohol Recovery",
    description: "Support for those on the journey to sobriety",
    icon: Wine,
    color: "from-amber-500 to-orange-500",
  },
  {
    id: "substances",
    label: "Substance Recovery",
    description: "Connect with others overcoming substance use",
    icon: Pill,
    color: "from-green-500 to-emerald-500",
  },
  {
    id: "gaming",
    label: "Gaming Recovery",
    description: "Support for managing gaming habits",
    icon: Gamepad2,
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "mental_health",
    label: "Mental Health Support",
    description: "Connect with others working on mental wellbeing",
    icon: Brain,
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "personal_growth",
    label: "Personal Growth",
    description: "Support for personal development and wellbeing",
    icon: Users,
    color: "from-teal-500 to-blue-500",
  },
]

export default function JourneyTypeSelector({ onJourneySelected, isLoading = false }: JourneyTypeSelectorProps) {
  const [isSelecting, setIsSelecting] = useState(false)

  async function handleSelect(journeyType: string) {
    setIsSelecting(true)
    try {
      const response = await fetch("/api/community/group/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ journeyType }),
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.error || "Failed to join group")
        setIsSelecting(false)
        return
      }

      if (!data.groupId) {
        alert("Could not retrieve group. Please try again.")
        setIsSelecting(false)
        return
      }

      // Pass the actual groupId back so we can redirect correctly
      onJourneySelected(data.groupId)
    } catch (err) {
      alert("An error occurred. Please try again.")
      setIsSelecting(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-2 border-primary/20 shadow-lg bg-gradient-to-br from-primary/5 to-primary/10">
        <CardHeader>
          <CardTitle className="text-2xl">Choose Your Support Community</CardTitle>
          <CardDescription>
            Select the group that matches your journey. You can switch groups anytime.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {JOURNEY_OPTIONS.map((option) => {
          const Icon = option.icon
          return (
            <button
              key={option.id}
              onClick={() => handleSelect(option.id)}
              disabled={isSelecting || isLoading}
              className="group relative overflow-hidden rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Card className="relative h-full border-2 border-border/50 bg-card group-hover:border-primary group-hover:bg-primary transition-all duration-300 shadow-md group-hover:shadow-xl">
                <CardContent className="h-full flex flex-col justify-between p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Icon className="w-8 h-8 text-primary group-hover:text-white transition-colors" />
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-white opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0" />
                  </div>

                  <div className="text-left">
                    <h3 className="font-bold text-lg mb-1 text-foreground group-hover:text-white transition-colors">
                      {option.label}
                    </h3>
                    <p className="text-sm text-muted-foreground group-hover:text-white/80 transition-colors">
                      {option.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </button>
          )
        })}
      </div>
    </div>
  )
}
