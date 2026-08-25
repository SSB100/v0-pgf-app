import Link from "next/link"
import { ShieldCheck } from "lucide-react"
import ProfessionalMfaForm from "@/components/auth/professional-mfa-form"

export default function ProfessionalMfaPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-secondary via-background to-muted px-4 py-12">
      <div className="mx-auto max-w-md space-y-6">
        <div className="text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary"><ShieldCheck className="size-6" /></div>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-primary">Waypoint professional security</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">One more verification step</h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Professional and administrative accounts require strong authentication before sensitive Waypoint access is opened.</p>
        </div>
        <ProfessionalMfaForm />
        <p className="text-center text-sm"><Link href="/auth/signin" className="text-primary hover:underline">Return to sign in</Link></p>
      </div>
    </main>
  )
}
