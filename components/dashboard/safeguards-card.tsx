import Link from "next/link"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Shield, ChevronRight } from "lucide-react"

export default function SafeguardsCard() {
  const items = [
    "Blocking and device controls",
    "Money and payment safeguards",
    "Self-exclusion information",
    "Support and environment changes",
  ]

  return (
    <Card className="overflow-hidden border-border/50 py-0">
      <div className="flex flex-col sm:flex-row lg:min-h-[132px]">
        <div className="relative h-32 shrink-0 sm:h-auto sm:w-36 lg:w-32">
          <Image src="/images/safeguards-shield.jpg" alt="People supporting one another" fill className="object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent sm:hidden" />
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-center p-4 lg:py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-orange-500/25 bg-orange-500/10">
                <Shield className="size-4 text-orange-500" />
              </div>
              <div className="min-w-0">
                <h3 className="text-base font-bold text-foreground">Practical Safeguards</h3>
                <p className="mt-0.5 text-xs leading-snug text-muted-foreground">Optional barriers and support that can add space between an urge and an action.</p>
              </div>
            </div>

            <Link
              href="/safeguards"
              className="hidden min-h-9 shrink-0 items-center gap-1.5 rounded-lg bg-orange-600 px-3 text-xs font-semibold text-white transition-colors hover:bg-orange-700 lg:inline-flex"
            >
              Explore <ChevronRight className="size-3.5" />
            </Link>
          </div>

          <div className="mt-3 grid gap-x-5 gap-y-1.5 text-xs text-foreground sm:grid-cols-2 lg:mt-2.5 lg:grid-cols-4">
            {items.map((item) => (
              <div key={item} className="flex min-w-0 items-center gap-2">
                <div className="size-1.5 shrink-0 rounded-full bg-orange-500" />
                <span className="truncate">{item}</span>
              </div>
            ))}
          </div>

          <Link
            href="/safeguards"
            className="mt-3 inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg bg-orange-600 px-3 text-sm font-semibold text-white transition-colors hover:bg-orange-700 lg:hidden"
          >
            Explore Safeguards <ChevronRight className="size-4" />
          </Link>
        </div>
      </div>
    </Card>
  )
}
