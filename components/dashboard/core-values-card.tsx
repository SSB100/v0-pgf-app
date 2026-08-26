import Link from "next/link"
import { ArrowRight, Compass, Heart } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface CoreValuesCardProps {
  values: Array<{
    value_name: string
    rank: number
    category: string
  }>
}

export default function CoreValuesCard({ values }: CoreValuesCardProps) {
  const hasValues = values.length > 0

  return (
    <Card className="gap-3 overflow-hidden border-border/50 py-4">
      <CardHeader className="px-4 pb-0">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10">
            <Compass className="size-4 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <CardTitle className="text-base font-bold text-foreground">Your Core Values</CardTitle>
            <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">
              {hasValues ? "Directions you chose to keep close." : "Optional directions you can explore later."}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 px-4">
        {hasValues ? (
          <div className="flex flex-wrap gap-2">
            {values.map((value) => (
              <div
                key={value.value_name}
                className="inline-flex min-h-9 items-center gap-2 rounded-xl border border-border/60 bg-secondary/20 px-3 py-1.5"
                title={value.category || undefined}
              >
                <Heart className="size-3.5 shrink-0 text-primary" />
                <span className="text-sm font-semibold text-foreground">{value.value_name}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border px-3 py-2 text-xs leading-relaxed text-muted-foreground">
            Waypoint works without core values. Use the values module if a guided reflection would be useful.
          </div>
        )}

        <div className="flex items-center justify-between gap-3 border-t border-border/60 pt-2.5">
          <p className="min-w-0 text-[10px] leading-snug text-muted-foreground">Values can change. They guide direction rather than measure success.</p>
          <Link
            href="/journey/learn/discovering-values"
            className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-primary hover:underline"
          >
            {hasValues ? "Revisit" : "Explore"} <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
