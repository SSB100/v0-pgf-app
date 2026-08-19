"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import CommunityButton from "./community-button"
import { BookOpenCheck, HeartHandshake, Share2 } from "lucide-react"

export default function QuickActionsBar() {
  const router = useRouter()
  const [checkInCompleted, setCheckInCompleted] = useState(false)
  const [isCheckingCheckIn, setIsCheckingCheckIn] = useState(true)

  useEffect(() => {
    async function checkDailyCheckIn() {
      try {
        const response = await fetch("/api/check-in/check-today")
        if (!response.ok) throw new Error("Unable to check daily check-in status")
        const data = await response.json()
        setCheckInCompleted(data.completed || false)
      } catch (error) {
        console.error("[v0] Error checking daily check-in status:", error)
      } finally {
        setIsCheckingCheckIn(false)
      }
    }

    checkDailyCheckIn()
  }, [])

  function handleCheckIn() {
    if (checkInCompleted) {
      alert("You've already recorded today's check-in. You can record another one tomorrow.")
    } else {
      router.push("/check-in")
    }
  }

  return (
    <div className="hidden lg:flex flex-col sm:flex-row gap-3">
      <Button onClick={() => router.push("/support")} className="bg-destructive hover:bg-destructive/90 text-white font-semibold shadow-sm w-full sm:w-auto">
        <HeartHandshake className="w-4 h-4 mr-2" />
        I Need Support
      </Button>

      <div>
        <Button
          onClick={handleCheckIn}
          disabled={isCheckingCheckIn}
          className={`text-white font-medium shadow-sm w-full sm:w-auto ${checkInCompleted ? "bg-amber-600 hover:bg-amber-700" : "bg-primary hover:bg-primary/90"}`}
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {checkInCompleted ? "Daily Check-In (Done)" : "Daily Check-In"}
        </Button>
      </div>

      <Button onClick={() => router.push("/journey")} variant="outline" className="font-medium border-primary/30 hover:bg-primary/10 hover:border-primary w-full sm:w-auto">
        <BookOpenCheck className="w-4 h-4 mr-2" />
        Learning Journey
      </Button>

      <Button onClick={() => router.push("/share-journey")} variant="outline" className="w-full gap-2 border-primary/30 font-medium hover:border-primary hover:bg-primary/10 sm:w-auto">
        <Share2 data-icon="inline-start" />
        Share Journey
      </Button>

      <CommunityButton />
    </div>
  )
}
