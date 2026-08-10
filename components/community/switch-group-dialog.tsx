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
import { AlertCircle } from "lucide-react"

interface SwitchGroupDialogProps {
  isOpen: boolean
  onClose: () => void
  currentJourneyType: string
  onGroupSwitched: () => void
}

const JOURNEY_OPTIONS = [
  { value: "gambling", label: "Gambling Recovery" },
  { value: "alcohol", label: "Alcohol Recovery" },
  { value: "substances", label: "Substance Recovery" },
  { value: "gaming", label: "Gaming Recovery" },
  { value: "mental_health", label: "Mental Health Support" },
  { value: "personal_growth", label: "Personal Growth" },
]

const SWITCH_REASONS = [
  { value: "not_relevant", label: "Group not relevant to my journey" },
  { value: "better_fit", label: "Found a better group fit" },
  { value: "multiple_issues", label: "I'm addressing multiple issues" },
  { value: "support_needed", label: "Need different type of support" },
  { value: "other", label: "Other reason" },
]

export default function SwitchGroupDialog({
  isOpen,
  onClose,
  currentJourneyType,
  onGroupSwitched,
}: SwitchGroupDialogProps) {
  const [selectedJourney, setSelectedJourney] = useState("")
  const [selectedReason, setSelectedReason] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const availableJourneys = JOURNEY_OPTIONS.filter((j) => j.value !== currentJourneyType)

  async function handleSwitch() {
    if (!selectedJourney) {
      setError("Please select a group")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      const response = await fetch("/api/community/group/switch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentGroupId: currentJourneyType,
          newJourneyType: selectedJourney,
          reason: selectedReason || null,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to switch group")
      }

      onGroupSwitched()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleOpenChange(open: boolean) {
    if (!open && !isSubmitting) {
      onClose()
      setSelectedJourney("")
      setSelectedReason("")
      setError("")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Switch Support Group</DialogTitle>
          <DialogDescription>
            We understand that your needs may change. You can switch to a different support group anytime.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Choose a new group</label>
            <Select value={selectedJourney} onValueChange={setSelectedJourney} disabled={isSubmitting}>
              <SelectTrigger>
                <SelectValue placeholder="Select a group..." />
              </SelectTrigger>
              <SelectContent>
                {availableJourneys.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Why are you switching? (optional)</label>
            <Select value={selectedReason} onValueChange={setSelectedReason} disabled={isSubmitting}>
              <SelectTrigger>
                <SelectValue placeholder="Select a reason..." />
              </SelectTrigger>
              <SelectContent>
                {SWITCH_REASONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {error && <div className="text-sm text-destructive bg-destructive/10 p-2 rounded flex items-start gap-2">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            {error}
          </div>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSwitch} disabled={isSubmitting || !selectedJourney}>
            {isSubmitting ? "Switching..." : "Switch Group"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
