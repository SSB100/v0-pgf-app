"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

type Professional = {
  id: string
  display_name: string
  email: string
  professional_role: string | null
  registration_body: string | null
  registration_number: string | null
  verification_status: string
  claimed_organisation_name: string | null
  organisation_name: string | null
  organisation_verification_status: string | null
  mfa_status: string | null
  mfa_verified_at: string | null
  verification_requested_at: string | null
  verified_at: string | null
  suspended_at: string | null
  suspension_reason: string | null
  offboarded_at: string | null
}

function formatDate(value: string | null) {
  if (!value) return "Not recorded"
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? "Not recorded" : new Intl.DateTimeFormat("en-NZ", { dateStyle: "medium", timeStyle: "short" }).format(date)
}

export default function ProfessionalVerificationClient() {
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [busy, setBusy] = useState<string | null>(null)
  const [organisationDrafts, setOrganisationDrafts] = useState<Record<string, string>>({})
  const [notes, setNotes] = useState<Record<string, string>>({})

  async function load() {
    setLoading(true)
    setError("")
    try {
      const response = await fetch("/api/admin/professionals", { cache: "no-store" })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Unable to load professionals")
      setProfessionals(data.professionals || [])
      setOrganisationDrafts((current) => {
        const next = { ...current }
        for (const professional of data.professionals || []) {
          if (!(professional.id in next)) next[professional.id] = professional.organisation_name || professional.claimed_organisation_name || ""
        }
        return next
      })
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to load professionals")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function act(professional: Professional, action: "verify" | "suspend" | "offboard" | "reset_mfa") {
    const note = (notes[professional.id] || "").trim()
    if (action !== "verify" && !note) {
      setError("Enter a reason before a suspension, offboarding or MFA reset.")
      return
    }
    if (action === "verify" && professional.mfa_status !== "active") {
      setError("This professional must activate MFA before verification can be granted.")
      return
    }
    if (action === "offboard" && !window.confirm(`Offboard ${professional.display_name}? This ends professional relationships and revokes sharing grants.`)) return

    setBusy(`${professional.id}:${action}`)
    setError("")
    try {
      const response = await fetch("/api/admin/professionals", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          professionalId: professional.id,
          action,
          reason: note,
          verificationNote: note,
          organisationName: organisationDrafts[professional.id] || "",
        }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Administrative action failed")
      setNotes((current) => ({ ...current, [professional.id]: "" }))
      await load()
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Administrative action failed")
    } finally {
      setBusy(null)
    }
  }

  if (loading) return <p className="text-sm text-muted-foreground">Loading professional verification queue...</p>

  return (
    <div className="space-y-5">
      {error && <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">{error}</div>}
      {professionals.length === 0 && <Card><CardContent className="py-8 text-sm text-muted-foreground">No professional applications have been created yet.</CardContent></Card>}

      {professionals.map((professional) => {
        const working = busy?.startsWith(`${professional.id}:`) ?? false
        return (
          <Card key={professional.id} className={professional.verification_status === "pending" ? "border-primary/30" : undefined}>
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <CardTitle>{professional.display_name}</CardTitle>
                  <CardDescription>{professional.email}{professional.professional_role ? ` · ${professional.professional_role}` : ""}</CardDescription>
                </div>
                <div className="flex flex-wrap gap-2"><Badge variant="outline">{professional.verification_status}</Badge><Badge variant={professional.mfa_status === "active" ? "default" : "outline"}>MFA {professional.mfa_status || "not set"}</Badge></div>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg border p-3"><p className="font-medium">Registration</p><p className="mt-1 text-muted-foreground">{professional.registration_body || "Not supplied"}{professional.registration_number ? ` · ${professional.registration_number}` : ""}</p></div>
                <div className="rounded-lg border p-3"><p className="font-medium">Claimed organisation</p><p className="mt-1 text-muted-foreground">{professional.claimed_organisation_name || "Not supplied"}</p></div>
                <div className="rounded-lg border p-3"><p className="font-medium">Requested</p><p className="mt-1 text-muted-foreground">{formatDate(professional.verification_requested_at)}</p></div>
                <div className="rounded-lg border p-3"><p className="font-medium">Current organisation</p><p className="mt-1 text-muted-foreground">{professional.organisation_name || "Not linked"} {professional.organisation_verification_status ? `(${professional.organisation_verification_status})` : ""}</p></div>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor={`organisation-${professional.id}`}>Organisation to verify/link</Label>
                  <Input id={`organisation-${professional.id}`} value={organisationDrafts[professional.id] || ""} onChange={(event) => setOrganisationDrafts((current) => ({ ...current, [professional.id]: event.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`note-${professional.id}`}>Verification note or security-action reason</Label>
                  <Textarea id={`note-${professional.id}`} value={notes[professional.id] || ""} onChange={(event) => setNotes((current) => ({ ...current, [professional.id]: event.target.value }))} placeholder="Record what was checked, or why access is being changed." />
                </div>
              </div>

              {professional.suspension_reason && <div className="rounded-lg border border-amber-300/50 bg-amber-50 p-3 text-sm text-amber-950 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-100">Suspension reason: {professional.suspension_reason}</div>}

              <div className="flex flex-wrap gap-2">
                <Button disabled={working || professional.mfa_status !== "active"} onClick={() => act(professional, "verify")}>Verify professional + organisation</Button>
                <Button variant="outline" disabled={working} onClick={() => act(professional, "reset_mfa")}>Reset MFA</Button>
                <Button variant="outline" disabled={working} onClick={() => act(professional, "suspend")}>Suspend access</Button>
                <Button variant="destructive" disabled={working} onClick={() => act(professional, "offboard")}>Offboard</Button>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
