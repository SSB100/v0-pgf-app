"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Database,
  Download,
  ExternalLink,
  FilePenLine,
  HeartHandshake,
  History,
  LockKeyhole,
  Microscope,
  Save,
  ShieldCheck,
  Trash2,
  UserCheck,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { PROFESSIONAL_SHARE_SCOPES, type ProfessionalShareScope } from "@/lib/sharing-policy"

type JourneyHistoryMode = "include_previous" | "new_only"

type SharingGrant = {
  scope: ProfessionalShareScope
  status: "active" | "revoked" | "expired"
  grantedAt: string | null
  expiresAt: string | null
  revokedAt: string | null
  consentVersion: string
  includePreGrantData: boolean | null
}

type ProfessionalConnection = {
  id: string
  status: "pending" | "active" | "paused" | "ended" | "expired"
  invited_by: "client" | "professional"
  invited_at: string | null
  accepted_at: string | null
  invitation_expires_at: string | null
  professional_name: string
  professional_role: string | null
  professional_verification_status: string
  organisation_name: string | null
  organisation_verification_status: string | null
  grants: SharingGrant[]
}

type AccessEvent = {
  id: string
  event_type: string
  resource_scope: string | null
  purpose: string | null
  occurred_at: string
  professional_name: string | null
  organisation_name: string | null
}

type Overview = {
  account: {
    createdAt: string | null
    exactDateOfBirthStored: boolean
    countryStored: boolean
    genderStored: boolean
    termsAccepted: boolean
    termsAcceptedAt: string | null
  }
  researchInterest: {
    interested: boolean
    changedAt: string | null
    formalResearchConsent: false
  }
  sharingInfrastructureReady: boolean
  journeyResponsesReady: boolean
  journeyResponseCount: number
  connections: ProfessionalConnection[]
  accessHistory: AccessEvent[]
  policyHistory: Array<{
    policy_type: string
    policy_version: string
    action: string
    occurred_at: string
  }>
}

function formatDate(value: string | null | undefined) {
  if (!value) return "Not recorded"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "Not recorded"
  return new Intl.DateTimeFormat("en-NZ", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date)
}

function eventLabel(eventType: string) {
  return eventType
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

export default function PrivacyCentreClient() {
  const router = useRouter()
  const [overview, setOverview] = useState<Overview | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [notice, setNotice] = useState("")
  const [researchSaving, setResearchSaving] = useState(false)
  const [sharingSaving, setSharingSaving] = useState<string | null>(null)
  const [sharingDrafts, setSharingDrafts] = useState<Record<string, ProfessionalShareScope[]>>({})
  const [journeyHistoryChoices, setJourneyHistoryChoices] = useState<Record<string, JourneyHistoryMode | undefined>>({})
  const [requestNote, setRequestNote] = useState("")
  const [requestSaving, setRequestSaving] = useState<"correction" | "deletion" | null>(null)

  async function loadOverview() {
    setLoading(true)
    setError("")
    try {
      const response = await fetch("/api/privacy/overview", { cache: "no-store" })
      if (response.status === 401) {
        router.push("/auth/signin")
        return
      }
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Unable to load privacy information")
      setOverview(data)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to load privacy information")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOverview()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!overview) return
    const drafts: Record<string, ProfessionalShareScope[]> = {}
    for (const connection of overview.connections) {
      drafts[connection.id] = connection.grants
        .filter((grant) => grant.status === "active")
        .map((grant) => grant.scope)
    }
    setSharingDrafts(drafts)
  }, [overview])

  const activeConnectionCount = useMemo(
    () => overview?.connections.filter((connection) => connection.status === "active").length ?? 0,
    [overview],
  )

  async function updateResearchInterest(interested: boolean) {
    if (!overview || researchSaving) return
    setResearchSaving(true)
    setNotice("")
    setError("")
    try {
      const response = await fetch("/api/privacy/research-interest", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interested }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Unable to update research preference")
      setOverview((current) => current ? { ...current, researchInterest: data } : current)
      setNotice(interested
        ? "Future research interest saved. This is not formal research consent."
        : "Future research interest withdrawn. Ordinary Waypoint access is unchanged.")
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to update research preference")
    } finally {
      setResearchSaving(false)
    }
  }

  function toggleScope(connectionId: string, scope: ProfessionalShareScope, enabled: boolean) {
    setSharingDrafts((current) => {
      const existing = current[connectionId] ?? []
      const next = enabled
        ? [...new Set([...existing, scope])]
        : existing.filter((item) => item !== scope)
      return { ...current, [connectionId]: next }
    })
    if (scope === "journey_responses" && !enabled) {
      setJourneyHistoryChoices((current) => ({ ...current, [connectionId]: undefined }))
    }
  }

  async function saveSharing(connectionId: string) {
    if (!overview) return
    const connection = overview.connections.find((item) => item.id === connectionId)
    if (!connection) return
    const scopes = sharingDrafts[connectionId] ?? []
    const hasActiveJourneyGrant = connection.grants.some((grant) => grant.scope === "journey_responses" && grant.status === "active")
    const addingJourneyResponses = scopes.includes("journey_responses") && !hasActiveJourneyGrant
    const journeyResponsesHistoryMode = journeyHistoryChoices[connectionId]

    if (addingJourneyResponses && !journeyResponsesHistoryMode) {
      setError("Choose whether this professional can see previous Journey responses or only new responses.")
      return
    }

    setSharingSaving(connectionId)
    setNotice("")
    setError("")
    try {
      const response = await fetch("/api/privacy/sharing-grants", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          linkId: connectionId,
          scopes,
          journeyResponsesHistoryMode: addingJourneyResponses ? journeyResponsesHistoryMode : undefined,
        }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Unable to update sharing permissions")
      setJourneyHistoryChoices((current) => ({ ...current, [connectionId]: undefined }))
      setNotice("Sharing permissions updated and recorded in your consent history.")
      await loadOverview()
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to update sharing permissions")
    } finally {
      setSharingSaving(null)
    }
  }

  async function submitPrivacyRequest(requestType: "correction" | "deletion") {
    setRequestSaving(requestType)
    setNotice("")
    setError("")
    try {
      const response = await fetch("/api/privacy/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestType, note: requestNote }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Unable to submit privacy request")
      setRequestNote("")
      setNotice(
        requestType === "deletion"
          ? "Deletion request recorded. This does not immediately erase data; the request must be reviewed against the applicable retention and governance rules."
          : "Correction request recorded for review.",
      )
      await loadOverview()
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to submit privacy request")
    } finally {
      setRequestSaving(null)
    }
  }

  if (loading && !overview) {
    return <div className="flex min-h-[60vh] items-center justify-center text-muted-foreground">Loading privacy controls…</div>
  }

  if (!overview) {
    return (
      <div className="mx-auto max-w-xl py-20 text-center">
        <h1 className="text-2xl font-semibold">Privacy controls could not be loaded</h1>
        <p className="mt-2 text-muted-foreground">{error || "Please try again."}</p>
        <Button className="mt-5" onClick={loadOverview}>Try again</Button>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background px-4 py-6 pb-20 sm:px-6 lg:px-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button variant="ghost" className="w-fit gap-2 px-2 text-muted-foreground" onClick={() => router.push("/settings")}>
            <ArrowLeft className="size-4" /> Back to settings
          </Button>
          <Link href="/privacy-policy" target="_blank" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
            Read Privacy Policy <ExternalLink className="size-3.5" />
          </Link>
        </div>

        <header className="border-b border-border/70 pb-6">
          <div className="mb-3 flex items-center gap-3 text-primary">
            <div className="flex size-11 items-center justify-center rounded-xl border border-primary/25 bg-primary/10">
              <ShieldCheck className="size-5" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em]">Privacy &amp; Sharing</p>
          </div>
          <h1 className="max-w-3xl text-pretty text-3xl font-bold tracking-tight sm:text-4xl">Your information should stay under your control.</h1>
          <p className="mt-3 max-w-3xl leading-6 text-muted-foreground">
            See what Waypoint currently holds, manage future research interest, control any professional connection, review access history and request a copy, correction or deletion of your information.
          </p>
        </header>

        {error && <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">{error}</div>}
        {notice && <div className="rounded-lg border border-primary/25 bg-primary/10 p-4 text-sm text-foreground">{notice}</div>}

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base"><LockKeyhole className="size-4 text-primary" /> Private by default</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-5 text-muted-foreground">Your personal Waypoint data is not automatically opened to a professional just because they use Waypoint.</CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base"><UserCheck className="size-4 text-primary" /> {activeConnectionCount} active professional connection{activeConnectionCount === 1 ? "" : "s"}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-5 text-muted-foreground">Each professional receives only the categories you explicitly grant to that connection.</CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base"><Microscope className="size-4 text-primary" /> Research is separate</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-5 text-muted-foreground">Your future research preference is not enrolment and is not permission for a formal study.</CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Database className="size-5 text-primary" /> What Waypoint currently holds</CardTitle>
              <CardDescription>High-level account information and data-minimisation status.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border p-3"><p className="font-medium">Account created</p><p className="mt-1 text-muted-foreground">{formatDate(overview.account.createdAt)}</p></div>
                <div className="rounded-lg border p-3"><p className="font-medium">Terms accepted</p><p className="mt-1 text-muted-foreground">{overview.account.termsAccepted ? formatDate(overview.account.termsAcceptedAt) : "Not recorded"}</p></div>
                <div className="rounded-lg border p-3"><p className="font-medium">Country</p><p className="mt-1 text-muted-foreground">{overview.account.countryStored ? "Stored" : "Not stored"}</p></div>
                <div className="rounded-lg border p-3"><p className="font-medium">Gender</p><p className="mt-1 text-muted-foreground">{overview.account.genderStored ? "Stored" : "Not stored"}</p></div>
              </div>
              {overview.account.exactDateOfBirthStored && (
                <div className="rounded-lg border border-amber-300/60 bg-amber-50 p-4 text-amber-950 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-100">
                  <p className="font-medium">Data-minimisation review</p>
                  <p className="mt-1 leading-5">The current MVP still stores your exact date of birth after checking the 18+ requirement. Waypoint is reviewing whether the final product can retain only an age-verification result or age band instead.</p>
                </div>
              )}
              <p className="leading-5 text-muted-foreground">Your recovery data can include onboarding answers, Daily Reflections, saved Journey responses and progress, skills, values, safeguards and community activity you choose to create. The data register is being refined before formal pilot use.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Microscope className="size-5 text-primary" /> Future research interest</CardTitle>
              <CardDescription>Optional and changeable. This does not enrol you in a research study.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start justify-between gap-5 rounded-lg border p-4">
                <div>
                  <Label htmlFor="research-interest" className="font-semibold">I am interested in being considered for future Waypoint research</Label>
                  <p className="mt-1 text-sm leading-5 text-muted-foreground">Any actual study would need a separate approved information and consent process before research use.</p>
                </div>
                <Switch
                  id="research-interest"
                  checked={overview.researchInterest.interested}
                  disabled={researchSaving}
                  onCheckedChange={updateResearchInterest}
                  aria-label="Future research interest"
                />
              </div>
              <p className="text-xs text-muted-foreground">Last preference change: {formatDate(overview.researchInterest.changedAt)}</p>
            </CardContent>
          </Card>
        </div>

        <Card id="professional-sharing" className="scroll-mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><HeartHandshake className="size-5 text-primary" /> Connected professionals &amp; sharing permissions</CardTitle>
            <CardDescription>Professional access must come from a verified relationship and an explicit sharing grant. Waypoint is not a live monitoring service.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {!overview.sharingInfrastructureReady && (
              <div className="rounded-lg border border-amber-300/60 bg-amber-50 p-4 text-sm leading-5 text-amber-950 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-100">
                Professional sharing is not active on this environment yet. No professional can gain access through the current prototype sharing flow.
              </div>
            )}

            {overview.sharingInfrastructureReady && overview.connections.length === 0 && (
              <div className="rounded-lg border border-dashed p-6 text-center">
                <UserCheck className="mx-auto size-7 text-muted-foreground" />
                <p className="mt-3 font-medium">No professional connections</p>
                <p className="mt-1 text-sm text-muted-foreground">When secure invitations are introduced, every connection will appear here before any information is shared.</p>
              </div>
            )}

            {overview.connections.map((connection) => {
              const canEdit = connection.status === "active" && connection.professional_verification_status === "verified"
              const selected = sharingDrafts[connection.id] ?? []
              const activeJourneyGrant = connection.grants.find((grant) => grant.scope === "journey_responses" && grant.status === "active")
              const addingJourneyResponses = selected.includes("journey_responses") && !activeJourneyGrant
              const journeyHistoryChoice = journeyHistoryChoices[connection.id]

              return (
                <div key={connection.id} className="rounded-xl border p-4 sm:p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3 border-b pb-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold">{connection.professional_name}</h3>
                        <Badge variant={connection.professional_verification_status === "verified" ? "default" : "secondary"}>{connection.professional_verification_status}</Badge>
                        <Badge variant="outline">{connection.status}</Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{connection.professional_role || "Professional role not recorded"}{connection.organisation_name ? ` · ${connection.organisation_name}` : ""}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">Connected {formatDate(connection.accepted_at)}</p>
                  </div>

                  <div className="divide-y">
                    {PROFESSIONAL_SHARE_SCOPES.map((scope) => (
                      <div key={scope.id} className="flex items-start justify-between gap-5 py-4">
                        <div>
                          <Label htmlFor={`${connection.id}-${scope.id}`} className="font-semibold">{scope.label}</Label>
                          <p className="mt-1 max-w-3xl text-sm leading-5 text-muted-foreground">{scope.description}</p>
                          {scope.sensitivity === "high" && <p className="mt-1 text-xs font-medium text-amber-700 dark:text-amber-300">High-sensitivity category</p>}
                          {scope.id === "journey_responses" && activeJourneyGrant && (
                            <p className="mt-2 text-xs leading-5 text-muted-foreground">
                              Current permission: {activeJourneyGrant.includePreGrantData === true ? "previous + future responses" : "new responses only"}. Granted {formatDate(activeJourneyGrant.grantedAt)}.
                            </p>
                          )}
                          {scope.id === "journey_responses" && !overview.journeyResponsesReady && (
                            <p className="mt-2 text-xs text-amber-700 dark:text-amber-300">Journey response storage is not active on this environment yet.</p>
                          )}
                        </div>
                        <Switch
                          id={`${connection.id}-${scope.id}`}
                          checked={selected.includes(scope.id)}
                          disabled={!canEdit || (scope.id === "journey_responses" && !overview.journeyResponsesReady)}
                          onCheckedChange={(checked) => toggleScope(connection.id, scope.id, checked)}
                          aria-label={`Share ${scope.label} with ${connection.professional_name}`}
                        />
                      </div>
                    ))}
                  </div>

                  {addingJourneyResponses && (
                    <div className="mb-4 rounded-xl border border-amber-300/60 bg-amber-50/70 p-4 dark:border-amber-800 dark:bg-amber-950/20">
                      <p className="font-semibold">Choose which Journey responses {connection.professional_name} can see</p>
                      <p className="mt-1 text-sm leading-5 text-muted-foreground">This choice is required before the separate Journey responses permission is granted. You currently have {overview.journeyResponseCount} saved response{overview.journeyResponseCount === 1 ? "" : "s"}.</p>
                      <RadioGroup
                        value={journeyHistoryChoice || ""}
                        onValueChange={(value) => setJourneyHistoryChoices((current) => ({ ...current, [connection.id]: value as JourneyHistoryMode }))}
                        className="mt-4 space-y-3"
                      >
                        <label className="flex cursor-pointer items-start gap-3 rounded-lg border bg-background p-3">
                          <RadioGroupItem value="include_previous" id={`${connection.id}-journey-history`} className="mt-0.5" />
                          <span>
                            <Label htmlFor={`${connection.id}-journey-history`} className="cursor-pointer font-semibold">Share previous + future responses</Label>
                            <span className="mt-1 block text-xs leading-5 text-muted-foreground">Your {overview.journeyResponseCount} existing saved response{overview.journeyResponseCount === 1 ? "" : "s"}, plus responses completed later, can be reviewed by this professional.</span>
                          </span>
                        </label>
                        <label className="flex cursor-pointer items-start gap-3 rounded-lg border bg-background p-3">
                          <RadioGroupItem value="new_only" id={`${connection.id}-journey-new-only`} className="mt-0.5" />
                          <span>
                            <Label htmlFor={`${connection.id}-journey-new-only`} className="cursor-pointer font-semibold">Share new responses only</Label>
                            <span className="mt-1 block text-xs leading-5 text-muted-foreground">Existing saved responses stay private from this professional. Only responses completed after you save this permission can be reviewed.</span>
                          </span>
                        </label>
                      </RadioGroup>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-4">
                    <p className="text-xs leading-5 text-muted-foreground">Private Daily Reflection notes remain excluded. Completed Journey exercise and quick-check responses are available only through the separate Journey responses permission shown above.</p>
                    <Button
                      onClick={() => saveSharing(connection.id)}
                      disabled={!canEdit || sharingSaving === connection.id || (addingJourneyResponses && !journeyHistoryChoice)}
                      className="gap-2"
                    >
                      <Save className="size-4" /> {sharingSaving === connection.id ? "Saving…" : "Save permissions"}
                    </Button>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><History className="size-5 text-primary" /> Access history</CardTitle>
              <CardDescription>Recent governed access/export events associated with your information.</CardDescription>
            </CardHeader>
            <CardContent>
              {overview.accessHistory.length === 0 ? (
                <div className="rounded-lg border border-dashed p-5 text-sm text-muted-foreground">No governed professional access events are currently recorded.</div>
              ) : (
                <div className="divide-y">
                  {overview.accessHistory.map((event) => (
                    <div key={event.id} className="py-3 first:pt-0 last:pb-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-medium">{eventLabel(event.event_type)}</p>
                          <p className="mt-0.5 text-xs text-muted-foreground">{event.professional_name || "You / Waypoint account action"}{event.organisation_name ? ` · ${event.organisation_name}` : ""}</p>
                          {event.resource_scope && <p className="mt-1 text-xs text-muted-foreground">Category: {eventLabel(event.resource_scope)}</p>}
                        </div>
                        <p className="shrink-0 text-xs text-muted-foreground">{formatDate(event.occurred_at)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Database className="size-5 text-primary" /> Access, correction &amp; deletion</CardTitle>
              <CardDescription>Download your current data or create a recorded request for information that needs correction or deletion.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild variant="outline" className="w-full justify-center gap-2">
                <a href="/api/privacy/export"><Download className="size-4" /> Download my Waypoint data (JSON)</a>
              </Button>

              <div className="space-y-2">
                <Label htmlFor="privacy-request-note">Optional details for a correction or deletion request</Label>
                <Textarea
                  id="privacy-request-note"
                  value={requestNote}
                  onChange={(event) => setRequestNote(event.target.value)}
                  maxLength={2000}
                  placeholder="For example: which information is inaccurate, or what you want removed."
                  className="min-h-24"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <Button variant="outline" onClick={() => submitPrivacyRequest("correction")} disabled={requestSaving !== null || !overview.sharingInfrastructureReady} className="gap-2">
                  <FilePenLine className="size-4" /> {requestSaving === "correction" ? "Submitting…" : "Request correction"}
                </Button>
                <Button variant="outline" onClick={() => submitPrivacyRequest("deletion")} disabled={requestSaving !== null || !overview.sharingInfrastructureReady} className="gap-2 text-destructive hover:text-destructive">
                  <Trash2 className="size-4" /> {requestSaving === "deletion" ? "Submitting…" : "Request deletion"}
                </Button>
              </div>

              <p className="text-xs leading-5 text-muted-foreground">A deletion request is not an instant-delete button. Before pilot use, Waypoint must finalise retention, legal/research exceptions and a responsible review process so deletion can be completed safely and transparently.</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-primary/20 bg-primary/[0.03]">
          <CardHeader>
            <CardTitle>Māori data governance</CardTitle>
            <CardDescription>Privacy controls are necessary, but they are not the whole Māori data-sovereignty model.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
            <p>Waypoint is documenting data location, access, provenance, secondary use and dissemination, but it is not claiming that the current MVP has completed a Māori data-sovereignty framework.</p>
            <p>The intended next step is genuine co-design and governance with appropriate Māori leadership so decisions about Māori data are not made only by the software team.</p>
            <Link href="/privacy-policy#" className="inline-flex items-center gap-1 font-medium text-primary hover:underline">Read the current privacy position <ExternalLink className="size-3.5" /></Link>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
