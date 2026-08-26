"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"

function latestEligibleBirthDate() {
  const today = new Date()
  const eligible = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate())
  return eligible.toISOString().split("T")[0]
}

export default function SignUpForm() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [dateOfBirth, setDateOfBirth] = useState("")
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (!termsAccepted) {
      setError("You must accept the Terms and acknowledge the Privacy Policy to continue")
      return
    }

    if (!dateOfBirth || dateOfBirth > latestEligibleBirthDate()) {
      setError("The current Waypoint MVP is for people aged 18 and over")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, fullName, dateOfBirth, termsAccepted }),
        credentials: "include",
      })

      const data = await response.json()
      if (!response.ok) {
        setError(data.error || "Something went wrong")
        setLoading(false)
        return
      }

      await new Promise((resolve) => setTimeout(resolve, 100))
      window.location.href = "/onboarding"
    } catch (err) {
      console.error("[v0] Signup form error:", err)
      setError("Unable to create your account. Please try again.")
      setLoading(false)
    }
  }

  return (
    <Card className="border-border/50 soft-shadow-lg">
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 pt-6">
          {error && <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

          <div className="rounded-lg border border-border bg-muted/30 p-3 text-sm leading-5 text-muted-foreground">
            The current Waypoint MVP is intended for adults aged 18 and over in Aotearoa New Zealand. Create your secure account first; optional identity, research and personalisation details can be added later.
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullName" className="font-medium text-foreground">Name used in Waypoint</Label>
            <Input id="fullName" type="text" autoComplete="name" placeholder="Your name" value={fullName} onChange={(e) => setFullName(e.target.value)} required disabled={loading} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="font-medium text-foreground">Email</Label>
            <Input id="email" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loading} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateOfBirth" className="font-medium text-foreground">Date of birth</Label>
            <Input id="dateOfBirth" type="date" autoComplete="bday" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} required disabled={loading} max={latestEligibleBirthDate()} />
            <p className="text-xs leading-5 text-muted-foreground">Used to confirm the current 18+ requirement. Where the current data-minimisation path is available, Waypoint keeps the verification result and age band rather than your exact birth date.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="font-medium text-foreground">Password</Label>
            <Input id="password" type="password" autoComplete="new-password" placeholder="At least 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={loading} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="font-medium text-foreground">Confirm password</Label>
            <Input id="confirmPassword" type="password" autoComplete="new-password" placeholder="Re-enter your password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required disabled={loading} />
          </div>

          <div className="flex items-start gap-2 pt-2">
            <Checkbox id="terms" checked={termsAccepted} onCheckedChange={(checked) => setTermsAccepted(checked === true)} disabled={loading} className="mt-1" />
            <label htmlFor="terms" className="cursor-pointer text-sm font-medium leading-5">
              I agree to the <Link href="/terms" target="_blank" className="text-primary hover:underline">Terms and Conditions</Link> and acknowledge the <Link href="/privacy-policy" target="_blank" className="text-primary hover:underline">Privacy Policy</Link> <span className="text-destructive">*</span>
            </label>
          </div>

          <Button type="submit" disabled={loading} className="w-full font-medium">
            {loading ? "Creating account..." : "Create account"}
          </Button>
        </CardContent>

        <CardFooter className="flex-col space-y-2 text-center text-sm">
          <p className="text-muted-foreground">Already have an account? <Link href="/auth/signin" className="font-medium text-primary hover:text-primary/80">Sign in</Link></p>
        </CardFooter>
      </form>
    </Card>
  )
}
