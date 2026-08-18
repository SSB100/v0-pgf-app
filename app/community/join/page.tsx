import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import CommunityJoinClient from "@/components/community/community-join-client"

export default async function CommunityJoinPage() {
  const session = await getSession()
  if (!session) {
    redirect("/auth/signin")
  }

  return (
    <main className="min-h-screen bg-background pb-24 lg:pb-0">
      <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8 space-y-3">
          <h1 className="text-2xl sm:text-4xl font-bold text-balance">Join the Waypoint Community</h1>
          <p className="text-base sm:text-lg text-muted-foreground text-pretty">
            Use a community alias to take part in optional peer conversations with other Waypoint users.
          </p>
          <div className="rounded-lg border border-amber-300/60 bg-amber-50 p-3 text-sm text-amber-950 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-100">
            Community messages are peer discussion, not counselling or emergency support. The current MVP is not guaranteed to be continuously moderated. Your alias is shown to other members, but Waypoint still links that alias to your account internally.
          </div>
        </div>
        <CommunityJoinClient userId={session.id} />
      </div>
    </main>
  )
}
