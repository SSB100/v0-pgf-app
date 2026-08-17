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
  { id: "journey", label: "Journey progress", description: "Your completed modules and current growth focus." },
  { id: "checkins", label: "Daily check-ins", description: "Mood, urges, reflections, and check-in patterns." },
  { id: "skills", label: "Skills practice", description: "The tools you have explored and practiced." },
  { id: "values", label: "Core values", description: "The values guiding your personal growth journey." },
  { id: "safeguards", label: "Safeguards", description: "Your personal support plan and safety preferences." },
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

  function sendInvite(event: React.FormEvent<HTMLFormElement>) {
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
            <p className="text-xs font-semibold uppercase tracking-[0.18em]">Private sharing</p>
          </div>
          <h1 className="max-w-2xl text-pretty text-3xl font-bold tracking-tight sm:text-4xl">Share your journey, on your terms.</h1>
          <p className="max-w-2xl text-pretty leading-6 text-muted-foreground">Choose what you feel comfortable sharing with a healthcare professional. You stay in control of your information at every step.</p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="flex flex-col gap-6">
            <Card className="border-primary/25 bg-primary/[0.04]">
              <CardHeader>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex flex-col gap-2">
                    <CardTitle className="flex items-center gap-2"><ShieldCheck className="size-5 text-primary" /> Your identifying code</CardTitle>
                    <CardDescription>Share this code with your healthcare professional so they can find your profile.</CardDescription>
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
                <p className="text-xs leading-5 text-muted-foreground">This code is unique to you. It does not reveal your name or personal information by itself.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Mail className="size-5 text-primary" /> Invite a healthcare professional</CardTitle>
                <CardDescription>Enter their email and we&apos;ll prepare an invitation to connect with your shared journey.</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="flex flex-col gap-4" onSubmit={sendInvite}>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="professional-email">Healthcare professional&apos;s email</Label>
                    <Input id="professional-email" type="email" placeholder="name@clinic.org" value={email} onChange={(event) => { setEmail(event.target.value); setSent(false) }} required />
                  </div>
                  <Button type="submit" className="w-full gap-2"><Send data-icon="inline-start" /> {sent ? "Invitation ready" : "Send invitation"}</Button>
                  {sent && <p className="text-center text-sm text-primary">Mock invite prepared for {email}. Email delivery will be connected in a future update.</p>}
                </form>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>What would you like to share?</CardTitle>
              <CardDescription>Only the items you turn on will be included in the connection request.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col divide-y divide-border/70">
              {shareOptions.map((option) => (
                <div key={option.id} className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
                  <div className="flex flex-col gap-1 pr-4">
                    <Label htmlFor={`share-${option.id}`} className="cursor-pointer text-sm font-semibold">{option.label}</Label>
                    <p className="text-sm leading-5 text-muted-foreground">{option.description}</p>
                  </div>
                  <Switch id={`share-${option.id}`} checked={sharing[option.id] ?? false} onCheckedChange={(checked) => setSharing((current) => ({ ...current, [option.id]: checked }))} aria-label={`Share ${option.label}`} />
                </div>
              ))}
              <div className="mt-5 flex gap-3 rounded-lg border border-border/70 bg-muted/30 p-4">
                <LockKeyhole className="mt-0.5 size-4 shrink-0 text-primary" />
                <p className="text-xs leading-5 text-muted-foreground">You can change these choices or disconnect a professional at any time. This presentation flow does not send real data yet.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
