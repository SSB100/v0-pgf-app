export const SUPPORT_RESOURCES_LAST_VERIFIED = "18 August 2026"

export const supportResources = {
  emergency: {
    name: "Emergency services",
    phone: "111",
    availability: "24/7",
    description:
      "If you or someone else is in immediate danger, call 111 or go to the nearest hospital emergency department.",
    sourceLabel: "Health New Zealand",
    sourceUrl: "https://www.wellbeingsupport.health.nz/need-urgent-help",
  },
  emotionalSupport: {
    name: "1737",
    phone: "1737",
    text: "1737",
    availability: "24/7",
    description:
      "Free, confidential brief emotional support by call or text from trained counsellors. Dedicated peer support by phone is available daily from 2pm to 10pm.",
    sourceLabel: "1737 / Whakarongorau Aotearoa",
    sourceUrl: "https://www.1737.org.nz/how-1737-works",
  },
  gamblingHelpline: {
    name: "Gambling Helpline",
    phone: "0800 654 655",
    text: "8006",
    availability: "24/7",
    description:
      "Free national support for people affected by gambling, including whānau and friends. Phone support is available 24 hours a day and free text support is available on 8006.",
    sourceLabel: "Gambling Helpline",
    sourceUrl: "https://gamblinghelpline.co.nz/about",
  },
  pgf: {
    name: "PGF Services",
    phone: "0800 664 262",
    text: "5819",
    availability: "8:30am–5:00pm Monday to Friday",
    description:
      "Free and confidential gambling-harm counselling and support. Duty counsellors are available during published service hours.",
    sourceLabel: "PGF Services",
    sourceUrl: "https://www.pgf.nz/getting-started",
  },
  alcoholDrug: {
    name: "Alcohol Drug Helpline",
    phone: "0800 787 797",
    text: "8681",
    availability: "24/7",
    description:
      "Free and confidential alcohol and other drug support from trained counsellors, 24 hours a day, 7 days a week.",
    sourceLabel: "Alcohol Drug Helpline",
    sourceUrl: "https://alcoholdrughelp.org.nz/directory",
  },
} as const

export type SupportResourceKey = keyof typeof supportResources
