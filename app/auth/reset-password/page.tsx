import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import ResetPasswordForm from "@/components/auth/reset-password-form"
import AppLogo from "@/components/layout/app-logo"
import { sql } from "@/lib/db"

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: { token?: string }
}) {
  const user = await getSession()

  if (user) {
    redirect("/dashboard")
  }

  const token = searchParams.token

  if (!token) {
    redirect("/auth/forgot-password")
  }

  // Verify token exists and is not expired
  const tokenData = await sql`
    SELECT user_id, expires_at 
    FROM password_reset_tokens 
    WHERE token = ${token} AND used = false
  `

  if (!tokenData || tokenData.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-secondary via-background to-muted">
        <div className="w-full max-w-md text-center">
          <AppLogo size="lg" showText={true} layout="vertical" className="mb-6" />
          <h1 className="text-3xl font-bold text-foreground mb-2">Invalid Reset Link</h1>
          <p className="text-muted-foreground mb-6">This password reset link is invalid or has already been used.</p>
          <a href="/auth/forgot-password" className="text-primary hover:text-primary/80 font-medium underline">
            Request a new reset link
          </a>
        </div>
      </div>
    )
  }

  const expiresAt = new Date(tokenData[0].expires_at)
  if (expiresAt < new Date()) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-secondary via-background to-muted">
        <div className="w-full max-w-md text-center">
          <AppLogo size="lg" showText={true} layout="vertical" className="mb-6" />
          <h1 className="text-3xl font-bold text-foreground mb-2">Link Expired</h1>
          <p className="text-muted-foreground mb-6">
            This password reset link has expired. Reset links are valid for 1 hour.
          </p>
          <a href="/auth/forgot-password" className="text-primary hover:text-primary/80 font-medium underline">
            Request a new reset link
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-secondary via-background to-muted">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <AppLogo size="lg" showText={true} layout="vertical" className="mb-6" />
          <h1 className="text-3xl font-bold text-foreground mb-2">Set New Password</h1>
          <p className="text-muted-foreground text-pretty">Enter your new password below</p>
        </div>

        <ResetPasswordForm token={token} />
      </div>
    </div>
  )
}
