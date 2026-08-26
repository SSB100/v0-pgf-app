"use client"

import { useEffect, useMemo, useState } from "react"
import { Check, RotateCcw } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type {
  JourneyExerciseDefinition,
  JourneyExerciseField,
  JourneyExerciseOption,
} from "@/lib/journey-exercises"

export interface JourneyExerciseResponseInput {
  kind: JourneyExerciseDefinition["kind"]
  text: Record<string, string>
  selectedIds: string[]
  sortAnswers: Record<string, string>
  sequenceIds: string[]
}

interface JourneyExerciseProps {
  exercise: JourneyExerciseDefinition
  coreValues?: string[]
  onReadyChange: (ready: boolean) => void
  onResponseChange?: (response: JourneyExerciseResponseInput) => void
}

function ExerciseField({ field, value, onChange }: { field: JourneyExerciseField; value: string; onChange: (value: string) => void }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={`exercise-${field.id}`} className="text-sm font-semibold leading-snug">
        {field.label}
      </Label>
      {field.hint && <p className="text-xs text-muted-foreground leading-relaxed">{field.hint}</p>}
      <Textarea
        id={`exercise-${field.id}`}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={field.placeholder}
        rows={3}
        className="resize-none"
      />
    </div>
  )
}

function CoreValueOptions(coreValues: string[], fallback: JourneyExerciseOption[]): JourneyExerciseOption[] {
  if (coreValues.length === 0) return fallback
  return coreValues.map((value, index) => ({ id: `core-${index}`, label: value }))
}

export default function JourneyExercise({ exercise, coreValues = [], onReadyChange, onResponseChange }: JourneyExerciseProps) {
  const [text, setText] = useState<Record<string, string>>({})
  const [selected, setSelected] = useState<string[]>([])
  const [sortAnswers, setSortAnswers] = useState<Record<string, string>>({})
  const [sequence, setSequence] = useState<string[]>([])

  useEffect(() => {
    setText({})
    setSelected([])
    setSortAnswers({})
    setSequence([])
  }, [exercise.title])

  const options = useMemo(() => {
    if ((exercise.kind === "choice" || exercise.kind === "multi") && exercise.useCoreValues) {
      return CoreValueOptions(coreValues, exercise.options)
    }
    return exercise.kind === "choice" || exercise.kind === "multi" || exercise.kind === "scenario"
      ? exercise.options
      : []
  }, [coreValues, exercise])

  const followUp = exercise.kind === "choice" || exercise.kind === "multi" || exercise.kind === "scenario" || exercise.kind === "sequence"
    ? exercise.followUp
    : undefined

  const followUpReady = !followUp || Boolean(text[followUp.id]?.trim())

  const ready = useMemo(() => {
    switch (exercise.kind) {
      case "builder":
        return exercise.fields.every((field) => Boolean(text[field.id]?.trim()))
      case "balance":
        return exercise.boxes.every((field) => Boolean(text[field.id]?.trim()))
      case "choice":
        return selected.length === 1 && followUpReady
      case "multi":
        return selected.length >= exercise.minSelections && (!exercise.maxSelections || selected.length <= exercise.maxSelections) && followUpReady
      case "sort":
        return exercise.items.every((item) => Boolean(sortAnswers[item.id]))
      case "scenario":
        return selected.length === 1 && followUpReady
      case "sequence":
        return sequence.length === exercise.items.length && followUpReady
    }
  }, [exercise, followUpReady, selected.length, sequence.length, sortAnswers, text])

  useEffect(() => {
    onReadyChange(ready)
  }, [onReadyChange, ready])

  useEffect(() => {
    onResponseChange?.({
      kind: exercise.kind,
      text,
      selectedIds: selected,
      sortAnswers,
      sequenceIds: sequence,
    })
  }, [exercise.kind, onResponseChange, selected, sequence, sortAnswers, text])

  const setField = (id: string, value: string) => setText((current) => ({ ...current, [id]: value }))
  const chooseOne = (id: string) => setSelected([id])

  const toggleMany = (id: string, max?: number) => {
    setSelected((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id)
      if (max && current.length >= max) return current
      return [...current, id]
    })
  }

  const renderFollowUp = () => followUp ? (
    <div className="pt-2 border-t border-border/60">
      <ExerciseField field={followUp} value={text[followUp.id] || ""} onChange={(value) => setField(followUp.id, value)} />
    </div>
  ) : null

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold leading-tight">{exercise.title}</h2>
        <p className="mt-2 text-sm sm:text-base text-muted-foreground leading-relaxed">{exercise.intro}</p>
      </div>

      {exercise.kind === "builder" && (
        <div className="space-y-4">
          {exercise.fields.map((field) => (
            <div key={field.id} className="rounded-xl border border-border/70 bg-background p-4">
              <ExerciseField field={field} value={text[field.id] || ""} onChange={(value) => setField(field.id, value)} />
            </div>
          ))}
          {exercise.note && <p className="text-sm text-muted-foreground leading-relaxed">{exercise.note}</p>}
        </div>
      )}

      {exercise.kind === "balance" && (
        <div className="grid gap-3 sm:grid-cols-2">
          {exercise.boxes.map((box) => (
            <div key={box.id} className="rounded-xl border border-border/70 bg-background p-4">
              <ExerciseField field={box} value={text[box.id] || ""} onChange={(value) => setField(box.id, value)} />
            </div>
          ))}
        </div>
      )}

      {exercise.kind === "choice" && (
        <div className="space-y-4">
          <p className="font-semibold leading-relaxed">{exercise.prompt}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {options.map((option) => {
              const active = selected.includes(option.id)
              return (
                <button
                  type="button"
                  key={option.id}
                  onClick={() => chooseOne(option.id)}
                  className={`rounded-xl border p-4 text-left transition-colors ${active ? "border-primary bg-primary/8" : "border-border bg-background hover:bg-muted/30"}`}
                >
                  <div className="flex items-start gap-3">
                    <span className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border ${active ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/40"}`}>
                      {active && <Check className="h-3.5 w-3.5" />}
                    </span>
                    <div>
                      <p className="font-semibold leading-snug">{option.label}</p>
                      {option.help && <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{option.help}</p>}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
          {renderFollowUp()}
        </div>
      )}

      {exercise.kind === "multi" && (
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-3">
            <p className="font-semibold leading-relaxed">{exercise.prompt}</p>
            <Badge variant="secondary" className="shrink-0">
              {selected.length}{exercise.maxSelections ? ` / ${exercise.maxSelections}` : " chosen"}
            </Badge>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {options.map((option) => {
              const active = selected.includes(option.id)
              const atMax = Boolean(exercise.maxSelections && selected.length >= exercise.maxSelections && !active)
              return (
                <button
                  type="button"
                  key={option.id}
                  disabled={atMax}
                  onClick={() => toggleMany(option.id, exercise.maxSelections)}
                  className={`rounded-xl border p-3 text-left transition-colors disabled:opacity-45 ${active ? "border-primary bg-primary/8" : "border-border bg-background hover:bg-muted/30"}`}
                >
                  <div className="flex items-start gap-2.5">
                    <span className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded border ${active ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/40"}`}>
                      {active && <Check className="h-3.5 w-3.5" />}
                    </span>
                    <div>
                      <p className="font-medium leading-snug">{option.label}</p>
                      {option.help && <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{option.help}</p>}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
          {renderFollowUp()}
        </div>
      )}

      {exercise.kind === "sort" && (
        <div className="space-y-4">
          <div className="grid gap-2 sm:grid-cols-2">
            {exercise.groups.map((group) => (
              <div key={group.id} className="rounded-xl border border-border/70 bg-muted/20 p-3">
                <p className="font-semibold">{group.label}</p>
                {group.help && <p className="mt-1 text-xs text-muted-foreground">{group.help}</p>}
              </div>
            ))}
          </div>

          <div className="space-y-3">
            {exercise.items.map((item) => {
              const answer = sortAnswers[item.id]
              const finished = exercise.items.every((candidate) => Boolean(sortAnswers[candidate.id]))
              const matches = answer === item.bestGroup
              return (
                <div key={item.id} className="rounded-xl border border-border/70 bg-background p-3 space-y-3">
                  <p className="text-sm font-medium leading-relaxed">{item.label}</p>
                  <div className="flex flex-wrap gap-2">
                    {exercise.groups.map((group) => (
                      <Button
                        key={group.id}
                        type="button"
                        size="sm"
                        variant={answer === group.id ? "default" : "outline"}
                        onClick={() => setSortAnswers((current) => ({ ...current, [item.id]: group.id }))}
                      >
                        {group.label}
                      </Button>
                    ))}
                  </div>
                  {finished && answer && (
                    <p className={`text-xs font-medium ${matches ? "text-emerald-600 dark:text-emerald-400" : "text-amber-700 dark:text-amber-300"}`}>
                      {matches ? "That fits the lesson." : `The lesson would place this under “${exercise.groups.find((group) => group.id === item.bestGroup)?.label}”.`}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {exercise.kind === "scenario" && (
        <div className="space-y-4">
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-1.5">Example</p>
            <p className="text-sm sm:text-base leading-relaxed">{exercise.scenario}</p>
          </div>
          <p className="font-semibold leading-relaxed">{exercise.prompt}</p>
          <div className="space-y-2">
            {exercise.options.map((option) => {
              const active = selected.includes(option.id)
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => chooseOne(option.id)}
                  className={`w-full rounded-xl border p-4 text-left transition-colors ${active ? "border-primary bg-primary/8" : "border-border bg-background hover:bg-muted/30"}`}
                >
                  <div className="flex items-start gap-3">
                    <span className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border ${active ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/40"}`}>
                      {active && <Check className="h-3.5 w-3.5" />}
                    </span>
                    <div className="flex-1">
                      <p className="font-medium leading-relaxed">{option.label}</p>
                      {active && option.help && (
                        <p className={`mt-2 text-sm leading-relaxed ${option.recommended ? "text-emerald-700 dark:text-emerald-300" : "text-muted-foreground"}`}>
                          {option.help}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
          {renderFollowUp()}
        </div>
      )}

      {exercise.kind === "sequence" && (
        <div className="space-y-4">
          <p className="font-semibold leading-relaxed">{exercise.prompt}</p>
          <div className="flex flex-wrap gap-2">
            {exercise.items.map((item) => {
              const used = sequence.includes(item.id)
              return (
                <Button
                  key={item.id}
                  type="button"
                  variant="outline"
                  disabled={used}
                  onClick={() => setSequence((current) => [...current, item.id])}
                >
                  {item.label}
                </Button>
              )
            })}
          </div>

          <div className="rounded-xl border border-border/70 bg-muted/20 p-4 min-h-20">
            {sequence.length === 0 ? (
              <p className="text-sm text-muted-foreground">Your order will appear here.</p>
            ) : (
              <div className="flex flex-wrap items-center gap-2">
                {sequence.map((id, index) => (
                  <span key={`${id}-${index}`} className="inline-flex items-center gap-2">
                    <Badge variant="secondary">{index + 1}. {exercise.items.find((item) => item.id === id)?.label}</Badge>
                    {index < sequence.length - 1 && <span className="text-muted-foreground">→</span>}
                  </span>
                ))}
              </div>
            )}
          </div>

          <Button type="button" variant="ghost" size="sm" onClick={() => setSequence([])} disabled={sequence.length === 0}>
            <RotateCcw className="mr-2 h-4 w-4" /> Reset order
          </Button>

          {sequence.length === exercise.items.length && (
            <div className={`rounded-xl border p-4 text-sm ${sequence.every((id, index) => id === exercise.correctOrder[index]) ? "border-emerald-500/30 bg-emerald-500/8" : "border-amber-500/30 bg-amber-500/8"}`}>
              {sequence.every((id, index) => id === exercise.correctOrder[index]) ? (
                <p className="font-medium">You have the order.</p>
              ) : (
                <div className="space-y-2">
                  <p className="font-medium">The order to remember is:</p>
                  <p>{exercise.correctOrder.map((id) => exercise.items.find((item) => item.id === id)?.label).join(" → ")}</p>
                </div>
              )}
            </div>
          )}

          {renderFollowUp()}
        </div>
      )}
    </div>
  )
}
