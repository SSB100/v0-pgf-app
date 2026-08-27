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
  waka_journey: {
    name: "Waka",
    getStage: (level: number) => {
      if (level === 0) return { stage: "Shaped", image: "/images/avatar-waka-01.webp", color: "text-primary", description: "The starting stage" }
      if (level < 3) return { stage: "Bound", image: "/images/avatar-waka-02.webp", color: "text-primary", description: "Early activity in Waypoint" }
      if (level < 5) return { stage: "Ready", image: "/images/avatar-waka-03.webp", color: "text-primary", description: "More Waypoint activities completed" }
      if (level < 7) return { stage: "Prepared", image: "/images/avatar-waka-04.webp", color: "text-primary", description: "Your engagement journey is taking shape" }
      if (level < 9) return { stage: "Launched", image: "/images/avatar-waka-05.webp", color: "text-primary", description: "Continued engagement with Waypoint" }
      if (level < 11) return { stage: "Carrying", image: "/images/avatar-waka-06.webp", color: "text-primary", description: "Ongoing activity across Waypoint" }
      if (level < 14) return { stage: "Steady", image: "/images/avatar-waka-07.webp", color: "text-primary", description: "A growing record of engagement" }
      if (level < 17) return { stage: "Guided", image: "/images/avatar-waka-08.webp", color: "text-primary", description: "Further engagement with Waypoint" }
      if (level < 20) return { stage: "Travelling", image: "/images/avatar-waka-09.webp", color: "text-primary", description: "A later engagement stage" }
      return { stage: "Wayfound", image: "/images/avatar-waka-10.webp", color: "text-primary", description: "The current final visual stage" }
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
    <Card className="overflow-hidden border-border/50 shadow-sm">
      <div className="relative overflow-hidden border-b border-border/40 bg-gradient-to-br from-primary/15 via-card to-secondary/40 px-3 pb-3 pt-3">
        <div className="pointer-events-none absolute -right-16 -top-16 size-44 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-16 size-44 rounded-full bg-primary/10 blur-3xl" />

        <div className="relative flex items-start justify-between gap-4 px-1">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Growth &amp; Progress</p>
            <h3 className="mt-0.5 text-lg font-bold leading-tight text-foreground">{progressOnly ? "Progress only" : `Your ${config.name}`}</h3>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border/50 bg-background/75 shadow-sm backdrop-blur" aria-label="About Growth and Progress">
                  <Info className="size-3.5 text-muted-foreground" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-sm">Growth Credits and levels represent selected Waypoint engagement, not clinical recovery, health or personal worth. A visual companion is optional.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="relative mt-3 flex justify-center">
          {progressOnly ? (
            <div className="flex h-48 w-full items-center justify-center rounded-[1.75rem] border border-primary/25 bg-background/80 shadow-lg ring-2 ring-background/50">
              <Sparkles className="size-14 text-primary" />
            </div>
          ) : (
            <div className="relative h-52 w-full overflow-hidden rounded-[1.75rem] border border-primary/25 bg-background shadow-lg ring-2 ring-background/60">
              <Image
                id="growth-avatar-image"
                src={avatar.image || "/placeholder.svg"}
                alt={avatar.stage}
                fill
                sizes="(min-width: 1280px) 420px, 100vw"
                className="rounded-[1.75rem] object-contain transition-all duration-700 ease-in-out"
                priority
              />
            </div>
          )}
        </div>
      </div>

      <CardContent className="space-y-4 pt-3">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-2xl border border-border/50 bg-secondary/30 px-4 py-3.5">
          <div className="min-w-0">
            <div className={`text-xl font-bold ${progressOnly ? "text-primary" : avatar.color}`}>{progressOnly ? `Level ${currentLevel}` : avatar.stage}</div>
            <div className="mt-0.5 text-sm font-medium text-muted-foreground">Engagement level {currentLevel}</div>
            <div className="mt-1 text-pretty text-xs leading-relaxed text-muted-foreground">
              {progressOnly ? "Your engagement progress without a character or creature." : avatar.description}
            </div>
          </div>
          <div className="min-w-[92px] flex-shrink-0 text-right">
            <div className="mb-1 text-xs font-medium text-muted-foreground">Current Daily Reflection run</div>
            <div className="flex items-baseline justify-end gap-1">
              <div className="text-2xl font-bold text-primary">{streak}</div>
              <div className="text-xs text-muted-foreground">days</div>
            </div>
            {longestStreak > 0 && <div className="mt-0.5 text-[10px] text-muted-foreground">Longest recorded run: {longestStreak}</div>}
          </div>
        </div>

        {credits > 0 && (
          <div className="rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/15 to-primary/5 p-4">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-foreground">Growth Credits</div>
                <div className="text-xs text-muted-foreground">Credits earned through selected Waypoint activities</div>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/30 bg-primary/20"><span className="text-lg font-bold text-primary">{credits}</span></div>
            </div>
            <Button onClick={handleLevelUp} disabled={isLevelingUp} className="w-full bg-primary font-semibold hover:bg-primary/90" size="sm">
              <Sparkles className="mr-2 h-4 w-4" />
              {isLevelingUp ? "Applying credit..." : "Apply a Growth Credit"}
            </Button>
          </div>
        )}

        <div className="text-pretty text-center text-xs text-muted-foreground">
          {progressOnly
            ? "Progress-only levels are a record of Waypoint engagement. They do not measure recovery, wellbeing or treatment outcomes."
            : "Growth Companion stages are a visual record of Waypoint engagement only. They do not measure recovery, wellbeing or treatment outcomes."}
        </div>
      </CardContent>
    </Card>
  )
}
