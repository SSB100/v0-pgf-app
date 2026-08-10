import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import SignInForm from "@/components/auth/signin-form"
import { PublicHeader } from "@/components/layout/public-header"
import { PublicFooter } from "@/components/layout/public-footer"

export default async function SignInPage() {
  const user = await getSession()

  if (user) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      <div className="flex-1 flex items-center justify-center p-4 bg-gradient-to-br from-secondary via-background to-muted">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Welcome Back</h1>
            <p className="text-muted-foreground text-pretty">Continue your journey toward growth and resilience</p>
          </div>

          <SignInForm />
        </div>
      </div>
      <PublicFooter />
    </div>
  )
}
