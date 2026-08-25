import Link from "next/link"
import { redirect } from "next/navigation"
import { ArrowLeft, BookOpenCheck, ExternalLink } from "lucide-react"
import { getAdminSession } from "@/lib/admin-access"
import {
  CLINICAL_CONTENT_REGISTRY,
  CONTENT_REGISTRY_REVISION,
  EVIDENCE_SOURCES,
} from "@/lib/clinical-content-registry"

export default async function AdminContentRegistryPage() {
  const admin = await getAdminSession()
  if (!admin.user) redirect("/auth/signin?from=/admin/content-registry")
  if (admin.user.role !== "admin") redirect(admin.user.role === "professional" ? "/professional" : "/dashboard")
  if (!admin.authorised) redirect("/security/mfa")

  const journey = CLINICAL_CONTENT_REGISTRY.filter((record) => record.kind === "journey_module")
  const skills = CLINICAL_CONTENT_REGISTRY.filter((record) => record.kind === "skill")
  const evidenceSources = Object.values(EVIDENCE_SOURCES)

  return (
    <main className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="border-b pb-6">
          <Link href="/admin/professionals" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-4" /> Back to professional verification
          </Link>
          <div className="mt-5 flex items-center gap-2 text-primary">
            <BookOpenCheck className="size-5" />
            <p className="text-xs font-semibold uppercase tracking-[0.18em]">Waypoint content governance</p>
          </div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Clinical content & evidence register</h1>
          <p className="mt-2 max-w-4xl leading-6 text-muted-foreground">
            A versioned provenance register for the Journey and Skills content. Evidence for the source methods does not mean Waypoint itself has been clinically validated.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            <span className="rounded-full border px-3 py-1">Registry {CONTENT_REGISTRY_REVISION}</span>
            <span className="rounded-full border px-3 py-1">{journey.length} Journey modules</span>
            <span className="rounded-full border px-3 py-1">{skills.length} Skills</span>
            <span className="rounded-full border px-3 py-1">External clinical review pending</span>
          </div>
        </header>

        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Evidence & provenance sources</h2>
            <p className="mt-1 text-sm text-muted-foreground">Guidelines, method sources and internal provenance used to explain where the content comes from.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {evidenceSources.map((source) => {
              const sourceUrl = "url" in source ? source.url : null
              const sourcePath = "sourcePath" in source ? source.sourcePath : null
              return (
                <article key={source.id} className="rounded-xl border bg-card p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-primary">{source.sourceType.replaceAll("_", " ")}</p>
                      <h3 className="mt-1 font-semibold">{source.title}</h3>
                    </div>
                    {sourceUrl ? (
                      <a href={sourceUrl} target="_blank" rel="noreferrer" aria-label={`Open source for ${source.title}`} className="text-muted-foreground hover:text-foreground">
                        <ExternalLink className="size-4" />
                      </a>
                    ) : null}
                  </div>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{source.citation}</p>
                  {sourcePath ? <p className="mt-2 font-mono text-xs text-muted-foreground">{sourcePath}</p> : null}
                  <p className="mt-3 text-sm leading-6">{source.note}</p>
                </article>
              )
            })}
          </div>
        </section>

        <ContentTable title="Journey modules" records={journey} />
        <ContentTable title="Skills" records={skills} />
      </div>
    </main>
  )
}

function ContentTable({ title, records }: { title: string; records: typeof CLINICAL_CONTENT_REGISTRY }) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">Current governed content metadata. Client responses are not shown in this register.</p>
      </div>
      <div className="overflow-x-auto rounded-xl border bg-card">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="border-b bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Content</th>
              <th className="px-4 py-3">Version</th>
              <th className="px-4 py-3">Approaches</th>
              <th className="px-4 py-3">Evidence IDs</th>
              <th className="px-4 py-3">Review</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {records.map((record) => (
              <tr key={record.contentId} className="align-top">
                <td className="px-4 py-4">
                  <p className="font-medium">{record.title}</p>
                  <p className="mt-1 font-mono text-xs text-muted-foreground">{record.contentId}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{record.category}</p>
                </td>
                <td className="px-4 py-4 font-mono text-xs">{record.version}</td>
                <td className="px-4 py-4 text-muted-foreground">{record.approaches.join(", ")}</td>
                <td className="px-4 py-4 text-xs text-muted-foreground">{record.evidenceIds.join(", ")}</td>
                <td className="px-4 py-4">
                  <p className="text-xs">{record.reviewStatus.replaceAll("_", " ")}</p>
                  <p className="mt-1 text-xs font-medium text-amber-700 dark:text-amber-300">Not clinically validated</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
