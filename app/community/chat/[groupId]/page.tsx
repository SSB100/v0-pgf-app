import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { neon } from "@neondatabase/serverless"
import ChatPageHeader from "@/components/community/chat-page-header"
import CommunityChatClient from "@/components/community/community-chat-client"

const sql = neon(process.env.NEON_DATABASE_URL!)

interface CommunityChatsPageProps {
  params: Promise<{ groupId: string }>
}

export default async function CommunityChatPage(props: CommunityChatsPageProps) {
  const params = await props.params
  const groupId = params.groupId
  
  const session = await getSession()
  if (!session) {
    redirect("/auth/signin")
  }

  // Verify user is a member of this group
  const membership = await sql`
    SELECT gm.id, cp.alias_name, cg.journey_type
    FROM group_memberships gm
    JOIN community_profiles cp ON gm.community_profile_id = cp.id
    JOIN community_groups cg ON gm.group_id = cg.id
    WHERE gm.user_id = ${session.id}::uuid AND gm.group_id = ${groupId}::uuid
  `

  if (!membership || membership.length === 0) {
    redirect("/community/join")
  }

  const userMembership = membership[0]

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      <ChatPageHeader />
      <CommunityChatClient
        userId={session.id}
        groupId={groupId}
        userAlias={userMembership.alias_name}
        journeyType={userMembership.journey_type}
      />
    </div>
  )
}
