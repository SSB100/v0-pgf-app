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
    <Card className="overflow-hidden border-primary/20 bg-card shadow-sm">
      <div className="relative overflow-hidden border-b border-border/50 bg-gradient-to-br from-primary/10 via-background to-secondary/40">
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <Image src="/images/growth-journey.jpg" alt="" fill className="object-cover object-center" priority />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/55 to-card" />

        <div className="relative grid gap-4 px-4 pb-5 pt-4 min-[380px]:px-5 sm:grid-cols-[minmax(190px,0.85fr)_minmax(0,1.15fr)] sm:items-center sm:gap-6 sm:px-6 sm:py-6 lg:grid-cols-[minmax(220px,0.8fr)_minmax(0,1.2fr)] lg:px-7 lg:py-7">
          <div className="relative mx-auto aspect-square w-[min(58vw,210px)] overflow-hidden rounded-[1.75rem] border-2 border-primary/25 bg-background/80 shadow-lg sm:mx-0 sm:w-full sm:max-w-[230px] lg:max-w-[260px]">
            <Image
              id="growth-avatar-image"
              src={avatar.image || "/placeholder.svg"}
              alt={avatar.stage}
              fill
              sizes="(max-width: 639px) 58vw, (max-width: 1023px) 230px, 260px"
              className="object-contain p-2 transition-all duration-700 ease-in-out"
              priority
            />
          </div>

          <div className="min-w-0 text-center sm:text-left">
            <div className="flex items-center justify-center gap-2 sm:justify-start">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary sm:text-xs">Your growth companion</p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="flex size-7 items-center justify-center rounded-full border border-border/60 bg-background/70" aria-label="About your growth companion">
                      <Info className="size-3.5 text-muted-foreground" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="text-sm">Your companion changes as you complete selected Waypoint activities. Levels represent engagement with the app, not clinical recovery, health or personal worth.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Your {config.name}</h2>
            <div className={`mt-1 text-xl font-bold sm:text-2xl ${avatar.color}`}>{avatar.stage}</div>
            <p className="mt-1 text-sm font-medium text-muted-foreground">Engagement level {currentLevel}</p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground sm:mx-0">{avatar.description}</p>

            <div className="mt-4 grid grid-cols-2 gap-2 sm:max-w-sm">
              <div className="rounded-xl border border-border/60 bg-background/75 px-3 py-2.5">
                <p className="text-[11px] font-medium text-muted-foreground">Current check-in run</p>
                <p className="mt-0.5 text-xl font-bold text-primary">{streak} <span className="text-xs font-medium text-muted-foreground">days</span></p>
              </div>
              <div className="rounded-xl border border-border/60 bg-background/75 px-3 py-2.5">
                <p className="text-[11px] font-medium text-muted-foreground">Longest recorded run</p>
                <p className="mt-0.5 text-xl font-bold text-foreground">{longestStreak || 0} <span className="text-xs font-medium text-muted-foreground">days</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CardContent className="space-y-4 p-4 min-[380px]:p-5 sm:p-6">
        {credits > 0 && (
          <div className="rounded-xl border border-primary/25 bg-primary/5 p-4 sm:flex sm:items-center sm:justify-between sm:gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="text-sm font-semibold text-foreground">Growth Credits</div>
                <div className="flex size-8 items-center justify-center rounded-full border border-primary/30 bg-primary/15 text-sm font-bold text-primary">{credits}</div>
              </div>
              <div className="mt-1 text-xs text-muted-foreground">Credits earned through selected Waypoint activities</div>
            </div>
            <Button onClick={handleLevelUp} disabled={isLevelingUp} className="mt-3 w-full font-semibold sm:mt-0 sm:w-auto" size="sm">
              <Sparkles className="mr-2 size-4" />
              {isLevelingUp ? "Applying credit..." : "Apply a Growth Credit"}
            </Button>
          </div>
        )}

        <p className="text-center text-[11px] leading-relaxed text-muted-foreground sm:text-left sm:text-xs">
          Your companion is a visual record of Waypoint engagement. Missing a check-in or having a difficult day does not remove earlier progress or measure recovery, wellbeing or personal worth.
        </p>
      </CardContent>
    </Card>
  )
}
