import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { neon } from "@neondatabase/serverless"
import Link from "next/link"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import MobileNav from "@/components/dashboard/mobile-nav"
import { Shield, Wallet, Users, FileText, Phone, Lock, Ban, Timer, Globe, CheckCircle2, Map, Heart, Brain, Gamepad2, Wine, Pill } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Suspense } from "react"

const sql = neon(process.env.NEON_DATABASE_URL!)

async function SafeguardsPage() {
  const session = await getSession()
  if (!session) {
    redirect("/")
  }

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

  if (!user) {
    redirect("/auth/signin")
  }

  if (user.onboarding_completed === false) {
    redirect("/onboarding")
  }

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
  const hasPersonalGrowth = journeyTypes.includes("personal_growth")

  // Build personalized safeguards based on journey types
  const safeguards: Array<{
    category: string
    icon: any
    color: string
    bgColor: string
    items: Array<{
      name: string
      description: string
      steps: string[]
      website?: string
      icon: any
    }>
  }> = []

  // Gambling-specific safeguards
  if (hasGambling) {
    safeguards.push({
      category: "Gambling Blocking Software",
      icon: Ban,
      color: "text-red-600",
      bgColor: "bg-red-50",
      items: [
        {
          name: "BetBlocker",
          description: "Free gambling blocking software that blocks access to 150,000+ gambling websites and apps across all your devices.",
          steps: [
            "Visit betblocker.org",
            "Download for your device (Windows, Mac, iOS, Android)",
            "Install and set up with a trusted contact's email",
            "Enable on all devices you use",
          ],
          website: "https://betblocker.org",
          icon: Shield,
        },
        {
          name: "GamBan",
          description: "Premium gambling blocking app that works across all platforms with advanced features for complete protection.",
          steps: [
            "Visit gamban.com",
            "Choose subscription plan",
            "Download and install on all devices",
            "Set up with tamper-proof settings",
            "Share access codes with trusted support person",
          ],
          website: "https://gamban.com",
          icon: Lock,
        },
      ],
    })

    safeguards.push({
      category: "Gambling Self-Exclusion",
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      items: [
        {
          name: "PGF Self-Exclusion",
          description: "Problem Gambling Foundation offers comprehensive self-exclusion services for venues and online platforms in New Zealand.",
          steps: [
            "Contact Problem Gambling Foundation on 0800 664 262",
            "Request self-exclusion registration",
            "Complete required documentation",
            "They will coordinate with venues and operators",
            "Your photo and details shared with participating venues",
            "Exclusion typically lasts 1-2 years minimum",
          ],
          icon: Shield,
        },
        {
          name: "Venue Self-Exclusion",
          description: "Directly exclude yourself from physical gambling venues (casinos, TABs, pubs with pokies).",
          steps: [
            "Visit the venue in person or call management",
            "Request self-exclusion form",
            "Complete with photo ID",
            "Specify exclusion period (minimum usually 6 months)",
            "Venue staff trained to enforce exclusion",
            "Consider excluding from multiple venues in your area",
          ],
          icon: Ban,
        },
        {
          name: "Online Gambling Self-Exclusion",
          description: "Block yourself from online gambling sites and apps.",
          steps: [
            "Log into each gambling account you have",
            "Navigate to responsible gambling or self-exclusion section",
            "Request account closure or self-exclusion",
            "Choose longest exclusion period available",
            "Withdraw any remaining funds to a trusted person",
            "Delete all gambling apps from devices",
          ],
          icon: Globe,
        },
      ],
    })
  }

  // Alcohol-specific safeguards
  if (hasAlcohol) {
    safeguards.push({
      category: "Alcohol-Free Environment",
      icon: Wine,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      items: [
        {
          name: "Remove Alcohol from Home",
          description: "Creating an alcohol-free environment removes immediate temptation and creates a safe space for recovery.",
          steps: [
            "Remove all alcohol from your home",
            "Ask family members to support an alcohol-free household",
            "Replace alcohol with non-alcoholic alternatives you enjoy",
            "Identify and remove hidden stashes",
            "Consider having a trusted person do a walkthrough",
          ],
          icon: Ban,
        },
        {
          name: "Avoid Triggering Locations",
          description: "Identify and avoid places associated with drinking to reduce temptation.",
          steps: [
            "Make a list of bars, pubs, and stores you frequented",
            "Plan alternative routes that avoid these locations",
            "Find alcohol-free social venues",
            "Inform friends you're avoiding drinking establishments",
            "Have a plan for social events where alcohol is present",
          ],
          icon: Map,
        },
        {
          name: "Medication Support",
          description: "Talk to your doctor about medications that can help reduce cravings and support recovery.",
          steps: [
            "Schedule an appointment with your GP",
            "Discuss medications like naltrexone, acamprosate, or disulfiram",
            "Be honest about your drinking history",
            "Follow the prescribed treatment plan",
            "Attend follow-up appointments",
          ],
          icon: Heart,
        },
      ],
    })
  }

  // Substance-specific safeguards
  if (hasSubstances) {
    safeguards.push({
      category: "Substance-Free Environment",
      icon: Pill,
      color: "text-green-600",
      bgColor: "bg-green-50",
      items: [
        {
          name: "Remove All Substances & Paraphernalia",
          description: "Eliminate all substances and related items from your environment to support your recovery.",
          steps: [
            "Dispose of all drugs and substances safely",
            "Remove all paraphernalia (pipes, needles, etc.)",
            "Clean out hiding spots thoroughly",
            "Ask someone you trust to help with the cleanup",
            "Contact local services for safe disposal options",
          ],
          icon: Ban,
        },
        {
          name: "Change Your Social Circle",
          description: "Distance yourself from people and situations that enable substance use.",
          steps: [
            "Identify people who use or enable your use",
            "Set boundaries or temporarily limit contact",
            "Delete dealer contacts from your phone",
            "Leave group chats related to substance use",
            "Build new connections through support groups",
          ],
          icon: Users,
        },
        {
          name: "Medical Support & Detox",
          description: "Professional medical support can help manage withdrawal safely and provide ongoing treatment.",
          steps: [
            "Speak with your doctor about your substance use",
            "Discuss medically supervised detox options",
            "Explore medication-assisted treatment (MAT)",
            "Get referrals to addiction specialists",
            "Consider inpatient or outpatient treatment programs",
          ],
          icon: Heart,
        },
      ],
    })
  }

  // Gaming-specific safeguards
  if (hasGaming) {
    safeguards.push({
      category: "Gaming Limits & Controls",
      icon: Gamepad2,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      items: [
        {
          name: "Platform Parental Controls",
          description: "Use built-in controls to limit gaming time and spending across all platforms.",
          steps: [
            "Enable screen time limits on PlayStation, Xbox, Nintendo, or PC",
            "Set up daily or weekly play time restrictions",
            "Have someone else set the PIN for these controls",
            "Disable in-game purchases or require approval",
            "Use Family Link (Android) or Screen Time (iOS) for mobile gaming",
          ],
          icon: Lock,
        },
        {
          name: "Game Blocking Software",
          description: "Install software that blocks access to games during certain hours or completely.",
          steps: [
            "Install Cold Turkey or Freedom app",
            "Block specific games or gaming platforms",
            "Set up scheduled blocking times",
            "Have someone else manage the settings",
            "Consider uninstalling problematic games entirely",
          ],
          icon: Ban,
        },
        {
          name: "Remove Gaming Equipment",
          description: "Create physical distance between yourself and gaming devices.",
          steps: [
            "Give gaming equipment to a trusted friend or family member",
            "Sell or store consoles and high-end gaming PCs",
            "Unsubscribe from gaming services (Game Pass, PS Plus, etc.)",
            "Remove gaming payment methods from accounts",
            "Delete gaming accounts if necessary",
          ],
          icon: Shield,
        },
      ],
    })
  }

  // Mental health safeguards
  if (hasMentalHealth) {
    safeguards.push({
      category: "Safety Planning",
      icon: Heart,
      color: "text-teal-600",
      bgColor: "bg-teal-50",
      items: [
        {
          name: "Create a Safety Plan",
          description: "A written safety plan helps you navigate difficult moments with clear steps to follow.",
          steps: [
            "Identify your personal warning signs",
            "List coping strategies that work for you",
            "Write down reasons to keep going",
            "List people you can call for support",
            "Include crisis helpline numbers (1737)",
            "Keep copies in multiple accessible places",
          ],
          icon: FileText,
        },
        {
          name: "Secure Your Environment",
          description: "Remove or restrict access to items that could be harmful during a crisis.",
          steps: [
            "Have a trusted person store medications securely",
            "Limit access to only necessary daily medications",
            "Remove or secure other potentially harmful items",
            "Ask someone to check in with you regularly",
            "Create a calm, comfortable space at home",
          ],
          icon: Shield,
        },
        {
          name: "Crisis Support Network",
          description: "Build a network of people who can help during difficult times.",
          steps: [
            "Identify 3-5 people you can call in a crisis",
            "Tell them you may need support sometimes",
            "Share your safety plan with them",
            "Discuss how they can best help you",
            "Keep their contact info easily accessible",
          ],
          icon: Users,
        },
      ],
    })
  }

  // Money management - relevant for gambling, substances, and alcohol
  if (hasGambling || hasSubstances || hasAlcohol) {
    safeguards.push({
      category: "Money Management",
      icon: Wallet,
      color: "text-green-600",
      bgColor: "bg-green-50",
      items: [
        {
          name: "Financial Accountability Partner",
          description: "Have a trusted person help manage your finances while you focus on recovery.",
          steps: [
            "Choose someone you trust completely (family member, close friend)",
            "Have an honest conversation about your situation",
            "Set up joint account access or authorized user status",
            "Establish clear rules: daily allowance, approval needed for large purchases",
            "Schedule weekly check-ins to review spending",
            "Create a timeline for gradually regaining full control",
          ],
          icon: Users,
        },
        {
          name: "Separate Accounts Strategy",
          description: "Create a barrier between you and your money by setting up restricted access accounts.",
          steps: [
            "Open a high-interest savings account with withdrawal restrictions",
            "Set up direct deposit to savings account",
            "Keep only daily/weekly allowance in accessible checking account",
            "Remove debit cards from digital wallets",
            "Enable transaction alerts for all accounts",
            "Consider time-locked savings or term deposits",
          ],
          icon: Lock,
        },
        {
          name: "Payment Method Restrictions",
          description: "Limit your access to payment methods that enable harmful spending.",
          steps: [
            "Cancel or freeze credit cards",
            "Remove saved payment methods from browsers and apps",
            "Use cash-only for discretionary spending",
            hasGambling ? "Ask your bank to block gambling-related transactions" : "Set spending limits on cards",
            "Set up two-factor authorization for all payments",
          ],
          icon: Ban,
        },
      ],
    })
  }

  // Device & environment changes - applicable to most journeys
  safeguards.push({
    category: "Device & Environment Changes",
    icon: Timer,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    items: [
      {
        name: "Device Safeguards",
        description: "Set up your devices to support your recovery goals.",
        steps: [
          "Install content filtering or parental control software",
          "Have someone else set passwords for restrictions",
          "Enable screen time limits for problematic apps",
          "Remove app store access or require password",
          "Turn off notifications from triggering apps",
          "Use DNS filtering on your home network",
        ],
        icon: Lock,
      },
      {
        name: "Routine & Environment Changes",
        description: "Adjust your daily habits and surroundings to support recovery.",
        steps: [
          "Identify times and places associated with your habit",
          "Plan alternative activities for high-risk times",
          "Change routes that pass triggering locations",
          "Unsubscribe from marketing emails related to your habit",
          "Block related social media accounts",
          "Create new healthy routines to fill the time",
        ],
        icon: Map,
      },
    ],
  })

  // Support & accountability - universal
  safeguards.push({
    category: "Support & Accountability",
    icon: Users,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    items: [
      {
        name: "Tell Your Support Network",
        description: "Being open about your recovery journey creates natural accountability.",
        steps: [
          "Have honest conversations with close family/friends",
          "Explain what you're going through and how they can help",
          "Ask them to check in regularly",
          "Share your triggers and warning signs",
          "Create a code word for when you need immediate support",
        ],
        icon: Users,
      },
      {
        name: "Professional Support",
        description: "Connect with professional services for expert guidance.",
        steps: [
          "Contact your GP to discuss your situation",
          hasGambling ? "Call PGF helpline: 0800 664 262" : "",
          (hasAlcohol || hasSubstances) ? "Call Alcohol Drug Helpline: 0800 787 797" : "",
          hasMentalHealth ? "Call or text 1737 for free support" : "",
          "Request a counselor or therapist referral",
          "Attend individual or group counseling sessions",
          "Explore online counseling options",
        ].filter(step => step !== ""),
        icon: Phone,
      },
    ],
  })

  const crisisResources = []

  if (hasGambling) {
    crisisResources.push({
      type: "Gambling Support",
      icon: Shield,
      color: "text-purple-900",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      resources: [
        {
          name: "Problem Gambling Foundation NZ",
          phone: "0800 664 262",
          text: "8006",
          availability: "24/7, free and confidential",
          description: "Free counseling, family support, and self-exclusion services",
        },
        {
          name: "Gambling Helpline NZ",
          phone: "0800 654 655",
          availability: "24/7",
          description: "Support by phone, email, web, and text",
        },
        {
          name: "Gambling Youth Helpline",
          phone: "0800 654 659",
          availability: "24/7",
          description: "Specialized support for young people",
        },
        {
          name: "Gambling Māori Helpline",
          phone: "0800 654 656",
          availability: "24/7",
          description: "Culturally responsive support for Māori",
        },
        {
          name: "Gambling Pasifika Helpline",
          phone: "0800 654 657",
          availability: "24/7",
          description: "Culturally responsive support for Pasifika communities",
        },
      ],
    })
  }

  if (hasAlcohol) {
    crisisResources.push({
      type: "Alcohol Support",
      icon: Phone,
      color: "text-blue-900",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      resources: [
        {
          name: "Alcohol Drug Helpline NZ",
          phone: "0800 787 797",
          text: "8681",
          availability: "24/7, free and confidential",
          description: "Information, brief intervention, and referral services for alcohol concerns",
          website: "https://alcoholdrughelp.org.nz",
        },
        {
          name: "Alcoholics Anonymous NZ",
          phone: "0800 229 6757",
          availability: "24/7",
          description: "Fellowship and support meetings nationwide",
          website: "https://www.aa.org.nz",
        },
      ],
    })
  }

  if (hasSubstances) {
    crisisResources.push({
      type: "Substance Abuse Support",
      icon: Phone,
      color: "text-green-900",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      resources: [
        {
          name: "Alcohol Drug Helpline NZ",
          phone: "0800 787 797",
          text: "8681",
          availability: "24/7, free and confidential",
          description: "Support for drug and substance use concerns",
          website: "https://alcoholdrughelp.org.nz",
        },
        {
          name: "Narcotics Anonymous NZ",
          availability: "Check website for meetings",
          description: "Fellowship of people recovering from drug addiction",
          website: "https://nzna.org",
        },
      ],
    })
  }

  if (hasMentalHealth || journeyTypes.length === 0) {
    crisisResources.push({
      type: "Mental Health & Crisis Support",
      icon: Phone,
      color: "text-teal-900",
      bgColor: "bg-teal-50",
      borderColor: "border-teal-200",
      resources: [
        {
          name: "Need to Talk? (1737)",
          phone: "1737",
          text: "1737",
          availability: "24/7, free",
          description: "Free call or text anytime for mental health support",
        },
        {
          name: "Lifeline Aotearoa",
          phone: "0800 543 354",
          text: "4357 (HELP)",
          availability: "24/7, free",
          description: "Crisis support and suicide prevention",
        },
        {
          name: "Samaritans",
          phone: "0800 726 666",
          availability: "24/7",
          description: "Confidential emotional support",
        },
        {
          name: "Depression Helpline",
          phone: "0800 111 757",
          text: "4202",
          availability: "24/7, free",
          description: "Support for depression and anxiety",
        },
        {
          name: "Youthline",
          phone: "0800 376 633",
          text: "234",
          availability: "24/7",
          description: "Support for young people",
          email: "talk@youthline.co.nz",
        },
        {
          name: "What's Up",
          phone: "0800 942 8787",
          availability: "Mon-Fri 11am-11pm, Weekends 3pm-11pm",
          description: "Support for children and teens (5-18 years)",
        },
        {
          name: "OUTLine NZ",
          phone: "0800 688 5463",
          availability: "Daily 6pm-9pm",
          description: "Support for LGBTQIA+ communities",
        },
      ],
    })
  }

  crisisResources.push({
    type: "Emergency Services",
    icon: Phone,
    color: "text-red-900",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    resources: [
      {
        name: "Emergency Services",
        phone: "111",
        availability: "24/7",
        description: "Police, fire, and ambulance for immediate danger",
      },
      {
        name: "Mental Health Crisis Team",
        availability: "Contact through local hospital",
        description: "Assessment and support for mental health emergencies",
      },
    ],
  })

  return (
    <>
      <DashboardHeader userName={user.full_name || "there"} userEmail={user.email} />
      <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 pt-8 sm:pt-20 pb-24 lg:pb-8 px-4">
        <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8">
          <div className="lg:hidden">
            <Link
              href="/dashboard"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
            >
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
              Our Recommended Safeguards
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Building protective barriers is one of the most effective strategies for recovery. These
              safeguards create time and space for you to make better choices and stay on track.
            </p>
          </div>

          <Card className="border-2 border-primary/20 shadow-lg bg-gradient-to-br from-primary/5 to-primary/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <CheckCircle2 className="w-6 h-6 text-primary" />
                Getting Started With Your Safeguards
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                You don't need to implement everything at once. Start with what feels manageable and add more safeguards
                as you progress. Even one protective barrier can make a significant difference.
              </p>
              <div className="grid gap-3 text-sm">
                {hasGambling && (
                  <>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span>
                        <strong>Priority:</strong> Install gambling blocking software (BetBlocker or GamBan)
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span>
                        <strong>This week:</strong> Self-exclude from your most-used gambling venues
                      </span>
                    </div>
                  </>
                )}
                {hasAlcohol && (
                  <>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span>
                        <strong>Priority:</strong> Remove all alcohol from your home environment
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span>
                        <strong>This week:</strong> Identify and plan to avoid triggering locations
                      </span>
                    </div>
                  </>
                )}
                {hasSubstances && (
                  <>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span>
                        <strong>Priority:</strong> Safely dispose of all substances and paraphernalia
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span>
                        <strong>This week:</strong> Remove dealer contacts and distance from enabling relationships
                      </span>
                    </div>
                  </>
                )}
                {hasGaming && (
                  <>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span>
                        <strong>Priority:</strong> Set up screen time limits and parental controls on all devices
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span>
                        <strong>This week:</strong> Disable in-game purchases and unsubscribe from gaming services
                      </span>
                    </div>
                  </>
                )}
                {hasMentalHealth && (
                  <>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span>
                        <strong>Priority:</strong> Create a written safety plan with trusted contacts
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span>
                        <strong>This week:</strong> Secure your environment with help from someone you trust
                      </span>
                    </div>
                  </>
                )}
                {(hasGambling || hasAlcohol || hasSubstances) && (
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span>
                      <strong>Soon:</strong> Set up financial safeguards with an accountability partner
                    </span>
                  </div>
                )}
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span>
                    <strong>Ongoing:</strong> Connect with professional support and build your recovery network
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Accordion type="multiple" className="space-y-4">
            {safeguards.map((safeguard, safeguardIndex) => {
              const CategoryIcon = safeguard.icon
              return (
                <AccordionItem
                  key={safeguard.category}
                  value={`safeguard-${safeguardIndex}`}
                  className="border rounded-lg shadow-md overflow-hidden bg-card"
                >
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
                          <Card key={item.name} className="shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader>
                              <CardTitle className="flex items-center gap-3">
                                <ItemIcon className={`w-5 h-5 ${safeguard.color}`} />
                                {item.name}
                              </CardTitle>
                              <CardDescription className="text-base">{item.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div>
                                <h4 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">
                                  Implementation Steps:
                                </h4>
                                <ol className="space-y-2">
                                  {item.steps.map((step, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0 mt-0.5">
                                        {index + 1}
                                      </span>
                                      <span className="text-sm text-muted-foreground">{step}</span>
                                    </li>
                                  ))}
                                </ol>
                              </div>
                              {item.website && (
                                <a
                                  href={item.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                                >
                                  <Globe className="w-4 h-4" />
                                  Visit Website
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

          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-center">Crisis Support Resources</h2>
            <p className="text-center text-muted-foreground max-w-2xl mx-auto">
              If you're experiencing a crisis or need immediate support, these services are available to help you right
              now.
            </p>

            <Accordion type="multiple" className="space-y-4">
              {crisisResources.map((resource, index) => {
                const ResourceIcon = resource.icon
                return (
                  <AccordionItem
                    key={index}
                    value={`crisis-${index}`}
                    className={`border-2 rounded-lg overflow-hidden ${resource.borderColor} ${resource.bgColor}`}
                  >
                    <AccordionTrigger className="px-4 sm:px-6 py-4 hover:no-underline hover:bg-white/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <ResourceIcon className={`w-5 h-5 sm:w-6 sm:h-6 ${resource.color} flex-shrink-0`} />
                        <h3 className={`text-lg sm:text-xl font-bold text-left ${resource.color}`}>{resource.type}</h3>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 sm:px-6 pb-4">
                      <div className="space-y-4 pt-2">
                        {resource.resources.map((item, idx) => (
                          <div key={idx} className={`p-4 bg-white rounded-lg border ${resource.borderColor}`}>
                            <h4 className={`font-semibold ${resource.color} mb-2`}>{item.name}</h4>
                            <div className="space-y-1 text-sm">
                              {item.phone && (
                                <p>
                                  <strong>Phone:</strong>{" "}
                                  <a href={`tel:${item.phone.replace(/\s/g, "")}`} className="hover:underline">
                                    {item.phone}
                                  </a>
                                </p>
                              )}
                              {item.text && (
                                <p>
                                  <strong>Text:</strong> {item.text}
                                </p>
                              )}
                              {item.email && (
                                <p>
                                  <strong>Email:</strong>{" "}
                                  <a href={`mailto:${item.email}`} className="hover:underline">
                                    {item.email}
                                  </a>
                                </p>
                              )}
                              {item.website && (
                                <p>
                                  <strong>Website:</strong>{" "}
                                  <a
                                    href={item.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:underline text-primary"
                                  >
                                    {item.website}
                                  </a>
                                </p>
                              )}
                              <p>
                                <strong>Available:</strong> {item.availability}
                              </p>
                              <p className="text-muted-foreground mt-2">{item.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )
              })}
            </Accordion>
          </div>

          <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-900">
                <Phone className="w-5 h-5" />
                Need Help Right Now?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-orange-900">
              {hasMentalHealth && (
                <div className="space-y-2">
                  <p className="font-medium">Need to Talk? - 1737</p>
                  <div className="space-y-1 text-sm">
                    <p><strong>Call or Text:</strong> 1737 (24/7, free)</p>
                    <p className="text-xs text-orange-800">Free counselling support for anyone feeling distressed or just needing to talk.</p>
                  </div>
                </div>
              )}
              {hasGambling && (
                <div className="space-y-2">
                  <p className="font-medium">Problem Gambling Foundation of NZ</p>
                  <div className="space-y-1 text-sm">
                    <p><strong>Helpline:</strong> 0800 664 262 (24/7, free)</p>
                    <p><strong>Text:</strong> 8006 (24/7)</p>
                    <p className="text-xs text-orange-800">Free, confidential support including counselling, family support, and self-exclusion services.</p>
                  </div>
                </div>
              )}
              {(hasAlcohol || hasSubstances) && (
                <div className="space-y-2">
                  <p className="font-medium">Alcohol Drug Helpline</p>
                  <div className="space-y-1 text-sm">
                    <p><strong>Call:</strong> 0800 787 797 (24/7, free)</p>
                    <p><strong>Text:</strong> 8681 (24/7)</p>
                    <p className="text-xs text-orange-800">Free, confidential support for anyone concerned about their own or someone else's drinking or drug use.</p>
                  </div>
                </div>
              )}
              {hasGaming && (
                <div className="space-y-2">
                  <p className="font-medium">Youthline</p>
                  <div className="space-y-1 text-sm">
                    <p><strong>Call:</strong> 0800 376 633 (free)</p>
                    <p><strong>Text:</strong> 234 (free)</p>
                    <p className="text-xs text-orange-800">Support for young people dealing with compulsive behaviours and mental health challenges.</p>
                  </div>
                </div>
              )}
              {hasPersonalGrowth && !hasMentalHealth && !hasGambling && !hasAlcohol && !hasSubstances && !hasGaming && (
                <div className="space-y-2">
                  <p className="font-medium">Need to Talk? - 1737</p>
                  <div className="space-y-1 text-sm">
                    <p><strong>Call or Text:</strong> 1737 (24/7, free)</p>
                    <p className="text-xs text-orange-800">Free counselling support for anyone needing to talk.</p>
                  </div>
                </div>
              )}
              <p className="text-xs text-orange-700 mt-2 pt-2 border-t border-orange-200">
                All services are free, confidential, and available to anyone in New Zealand.
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
