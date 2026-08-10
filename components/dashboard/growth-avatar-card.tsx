"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useState } from "react"
import { Sparkles, Info } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface GrowthAvatarCardProps {
  avatarType: string
  level: number
  levelCredits: number
  streak: number
  longestStreak: number
  recentSkills: Array<{
    skill_name: string
    practiced_at: Date
  }>
  userId: string
}

const avatarConfig = {
  growth_tree: {
    name: "Growth Tree",
    getStage: (level: number) => {
      if (level === 0)
        return {
          stage: "Seed",
          image: "/images/avatar-tree-seed.jpg",
          color: "text-amber-600",
          description: "Just beginning to grow",
        }
      if (level < 5)
        return {
          stage: "Sprout",
          image: "/images/avatar-tree-sprout.jpg",
          color: "text-green-500",
          description: "Breaking through the soil",
        }
      if (level < 10)
        return {
          stage: "Sapling",
          image: "/images/avatar-tree-sapling.jpg",
          color: "text-green-600",
          description: "Growing strong and tall",
        }
      if (level < 20)
        return {
          stage: "Young Tree",
          image: "/images/avatar-tree-young.jpg",
          color: "text-emerald-600",
          description: "Branches reaching wide",
        }
      return {
        stage: "Ancient Oak",
        image: "/images/avatar-tree-ancient.jpg",
        color: "text-emerald-700",
        description: "Wise and mighty guardian",
      }
    },
  },
  rising_phoenix: {
    name: "Rising Phoenix",
    getStage: (level: number) => {
      if (level === 0)
        return {
          stage: "Ember",
          image: "/images/avatar-phoenix-ember.jpg",
          color: "text-orange-400",
          description: "A tiny flicker of hope",
        }
      if (level < 5)
        return {
          stage: "Spark",
          image: "/images/avatar-phoenix-spark.jpg",
          color: "text-orange-500",
          description: "Growing brighter each day",
        }
      if (level < 10)
        return {
          stage: "Flame",
          image: "/images/avatar-phoenix-flame.jpg",
          color: "text-red-500",
          description: "Burning with determination",
        }
      if (level < 20)
        return {
          stage: "Phoenix",
          image: "/images/avatar-phoenix-phoenix.jpg",
          color: "text-red-600",
          description: "Rising from challenges",
        }
      return {
        stage: "Legendary",
        image: "/images/avatar-phoenix-legendary.jpg",
        color: "text-amber-500",
        description: "Eternal flame of transformation",
      }
    },
  },
  dragon_hatchling: {
    name: "Dragon Hatchling",
    getStage: (level: number) => {
      if (level === 0)
        return {
          stage: "Egg",
          image: "/images/avatar-dragon-egg.jpg",
          color: "text-slate-500",
          description: "Potential waiting to hatch",
        }
      if (level < 5)
        return {
          stage: "Hatchling",
          image: "/images/avatar-dragon-hatchling.jpg",
          color: "text-blue-500",
          description: "Newly emerged and curious",
        }
      if (level < 10)
        return {
          stage: "Wyrmling",
          image: "/images/avatar-dragon-wyrmling.jpg",
          color: "text-blue-600",
          description: "Learning to fly and roar",
        }
      if (level < 20)
        return {
          stage: "Dragon",
          image: "/images/avatar-dragon-dragon.jpg",
          color: "text-indigo-600",
          description: "Powerful and confident",
        }
      return {
        stage: "Ancient Dragon",
        image: "/images/avatar-dragon-ancient.jpg",
        color: "text-purple-600",
        description: "Legendary strength and wisdom",
      }
    },
  },
  crystal_sentinel: {
    name: "Crystal Sentinel",
    getStage: (level: number) => {
      if (level === 0)
        return {
          stage: "Shard",
          image: "/images/avatar-crystal-shard.jpg",
          color: "text-cyan-400",
          description: "A fragment of clarity",
        }
      if (level < 5)
        return {
          stage: "Crystal",
          image: "/images/avatar-crystal-crystal.jpg",
          color: "text-cyan-500",
          description: "Taking beautiful form",
        }
      if (level < 10)
        return {
          stage: "Gem",
          image: "/images/avatar-crystal-gem.jpg",
          color: "text-blue-500",
          description: "Shining with inner light",
        }
      if (level < 20)
        return {
          stage: "Sentinel",
          image: "/images/avatar-crystal-sentinel.jpg",
          color: "text-blue-600",
          description: "Guardian of wisdom",
        }
      return {
        stage: "Radiant Guardian",
        image: "/images/avatar-crystal-radiant.jpg",
        color: "text-purple-500",
        description: "Beacon of clarity and insight",
      }
    },
  },
  spirit_fox: {
    name: "Spirit Fox",
    getStage: (level: number) => {
      if (level === 0)
        return {
          stage: "Kit",
          image: "/images/avatar-fox-kit.jpg",
          color: "text-orange-400",
          description: "Playful and learning",
        }
      if (level < 5)
        return {
          stage: "Young Fox",
          image: "/images/avatar-fox-young.jpg",
          color: "text-orange-500",
          description: "Quick and adaptable",
        }
      if (level < 10)
        return {
          stage: "Spirit Fox",
          image: "/images/avatar-fox-spirit.jpg",
          color: "text-purple-500",
          description: "Graceful and ethereal",
        }
      if (level < 20)
        return {
          stage: "Mystic Fox",
          image: "/images/avatar-fox-mystic.jpg",
          color: "text-purple-600",
          description: "Wise and mysterious",
        }
      return {
        stage: "Celestial Fox",
        image: "/images/avatar-fox-celestial.jpg",
        color: "text-indigo-500",
        description: "Dancing among the stars",
      }
    },
  },
}

export default function GrowthAvatarCard({
  avatarType,
  level,
  levelCredits,
  streak,
  longestStreak,
  recentSkills,
  userId,
}: GrowthAvatarCardProps) {
  const [currentLevel, setCurrentLevel] = useState(level)
  const [credits, setCredits] = useState(levelCredits)
  const [isLevelingUp, setIsLevelingUp] = useState(false)

  const config = avatarConfig[avatarType as keyof typeof avatarConfig] || avatarConfig.growth_tree
  const avatar = config.getStage(currentLevel)

  const getStreakMessage = (currentStreak: number, longest: number) => {
    if (currentStreak === 0) return "Start your journey today"
    if (currentStreak === 1) {
      if (longest > 1) return "Every new beginning is brave. Your past progress proves you can do this again."
      return "Day one is a victory"
    }
    if (currentStreak < longest && longest > 3) {
      return `You've done ${longest} days before, you can reach it again. Progress isn't perfect, it's persistent.`
    }
    if (currentStreak === longest && currentStreak > 1) return "New personal best! Keep it going"
    if (currentStreak < 7) return "Building momentum"
    if (currentStreak < 30) return "Strong consistency"
    return "Incredible dedication"
  }

  const handleLevelUp = async () => {
    if (credits < 1 || isLevelingUp) return

    setIsLevelingUp(true)

    try {
      const response = await fetch("/api/growth/level-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.details || "Failed to level up")
      }

      const result = await response.json()
      setCurrentLevel(result.newLevel)
      setCredits(result.remainingCredits)

      const avatarElement = document.getElementById("growth-avatar-image")
      if (avatarElement) {
        avatarElement.classList.add("animate-pulse")
        avatarElement.style.filter = "drop-shadow(0 0 20px rgba(34, 197, 94, 0.6))"
        setTimeout(() => {
          avatarElement.classList.remove("animate-pulse")
          avatarElement.style.filter = ""
        }, 1500)
      }
    } catch (error) {
      console.error("[v0] Level up failed:", error)
      alert("Failed to level up. Please try again.")
    } finally {
      setIsLevelingUp(false)
    }
  }

  const streakMessage = getStreakMessage(streak, longestStreak)

  return (
    <Card className="border-border/50 overflow-hidden">
      {/* Cinematic header strip */}
      <div className="relative h-24 overflow-hidden">
        <Image
          src="/images/growth-journey.jpg"
          alt=""
          fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-card" />
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-3 flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold text-primary/90 uppercase tracking-wider">Growth Companion</p>
            <h3 className="text-base font-bold text-white leading-tight">Your {config.name}</h3>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="w-7 h-7 rounded-full bg-black/40 flex items-center justify-center">
                  <Info className="w-3.5 h-3.5 text-white/70" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-sm">
                  Grow your {config.name.toLowerCase()} by completing daily check-ins and finishing modules in your My
                  Journey plan. Each activity earns you level credits!
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <CardContent className="space-y-4 pt-4">
        {/* Avatar display */}
        <div className="flex items-center gap-4">
          <div className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden border-2 border-primary/30 bg-secondary/30">
            <Image
              id="growth-avatar-image"
              src={avatar.image || "/placeholder.svg"}
              alt={avatar.stage}
              fill
              className="object-contain transition-all duration-700 ease-in-out p-1"
              style={{ filter: "brightness(1.1) contrast(1.2)" }}
              priority
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className={`text-xl font-bold ${avatar.color}`}>{avatar.stage}</div>
            <div className="text-sm font-medium text-muted-foreground">Level {currentLevel}</div>
            <div className="text-xs text-muted-foreground mt-0.5 text-pretty leading-snug">{avatar.description}</div>
          </div>
        </div>

        {/* Streak */}
        <div className="rounded-xl bg-secondary/30 border border-border/50 px-4 py-3 flex items-center justify-between gap-3">
          <div>
            <div className="text-xs text-muted-foreground font-medium mb-0.5">Check-in Streak</div>
            <p className="text-xs text-primary/80 italic text-pretty leading-snug">{streakMessage}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-2xl font-bold text-primary">{streak}</div>
            <div className="text-xs text-muted-foreground">days</div>
            {longestStreak > streak && <div className="text-[10px] text-muted-foreground">Best: {longestStreak}</div>}
          </div>
        </div>

        {credits > 0 && (
          <div className="rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/25 p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-sm font-semibold text-foreground">Growth Credits</div>
                <div className="text-xs text-muted-foreground">Ready to level up</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                <span className="text-lg font-bold text-primary">{credits}</span>
              </div>
            </div>
            <Button
              onClick={handleLevelUp}
              disabled={isLevelingUp}
              className="w-full bg-primary hover:bg-primary/90 font-semibold"
              size="sm"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {isLevelingUp ? "Leveling Up..." : "Level Up!"}
            </Button>
          </div>
        )}

        <div className="text-xs text-center text-muted-foreground text-pretty">
          {credits > 0
            ? `You've earned growth credits! Apply them to level up your ${config.name.toLowerCase()}.`
            : `Your ${config.name.toLowerCase()} grows as you practice skills, complete modules, and build resilience`}
        </div>
      </CardContent>
    </Card>
  )
}
