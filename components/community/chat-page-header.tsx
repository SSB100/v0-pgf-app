"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Home, Map } from "lucide-react"
import AppLogo from "@/components/layout/app-logo"
import { Button } from "@/components/ui/button"

export default function ChatPageHeader() {
  const router = useRouter()

  return (
    <header className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/dashboard")}
            className="shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <AppLogo size="sm" showText={true} />
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-3 py-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors text-sm font-medium"
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>
          <Link
            href="/journey"
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium shadow-md"
          >
            <Map className="w-4 h-4" />
            <span className="hidden sm:inline">My Journey</span>
          </Link>
        </div>
      </div>
    </header>
  )
}
