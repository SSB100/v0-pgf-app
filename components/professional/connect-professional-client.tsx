"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { AlertTriangle, CheckCircle2, LockKeyhole, UserCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { PROFESSIONAL_SHARE_SCOPES, type ProfessionalShareScope } from "@/lib/sharing-policy"

type Preview = {
  professional: { name: string; role: string | null; organisation: string | null }
  requestedScopes: ProfessionalShareScope[]
  expiresAt: string
  monitoringNotice: string
}

export default function ConnectProfessionalClient({ token }: { token: string }) {
  const router = useRouter()
  const [preview, setPreview] = useState<Preview | null>(null)
  const [selected, setSelected] = useState<ProfessionalShareScope[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch(`/api/connect/professional?token=${encodeURIComponent(token)}`, { cache: "no-store" })
        const data = await response.json()
        if (!response.ok) throw new Error(data.error || "Unable to load invitation")
        setPreview(data)
        setSelected(data.requestedScopes)
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : "Unable to load invitation")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [token])

  const requestedDefinitions = useMemo(
    () => PROFESSIONAL_SHARE_SCOPES.filter((scope) => preview?.requestedScopes.includes(scope.id)),
    [preview],
  )

  function toggle(scope: ProfessionalShareScope, checked: boolean) {
    setSelected((current) => checked ? [...new Set([...current, scope])] : current.filter((value) => value !== scope))
  }

  async function respond(action: "accept" | "decline") {
    setSaving(true)
    setError("")
    try {
      const response = await fetch("/api/connect/professional", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, action, scopes: selected }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Unable to process invitation")
      router.push(action === "accept" ? "/privacy" : "/dashboard")
      router.refresh()
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to process invitation")
      setSaving(false)
    }
  }

  if (loading) return <div className="py-20 text-center text-muted-foreground">Checking invitation...</div>
  if (!preview) {
    return (
      <Card className="mx-auto max-w-xl">
        <CardHeader><CardTitle>Invitation unavailable</CardTitle><CardDescription>{error || "This professional invitation cannot be used."}</CardDescription></CardHeader>
        <CardContent><Button onClick={() => router.push("/dashboard")}>Return to dashboard</Button></CardContent>
      </Card>
    )
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Badge variant="outline" className="mb-3">Professional connection</Badge>
        <h1 className="text-3xl font-bold tracking-tight">Choose what you want to share</h1>
        <p className="mt-2 text-muted-foreground">A professional has invited you to connect. Nothing is shared unless you approve the connection and select at least one category.</p>
      </div>

      {error && <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">{error}</div>}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><UserCheck className="size-5 text-primary" /> {preview.professional.name}</CardTitle>
          <CardDescription>{[preview.professional.role, preview.professional.organisation].filter(Boolean).join(" · ")}</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">This invitation is available until {new Date(preview.expiresAt).toLocaleString("en-NZ")}.</CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><LockKeyhole className="size-5 text-primary" /> Requested information</CardTitle>
          <CardDescription>The professional requested these categories. You can grant all, some, or decline the connection.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {requestedDefinitions.map((scope) => (
            <label key={scope.id} className="flex cursor-pointer items-start gap-3 rounded-lg border p-4">
              <Checkbox checked={selected.includes(scope.id)} onCheckedChange={(value) => toggle(scope.id, value === true)} />
              <span>
                <span className="block font-medium text-foreground">{scope.label}</span>
                <span className="mt-1 block text-sm leading-5 text-muted-foreground">{scope.description}</span>
              </span>
            </label>
          ))}
          <div className="rounded-lg border border-amber-300/60 bg-amber-50 p-4 text-sm text-amber-950 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-100">
            <div className="flex gap-2"><AlertTriangle className="mt-0.5 size-4 shrink-0" /><p>{preview.monitoringNotice}</p></div>
          </div>
          <div className="rounded-lg border bg-muted/20 p-4 text-sm text-muted-foreground">
            Private free-text notes and reflections are not included in these summary categories. You can change sharing permissions later from Privacy &amp; Sharing.
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button variant="outline" disabled={saving} onClick={() => respond("decline")}>Decline invitation</Button>
        <Button disabled={saving || selected.length === 0} onClick={() => respond("accept")} className="gap-2"><CheckCircle2 className="size-4" /> {saving ? "Saving..." : "Accept and share selected"}</Button>
      </div>
    </div>
  )
}
