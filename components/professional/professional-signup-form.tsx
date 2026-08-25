"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function latestEligibleBirthDate() {
  const today = new Date()
  const eligible = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate())
  return eligible.toISOString().split("T")[0]
}

export default function ProfessionalSignupForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({
    displayName: "",
    email: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
    professionalRole: "",
    organisationName: "",
    registrationBody: "",
    registrationNumber: "",
    termsAccepted: false,
    privacyAcknowledged: false,
    professionalUseAccepted: false,
  })

  function setField<T extends keyof typeof form>(field: T, value: (typeof form)[T]) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function submit(event: FormEvent) {
    event.preventDefault()
    setError("")
    if (form.password !== form.confirmPassword) return setError("Passwords do not match")
    setLoading(true)
    try {
      const response = await fetch("/api/professional/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Unable to create professional account")
      router.push(data.redirectTo || "/professional")
      router.refresh()
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to create professional account")
      setLoading(false)
    }
  }

  return (
    <Card className="border-border/60 shadow-lg">
      <CardHeader>
        <CardTitle>Professional access application</CardTitle>
        <p className="text-sm leading-6 text-muted-foreground">Creating an account does not grant client access. Professional and organisation details must be reviewed before sharing tools are enabled.</p>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={submit}>
          {error && <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2"><Label htmlFor="displayName">Full name</Label><Input id="displayName" value={form.displayName} onChange={(e) => setField("displayName", e.target.value)} required /></div>
            <div className="space-y-2"><Label htmlFor="email">Work email</Label><Input id="email" type="email" value={form.email} onChange={(e) => setField("email", e.target.value)} required /></div>
            <div className="space-y-2"><Label htmlFor="dob">Date of birth</Label><Input id="dob" type="date" max={latestEligibleBirthDate()} value={form.dateOfBirth} onChange={(e) => setField("dateOfBirth", e.target.value)} required /><p className="text-xs text-muted-foreground">Used to confirm 18+ eligibility. The exact date is not retained.</p></div>
            <div className="space-y-2"><Label htmlFor="role">Professional role</Label><Input id="role" placeholder="e.g. counsellor, clinician, peer practitioner" value={form.professionalRole} onChange={(e) => setField("professionalRole", e.target.value)} required /></div>
          </div>
          <div className="space-y-2"><Label htmlFor="organisation">Organisation</Label><Input id="organisation" value={form.organisationName} onChange={(e) => setField("organisationName", e.target.value)} required /><p className="text-xs text-muted-foreground">This affiliation is treated as unverified until Waypoint completes its review.</p></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2"><Label htmlFor="registrationBody">Registration body (if applicable)</Label><Input id="registrationBody" value={form.registrationBody} onChange={(e) => setField("registrationBody", e.target.value)} /></div>
            <div className="space-y-2"><Label htmlFor="registrationNumber">Registration number (if applicable)</Label><Input id="registrationNumber" value={form.registrationNumber} onChange={(e) => setField("registrationNumber", e.target.value)} /></div>
            <div className="space-y-2"><Label htmlFor="password">Password</Label><Input id="password" type="password" minLength={8} value={form.password} onChange={(e) => setField("password", e.target.value)} required /></div>
            <div className="space-y-2"><Label htmlFor="confirmPassword">Confirm password</Label><Input id="confirmPassword" type="password" minLength={8} value={form.confirmPassword} onChange={(e) => setField("confirmPassword", e.target.value)} required /></div>
          </div>

          <div className="space-y-3 rounded-lg border bg-muted/20 p-4 text-sm">
            <label className="flex items-start gap-3"><Checkbox checked={form.termsAccepted} onCheckedChange={(v) => setField("termsAccepted", v === true)} /><span>I accept the <Link className="text-primary underline" href="/terms" target="_blank">Terms and Conditions</Link>.</span></label>
            <label className="flex items-start gap-3"><Checkbox checked={form.privacyAcknowledged} onCheckedChange={(v) => setField("privacyAcknowledged", v === true)} /><span>I have read the <Link className="text-primary underline" href="/privacy-policy" target="_blank">Privacy Policy</Link>.</span></label>
            <label className="flex items-start gap-3"><Checkbox checked={form.professionalUseAccepted} onCheckedChange={(v) => setField("professionalUseAccepted", v === true)} /><span>I accept the <Link className="text-primary underline" href="/professional-use" target="_blank">Professional Use Notice</Link>, including that Waypoint is not live monitoring or a replacement for clinical judgement.</span></label>
          </div>

          <Button className="w-full" type="submit" disabled={loading}>{loading ? "Creating application..." : "Create professional account"}</Button>
          <p className="text-center text-sm text-muted-foreground">Already have an account? <Link href="/auth/signin" className="font-medium text-primary hover:underline">Sign in</Link></p>
        </form>
      </CardContent>
    </Card>
  )
}
