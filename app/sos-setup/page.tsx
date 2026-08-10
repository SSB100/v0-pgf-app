"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { AlertTriangle, Shield, Phone, Bell } from "lucide-react"

export default function SOSSetupPage() {
  const router = useRouter()
  const [contactNumber, setContactNumber] = useState("")
  const [serviceType, setServiceType] = useState<"pgf_contact" | "direct_notification">("pgf_contact")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // Check if already configured
    checkSOSConfig()
  }, [])

  async function checkSOSConfig() {
    try {
      const response = await fetch("/api/sos/check-config")
      const data = await response.json()

      if (data.configured) {
        // Already configured, redirect to dashboard
        router.push("/dashboard")
      } else {
        setIsChecking(false)
      }
    } catch (error) {
      console.error("[v0] Error checking SOS config:", error)
      setIsChecking(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/sos/configure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contactNumber, serviceType }),
      })

      if (response.ok) {
        alert("SOS configured successfully! You can now use the SOS button anytime you need support.")
        router.push("/dashboard")
      } else {
        alert("Failed to configure SOS. Please try again.")
      }
    } catch (error) {
      alert("Failed to configure SOS. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 mb-4">
            <AlertTriangle className="w-8 h-8 text-destructive" />
          </div>
          <h1 className="text-3xl font-bold mb-2">SOS Support Setup</h1>
          <p className="text-muted-foreground">Configure your emergency support preferences</p>
        </div>

        <Card className="p-6 mb-6">
          <div className="flex items-start gap-4 mb-6">
            <Shield className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
            <div>
              <h2 className="text-xl font-semibold mb-2">What is the SOS Button?</h2>
              <p className="text-muted-foreground leading-relaxed">
                The SOS button is your direct line to support when you need it most. When you press it, a support
                request is sent to a designated support team, and a trained peer supporter will reach out to you at your
                registered number within 24 hours to provide assistance and help you navigate challenging moments.
              </p>
            </div>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <p className="font-medium flex items-center gap-2">
              <Phone className="w-4 h-4 text-primary" />
              How it works:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-6">
              <li>Press the SOS button anytime you need support</li>
              <li>Your alert is sent to a designated support team</li>
              <li>A trained peer supporter will contact you within 24 hours at your registered number</li>
              <li>Get support and guidance when you need it</li>
            </ul>
          </div>
        </Card>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="contactNumber" className="text-base font-semibold mb-3 block">
                Contact Number *
              </Label>
              <p className="text-sm text-muted-foreground mb-3">
                Provide a phone number where we can reach you in case of an emergency.
              </p>
              <Input
                id="contactNumber"
                type="tel"
                placeholder="+64 21 123 4567"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                required
                className="text-base"
              />
            </div>

            <div>
              <Label className="text-base font-semibold mb-3 block">Preferred Support Method *</Label>
              <RadioGroup value={serviceType} onValueChange={(value) => setServiceType(value as any)}>
                <div className="space-y-3">
                  <Card className="p-4 hover:border-primary cursor-pointer transition-colors">
                    <Label htmlFor="pgf_contact" className="flex items-start gap-3 cursor-pointer">
                      <RadioGroupItem value="pgf_contact" id="pgf_contact" className="mt-1" />
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
                    <Label htmlFor="direct_notification" className="flex items-start gap-3 cursor-not-allowed">
                      <RadioGroupItem value="direct_notification" id="direct_notification" disabled className="mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Bell className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">Direct Notification (Coming Soon)</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Notify your assigned peer supporter directly through the app or text message. This feature is
                          currently in development.
                        </p>
                      </div>
                    </Label>
                  </Card>
                </div>
              </RadioGroup>
            </div>

            <div className="pt-4 space-y-3">
              <Button
                type="submit"
                disabled={isSubmitting || !contactNumber}
                className="w-full bg-primary hover:bg-primary/90"
              >
                {isSubmitting ? "Saving..." : "Save SOS Configuration"}
              </Button>

              <Button type="button" variant="outline" onClick={() => router.push("/dashboard")} className="w-full">
                Skip for Now
              </Button>
            </div>
          </form>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          You can update your SOS preferences anytime from your dashboard settings.
        </p>
      </div>
    </div>
  )
}
