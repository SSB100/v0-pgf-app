"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface SkillFeedbackProps {
  skillName: string
}

export function SkillFeedback({ skillName }: SkillFeedbackProps) {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<any>(null)
  const router = useRouter()

  const handleFeedback = async (wasHelpful: boolean) => {
    setLoading(true)
    try {
      const res = await fetch("/api/skills/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skillName, wasHelpful }),
      })

      const data = await res.json()

      if (data.alreadyCompleted) {
        setResponse({ message: "You've already completed this skill!", creditAwarded: false })
      } else {
        setResponse(data)
      }

      setSubmitted(true)

      // Refresh to update level credits in header
      if (data.creditAwarded) {
        setTimeout(() => router.refresh(), 2000)
      }
    } catch (error) {
      console.error("[v0] Error submitting feedback:", error)
      setResponse({ message: "Something went wrong. Please try again." })
    } finally {
      setLoading(false)
    }
  }

  if (submitted && response) {
    return (
      <Card className="bg-primary/10 border-primary/30">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            {response.creditAwarded ? (
              <>
                <div className="text-4xl mb-2">🎉</div>
                <p className="font-semibold text-foreground text-lg">Congratulations!</p>
                <p className="text-foreground">{response.message}</p>
              </>
            ) : response.suggestedSkill ? (
              <>
                <div className="text-3xl mb-2">💭</div>
                <p className="text-foreground mb-4">{response.message}</p>
                <Button asChild className="bg-primary hover:bg-primary/90 text-white">
                  <Link href={`/skills/${response.suggestedSkill.slug}`}>{response.suggestedSkill.name}</Link>
                </Button>
              </>
            ) : (
              <p className="text-foreground">{response.message}</p>
            )}

            <div className="pt-2">
              <Button asChild variant="outline" size="sm">
                <Link href="/skills">Browse More Skills</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-secondary/50 border-border">
      <CardContent className="pt-6">
        <div className="text-center space-y-4">
          <h3 className="font-semibold text-foreground text-lg">Was this helpful?</h3>
          <p className="text-sm text-muted-foreground">Your feedback helps us support your journey better</p>
          <div className="flex gap-3 justify-center">
            <Button
              onClick={() => handleFeedback(true)}
              disabled={loading}
              className="bg-primary hover:bg-primary/90 text-white min-w-24"
            >
              {loading ? "..." : "Yes"}
            </Button>
            <Button
              onClick={() => handleFeedback(false)}
              disabled={loading}
              variant="outline"
              className="min-w-24 bg-transparent"
            >
              {loading ? "..." : "No"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default SkillFeedback
