import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import SignUpForm from "@/components/auth/signup-form"
import { PublicHeader } from "@/components/layout/public-header"
import { PublicFooter } from "@/components/layout/public-footer"

export default async function SignUpPage() {
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
            <h1 className="text-3xl font-bold text-foreground mb-2">Begin Your Journey</h1>
            <p className="text-muted-foreground text-pretty">
              Take the first step toward understanding yourself and building resilience
            </p>
          </div>

          <SignUpForm />
        </div>
      </div>
      <PublicFooter />
    </div>
  )
}
