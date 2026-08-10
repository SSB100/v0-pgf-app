"use client"

import { CardContent } from "@/components/ui/card"

import { CardTitle } from "@/components/ui/card"

import { CardHeader } from "@/components/ui/card"

import { Card } from "@/components/ui/card"

// ... existing imports ...

interface Props {
  journeyTypes: string[]
}

export default function BuildingAwarenessClient({ journeyTypes }: Props) {
  // ... existing state ...

  const behaviorTerm = journeyTypes.includes("gambling")
    ? "gambling"
    : journeyTypes.includes("alcohol")
      ? "drinking"
      : journeyTypes.includes("substances")
        ? "substance use"
        : journeyTypes.includes("gaming")
          ? "excessive gaming"
          : "unwanted behaviors"

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-3xl mx-auto px-4 space-y-6">
        {/* ... existing header ... */}

        <Card>
          <CardHeader>
            <CardTitle>Why This Matters for Recovery</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-3 items-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-bold text-sm">1</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Recognize Triggers Early</p>
                  <p className="text-xs text-muted-foreground">
                    Notice stress, boredom, or emotions before they lead to urges related to {behaviorTerm}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-bold text-sm">2</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Understand Your Patterns</p>
                  <p className="text-xs text-muted-foreground">
                    See the connection between feelings, thoughts, and urges related to {behaviorTerm}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-bold text-sm">3</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Create Space for Choice</p>
                  <p className="text-xs text-muted-foreground">
                    Between the urge and the action, awareness gives you the power to choose differently
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ... rest of existing code ... */}
      </div>
    </div>
  )
}
