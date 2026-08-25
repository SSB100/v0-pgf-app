"use client"

import { useCallback, useEffect, useState } from "react"
import { AlertTriangle, CheckCircle2, Loader2, RefreshCw, ShieldAlert } from "lucide-react"

type Incident = {
  id: string
  title: string
  incident_type: string
  status: string
  severity: string
  summary: string
  detected_at: string
  affected_people_estimate: number | null
  personal_information_involved: boolean
  health_information_involved: boolean
  maori_data_involved: boolean
  serious_harm_assessment: string
  opc_notification_status: string
  affected_people_notification_status: string
  containment_summary: string | null
  notification_decision_reason: string | null
  updated_at: string
}

type IncidentDraft = {
  status: string
  severity: string
  seriousHarmAssessment: string
  opcNotificationStatus: string
  affectedPeopleNotificationStatus: string
  containmentSummary: string
  notificationDecisionReason: string
}

const inputClass = "w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
const buttonClass = "inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium shadow-sm transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"

function incidentDraft(incident: Incident): IncidentDraft {
  return {
    status: incident.status,
    severity: incident.severity,
    seriousHarmAssessment: incident.serious_harm_assessment,
    opcNotificationStatus: incident.opc_notification_status,
    affectedPeopleNotificationStatus: incident.affected_people_notification_status,
    containmentSummary: incident.containment_summary ?? "",
    notificationDecisionReason: incident.notification_decision_reason ?? "",
  }
}

export default function SecurityIncidentRegisterClient() {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    title: "",
    incidentType: "privacy",
    severity: "moderate",
    detectedAt: new Date().toISOString().slice(0, 16),
    affectedPeopleEstimate: "",
    summary: "",
    personalInformationInvolved: true,
    healthInformationInvolved: false,
    maoriDataInvolved: false,
  })

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/admin/security/incidents", { cache: "no-store" })
      const payload = await response.json()
      if (!response.ok) throw new Error(payload.error || "Unable to load incident register")
      setIncidents(payload.incidents ?? [])
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to load incident register")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { void load() }, [load])

  async function createIncident(event: React.FormEvent) {
    event.preventDefault()
    setBusy(true)
    setError(null)
    setMessage(null)
    try {
      const response = await fetch("/api/admin/security/incidents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          detectedAt: new Date(form.detectedAt).toISOString(),
          affectedPeopleEstimate: form.affectedPeopleEstimate === "" ? null : Number(form.affectedPeopleEstimate),
        }),
      })
      const payload = await response.json()
      if (!response.ok) throw new Error(payload.error || "Unable to create incident")
      setMessage("Incident opened and added to the audit trail.")
      setForm((current) => ({ ...current, title: "", summary: "", affectedPeopleEstimate: "" }))
      await load()
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to create incident")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-8">
      <section className="rounded-xl border bg-card p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <ShieldAlert className="mt-0.5 size-5 text-primary" />
          <div>
            <h2 className="text-lg font-semibold">Open an incident</h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">Record only what is needed to manage the incident. Do not paste breached records, client narratives, passwords, tokens or raw evidence into this register.</p>
          </div>
        </div>
        <form onSubmit={createIncident} className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="space-y-1 text-sm font-medium">Title<input className={inputClass} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} maxLength={180} required /></label>
          <label className="space-y-1 text-sm font-medium">Detected at<input className={inputClass} type="datetime-local" value={form.detectedAt} onChange={(e) => setForm({ ...form, detectedAt: e.target.value })} required /></label>
          <label className="space-y-1 text-sm font-medium">Type<select className={inputClass} value={form.incidentType} onChange={(e) => setForm({ ...form, incidentType: e.target.value })}><option value="privacy">Privacy</option><option value="security">Security</option><option value="availability">Availability</option><option value="integrity">Integrity</option><option value="supplier">Supplier</option><option value="other">Other</option></select></label>
          <label className="space-y-1 text-sm font-medium">Initial severity<select className={inputClass} value={form.severity} onChange={(e) => setForm({ ...form, severity: e.target.value })}><option value="low">Low</option><option value="moderate">Moderate</option><option value="high">High</option><option value="critical">Critical</option></select></label>
          <label className="space-y-1 text-sm font-medium">Estimated people affected<input className={inputClass} type="number" min="0" value={form.affectedPeopleEstimate} onChange={(e) => setForm({ ...form, affectedPeopleEstimate: e.target.value })} /></label>
          <div className="space-y-2 text-sm">
            <p className="font-medium">Information involved</p>
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.personalInformationInvolved} onChange={(e) => setForm({ ...form, personalInformationInvolved: e.target.checked })} /> Personal information</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.healthInformationInvolved} onChange={(e) => setForm({ ...form, healthInformationInvolved: e.target.checked })} /> Health/recovery information</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.maoriDataInvolved} onChange={(e) => setForm({ ...form, maoriDataInvolved: e.target.checked })} /> Māori data involved or potentially involved</label>
          </div>
          <label className="space-y-1 text-sm font-medium md:col-span-2">Summary<textarea className={`${inputClass} min-h-28`} value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} maxLength={4000} required /></label>
          <div className="md:col-span-2 flex flex-wrap items-center gap-3">
            <button className={`${buttonClass} border-primary bg-primary text-primary-foreground hover:bg-primary/90`} disabled={busy}>{busy ? <Loader2 className="size-4 animate-spin" /> : null} Open incident</button>
            <button type="button" className={buttonClass} onClick={() => void load()} disabled={loading}><RefreshCw className="size-4" /> Refresh</button>
          </div>
        </form>
        {message ? <p className="mt-4 flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-300"><CheckCircle2 className="size-4" /> {message}</p> : null}
        {error ? <p className="mt-4 flex items-center gap-2 text-sm text-destructive"><AlertTriangle className="size-4" /> {error}</p> : null}
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4"><div><h2 className="text-xl font-semibold">Incident register</h2><p className="mt-1 text-sm text-muted-foreground">Open incidents first. Closed incidents remain retained for audit and learning.</p></div></div>
        {loading ? <div className="rounded-xl border bg-card p-8 text-center text-sm text-muted-foreground"><Loader2 className="mx-auto mb-2 size-5 animate-spin" />Loading incidents</div> : null}
        {!loading && incidents.length === 0 ? <div className="rounded-xl border bg-card p-8 text-center text-sm text-muted-foreground">No incidents have been recorded.</div> : null}
        <div className="space-y-4">{incidents.map((incident) => <IncidentCard key={incident.id} incident={incident} onSaved={load} />)}</div>
      </section>
    </div>
  )
}

function IncidentCard({ incident, onSaved }: { incident: Incident; onSaved: () => Promise<void> }) {
  const [draft, setDraft] = useState<IncidentDraft>(() => incidentDraft(incident))
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => { setDraft(incidentDraft(incident)) }, [incident])

  async function save() {
    setBusy(true)
    setError(null)
    try {
      const response = await fetch("/api/admin/security/incidents", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ incidentId: incident.id, ...draft }),
      })
      const payload = await response.json()
      if (!response.ok) throw new Error(payload.error || "Unable to update incident")
      await onSaved()
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to update incident")
    } finally {
      setBusy(false)
    }
  }

  const escalation = draft.seriousHarmAssessment === "possible" || draft.seriousHarmAssessment === "likely" || draft.severity === "high" || draft.severity === "critical"

  return (
    <article className={`rounded-xl border bg-card p-5 shadow-sm ${escalation ? "border-amber-400/70" : ""}`}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div><div className="flex flex-wrap items-center gap-2"><h3 className="font-semibold">{incident.title}</h3><span className="rounded-full border px-2 py-0.5 text-xs">{incident.incident_type}</span><span className="rounded-full border px-2 py-0.5 text-xs">{incident.status}</span></div><p className="mt-2 max-w-4xl text-sm leading-6 text-muted-foreground">{incident.summary}</p><p className="mt-2 text-xs text-muted-foreground">Detected {new Date(incident.detected_at).toLocaleString()} · Updated {new Date(incident.updated_at).toLocaleString()}</p></div>
        {escalation ? <div className="flex items-center gap-2 rounded-lg bg-amber-500/10 px-3 py-2 text-xs font-medium text-amber-800 dark:text-amber-200"><AlertTriangle className="size-4" /> Escalation required</div> : null}
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <label className="space-y-1 text-sm font-medium">Status<select className={inputClass} value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value })}><option value="open">Open</option><option value="contained">Contained</option><option value="monitoring">Monitoring</option><option value="closed">Closed</option></select></label>
        <label className="space-y-1 text-sm font-medium">Severity<select className={inputClass} value={draft.severity} onChange={(e) => setDraft({ ...draft, severity: e.target.value })}><option value="low">Low</option><option value="moderate">Moderate</option><option value="high">High</option><option value="critical">Critical</option></select></label>
        <label className="space-y-1 text-sm font-medium">Serious-harm assessment<select className={inputClass} value={draft.seriousHarmAssessment} onChange={(e) => setDraft({ ...draft, seriousHarmAssessment: e.target.value })}><option value="not_assessed">Not assessed</option><option value="unlikely">Unlikely</option><option value="possible">Possible / unresolved</option><option value="likely">Likely</option></select></label>
        <label className="space-y-1 text-sm font-medium">Privacy Commissioner decision<select className={inputClass} value={draft.opcNotificationStatus} onChange={(e) => setDraft({ ...draft, opcNotificationStatus: e.target.value })}><option value="not_assessed">Not assessed</option><option value="not_required">Not required</option><option value="planned">Planned</option><option value="notified">Notified</option></select></label>
        <label className="space-y-1 text-sm font-medium">Affected-person notification<select className={inputClass} value={draft.affectedPeopleNotificationStatus} onChange={(e) => setDraft({ ...draft, affectedPeopleNotificationStatus: e.target.value })}><option value="not_assessed">Not assessed</option><option value="not_required">Not required</option><option value="planned">Planned</option><option value="notified">Notified</option><option value="exception_applied">Exception applied</option></select></label>
        <div className="rounded-lg border p-3 text-xs leading-5 text-muted-foreground"><p><strong className="text-foreground">Data flags:</strong> {incident.personal_information_involved ? "personal info" : "no personal info flagged"}{incident.health_information_involved ? ", health/recovery info" : ""}{incident.maori_data_involved ? ", Māori data" : ""}</p><p className="mt-1">Estimated affected: {incident.affected_people_estimate ?? "unknown"}</p></div>
        <label className="space-y-1 text-sm font-medium md:col-span-2 lg:col-span-3">Containment and remediation<textarea className={`${inputClass} min-h-24`} value={draft.containmentSummary} onChange={(e) => setDraft({ ...draft, containmentSummary: e.target.value })} maxLength={4000} /></label>
        <label className="space-y-1 text-sm font-medium md:col-span-2 lg:col-span-3">Notification decision rationale<textarea className={`${inputClass} min-h-24`} value={draft.notificationDecisionReason} onChange={(e) => setDraft({ ...draft, notificationDecisionReason: e.target.value })} maxLength={4000} placeholder="Record why notification is required, not required, delayed, or subject to an exception. Do not paste affected-person details." /></label>
      </div>
      <div className="mt-4 flex items-center gap-3"><button className={`${buttonClass} border-primary`} onClick={() => void save()} disabled={busy}>{busy ? <Loader2 className="size-4 animate-spin" /> : null} Save incident decision</button>{error ? <p className="text-sm text-destructive">{error}</p> : null}</div>
    </article>
  )
}
