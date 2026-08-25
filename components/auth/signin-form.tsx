"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

function safeReturnPath() {
  if (typeof window === "undefined") return null
  const value = new URLSearchParams(window.location.search).get("from")
  return value && value.startsWith("/") && !value.startsWith("//") ? value : null
}

export default function SignInForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      })
      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Something went wrong")
        setLoading(false)
        return
      }

      await new Promise((resolve) => setTimeout(resolve, 100))
      const returnPath = safeReturnPath()
      window.location.href = returnPath || data.redirectTo || (data.onboardingComplete ? "/dashboard" : "/onboarding")
    } catch (err) {
      console.error("[waypoint] Sign in form error", err)
      setError("Unable to sign in. Please try again.")
      setLoading(false)
    }
  }

  return (
    <Card className="soft-shadow-lg border-border/50">
      <form onSubmit={handleSubmit}>
        <CardContent className="pt-6 space-y-4">
          {error && <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">{error}</div>}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground font-medium">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loading} className="border-input focus:border-primary focus:ring-primary" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-foreground font-medium">Password</Label>
              <Link href="/auth/forgot-password" className="text-xs text-primary hover:text-primary/80 font-medium">Forgot password?</Link>
            </div>
            <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={loading} className="border-input focus:border-primary focus:ring-primary" />
          </div>

          <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium">{loading ? "Signing in..." : "Sign In"}</Button>
        </CardContent>

        <CardFooter className="flex-col space-y-2 text-center text-sm">
          <p className="text-muted-foreground">Don't have an account? <Link href="/auth/signup" className="text-primary hover:text-primary/80 font-medium">Sign up</Link></p>
          <p className="text-muted-foreground">Work with clients? <Link href="/auth/professional-signup" className="text-primary hover:text-primary/80 font-medium">Request professional access</Link></p>
        </CardFooter>
      </form>
    </Card>
  )
}
