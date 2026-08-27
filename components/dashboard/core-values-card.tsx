import Link from "next/link"
import { ArrowRight, Compass, Heart } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface CoreValuesCardProps {
  values: Array<{
    value_name: string
    rank: number
    category: string
  }>
  layout?: "vertical" | "horizontal"
}

export default function CoreValuesCard({ values, layout = "vertical" }: CoreValuesCardProps) {
  const hasValues = values.length > 0

  if (layout === "horizontal") {
    return (
      <Card className="h-full overflow-hidden border-border/50 shadow-sm">
        <CardContent className="grid h-full gap-4 p-4 xl:grid-cols-[minmax(190px,0.85fr)_minmax(0,2fr)_auto] xl:items-center xl:gap-5 xl:p-5">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-primary/25 bg-primary/10">
              <Compass className="size-4.5 text-primary" />
            </div>
            <div className="min-w-0">
              <CardTitle className="text-lg font-bold text-foreground">Your Core Values</CardTitle>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {hasValues
                  ? "Keep the directions that matter to you in view. These values sit side by side, not in ranked order."
                  : "Core values are optional. You can explore what matters to you whenever it feels useful."}
              </p>
            </div>
          </div>

          {hasValues ? (
            <div className="grid min-w-0 grid-cols-3 gap-2.5">
              {values.map((value) => (
                <div
                  key={value.value_name}
                  className="flex min-w-0 items-center gap-2.5 rounded-xl border border-border/60 bg-secondary/20 px-3 py-3"
                >
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/10">
                    <Heart className="size-3.5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold leading-tight text-foreground">{value.value_name}</p>
                    {value.category && (
                      <p className="mt-0.5 truncate text-[11px] capitalize text-muted-foreground">{value.category}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border px-4 py-3 text-xs leading-relaxed text-muted-foreground">
              The values module gives you a guided way to think about the directions and relationships that matter to you.
            </div>
          )}

          <Link
            href="/journey/learn/discovering-values"
            className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
          >
            {hasValues ? "Revisit" : "Explore"} <ArrowRight className="size-4" />
          </Link>
        </CardContent>
      </Card>
    )
  }

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
