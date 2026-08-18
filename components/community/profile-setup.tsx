"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, ArrowRight } from "lucide-react"

interface ProfileSetupProps {
  onProfileCreated: (aliasName: string) => void
  isLoading?: boolean
}

export default function ProfileSetup({ onProfileCreated, isLoading = false }: ProfileSetupProps) {
  const [aliasName, setAliasName] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleCreateProfile(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (!aliasName.trim()) {
      setError("Please enter an alias")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/community/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ aliasName: aliasName.trim() }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to create community alias")
        return
      }

      onProfileCreated(aliasName)
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="border-2 border-primary/20 shadow-lg bg-gradient-to-br from-primary/5 to-primary/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Heart className="w-6 h-6 text-primary" />
          Create Your Community Alias
        </CardTitle>
        <CardDescription>
          Other community members will see this alias instead of the name on your Waypoint account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleCreateProfile} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="alias" className="text-sm font-medium">Choose an alias</label>
            <Input
              id="alias"
              placeholder="e.g. Phoenix, Hope, NorthStar..."
              value={aliasName}
              onChange={(e) => setAliasName(e.target.value)}
              disabled={isSubmitting || isLoading}
              maxLength={50}
              className="text-base"
            />
            <p className="text-xs text-muted-foreground">{aliasName.length}/50 characters</p>
          </div>

          {error && <div className="text-sm text-destructive bg-destructive/10 p-2 rounded">{error}</div>}

          <Button type="submit" disabled={!aliasName.trim() || isSubmitting || isLoading} className="w-full" size="lg">
            {isSubmitting ? "Creating alias..." : "Continue"}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Your real name is not displayed to other community members through your alias. Waypoint still stores the account-to-alias link internally, so this should not be treated as full anonymity from Waypoint itself.
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
