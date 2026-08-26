"use client"

import { useEffect, useMemo, useState } from "react"
import { AlertTriangle, CheckCircle2, Clock3, RefreshCw, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { PRIVACY_DELETION_CONFIRMATION } from "@/lib/privacy-request-policy.mjs"

type PrivacyRequest = {
  id: string
  user_id: string | null
  request_type: "correction" | "deletion" | "access" | "export"
  status: "requested" | "in_review" | "completed" | "declined" | "cancelled"
  requested_at: string
  completed_at: string | null
  resolution_note: string | null
  metadata: { note?: string } | null
  email: string | null
  full_name: string | null
  role: string | null
}

function formatDate(value: string | null) {
  if (!value) return "Not recorded"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "Not recorded"
  return new Intl.DateTimeFormat("en-NZ", { dateStyle: "medium", timeStyle: "short" }).format(date)
}

export default function PrivacyRequestClient() {
  const [requests, setRequests] = useState<PrivacyRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [notice, setNotice] = useState("")
  const [busy, setBusy] = useState<string | null>(null)
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [confirmations, setConfirmations] = useState<Record<string, string>>({})

  async function loadRequests() {
    setLoading(true)
    setError("")
    try {
      const response = await fetch("/api/admin/privacy-requests", { cache: "no-store" })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Unable to load privacy requests")
      setRequests(data.requests ?? [])
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to load privacy requests")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRequests()
  }, [])

  const openCount = useMemo(
    () => requests.filter((request) => request.status === "requested" || request.status === "in_review").length,
    [requests],
  )

  async function act(request: PrivacyRequest, action: "start_review" | "complete_correction" | "decline" | "complete_deletion") {
    setBusy(request.id)
    setError("")
    setNotice("")
    try {
      const response = await fetch("/api/admin/privacy-requests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId: request.id,
          action,
          resolutionNote: notes[request.id] ?? "",
          confirmation: confirmations[request.id] ?? "",
        }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Unable to update privacy request")
      setNotice(action === "complete_deletion" ? "Deletion completed and the client account was removed." : "Privacy request updated.")
      setNotes((current) => ({ ...current, [request.id]: "" }))
      setConfirmations((current) => ({ ...current, [request.id]: "" }))
      await loadRequests()
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to update privacy request")
    } finally {
      setBusy(null)
    }
  }

  if (loading && requests.length === 0) {
    return <div className="rounded-xl border bg-card p-8 text-center text-muted-foreground">Loading privacy requests…</div>
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-card p-4 shadow-sm">
        <div>
          <p className="font-semibold">{openCount} open privacy request{openCount === 1 ? "" : "s"}</p>
          <p className="text-sm text-muted-foreground">Deletion is limited to client accounts and requires explicit confirmation.</p>
        </div>
        <Button variant="outline" className="gap-2" onClick={loadRequests} disabled={loading}>
          <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} /> Refresh
        </Button>
      </div>

      {error && <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">{error}</div>}
      {notice && <div className="rounded-lg border border-primary/25 bg-primary/10 p-4 text-sm">{notice}</div>}

      {requests.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">No privacy requests have been submitted.</CardContent>
        </Card>
      ) : requests.map((request) => {
        const open = request.status === "requested" || request.status === "in_review"
        const note = notes[request.id] ?? ""
        const destructiveReady = note.trim().length >= 20 && confirmations[request.id] === PRIVACY_DELETION_CONFIRMATION
        return (
          <Card key={request.id}>
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <CardTitle className="flex items-center gap-2 capitalize">
                    {request.request_type === "deletion" ? <Trash2 className="size-5 text-destructive" /> : <Clock3 className="size-5 text-primary" />}
                    {request.request_type} request
                  </CardTitle>
                  <CardDescription className="mt-1">Submitted {formatDate(request.requested_at)}</CardDescription>
                </div>
                <span className="rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide">{request.status.replace("_", " ")}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 rounded-lg border bg-muted/20 p-4 text-sm sm:grid-cols-2">
                <div><p className="font-medium">Account</p><p className="mt-1 text-muted-foreground">{request.full_name || "Deleted account"}</p></div>
                <div><p className="font-medium">Email / role</p><p className="mt-1 text-muted-foreground">{request.email ? `${request.email} · ${request.role || "unknown"}` : "Account no longer present"}</p></div>
                {request.metadata?.note && <div className="sm:col-span-2"><p className="font-medium">User note</p><p className="mt-1 whitespace-pre-wrap text-muted-foreground">{request.metadata.note}</p></div>}
                {request.resolution_note && <div className="sm:col-span-2"><p className="font-medium">Resolution</p><p className="mt-1 whitespace-pre-wrap text-muted-foreground">{request.resolution_note}</p></div>}
              </div>

              {open && (
                <div className="space-y-3">
                  {request.status === "requested" && (
                    <Button variant="outline" onClick={() => act(request, "start_review")} disabled={busy === request.id}>Start review</Button>
                  )}

                  <Textarea
                    value={note}
                    onChange={(event) => setNotes((current) => ({ ...current, [request.id]: event.target.value }))}
                    placeholder="Resolution note. Record the identity/scope review and what was done (minimum 20 characters)."
                    rows={3}
                    maxLength={4000}
                  />

                  {request.request_type === "deletion" && (
                    <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                      <div className="flex gap-2 text-sm"><AlertTriangle className="mt-0.5 size-4 shrink-0 text-destructive" /><p>Permanent deletion removes the client account and cascading personal product data. Governed privacy/audit records remain without raw personal content.</p></div>
                      <p className="mt-3 text-xs font-medium">Type <span className="font-mono">{PRIVACY_DELETION_CONFIRMATION}</span> to confirm.</p>
                      <Input className="mt-2" value={confirmations[request.id] ?? ""} onChange={(event) => setConfirmations((current) => ({ ...current, [request.id]: event.target.value }))} />
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {request.request_type === "correction" && (
                      <Button onClick={() => act(request, "complete_correction")} disabled={busy === request.id || note.trim().length < 20}>
                        <CheckCircle2 className="mr-2 size-4" /> Complete correction
                      </Button>
                    )}
                    {request.request_type === "deletion" && (
                      <Button variant="destructive" onClick={() => act(request, "complete_deletion")} disabled={busy === request.id || !destructiveReady || request.role !== "client"}>
                        <Trash2 className="mr-2 size-4" /> Permanently delete client data
                      </Button>
                    )}
                    <Button variant="outline" onClick={() => act(request, "decline")} disabled={busy === request.id || note.trim().length < 20}>Decline request</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
