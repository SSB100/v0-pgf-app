"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Pencil, GripVertical } from "lucide-react"

interface CoreValuesCardProps {
  values: Array<{
    value_name: string
    rank: number
    category: string
  }>
}

export default function CoreValuesCard({ values: initialValues }: CoreValuesCardProps) {
  const [open, setOpen] = useState(false)
  const [values, setValues] = useState(initialValues)
  const [editingValues, setEditingValues] = useState(initialValues)
  const [isSaving, setIsSaving] = useState(false)

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/html", index.toString())
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    const dragIndex = Number.parseInt(e.dataTransfer.getData("text/html"))

    if (dragIndex === dropIndex) return

    const newValues = [...editingValues]
    const [removed] = newValues.splice(dragIndex, 1)
    newValues.splice(dropIndex, 0, removed)

    // Update ranks based on new positions
    const updatedValues = newValues.map((value, index) => ({
      ...value,
      rank: index + 1,
    }))

    setEditingValues(updatedValues)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await fetch("/api/user/update-values-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          values: editingValues.map((v) => ({
            value_name: v.value_name,
            rank: v.rank,
          })),
        }),
      })

      if (response.ok) {
        setValues(editingValues)
        setOpen(false)
      } else {
        alert("Failed to update values order")
      }
    } catch (error) {
      console.error("Error updating values:", error)
      alert("Failed to update values order")
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setEditingValues(values)
    setOpen(false)
  }

  return (
    <Card className="border-border/50 overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary/15 border border-primary/25 flex items-center justify-center">
              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            Your Core Values
          </CardTitle>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <Pencil className="w-4 h-4" />
                <span className="hidden sm:inline">Edit Order</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Reorder Your Core Values</DialogTitle>
                <DialogDescription>
                  Drag and drop to change the order of your top 3 values. Your top value will be ranked #1.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-2 py-4">
                {editingValues.map((value, index) => (
                  <div
                    key={value.value_name}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                    className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg hover:bg-secondary/70 transition-colors cursor-move"
                  >
                    <GripVertical className="w-5 h-5 text-muted-foreground" />
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-bold text-sm">{value.rank}</span>
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm text-foreground">{value.value_name}</div>
                      <div className="text-xs text-muted-foreground capitalize">{value.category}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Order"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {values.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {values.map((value, idx) => (
              <div
                key={value.value_name}
                className={`relative flex items-center gap-3 p-4 rounded-xl border transition-colors ${
                  idx === 0
                    ? "bg-primary/10 border-primary/30"
                    : "bg-secondary/30 border-border/50 hover:bg-secondary/50"
                }`}
              >
                <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                  idx === 0 ? "bg-primary/20 border border-primary/40" : "bg-secondary/60 border border-border/50"
                }`}>
                  <span className={`font-bold text-sm ${idx === 0 ? "text-primary" : "text-muted-foreground"}`}>{value.rank}</span>
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-sm text-foreground leading-tight">{value.value_name}</div>
                  <div className="text-xs text-muted-foreground capitalize mt-0.5">{value.category}</div>
                </div>
                {idx === 0 && (
                  <div className="absolute top-2 right-2">
                    <span className="text-[10px] font-bold text-primary/70 uppercase tracking-wide">Top</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground text-sm">No values set yet</div>
        )}
      </CardContent>
    </Card>
  )
}
