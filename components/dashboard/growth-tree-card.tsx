"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useState } from "react"
import { Sparkles, Info } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface GrowthTreeCardProps {
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

export default function GrowthTreeCard({
  level,
  levelCredits,
  streak,
  longestStreak,
  recentSkills,
  userId,
}: GrowthTreeCardProps) {
  const [currentLevel, setCurrentLevel] = useState(level)
  const [credits, setCredits] = useState(levelCredits)
  const [isLevelingUp, setIsLevelingUp] = useState(false)

  const getTreeStage = (level: number) => {
    if (level === 0)
      return {
        stage: "Seed",
        image: "/images/tree-seed.jpg",
        color: "text-muted-foreground",
        description: "Ready to begin",
      }
    if (level < 5)
      return {
        stage: "Seedling",
        image: "/images/tree-seedling.jpg",
        color: "text-success",
        description: "Taking root and growing",
      }
    if (level < 15)
      return {
        stage: "Sapling",
        image: "/images/tree-sapling.jpg",
        color: "text-success",
        description: "Building strength and resilience",
      }
    if (level < 30)
      return {
        stage: "Young Tree",
        image: "/images/tree-young.jpg",
        color: "text-primary",
        description: "Thriving and flourishing",
      }
    return {
      stage: "Mighty Oak",
      image: "/images/tree-mighty.jpg",
      color: "text-primary",
      description: "Strong, stable, and inspiring",
    }
  }

  const getStreakMessage = (currentStreak: number, longest: number) => {
    if (currentStreak === 0) {
      return "Start your journey today"
    }
    if (currentStreak === 1) {
      if (longest > 1) {
        return "Every new beginning is brave. Your past progress proves you can do this again."
      }
      return "Day one is a victory"
    }
    if (currentStreak < longest && longest > 3) {
      return `You've done ${longest} days before, you can reach it again. Progress isn't perfect, it's persistent.`
    }
    if (currentStreak === longest && currentStreak > 1) {
      return "New personal best! Keep it going"
    }
    if (currentStreak < 7) {
      return "Building momentum"
    }
    if (currentStreak < 30) {
      return "Strong consistency"
    }
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

      const treeElement = document.getElementById("growth-tree-image")
      if (treeElement) {
        treeElement.classList.add("animate-pulse")
        treeElement.style.filter = "drop-shadow(0 0 20px rgba(34, 197, 94, 0.6))"
        setTimeout(() => {
          treeElement.classList.remove("animate-pulse")
          treeElement.style.filter = ""
        }, 1500)
      }
    } catch (error) {
      console.error("[v0] Level up failed:", error)
      alert("Failed to level up. Please try again.")
    } finally {
      setIsLevelingUp(false)
    }
  }

  const tree = getTreeStage(currentLevel)
  const streakMessage = getStreakMessage(streak, longestStreak)

  return (
    <Card className="soft-shadow border-border/50 bg-gradient-to-br from-card to-secondary/30">
      <CardHeader>
        <CardTitle className="text-xl text-foreground flex items-center gap-2">
          <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
            />
          </svg>
          Your Growth Tree
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="ml-auto">
                  <Info className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-sm">
                  Grow your tree by completing daily check-ins and finishing modules in your My Journey plan. Each
                  activity earns you level credits that help your tree flourish!
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center py-4">
          <div className="relative w-32 h-32 mx-auto mb-3">
            <Image
              id="growth-tree-image"
              src={tree.image || "/placeholder.svg"}
              alt={tree.stage}
              fill
              className="object-contain transition-all duration-700 ease-in-out"
              style={{
                mixBlendMode: "multiply",
                filter: "brightness(1.1) contrast(1.3)",
              }}
              priority
            />
          </div>
          <div className={`text-lg font-bold ${tree.color}`}>{tree.stage}</div>
          <div className="text-sm text-muted-foreground">Level {currentLevel}</div>
          <div className="text-xs text-muted-foreground mt-1 text-pretty">{tree.description}</div>
        </div>

        {credits > 0 && (
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-4 border border-primary/20">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-sm font-medium text-foreground">Growth Credits Available</div>
                <div className="text-xs text-muted-foreground">Apply to level up your tree</div>
              </div>
              <div className="text-2xl font-bold text-primary">{credits}</div>
            </div>
            <Button
              onClick={handleLevelUp}
              disabled={isLevelingUp}
              className="w-full bg-primary hover:bg-primary/90"
              size="sm"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {isLevelingUp ? "Leveling Up..." : "Level Up!"}
            </Button>
          </div>
        )}

        <div className="bg-card/80 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Check-in Streak</span>
            <div className="text-right">
              <div className="text-lg font-bold text-primary">{streak} days</div>
              {longestStreak > streak && <div className="text-xs text-muted-foreground">Best: {longestStreak}</div>}
            </div>
          </div>
          <p className="text-xs text-primary/80 italic text-pretty">{streakMessage}</p>
        </div>

        <div className="text-xs text-center text-muted-foreground text-pretty">
          {credits > 0
            ? "You've earned growth credits! Apply them to level up your tree."
            : "Your tree grows as you practice skills, complete modules, and build resilience"}
        </div>
      </CardContent>
    </Card>
  )
}
