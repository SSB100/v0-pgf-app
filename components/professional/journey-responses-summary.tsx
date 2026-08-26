import { BookOpenCheck } from "lucide-react"
import { Badge } from "@/components/ui/badge"

type CanonicalQuickCheck = {
  prompt?: string
  selectedOptionLabel?: string
}

type CanonicalAnswer = {
  prompt?: string
  value?: string
}

type CanonicalSelection = {
  label?: string
}

type CanonicalAssignment = {
  itemLabel?: string
  groupLabel?: string
}

type CanonicalSequenceItem = {
  label?: string
}

type CanonicalFollowUp = {
  prompt?: string
  value?: string
}

type CanonicalExercise = {
  title?: string
  kind?: string
  answers?: CanonicalAnswer[]
  selected?: CanonicalSelection[]
  assignments?: CanonicalAssignment[]
  sequence?: CanonicalSequenceItem[]
  followUp?: CanonicalFollowUp | null
}

type JourneyResponseData = {
  quickCheck?: CanonicalQuickCheck
  exercise?: CanonicalExercise
}

type JourneyResponseRow = {
  module_slug?: string
  module_name?: string
  content_version?: string | null
  response_schema_version?: string | null
  response_data?: JourneyResponseData
  last_completed_at?: string | null
}

export type JourneyResponsesSummary = {
  status: "shared"
  historyMode: "include_previous" | "new_only"
  grantedAt: string | null
  responses: JourneyResponseRow[]
}

function dateLabel(value: string | null | undefined) {
  if (!value) return "Date not recorded"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "Date not recorded"
  return new Intl.DateTimeFormat("en-NZ", { dateStyle: "medium", timeStyle: "short" }).format(date)
}

function TextResponse({ prompt, value }: { prompt?: string; value?: string }) {
  if (!value) return null
  return (
    <div className="rounded-lg border bg-background p-3">
      {prompt && <p className="text-xs font-medium text-muted-foreground">{prompt}</p>}
      <p className="mt-1 whitespace-pre-wrap text-sm leading-6">{value}</p>
    </div>
  )
}

function ExerciseResponse({ exercise }: { exercise?: CanonicalExercise }) {
  if (!exercise) return null
  return (
    <div className="space-y-3">
      {exercise.title && <p className="text-sm font-semibold">{exercise.title}</p>}

      {Array.isArray(exercise.answers) && exercise.answers.length > 0 && (
        <div className="space-y-2">
          {exercise.answers.map((answer, index) => <TextResponse key={`${answer.prompt || "answer"}-${index}`} prompt={answer.prompt} value={answer.value} />)}
        </div>
      )}

      {Array.isArray(exercise.selected) && exercise.selected.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-medium text-muted-foreground">Selected response{exercise.selected.length === 1 ? "" : "s"}</p>
          <div className="flex flex-wrap gap-2">
            {exercise.selected.map((selection, index) => <Badge key={`${selection.label || "selection"}-${index}`} variant="outline">{selection.label || "Selected option"}</Badge>)}
          </div>
        </div>
      )}

      {Array.isArray(exercise.assignments) && exercise.assignments.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Sorting response</p>
          {exercise.assignments.map((assignment, index) => (
            <div key={`${assignment.itemLabel || "assignment"}-${index}`} className="grid gap-1 rounded-lg border bg-background p-3 text-sm sm:grid-cols-[1fr_auto] sm:items-center">
              <span>{assignment.itemLabel || "Item"}</span>
              <Badge variant="secondary">{assignment.groupLabel || "Group"}</Badge>
            </div>
          ))}
        </div>
      )}

      {Array.isArray(exercise.sequence) && exercise.sequence.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-medium text-muted-foreground">Sequence response</p>
          <ol className="space-y-2">
            {exercise.sequence.map((item, index) => (
              <li key={`${item.label || "sequence"}-${index}`} className="flex gap-3 rounded-lg border bg-background p-3 text-sm">
                <span className="font-semibold text-primary">{index + 1}.</span>
                <span>{item.label || "Step"}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {exercise.followUp?.value && <TextResponse prompt={exercise.followUp.prompt} value={exercise.followUp.value} />}
    </div>
  )
}

export default function JourneyResponsesSummarySection({ summary }: { summary: JourneyResponsesSummary }) {
  const historyLabel = summary.historyMode === "include_previous" ? "Previous + future responses" : "New responses only"

  return (
    <section className="border-t pt-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="flex items-center gap-2 font-semibold"><BookOpenCheck className="size-4 text-primary" /> Journey responses</h3>
        <Badge variant="outline">{historyLabel}</Badge>
      </div>
      <div className="mt-3 rounded-lg border border-amber-300/60 bg-amber-50/70 p-4 text-xs leading-5 text-amber-950 dark:border-amber-800 dark:bg-amber-950/20 dark:text-amber-100">
        These are client-entered quick-check and exercise responses available under the separate Journey responses permission. They are self-reported information for later review, not a clinical record, diagnosis, risk score or live-monitoring signal.
      </div>
      <p className="mt-3 text-xs text-muted-foreground">Permission granted {dateLabel(summary.grantedAt)}. Opening these responses is recorded in the client's access history.</p>

      <div className="mt-4 space-y-4">
        {summary.responses.length === 0 ? (
          <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">No Journey responses fall inside this permission's sharing window yet.</div>
        ) : summary.responses.map((response, index) => (
          <article key={`${response.module_slug || "module"}-${index}`} className="rounded-xl border bg-muted/10 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b pb-3">
              <div>
                <p className="font-semibold">{response.module_name || response.module_slug || "Journey module"}</p>
                <p className="mt-1 text-xs text-muted-foreground">Completed {dateLabel(response.last_completed_at)}</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {response.content_version && <Badge variant="outline">Content v{response.content_version}</Badge>}
                {response.response_schema_version && <Badge variant="secondary">{response.response_schema_version}</Badge>}
              </div>
            </div>

            <div className="mt-4 space-y-4">
              {response.response_data?.quickCheck && (
                <div className="rounded-lg border bg-background p-3">
                  <p className="text-xs font-medium text-muted-foreground">Quick check</p>
                  {response.response_data.quickCheck.prompt && <p className="mt-1 text-sm leading-6">{response.response_data.quickCheck.prompt}</p>}
                  <p className="mt-2 text-sm font-medium">Selected: {response.response_data.quickCheck.selectedOptionLabel || "Recorded option"}</p>
                </div>
              )}
              <ExerciseResponse exercise={response.response_data?.exercise} />
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
