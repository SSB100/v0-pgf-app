"use client"

import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import { MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ChatMessageProps {
  id: string
  alias: string
  content: string
  timestamp: Date
  profileImage?: string
  growthLevel?: number
  growthType?: string
  isCurrentUser: boolean
  onReport: () => void
}

export default function ChatMessage({
  id,
  alias,
  content,
  timestamp,
  profileImage,
  growthLevel,
  growthType,
  isCurrentUser,
  onReport,
}: ChatMessageProps) {
  const timeAgo = formatDistanceToNow(new Date(timestamp), { addSuffix: true })

  return (
    <div className={`flex gap-3 mb-4 ${isCurrentUser ? "flex-row-reverse" : ""}`}>
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-primary/30 bg-gradient-to-br from-primary/20 to-primary/10">
          {profileImage ? (
            <Image src={profileImage} alt={alias} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary to-primary/60 text-white text-sm font-bold">
              {alias.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Growth indicator badge */}
        {growthLevel && (
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center border border-background">
            {Math.min(growthLevel, 9)}
          </div>
        )}
      </div>

      {/* Message content */}
      <div className={`flex flex-col ${isCurrentUser ? "items-end" : "items-start"} flex-1 max-w-xs sm:max-w-sm`}>
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-sm">{alias}</span>
          <span className="text-xs text-muted-foreground">{timeAgo}</span>
          {!isCurrentUser && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-5 w-5 p-0 hover:bg-muted">
                  <MoreVertical className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onReport} className="text-destructive focus:text-destructive">
                  Report this message
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <div
          className={`px-4 py-2 rounded-2xl text-sm leading-relaxed ${
            isCurrentUser
              ? "bg-primary text-primary-foreground rounded-br-none"
              : "bg-muted text-foreground rounded-bl-none"
          }`}
        >
          {content}
        </div>
      </div>
    </div>
  )
}
