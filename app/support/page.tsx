import Link from "next/link"
import { ArrowLeft, ExternalLink, HeartHandshake, Phone, ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SUPPORT_RESOURCES_LAST_VERIFIED, supportResources } from "@/lib/support-resources"

function SourceLink({ label, url }: { label: string; url: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1 text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
    >
      Source: {label} <ExternalLink className="size-3" />
    </a>
  )
}

export default function SupportPage() {
  const emergency = supportResources.emergency
  const emotional = supportResources.emotionalSupport
  const gambling = supportResources.gamblingHelpline
  const pgf = supportResources.pgf
  const alcoholDrug = supportResources.alcoholDrug

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
            <p className="text-xs font-semibold uppercase tracking-[0.18em]">Support in Aotearoa New Zealand</p>
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Support is available when you need it.</h1>
          <p className="leading-6 text-muted-foreground">
            Waypoint is not a monitored emergency-response service. Opening this page does not notify a clinician or support worker.
            The services below are independent New Zealand support services that you can contact directly.
          </p>
        </header>

        <Card className="border-destructive/30 bg-destructive/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <ShieldAlert className="size-5" /> Immediate danger
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm leading-6">{emergency.description}</p>
            <Button asChild variant="destructive" className="w-full sm:w-auto">
              <a href="tel:111"><Phone className="mr-2 size-4" /> Call {emergency.phone}</a>
            </Button>
            <div><SourceLink label={emergency.sourceLabel} url={emergency.sourceUrl} /></div>
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Need to talk now</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-6">
              <p>{emotional.description}</p>
              <p className="text-xs font-medium text-muted-foreground">Availability: {emotional.availability}</p>
              <div className="flex flex-wrap gap-2">
                <Button asChild variant="outline"><a href="tel:1737">Call {emotional.phone}</a></Button>
                <Button asChild variant="outline"><a href="sms:1737">Text {emotional.text}</a></Button>
              </div>
              <SourceLink label={emotional.sourceLabel} url={emotional.sourceUrl} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Gambling support</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-6">
              <p>{gambling.description}</p>
              <p className="text-xs font-medium text-muted-foreground">Availability: {gambling.availability}</p>
              <div className="flex flex-wrap gap-2">
                <Button asChild variant="outline"><a href="tel:0800654655">Call {gambling.phone}</a></Button>
                <Button asChild variant="outline"><a href="sms:8006">Text {gambling.text}</a></Button>
              </div>
              <SourceLink label={gambling.sourceLabel} url={gambling.sourceUrl} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">PGF gambling-harm support</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-6">
              <p>{pgf.description}</p>
              <p className="text-xs font-medium text-muted-foreground">Availability: {pgf.availability}</p>
              <div className="flex flex-wrap gap-2">
                <Button asChild variant="outline"><a href="tel:0800664262">Call {pgf.phone}</a></Button>
                <Button asChild variant="outline"><a href="sms:5819">Text {pgf.text}</a></Button>
              </div>
              <SourceLink label={pgf.sourceLabel} url={pgf.sourceUrl} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Alcohol or other drug support</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-6">
              <p>{alcoholDrug.description}</p>
              <p className="text-xs font-medium text-muted-foreground">Availability: {alcoholDrug.availability}</p>
              <div className="flex flex-wrap gap-2">
                <Button asChild variant="outline"><a href="tel:0800787797">Call {alcoholDrug.phone}</a></Button>
                <Button asChild variant="outline"><a href="sms:8681">Text {alcoholDrug.text}</a></Button>
              </div>
              <SourceLink label={alcoholDrug.sourceLabel} url={alcoholDrug.sourceUrl} />
            </CardContent>
          </Card>
        </div>

        <div className="rounded-xl border border-border bg-muted/30 p-4 text-sm leading-6 text-muted-foreground">
          If you already have a counsellor, clinician, peer supporter, trusted friend or whānau member in your support plan,
          contacting them may also help. Waypoint does not replace professional care or emergency services.
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Support details last checked {SUPPORT_RESOURCES_LAST_VERIFIED}. Service details can change, so the linked provider pages remain the source of truth.
        </p>
      </div>
    </main>
  )
}
