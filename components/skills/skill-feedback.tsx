"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface SkillFeedbackProps {
  skillSlug: string
}

interface SkillFeedbackResponse {
  message?: string
  creditAwarded?: boolean
  alreadyCompleted?: boolean
  suggestedSkill?: { slug: string; name: string } | null
}

export function SkillFeedback({ skillSlug }: SkillFeedbackProps) {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<SkillFeedbackResponse | null>(null)
  const router = useRouter()

  const handleFeedback = async (wasHelpful: boolean) => {
    setLoading(true)
    try {
      const res = await fetch("/api/skills/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skillSlug, wasHelpful }),
      })

      const data: SkillFeedbackResponse = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Unable to record skill feedback")
      }

      if (data.alreadyCompleted) {
        setResponse({ message: "You have already recorded feedback for this skill.", creditAwarded: false })
      } else {
        setResponse(data)
      }

      setSubmitted(true)

      if (data.creditAwarded) {
        setTimeout(() => router.refresh(), 1000)
      }
    } catch (error) {
      console.error("[v0] Error submitting feedback:", error)
      setResponse({ message: "Something went wrong while recording your feedback. Please try again." })
      setSubmitted(true)
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
                <p className="font-semibold text-foreground text-lg">Activity recorded</p>
                <p className="text-foreground">{response.message}</p>
                <p className="text-xs text-muted-foreground">Growth credits represent Waypoint engagement, not a clinical measure of recovery or wellbeing.</p>
              </>
            ) : response.suggestedSkill ? (
              <>
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
          <h3 className="font-semibold text-foreground text-lg">Was this useful for you?</h3>
          <p className="text-sm text-muted-foreground">Your answer records your experience of this skill; it is not a clinical assessment.</p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => handleFeedback(true)} disabled={loading} className="bg-primary hover:bg-primary/90 text-white min-w-24">
              {loading ? "..." : "Yes"}
            </Button>
            <Button onClick={() => handleFeedback(false)} disabled={loading} variant="outline" className="min-w-24 bg-transparent">
              {loading ? "..." : "No"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default SkillFeedback
