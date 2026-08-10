import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import ForgotPasswordForm from "@/components/auth/forgot-password-form"
import AppLogo from "@/components/layout/app-logo"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function ForgotPasswordPage() {
  const user = await getSession()

  if (user) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-secondary via-background to-muted">
      <div className="w-full max-w-md">
        <Link
          href="/auth/signin"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to sign in
        </Link>

        <div className="text-center mb-8">
          <AppLogo size="lg" showText={true} layout="vertical" className="mb-6" />
          <h1 className="text-3xl font-bold text-foreground mb-2">Reset Your Password</h1>
          <p className="text-muted-foreground text-pretty">
            Enter your email address and we'll send you instructions to reset your password
          </p>
        </div>

        <ForgotPasswordForm />
      </div>
    </div>
  )
}
