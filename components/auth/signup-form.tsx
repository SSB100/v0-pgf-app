"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SignUpForm() {
  const router = useRouter()
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [dateOfBirth, setDateOfBirth] = useState("")
  const [country, setCountry] = useState("")
  const [gender, setGender] = useState("")
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [dataConsent, setDataConsent] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (!termsAccepted) {
      setError("You must accept the terms and conditions to continue")
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
      console.log("[v0] Signup form: Sending signup request")
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, fullName, dateOfBirth, country, gender, termsAccepted, dataConsent }),
        credentials: "include",
      })

      const data = await response.json()
      console.log("[v0] Signup form: Response received", {
        ok: response.ok,
        onboardingComplete: data.onboardingComplete,
      })

      if (!response.ok) {
        setError(data.error || "Something went wrong")
        setLoading(false)
        return
      }

      console.log("[v0] Signup form: Signup successful, redirecting to onboarding")
      await new Promise((resolve) => setTimeout(resolve, 100))
      window.location.href = "/onboarding"
    } catch (err) {
      console.error("[v0] Signup form error:", err)
      setError("Unable to create account. Please try again.")
      setLoading(false)
    }
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
            <Label htmlFor="fullName" className="text-foreground font-medium">
              Full Name
            </Label>
            <Input
              id="fullName"
              type="text"
              placeholder="Your name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              disabled={loading}
              className="border-input focus:border-primary focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground font-medium">
              Email
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

          <div className="space-y-2">
            <Label htmlFor="dateOfBirth" className="text-foreground font-medium">
              Date of Birth
            </Label>
            <Input
              id="dateOfBirth"
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              required
              disabled={loading}
              max={new Date().toISOString().split("T")[0]}
              className="border-input focus:border-primary focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="country" className="text-foreground font-medium">
              Country
            </Label>
            <Input
              id="country"
              type="text"
              placeholder="e.g., New Zealand, United States"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
              disabled={loading}
              className="border-input focus:border-primary focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender" className="text-foreground font-medium">
              Gender
            </Label>
            <Select value={gender} onValueChange={setGender} required disabled={loading}>
              <SelectTrigger className="border-input focus:border-primary focus:ring-primary">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
                <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground font-medium">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              className="border-input focus:border-primary focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-foreground font-medium">
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
              className="border-input focus:border-primary focus:ring-primary"
            />
          </div>

          <div className="flex items-start space-x-2 pt-2">
            <Checkbox
              id="terms"
              checked={termsAccepted}
              onCheckedChange={(checked) => setTermsAccepted(checked === true)}
              disabled={loading}
              className="mt-1"
            />
            <div className="flex-1">
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                I agree to the{" "}
                <Link href="/terms" target="_blank" className="text-primary hover:underline">
                  Terms and Conditions
                </Link>{" "}
                <span className="text-destructive">*</span>
              </label>
            </div>
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox
              id="dataConsent"
              checked={dataConsent}
              onCheckedChange={(checked) => setDataConsent(checked === true)}
              disabled={loading}
              className="mt-1"
            />
            <div className="flex-1">
              <label
                htmlFor="dataConsent"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                I consent to sharing my anonymous progress data for research
              </label>
              <Dialog>
                <DialogTrigger asChild>
                  <button
                    type="button"
                    className="text-primary hover:text-primary/80 transition-colors text-xs underline inline"
                    aria-label="Learn more about data usage"
                  >
                    (more info)
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>How Your Data Helps</DialogTitle>
                    <DialogDescription className="space-y-3 pt-4 text-foreground/80">
                      <p>
                        By sharing your anonymous progress data, you contribute to important research that helps us
                        better understand addiction and recovery patterns.
                      </p>
                      <p className="font-medium">What we collect:</p>
                      <ul className="list-disc pl-5 space-y-1 text-sm">
                        <li>Progress through journey modules and skill practices</li>
                        <li>Check-in patterns and recovery milestones</li>
                        <li>Aggregated emotional and urge strength trends</li>
                      </ul>
                      <p className="font-medium">What we do NOT collect:</p>
                      <ul className="list-disc pl-5 space-y-1 text-sm">
                        <li>Your name, email, or any personally identifying information</li>
                        <li>Private notes or reflections you write</li>
                        <li>Contact details or communication content</li>
                      </ul>
                      <p className="text-sm">
                        Your anonymized data helps improve Waypoint for future users and contributes to the broader
                        understanding of effective recovery strategies. You can change this setting anytime in your
                        account settings.
                      </p>
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
              <p className="text-xs text-muted-foreground mt-1">(Optional)</p>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
          >
            {loading ? "Creating account..." : "Create Account"}
          </Button>
        </CardContent>

        <CardFooter className="flex-col space-y-2 text-center text-sm">
          <p className="text-muted-foreground">
            {"Already have an account? "}
            <Link href="/auth/signin" className="text-primary hover:text-primary/80 font-medium">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
