"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Clipboard, Copy, Eye, Link2, LogOut, RefreshCw, ShieldCheck, UserRoundCheck } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PROFESSIONAL_SHARE_SCOPES, PROFESSIONAL_REQUESTABLE_SCOPES, type ProfessionalShareScope } from "@/lib/sharing-policy"

type Professional = {
  display_name: string
  professional_role: string | null
  organisation_name: string | null
}

type ClientLink = {
  link_id: string
  accepted_at: string | null
  client_name: string | null
  shared_scopes: ProfessionalShareScope[]
  latest_checkin_date: string | null
  last_professional_access: string | null
}

type Invitation = {
  id: string
  requested_scopes: ProfessionalShareScope[]
  status: string
  expires_at: string
  created_at: string
  used_at: string | null
}

type Summary = any

function dateLabel(value: string | null | undefined) {
  if (!value) return "Not yet"
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? "Not yet" : new Intl.DateTimeFormat("en-NZ", { dateStyle: "medium", timeStyle: "short" }).format(d)
}

export default function ProfessionalDashboardClient({ professional }: { professional: Professional }) {
  const router = useRouter()
  const [clients, setClients] = useState<ClientLink[]>([])
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [selectedClient, setSelectedClient] = useState<ClientLink | null>(null)
  const [summary, setSummary] = useState<Summary | null>(null)
  const [windowDays, setWindowDays] = useState("14")
  const [inviteScopes, setInviteScopes] = useState<ProfessionalShareScope[]>(["journey_progress", "daily_checkins_summary"])
  const [inviteDays, setInviteDays] = useState("7")
  const [latestInviteUrl, setLatestInviteUrl] = useState("")
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")

  const requestableDefinitions = useMemo(
    () => PROFESSIONAL_SHARE_SCOPES.filter((scope) => PROFESSIONAL_REQUESTABLE_SCOPES.includes(scope.id)),
    [],
  )

  async function refresh() {
    setLoading(true)
    setError("")
    try {
      const [clientsResponse, invitationsResponse] = await Promise.all([
        fetch("/api/professional/clients", { cache: "no-store" }),
        fetch("/api/professional/invitations", { cache: "no-store" }),
      ])
      const clientsData = await clientsResponse.json()
      const invitationsData = await invitationsResponse.json()
      if (!clientsResponse.ok) throw new Error(clientsData.error || "Unable to load connected clients")
      if (!invitationsResponse.ok) throw new Error(invitationsData.error || "Unable to load invitations")
      setClients(clientsData.clients || [])
      setInvitations(invitationsData.invitations || [])
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to load professional portal")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { refresh() }, [])

  function toggleInviteScope(scope: ProfessionalShareScope, checked: boolean) {
    setInviteScopes((current) => checked ? [...new Set([...current, scope])] : current.filter((item) => item !== scope))
  }

  async function createInvitation() {
    setBusy(true)
    setError("")
    setLatestInviteUrl("")
    try {
      const response = await fetch("/api/professional/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scopes: inviteScopes, expiresInDays: Number(inviteDays) }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Unable to create invitation")
      setLatestInviteUrl(data.invitationUrl)
      await refresh()
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to create invitation")
    } finally {
      setBusy(false)
    }
  }

  async function revokeInvitation(invitationId: string) {
    setBusy(true)
    setError("")
    try {
      const response = await fetch("/api/professional/invitations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invitationId, action: "revoke" }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Unable to revoke invitation")
      await refresh()
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to revoke invitation")
    } finally {
      setBusy(false)
    }
  }

  async function viewClient(client: ClientLink, days = windowDays) {
    setSelectedClient(client)
    setSummary(null)
    setError("")
    try {
      const response = await fetch(`/api/professional/clients/${client.link_id}/summary?days=${days}`, { cache: "no-store" })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Unable to load client summary")
      setSummary(data)
      await refresh()
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to load client summary")
    }
  }

  async function signOut() {
    await fetch("/api/auth/signout", { method: "POST" })
    router.push("/auth/signin")
    router.refresh()
  }

  return (
    <main className="min-h-screen bg-background px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Waypoint professional portal</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight">Clinical support overview</h1>
            <p className="mt-2 text-muted-foreground">{professional.display_name}{professional.professional_role ? ` · ${professional.professional_role}` : ""}{professional.organisation_name ? ` · ${professional.organisation_name}` : ""}</p>
          </div>
          <div className="flex gap-2"><Button variant="outline" onClick={refresh} className="gap-2"><RefreshCw className="size-4" /> Refresh</Button><Button variant="ghost" onClick={signOut} className="gap-2"><LogOut className="size-4" /> Sign out</Button></div>
        </header>

        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm leading-6">
          <div className="flex items-start gap-3"><ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" /><div><p className="font-semibold">User-authorised review, not live monitoring</p><p className="text-muted-foreground">This portal shows only categories a connected user has chosen to share. It does not replace clinical assessment, organisational records or emergency-response processes, and it does not generate a clinical risk score.</p></div></div>
        </div>

        {error && <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">{error}</div>}

        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.5fr]">
          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Link2 className="size-5 text-primary" /> Invite a client</CardTitle><CardDescription>Create a short-lived link. The client sees your verified identity and chooses what to share.</CardDescription></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {requestableDefinitions.map((scope) => <label key={scope.id} className="flex items-start gap-3 rounded-lg border p-3 text-sm"><Checkbox checked={inviteScopes.includes(scope.id)} onCheckedChange={(v) => toggleInviteScope(scope.id, v === true)} /><span><span className="block font-medium">{scope.label}</span><span className="block text-muted-foreground">{scope.description}</span></span></label>)}
                </div>
                <div className="flex items-end gap-3"><div className="flex-1"><p className="mb-2 text-sm font-medium">Invitation expiry</p><Select value={inviteDays} onValueChange={setInviteDays}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="1">1 day</SelectItem><SelectItem value="3">3 days</SelectItem><SelectItem value="7">7 days</SelectItem><SelectItem value="14">14 days</SelectItem></SelectContent></Select></div><Button disabled={busy || inviteScopes.length === 0} onClick={createInvitation}>Create link</Button></div>
                {latestInviteUrl && <div className="rounded-lg border bg-muted/30 p-3"><p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Shown once</p><p className="mt-1 break-all text-sm">{latestInviteUrl}</p><Button variant="outline" size="sm" className="mt-3 gap-2" onClick={() => navigator.clipboard.writeText(latestInviteUrl)}><Copy className="size-3.5" /> Copy invitation</Button><p className="mt-2 text-xs text-muted-foreground">Waypoint stores only a hash of this token, so the clear invitation cannot be recovered later.</p></div>}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Recent invitations</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {invitations.length === 0 && <p className="text-sm text-muted-foreground">No invitations created yet.</p>}
                {invitations.slice(0, 8).map((invite) => <div key={invite.id} className="rounded-lg border p-3 text-sm"><div className="flex items-center justify-between gap-2"><Badge variant={invite.status === "active" ? "default" : "secondary"}>{invite.status}</Badge>{invite.status === "active" && <Button variant="ghost" size="sm" disabled={busy} onClick={() => revokeInvitation(invite.id)}>Revoke</Button>}</div><p className="mt-2 text-muted-foreground">Created {dateLabel(invite.created_at)}</p><p className="text-muted-foreground">Expires {dateLabel(invite.expires_at)}</p></div>)}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><UserRoundCheck className="size-5 text-primary" /> Connected clients</CardTitle><CardDescription>Only active, client-approved relationships appear here.</CardDescription></CardHeader>
              <CardContent>
                {loading ? <p className="text-sm text-muted-foreground">Loading...</p> : clients.length === 0 ? <p className="text-sm text-muted-foreground">No connected clients yet.</p> : <div className="space-y-3">{clients.map((client) => <button key={client.link_id} type="button" onClick={() => viewClient(client)} className="w-full rounded-lg border p-4 text-left transition-colors hover:bg-muted/40"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="font-semibold">{client.client_name || "Waypoint user"}</p><p className="mt-1 text-sm text-muted-foreground">Connected {dateLabel(client.accepted_at)}</p></div><Button type="button" size="sm" variant="outline" className="pointer-events-none gap-2"><Eye className="size-3.5" /> Review summary</Button></div><div className="mt-3 flex flex-wrap gap-1.5">{client.shared_scopes.map((scope) => <Badge key={scope} variant="secondary">{PROFESSIONAL_SHARE_SCOPES.find((item) => item.id === scope)?.label || scope}</Badge>)}</div><p className="mt-3 text-xs text-muted-foreground">Latest check-in: {client.latest_checkin_date ? new Date(client.latest_checkin_date).toLocaleDateString("en-NZ") : "none shared yet"} · Last portal review: {dateLabel(client.last_professional_access)}</p></button>)}</div>}
              </CardContent>
            </Card>

            {selectedClient && <Card>
              <CardHeader><div className="flex flex-wrap items-start justify-between gap-3"><div><CardTitle>{selectedClient.client_name || "Waypoint user"}</CardTitle><CardDescription>Self-reported information shared by this user.</CardDescription></div><Select value={windowDays} onValueChange={(value) => { setWindowDays(value); viewClient(selectedClient, value) }}><SelectTrigger className="w-40"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="7">Last 7 days</SelectItem><SelectItem value="14">Last 14 days</SelectItem><SelectItem value="30">Last 30 days</SelectItem></SelectContent></Select></div></CardHeader>
              <CardContent className="space-y-5">
                {!summary ? <p className="text-sm text-muted-foreground">Loading authorised summary...</p> : <>
                  <div className="rounded-lg border bg-muted/20 p-3 text-sm text-muted-foreground">{summary.monitoringNotice}</div>
                  {summary.dailyCheckins && <section><h3 className="font-semibold">Daily check-ins</h3><div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><Metric label="Check-ins" value={summary.dailyCheckins.summary.checkin_count} /><Metric label="Average mood" value={summary.dailyCheckins.summary.average_mood ?? "No data"} /><Metric label="Average urge" value={summary.dailyCheckins.summary.average_urge ?? "No data"} /><Metric label="Gambling days" value={summary.dailyCheckins.summary.gambling_days ?? 0} /></div><div className="mt-3 space-y-1">{summary.dailyCheckins.trend.map((row: any) => <div key={row.date} className="grid grid-cols-4 rounded-md border px-3 py-2 text-xs"><span>{new Date(row.date).toLocaleDateString("en-NZ")}</span><span>Mood {row.mood_rating ?? "-"}</span><span>Urge {row.urge_strength ?? "-"}</span><span>{row.gambling_occurred ? "Gambling reported" : "No gambling reported"}</span></div>)}</div></section>}
                  {summary.journeyProgress && <section><h3 className="font-semibold">Journey progress</h3><p className="mt-1 text-sm text-muted-foreground">{summary.journeyProgress.completed_modules} modules completed.</p><div className="mt-2 flex flex-wrap gap-2">{summary.journeyProgress.recentModules.map((module: any) => <Badge key={`${module.module_slug}-${module.completed_at}`} variant="secondary">{module.module_name}</Badge>)}</div></section>}
                  {summary.skillsPractice && <section><h3 className="font-semibold">Skills</h3><p className="mt-1 text-sm text-muted-foreground">{summary.skillsPractice.completed_skills} skills recorded, {summary.skillsPractice.found_helpful} marked helpful.</p></section>}
                  {summary.coreValues && <section><h3 className="font-semibold">Core values</h3><div className="mt-2 flex flex-wrap gap-2">{summary.coreValues.map((value: any) => <Badge key={value.value_name} variant="outline">{value.value_name}</Badge>)}</div></section>}
                  <div className="flex items-center gap-2 border-t pt-4 text-xs text-muted-foreground"><Clipboard className="size-3.5" /> Opening this summary is recorded in the user's access history.</div>
                </>}
              </CardContent>
            </Card>}
          </div>
        </div>
      </div>
    </main>
  )
}

function Metric({ label, value }: { label: string; value: unknown }) {
  return <div className="rounded-lg border p-3"><p className="text-xs font-medium text-muted-foreground">{label}</p><p className="mt-1 text-xl font-semibold">{String(value ?? "-")}</p></div>
}
