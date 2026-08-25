"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  latest_verification_action: string | null
  latest_verification_at: string | null
}

type VerificationDraft = {
  method: string
  credentialBasis: string
  sources: string
  note: string
  identityChecked: boolean
  credentialBasisChecked: boolean
  organisationChecked: boolean
  affiliationChecked: boolean
  sourcesRecorded: boolean
}

const EMPTY_VERIFICATION: VerificationDraft = {
  method: "",
  credentialBasis: "",
  sources: "",
  note: "",
  identityChecked: false,
  credentialBasisChecked: false,
  organisationChecked: false,
  affiliationChecked: false,
  sourcesRecorded: false,
}

function formatDate(value: string | null) {
  if (!value) return "Not recorded"
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? "Not recorded" : new Intl.DateTimeFormat("en-NZ", { dateStyle: "medium", timeStyle: "short" }).format(date)
}

function verificationReady(draft: VerificationDraft | undefined) {
  if (!draft) return false
  return Boolean(
    draft.method &&
    draft.credentialBasis &&
    draft.sources.trim() &&
    draft.note.trim().length >= 20 &&
    draft.identityChecked &&
    draft.credentialBasisChecked &&
    draft.organisationChecked &&
    draft.affiliationChecked &&
    draft.sourcesRecorded
  )
}

export default function ProfessionalVerificationClient() {
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [busy, setBusy] = useState<string | null>(null)
  const [organisationDrafts, setOrganisationDrafts] = useState<Record<string, string>>({})
  const [verificationDrafts, setVerificationDrafts] = useState<Record<string, VerificationDraft>>({})
  const [actionReasons, setActionReasons] = useState<Record<string, string>>({})

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
      setVerificationDrafts((current) => {
        const next = { ...current }
        for (const professional of data.professionals || []) {
          if (!(professional.id in next)) next[professional.id] = { ...EMPTY_VERIFICATION }
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

  function updateVerification(id: string, patch: Partial<VerificationDraft>) {
    setVerificationDrafts((current) => ({
      ...current,
      [id]: { ...(current[id] || EMPTY_VERIFICATION), ...patch },
    }))
  }

  async function act(professional: Professional, action: "verify" | "suspend" | "offboard" | "reset_mfa") {
    const reason = (actionReasons[professional.id] || "").trim()
    const verification = verificationDrafts[professional.id] || EMPTY_VERIFICATION

    if (action !== "verify" && !reason) {
      setError("Enter a reason before a suspension, offboarding or MFA reset.")
      return
    }
    if (action === "verify" && professional.mfa_status !== "active") {
      setError("This professional must activate MFA before verification can be granted.")
      return
    }
    if (action === "verify" && !verificationReady(verification)) {
      setError("Complete every verification check, record the evidence source and add a detailed note before approval.")
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
          reason,
          organisationName: organisationDrafts[professional.id] || "",
          verificationEvidence: action === "verify" ? {
            method: verification.method,
            credentialBasis: verification.credentialBasis,
            sources: verification.sources.split("\n").map((item) => item.trim()).filter(Boolean),
            note: verification.note,
            checklist: {
              identityChecked: verification.identityChecked,
              credentialBasisChecked: verification.credentialBasisChecked,
              organisationChecked: verification.organisationChecked,
              affiliationChecked: verification.affiliationChecked,
              sourcesRecorded: verification.sourcesRecorded,
            },
          } : undefined,
        }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Administrative action failed")
      setActionReasons((current) => ({ ...current, [professional.id]: "" }))
      if (action === "verify") setVerificationDrafts((current) => ({ ...current, [professional.id]: { ...EMPTY_VERIFICATION } }))
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
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm leading-6">
        <p className="font-semibold">Manual verification is an operational control</p>
        <p className="mt-1 text-muted-foreground">Do not approve from applicant-supplied information alone. Check identity details against independent evidence, verify registration or role basis where applicable, independently confirm the organisation and the applicant's affiliation, and record the sources used. Social media or an applicant-provided screenshot should not be the sole evidence.</p>
      </div>

      {error && <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">{error}</div>}
      {professionals.length === 0 && <Card><CardContent className="py-8 text-sm text-muted-foreground">No professional applications have been created yet.</CardContent></Card>}

      {professionals.map((professional) => {
        const working = busy?.startsWith(`${professional.id}:`) ?? false
        const verification = verificationDrafts[professional.id] || EMPTY_VERIFICATION
        const ready = verificationReady(verification)
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
            <CardContent className="space-y-6">
              <div className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-5">
                <div className="rounded-lg border p-3"><p className="font-medium">Registration</p><p className="mt-1 text-muted-foreground">{professional.registration_body || "Not supplied"}{professional.registration_number ? ` · ${professional.registration_number}` : ""}</p></div>
                <div className="rounded-lg border p-3"><p className="font-medium">Claimed organisation</p><p className="mt-1 text-muted-foreground">{professional.claimed_organisation_name || "Not supplied"}</p></div>
                <div className="rounded-lg border p-3"><p className="font-medium">Requested</p><p className="mt-1 text-muted-foreground">{formatDate(professional.verification_requested_at)}</p></div>
                <div className="rounded-lg border p-3"><p className="font-medium">Current organisation</p><p className="mt-1 text-muted-foreground">{professional.organisation_name || "Not linked"} {professional.organisation_verification_status ? `(${professional.organisation_verification_status})` : ""}</p></div>
                <div className="rounded-lg border p-3"><p className="font-medium">Last verification event</p><p className="mt-1 text-muted-foreground">{professional.latest_verification_action || "None"}<br />{formatDate(professional.latest_verification_at)}</p></div>
              </div>

              <div className="rounded-xl border bg-muted/10 p-4 sm:p-5">
                <div className="mb-4">
                  <h3 className="font-semibold">Verification evidence</h3>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">Complete this from independent checks. If the role is not subject to a mandatory register, choose the non-regulated role basis and independently confirm the person's role with the organisation.</p>
                </div>
                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor={`organisation-${professional.id}`}>Organisation to verify/link</Label>
                    <Input id={`organisation-${professional.id}`} value={organisationDrafts[professional.id] || ""} onChange={(event) => setOrganisationDrafts((current) => ({ ...current, [professional.id]: event.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Credential / role basis</Label>
                    <Select value={verification.credentialBasis} onValueChange={(value) => updateVerification(professional.id, { credentialBasis: value })}><SelectTrigger><SelectValue placeholder="Select basis" /></SelectTrigger><SelectContent><SelectItem value="regulated_registration">Regulated professional registration</SelectItem><SelectItem value="professional_membership">Professional body membership</SelectItem><SelectItem value="non_regulated_role">Non-regulated role / employment basis</SelectItem></SelectContent></Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Primary verification method</Label>
                    <Select value={verification.method} onValueChange={(value) => updateVerification(professional.id, { method: value })}><SelectTrigger><SelectValue placeholder="Select method" /></SelectTrigger><SelectContent><SelectItem value="authoritative_register">Authoritative register</SelectItem><SelectItem value="professional_body">Professional body</SelectItem><SelectItem value="organisation_confirmation">Independent organisation confirmation</SelectItem><SelectItem value="mixed_evidence">Mixed independent evidence</SelectItem></SelectContent></Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`sources-${professional.id}`}>Independent verification sources</Label>
                    <Textarea id={`sources-${professional.id}`} value={verification.sources} onChange={(event) => updateVerification(professional.id, { sources: event.target.value })} placeholder="One source per line, e.g. official register checked 25 Aug 2026\nOrganisation switchboard confirmation 25 Aug 2026" />
                  </div>
                </div>

                <div className="mt-4 grid gap-2 text-sm md:grid-cols-2">
                  <VerificationCheck checked={verification.identityChecked} onChange={(checked) => updateVerification(professional.id, { identityChecked: checked })} text="Identity details are consistent with the independent evidence checked." />
                  <VerificationCheck checked={verification.credentialBasisChecked} onChange={(checked) => updateVerification(professional.id, { credentialBasisChecked: checked })} text="Registration, membership, or non-regulated role basis has been checked as applicable." />
                  <VerificationCheck checked={verification.organisationChecked} onChange={(checked) => updateVerification(professional.id, { organisationChecked: checked })} text="The organisation itself has been independently verified as a real service/entity." />
                  <VerificationCheck checked={verification.affiliationChecked} onChange={(checked) => updateVerification(professional.id, { affiliationChecked: checked })} text="The applicant's current affiliation with that organisation has been independently confirmed." />
                  <VerificationCheck checked={verification.sourcesRecorded} onChange={(checked) => updateVerification(professional.id, { sourcesRecorded: checked })} text="The independent sources and date of checks are recorded above." />
                </div>

                <div className="mt-4 space-y-2">
                  <Label htmlFor={`verification-note-${professional.id}`}>Verification note</Label>
                  <Textarea id={`verification-note-${professional.id}`} value={verification.note} onChange={(event) => updateVerification(professional.id, { note: event.target.value })} placeholder="Summarise what matched, any limitations, and why approval is justified. Minimum 20 characters." />
                  <p className="text-xs text-muted-foreground">This note and the structured verification evidence are written into the professional verification and administrator audit history.</p>
                </div>
              </div>

              {professional.suspension_reason && <div className="rounded-lg border border-amber-300/50 bg-amber-50 p-3 text-sm text-amber-950 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-100">Suspension reason: {professional.suspension_reason}</div>}

              <div className="flex flex-wrap gap-2">
                <Button disabled={working || professional.mfa_status !== "active" || !ready} onClick={() => act(professional, "verify")}>Verify professional + organisation</Button>
                {!ready && <p className="w-full text-xs text-muted-foreground">Verification remains disabled until every required evidence check is complete.</p>}
              </div>

              <div className="border-t pt-5">
                <div className="mb-3 space-y-2"><Label htmlFor={`reason-${professional.id}`}>Security-action reason</Label><Textarea id={`reason-${professional.id}`} value={actionReasons[professional.id] || ""} onChange={(event) => setActionReasons((current) => ({ ...current, [professional.id]: event.target.value }))} placeholder="Required for MFA reset, suspension or offboarding." /></div>
                <div className="flex flex-wrap gap-2"><Button variant="outline" disabled={working} onClick={() => act(professional, "reset_mfa")}>Reset MFA</Button><Button variant="outline" disabled={working} onClick={() => act(professional, "suspend")}>Suspend access</Button><Button variant="destructive" disabled={working} onClick={() => act(professional, "offboard")}>Offboard</Button></div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

function VerificationCheck({ checked, onChange, text }: { checked: boolean; onChange: (checked: boolean) => void; text: string }) {
  return <label className="flex items-start gap-3 rounded-lg border bg-background p-3"><Checkbox checked={checked} onCheckedChange={(value) => onChange(value === true)} /><span className="leading-5">{text}</span></label>
}
