import Link from "next/link"
import { ArrowLeft, HeartHandshake, Phone, ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-background px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <Button asChild variant="ghost" className="w-fit gap-2 px-2 text-muted-foreground">
          <Link href="/dashboard">
            <ArrowLeft className="size-4" /> Back to dashboard
          </Link>
        </Button>

        <header className="space-y-3 border-b border-border/70 pb-6">
          <div className="flex items-center gap-3 text-primary">
            <div className="flex size-11 items-center justify-center rounded-xl border border-primary/25 bg-primary/10">
              <HeartHandshake className="size-5" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em]">Immediate support options</p>
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">You do not have to handle this moment alone.</h1>
          <p className="leading-6 text-muted-foreground">
            Waypoint is not a monitored emergency-response service and pressing this page does not notify a clinician or support worker.
            These options connect you with real services in Aotearoa New Zealand.
          </p>
        </header>

        <Card className="border-destructive/30 bg-destructive/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <ShieldAlert className="size-5" /> Immediate danger
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm leading-6">
              If you or someone else is in immediate danger of harm, call <strong>111</strong> or go to the nearest hospital emergency department.
            </p>
            <Button asChild variant="destructive" className="w-full sm:w-auto">
              <a href="tel:111"><Phone className="mr-2 size-4" /> Call 111</a>
            </Button>
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Need to talk now</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-6">
              <p><strong>1737</strong> provides free, confidential emotional support from trained counsellors and peer support workers, 24/7.</p>
              <div className="flex flex-wrap gap-2">
                <Button asChild variant="outline"><a href="tel:1737">Call 1737</a></Button>
                <Button asChild variant="outline"><a href="sms:1737">Text 1737</a></Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Gambling support</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-6">
              <p><strong>Gambling Helpline</strong> is available throughout New Zealand on 0800 654 655 or by text on 8006.</p>
              <div className="flex flex-wrap gap-2">
                <Button asChild variant="outline"><a href="tel:0800654655">Call 0800 654 655</a></Button>
                <Button asChild variant="outline"><a href="sms:8006">Text 8006</a></Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">PGF gambling-harm support</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-6">
              <p><strong>PGF Group</strong> offers free and confidential gambling-harm counselling and support. Their duty counsellors are available during service hours.</p>
              <div className="flex flex-wrap gap-2">
                <Button asChild variant="outline"><a href="tel:0800664262">Call 0800 664 262</a></Button>
                <Button asChild variant="outline"><a href="sms:5819">Text 5819</a></Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Alcohol or drug support</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-6">
              <p><strong>Alcohol Drug Helpline</strong> provides 24/7 support from trained counsellors on 0800 787 797.</p>
              <Button asChild variant="outline"><a href="tel:0800787797">Call 0800 787 797</a></Button>
            </CardContent>
          </Card>
        </div>

        <div className="rounded-xl border border-border bg-muted/30 p-4 text-sm leading-6 text-muted-foreground">
          If you already have a counsellor, clinician, sponsor, peer supporter, trusted friend or whānau member in your support plan, contacting them can also be a useful next step. Waypoint does not replace professional care or emergency services.
        </div>
      </div>
    </main>
  )
}
