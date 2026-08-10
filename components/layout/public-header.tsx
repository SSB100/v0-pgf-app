"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AppLogo } from "@/components/layout/app-logo"
import { Menu, X } from "lucide-react"

export function PublicHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/">
          <AppLogo size="sm" showText={true} />
        </Link>

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-6">
          <Link href="/about" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
            About
          </Link>
          <Link href="/faq" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
            FAQ
          </Link>
          <Link href="/auth/signin">
            <Button variant="ghost">Sign In</Button>
          </Link>
          <Link href="/auth/signup">
            <Button className="bg-gradient-to-r from-primary to-primary/80">Get Started</Button>
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden p-2 rounded-md text-primary hover:bg-primary/10 transition-colors"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t bg-background/98 px-4 py-4 space-y-3">
          <Link
            href="/about"
            className="block text-sm font-medium text-primary hover:text-primary/80 transition-colors py-2"
            onClick={() => setMobileMenuOpen(false)}
          >
            About
          </Link>
          <Link
            href="/faq"
            className="block text-sm font-medium text-primary hover:text-primary/80 transition-colors py-2"
            onClick={() => setMobileMenuOpen(false)}
          >
            FAQ
          </Link>
          <div className="flex flex-col gap-2 pt-2 border-t">
            <Link href="/auth/signin" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/signup" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full bg-gradient-to-r from-primary to-primary/80">Get Started</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
