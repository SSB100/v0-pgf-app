"use client"

import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users } from "lucide-react"

interface Member {
  alias: string
  profileImage?: string | null
  lastActive?: string | Date
}

interface GroupMembersListProps {
  members: Member[]
}

export default function GroupMembersList({ members }: GroupMembersListProps) {
  const visibleMembers = members.slice(0, 15)
  const hiddenCount = members.length > 15 ? members.length - 15 : 0

  return (
    <Card className="h-full bg-gradient-to-br from-card via-card to-card/80 border-2 border-border/50 shadow-xl flex flex-col">
      <CardHeader className="pb-4 bg-gradient-to-r from-primary/15 to-primary/5 border-b-2 border-border/50">
        <CardTitle className="flex items-center gap-2 text-lg bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          <Users className="w-5 h-5 text-primary" />
          Group Members
        </CardTitle>
        <CardDescription className="text-muted-foreground/90">
          {members.length} {members.length === 1 ? "member" : "members"} in this peer group
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-2 flex-1 overflow-y-auto p-4">
        {visibleMembers.map((member) => (
          <div key={member.alias} className="flex items-center gap-3 p-3 rounded-xl border border-transparent hover:bg-primary/5 hover:border-primary/20 transition-all duration-200">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-primary/30 bg-primary/10 flex-shrink-0">
              {member.profileImage ? (
                <Image src={member.profileImage} alt="" fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary/15 text-primary text-xs font-bold" aria-hidden="true">
                  {member.alias.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">{member.alias}</p>
              {member.lastActive && (
                <p className="text-xs text-muted-foreground/70">
                  Last recorded activity {new Date(member.lastActive).toLocaleString("en-NZ", { dateStyle: "short", timeStyle: "short" })}
                </p>
              )}
            </div>
          </div>
        ))}

        {hiddenCount > 0 && (
          <div className="text-center pt-3 mt-2 text-xs font-medium text-muted-foreground border-t border-border/50">
            +{hiddenCount} more members
          </div>
        )}

        {visibleMembers.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
            <div className="text-2xl mb-2" aria-hidden="true">👥</div>
            <p className="text-sm">No members are currently listed in this group.</p>
          </div>
        )}

        <p className="pt-2 text-[11px] leading-relaxed text-muted-foreground">
          Waypoint does not show Growth Companion levels here. App engagement should not be used to rank people in a peer-support space.
        </p>
      </CardContent>
    </Card>
  )
}
