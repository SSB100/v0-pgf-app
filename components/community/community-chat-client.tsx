"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, LogOut } from "lucide-react"
import ChatMessage from "@/components/community/chat-message"
import GroupMembersList from "@/components/community/group-members-list"
import ReportUserDialog from "@/components/community/report-user-dialog"
import SwitchGroupDialog from "@/components/community/switch-group-dialog"
import { useRouter } from "next/navigation"

interface Message {
  id: string
  alias: string
  content: string
  timestamp: string
  profileImage?: string
  growthLevel?: number
  growthType?: string
}

interface Member {
  userId: string
  alias: string
  profileImage?: string
  growthLevel?: number
  growthType?: string
  lastActive?: string
}

interface CommunityChatClientProps {
  userId: string
  groupId: string
  userAlias: string
  journeyType: string
}

export default function CommunityChatClient({
  userId,
  groupId,
  userAlias,
  journeyType,
}: CommunityChatClientProps) {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [members, setMembers] = useState<Member[]>([])
  const [messageInput, setMessageInput] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [reportDialogOpen, setReportDialogOpen] = useState(false)
  const [reportedUser, setReportedUser] = useState<{ alias: string; userId: string; messageId?: string } | null>(null)
  const [switchGroupDialogOpen, setSwitchGroupDialogOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function loadData() {
      try {
        const [messagesRes, membersRes] = await Promise.all([
          fetch(`/api/community/messages/${groupId}`),
          fetch(`/api/community/group/members/${groupId}`),
        ])

        if (!messagesRes.ok || !membersRes.ok) {
          setMessages([])
          setMembers([])
          setIsLoading(false)
          return
        }

        const messagesData = await messagesRes.json()
        const membersData = await membersRes.json()

        setMessages(messagesData.messages || [])
        setMembers(membersData.members || [])
      } catch (err) {
        setMessages([])
        setMembers([])
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
    const interval = setInterval(loadData, 3000)
    return () => clearInterval(interval)
  }, [groupId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  async function handleSendMessage() {
    if (!messageInput.trim()) return

    const contentToSend = messageInput.trim()
    const tempMessage: Message = {
      id: Math.random().toString(),
      alias: userAlias,
      content: contentToSend,
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, tempMessage])
    setMessageInput("")
    setIsSending(true)

    try {
      const response = await fetch(`/api/community/messages/${groupId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: contentToSend }),
      })

      if (!response.ok) {
        console.error("Failed to send message")
        setMessages((prev) => prev.filter((m) => m.id !== tempMessage.id))
      }
    } catch (err) {
      console.error("Error sending message:", err)
      setMessages((prev) => prev.filter((m) => m.id !== tempMessage.id))
    } finally {
      setIsSending(false)
    }
  }

  function handleReportClick(alias: string, reportedUserId: string, messageId?: string) {
    setReportedUser({ alias, userId: reportedUserId, messageId })
    setReportDialogOpen(true)
  }

  function handleGroupSwitched() {
    router.push("/community/join")
  }

  return (
    <div className="flex-1 flex gap-2 sm:gap-4 p-2 sm:p-4 overflow-hidden">
      <div className="flex-1 flex flex-col bg-gradient-to-br from-card via-card to-card/80 rounded-xl sm:rounded-2xl border-2 border-border/50 shadow-xl overflow-hidden min-w-0">
        <div className="bg-gradient-to-r from-primary/15 via-primary/10 to-transparent border-b-2 border-border/50 px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2">
          <div className="space-y-0.5 min-w-0">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500 flex-shrink-0" />
              <h2 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent truncate">
                {journeyType.split("_").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground truncate">
              Community alias: <span className="font-semibold text-foreground">{userAlias}</span>
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setSwitchGroupDialogOpen(true)} className="gap-1.5 border-primary/30 hover:bg-primary/10 flex-shrink-0 text-xs sm:text-sm px-2 sm:px-3">
            <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Switch Group</span>
            <span className="sm:hidden">Switch</span>
          </Button>
        </div>

        <div className="border-b border-amber-300/60 bg-amber-50 px-3 py-2 text-xs text-amber-950 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-100 sm:px-6">
          Peer discussion only. This community is not professional counselling or emergency support, and the current MVP is not guaranteed to be continuously moderated. Use the Support page if you need urgent help.
        </div>

        <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-3 bg-gradient-to-b from-background/50 to-background">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-3">
              <div className="w-10 h-10 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
              <p className="text-sm">Loading community messages...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground gap-3">
              <div className="text-5xl">💭</div>
              <div>
                <p className="font-semibold text-foreground mb-1">No messages yet</p>
                <p className="text-sm">You can start a respectful peer conversation if you want to.</p>
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                id={msg.id}
                alias={msg.alias}
                content={msg.content}
                timestamp={new Date(msg.timestamp)}
                profileImage={msg.profileImage}
                growthLevel={msg.growthLevel}
                growthType={msg.growthType}
                isCurrentUser={msg.alias === userAlias}
                onReport={() => handleReportClick(msg.alias, msg.id, msg.id)}
              />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t-2 border-border/50 bg-gradient-to-b from-card/50 to-card p-3 sm:p-4 space-y-2">
          <div className="flex gap-2">
            <Input
              placeholder="Write a peer message..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage()
                }
              }}
              disabled={isSending}
              className="text-base border-border/50 focus:border-primary/50 bg-background/50"
            />
            <Button onClick={handleSendMessage} disabled={!messageInput.trim() || isSending} size="icon" className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary flex-shrink-0" aria-label="Send message">
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground/80 leading-relaxed hidden sm:block">
            Keep messages respectful. Avoid sharing information that you would not want other group members to see.
          </p>
        </div>
      </div>

      <div className="hidden lg:flex lg:w-72 flex-col">
        <GroupMembersList members={members} />
      </div>

      {reportedUser && (
        <ReportUserDialog
          isOpen={reportDialogOpen}
          onClose={() => {
            setReportDialogOpen(false)
            setReportedUser(null)
          }}
          reportedAlias={reportedUser.alias}
          reportedUserId={reportedUser.userId}
          messageId={reportedUser.messageId}
          groupId={groupId}
        />
      )}

      <SwitchGroupDialog
        isOpen={switchGroupDialogOpen}
        onClose={() => setSwitchGroupDialogOpen(false)}
        currentJourneyType={journeyType}
        onGroupSwitched={handleGroupSwitched}
      />
    </div>
  )
}
