"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import CommunityButton from "./community-button"
import { HeartHandshake, Share2 } from "lucide-react"

interface QuickActionsBarProps {
  userId: string
}

export default function QuickActionsBar({ userId }: QuickActionsBarProps) {
  const router = useRouter()
  const [checkInCompleted, setCheckInCompleted] = useState(false)
  const [isCheckingCheckIn, setIsCheckingCheckIn] = useState(true)

  useEffect(() => {
    async function checkDailyCheckIn() {
      try {
        const response = await fetch(`/api/check-in/check-today?userId=${userId}`)
        const data = await response.json()
        setCheckInCompleted(data.completed || false)
      } catch (error) {
        console.error("[v0] Error checking daily check-in status:", error)
      } finally {
        setIsCheckingCheckIn(false)
      }
    }

    checkDailyCheckIn()
  }, [userId])

  function handleCheckIn() {
    if (checkInCompleted) {
      alert("You've already completed your daily check-in today. You can complete another one tomorrow!")
    } else {
      router.push("/check-in")
    }
  }

  return (
    <div className="hidden lg:flex flex-col sm:flex-row gap-3">
      <Button
        onClick={() => router.push("/support")}
        className="bg-destructive hover:bg-destructive/90 text-white font-semibold shadow-sm w-full sm:w-auto"
      >
        <HeartHandshake className="w-4 h-4 mr-2" />
        I Need Support
      </Button>

      <div>
        <Button
          onClick={handleCheckIn}
          disabled={isCheckingCheckIn}
          className={`text-white font-medium shadow-sm w-full sm:w-auto ${
            checkInCompleted ? "bg-amber-600 hover:bg-amber-700" : "bg-primary hover:bg-primary/90"
          }`}
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {checkInCompleted ? "Daily Check-In (Done)" : "Daily Check-In"}
        </Button>
      </div>

      <Button
        onClick={() => router.push("/skills")}
        variant="outline"
        className="font-medium border-primary/30 hover:bg-primary/10 hover:border-primary w-full sm:w-auto"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
        Browse Skills
      </Button>

      <Button
        onClick={() => router.push("/share-journey")}
        variant="outline"
        className="w-full gap-2 border-primary/30 font-medium hover:border-primary hover:bg-primary/10 sm:w-auto"
      >
        <Share2 data-icon="inline-start" />
        Share Journey
      </Button>

      <CommunityButton userId={userId} />
    </div>
  )
}
