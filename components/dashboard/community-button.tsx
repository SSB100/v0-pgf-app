"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowRight, Loader2, Users } from "lucide-react"

interface MembershipStatus {
  hasProfile: boolean
  groupId?: string
  journeyType?: string
  alias?: string
}

export default function CommunityButton() {
  const router = useRouter()
  const [status, setStatus] = useState<MembershipStatus | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function checkStatus() {
      try {
        const profileRes = await fetch("/api/community/profile")
        if (!profileRes.ok) throw new Error("Unable to load community profile")
        const profileData = await profileRes.json()

        if (profileData.profile) {
          const membershipRes = await fetch("/api/community/group/join")
          if (!membershipRes.ok) throw new Error("Unable to load community membership")
          const membershipData = await membershipRes.json()

          setStatus({
            hasProfile: true,
            groupId: membershipData.membership?.groupId,
            journeyType: membershipData.membership?.journeyType,
            alias: profileData.profile.aliasName,
          })
        } else {
          setStatus({ hasProfile: false })
        }
      } catch (error) {
        console.error("Error checking community status:", error)
        setStatus({ hasProfile: false })
      } finally {
        setIsLoading(false)
      }
    }

    checkStatus()
  }, [])

  function handleClick() {
    if (status?.hasProfile && status?.groupId) {
      router.push(`/community/chat/${status.groupId}`)
    } else {
      router.push("/community/join")
    }
  }

  if (isLoading) {
    return (
      <Button disabled variant="outline" className="border-primary/20 font-medium">
        <Loader2 className="mr-2 size-4 animate-spin" />
        Community
      </Button>
    )
  }

  return (
    <Button
      onClick={handleClick}
      variant="outline"
      className="border-primary/20 font-medium hover:border-primary/40 hover:bg-primary/5"
    >
      <Users className="mr-2 size-4" />
      {status?.hasProfile && status?.groupId ? "Community" : "Join Community"}
      <ArrowRight className="ml-2 size-4" />
    </Button>
  )
}
