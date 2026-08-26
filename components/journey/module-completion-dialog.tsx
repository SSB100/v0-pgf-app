"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Sprout, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"

interface ModuleCompletionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  moduleTitle: string
  keyLearning: string
  creditsAwarded: number
  nextModule?: {
    title: string
    slug: string
  }
}

export function ModuleCompletionDialog({
  open,
  onOpenChange,
  moduleTitle,
  keyLearning,
  creditsAwarded,
  nextModule,
}: ModuleCompletionDialogProps) {
  const router = useRouter()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <DialogTitle className="text-2xl text-center">Module activity recorded</DialogTitle>
          <DialogDescription className="text-center">You've explored {moduleTitle}.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-secondary/50 rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2">Key idea from this module</h4>
            <p className="text-sm text-muted-foreground">{keyLearning}</p>
          </div>

          <div className="bg-primary/10 rounded-lg p-4 flex items-center gap-3">
            <Sprout className="w-8 h-8 text-primary flex-shrink-0" />
            <div>
              {creditsAwarded > 0 ? (
                <>
                  <p className="font-semibold text-sm">+{creditsAwarded} Growth Credit{creditsAwarded > 1 ? "s" : ""}</p>
                  <p className="text-xs text-muted-foreground">A record of Waypoint engagement, not a clinical recovery score.</p>
                </>
              ) : (
                <>
                  <p className="font-semibold text-sm">No additional Growth Credit</p>
                  <p className="text-xs text-muted-foreground">Repeating a module updates its saved response but does not add another credit.</p>
                </>
              )}
            </div>
          </div>

          <div className="border-t pt-4">
            {nextModule && <p className="text-sm text-muted-foreground mb-3">Another module available to explore: {nextModule.title}</p>}
            <Button
              onClick={() => {
                onOpenChange(false)
                router.push("/journey")
              }}
              className="w-full"
            >
              Back to Journey
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ModuleCompletionDialog