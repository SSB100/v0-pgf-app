"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Building2, RotateCcw, ShieldAlert, UserRoundCheck, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

type Member = {
  membership_id: string
  professional_account_id: string
  display_name: string
  email: string
  professional_role: string | null
  professional_status: string
  membership_status: string
  membership_verified_at: string | null
  membership_status_reason: string | null
}

type Organisation = {
  id: string
  name: string
  organisation_type: string | null
  verification_status: string
  verified_at: string | null
  verification_note: string | null
  suspended_at: string | null
  suspension_reason: string | null
  active_members: string
  suspended_members: string
  active_client_links: string
  current_members: Member[]
  latest_admin_action: string | null
  latest_admin_reason: string | null
  latest_admin_at: string | null
}

function formatDate(value: string | null) {
  if (!value) return "Not recorded"
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? "Not recorded" : new Intl.DateTimeFormat("en-NZ", { dateStyle: "medium", timeStyle: "short" }).format(date)
}

export default function OrganisationLifecycleClient() {
  const [organisations, setOrganisations] = useState<Organisation[]>([])
  const [reasons, setReasons] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState<string | null>(null)
  const [error, setError] = useState("")

  async function load() {
    setLoading(true)
    setError("")
    try {
      const response = await fetch("/api/admin/organisations", { cache: "no-store" })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Unable to load organisations")
      setOrganisations(data.organisations || [])
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to load organisations")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function act(organisation: Organisation, action: "suspend" | "reactivate") {
    const reason = (reasons[organisation.id] || "").trim()
    if (reason.length < 20) {
      setError("Record a review reason of at least 20 characters before changing organisation status.")
      return
    }

    const confirmed = action === "suspend"
      ? window.confirm(`Suspend ${organisation.name}? Professional sessions will be invalidated, active invitation links revoked and active client relationships paused.`)
      : window.confirm(`Reactivate ${organisation.name}? Suspended professional memberships will remain suspended until each affiliation is re-verified.`)
    if (!confirmed) return

    setBusy(`${organisation.id}:${action}`)
    setError("")
    try {
      const response = await fetch("/api/admin/organisations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ organisationId: organisation.id, action, reason }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Organisation lifecycle action failed")
      setReasons((current) => ({ ...current, [organisation.id]: "" }))
      await load()
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Organisation lifecycle action failed")
    } finally {
      setBusy(null)
    }
  }

  if (loading) return <p className="text-sm text-muted-foreground">Loading organisation register...</p>

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm leading-6">
        <p className="font-semibold">Organisation status is an access-control gate</p>
        <p className="mt-1 text-muted-foreground">Suspending an organisation immediately removes the organisation trust gate for its professionals. Waypoint administrators can manage organisation and workforce access, but this screen does not expose client health or recovery information.</p>
      </div>

      {error && <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">{error}</div>}
      {organisations.length === 0 && <Card><CardContent className="py-8 text-sm text-muted-foreground">No organisations have been created yet.</CardContent></Card>}

      {organisations.map((organisation) => {
        const working = busy?.startsWith(`${organisation.id}:`) ?? false
        const reason = reasons[organisation.id] || ""
        return (
          <Card key={organisation.id} className={organisation.verification_status === "suspended" ? "border-destructive/40" : undefined}>
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <CardTitle className="flex items-center gap-2"><Building2 className="size-5" /> {organisation.name}</CardTitle>
                  <CardDescription>{organisation.organisation_type || "Organisation type not recorded"}</CardDescription>
                </div>
                <Badge variant={organisation.verification_status === "verified" ? "default" : "outline"}>{organisation.verification_status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-3 text-sm sm:grid-cols-3">
                <div className="rounded-lg border p-3"><p className="flex items-center gap-2 font-medium"><UserRoundCheck className="size-4" /> Active memberships</p><p className="mt-1 text-2xl font-semibold">{organisation.active_members}</p></div>
                <div className="rounded-lg border p-3"><p className="flex items-center gap-2 font-medium"><Users className="size-4" /> Suspended memberships</p><p className="mt-1 text-2xl font-semibold">{organisation.suspended_members}</p></div>
                <div className="rounded-lg border p-3"><p className="font-medium">Active client links</p><p className="mt-1 text-2xl font-semibold">{organisation.active_client_links}</p></div>
              </div>

              {organisation.suspension_reason && <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm"><p className="font-medium">Current suspension reason</p><p className="mt-1 leading-6 text-muted-foreground">{organisation.suspension_reason}</p><p className="mt-1 text-xs text-muted-foreground">Suspended {formatDate(organisation.suspended_at)}</p></div>}

              <div>
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2"><h3 className="font-semibold">Current workforce memberships</h3><Link href="/admin/professionals" className="text-sm font-medium text-primary hover:underline">Professional verification</Link></div>
                {organisation.current_members.length === 0 ? <p className="text-sm text-muted-foreground">No current professional memberships.</p> : (
                  <div className="grid gap-2">
                    {organisation.current_members.map((member) => (
                      <div key={member.membership_id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3 text-sm">
                        <div><p className="font-medium">{member.display_name}</p><p className="text-muted-foreground">{member.email}{member.professional_role ? ` · ${member.professional_role}` : ""}</p>{member.membership_status_reason && <p className="mt-1 max-w-2xl text-xs text-muted-foreground">{member.membership_status_reason}</p>}</div>
                        <div className="flex gap-2"><Badge variant="outline">professional {member.professional_status}</Badge><Badge variant={member.membership_status === "active" ? "default" : "outline"}>membership {member.membership_status}</Badge></div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="border-t pt-5">
                <div className="space-y-2">
                  <Label htmlFor={`reason-${organisation.id}`}>{organisation.verification_status === "suspended" ? "Reactivation review note" : "Suspension reason"}</Label>
                  <Textarea id={`reason-${organisation.id}`} value={reason} onChange={(event) => setReasons((current) => ({ ...current, [organisation.id]: event.target.value }))} placeholder={organisation.verification_status === "suspended" ? "Record the independent review that supports restoring the organisation trust gate. Individual memberships will still require re-verification." : "Record the issue requiring organisation access to be suspended. Minimum 20 characters."} />
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {organisation.verification_status === "verified" && <Button variant="destructive" disabled={working || reason.trim().length < 20} onClick={() => act(organisation, "suspend")}><ShieldAlert className="mr-2 size-4" /> Suspend organisation</Button>}
                  {organisation.verification_status === "suspended" && <Button disabled={working || reason.trim().length < 20} onClick={() => act(organisation, "reactivate")}><RotateCcw className="mr-2 size-4" /> Reactivate organisation</Button>}
                </div>
                {organisation.verification_status === "suspended" && <p className="mt-3 text-xs leading-5 text-muted-foreground">Reactivation restores only the organisation trust gate. Suspended professional memberships stay suspended and must be independently re-verified. Paused client relationships are not automatically resumed.</p>}
              </div>

              {organisation.latest_admin_action && <p className="text-xs text-muted-foreground">Latest lifecycle action: {organisation.latest_admin_action} · {formatDate(organisation.latest_admin_at)}</p>}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
