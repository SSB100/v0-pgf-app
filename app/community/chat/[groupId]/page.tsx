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
  const { groupId } = await props.params

  const session = await getSession()
  if (!session) redirect("/auth/signin")

  const membership = await sql`
    SELECT cp.alias_name, cg.journey_type
    FROM group_memberships gm
    JOIN community_profiles cp ON gm.community_profile_id = cp.id
    JOIN community_groups cg ON gm.group_id = cg.id
    WHERE gm.user_id = ${session.id}::uuid AND gm.group_id = ${groupId}::uuid
    LIMIT 1
  `

  if (membership.length === 0) redirect("/community/join")

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      <ChatPageHeader />
      <CommunityChatClient
        groupId={groupId}
        userAlias={membership[0].alias_name}
        journeyType={membership[0].journey_type}
      />
    </div>
  )
}
