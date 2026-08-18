import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { neon } from "@neondatabase/serverless"
import Link from "next/link"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import MobileNav from "@/components/dashboard/mobile-nav"
import {
  Shield,
  Wallet,
  Users,
  FileText,
  Phone,
  Lock,
  Ban,
  Timer,
  Globe,
  CheckCircle2,
  Map,
  Heart,
  Gamepad2,
  Wine,
  Pill,
  ExternalLink,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Suspense } from "react"
import { SUPPORT_RESOURCES_LAST_VERIFIED, supportResources } from "@/lib/support-resources"

const sql = neon(process.env.NEON_DATABASE_URL!)

type SafeguardItem = {
  name: string
  description: string
  steps: string[]
  website?: string
  sourceLabel?: string
  sourceUrl?: string
  icon: any
}

type SafeguardCategory = {
  category: string
  icon: any
  color: string
  bgColor: string
  items: SafeguardItem[]
}

async function SafeguardsPage() {
  const session = await getSession()
  if (!session) redirect("/")

  const [user] = await sql`
    SELECT
      u.id,
      u.email,
      u.full_name,
      COALESCE(up.onboarding_completed, false) as onboarding_completed,
      up.journey_types
    FROM users u
    LEFT JOIN user_profiles up ON u.id = up.user_id
    WHERE u.id = ${session.id}
  `

  if (!user) redirect("/auth/signin")
  if (user.onboarding_completed === false) redirect("/onboarding")

  const journeyTypes: string[] = user.journey_types
    ? typeof user.journey_types === "string"
      ? JSON.parse(user.journey_types)
      : user.journey_types
    : []

  const hasGambling = journeyTypes.includes("gambling")
  const hasAlcohol = journeyTypes.includes("alcohol")
  const hasSubstances = journeyTypes.includes("substances")
  const hasMentalHealth = journeyTypes.includes("mental_health")
  const hasGaming = journeyTypes.includes("gaming")

  const safeguards: SafeguardCategory[] = []

  if (hasGambling) {
    safeguards.push({
      category: "Gambling access and self-exclusion",
      icon: Ban,
      color: "text-red-600",
      bgColor: "bg-red-50",
      items: [
        {
          name: "Blocking tools",
          description:
            "Blocking software can add friction between an urge and access to gambling websites or apps. No blocking tool can guarantee that gambling will be completely inaccessible.",
          steps: [
            "If a blocking tool fits your goals, compare current options and device compatibility on the provider's own website.",
            "Examples include BetBlocker and Gamban; these are independent third-party services, not Waypoint services or endorsements.",
            "Consider using blocking tools alongside other safeguards rather than relying on one barrier alone.",
            "If useful, ask a trusted person to help you set up restrictions in a way you are comfortable with.",
          ],
          icon: Shield,
        },
        {
          name: "Venue self-exclusion",
          description:
            "In New Zealand, you can ask a class 4 gambling venue or casino to exclude you from entering its gambling area. Exclusion arrangements are governed by the Gambling Act and venue procedures.",
          steps: [
            "Ask the venue about its self-exclusion process, or contact a gambling-harm service for help understanding your options.",
            "If several venues are relevant, ask about multi-venue exclusion (MVE) support in your area.",
            "The details and length of an exclusion order depend on the applicable process; do not rely on a fixed minimum period shown by an app.",
            "Keep a copy of any paperwork or confirmation you receive.",
          ],
          sourceLabel: "Department of Internal Affairs exclusion-order guidance",
          sourceUrl:
            "https://www.dia.govt.nz/diawebsite.nsf/wpg_URL/Services-Casino-and-Non-Casino-Gaming-Exclusion-Order-%28Problem-Gamblers%29-Guidelines",
          icon: FileText,
        },
        {
          name: "Multi-venue exclusion support",
          description:
            "Multi-venue exclusion can help someone exclude themselves from more than one gambling venue. Safer Gambling Aotearoa notes that local coordinators and gambling-harm services can help with this process.",
          steps: [
            "Contact a gambling-harm service and ask about multi-venue exclusion in your area.",
            "You do not need to complete counselling before asking about self-exclusion support.",
            "Choose the venues that are relevant to you rather than assuming every person needs the same exclusion plan.",
          ],
          sourceLabel: "Safer Gambling Aotearoa",
          sourceUrl: "https://www.safergambling.org.nz/taking-action/what-to-expect",
          icon: Map,
        },
        {
          name: "Online account controls",
          description:
            "Many gambling operators provide account closure, time-out, deposit-limit or self-exclusion controls. Available options differ between operators and jurisdictions.",
          steps: [
            "Use the responsible-gambling or account-controls section of each service you use.",
            "Choose settings that fit the change you want to make.",
            "Remove saved payment details or gambling apps if that would make access less immediate.",
            "If you are unsure what an operator's setting does, check its current terms before relying on it.",
          ],
          icon: Globe,
        },
      ],
    })
  }

  if (hasAlcohol) {
    safeguards.push({
      category: "Alcohol-related safeguards",
      icon: Wine,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      items: [
        {
          name: "Change your environment",
          description:
            "Reducing easy access to alcohol can be useful for some people, but the right approach depends on your goals and your physical dependence on alcohol.",
          steps: [
            "Notice which places, routines or situations make drinking more likely for you.",
            "If it fits your goals, make alcohol less immediately available at home or plan alternatives for high-risk situations.",
            "Ask whānau or friends for practical support if you want it.",
            "If you drink heavily or regularly and are worried about withdrawal, get medical advice before making a sudden major change.",
          ],
          icon: Map,
        },
        {
          name: "Professional alcohol support",
          description:
            "A GP, addiction service or the Alcohol Drug Helpline can help you think through withdrawal safety, treatment options and the level of support that may suit you.",
          steps: [
            "Tell the professional how much and how often you have been drinking as accurately as you can.",
            "Ask specifically about withdrawal risk if you are considering stopping or substantially reducing alcohol.",
            "Discuss treatment or medication only with an appropriately qualified prescriber or clinician.",
          ],
          sourceLabel: supportResources.alcoholDrug.sourceLabel,
          sourceUrl: supportResources.alcoholDrug.sourceUrl,
          icon: Heart,
        },
      ],
    })
  }

  if (hasSubstances) {
    safeguards.push({
      category: "Substance-use safeguards",
      icon: Pill,
      color: "text-green-600",
      bgColor: "bg-green-50",
      items: [
        {
          name: "Reduce access and high-risk situations",
          description:
            "Changing access, routines and social situations can create more time between an urge and a decision. The safest changes depend on the substance and your circumstances.",
          steps: [
            "Notice people, places, contacts or routines that make use more likely for you.",
            "Set boundaries or reduce contact where that feels safe and useful.",
            "Ask a trusted person or professional service for help if changing your environment feels difficult or unsafe.",
            "For safe disposal questions, use local health, pharmacy or other appropriate disposal guidance rather than handling unfamiliar substances yourself.",
          ],
          icon: Ban,
        },
        {
          name: "Withdrawal and treatment support",
          description:
            "Withdrawal can vary substantially between substances. Medical or addiction support can help you plan a safer change and discuss treatment options.",
          steps: [
            "Tell a GP or addiction service what you use, how often and when you last used it.",
            "Ask whether medically supported withdrawal is recommended for your situation.",
            "Discuss medication or treatment programmes with a qualified professional rather than relying on generic app advice.",
            `For 24/7 alcohol and other drug support, call ${supportResources.alcoholDrug.phone} or text ${supportResources.alcoholDrug.text}.`,
          ],
          sourceLabel: supportResources.alcoholDrug.sourceLabel,
          sourceUrl: supportResources.alcoholDrug.sourceUrl,
          icon: Heart,
        },
      ],
    })
  }

  if (hasGaming) {
    safeguards.push({
      category: "Gaming limits and spending controls",
      icon: Gamepad2,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      items: [
        {
          name: "Platform and device controls",
          description:
            "Built-in screen-time, spending and purchase controls can help you create boundaries around gaming if that fits your goals.",
          steps: [
            "Review the screen-time and spending controls available on the devices and platforms you use.",
            "Set a limit that is realistic enough for you to follow and review it after a week or two.",
            "Consider requiring confirmation for in-game purchases or removing saved payment methods.",
            "If you want extra accountability, ask a trusted person to help manage a PIN or limit by agreement.",
          ],
          icon: Lock,
        },
        {
          name: "Change cues and routines",
          description:
            "Changing notifications, subscriptions or routines can make gaming less automatic without assuming that everyone needs to stop gaming entirely.",
          steps: [
            "Turn off notifications that pull you back into games when you do not want to play.",
            "Plan other activities for times when gaming tends to take over more than you intend.",
            "Review subscriptions or games that no longer fit your goals.",
          ],
          icon: Timer,
        },
      ],
    })
  }

  if (hasMentalHealth) {
    safeguards.push({
      category: "Personal safety and support planning",
      icon: Heart,
      color: "text-teal-600",
      bgColor: "bg-teal-50",
      items: [
        {
          name: "Create a personal safety plan",
          description:
            "A safety plan can help you identify warning signs, coping options and people or services you can contact when things feel harder. Creating one with a healthcare professional can be particularly useful if you are concerned about self-harm or suicide.",
          steps: [
            "Write down warning signs that tell you things are becoming harder.",
            "List coping strategies and places that help you feel safer or more grounded.",
            "Add trusted people and professional support services you are comfortable contacting.",
            `Include immediate support options such as ${supportResources.emotionalSupport.phone}; use 111 for immediate danger.`,
            "Keep the plan somewhere you can find it easily and review it when your circumstances change.",
          ],
          icon: FileText,
        },
        {
          name: "Make your environment safer",
          description:
            "If you are worried that you may harm yourself, creating distance from things you could use to hurt yourself can be one part of a broader safety plan.",
          steps: [
            "Consider asking a trusted person or healthcare professional to help you think through what would make your environment safer.",
            "Store medications and other potentially harmful items in a way that reduces immediate access where appropriate.",
            "Arrange check-ins or company from someone you trust if being alone feels unsafe.",
            "If you are in immediate danger, call 111 or go to the nearest hospital emergency department.",
          ],
          icon: Shield,
        },
      ],
    })
  }

  if (hasGambling || hasAlcohol || hasSubstances) {
    safeguards.push({
      category: "Money and payment safeguards",
      icon: Wallet,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      items: [
        {
          name: "Create more friction around spending",
          description:
            "Financial safeguards should support your own goals and consent. They should not require handing control of your money to another person unless that is a decision you freely make and understand.",
          steps: [
            "Turn on transaction alerts or spending notifications if they help you notice spending earlier.",
            "Remove saved payment methods from apps or websites that make unwanted spending too easy.",
            "Ask your bank what optional card, account or merchant controls it currently offers rather than assuming every bank has the same features.",
            "If you want another person involved, agree clearly on what they can see or do and how you can change that arrangement.",
            "Consider independent budgeting or financial-advice support if money management has become difficult.",
          ],
          icon: Lock,
        },
      ],
    })
  }

  safeguards.push({
    category: "Everyday support and environment",
    icon: Users,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    items: [
      {
        name: "Build a support network",
        description:
          "Support can come from whānau, friends, peers, counsellors, clinicians or other people you trust. You decide who you want involved and what you want to share.",
        steps: [
          "Choose one or two people you feel safe talking with.",
          "Tell them what kind of support is useful and what is not.",
          "Agree on how you would like them to check in, if at all.",
          "Add professional or peer support where it fits your needs.",
        ],
        icon: Users,
      },
      {
        name: "Change routines and cues",
        description:
          "Small environmental changes can make an unwanted behaviour less automatic and create more room to choose what you want to do next.",
        steps: [
          "Notice the times, places, notifications or routines that tend to cue the behaviour.",
          "Try one practical change at a time rather than changing everything at once.",
          "Plan an alternative activity for the situations that are hardest for you.",
          "Review what helped after a week and keep only the safeguards that are useful.",
        ],
        icon: Map,
      },
    ],
  })

  const quickSuggestions: string[] = []
  if (hasGambling) quickSuggestions.push("Consider blocking tools or ask a gambling-harm service about self-exclusion options.")
  if (hasAlcohol) quickSuggestions.push("If you drink regularly or heavily, check withdrawal safety with a professional before making a sudden major change.")
  if (hasSubstances) quickSuggestions.push("Ask a GP or addiction service about withdrawal safety and treatment options that fit the substance you use.")
  if (hasGaming) quickSuggestions.push("Try one screen-time or spending control that fits the change you want to make.")
  if (hasMentalHealth) quickSuggestions.push("Consider creating a personal safety plan with a clinician or trusted support person.")
  quickSuggestions.push("Choose one practical safeguard first; you do not need to do everything on this page.")

  return (
    <>
      <DashboardHeader userName={user.full_name || "there"} userEmail={user.email} />
      <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 pt-8 sm:pt-20 pb-24 lg:pb-8 px-4">
        <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8">
          <div className="lg:hidden">
            <Link href="/dashboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Dashboard
            </Link>
          </div>

          <div className="text-center space-y-3 sm:space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-primary to-primary/60 text-white shadow-xl">
              <Shield className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-primary via-primary to-primary/70 bg-clip-text text-transparent text-balance">
              Practical Safeguards
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto text-pretty">
              Safeguards are optional barriers, routines and support choices that can make it easier to pause before an unwanted behaviour.
              They are not guarantees, and the right combination will be different for each person.
            </p>
          </div>

          <Card className="border-2 border-primary/20 shadow-lg bg-gradient-to-br from-primary/5 to-primary/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <CheckCircle2 className="w-6 h-6 text-primary" />
                A place to start
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Choose one safeguard that feels realistic and relevant to your goals. You can add, change or stop using safeguards as you learn what helps.
              </p>
              <div className="grid gap-3 text-sm">
                {quickSuggestions.map((suggestion) => (
                  <div key={suggestion} className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span>{suggestion}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Accordion type="multiple" className="space-y-4">
            {safeguards.map((safeguard, safeguardIndex) => {
              const CategoryIcon = safeguard.icon
              return (
                <AccordionItem key={safeguard.category} value={`safeguard-${safeguardIndex}`} className="border rounded-lg shadow-md overflow-hidden bg-card">
                  <AccordionTrigger className="px-4 sm:px-6 py-4 hover:no-underline hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 sm:p-3 rounded-lg ${safeguard.bgColor} flex-shrink-0`}>
                        <CategoryIcon className={`w-5 h-5 sm:w-6 sm:h-6 ${safeguard.color}`} />
                      </div>
                      <h2 className="text-lg sm:text-2xl font-bold text-left">{safeguard.category}</h2>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    <div className="grid gap-4 pt-4">
                      {safeguard.items.map((item) => {
                        const ItemIcon = item.icon
                        return (
                          <Card key={item.name} className="shadow-sm">
                            <CardHeader>
                              <CardTitle className="flex items-center gap-3">
                                <ItemIcon className={`w-5 h-5 ${safeguard.color}`} />
                                {item.name}
                              </CardTitle>
                              <CardDescription className="text-base">{item.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div>
                                <h4 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">Ideas to consider</h4>
                                <ol className="space-y-2">
                                  {item.steps.map((step, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0 mt-0.5">{index + 1}</span>
                                      <span className="text-sm text-muted-foreground">{step}</span>
                                    </li>
                                  ))}
                                </ol>
                              </div>
                              {item.website && (
                                <a href={item.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
                                  <Globe className="w-4 h-4" /> Visit provider website
                                </a>
                              )}
                              {item.sourceUrl && item.sourceLabel && (
                                <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground underline underline-offset-2">
                                  Source: {item.sourceLabel} <ExternalLink className="w-3 h-3" />
                                </a>
                              )}
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>

          <Card className="border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-primary" /> Need support now?
              </CardTitle>
              <CardDescription>
                Waypoint is not a monitored crisis or emergency service. Use the support page to contact verified New Zealand services directly.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg border p-3">
                  <p className="font-semibold">Immediate danger</p>
                  <p className="text-muted-foreground">Call {supportResources.emergency.phone} or go to the nearest hospital emergency department.</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="font-semibold">Need to talk now</p>
                  <p className="text-muted-foreground">Call or text {supportResources.emotionalSupport.phone} for free brief emotional support.</p>
                </div>
                {hasGambling && (
                  <div className="rounded-lg border p-3">
                    <p className="font-semibold">Gambling Helpline</p>
                    <p className="text-muted-foreground">Call {supportResources.gamblingHelpline.phone} or text {supportResources.gamblingHelpline.text}.</p>
                  </div>
                )}
                {(hasAlcohol || hasSubstances) && (
                  <div className="rounded-lg border p-3">
                    <p className="font-semibold">Alcohol Drug Helpline</p>
                    <p className="text-muted-foreground">Call {supportResources.alcoholDrug.phone} or text {supportResources.alcoholDrug.text}.</p>
                  </div>
                )}
              </div>
              <Button asChild>
                <Link href="/support">View all verified support options</Link>
              </Button>
              <p className="text-xs text-muted-foreground">
                Support details last checked {SUPPORT_RESOURCES_LAST_VERIFIED}. Provider pages remain the source of truth if service details change.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <MobileNav />
    </>
  )
}

export default function SafeguardsPageWrapper() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      }
    >
      <SafeguardsPage />
    </Suspense>
  )
}
