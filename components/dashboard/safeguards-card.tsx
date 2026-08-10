import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, ChevronRight } from "lucide-react"

export default function SafeguardsCard() {
  const items = [
    "BetBlocker & GamBan installation guides",
    "Money management strategies",
    "Self-exclusion services",
    "Device and environment safeguards",
  ]

  return (
    <Card className="border-border/50 overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        {/* Image panel */}
        <div className="relative h-40 sm:h-auto sm:w-48 flex-shrink-0">
          <Image
            src="/images/safeguards-shield.jpg"
            alt="A family representing safety and protection"
            fill
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card sm:bg-gradient-to-l sm:from-transparent sm:to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent sm:hidden" />
        </div>

        {/* Content panel */}
        <div className="flex-1 p-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-orange-500/15 border border-orange-500/30 flex items-center justify-center">
              <Shield className="w-4 h-4 text-orange-500" />
            </div>
            <h3 className="text-base font-bold text-foreground">Recommended Safeguards</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            Build barriers between you and temptation — blocking software, money management, and self-exclusion.
          </p>
          <div className="space-y-2 mb-4">
            {items.map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-foreground">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0" />
                {item}
              </div>
            ))}
          </div>
          <Link href="/safeguards">
            <Button className="bg-orange-600 hover:bg-orange-700 text-white font-semibold w-full sm:w-auto">
              View All Safeguards
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  )
}
