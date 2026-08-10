"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { User, Phone, Bell, Lock, AlertTriangle, ArrowLeft } from "lucide-react"
import MobileNav from "@/components/dashboard/mobile-nav"

export default function SettingsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Profile data
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")

  // SOS settings
  const [sosContactNumber, setSosContactNumber] = useState("")
  const [sosServiceType, setSosServiceType] = useState<"pgf_contact" | "direct_notification">("pgf_contact")
  const [sosConfigured, setSosConfigured] = useState(false)

  // Password change
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")

  useEffect(() => {
    loadUserData()
  }, [])

  async function loadUserData() {
    try {
      // Load user profile
      const profileRes = await fetch("/api/user/profile")
      const profileData = await profileRes.json()

      // Load user details from session
      const userRes = await fetch("/api/auth/session")
      const userData = await userRes.json()

      if (userData.user) {
        setFullName(userData.user.full_name || "")
        setEmail(userData.user.email || "")
      }

      if (profileData) {
        setSosContactNumber(profileData.sos_contact_number || "")
        setSosServiceType(profileData.sos_service_type || "pgf_contact")
        setSosConfigured(profileData.sos_configured || false)
      }
    } catch (error) {
      console.error("[v0] Error loading user data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSaveSOSSettings() {
    setIsSaving(true)
    try {
      const response = await fetch("/api/sos/configure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contactNumber: sosContactNumber,
          serviceType: sosServiceType,
        }),
      })

      if (response.ok) {
        alert("SOS settings updated successfully!")
        setSosConfigured(true)
      } else {
        alert("Failed to update SOS settings")
      }
    } catch (error) {
      alert("Failed to update SOS settings")
    } finally {
      setIsSaving(false)
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
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
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
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => router.push("/dashboard")} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-2">Manage your account preferences and security settings</p>
        </div>

        <div className="space-y-6">
          {/* Profile Information */}
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

          {/* SOS Settings */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-destructive/10 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">SOS Support Settings</h2>
                <p className="text-sm text-muted-foreground">Configure your emergency support preferences</p>
              </div>
            </div>

            {sosConfigured && (
              <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                <p className="text-sm text-green-700 dark:text-green-400">
                  ✓ SOS support is configured and ready to use
                </p>
              </div>
            )}

            <div className="space-y-6">
              <div>
                <Label htmlFor="sosContactNumber" className="text-base font-semibold mb-2 block">
                  Contact Number
                </Label>
                <p className="text-sm text-muted-foreground mb-3">Phone number where support can reach you</p>
                <Input
                  id="sosContactNumber"
                  type="tel"
                  placeholder="+64 21 123 4567"
                  value={sosContactNumber}
                  onChange={(e) => setSosContactNumber(e.target.value)}
                  className="text-base"
                />
              </div>

              <div>
                <Label className="text-base font-semibold mb-3 block">Support Method</Label>
                <RadioGroup value={sosServiceType} onValueChange={(value) => setSosServiceType(value as any)}>
                  <div className="space-y-3">
                    <Card className="p-4 hover:border-primary cursor-pointer transition-colors">
                      <Label htmlFor="pgf_contact_setting" className="flex items-start gap-3 cursor-pointer">
                        <RadioGroupItem value="pgf_contact" id="pgf_contact_setting" className="mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Phone className="w-4 h-4 text-primary" />
                            <span className="font-medium">Contact by Support Team</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            A trained peer supporter will contact you at your registered number within 24 hours.
                          </p>
                        </div>
                      </Label>
                    </Card>

                    <Card className="p-4 opacity-50 cursor-not-allowed">
                      <Label
                        htmlFor="direct_notification_setting"
                        className="flex items-start gap-3 cursor-not-allowed"
                      >
                        <RadioGroupItem
                          value="direct_notification"
                          id="direct_notification_setting"
                          disabled
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Bell className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium">Direct Notification (Coming Soon)</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Notify your assigned peer supporter directly through the app or text message.
                          </p>
                        </div>
                      </Label>
                    </Card>
                  </div>
                </RadioGroup>
              </div>

              <Button onClick={handleSaveSOSSettings} disabled={isSaving || !sosContactNumber} className="w-full">
                {isSaving ? "Saving..." : "Save SOS Settings"}
              </Button>
            </div>
          </Card>

          {/* Change Password */}
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
                <Input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={8}
                />
                <p className="text-xs text-muted-foreground mt-1">Must be at least 8 characters</p>
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              {passwordError && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <p className="text-sm text-destructive">{passwordError}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={isSaving || !currentPassword || !newPassword || !confirmPassword}
                className="w-full"
              >
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
