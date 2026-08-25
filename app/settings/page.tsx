"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, HeartHandshake, Lock, ShieldCheck, User } from "lucide-react"
import MobileNav from "@/components/dashboard/mobile-nav"

export default function SettingsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")

  useEffect(() => {
    loadUserData()
  }, [])

  async function loadUserData() {
    try {
      const userRes = await fetch("/api/auth/session")
      const userData = await userRes.json()

      if (userData.user) {
        setFullName(userData.user.full_name || "")
        setEmail(userData.user.email || "")
      }
    } catch (error) {
      console.error("[v0] Error loading user data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault()
    setPasswordError("")

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords don't match")
      return
    }

    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters")
      return
    }

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
    } catch (error) {
      setPasswordError("Failed to change password")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-0">
      <div className="container max-w-4xl mx-auto p-4 md:p-8">
        <div className="mb-8">
          <Button variant="ghost" onClick={() => router.push("/dashboard")} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-2">Manage your account, privacy and support options.</p>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 rounded-lg">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Profile Information</h2>
                <p className="text-sm text-muted-foreground">View your account details</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Full Name</Label>
                <p className="text-base mt-1">{fullName || "Not set"}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Email Address</Label>
                <p className="text-base mt-1">{email}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-primary/20 bg-primary/[0.03]">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Privacy &amp; Sharing</h2>
                  <p className="text-sm text-muted-foreground mt-1 max-w-xl">See what Waypoint holds, manage future research interest, control professional sharing, review access history and download or request changes to your data.</p>
                </div>
              </div>
              <Button onClick={() => router.push("/privacy")} className="shrink-0">Manage privacy</Button>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-3 mb-5">
              <div className="p-2 bg-destructive/10 rounded-lg">
                <HeartHandshake className="w-5 h-5 text-destructive" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold">Immediate Support</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Waypoint is not monitored in real time. If you need support now, use the verified New Zealand support options.
                </p>
              </div>
            </div>
            <Button onClick={() => router.push("/support")} className="w-full sm:w-auto">
              View support options
            </Button>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Lock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Change Password</h2>
                <p className="text-sm text-muted-foreground">Update your account password</p>
              </div>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={8} />
                <p className="text-xs text-muted-foreground mt-1">Must be at least 8 characters</p>
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
              </div>

              {passwordError && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <p className="text-sm text-destructive">{passwordError}</p>
                </div>
              )}

              <Button type="submit" disabled={isSaving || !currentPassword || !newPassword || !confirmPassword} className="w-full">
                {isSaving ? "Changing Password..." : "Change Password"}
              </Button>
            </form>
          </Card>
        </div>
      </div>
      <MobileNav />
    </div>
  )
}
