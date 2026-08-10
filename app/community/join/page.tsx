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
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold mb-2 text-balance">Join Our Community</h1>
          <p className="text-base sm:text-lg text-muted-foreground text-pretty">
            Connect with others on their recovery journey. Support and be supported anonymously.
          </p>
        </div>
        <CommunityJoinClient userId={session.id} />
      </div>
    </main>
  )
}
