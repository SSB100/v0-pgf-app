"use client"

import type React from "react"
import { useState } from "react"
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
import DemographicsFields, { type DemographicsFormValue } from "@/components/auth/demographics-fields"

function latestEligibleBirthDate() {
  const today = new Date()
  const eligible = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate())
  return eligible.toISOString().split("T")[0]
}

const INITIAL_DEMOGRAPHICS: DemographicsFormValue = {
  ethnicities: [],
  otherEthnicities: "",
  ethnicityPreferNotToSay: false,
  iwiAffiliations: [],
  otherIwi: [],
  iwiResponseStatus: "not_stated",
}

export default function SignUpForm() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [dateOfBirth, setDateOfBirth] = useState("")
  const [country, setCountry] = useState("")
  const [gender, setGender] = useState("")
  const [demographics, setDemographics] = useState<DemographicsFormValue>(INITIAL_DEMOGRAPHICS)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [dataConsent, setDataConsent] = useState(false)
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
        body: JSON.stringify({
          email,
          password,
          fullName,
          dateOfBirth,
          country,
          gender,
          termsAccepted,
          dataConsent,
          ...demographics,
        }),
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
    <Card className="soft-shadow-lg border-border/50">
      <form onSubmit={handleSubmit}>
        <CardContent className="pt-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              {error}
            </div>
          )}

          <div className="rounded-lg border border-border bg-muted/30 p-3 text-sm text-muted-foreground">
            The current Waypoint MVP is intended for adults aged 18 and over in Aotearoa New Zealand.
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-foreground font-medium">Full name</Label>
            <Input id="fullName" type="text" placeholder="Your name" value={fullName} onChange={(e) => setFullName(e.target.value)} required disabled={loading} className="border-input focus:border-primary focus:ring-primary" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground font-medium">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loading} className="border-input focus:border-primary focus:ring-primary" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateOfBirth" className="text-foreground font-medium">Date of birth</Label>
            <Input id="dateOfBirth" type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} required disabled={loading} max={latestEligibleBirthDate()} className="border-input focus:border-primary focus:ring-primary" />
            <p className="text-xs text-muted-foreground">Used to confirm that you meet the current 18+ age requirement. The exact date is not retained after age verification.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="country" className="text-foreground font-medium">Country</Label>
            <Input id="country" type="text" placeholder="e.g. New Zealand" value={country} onChange={(e) => setCountry(e.target.value)} required disabled={loading} className="border-input focus:border-primary focus:ring-primary" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender" className="text-foreground font-medium">Gender</Label>
            <Select value={gender} onValueChange={setGender} required disabled={loading}>
              <SelectTrigger className="border-input focus:border-primary focus:ring-primary"><SelectValue placeholder="Select gender" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Another gender</SelectItem>
                <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DemographicsFields value={demographics} onChange={setDemographics} disabled={loading} />

          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground font-medium">Password</Label>
            <Input id="password" type="password" placeholder="At least 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={loading} className="border-input focus:border-primary focus:ring-primary" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-foreground font-medium">Confirm password</Label>
            <Input id="confirmPassword" type="password" placeholder="Re-enter your password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required disabled={loading} className="border-input focus:border-primary focus:ring-primary" />
          </div>

          <div className="flex items-start space-x-2 pt-2">
            <Checkbox id="terms" checked={termsAccepted} onCheckedChange={(checked) => setTermsAccepted(checked === true)} disabled={loading} className="mt-1" />
            <div className="flex-1">
              <label htmlFor="terms" className="text-sm font-medium leading-5 peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                I agree to the{" "}
                <Link href="/terms" target="_blank" className="text-primary hover:underline">Terms and Conditions</Link>{" "}
                and acknowledge the{" "}
                <Link href="/privacy-policy" target="_blank" className="text-primary hover:underline">Privacy Policy</Link>{" "}
                <span className="text-destructive">*</span>
              </label>
            </div>
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox id="dataConsent" checked={dataConsent} onCheckedChange={(checked) => setDataConsent(checked === true)} disabled={loading} className="mt-1" />
            <div className="flex-1">
              <label htmlFor="dataConsent" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                I am interested in contributing Waypoint activity data to future research, subject to a separate approved consent process
              </label>
              <Dialog>
                <DialogTrigger asChild>
                  <button type="button" className="text-primary hover:text-primary/80 transition-colors text-xs underline inline" aria-label="Learn more about the research preference">
                    (more info)
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Future Research Preference</DialogTitle>
                    <DialogDescription className="space-y-3 pt-4 text-foreground/80">
                      <p>This optional setting records your interest in contributing Waypoint activity data to future research. It does not enrol you in a research study and is not, by itself, consent for a future formal study.</p>
                      <p>Any formal research project would need its own approved participant information, consent process, data rules and governance before your information could be used under that study.</p>
                      <p>The way information is de-identified, accessed, retained and used would need to be defined in that study&apos;s approved documents and systems before any research use occurs.</p>
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
              <p className="text-xs text-muted-foreground mt-1">Optional. Leaving this unticked does not limit your use of Waypoint.</p>
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium">
            {loading ? "Creating account..." : "Create Account"}
          </Button>
        </CardContent>

        <CardFooter className="flex-col space-y-2 text-center text-sm">
          <p className="text-muted-foreground">
            {"Already have an account? "}
            <Link href="/auth/signin" className="text-primary hover:text-primary/80 font-medium">Sign in</Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
