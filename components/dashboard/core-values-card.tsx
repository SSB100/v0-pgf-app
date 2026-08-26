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
    <Card className="overflow-hidden border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-primary/25 bg-primary/10">
            <Compass className="size-4.5 text-primary" />
          </div>
          <div className="min-w-0">
            <CardTitle className="text-lg font-bold text-foreground">Your Core Values</CardTitle>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {hasValues
                ? "The three values you narrowed down in the values module. They sit alongside one another rather than being ranked first, second and third."
                : "You have not chosen core values yet. Waypoint works without them, and you can explore what matters to you later if that would be useful."}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {hasValues ? (
          <div className="grid gap-2.5">
            {values.map((value) => (
              <div
                key={value.value_name}
                className="flex items-center gap-3 rounded-xl border border-border/60 bg-secondary/20 p-3.5"
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/10">
                  <Heart className="size-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold leading-tight text-foreground">{value.value_name}</p>
                  {value.category && (
                    <p className="mt-0.5 text-xs capitalize text-muted-foreground">{value.category}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border p-4 text-sm leading-relaxed text-muted-foreground">
            Core values are optional. The values module is there when you want a guided way to think about the directions and relationships that matter to you.
          </div>
        )}

        <div className="rounded-xl border border-primary/15 bg-primary/5 p-3 text-xs leading-relaxed text-muted-foreground">
          Values can change as life changes. They are prompts for direction, not labels you have to live up to perfectly.
        </div>

        <Link
          href="/journey/learn/discovering-values"
          className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-primary hover:underline"
        >
          {hasValues ? "Revisit the values module" : "Explore the values module"} <ArrowRight className="size-4" />
        </Link>
      </CardContent>
    </Card>
  )
}
