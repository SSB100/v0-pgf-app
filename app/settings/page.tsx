"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, HeartHandshake, Lock, ShieldCheck, User, UserCheck, Users } from "lucide-react"
import MobileNav from "@/components/dashboard/mobile-nav"
import DemographicsFields, { type DemographicsFormValue } from "@/components/auth/demographics-fields"

const INITIAL_DEMOGRAPHICS: DemographicsFormValue = {
  ethnicities: [],
  otherEthnicities: "",
  ethnicityPreferNotToSay: false,
  iwiAffiliations: [],
  otherIwi: [],
  iwiResponseStatus: "not_stated",
}

export default function SettingsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isSavingDemographics, setIsSavingDemographics] = useState(false)
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [demographics, setDemographics] = useState<DemographicsFormValue>(INITIAL_DEMOGRAPHICS)
  const [demographicsError, setDemographicsError] = useState("")
  const [demographicsMessage, setDemographicsMessage] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")

  useEffect(() => {
    async function loadUserData() {
      try {
        const [userRes, demographicsRes] = await Promise.all([
          fetch("/api/auth/session", { cache: "no-store" }),
          fetch("/api/user/demographics", { cache: "no-store" }),
        ])

        const userData = await userRes.json()
        if (!userRes.ok || !userData.user) {
          if (userRes.status === 401) router.push("/auth/signin")
          return
        }

        setFullName(userData.user.full_name || "")
        setEmail(userData.user.email || "")

        if (demographicsRes.ok) {
          const demographicsData = await demographicsRes.json()
          if (demographicsData.demographics) setDemographics(demographicsData.demographics)
        } else if (demographicsRes.status !== 403) {
          setDemographicsError("We couldn't load your ethnicity and iwi settings right now. Your other settings are still available.")
        }
      } catch (error) {
        console.error("[waypoint] Error loading user settings", error)
        setDemographicsError("We couldn't load all of your settings right now. Please refresh and try again.")
      } finally {
        setIsLoading(false)
      }
    }

    void loadUserData()
  }, [router])

  async function handleSaveDemographics() {
    setDemographicsError("")
    setDemographicsMessage("")
    setIsSavingDemographics(true)

    try {
      const response = await fetch("/api/user/demographics", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(demographics),
      })
      const data = await response.json()

      if (!response.ok) {
        setDemographicsError(data.error || "Unable to update your ethnicity and iwi settings")
        return
      }

      if (data.demographics) setDemographics(data.demographics)
      setDemographicsMessage("Your optional ethnicity and iwi settings have been updated.")
    } catch {
      setDemographicsError("Unable to update your ethnicity and iwi settings. Please try again.")
    } finally {
      setIsSavingDemographics(false)
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault()
    setPasswordError("")
    if (newPassword !== confirmPassword) return setPasswordError("New passwords don't match")
    if (newPassword.length < 8) return setPasswordError("Password must be at least 8 characters")

    setIsSaving(true)
    try {
      const response = await fetch("/api/user/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      })
      if (response.ok) {
        alert("Password changed successfully!")
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
      } else {
        const data = await response.json()
        setPasswordError(data.error || "Failed to change password")
      }
    } catch {
      setPasswordError("Failed to change password")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><p className="text-muted-foreground">Loading...</p></div>
  }

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-0">
      <div className="container max-w-4xl mx-auto p-4 md:p-8">
        <div className="mb-8">
          <Button variant="ghost" onClick={() => router.push("/dashboard")} className="mb-4"><ArrowLeft className="w-4 h-4 mr-2" />Back to Dashboard</Button>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-2">Manage your account, privacy and support options.</p>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6"><div className="p-2 bg-primary/10 rounded-lg"><User className="w-5 h-5 text-primary" /></div><div><h2 className="text-xl font-semibold">Profile Information</h2><p className="text-sm text-muted-foreground">View your account details</p></div></div>
            <div className="space-y-4"><div><Label className="text-sm font-medium">Full Name</Label><p className="text-base mt-1">{fullName || "Not set"}</p></div><div><Label className="text-sm font-medium">Email Address</Label><p className="text-base mt-1">{email}</p></div></div>
          </Card>

          <Card className="p-4 sm:p-6">
            <div className="mb-5 flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-lg"><Users className="w-5 h-5 text-primary" /></div>
              <div>
                <h2 className="text-xl font-semibold">Ethnicity &amp; iwi</h2>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  These details are optional and can be updated as how you identify changes. They are not shown to connected professionals by default.
                </p>
              </div>
            </div>

            <DemographicsFields value={demographics} onChange={setDemographics} disabled={isSavingDemographics} />

            {demographicsError && (
              <div className="mt-4 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive" role="alert">
                {demographicsError}
              </div>
            )}
            {demographicsMessage && (
              <div className="mt-4 rounded-lg border border-primary/20 bg-primary/10 p-3 text-sm text-foreground" role="status">
                {demographicsMessage}
              </div>
            )}

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs leading-5 text-muted-foreground">
                Updating these details does not change your professional-sharing permissions or enable research use.
              </p>
              <Button type="button" onClick={handleSaveDemographics} disabled={isSavingDemographics} className="shrink-0">
                {isSavingDemographics ? "Saving..." : "Save ethnicity & iwi"}
              </Button>
            </div>
          </Card>

          <Card className="p-6 border-primary/20 bg-primary/[0.03]">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3"><div className="p-2 bg-primary/10 rounded-lg"><ShieldCheck className="w-5 h-5 text-primary" /></div><div><h2 className="text-xl font-semibold">Privacy &amp; Sharing</h2><p className="text-sm text-muted-foreground mt-1 max-w-xl">See what Waypoint holds, manage future research interest, choose professional sharing categories, review access history and download or request changes to your data.</p></div></div>
              <Button onClick={() => router.push("/privacy")} className="shrink-0">Manage privacy</Button>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3"><div className="p-2 bg-primary/10 rounded-lg"><UserCheck className="w-5 h-5 text-primary" /></div><div><h2 className="text-xl font-semibold">Professional connections</h2><p className="text-sm text-muted-foreground mt-1 max-w-xl">Pause, resume or permanently end a professional connection. Ending a connection stops access and revokes its active sharing permissions.</p></div></div>
              <Button variant="outline" onClick={() => router.push("/privacy/connections")} className="shrink-0">Manage connections</Button>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-3 mb-5"><div className="p-2 bg-destructive/10 rounded-lg"><HeartHandshake className="w-5 h-5 text-destructive" /></div><div className="flex-1"><h2 className="text-xl font-semibold">Immediate Support</h2><p className="text-sm text-muted-foreground mt-1">Waypoint is not monitored in real time. If you need support now, use the verified New Zealand support options.</p></div></div>
            <Button onClick={() => router.push("/support")} className="w-full sm:w-auto">View support options</Button>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6"><div className="p-2 bg-primary/10 rounded-lg"><Lock className="w-5 h-5 text-primary" /></div><div><h2 className="text-xl font-semibold">Change Password</h2><p className="text-sm text-muted-foreground">Update your account password</p></div></div>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div><Label htmlFor="currentPassword">Current Password</Label><Input id="currentPassword" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required /></div>
              <div><Label htmlFor="newPassword">New Password</Label><Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={8} /><p className="text-xs text-muted-foreground mt-1">Must be at least 8 characters</p></div>
              <div><Label htmlFor="confirmPassword">Confirm New Password</Label><Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required /></div>
              {passwordError && <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg"><p className="text-sm text-destructive">{passwordError}</p></div>}
              <Button type="submit" disabled={isSaving || !currentPassword || !newPassword || !confirmPassword} className="w-full">{isSaving ? "Changing Password..." : "Change Password"}</Button>
            </form>
          </Card>
        </div>
      </div>
      <MobileNav />
    </div>
  )
}
