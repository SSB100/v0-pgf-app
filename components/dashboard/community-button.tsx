"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Users, ArrowRight, Loader2 } from "lucide-react"

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
      <Button disabled className="w-full sm:w-auto">
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        Loading...
      </Button>
    )
  }

  return (
    <Button
      onClick={handleClick}
      className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
    >
      <Users className="w-4 h-4 mr-2" />
      {status?.hasProfile && status?.groupId ? (
        <>
          Community ({status.alias})
          <ArrowRight className="w-4 h-4 ml-2" />
        </>
      ) : (
        <>
          Join Community
          <ArrowRight className="w-4 h-4 ml-2" />
        </>
      )}
    </Button>
  )
}
