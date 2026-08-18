import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import AppLogo from "@/components/layout/app-logo"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default async function ForgotPasswordPage() {
  const user = await getSession()
  if (user) redirect("/dashboard")

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-secondary via-background to-muted">
      <div className="w-full max-w-md">
        <Link href="/auth/signin" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to sign in
        </Link>

        <div className="text-center mb-8">
          <AppLogo size="lg" showText={true} layout="vertical" className="mb-6" />
          <h1 className="text-3xl font-bold text-foreground mb-2">Password Reset</h1>
          <p className="text-muted-foreground text-pretty">
            Automated password-reset email is not configured in the current Waypoint MVP.
          </p>
        </div>

        <Card className="soft-shadow-lg border-border/50">
          <CardContent className="pt-6 space-y-3">
            <p className="text-sm text-foreground">
              We have disabled the unfinished reset flow rather than generating reset links that cannot be delivered safely.
            </p>
            <p className="text-sm text-muted-foreground">
              A production or research deployment should add a verified email-delivery service, expiring single-use tokens, rate limiting and an account-recovery process before this feature is enabled.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
