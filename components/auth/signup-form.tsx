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

    if (!country.trim()) {
      setError("Please enter your country")
      return
    }

    if (!gender) {
      setError("Please select a gender response")
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
    <Card className="border-border/50 soft-shadow-lg">
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 pt-6">
          {error && <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

          <div className="rounded-lg border border-border bg-muted/30 p-3 text-sm leading-5 text-muted-foreground">
            Waypoint uses your account details together with the guided onboarding questions to establish your starting self-reported baseline. Ethnicity, iwi affiliation and future research interest remain optional.
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
            <Label htmlFor="country" className="font-medium text-foreground">Country</Label>
            <Input id="country" type="text" autoComplete="country-name" placeholder="e.g. New Zealand" value={country} onChange={(e) => setCountry(e.target.value)} required disabled={loading} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender" className="font-medium text-foreground">Gender</Label>
            <Select value={gender} onValueChange={setGender} required disabled={loading}>
              <SelectTrigger id="gender" className="w-full"><SelectValue placeholder="Select gender" /></SelectTrigger>
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

          <div className="flex items-start gap-2">
            <Checkbox id="dataConsent" checked={dataConsent} onCheckedChange={(checked) => setDataConsent(checked === true)} disabled={loading} className="mt-1" />
            <div className="flex-1">
              <label htmlFor="dataConsent" className="cursor-pointer text-sm font-medium leading-5">
                I am interested in contributing Waypoint activity data to future research, subject to a separate approved consent process
              </label>{" "}
              <Dialog>
                <DialogTrigger asChild>
                  <button type="button" className="inline text-xs text-primary underline hover:text-primary/80" aria-label="Learn more about the research preference">
                    More info
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Future research interest</DialogTitle>
                    <DialogDescription className="space-y-3 pt-4 text-foreground/80">
                      <p>This optional setting records your interest only. Ticking it does not share your data with a professional, enrol you in a study, or provide formal research consent.</p>
                      <p>Any future research project would need its own approved participant information, consent process, data rules and governance before your information could be used for that study.</p>
                      <p>You can change this preference later in Privacy &amp; Sharing without affecting ordinary Waypoint access.</p>
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
              <p className="mt-1 text-xs text-muted-foreground">Optional. This is separate from the permissions you may later give a specific professional.</p>
            </div>
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
