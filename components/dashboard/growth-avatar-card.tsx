"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useState } from "react"
import { Sparkles, Info } from "lucide-react"
import Image from "next/image"

interface GrowthAvatarCardProps {
  avatarType: string
  level: number
  levelCredits: number
  streak: number
  longestStreak: number
  recentSkills: Array<{ skill_name: string; practiced_at: Date }>
  userId: string
}

const avatarConfig = {
  growth_tree: {
    name: "Growth Tree",
    getStage: (level: number) => {
      if (level === 0) return { stage: "Seed", image: "/images/avatar-tree-seed.jpg", color: "text-amber-600", description: "The starting stage" }
      if (level < 5) return { stage: "Sprout", image: "/images/avatar-tree-sprout.jpg", color: "text-green-500", description: "Early activity in Waypoint" }
      if (level < 10) return { stage: "Sapling", image: "/images/avatar-tree-sapling.jpg", color: "text-green-600", description: "More Waypoint activities completed" }
      if (level < 20) return { stage: "Young Tree", image: "/images/avatar-tree-young.jpg", color: "text-emerald-600", description: "Continued engagement with Waypoint" }
      return { stage: "Ancient Oak", image: "/images/avatar-tree-ancient.jpg", color: "text-emerald-700", description: "A later engagement stage" }
    },
  },
  rising_phoenix: {
    name: "Rising Phoenix",
    getStage: (level: number) => {
      if (level === 0) return { stage: "Ember", image: "/images/avatar-phoenix-ember.jpg", color: "text-orange-400", description: "The starting stage" }
      if (level < 5) return { stage: "Spark", image: "/images/avatar-phoenix-spark.jpg", color: "text-orange-500", description: "Early activity in Waypoint" }
      if (level < 10) return { stage: "Flame", image: "/images/avatar-phoenix-flame.jpg", color: "text-red-500", description: "More Waypoint activities completed" }
      if (level < 20) return { stage: "Phoenix", image: "/images/avatar-phoenix-phoenix.jpg", color: "text-red-600", description: "Continued engagement with Waypoint" }
      return { stage: "Legendary", image: "/images/avatar-phoenix-legendary.jpg", color: "text-amber-500", description: "A later engagement stage" }
    },
  },
  dragon_hatchling: {
    name: "Dragon Hatchling",
    getStage: (level: number) => {
      if (level === 0) return { stage: "Egg", image: "/images/avatar-dragon-egg.jpg", color: "text-slate-500", description: "The starting stage" }
      if (level < 5) return { stage: "Hatchling", image: "/images/avatar-dragon-hatchling.jpg", color: "text-blue-500", description: "Early activity in Waypoint" }
      if (level < 10) return { stage: "Wyrmling", image: "/images/avatar-dragon-wyrmling.jpg", color: "text-blue-600", description: "More Waypoint activities completed" }
      if (level < 20) return { stage: "Dragon", image: "/images/avatar-dragon-dragon.jpg", color: "text-indigo-600", description: "Continued engagement with Waypoint" }
      return { stage: "Ancient Dragon", image: "/images/avatar-dragon-ancient.jpg", color: "text-purple-600", description: "A later engagement stage" }
    },
  },
  crystal_sentinel: {
    name: "Crystal Sentinel",
    getStage: (level: number) => {
      if (level === 0) return { stage: "Shard", image: "/images/avatar-crystal-shard.jpg", color: "text-cyan-400", description: "The starting stage" }
      if (level < 5) return { stage: "Crystal", image: "/images/avatar-crystal-crystal.jpg", color: "text-cyan-500", description: "Early activity in Waypoint" }
      if (level < 10) return { stage: "Gem", image: "/images/avatar-crystal-gem.jpg", color: "text-blue-500", description: "More Waypoint activities completed" }
      if (level < 20) return { stage: "Sentinel", image: "/images/avatar-crystal-sentinel.jpg", color: "text-blue-600", description: "Continued engagement with Waypoint" }
      return { stage: "Radiant Guardian", image: "/images/avatar-crystal-radiant.jpg", color: "text-purple-500", description: "A later engagement stage" }
    },
  },
  spirit_fox: {
    name: "Spirit Fox",
    getStage: (level: number) => {
      if (level === 0) return { stage: "Kit", image: "/images/avatar-fox-kit.jpg", color: "text-orange-400", description: "The starting stage" }
      if (level < 5) return { stage: "Young Fox", image: "/images/avatar-fox-young.jpg", color: "text-orange-500", description: "Early activity in Waypoint" }
      if (level < 10) return { stage: "Spirit Fox", image: "/images/avatar-fox-spirit.jpg", color: "text-purple-500", description: "More Waypoint activities completed" }
      if (level < 20) return { stage: "Mystic Fox", image: "/images/avatar-fox-mystic.jpg", color: "text-purple-600", description: "Continued engagement with Waypoint" }
      return { stage: "Celestial Fox", image: "/images/avatar-fox-celestial.jpg", color: "text-indigo-500", description: "A later engagement stage" }
    },
  },
}

export default function GrowthAvatarCard({ avatarType, level, levelCredits, streak, longestStreak }: GrowthAvatarCardProps) {
  const [currentLevel, setCurrentLevel] = useState(level)
  const [credits, setCredits] = useState(levelCredits)
  const [isLevelingUp, setIsLevelingUp] = useState(false)

  const config = avatarConfig[avatarType as keyof typeof avatarConfig] || avatarConfig.growth_tree
  const avatar = config.getStage(currentLevel)

  const handleLevelUp = async () => {
    if (credits < 1 || isLevelingUp) return
    setIsLevelingUp(true)

    try {
      const response = await fetch("/api/growth/level-up", { method: "POST", headers: { "Content-Type": "application/json" } })
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
        setTimeout(() => avatarElement.classList.remove("animate-pulse"), 1500)
      }
    } catch (error) {
      console.error("[v0] Level up failed:", error)
      alert("Unable to apply the growth credit. Please try again.")
    } finally {
      setIsLevelingUp(false)
    }
  }

  return (
    <Card className="border-border/50 overflow-hidden">
      <div className="relative h-24 overflow-hidden">
        <Image src="/images/growth-journey.jpg" alt="" fill className="object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-card" />
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-3 flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold text-primary/90 uppercase tracking-wider">Growth Companion</p>
            <h3 className="text-base font-bold text-white leading-tight">Your {config.name}</h3>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild><button className="w-7 h-7 rounded-full bg-black/40 flex items-center justify-center"><Info className="w-3.5 h-3.5 text-white/70" /></button></TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-sm">Your companion changes as you complete selected Waypoint activities. Levels represent engagement with the app, not clinical recovery, health or personal worth.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <CardContent className="space-y-4 pt-4">
        <div className="flex items-center gap-4">
          <div className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden border-2 border-primary/30 bg-secondary/30">
            <Image id="growth-avatar-image" src={avatar.image || "/placeholder.svg"} alt={avatar.stage} fill className="object-contain transition-all duration-700 ease-in-out p-1" priority />
          </div>
          <div className="flex-1 min-w-0">
            <div className={`text-xl font-bold ${avatar.color}`}>{avatar.stage}</div>
            <div className="text-sm font-medium text-muted-foreground">Engagement level {currentLevel}</div>
            <div className="text-xs text-muted-foreground mt-0.5 text-pretty leading-snug">{avatar.description}</div>
          </div>
        </div>

        <div className="rounded-xl bg-secondary/30 border border-border/50 px-4 py-3 flex items-center justify-between gap-3">
          <div>
            <div className="text-xs text-muted-foreground font-medium mb-0.5">Current check-in run</div>
            <p className="text-xs text-muted-foreground text-pretty leading-snug">
              This counts consecutive recorded check-ins. Missing a day does not erase earlier entries or mean you have failed.
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-2xl font-bold text-primary">{streak}</div>
            <div className="text-xs text-muted-foreground">days</div>
            {longestStreak > 0 && <div className="text-[10px] text-muted-foreground">Longest recorded run: {longestStreak}</div>}
          </div>
        </div>

        {credits > 0 && (
          <div className="rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/25 p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-sm font-semibold text-foreground">Growth Credits</div>
                <div className="text-xs text-muted-foreground">Credits earned through selected Waypoint activities</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center"><span className="text-lg font-bold text-primary">{credits}</span></div>
            </div>
            <Button onClick={handleLevelUp} disabled={isLevelingUp} className="w-full bg-primary hover:bg-primary/90 font-semibold" size="sm">
              <Sparkles className="w-4 h-4 mr-2" />
              {isLevelingUp ? "Applying credit..." : "Apply a Growth Credit"}
            </Button>
          </div>
        )}

        <div className="text-xs text-center text-muted-foreground text-pretty">
          Growth Companion stages are a visual record of Waypoint engagement only. They do not measure recovery, wellbeing or treatment outcomes.
        </div>
      </CardContent>
    </Card>
  )
}
