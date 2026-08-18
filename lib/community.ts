export const COMMUNITY_JOURNEY_LABELS = {
  gambling: "Gambling",
  alcohol: "Alcohol",
  substances: "Substance Use",
  gaming: "Gaming or Internet",
  mental_health: "Mental Wellbeing",
  personal_growth: "Personal Growth",
} as const

export type CommunityJourneyType = keyof typeof COMMUNITY_JOURNEY_LABELS

export function isCommunityJourneyType(value: unknown): value is CommunityJourneyType {
  return typeof value === "string" && value in COMMUNITY_JOURNEY_LABELS
}

export function communityGroupName(journeyType: CommunityJourneyType) {
  return `${COMMUNITY_JOURNEY_LABELS[journeyType]} Peer Group`
}

export function communityGroupDescription(journeyType: CommunityJourneyType) {
  return `Peer discussion for people using Waypoint with a ${COMMUNITY_JOURNEY_LABELS[journeyType].toLowerCase()} focus.`
}
