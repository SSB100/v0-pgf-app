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
    <div className="fixed inset-x-0 bottom-0 z-[60] border-t border-border/70 bg-card/95 px-3 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-10px_30px_rgba(0,0,0,0.08)] backdrop-blur-xl sm:static sm:z-auto sm:border-0 sm:bg-transparent sm:px-0 sm:pb-0 sm:pt-6 sm:shadow-none sm:backdrop-blur-none">
      <div className="mx-auto flex w-full max-w-2xl gap-2.5 sm:max-w-none sm:gap-3">
        {onBack && (
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="h-11 flex-1 bg-background/90 text-sm font-medium sm:bg-transparent"
          >
            {backText}
          </Button>
        )}
        <Button
          type="button"
          onClick={onNext}
          disabled={disabled}
          className="h-11 flex-1 bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          {nextText}
        </Button>
      </div>
    </div>
  )
}
