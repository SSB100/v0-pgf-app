export const GAMBLING_PROTECTION_INFO_LAST_VERIFIED = "27 August 2026"

export const GAMBLING_PROTECTION_KEYS = [
  "device-blocking",
  "venue-self-exclusion",
  "online-account-controls",
  "bank-payment-block",
  "money-support-friction",
] as const

export type GamblingProtectionKey = (typeof GAMBLING_PROTECTION_KEYS)[number]

export type GamblingProtectionLink = {
  label: string
  href: string
}

export type GamblingProtectionItem = {
  key: GamblingProtectionKey
  title: string
  summary: string
  whyItHelps: string
  steps: string[]
  note?: string
  links: GamblingProtectionLink[]
}

export const GAMBLING_PROTECTION_ITEMS: GamblingProtectionItem[] = [
  {
    key: "device-blocking",
    title: "Add blocking on the devices you use",
    summary: "Put an extra barrier between an urge and gambling websites or apps.",
    whyItHelps:
      "Blocking software can create useful friction in a fast-moving urge. It works best as one layer alongside account, payment and support safeguards rather than as a guarantee that every gambling service is inaccessible.",
    steps: [
      "List the phones, tablets and computers you normally use to access gambling.",
      "Choose a blocking tool that supports those devices and read the provider's current setup and restriction terms before activating it.",
      "Install it on each relevant device and choose the restriction settings that fit what you want to change.",
      "Test the setup afterwards. If a gambling site remains accessible, use the provider's support or reporting process rather than assuming the block covers every site.",
    ],
    note:
      "BetBlocker is one current free option and says no registration is required. Safer Gambling Aotearoa also lists BetBlocker, Gamban and Gamblock. These are independent third-party services, not Waypoint services or endorsements.",
    links: [
      { label: "Safer Gambling Aotearoa: online safety tools", href: "https://www.safergambling.org.nz/taking-action/staying-in-control" },
      { label: "BetBlocker", href: "https://betblocker.org/" },
    ],
  },
  {
    key: "venue-self-exclusion",
    title: "Set up venue or multi-venue self-exclusion",
    summary: "Ask gambling venues to exclude you, or get help arranging exclusion from several venues at once.",
    whyItHelps:
      "Self-exclusion can turn a decision you make now into a practical barrier later, when an urge may be stronger. In Aotearoa New Zealand, venue exclusion and multi-venue exclusion processes are available for gambling venues.",
    steps: [
      "Identify the casinos, pubs, clubs, hotels or TAB locations where you are most likely to gamble or feel at risk.",
      "Ask venue staff about self-exclusion, or contact a gambling-harm service and ask for help with multi-venue exclusion in your area.",
      "Be ready to provide the identification, photo or other information required for the exclusion process.",
      "Keep any confirmation or paperwork you receive and check the terms and duration that apply to your exclusion.",
    ],
    note:
      "You do not have to work through every venue alone. Safer Gambling Aotearoa and PGF describe support through counsellors and multi-venue exclusion coordinators.",
    links: [
      { label: "Safer Gambling Aotearoa: self-exclusion", href: "https://www.safergambling.org.nz/taking-action/staying-in-control" },
      { label: "PGF: self-exclusion information", href: "https://www.pgf.nz/pgf-prod/downloads/self-exclusion-fact-sheet.pdf" },
      { label: "Department of Internal Affairs guidance", href: "https://www.dia.govt.nz/diawebsite.nsf/wpg_URL/Services-Casino-and-Non-Casino-Gaming-Exclusion-Order-%28Problem-Gamblers%29-Guidelines" },
    ],
  },
  {
    key: "online-account-controls",
    title: "Close, exclude or restrict online gambling accounts",
    summary: "Use the strongest account controls that match the change you want to make.",
    whyItHelps:
      "Removing an existing account, saved login or easy deposit path can make returning to gambling less automatic. Operators offer different controls, so the exact option and duration need to be checked with each service.",
    steps: [
      "Make a list of the gambling accounts and apps you currently use or are likely to return to.",
      "Open each service's responsible-gambling or account-controls area and look for self-exclusion, account closure, time-out or other access controls.",
      "Choose the option that fits your goal and read what it covers before confirming it.",
      "Remove gambling apps, saved logins and saved payment details where doing so would reduce easy access.",
    ],
    note:
      "Safer Gambling Aotearoa notes that TAB and Lotto NZ have their own exclusion options and that many online gambling operators provide time-out or self-exclusion controls. Coverage differs between services.",
    links: [
      { label: "Safer Gambling Aotearoa: online and venue exclusion", href: "https://www.safergambling.org.nz/taking-action/staying-in-control" },
    ],
  },
  {
    key: "bank-payment-block",
    title: "Ask your bank about a gambling-payment block",
    summary: "Add a payment barrier where your bank currently supports one.",
    whyItHelps:
      "A bank block can stop some gambling transactions before money leaves your card or account. These controls depend on how a transaction is classified, so they should be treated as another layer rather than a complete block on every possible payment route.",
    steps: [
      "Check your bank's current app, website, phone support or branch options for gambling controls.",
      "If a gambling block is available, ask what cards or accounts it covers, what kinds of transactions it can identify and how removal works.",
      "Turn the block on for the relevant cards or accounts if it fits your goals.",
      "Review other payment routes and saved cards as well, because a bank block may not identify every gambling-related transaction.",
    ],
    note:
      "Westpac NZ and Kiwibank currently publish voluntary gambling-block options. Safer Gambling Aotearoa also directs people to bank card controls. Features can change, so check your own bank's current instructions rather than assuming every bank works the same way.",
    links: [
      { label: "Westpac NZ: gambling account block", href: "https://www.westpac.co.nz/about-us/media/westpac-nz-introduces-gambling-account-block-to-support-customers/" },
      { label: "Kiwibank: gambling block option", href: "https://www.kiwibank.co.nz/about-us/news-and-updates/media-releases/2021-04-13-kiwibank-introduces-gambling-block-option/" },
      { label: "Safer Gambling Aotearoa: bank controls", href: "https://www.safergambling.org.nz/taking-action/staying-in-control" },
    ],
  },
  {
    key: "money-support-friction",
    title: "Create extra friction around money and high-risk moments",
    summary: "Make the situations where gambling usually happens a little harder to act on automatically.",
    whyItHelps:
      "Practical changes around money, routines and support can create time for a different choice. The aim is not to hand over control of your finances unless that is something you freely choose and understand.",
    steps: [
      "Remove saved payment methods from gambling services and turn on transaction or spending alerts if they would help you notice activity earlier.",
      "Notice high-risk times such as payday, being alone, drinking, stress or particular routes and venues, then choose one practical change for those situations.",
      "If you want support from another person, agree clearly on what help you want, what they can see or do, and how you can change that arrangement.",
      "Add the Gambling Helpline, PGF or another support service to your contacts so help is easier to reach when an urge is strong.",
    ],
    note:
      "A small safeguard that you will actually use can be more useful than a long list that becomes another task. You can change this checklist at any time.",
    links: [
      { label: "PGF: getting started", href: "https://www.pgf.nz/getting-started" },
      { label: "Gambling Helpline", href: "https://gamblinghelpline.co.nz/about" },
    ],
  },
]

export function isGamblingProtectionKey(value: unknown): value is GamblingProtectionKey {
  return typeof value === "string" && (GAMBLING_PROTECTION_KEYS as readonly string[]).includes(value)
}
