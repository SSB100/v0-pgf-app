"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, PauseCircle, PlayCircle, ShieldOff, UserCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PROFESSIONAL_SHARE_SCOPES } from "@/lib/sharing-policy"

type Connection = {
  id: string
  status: "pending" | "active" | "paused" | "ended" | "expired"
  accepted_at: string | null
  professional_name: string
  professional_role: string | null
  organisation_name: string | null
  professional_verification_status: string
  organisation_verification_status: string | null
  grants: Array<{ scope: string; status: string }>
}

export default function ProfessionalConnectionsClient() {
  const router = useRouter()
  const [connections, setConnections] = useState<Connection[]>([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [notice, setNotice] = useState("")

  async function load() {
    setLoading(true)
    try {
      const response = await fetch("/api/privacy/overview", { cache: "no-store" })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Unable to load professional connections")
      setConnections(data.connections || [])
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to load professional connections")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function updateConnection(connection: Connection, action: "pause" | "resume" | "end") {
    if (action === "end" && !window.confirm(`End your Waypoint connection with ${connection.professional_name}? Their access will stop and active sharing permissions will be revoked.`)) return
    setBusy(connection.id)
    setError("")
    setNotice("")
    try {
      const response = await fetch("/api/privacy/professional-connection", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ linkId: connection.id, action }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Unable to update connection")
      setNotice(action === "pause" ? "Professional access paused." : action === "resume" ? "Professional access resumed." : "Professional connection ended and active sharing permissions revoked.")
      await load()
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to update connection")
    } finally {
      setBusy(null)
    }
  }

  return (
    <main className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-4xl space-y-6">
        <Button variant="ghost" className="gap-2 px-2 text-muted-foreground" onClick={() => router.push("/privacy")}><ArrowLeft className="size-4" /> Back to Privacy &amp; Sharing</Button>
        <header>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Professional connections</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Control who stays connected</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">Pause access without losing your selected categories, resume a verified connection later, or end it completely. Ending a connection revokes its active sharing permissions.</p>
        </header>

        {error && <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">{error}</div>}
        {notice && <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm">{notice}</div>}

        {loading ? <p className="text-muted-foreground">Loading...</p> : connections.length === 0 ? <Card><CardContent className="py-10 text-center text-muted-foreground">You do not currently have a professional Waypoint connection.</CardContent></Card> : connections.map((connection) => {
          const activeScopes = connection.grants.filter((grant) => grant.status === "active").map((grant) => grant.scope)
          return (
            <Card key={connection.id}>
              <CardHeader>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div><CardTitle className="flex items-center gap-2"><UserCheck className="size-5 text-primary" /> {connection.professional_name}</CardTitle><CardDescription>{[connection.professional_role, connection.organisation_name].filter(Boolean).join(" · ")}</CardDescription></div>
                  <Badge variant={connection.status === "active" ? "default" : "secondary"}>{connection.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div><p className="text-sm font-medium">Currently authorised categories</p><div className="mt-2 flex flex-wrap gap-2">{activeScopes.length === 0 ? <span className="text-sm text-muted-foreground">No active categories</span> : activeScopes.map((scope) => <Badge key={scope} variant="outline">{PROFESSIONAL_SHARE_SCOPES.find((item) => item.id === scope)?.label || scope}</Badge>)}</div></div>
                <p className="text-sm text-muted-foreground">Change the individual categories from the main Privacy &amp; Sharing page. These connection controls determine whether the professional can access any authorised category at all.</p>
                <div className="flex flex-wrap gap-2">
                  {connection.status === "active" && <Button variant="outline" disabled={busy === connection.id} onClick={() => updateConnection(connection, "pause")} className="gap-2"><PauseCircle className="size-4" /> Pause access</Button>}
                  {connection.status === "paused" && <Button variant="outline" disabled={busy === connection.id} onClick={() => updateConnection(connection, "resume")} className="gap-2"><PlayCircle className="size-4" /> Resume access</Button>}
                  {(connection.status === "active" || connection.status === "paused") && <Button variant="destructive" disabled={busy === connection.id} onClick={() => updateConnection(connection, "end")} className="gap-2"><ShieldOff className="size-4" /> End connection</Button>}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </main>
  )
}
