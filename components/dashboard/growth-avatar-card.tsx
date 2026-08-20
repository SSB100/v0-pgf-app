"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { BookOpenCheck, CheckCircle2, ClipboardCheck, Sparkles } from "lucide-react"
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

function getNextStageLevel(level: number) {
  if (level < 1) return 1
  if (level < 5) return 5
  if (level < 10) return 10
  if (level < 20) return 20
  return null
}

export default function GrowthAvatarCard({ avatarType, level, levelCredits, streak, longestStreak }: GrowthAvatarCardProps) {
  const [currentLevel, setCurrentLevel] = useState(level)
  const [credits, setCredits] = useState(levelCredits)
  const [isLevelingUp, setIsLevelingUp] = useState(false)

  const config = avatarConfig[avatarType as keyof typeof avatarConfig] || avatarConfig.growth_tree
  const avatar = config.getStage(currentLevel)
  const nextStageLevel = getNextStageLevel(currentLevel)

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
      <div className="grid lg:grid-cols-[minmax(270px,0.8fr)_minmax(0,1.7fr)]">
        <div className="relative min-h-[285px] overflow-hidden bg-secondary/20 sm:min-h-[320px] lg:min-h-full">
          <Image src="/images/growth-journey.jpg" alt="" fill className="object-cover object-center" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/45 to-black/75" />

          <div className="relative flex h-full min-h-[285px] flex-col justify-between p-5 sm:min-h-[320px] sm:p-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/75">Your Growth Companion</p>
              <h3 className="mt-1 text-xl font-bold text-white">{config.name}</h3>
            </div>

            <div className="flex flex-col items-center py-4 text-center">
              <div className="relative size-40 overflow-hidden rounded-3xl border border-white/30 bg-background/90 shadow-xl sm:size-44">
                <Image
                  id="growth-avatar-image"
                  src={avatar.image || "/placeholder.svg"}
                  alt={avatar.stage}
                  fill
                  className="object-contain p-2 transition-all duration-700 ease-in-out"
                  priority
                />
              </div>
              <p className={`mt-3 text-2xl font-bold ${avatar.color}`}>{avatar.stage}</p>
              <p className="mt-0.5 text-xs text-white/75">Engagement level {currentLevel}</p>
            </div>

            <div className="rounded-xl border border-white/15 bg-black/25 px-3 py-2.5 text-center backdrop-blur-sm">
              <p className="text-xs text-white/80">{avatar.description}</p>
              {nextStageLevel !== null ? (
                <p className="mt-1 text-xs font-semibold text-white">Next visual stage at level {nextStageLevel}</p>
              ) : (
                <p className="mt-1 text-xs font-semibold text-white">You are at the current final visual stage</p>
              )}
            </div>
          </div>
        </div>

        <CardContent className="space-y-5 p-5 sm:p-6 lg:p-7">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">How it grows</p>
            <h3 className="mt-1 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Growth Credits turn everyday Waypoint activity into a visual companion
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Right now, Waypoint awards one Growth Credit for a daily check-in and one for completing a Journey module for the first time. Credits do not change your companion automatically. You decide when to apply them.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-border/60 bg-secondary/20 p-4">
              <div className="flex size-9 items-center justify-center rounded-xl border border-primary/20 bg-primary/10">
                <ClipboardCheck className="size-4 text-primary" />
              </div>
              <p className="mt-3 text-sm font-semibold text-foreground">1. Check in</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                One recorded daily check-in earns one Growth Credit. Missing a day does not remove previous levels or credits.
              </p>
            </div>

            <div className="rounded-xl border border-border/60 bg-secondary/20 p-4">
              <div className="flex size-9 items-center justify-center rounded-xl border border-primary/20 bg-primary/10">
                <BookOpenCheck className="size-4 text-primary" />
              </div>
              <p className="mt-3 text-sm font-semibold text-foreground">2. Learn something</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                The first time you complete a Journey module, Waypoint adds one Growth Credit. Repeating a module does not keep adding credits.
              </p>
            </div>

            <div className="rounded-xl border border-border/60 bg-secondary/20 p-4">
              <div className="flex size-9 items-center justify-center rounded-xl border border-primary/20 bg-primary/10">
                <Sparkles className="size-4 text-primary" />
              </div>
              <p className="mt-3 text-sm font-semibold text-foreground">3. Level up when you want</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Applying one Growth Credit increases your engagement level by one. Your companion changes appearance at certain levels.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Growth Credits waiting</p>
                  <p className="mt-1 text-3xl font-bold text-primary">{credits}</p>
                </div>
                <div className="flex size-10 items-center justify-center rounded-full border border-primary/25 bg-primary/10">
                  <Sparkles className="size-4 text-primary" />
                </div>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                These stay in your profile until you choose to apply them.
              </p>
            </div>

            <div className="rounded-xl border border-border/60 bg-secondary/20 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Current check-in run</p>
                  <p className="mt-1 text-3xl font-bold text-foreground">{streak}</p>
                </div>
                <CheckCircle2 className="mt-1 size-5 text-primary" />
              </div>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Consecutive recorded check-ins. This is shown for context and does not decide your companion's level.
              </p>
              {longestStreak > 0 && (
                <p className="mt-1 text-[11px] text-muted-foreground">Longest recorded run: {longestStreak} days</p>
              )}
            </div>
          </div>

          {credits > 0 ? (
            <Button onClick={handleLevelUp} disabled={isLevelingUp} className="min-h-11 w-full font-semibold" size="lg">
              <Sparkles className="mr-2 size-4" />
              {isLevelingUp ? "Applying credit..." : `Apply 1 Growth Credit to reach level ${currentLevel + 1}`}
            </Button>
          ) : (
            <div className="rounded-xl border border-dashed border-border p-4 text-sm leading-relaxed text-muted-foreground">
              No Growth Credits are waiting right now. You do not need to earn one today. A future daily check-in or first-time Journey module completion can add another credit.
            </div>
          )}

          <div className="rounded-xl border border-border/60 bg-muted/30 p-4 text-xs leading-relaxed text-muted-foreground">
            Growth Companion levels are a game-like record of Waypoint engagement only. They do not measure recovery, wellbeing, treatment progress or personal worth.
          </div>
        </CardContent>
      </div>
    </Card>
  )
}
