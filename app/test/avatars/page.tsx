"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronUp, ChevronDown } from "lucide-react"

type AvatarType = "tree" | "phoenix" | "dragon" | "crystal" | "fox"

interface AvatarConfig {
  type: AvatarType
  name: string
  description: string
  stages: {
    minLevel: number
    maxLevel: number
    name: string
    image: string
    description: string
  }[]
}

const avatarConfigs: AvatarConfig[] = [
  {
    type: "tree",
    name: "Growth Tree",
    description: "A wise ancient tree growing from seed to guardian",
    stages: [
      {
        minLevel: 0,
        maxLevel: 0,
        name: "Seed",
        image: "/images/avatar-tree-seed.jpg",
        description: "Just beginning to grow",
      },
      {
        minLevel: 1,
        maxLevel: 4,
        name: "Sprout",
        image: "/images/avatar-tree-sprout.jpg",
        description: "Breaking through the soil",
      },
      {
        minLevel: 5,
        maxLevel: 9,
        name: "Sapling",
        image: "/images/avatar-tree-sapling.jpg",
        description: "Growing strong and tall",
      },
      {
        minLevel: 10,
        maxLevel: 19,
        name: "Young Tree",
        image: "/images/avatar-tree-young.jpg",
        description: "Branches reaching wide",
      },
      {
        minLevel: 20,
        maxLevel: Number.POSITIVE_INFINITY,
        name: "Ancient Oak",
        image: "/images/avatar-tree-ancient.jpg",
        description: "Wise and mighty guardian",
      },
    ],
  },
  {
    type: "phoenix",
    name: "Rising Phoenix",
    description: "A magical firebird of courage and renewal",
    stages: [
      {
        minLevel: 0,
        maxLevel: 0,
        name: "Ember",
        image: "/images/avatar-phoenix-ember.jpg",
        description: "A tiny flicker of hope",
      },
      {
        minLevel: 1,
        maxLevel: 4,
        name: "Spark",
        image: "/images/avatar-phoenix-spark.jpg",
        description: "Growing brighter each day",
      },
      {
        minLevel: 5,
        maxLevel: 9,
        name: "Flame",
        image: "/images/avatar-phoenix-flame.jpg",
        description: "Burning with determination",
      },
      {
        minLevel: 10,
        maxLevel: 19,
        name: "Phoenix",
        image: "/images/avatar-phoenix-phoenix.jpg",
        description: "Rising from challenges",
      },
      {
        minLevel: 20,
        maxLevel: Number.POSITIVE_INFINITY,
        name: "Legendary",
        image: "/images/avatar-phoenix-legendary.jpg",
        description: "Eternal flame of transformation",
      },
    ],
  },
  {
    type: "dragon",
    name: "Dragon Hatchling",
    description: "A brave dragon growing in strength and wisdom",
    stages: [
      {
        minLevel: 0,
        maxLevel: 0,
        name: "Egg",
        image: "/images/avatar-dragon-egg.jpg",
        description: "Potential waiting to hatch",
      },
      {
        minLevel: 1,
        maxLevel: 4,
        name: "Hatchling",
        image: "/images/avatar-dragon-hatchling.jpg",
        description: "Newly emerged and curious",
      },
      {
        minLevel: 5,
        maxLevel: 9,
        name: "Wyrmling",
        image: "/images/avatar-dragon-wyrmling.jpg",
        description: "Learning to fly and roar",
      },
      {
        minLevel: 10,
        maxLevel: 19,
        name: "Dragon",
        image: "/images/avatar-dragon-dragon.jpg",
        description: "Powerful and confident",
      },
      {
        minLevel: 20,
        maxLevel: Number.POSITIVE_INFINITY,
        name: "Ancient Dragon",
        image: "/images/avatar-dragon-ancient.jpg",
        description: "Legendary strength and wisdom",
      },
    ],
  },
  {
    type: "crystal",
    name: "Crystal Sentinel",
    description: "A mystical crystal being of clarity and wisdom",
    stages: [
      {
        minLevel: 0,
        maxLevel: 0,
        name: "Shard",
        image: "/images/avatar-crystal-shard.jpg",
        description: "A fragment of clarity",
      },
      {
        minLevel: 1,
        maxLevel: 4,
        name: "Crystal",
        image: "/images/avatar-crystal-crystal.jpg",
        description: "Taking beautiful form",
      },
      {
        minLevel: 5,
        maxLevel: 9,
        name: "Gem",
        image: "/images/avatar-crystal-gem.jpg",
        description: "Shining with inner light",
      },
      {
        minLevel: 10,
        maxLevel: 19,
        name: "Sentinel",
        image: "/images/avatar-crystal-sentinel.jpg",
        description: "Guardian of wisdom",
      },
      {
        minLevel: 20,
        maxLevel: Number.POSITIVE_INFINITY,
        name: "Radiant Guardian",
        image: "/images/avatar-crystal-radiant.jpg",
        description: "Beacon of clarity and insight",
      },
    ],
  },
  {
    type: "fox",
    name: "Spirit Fox",
    description: "An ethereal fox spirit of adaptability and grace",
    stages: [
      {
        minLevel: 0,
        maxLevel: 0,
        name: "Kit",
        image: "/images/avatar-fox-kit.jpg",
        description: "Playful and learning",
      },
      {
        minLevel: 1,
        maxLevel: 4,
        name: "Young Fox",
        image: "/images/avatar-fox-young.jpg",
        description: "Quick and adaptable",
      },
      {
        minLevel: 5,
        maxLevel: 9,
        name: "Spirit Fox",
        image: "/images/avatar-fox-spirit.jpg",
        description: "Graceful and ethereal",
      },
      {
        minLevel: 10,
        maxLevel: 19,
        name: "Mystic Fox",
        image: "/images/avatar-fox-mystic.jpg",
        description: "Wise and mysterious",
      },
      {
        minLevel: 20,
        maxLevel: Number.POSITIVE_INFINITY,
        name: "Celestial Fox",
        image: "/images/avatar-fox-celestial.jpg",
        description: "Dancing among the stars",
      },
    ],
  },
]

function AvatarTester({ config }: { config: AvatarConfig }) {
  const [level, setLevel] = useState(0)

  const getCurrentStage = () => {
    return config.stages.find((stage) => level >= stage.minLevel && level <= stage.maxLevel) || config.stages[0]
  }

  const currentStage = getCurrentStage()

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>{config.name}</CardTitle>
        <CardDescription>{config.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-muted-foreground">Current Level</div>
            <div className="text-3xl font-bold">{level}</div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setLevel(Math.max(0, level - 1))}
              disabled={level === 0}
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => setLevel(level + 1)}>
              <ChevronUp className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium">Stage: {currentStage.name}</div>
          <div className="text-sm text-muted-foreground">{currentStage.description}</div>
        </div>

        <div className="relative aspect-square w-full max-w-sm mx-auto rounded-lg overflow-hidden bg-muted">
          <img
            src={currentStage.image || "/placeholder.svg"}
            alt={currentStage.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="grid grid-cols-5 gap-2">
          {config.stages.map((stage, idx) => (
            <Button
              key={idx}
              variant={currentStage.name === stage.name ? "default" : "outline"}
              size="sm"
              onClick={() => setLevel(stage.minLevel)}
              className="text-xs"
            >
              {stage.name}
            </Button>
          ))}
        </div>

        <div className="text-xs text-muted-foreground">
          Level Range: {currentStage.minLevel} -{" "}
          {currentStage.maxLevel === Number.POSITIVE_INFINITY ? "∞" : currentStage.maxLevel}
        </div>
      </CardContent>
    </Card>
  )
}

export default function AvatarTestPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Avatar Evolution Testing</h1>
        <p className="text-muted-foreground">
          Test all avatar types and their evolution stages. Use the + and - buttons to adjust levels, or click stage
          names to jump to that evolution.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
        {avatarConfigs.map((config) => (
          <AvatarTester key={config.type} config={config} />
        ))}
      </div>
    </div>
  )
}
