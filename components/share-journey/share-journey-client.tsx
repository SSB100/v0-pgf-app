"use client"

import type React from "react"
import { useState } from "react"
import { ArrowLeft, Check, Clipboard, HeartHandshake, LockKeyhole, Mail, Send, ShieldCheck } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

const shareOptions = [
  { id: "journey", label: "Journey progress", description: "Completed modules and current Waypoint activity." },
  { id: "checkins", label: "Daily check-ins", description: "A future sharing option for selected check-in information." },
  { id: "skills", label: "Skills practice", description: "The skills and tools you have explored in Waypoint." },
  { id: "values", label: "Core values", description: "Values you have chosen to record in Waypoint." },
  { id: "safeguards", label: "Safeguards", description: "A future option for selected support and safeguard information." },
]

export default function ShareJourneyClient({ identifyingCode }: { identifyingCode: string }) {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [copied, setCopied] = useState(false)
  const [sent, setSent] = useState(false)
  const [sharing, setSharing] = useState<Record<string, boolean>>({ journey: true, checkins: true, skills: true, values: false, safeguards: false })

  function copyCode() {
    navigator.clipboard?.writeText(identifyingCode)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  function previewInvite(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!email.trim()) return
    setSent(true)
  }

  return (
    <main className="min-h-screen bg-background px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <Button variant="ghost" className="w-fit gap-2 px-2 text-muted-foreground" onClick={() => router.push("/dashboard")}>
          <ArrowLeft data-icon="inline-start" /> Back to dashboard
        </Button>

        <header className="flex flex-col gap-3 border-b border-border/70 pb-6">
          <div className="flex items-center gap-3 text-primary">
            <div className="flex size-11 items-center justify-center rounded-xl border border-primary/25 bg-primary/10">
              <HeartHandshake className="size-5" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em]">Sharing prototype</p>
          </div>
          <h1 className="max-w-2xl text-pretty text-3xl font-bold tracking-tight sm:text-4xl">Preview how professional sharing could work.</h1>
          <p className="max-w-2xl text-pretty leading-6 text-muted-foreground">
            This screen demonstrates a proposed future feature for consent-based sharing with a healthcare professional.
            It does not currently create a professional connection, send an invitation or give anyone access to your Waypoint information.
          </p>
        </header>

        <div className="rounded-lg border border-amber-300/60 bg-amber-50 p-4 text-sm text-amber-950 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-100">
          The controls on this page are a prototype only. Your selections are not saved as sharing permissions and no healthcare professional is monitoring your information through this screen.
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="flex flex-col gap-6">
            <Card className="border-primary/25 bg-primary/[0.04]">
              <CardHeader>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex flex-col gap-2">
                    <CardTitle className="flex items-center gap-2"><ShieldCheck className="size-5 text-primary" /> Prototype connection code</CardTitle>
                    <CardDescription>This code is currently a demonstration identifier. It cannot be used by a professional to open or access your profile.</CardDescription>
                  </div>
                  <LockKeyhole className="size-5 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background/70 px-4 py-3">
                  <code className="text-lg font-semibold tracking-[0.22em] text-primary sm:text-xl">{identifyingCode}</code>
                  <Button variant="outline" size="sm" onClick={copyCode}>
                    {copied ? <Check data-icon="inline-start" /> : <Clipboard data-icon="inline-start" />}
                    {copied ? "Copied" : "Copy"}
                  </Button>
                </div>
                <p className="text-xs leading-5 text-muted-foreground">
                  Future versions should use a secure, random and expiring invitation process rather than relying on this prototype identifier.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Mail className="size-5 text-primary" /> Preview a professional invitation</CardTitle>
                <CardDescription>Enter an email address to preview the current interface. Waypoint will not send an email.</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="flex flex-col gap-4" onSubmit={previewInvite}>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="professional-email">Healthcare professional&apos;s email</Label>
                    <Input id="professional-email" type="email" placeholder="name@clinic.org" value={email} onChange={(event) => { setEmail(event.target.value); setSent(false) }} required />
                  </div>
                  <Button type="submit" className="w-full gap-2"><Send data-icon="inline-start" /> {sent ? "Preview prepared" : "Preview invitation"}</Button>
                  {sent && <p className="text-center text-sm text-primary">Preview prepared for {email}. No email has been sent and no connection has been created.</p>}
                </form>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>What might you choose to share?</CardTitle>
              <CardDescription>These switches demonstrate the type of granular consent a future connection could offer. They do not currently change data access.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col divide-y divide-border/70">
              {shareOptions.map((option) => (
                <div key={option.id} className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
                  <div className="flex flex-col gap-1 pr-4">
                    <Label htmlFor={`share-${option.id}`} className="cursor-pointer text-sm font-semibold">{option.label}</Label>
                    <p className="text-sm leading-5 text-muted-foreground">{option.description}</p>
                  </div>
                  <Switch id={`share-${option.id}`} checked={sharing[option.id] ?? false} onCheckedChange={(checked) => setSharing((current) => ({ ...current, [option.id]: checked }))} aria-label={`Preview sharing ${option.label}`} />
                </div>
              ))}
              <div className="mt-5 flex gap-3 rounded-lg border border-border/70 bg-muted/30 p-4">
                <LockKeyhole className="mt-0.5 size-4 shrink-0 text-primary" />
                <p className="text-xs leading-5 text-muted-foreground">
                  A real professional-sharing feature would need verified professional accounts, explicit consent, revocable permissions and access logging before it could be used with health information.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
