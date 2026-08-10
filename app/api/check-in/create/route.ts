import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { getUserFromSession } from "@/lib/session"

const sql = neon(process.env.NEON_DATABASE_URL!)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      userId,
      moodRating,
      overallRating,
      urgeStrength,
      behaviorOccurred,
      gamblingOccurred,
      alcoholOccurred,
      substanceOccurred,
      selfHarmThoughts,
      selfHarmActions,
      skillsUsed,
      badThings,
      goodThings,
      emotionsFelt,
      strongestEmotion,
      emotionContext,
    } = body

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Verify user is authenticated by checking session
    const user = await getUserFromSession()
    if (!user || user.id !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const existingCheckIn = await sql`
      SELECT id, created_at FROM daily_checkins
      WHERE user_id = ${userId}::uuid AND date = CURRENT_DATE
      LIMIT 1
    `

    if (existingCheckIn && existingCheckIn.length > 0) {
      console.log("[v0] Check-in already exists for today for user", userId)
      return NextResponse.json(
        {
          error: "You've already completed your daily check-in today",
          message: "You can only earn level points once per day from check-ins",
        },
        { status: 400 },
      )
    }

    const occurred =
      behaviorOccurred !== undefined
        ? behaviorOccurred
        : gamblingOccurred || alcoholOccurred || substanceOccurred || selfHarmActions || false

    if (moodRating === undefined || moodRating === null) {
      return NextResponse.json({ error: "Mood rating is required" }, { status: 400 })
    }

    if (urgeStrength === undefined || urgeStrength === null) {
      return NextResponse.json({ error: "Urge strength is required" }, { status: 400 })
    }

    const userProfile = await sql`
      SELECT check_in_streak, last_check_in_date, longest_streak, level_credits, total_points_earned
      FROM user_profiles
      WHERE user_id = ${userId}::uuid
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

      if (daysDifference === 0) {
        newStreak = currentStreak
      } else if (daysDifference === 1) {
        newStreak = currentStreak + 1
      } else if (daysDifference > 1) {
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
        ${userId}::uuid,
        CURRENT_DATE,
        ${moodRating},
        ${overallRating || null},
        ${urgeStrength},
        ${occurred},
        ${gamblingOccurred || false},
        ${alcoholOccurred || false},
        ${substanceOccurred || false},
        ${selfHarmThoughts || false},
        ${selfHarmActions || false},
        ${JSON.stringify(skillsUsed)}::jsonb,
        ${badThings || null},
        ${goodThings || null},
        ${emotionsFelt && emotionsFelt.length > 0 ? emotionsFelt : null},
        ${strongestEmotion || null},
        ${emotionContext || null}
      )
    `

    if (occurred) {
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
          WHERE user_id = ${userId}::uuid AND problem_type = ${problemType}
        `
      }
    }

    await sql`
      UPDATE user_profiles
      SET 
        check_in_streak = ${newStreak},
        last_check_in_date = CURRENT_TIMESTAMP,
        longest_streak = ${newLongestStreak},
        level_credits = ${newLevelCredits},
        total_points_earned = ${newTotalPoints}
      WHERE user_id = ${userId}::uuid
    `

    if (skillsUsed && skillsUsed.length > 0) {
      for (const skill of skillsUsed) {
        await sql`
          INSERT INTO skills_practice (user_id, skill_name, skill_category, practiced_at)
          VALUES (${userId}::uuid, ${skill}, 'DBT', CURRENT_TIMESTAMP)
        `
      }
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
    return NextResponse.json(
      {
        error: "Failed to create check-in",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
