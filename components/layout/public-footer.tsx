import Link from "next/link"
import { AppLogo } from "@/components/layout/app-logo"

export function PublicFooter() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <Link href="/">
              <AppLogo size="sm" showText={true} />
            </Link>
          </div>
          <p className="text-sm text-primary/70">© 2025 Waypoint. Supporting recovery journeys.</p>
          <div className="flex gap-6 text-sm">
            <Link href="/terms" className="text-primary/70 hover:text-primary transition-colors">
              Terms
            </Link>
            <Link href="/about" className="text-primary/70 hover:text-primary transition-colors">
              About
            </Link>
            <Link href="/faq" className="text-primary/70 hover:text-primary transition-colors">
              FAQ
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
