"use client"

import { useEffect, useMemo, useState, type ReactNode } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  BookOpenCheck,
  CalendarDays,
  Clipboard,
  Copy,
  Eye,
  LayoutDashboard,
  Link2,
  LogOut,
  RefreshCw,
  Settings2,
  ShieldCheck,
  UserRoundCheck,
  UsersRound,
  Wrench,
} from "lucide-react"
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

type SummaryPeriod = { basis?: "rolling_days" | "all_time" | "current"; days?: number }

type ProfessionalSummary = {
  summarySchemaVersion: string
  client: { name: string | null; connectedAt: string | null }
  generatedAt: string
  sharedScopes: ProfessionalShareScope[]
  monitoringNotice: string
  dataBoundary: {
    userAuthorised: boolean
    selfReported: boolean
    freeTextIncluded: boolean
    clinicalRecord: boolean
    liveMonitoring: boolean
    riskScoreGenerated: boolean
    explicitlyExcluded: string[]
  }
  dailyCheckins?: {
    period: SummaryPeriod
    summary: {
      checkin_count?: number
      average_mood?: number | string | null
      average_urge?: number | string | null
      average_overall?: number | string | null
      gambling_days?: number
      behaviour_days?: number
      latest_date?: string | null
    }
    trend: Array<{
      date?: string
      mood_rating?: number | null
      urge_strength?: number | null
      overall_rating?: number | null
      gambling_occurred?: boolean | null
      behavior_occurred?: boolean | null
    }>
  }
  journeyProgress?: {
    period: SummaryPeriod
    completed_modules?: number
    latest_completion?: string | null
    recentModules: Array<{
      module_slug?: string
      module_name?: string
      completed_at?: string | null
      content_version?: string | null
    }>
  }
  skillsPractice?: {
    period: SummaryPeriod
    practice_count?: number
    helpful_count?: number
    average_effectiveness?: number | string | null
    latest_practice?: string | null
    recentSkills: Array<{
      skill_name?: string
      skill_category?: string | null
      effectiveness_rating?: number | null
      was_helpful?: boolean | null
      practiced_at?: string | null
      content_version?: string | null
    }>
  }
  coreValues?: {
    period: SummaryPeriod
    values: Array<{ value_name?: string; category?: string | null; rank?: number | null }>
  }
}

type WorkspaceView = "overview" | "clients" | "invitations" | "account"

function dateLabel(value: string | null | undefined) {
  if (!value) return "Not yet"
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? "Not yet" : new Intl.DateTimeFormat("en-NZ", { dateStyle: "medium", timeStyle: "short" }).format(d)
}

function dayLabel(value: string | null | undefined) {
  if (!value) return "No data"
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? "No data" : new Intl.DateTimeFormat("en-NZ", { dateStyle: "medium" }).format(d)
}

function scopeLabel(scope: ProfessionalShareScope) {
  return PROFESSIONAL_SHARE_SCOPES.find((item) => item.id === scope)?.label || scope
}

function periodLabel(period: SummaryPeriod | undefined) {
  if (!period) return ""
  if (period.basis === "rolling_days") return `Last ${period.days || 14} days`
  if (period.basis === "all_time") return "All recorded activity"
  if (period.basis === "current") return "Current selection"
  return ""
}

export default function ProfessionalDashboardClient({ professional }: { professional: Professional }) {
  const router = useRouter()
  const [clients, setClients] = useState<ClientLink[]>([])
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [selectedClient, setSelectedClient] = useState<ClientLink | null>(null)
  const [summary, setSummary] = useState<ProfessionalSummary | null>(null)
  const [activeView, setActiveView] = useState<WorkspaceView>("overview")
  const [windowDays, setWindowDays] = useState("14")
  const [inviteScopes, setInviteScopes] = useState<ProfessionalShareScope[]>(["journey_progress", "daily_checkins_summary"])
  const [inviteDays, setInviteDays] = useState("7")
  const [latestInviteUrl, setLatestInviteUrl] = useState("")
  const [loading, setLoading] = useState(true)
  const [summaryLoading, setSummaryLoading] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")

  const requestableDefinitions = useMemo(
    () => PROFESSIONAL_SHARE_SCOPES.filter((scope) => PROFESSIONAL_REQUESTABLE_SCOPES.includes(scope.id)),
    [],
  )
  const activeInvitations = invitations.filter((invite) => invite.status === "active")

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
    setSummaryLoading(true)
    setError("")
    setActiveView("clients")
    try {
      const response = await fetch(`/api/professional/clients/${client.link_id}/summary?days=${days}`, { cache: "no-store" })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Unable to load client summary")
      setSummary(data)
      await refresh()
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to load client summary")
    } finally {
      setSummaryLoading(false)
    }
  }

  async function signOut() {
    await fetch("/api/auth/signout", { method: "POST" })
    router.push("/auth/signin")
    router.refresh()
  }

  const navItems: Array<{ id: WorkspaceView; label: string; icon: typeof LayoutDashboard; count?: number }> = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "clients", label: "Connected clients", icon: UsersRound, count: clients.length },
    { id: "invitations", label: "Invitations", icon: Link2, count: activeInvitations.length },
    { id: "account", label: "Account & security", icon: Settings2 },
  ]

  return (
    <main className="min-h-screen bg-background px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1440px] space-y-5">
        <header className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Waypoint professional portal</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight">Professional workspace</h1>
            <p className="mt-2 text-muted-foreground">{professional.display_name}{professional.professional_role ? ` · ${professional.professional_role}` : ""}{professional.organisation_name ? ` · ${professional.organisation_name}` : ""}</p>
          </div>
          <div className="flex gap-2"><Button variant="outline" onClick={refresh} className="gap-2"><RefreshCw className="size-4" /> Refresh</Button><Button variant="ghost" onClick={signOut} className="gap-2"><LogOut className="size-4" /> Sign out</Button></div>
        </header>

        {error && <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">{error}</div>}

        <div className="flex gap-2 overflow-x-auto pb-1 lg:hidden">
          {navItems.map((item) => <NavButton key={item.id} item={item} active={activeView === item.id} compact onClick={() => setActiveView(item.id)} />)}
        </div>

        <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
          <aside className="hidden lg:block">
            <div className="sticky top-6 space-y-3">
              <nav className="space-y-1 rounded-xl border bg-card p-2">
                {navItems.map((item) => <NavButton key={item.id} item={item} active={activeView === item.id} onClick={() => setActiveView(item.id)} />)}
              </nav>
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm leading-6">
                <div className="flex items-start gap-2"><ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" /><div><p className="font-semibold">Review, not monitoring</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Only user-authorised categories are shown. Waypoint is not a clinical record or emergency monitoring system.</p></div></div>
              </div>
            </div>
          </aside>

          <section className="min-w-0">
            {activeView === "overview" && (
              <div className="space-y-6">
                <div><h2 className="text-2xl font-semibold">Overview</h2><p className="mt-1 text-sm text-muted-foreground">A lightweight view of your current Waypoint connections and access.</p></div>
                <div className="grid gap-4 md:grid-cols-3">
                  <MetricCard label="Connected clients" value={loading ? "…" : clients.length} icon={UsersRound} />
                  <MetricCard label="Active invitations" value={loading ? "…" : activeInvitations.length} icon={Link2} />
                  <MetricCard label="Client summaries" value="Consent scoped" icon={ShieldCheck} />
                </div>
                <Card>
                  <CardHeader><CardTitle>What this workspace is for</CardTitle><CardDescription>Use Waypoint as a user-authorised window into between-session activity, not as a replacement for your organisation's clinical record.</CardDescription></CardHeader>
                  <CardContent className="grid gap-4 md:grid-cols-2">
                    <button type="button" onClick={() => setActiveView("clients")} className="rounded-xl border p-5 text-left transition-colors hover:bg-muted/40"><UsersRound className="size-5 text-primary" /><p className="mt-3 font-semibold">Review connected clients</p><p className="mt-1 text-sm leading-6 text-muted-foreground">See only the categories each client has actively chosen to share.</p></button>
                    <button type="button" onClick={() => setActiveView("invitations")} className="rounded-xl border p-5 text-left transition-colors hover:bg-muted/40"><Link2 className="size-5 text-primary" /><p className="mt-3 font-semibold">Create a connection invitation</p><p className="mt-1 text-sm leading-6 text-muted-foreground">Request specific categories. The client can accept all, some, or none.</p></button>
                  </CardContent>
                </Card>
                <BoundaryCard />
              </div>
            )}

            {activeView === "clients" && (
              <div className="space-y-6">
                <div><h2 className="text-2xl font-semibold">Connected clients</h2><p className="mt-1 text-sm text-muted-foreground">Only active, client-approved professional relationships appear here.</p></div>
                <div className="grid gap-6 xl:grid-cols-[minmax(280px,0.75fr)_minmax(0,1.5fr)]">
                  <Card>
                    <CardContent className="space-y-3 p-4">
                      {loading ? <p className="p-2 text-sm text-muted-foreground">Loading...</p> : clients.length === 0 ? <p className="p-2 text-sm text-muted-foreground">No connected clients yet.</p> : clients.map((client) => (
                        <div key={client.link_id} className={`rounded-lg border p-4 ${selectedClient?.link_id === client.link_id ? "border-primary/40 bg-primary/5" : ""}`}>
                          <div className="flex items-start justify-between gap-3"><div><p className="font-semibold">{client.client_name || "Waypoint user"}</p><p className="mt-1 text-xs text-muted-foreground">Connected {dateLabel(client.accepted_at)}</p></div><Button size="sm" variant="outline" className="gap-1.5" onClick={() => viewClient(client)}><Eye className="size-3.5" /> Review</Button></div>
                          <div className="mt-3 flex flex-wrap gap-1.5">{client.shared_scopes.map((scope) => <Badge key={scope} variant="secondary">{scopeLabel(scope)}</Badge>)}</div>
                          <p className="mt-3 text-xs text-muted-foreground">Latest check-in: {client.latest_checkin_date ? dayLabel(client.latest_checkin_date) : "none shared yet"}</p>
                          <p className="mt-1 text-xs text-muted-foreground">Last portal review: {dateLabel(client.last_professional_access)}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <div className="min-w-0">
                    {!selectedClient ? <Card><CardContent className="p-8 text-center"><UserRoundCheck className="mx-auto size-8 text-muted-foreground" /><p className="mt-3 font-medium">Choose a connected client</p><p className="mt-1 text-sm text-muted-foreground">Their summary opens here without exposing information outside their active sharing permissions.</p></CardContent></Card> : (
                      <ClientSummaryCard
                        client={selectedClient}
                        summary={summary}
                        loading={summaryLoading}
                        windowDays={windowDays}
                        onWindowChange={(value) => { setWindowDays(value); viewClient(selectedClient, value) }}
                      />
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeView === "invitations" && (
              <div className="space-y-6">
                <div><h2 className="text-2xl font-semibold">Invitations</h2><p className="mt-1 text-sm text-muted-foreground">Create short-lived links and request only the categories relevant to the support relationship.</p></div>
                <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
                  <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2"><Link2 className="size-5 text-primary" /> Invite a client</CardTitle><CardDescription>The client sees your verified identity and can approve all, some, or none of the requested categories.</CardDescription></CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">{requestableDefinitions.map((scope) => <label key={scope.id} className="flex items-start gap-3 rounded-lg border p-3 text-sm"><Checkbox checked={inviteScopes.includes(scope.id)} onCheckedChange={(v) => toggleInviteScope(scope.id, v === true)} /><span><span className="block font-medium">{scope.label}</span><span className="block text-muted-foreground">{scope.description}</span></span></label>)}</div>
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-end"><div className="flex-1"><p className="mb-2 text-sm font-medium">Invitation expiry</p><Select value={inviteDays} onValueChange={setInviteDays}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="1">1 day</SelectItem><SelectItem value="3">3 days</SelectItem><SelectItem value="7">7 days</SelectItem><SelectItem value="14">14 days</SelectItem></SelectContent></Select></div><Button disabled={busy || inviteScopes.length === 0} onClick={createInvitation}>Create link</Button></div>
                      {latestInviteUrl && <div className="rounded-lg border bg-muted/30 p-3"><p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Shown once</p><p className="mt-1 break-all text-sm">{latestInviteUrl}</p><Button variant="outline" size="sm" className="mt-3 gap-2" onClick={() => navigator.clipboard.writeText(latestInviteUrl)}><Copy className="size-3.5" /> Copy invitation</Button><p className="mt-2 text-xs text-muted-foreground">Waypoint stores only a hash of this token, so the clear invitation cannot be recovered later.</p></div>}
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader><CardTitle>Recent invitations</CardTitle><CardDescription>Used, revoked and expired links remain visible as workflow history.</CardDescription></CardHeader>
                    <CardContent className="space-y-3">{invitations.length === 0 ? <p className="text-sm text-muted-foreground">No invitations created yet.</p> : invitations.slice(0, 12).map((invite) => <div key={invite.id} className="rounded-lg border p-3 text-sm"><div className="flex items-center justify-between gap-2"><Badge variant={invite.status === "active" ? "default" : "secondary"}>{invite.status}</Badge>{invite.status === "active" && <Button variant="ghost" size="sm" disabled={busy} onClick={() => revokeInvitation(invite.id)}>Revoke</Button>}</div><p className="mt-2 text-muted-foreground">Created {dateLabel(invite.created_at)}</p><p className="text-muted-foreground">Expires {dateLabel(invite.expires_at)}</p><div className="mt-2 flex flex-wrap gap-1">{invite.requested_scopes.map((scope) => <Badge key={scope} variant="outline">{scopeLabel(scope)}</Badge>)}</div></div>)}</CardContent>
                  </Card>
                </div>
              </div>
            )}

            {activeView === "account" && (
              <div className="space-y-6">
                <div><h2 className="text-2xl font-semibold">Account & security</h2><p className="mt-1 text-sm text-muted-foreground">Your verified professional identity, organisation context and security controls.</p></div>
                <div className="grid gap-4 md:grid-cols-2">
                  <Card><CardHeader><CardTitle>Professional identity</CardTitle></CardHeader><CardContent className="space-y-3 text-sm"><div><p className="text-muted-foreground">Name</p><p className="font-medium">{professional.display_name}</p></div><div><p className="text-muted-foreground">Role</p><p className="font-medium">{professional.professional_role || "Not specified"}</p></div><div><p className="text-muted-foreground">Organisation</p><p className="font-medium">{professional.organisation_name || "Not linked"}</p></div></CardContent></Card>
                  <Card><CardHeader><CardTitle>Security & governance</CardTitle></CardHeader><CardContent className="space-y-3"><Link href="/security/mfa"><Button variant="outline" className="w-full justify-start gap-2"><ShieldCheck className="size-4" /> Authenticator & recovery</Button></Link><Link href="/professional-use"><Button variant="outline" className="w-full justify-start gap-2"><BookOpenCheck className="size-4" /> Professional use notice</Button></Link><Link href="/privacy-policy"><Button variant="outline" className="w-full justify-start gap-2"><Clipboard className="size-4" /> Privacy policy</Button></Link></CardContent></Card>
                </div>
                <BoundaryCard />
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}

function NavButton({ item, active, compact = false, onClick }: { item: { label: string; icon: typeof LayoutDashboard; count?: number }; active: boolean; compact?: boolean; onClick: () => void }) {
  const Icon = item.icon
  return <button type="button" onClick={onClick} className={`${compact ? "shrink-0" : "w-full"} flex items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}><Icon className="size-4 shrink-0" /><span>{item.label}</span>{typeof item.count === "number" && <span className={`ml-auto rounded-full px-2 py-0.5 text-xs ${active ? "bg-primary-foreground/15" : "bg-muted"}`}>{item.count}</span>}</button>
}

function MetricCard({ label, value, icon: Icon }: { label: string; value: string | number; icon: typeof UsersRound }) {
  return <Card><CardContent className="flex items-center gap-4 p-5"><div className="rounded-xl bg-primary/10 p-3 text-primary"><Icon className="size-5" /></div><div><p className="text-sm text-muted-foreground">{label}</p><p className="text-2xl font-semibold">{value}</p></div></CardContent></Card>
}

function BoundaryCard() {
  return <Card className="border-primary/20"><CardHeader><CardTitle className="flex items-center gap-2"><ShieldCheck className="size-5 text-primary" /> Clinician summary boundary</CardTitle><CardDescription>The summary is deliberately narrower than the client's full Waypoint account.</CardDescription></CardHeader><CardContent className="grid gap-3 text-sm md:grid-cols-2"><BoundaryItem title="Included" text="Only categories the client actively authorised, presented as structured summary data." /><BoundaryItem title="Not included" text="Private free text, Journey answers, mental-health profile fields, community content, research data or client email." /><BoundaryItem title="No inferred risk" text="Waypoint does not calculate or display a clinical risk score from these summaries." /><BoundaryItem title="Not a clinical record" text="Information is for later review alongside normal assessment and your organisation's recordkeeping." /></CardContent></Card>
}

function BoundaryItem({ title, text }: { title: string; text: string }) {
  return <div className="rounded-lg border bg-muted/20 p-4"><p className="font-medium">{title}</p><p className="mt-1 leading-6 text-muted-foreground">{text}</p></div>
}

function ClientSummaryCard({ client, summary, loading, windowDays, onWindowChange }: { client: ClientLink; summary: ProfessionalSummary | null; loading: boolean; windowDays: string; onWindowChange: (value: string) => void }) {
  return <Card>
    <CardHeader>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><CardTitle>{client.client_name || "Waypoint user"}</CardTitle><CardDescription>Structured self-reported information shared by this user.</CardDescription></div><div className="w-full sm:w-44"><p className="mb-2 text-xs font-medium text-muted-foreground">Check-in window only</p><Select value={windowDays} onValueChange={onWindowChange}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="7">Last 7 days</SelectItem><SelectItem value="14">Last 14 days</SelectItem><SelectItem value="30">Last 30 days</SelectItem></SelectContent></Select></div></div>
    </CardHeader>
    <CardContent className="space-y-6">
      {loading ? <p className="text-sm text-muted-foreground">Loading authorised summary...</p> : !summary ? <p className="text-sm text-muted-foreground">Unable to display this summary.</p> : <>
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm"><p className="font-medium">User-authorised summary</p><p className="mt-1 leading-6 text-muted-foreground">{summary.monitoringNotice}</p><div className="mt-3 flex flex-wrap gap-1.5">{summary.sharedScopes.map((scope) => <Badge key={scope} variant="secondary">{scopeLabel(scope)}</Badge>)}</div></div>

        {summary.dailyCheckins && <SummarySection icon={CalendarDays} title="Daily check-ins" period={periodLabel(summary.dailyCheckins.period)}><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><Metric label="Check-ins" value={summary.dailyCheckins.summary.checkin_count ?? 0} /><Metric label="Average mood" value={summary.dailyCheckins.summary.average_mood ?? "No data"} /><Metric label="Average urge" value={summary.dailyCheckins.summary.average_urge ?? "No data"} /><Metric label="Gambling days" value={summary.dailyCheckins.summary.gambling_days ?? 0} /></div><p className="mt-3 text-xs text-muted-foreground">Missing days mean no check-in was recorded. They are not treated as symptom-free or gambling-free days.</p><div className="mt-3 space-y-2">{summary.dailyCheckins.trend.map((row, index) => <div key={`${row.date || "checkin"}-${index}`} className="grid gap-1 rounded-lg border px-3 py-2 text-xs sm:grid-cols-4"><span className="font-medium">{dayLabel(row.date)}</span><span>Mood {row.mood_rating ?? "-"}</span><span>Urge {row.urge_strength ?? "-"}</span><span>{row.gambling_occurred ? "Gambling reported" : "No gambling reported"}</span></div>)}</div></SummarySection>}

        {summary.journeyProgress && <SummarySection icon={BookOpenCheck} title="Journey progress" period={periodLabel(summary.journeyProgress.period)}><p className="text-sm text-muted-foreground">{summary.journeyProgress.completed_modules ?? 0} modules completed. This permission covers completion/progress only, not the client's exercise or quick-check answers.</p><div className="mt-3 space-y-2">{summary.journeyProgress.recentModules.map((module, index) => <div key={`${module.module_slug || "module"}-${index}`} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border p-3"><div><p className="text-sm font-medium">{module.module_name || module.module_slug || "Journey module"}</p><p className="mt-1 text-xs text-muted-foreground">Completed {dateLabel(module.completed_at)}</p></div>{module.content_version && <Badge variant="outline">v{module.content_version}</Badge>}</div>)}</div></SummarySection>}

        {summary.skillsPractice && <SummarySection icon={Wrench} title="Skills practice" period={periodLabel(summary.skillsPractice.period)}><div className="grid gap-3 sm:grid-cols-3"><Metric label="Practices recorded" value={summary.skillsPractice.practice_count ?? 0} /><Metric label="Marked helpful" value={summary.skillsPractice.helpful_count ?? 0} /><Metric label="Average effectiveness" value={summary.skillsPractice.average_effectiveness ?? "No data"} /></div><div className="mt-3 space-y-2">{summary.skillsPractice.recentSkills.map((skill, index) => <div key={`${skill.skill_name || "skill"}-${index}`} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border p-3"><div><p className="text-sm font-medium">{skill.skill_name || "Skill"}</p><p className="mt-1 text-xs text-muted-foreground">{skill.skill_category || "Practice"} · {dateLabel(skill.practiced_at)}</p></div><div className="flex gap-1.5">{skill.was_helpful === true && <Badge variant="secondary">Helpful</Badge>}{skill.content_version && <Badge variant="outline">v{skill.content_version}</Badge>}</div></div>)}</div></SummarySection>}

        {summary.coreValues && <SummarySection icon={UserRoundCheck} title="Core values" period={periodLabel(summary.coreValues.period)}><div className="flex flex-wrap gap-2">{summary.coreValues.values.length === 0 ? <p className="text-sm text-muted-foreground">No shared core values recorded.</p> : summary.coreValues.values.map((value, index) => <Badge key={`${value.value_name || "value"}-${index}`} variant="outline">{value.value_name || "Value"}</Badge>)}</div></SummarySection>}

        <div className="flex items-start gap-2 border-t pt-4 text-xs leading-5 text-muted-foreground"><Clipboard className="mt-0.5 size-3.5 shrink-0" /><span>Opening this summary is recorded in the user's access history. Summary schema: {summary.summarySchemaVersion}.</span></div>
      </>}
    </CardContent>
  </Card>
}

function SummarySection({ icon: Icon, title, period, children }: { icon: typeof CalendarDays; title: string; period: string; children: ReactNode }) {
  return <section className="border-t pt-5 first:border-t-0 first:pt-0"><div className="flex flex-wrap items-center justify-between gap-2"><h3 className="flex items-center gap-2 font-semibold"><Icon className="size-4 text-primary" /> {title}</h3>{period && <Badge variant="outline">{period}</Badge>}</div><div className="mt-3">{children}</div></section>
}

function Metric({ label, value }: { label: string; value: string | number | null | undefined }) {
  return <div className="rounded-lg border bg-card p-3"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 text-lg font-semibold">{value ?? "No data"}</p></div>
}
