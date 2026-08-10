"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import ProfileSetup from "@/components/community/profile-setup"
import JourneyTypeSelector from "@/components/community/journey-type-selector"

interface CommunityJoinClientProps {
  userId: string
}

export default function CommunityJoinClient({ userId }: CommunityJoinClientProps) {
  const router = useRouter()
  const [stage, setStage] = useState<"profile" | "journey">("profile")
  const [aliasName, setAliasName] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  function handleProfileCreated(alias: string) {
    setAliasName(alias)
    setStage("journey")
  }

  function handleJourneySelected(groupId: string) {
    setIsLoading(true)
    router.push(`/community/chat/${groupId}`)
  }

  return (
    <div className="space-y-8">
      {stage === "profile" ? (
        <ProfileSetup onProfileCreated={handleProfileCreated} isLoading={isLoading} />
      ) : (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-4">
            <p className="text-sm">
              Great! We've created your alias: <span className="font-bold text-primary">{aliasName}</span>
            </p>
          </div>
          <JourneyTypeSelector onJourneySelected={handleJourneySelected} isLoading={isLoading} />
        </div>
      )}
    </div>
  )
}
