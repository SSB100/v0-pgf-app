import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { getSession } from "@/lib/session"
import { getAotearoaDateKey } from "@/lib/aotearoa-date"

const db = neon(process.env.NEON_DATABASE_URL!)

const ALLOWED_JOURNEY_TYPES = new Set([
  "gambling",
  "alcohol",
  "substances",
  "gaming",
  "mental_health",
  "personal_growth",
])

const ALLOWED_AVATARS = new Set([
  "growth_tree",
  "rising_phoenix",
  "dragon_hatchling",
  "crystal_sentinel",
  "spirit_fox",
])

const MAX_PAYLOAD_BYTES = 100_000
const MAX_TEXT_LENGTH = 4_000
const MAX_SHORT_TEXT_LENGTH = 200
const MAX_LIST_ITEMS = 50

class InputError extends Error {}

function cleanText(value: unknown, maxLength = MAX_TEXT_LENGTH): string | null {
  if (typeof value !== "string") return null
  const trimmed = value.trim()
  if (!trimmed) return null
  return trimmed.slice(0, maxLength)
}

function cleanStringList(value: unknown, maxItems = MAX_LIST_ITEMS, maxLength = MAX_SHORT_TEXT_LENGTH): string[] {
  if (!Array.isArray(value)) return []
  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim().slice(0, maxLength))
    .filter(Boolean)
    .slice(0, maxItems)
}

function cleanOptionalDate(value: unknown, fieldName: string): string | null {
  if (value === null || value === undefined || value === "") return null
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new InputError(`${fieldName} must be a valid date`)
  }

  const [year, month, day] = value.split("-").map(Number)
  const parsed = new Date(Date.UTC(year, month - 1, day))
  if (
    parsed.getUTCFullYear() !== year ||
    parsed.getUTCMonth() !== month - 1 ||
    parsed.getUTCDate() !== day ||
    value > getAotearoaDateKey()
  ) {
    throw new InputError(`${fieldName} must be a valid date that is not in the future`)
  }

  return value
}

function normaliseSelectedValues(value: unknown) {
  if (!Array.isArray(value)) return []

  const values = value.slice(0, 30).map((entry) => {
    if (typeof entry === "string") {
      return { name: entry.trim().slice(0, 100), category: "personal" }
    }

    if (typeof entry === "object" && entry !== null) {
      const record = entry as Record<string, unknown>
      return {
        name: cleanText(record.name, 100) || "",
        category: cleanText(record.category, 50) || "personal",
      }
    }

    return { name: "", category: "personal" }
  }).filter((entry) => entry.name)

  const seen = new Set<string>()
  return values.filter((entry) => {
    const key = entry.name.toLowerCase()
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

export async function POST(request: NextRequest) {
  try {
    const user = await getSession()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
    }

    if (typeof body !== "object" || body === null || !("data" in body)) {
      return NextResponse.json({ error: "Onboarding data is required" }, { status: 400 })
    }

    const rawData = (body as { data: unknown }).data
    if (typeof rawData !== "object" || rawData === null) {
      return NextResponse.json({ error: "Onboarding data is required" }, { status: 400 })
    }

    const serialized = JSON.stringify(rawData)
    if (Buffer.byteLength(serialized, "utf8") > MAX_PAYLOAD_BYTES) {
      return NextResponse.json({ error: "Onboarding data is too large" }, { status: 413 })
    }

    const data = rawData as Record<string, any>
    const journeyTypes = cleanStringList(data.journeyTypes, 10, 50)
    if (journeyTypes.length === 0 || journeyTypes.some((type) => !ALLOWED_JOURNEY_TYPES.has(type))) {
      throw new InputError("Please select at least one valid Waypoint focus area")
    }

    const selectedValues = normaliseSelectedValues(data.selectedValues)
    const currentEmotions = cleanStringList(data.currentEmotions, 30, 100)
    const strongestEmotion = cleanText(data.strongestEmotion, 100)
    if (strongestEmotion && currentEmotions.length > 0 && !currentEmotions.includes(strongestEmotion)) {
      throw new InputError("Strongest emotion must be one of the emotions selected")
    }

    const gamblingTriggers = cleanStringList(data.gamblingTriggers)
    const gamblingImpactAreas = cleanStringList(data.impactAreas)
    const gamblingForms = cleanStringList(data.gamblingForms)
    const mostUsedGamblingForms = cleanStringList(data.mostUsedGamblingForms)

    const alcoholTriggers = cleanStringList(data.alcoholTriggers)
    const alcoholImpactAreas = cleanStringList(data.alcoholImpactAreas)
    const drinkingTypes = cleanStringList(data.drinkingTypes)

    const substanceTriggers = cleanStringList(data.substanceTriggers)
    const substanceImpactAreas = cleanStringList(data.substanceImpactAreas)
    const substanceTypes = cleanStringList(data.substanceTypes)

    const mentalHealthAreas = cleanStringList(data.mentalHealthAreas)
    const mentalHealthSupportNeeds = cleanStringList(data.mentalHealthSupportNeeds)
    const copingMethods = cleanStringList(data.currentCopingMethods)

    const growthGoals = cleanStringList(data.growthGoals)
    const growthChallenges = cleanStringList(data.growthChallenges)
    const choicePoints = cleanStringList(data.recognizedChoicePoints, 30, 500)
    const perceivedStrengths = cleanStringList(data.perceivedStrengths, 50, 100)
    const identifiedStrengths = cleanStringList(data.identifiedStrengths, 50, 100)

    const lastBetDate = cleanOptionalDate(data.lastBetDate, "Last gambling date")
    const lastDrinkDate = cleanOptionalDate(data.lastDrinkDate, "Last alcohol-use date")
    const lastSubstanceDate = cleanOptionalDate(data.lastSubstanceDate, "Last substance-use date")

    const growthAvatar = ALLOWED_AVATARS.has(data.growthAvatar) ? data.growthAvatar : "growth_tree"
    const stillExperiencing = typeof data.stillExperiencing === "boolean" ? data.stillExperiencing : null

    const gamblingFrequency = cleanText(data.gamblingFrequency, 100)
    const alcoholFrequency = cleanText(data.alcoholFrequency, 100)
    const substanceFrequency = cleanText(data.substanceFrequency, 100)
    const mentalHealthFrequency = cleanText(data.mentalHealthFrequency, 100)
    const growthMotivation = cleanText(data.growthMotivation, 100)

    const queries: any[] = []

    // Guarantee a profile row exists, then replace all onboarding-derived records
    // atomically. Daily check-ins and other post-onboarding history are untouched.
    queries.push(db`
      INSERT INTO user_profiles (user_id)
      VALUES (${user.id})
      ON CONFLICT (user_id) DO NOTHING
    `)
    queries.push(db`DELETE FROM user_values WHERE user_id = ${user.id}`)
    queries.push(db`DELETE FROM awareness_checkins WHERE user_id = ${user.id}`)
    queries.push(db`DELETE FROM problem_areas WHERE user_id = ${user.id}`)

    if (currentEmotions.length > 0) {
      const awarenessEmotion = strongestEmotion || currentEmotions[0]
      const experienceNote = stillExperiencing === null
        ? "Initial onboarding reflection. Whether the emotion was still present was not recorded."
        : `Initial onboarding reflection. Emotion still present at the time: ${stillExperiencing ? "Yes" : "No"}.`

      queries.push(db`
        INSERT INTO awareness_checkins (
          user_id, emotion, all_emotions, strongest_emotion,
          situation_context, urge_description, notes
        )
        VALUES (
          ${user.id},
          ${awarenessEmotion},
          ${JSON.stringify(currentEmotions)}::jsonb,
          ${awarenessEmotion},
          ${cleanText(data.situationDescription)},
          ${cleanText(data.selfTalk)},
          ${experienceNote}
        )
      `)
    }

    selectedValues.forEach((value, index) => {
      queries.push(db`
        INSERT INTO user_values (user_id, value_name, category, is_core_value, rank)
        VALUES (${user.id}, ${value.name}, ${value.category}, true, ${index + 1})
      `)
    })

    if (journeyTypes.includes("gambling") && (gamblingTriggers.length > 0 || gamblingFrequency)) {
      queries.push(db`
        INSERT INTO problem_areas (
          user_id, problem_type, triggers, patterns, last_bet_date,
          gambling_forms, most_used_forms, illegal_gambling, frequency,
          last_occurrence_date, specific_types, impact_areas
        )
        VALUES (
          ${user.id},
          'gambling',
          ${JSON.stringify(gamblingTriggers)}::jsonb,
          ${`Frequency: ${gamblingFrequency || "Not specified"}. Impact areas: ${gamblingImpactAreas.join(", ") || "Not specified"}`},
          ${lastBetDate},
          ${JSON.stringify(gamblingForms)}::jsonb,
          ${JSON.stringify(mostUsedGamblingForms)}::jsonb,
          ${cleanText(data.illegalGambling, 100)},
          ${gamblingFrequency},
          ${lastBetDate},
          ${JSON.stringify(gamblingForms)}::jsonb,
          ${JSON.stringify(gamblingImpactAreas)}::jsonb
        )
      `)
    }

    if (journeyTypes.includes("alcohol") && (alcoholTriggers.length > 0 || alcoholFrequency)) {
      queries.push(db`
        INSERT INTO problem_areas (
          user_id, problem_type, triggers, patterns, frequency,
          last_occurrence_date, specific_types, impact_areas
        )
        VALUES (
          ${user.id},
          'alcohol',
          ${JSON.stringify(alcoholTriggers)}::jsonb,
          ${`Frequency: ${alcoholFrequency || "Not specified"}. Types: ${drinkingTypes.join(", ") || "Not specified"}`},
          ${alcoholFrequency},
          ${lastDrinkDate},
          ${JSON.stringify(drinkingTypes)}::jsonb,
          ${JSON.stringify(alcoholImpactAreas)}::jsonb
        )
      `)
    }

    if (journeyTypes.includes("substances") && (substanceTriggers.length > 0 || substanceFrequency)) {
      queries.push(db`
        INSERT INTO problem_areas (
          user_id, problem_type, triggers, patterns, frequency,
          last_occurrence_date, specific_types, impact_areas
        )
        VALUES (
          ${user.id},
          'substances',
          ${JSON.stringify(substanceTriggers)}::jsonb,
          ${`Frequency: ${substanceFrequency || "Not specified"}. Types: ${substanceTypes.join(", ") || "Not specified"}`},
          ${substanceFrequency},
          ${lastSubstanceDate},
          ${JSON.stringify(substanceTypes)}::jsonb,
          ${JSON.stringify(substanceImpactAreas)}::jsonb
        )
      `)
    }

    if (journeyTypes.includes("mental_health") && mentalHealthAreas.length > 0) {
      queries.push(db`
        INSERT INTO problem_areas (
          user_id, problem_type, triggers, patterns, frequency,
          specific_types, impact_areas
        )
        VALUES (
          ${user.id},
          'mental_health',
          ${JSON.stringify(copingMethods)}::jsonb,
          ${`Frequency: ${mentalHealthFrequency || "Not specified"}. Treatment: ${cleanText(data.receivingMentalHealthTreatment, 100) || "Not specified"}`},
          ${mentalHealthFrequency},
          ${JSON.stringify(mentalHealthAreas)}::jsonb,
          ${JSON.stringify(mentalHealthSupportNeeds)}::jsonb
        )
      `)
    }

    if (journeyTypes.includes("personal_growth") && growthGoals.length > 0) {
      queries.push(db`
        INSERT INTO problem_areas (
          user_id, problem_type, triggers, patterns, frequency,
          specific_types, impact_areas
        )
        VALUES (
          ${user.id},
          'personal_growth',
          ${JSON.stringify(growthChallenges)}::jsonb,
          ${`Motivation: ${growthMotivation || "Not specified"}`},
          ${growthMotivation},
          ${JSON.stringify(growthGoals)}::jsonb,
          ${JSON.stringify(growthChallenges)}::jsonb
        )
      `)
    }

    queries.push(db`
      UPDATE user_profiles
      SET
        onboarding_completed = true,
        journey_types = ${JSON.stringify(journeyTypes)}::jsonb,
        growth_avatar = ${growthAvatar},
        choice_points = ${JSON.stringify(choicePoints)}::jsonb,
        perceived_strengths = ${JSON.stringify(perceivedStrengths)}::jsonb,
        identified_strengths = ${JSON.stringify(identifiedStrengths)}::jsonb,
        strengths_completed = ${perceivedStrengths.length > 0 || identifiedStrengths.length > 0},
        self_harm_thoughts = ${cleanText(data.selfHarmThoughts, 100)},
        self_harm_actions = ${cleanText(data.selfHarmActions, 100)},
        suicidal_thoughts = ${cleanText(data.suicidalThoughts, 100)},
        alcohol_use = ${cleanText(data.alcoholUse, 100) || alcoholFrequency},
        alcohol_frequency = ${alcoholFrequency},
        last_drink_date = ${lastDrinkDate},
        drinking_types = ${JSON.stringify(drinkingTypes)}::jsonb,
        alcohol_triggers = ${JSON.stringify(alcoholTriggers)}::jsonb,
        alcohol_impact_areas = ${JSON.stringify(alcoholImpactAreas)}::jsonb,
        drug_use = ${cleanText(data.drugUse, 100) || substanceFrequency},
        substance_frequency = ${substanceFrequency},
        last_substance_date = ${lastSubstanceDate},
        substance_types = ${JSON.stringify(substanceTypes)}::jsonb,
        substance_triggers = ${JSON.stringify(substanceTriggers)}::jsonb,
        substance_impact_areas = ${JSON.stringify(substanceImpactAreas)}::jsonb,
        substance_gambling_link = ${cleanText(data.substanceGamblingLink, 500)},
        substance_mental_health_link = ${cleanText(data.substanceMentalHealthLink, 500)},
        mental_health_areas = ${JSON.stringify(mentalHealthAreas)}::jsonb,
        mental_health_frequency = ${mentalHealthFrequency},
        coping_methods = ${JSON.stringify(copingMethods)}::jsonb,
        mental_health_support_needs = ${JSON.stringify(mentalHealthSupportNeeds)}::jsonb,
        receiving_treatment = ${cleanText(data.receivingMentalHealthTreatment, 100)},
        growth_goals = ${JSON.stringify(growthGoals)}::jsonb,
        growth_motivation = ${growthMotivation},
        growth_challenges = ${JSON.stringify(growthChallenges)}::jsonb,
        plays_video_games = ${typeof data.playsVideoGames === "boolean" ? data.playsVideoGames : null},
        gaming_frequency = ${cleanText(data.gamingFrequency, 100)},
        gaming_impact = ${cleanText(data.gamingImpact, 100)},
        loot_box_exposure = ${cleanText(data.lootBoxExposure, 100)},
        in_game_purchases = ${cleanText(data.inGamePurchases, 100)},
        onboarding_current_step = NULL,
        onboarding_data = NULL,
        updated_at = NOW()
      WHERE user_id = ${user.id}
      RETURNING user_id
    `)

    await db.transaction(queries)

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof InputError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    console.error("[v0] Onboarding completion error:", error)
    return NextResponse.json({ error: "Failed to complete onboarding" }, { status: 500 })
  }
}
