"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ProfessionalMfaForm() {
  const [code, setCode] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    setError("")
    setLoading(true)
    try {
      const response = await fetch("/api/auth/professional-mfa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Unable to verify code")
      window.location.href = data.redirectTo || "/professional"
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to verify code")
      setLoading(false)
    }
  }

  return (
    <Card className="border-border/60 shadow-lg">
      <CardHeader>
        <CardTitle>Authenticator verification</CardTitle>
        <CardDescription>Enter the current six-digit code from your authenticator app. You can also use one unused Waypoint recovery code.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={submit}>
          {error && <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
          <div className="space-y-2">
            <Label htmlFor="mfa-code">Authenticator or recovery code</Label>
            <Input
              id="mfa-code"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              autoComplete="one-time-code"
              inputMode="numeric"
              placeholder="123456"
              disabled={loading}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading || code.trim().length < 6}>
            {loading ? "Verifying..." : "Verify and continue"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">Lost access to your authenticator and recovery codes? <Link href="/support" className="font-medium text-primary hover:underline">Contact Waypoint support</Link> for a controlled identity-recovery process.</p>
        </form>
      </CardContent>
    </Card>
  )
}
