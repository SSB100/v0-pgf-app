import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { getProfessionalAccountForUser } from "@/lib/professional-access"
import ProfessionalSignupForm from "@/components/professional/professional-signup-form"
import { PublicHeader } from "@/components/layout/public-header"
import { PublicFooter } from "@/components/layout/public-footer"

export default async function ProfessionalSignupPage() {
  const user = await getSession()
  if (user) {
    const professional = await getProfessionalAccountForUser(user.id)
    redirect(professional ? "/professional" : "/dashboard")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      <main className="flex-1 bg-gradient-to-br from-secondary via-background to-muted px-4 py-10">
        <div className="mx-auto max-w-2xl">
          <div className="mb-7 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Waypoint for professionals</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">Request professional access</h1>
            <p className="mx-auto mt-2 max-w-xl text-pretty text-muted-foreground">Create a professional account for verification. Client information stays unavailable until the account and any linked organisation have passed the required access checks.</p>
          </div>
          <ProfessionalSignupForm />
        </div>
      </main>
      <PublicFooter />
    </div>
  )
}
