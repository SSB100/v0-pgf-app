import { Button } from "@/components/ui/button"

interface StepButtonFooterProps {
  onBack?: () => void
  onNext: () => void
  backText?: string
  nextText?: string
  disabled?: boolean
}

export function StepButtonFooter({
  onBack,
  onNext,
  backText = "Back",
  nextText = "Continue",
  disabled = false,
}: StepButtonFooterProps) {
  return (
    <div className="flex gap-3 pt-6">
      {onBack && (
        <Button type="button" variant="outline" onClick={onBack} className="flex-1 bg-transparent h-11 text-sm font-medium">
          {backText}
        </Button>
      )}
      <Button
        type="button"
        onClick={onNext}
        disabled={disabled}
        className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-medium h-11 text-sm"
      >
        {nextText}
      </Button>
    </div>
  )
}
