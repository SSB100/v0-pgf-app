"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Something went wrong")
        setLoading(false)
        return
      }

      setSuccess(true)
    } catch (err) {
      console.error("[v0] Forgot password error:", err)
      setError("Unable to process request. Please try again.")
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Card className="soft-shadow-lg border-border/50">
        <CardContent className="pt-6 text-center space-y-4">
          <div className="flex justify-center">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Check Your Email</h3>
            <p className="text-sm text-muted-foreground text-balance">
              If an account exists with <span className="font-medium text-foreground">{email}</span>, you will receive
              password reset instructions shortly.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="soft-shadow-lg border-border/50">
      <form onSubmit={handleSubmit}>
        <CardContent className="pt-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground font-medium">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="border-input focus:border-primary focus:ring-primary"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
          >
            {loading ? "Sending..." : "Send Reset Instructions"}
          </Button>
        </CardContent>

        <CardFooter className="text-center text-sm text-muted-foreground">
          <p className="text-balance">
            Remember your password? Return to{" "}
            <a href="/auth/signin" className="text-primary hover:text-primary/80 font-medium">
              sign in
            </a>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
