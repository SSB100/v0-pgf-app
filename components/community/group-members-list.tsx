"use client"

import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users } from "lucide-react"

interface Member {
  userId: string
  alias: string
  profileImage?: string
  growthLevel?: number
  growthType?: string
  lastActive?: Date
}

interface GroupMembersListProps {
  members: Member[]
}

export default function GroupMembersList({ members }: GroupMembersListProps) {
  const activeMembers = members.slice(0, 15)
  const hiddenCount = members.length > 15 ? members.length - 15 : 0

  return (
    <Card className="h-full bg-gradient-to-br from-card via-card to-card/80 border-2 border-border/50 shadow-xl flex flex-col">
      <CardHeader className="pb-4 bg-gradient-to-r from-primary/15 to-primary/5 border-b-2 border-border/50">
        <CardTitle className="flex items-center gap-2 text-lg bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          <Users className="w-5 h-5 text-primary" />
          Active Members
        </CardTitle>
        <CardDescription className="text-muted-foreground/90">{members.length} people supporting each other</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 flex-1 overflow-y-auto p-4">
        {activeMembers.map((member, idx) => (
          <div
            key={member.userId}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/5 hover:border hover:border-primary/20 transition-all duration-200 cursor-pointer group"
          >
            {/* Avatar with growth indicator */}
            <div className="relative flex-shrink-0">
              <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-primary/40 bg-gradient-to-br from-primary/20 to-primary/10 group-hover:border-primary/60 transition-colors shadow-md">
                {member.profileImage ? (
                  <Image src={member.profileImage} alt={member.alias} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary to-primary/60 text-white text-xs font-bold">
                    {member.alias.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {member.growthLevel && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-[11px] font-bold flex items-center justify-center border-2 border-card shadow-lg">
                  {Math.min(member.growthLevel, 9)}
                </div>
              )}
            </div>

            {/* Member info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">{member.alias}</p>
              {member.lastActive && (
                <p className="text-xs text-muted-foreground/70">
                  Active {new Date(member.lastActive).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              )}
            </div>

            {/* Status indicator */}
            <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-green-400 to-green-500 shadow-lg animate-pulse" />
          </div>
        ))}

        {hiddenCount > 0 && (
          <div className="text-center pt-3 mt-2 text-xs font-medium text-muted-foreground border-t border-border/50 text-primary/80">
            +{hiddenCount} more members
          </div>
        )}

        {activeMembers.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
            <div className="text-2xl mb-2">👥</div>
            <p className="text-sm">No members yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
