"use client"

import Image from "next/image"
import { useState } from "react"
import { BookOpenCheck, CheckCircle2, ClipboardCheck, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MobileGrowthCompanionProps {
  avatarType: string
  level: number
  levelCredits: number
  streak: number
}

type Stage = {
  name: string
  stage: string
  image: string
  nextLevel: number | null
}

function getStage(avatarType: string, level: number): Stage {
  const stages: Record<string, { name: string; levels: Array<{ min: number; stage: string; image: string }> }> = {
    growth_tree: {
      name: "Growth Tree",
      levels: [
        { min: 0, stage: "Seed", image: "/images/avatar-tree-seed.jpg" },
        { min: 1, stage: "Sprout", image: "/images/avatar-tree-sprout.jpg" },
        { min: 5, stage: "Sapling", image: "/images/avatar-tree-sapling.jpg" },
        { min: 10, stage: "Young Tree", image: "/images/avatar-tree-young.jpg" },
        { min: 20, stage: "Ancient Oak", image: "/images/avatar-tree-ancient.jpg" },
      ],
    },
    rising_phoenix: {
      name: "Rising Phoenix",
      levels: [
        { min: 0, stage: "Ember", image: "/images/avatar-phoenix-ember.jpg" },
        { min: 1, stage: "Spark", image: "/images/avatar-phoenix-spark.jpg" },
        { min: 5, stage: "Flame", image: "/images/avatar-phoenix-flame.jpg" },
        { min: 10, stage: "Phoenix", image: "/images/avatar-phoenix-phoenix.jpg" },
        { min: 20, stage: "Legendary", image: "/images/avatar-phoenix-legendary.jpg" },
      ],
    },
    dragon_hatchling: {
      name: "Dragon Hatchling",
      levels: [
        { min: 0, stage: "Egg", image: "/images/avatar-dragon-egg.jpg" },
        { min: 1, stage: "Hatchling", image: "/images/avatar-dragon-hatchling.jpg" },
        { min: 5, stage: "Wyrmling", image: "/images/avatar-dragon-wyrmling.jpg" },
        { min: 10, stage: "Dragon", image: "/images/avatar-dragon-dragon.jpg" },
        { min: 20, stage: "Ancient Dragon", image: "/images/avatar-dragon-ancient.jpg" },
      ],
    },
    crystal_sentinel: {
      name: "Crystal Sentinel",
      levels: [
        { min: 0, stage: "Shard", image: "/images/avatar-crystal-shard.jpg" },
        { min: 1, stage: "Crystal", image: "/images/avatar-crystal-crystal.jpg" },
        { min: 5, stage: "Gem", image: "/images/avatar-crystal-gem.jpg" },
        { min: 10, stage: "Sentinel", image: "/images/avatar-crystal-sentinel.jpg" },
        { min: 20, stage: "Radiant Guardian", image: "/images/avatar-crystal-radiant.jpg" },
      ],
    },
    spirit_fox: {
      name: "Spirit Fox",
      levels: [
        { min: 0, stage: "Kit", image: "/images/avatar-fox-kit.jpg" },
        { min: 1, stage: "Young Fox", image: "/images/avatar-fox-young.jpg" },
        { min: 5, stage: "Spirit Fox", image: "/images/avatar-fox-spirit.jpg" },
        { min: 10, stage: "Mystic Fox", image: "/images/avatar-fox-mystic.jpg" },
        { min: 20, stage: "Celestial Fox", image: "/images/avatar-fox-celestial.jpg" },
      ],
    },
  }

  const config = stages[avatarType] || stages.growth_tree
  const currentIndex = config.levels.reduce((best, item, index) => (level >= item.min ? index : best), 0)
  const current = config.levels[currentIndex]
  const next = config.levels[currentIndex + 1]

  return {
    name: config.name,
    stage: current.stage,
    image: current.image,
    nextLevel: next?.min ?? null,
  }
}

export default function MobileGrowthCompanion({ avatarType, level, levelCredits, streak }: MobileGrowthCompanionProps) {
  const [currentLevel, setCurrentLevel] = useState(level || 0)
  const [credits, setCredits] = useState(levelCredits || 0)
  const [isApplying, setIsApplying] = useState(false)
  const progressOnly = avatarType === "none"
  const stage = getStage(avatarType, currentLevel)

  async function applyCredit() {
    if (credits < 1 || isApplying) return
    setIsApplying(true)
    try {
      const response = await fetch("/api/growth/level-up", { method: "POST" })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || "Unable to apply credit")
      setCurrentLevel(result.newLevel)
      setCredits(result.remainingCredits)
    } catch (error) {
      console.error("Growth credit error:", error)
      alert("Unable to apply the Growth Credit. Please try again.")
    } finally {
      setIsApplying(false)
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-3">
      <section className="flex items-center gap-4 rounded-3xl border border-primary/25 bg-gradient-to-br from-primary/15 via-primary/5 to-card p-4 shadow-sm">
        {progressOnly ? (
          <div className="flex size-28 shrink-0 items-center justify-center rounded-2xl border border-primary/25 bg-primary/10">
            <Sparkles className="size-10 text-primary" />
          </div>
        ) : (
          <div className="relative size-28 shrink-0 overflow-hidden rounded-2xl border border-primary/25 bg-background">
            <Image src={stage.image} alt={stage.stage} fill priority className="object-contain p-1.5" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">{progressOnly ? "Growth & Progress" : stage.name}</p>
          <h1 className="mt-1 text-2xl font-bold text-foreground">{progressOnly ? `Level ${currentLevel}` : stage.stage}</h1>
          <p className="text-sm font-medium text-muted-foreground">Engagement level {currentLevel}</p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            {progressOnly
              ? "You chose to track engagement without a character. Your Growth Credits and levels work exactly the same way."
              : stage.nextLevel === null
                ? "You are at the current final visual stage."
                : `Your companion changes appearance again at level ${stage.nextLevel}.`}
          </p>
        </div>
      </section>

      <section className="rounded-2xl border border-border/70 bg-card p-4">
        <h2 className="text-base font-bold text-foreground">How your progress grows</h2>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          Growth Credits turn selected Waypoint activity into engagement levels. {progressOnly ? "You can add a visual companion later in Settings if you want one." : "Your companion reflects those same levels."} They are not a recovery score.
        </p>
        <div className="mt-3 grid grid-cols-3 gap-2">
          <div className="rounded-xl bg-secondary/35 p-2.5 text-center">
            <ClipboardCheck className="mx-auto size-4 text-primary" />
            <p className="mt-1 text-[11px] font-semibold text-foreground">Check in</p>
            <p className="text-[10px] leading-snug text-muted-foreground">+1 credit</p>
          </div>
          <div className="rounded-xl bg-secondary/35 p-2.5 text-center">
            <BookOpenCheck className="mx-auto size-4 text-primary" />
            <p className="mt-1 text-[11px] font-semibold text-foreground">New module</p>
            <p className="text-[10px] leading-snug text-muted-foreground">+1 first time</p>
          </div>
          <div className="rounded-xl bg-secondary/35 p-2.5 text-center">
            <Sparkles className="mx-auto size-4 text-primary" />
            <p className="mt-1 text-[11px] font-semibold text-foreground">Apply credit</p>
            <p className="text-[10px] leading-snug text-muted-foreground">+1 level</p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-3.5">
          <p className="text-xs text-muted-foreground">Credits waiting</p>
          <p className="mt-0.5 text-3xl font-bold text-primary">{credits}</p>
          <p className="mt-1 text-[10px] leading-snug text-muted-foreground">They stay here until you choose to use them.</p>
        </div>
        <div className="rounded-2xl border border-border/70 bg-card p-3.5">
          <p className="text-xs text-muted-foreground">Check-in run</p>
          <div className="mt-0.5 flex items-center gap-2"><p className="text-3xl font-bold text-foreground">{streak || 0}</p><CheckCircle2 className="size-4 text-primary" /></div>
          <p className="mt-1 text-[10px] leading-snug text-muted-foreground">Shown for context. It does not control engagement levels.</p>
        </div>
      </section>

      {credits > 0 ? (
        <Button onClick={applyCredit} disabled={isApplying} size="lg" className="min-h-12 w-full rounded-xl font-semibold">
          <Sparkles className="mr-2 size-4" />
          {isApplying ? "Applying credit..." : `Use 1 credit to reach level ${currentLevel + 1}`}
        </Button>
      ) : (
        <div className="rounded-2xl border border-dashed border-border p-3 text-center text-xs leading-relaxed text-muted-foreground">
          No credits are waiting right now. Missing a day never removes earlier levels or credits.
        </div>
      )}
    </div>
  )
}
