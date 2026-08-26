"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useState } from "react"
import { Sparkles, Info, Flame } from "lucide-react"
import Image from "next/image"

interface GrowthAvatarCardProps {
  avatarType: string
  level: number
  levelCredits: number
  streak: number
  longestStreak: number
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

  const progressOnly = avatarType === "none"
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
    <Card className="gap-0 overflow-hidden border-border/50 py-0 shadow-sm">
      <div className="relative h-16 overflow-hidden">
        <Image src="/images/growth-journey.jpg" alt="" fill className="object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/35 to-card/20" />
        <div className="absolute inset-0 flex items-center justify-between px-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/70">Growth &amp; Progress</p>
            <h3 className="text-sm font-bold leading-tight text-white">{progressOnly ? "Progress only" : config.name}</h3>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="flex size-7 items-center justify-center rounded-full bg-black/35" aria-label="About Growth and Progress">
                  <Info className="size-3.5 text-white/80" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-sm">Growth Credits and levels represent selected Waypoint engagement, not clinical recovery, health or personal worth. A visual companion is optional.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <CardContent className="space-y-3 p-4">
        <div className="flex items-center gap-3">
          {progressOnly ? (
            <div className="flex size-20 shrink-0 items-center justify-center rounded-xl border border-primary/25 bg-primary/10">
              <Sparkles className="size-7 text-primary" />
            </div>
          ) : (
            <div className="relative size-20 shrink-0 overflow-hidden rounded-xl border border-primary/25 bg-secondary/20">
              <Image id="growth-avatar-image" src={avatar.image || "/placeholder.svg"} alt={avatar.stage} fill className="object-contain p-1 transition-all duration-700 ease-in-out" priority />
            </div>
          )}

          <div className="min-w-0 flex-1">
            <div className={`truncate text-lg font-bold ${progressOnly ? "text-primary" : avatar.color}`}>{progressOnly ? `Level ${currentLevel}` : avatar.stage}</div>
            <div className="text-xs font-medium text-muted-foreground">Engagement level {currentLevel}</div>
            <div className="mt-1 line-clamp-2 text-xs leading-snug text-muted-foreground">
              {progressOnly ? "Your engagement progress without a character or creature." : avatar.description}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl border border-border/60 bg-secondary/25 px-3 py-2">
            <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground"><Flame className="size-3 text-primary" /> Check-in run</div>
            <div className="mt-0.5 flex items-baseline gap-1"><span className="text-xl font-bold text-foreground">{streak}</span><span className="text-[10px] text-muted-foreground">days</span></div>
            {longestStreak > 0 && <div className="truncate text-[9px] text-muted-foreground">Longest {longestStreak}</div>}
          </div>

          <div className="rounded-xl border border-primary/20 bg-primary/5 px-3 py-2">
            <div className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Credits waiting</div>
            <div className="mt-0.5 flex items-baseline gap-1"><span className="text-xl font-bold text-primary">{credits}</span><span className="text-[10px] text-muted-foreground">credits</span></div>
            <div className="text-[9px] text-muted-foreground">Use when you choose</div>
          </div>
        </div>

        {credits > 0 && (
          <Button onClick={handleLevelUp} disabled={isLevelingUp} className="h-9 w-full bg-primary text-xs font-semibold hover:bg-primary/90" size="sm">
            <Sparkles className="mr-1.5 size-3.5" />
            {isLevelingUp ? "Applying credit..." : "Apply a Growth Credit"}
          </Button>
        )}

        <p className="text-center text-[10px] leading-snug text-muted-foreground">
          {progressOnly ? "Levels record Waypoint engagement, not recovery." : "Companion stages record Waypoint engagement, not recovery."}
        </p>
      </CardContent>
    </Card>
  )
}
