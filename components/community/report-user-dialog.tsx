"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle } from "lucide-react"

interface ReportUserDialogProps {
  isOpen: boolean
  onClose: () => void
  reportedAlias: string
  groupId: string
  reportedUserId: string
  messageId?: string
}

const REPORT_REASONS = [
  { value: "harassment", label: "Harassment or bullying" },
  { value: "inappropriate", label: "Inappropriate content" },
  { value: "spam", label: "Spam or promotion" },
  { value: "abuse", label: "Abusive language" },
  { value: "other", label: "Other reason" },
]

export default function ReportUserDialog({
  isOpen,
  onClose,
  reportedAlias,
  groupId,
  reportedUserId,
  messageId,
}: ReportUserDialogProps) {
  const [reason, setReason] = useState("")
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  async function handleSubmit() {
    if (!reason) {
      setError("Please select a reason")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      const response = await fetch("/api/community/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          groupId,
          reportedUserId,
          messageId: messageId || null,
          reason,
          description: description || null,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to submit report")
      }

      setSuccess(true)
      setTimeout(() => {
        onClose()
        setReason("")
        setDescription("")
        setSuccess(false)
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleOpenChange(open: boolean) {
    if (!open && !isSubmitting) {
      onClose()
      setReason("")
      setDescription("")
      setError("")
      setSuccess(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-destructive" />
            Report User
          </DialogTitle>
          <DialogDescription>
            Help us keep the community safe by reporting {reportedAlias}'s behavior.
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="py-8 text-center space-y-2">
            <div className="text-3xl">✓</div>
            <p className="font-medium text-sm">Report submitted</p>
            <p className="text-xs text-muted-foreground">
              Thank you for helping keep our community safe. Our team will review this report.
            </p>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Reason for report</label>
              <Select value={reason} onValueChange={setReason} disabled={isSubmitting}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a reason..." />
                </SelectTrigger>
                <SelectContent>
                  {REPORT_REASONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Additional details (optional)</label>
              <Textarea
                placeholder="Provide more context about the incident..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isSubmitting}
                maxLength={500}
                className="resize-none"
                rows={3}
              />
              <p className="text-xs text-muted-foreground text-right">{description.length}/500</p>
            </div>

            {error && <div className="text-sm text-destructive bg-destructive/10 p-2 rounded">{error}</div>}
          </div>
        )}

        {!success && (
          <DialogFooter>
            <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting || !reason}>
              {isSubmitting ? "Submitting..." : "Submit Report"}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
