"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function MfaSetupClient() {
  const [status, setStatus] = useState<"loading" | "pending" | "active" | "error">("loading")
  const [secret, setSecret] = useState("")
  const [otpauthUri, setOtpauthUri] = useState("")
  const [code, setCode] = useState("")
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([])
  const [redirectTo, setRedirectTo] = useState("/professional")

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch("/api/security/mfa/setup", { cache: "no-store" })
        const data = await response.json()
        if (!response.ok) throw new Error(data.error || "Unable to prepare authenticator setup")
        if (data.status === "active") {
          setStatus("active")
          return
        }
        setSecret(data.secret || "")
        setOtpauthUri(data.otpauthUri || "")
        setStatus("pending")
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : "Unable to prepare authenticator setup")
        setStatus("error")
      }
    }
    load()
  }, [])

  async function verify(event: React.FormEvent) {
    event.preventDefault()
    setSaving(true)
    setError("")
    try {
      const response = await fetch("/api/security/mfa/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Unable to confirm authenticator")
      setRecoveryCodes(data.recoveryCodes || [])
      setRedirectTo(data.redirectTo || "/professional")
      setStatus("active")
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to confirm authenticator")
    } finally {
      setSaving(false)
    }
  }

  if (status === "loading") return <p className="text-sm text-muted-foreground">Preparing secure authenticator setup...</p>
  if (status === "error") return <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">{error}</div>

  if (status === "active" && recoveryCodes.length > 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Save your recovery codes</CardTitle>
          <CardDescription>Each code works once. Store them somewhere separate from your authenticator device. Waypoint cannot display these same codes again.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-2 rounded-lg border bg-muted/20 p-4 font-mono text-sm sm:grid-cols-2">
            {recoveryCodes.map((item) => <div key={item}>{item}</div>)}
          </div>
          <Button className="w-full" onClick={() => { window.location.href = redirectTo }}>I have saved these codes</Button>
        </CardContent>
      </Card>
    )
  }

  if (status === "active") {
    return (
      <Card>
        <CardHeader><CardTitle>Authenticator protection is active</CardTitle><CardDescription>This account now requires MFA after password sign-in before sensitive professional or administrative access is available.</CardDescription></CardHeader>
        <CardContent><Button onClick={() => { window.location.href = "/professional" }}>Continue</Button></CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connect an authenticator app</CardTitle>
        <CardDescription>In Google Authenticator, Microsoft Authenticator, 1Password, Authy or another TOTP app, choose to add an account manually and enter the setup key below.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
        <div className="space-y-2">
          <Label>Account</Label>
          <p className="rounded-lg border bg-muted/20 p-3 text-sm">Waypoint</p>
        </div>
        <div className="space-y-2">
          <Label>Setup key</Label>
          <div className="flex gap-2">
            <Input value={secret} readOnly className="font-mono" />
            <Button type="button" variant="outline" onClick={() => navigator.clipboard?.writeText(secret)}>Copy</Button>
          </div>
          <p className="text-xs leading-5 text-muted-foreground">Use time-based one-time passwords (TOTP), six digits, 30-second period. Keep this key private.</p>
        </div>
        <details className="text-xs text-muted-foreground">
          <summary className="cursor-pointer font-medium text-foreground">Advanced setup URI</summary>
          <p className="mt-2 break-all rounded-lg border p-3 font-mono">{otpauthUri}</p>
        </details>
        <form className="space-y-3" onSubmit={verify}>
          <Label htmlFor="setup-code">Confirm with the current six-digit code</Label>
          <Input id="setup-code" value={code} onChange={(event) => setCode(event.target.value)} inputMode="numeric" autoComplete="one-time-code" placeholder="123456" required />
          <Button className="w-full" type="submit" disabled={saving || !/^\d{6}$/.test(code.trim())}>{saving ? "Confirming..." : "Activate authenticator protection"}</Button>
        </form>
      </CardContent>
    </Card>
  )
}
