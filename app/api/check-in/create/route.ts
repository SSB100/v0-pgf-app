import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getUserFromSession } from "@/lib/session"

const MAX_REFLECTION_LENGTH = 4000
const MAX_LIST_ITEMS = 30

function isIntegerInRange(value: unknown, min: number, max: number): value is number {
  return Number.isInteger(value) && Number(value) >= min && Number(value) <= max
}

function cleanOptionalText(value: unknown) {
  if (typeof value !== "string") return null
  const trimmed = value.trim()
  if (!trimmed) return null
  return trimmed.slice(0, MAX_REFLECTION_LENGTH)
}

function cleanStringList(value: unknown) {
  if (!Array.isArray(value)) return []
  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, MAX_LIST_ITEMS)
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromSession()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await request.json()
    const {
      moodRating,
      overallRating,
      urgeStrength,
      gamblingOccurred,
      alcoholOccurred,
      substanceOccurred,
      selfHarmThoughts,
      selfHarmActions,
    } = body

    if (!isIntegerInRange(moodRating, 1, 10)) {
      return NextResponse.json({ error: "Mood rating must be a whole number from 1 to 10" }, { status: 400 })
    }

    if (!isIntegerInRange(overallRating, 1, 10)) {
      return NextResponse.json({ error: "Overall rating must be a whole number from 1 to 10" }, { status: 400 })
    }

    if (!isIntegerInRange(urgeStrength, 0, 10)) {
      return NextResponse.json({ error: "Urge strength must be a whole number from 0 to 10" }, { status: 400 })
    }

    const booleanFields = [gamblingOccurred, alcoholOccurred, substanceOccurred, selfHarmThoughts, selfHarmActions]
    if (booleanFields.some((value) => typeof value !== "boolean")) {
      return NextResponse.json({ error: "Invalid check-in response" }, { status: 400 })
    }

    const skillsUsed = cleanStringList(body.skillsUsed)
    const emotionsFelt = cleanStringList(body.emotionsFelt)
    const strongestEmotion = cleanOptionalText(body.strongestEmotion)

    if (strongestEmotion && emotionsFelt.length > 0 && !emotionsFelt.includes(strongestEmotion)) {
      return NextResponse.json({ error: "Strongest emotion must be one of the emotions you selected" }, { status: 400 })
    }

    const existingCheckIn = await sql`
      SELECT id
      FROM daily_checkins
      WHERE user_id = ${user.id}::uuid AND date = CURRENT_DATE
      LIMIT 1
    `

    if (existingCheckIn.length > 0) {
      return NextResponse.json(
        {
          error: "You've already completed your daily check-in today",
          message: "One check-in can be recorded per day in the current MVP",
        },
        { status: 409 },
      )
    }

    const occurred = gamblingOccurred || alcoholOccurred || substanceOccurred || selfHarmActions

    const userProfile = await sql`
      SELECT check_in_streak, last_check_in_date, longest_streak, level_credits, total_points_earned
      FROM user_profiles
      WHERE user_id = ${user.id}::uuid
    `

    const currentStreak = userProfile[0]?.check_in_streak || 0
    const lastCheckInDate = userProfile[0]?.last_check_in_date
    const longestStreak = userProfile[0]?.longest_streak || 0
    const currentLevelCredits = userProfile[0]?.level_credits || 0
    const totalPointsEarned = userProfile[0]?.total_points_earned || 0

    let newStreak = 1
    let streakBroken = false

    if (lastCheckInDate) {
      const lastCheckInDay = new Date(lastCheckInDate)
      lastCheckInDay.setHours(0, 0, 0, 0)
      const todayDay = new Date()
      todayDay.setHours(0, 0, 0, 0)

      const daysDifference = Math.floor((todayDay.getTime() - lastCheckInDay.getTime()) / (1000 * 60 * 60 * 24))
      if (daysDifference === 0) newStreak = currentStreak
      else if (daysDifference === 1) newStreak = currentStreak + 1
      else if (daysDifference > 1) {
        newStreak = 1
        streakBroken = currentStreak > 0
      }
    }

    const newLongestStreak = Math.max(longestStreak, newStreak)
    const newLevelCredits = currentLevelCredits + 1
    const newTotalPoints = totalPointsEarned + 1

    await sql`
      INSERT INTO daily_checkins (
        user_id,
        date,
        mood_rating,
        overall_rating,
        urge_strength,
        behavior_occurred,
        gambling_occurred,
        alcohol_occurred,
        substance_occurred,
        self_harm_thoughts,
        self_harm_actions,
        skills_used,
        bad_things,
        good_things,
        emotions_felt,
        strongest_emotion,
        emotion_context
      )
      VALUES (
        ${user.id}::uuid,
        CURRENT_DATE,
        ${moodRating},
        ${overallRating},
        ${urgeStrength},
        ${occurred},
        ${gamblingOccurred},
        ${alcoholOccurred},
        ${substanceOccurred},
        ${selfHarmThoughts},
        ${selfHarmActions},
        ${JSON.stringify(skillsUsed)}::jsonb,
        ${cleanOptionalText(body.badThings)},
        ${cleanOptionalText(body.goodThings)},
        ${emotionsFelt.length > 0 ? emotionsFelt : null},
        ${strongestEmotion},
        ${cleanOptionalText(body.emotionContext)}
      )
    `

    const problemTypes: string[] = []
    if (gamblingOccurred) problemTypes.push("gambling")
    if (alcoholOccurred) problemTypes.push("alcohol")
    if (substanceOccurred) problemTypes.push("substances")
    if (selfHarmActions) problemTypes.push("mental_health")

    for (const problemType of problemTypes) {
      await sql`
        UPDATE problem_areas
        SET last_occurrence_date = CURRENT_DATE,
            last_bet_date = CASE WHEN ${problemType} = 'gambling' THEN CURRENT_DATE ELSE last_bet_date END
        WHERE user_id = ${user.id}::uuid AND problem_type = ${problemType}
      `
    }

    await sql`
      UPDATE user_profiles
      SET
        check_in_streak = ${newStreak},
        last_check_in_date = CURRENT_TIMESTAMP,
        longest_streak = ${newLongestStreak},
        level_credits = ${newLevelCredits},
        total_points_earned = ${newTotalPoints}
      WHERE user_id = ${user.id}::uuid
    `

    for (const skill of skillsUsed) {
      await sql`
        INSERT INTO skills_practice (user_id, skill_name, skill_category, practiced_at)
        VALUES (${user.id}::uuid, ${skill}, 'self-reported', CURRENT_TIMESTAMP)
      `
    }

    return NextResponse.json({
      success: true,
      streak: newStreak,
      levelCreditsAwarded: 1,
      totalLevelCredits: newLevelCredits,
      streakBroken,
    })
  } catch (error) {
    console.error("[v0] Check-in creation error:", error)
    return NextResponse.json({ error: "Failed to create check-in" }, { status: 500 })
  }
}
