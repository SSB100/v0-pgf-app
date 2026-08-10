import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { userId, data } = await request.json()

    console.log("[v0] Processing onboarding completion for user:", userId)
    console.log("[v0] Journey types:", data.journeyTypes)

    try {
      await sql`SELECT last_bet_date FROM problem_areas LIMIT 0`
    } catch (error) {
      console.error("[v0] Database schema issue detected. Please run migration at /api/setup/migrate-db")
      return NextResponse.json(
        {
          error: "Database schema needs migration",
          details: "Please contact support or run database migration",
        },
        { status: 500 },
      )
    }

    try {
      // Delete any existing onboarding data first to prevent duplicates
      await sql`DELETE FROM user_values WHERE user_id = ${userId}`
      await sql`DELETE FROM awareness_checkins WHERE user_id = ${userId}`
      await sql`DELETE FROM problem_areas WHERE user_id = ${userId}`
      await sql`DELETE FROM daily_checkins WHERE user_id = ${userId}`
    } catch (error) {
      console.error("[v0] Error deleting existing onboarding data:", error)
      throw new Error(`Existing data deletion failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    }

    // Save awareness check-in
    try {
      if (data.currentEmotions && data.currentEmotions.length > 0) {
        await sql`
          INSERT INTO awareness_checkins (
            user_id, emotion, all_emotions, strongest_emotion, 
            situation_context, urge_description, notes
          )
          VALUES (
            ${userId}, 
            ${data.strongestEmotion || data.currentEmotions[0]}, 
            ${JSON.stringify(data.currentEmotions)}::jsonb,
            ${data.strongestEmotion || data.currentEmotions[0]},
            ${data.situationDescription || null}, 
            ${data.selfTalk || null},
            ${`Initial onboarding check-in. Still experiencing: ${data.stillExperiencing ? "Yes" : "No"}`}
          )
        `
        console.log("[v0] Saved awareness check-in with all emotions")
      }
    } catch (error) {
      console.error("[v0] Error saving awareness check-in:", error)
      throw new Error(`Awareness check-in failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    }

    // Save core values with ranking
    try {
      if (data.selectedValues && data.selectedValues.length > 0) {
        for (let i = 0; i < data.selectedValues.length; i++) {
          const value = data.selectedValues[i]
          const rank = i + 1

          await sql`
            INSERT INTO user_values (user_id, value_name, category, is_core_value, rank)
            VALUES (
              ${userId}, 
              ${value.name || value}, 
              ${value.category || "personal"}, 
              true,
              ${rank}
            )
          `
        }
        console.log("[v0] Saved", data.selectedValues.length, "core values with rank order")
      }
    } catch (error) {
      console.error("[v0] Error saving values:", error)
      throw new Error(`Values save failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    }

    // Save gambling-specific problem area
    const journeyTypes = data.journeyTypes || []

    try {
      if (journeyTypes.includes("gambling") && (data.gamblingTriggers || data.gamblingFrequency)) {
        const triggers = Array.isArray(data.gamblingTriggers) ? data.gamblingTriggers : []
        const impactAreas = Array.isArray(data.impactAreas) ? data.impactAreas : []
        const gamblingForms = Array.isArray(data.gamblingForms) ? data.gamblingForms : []
        const mostUsedForms = Array.isArray(data.mostUsedGamblingForms) ? data.mostUsedGamblingForms : []

        await sql`
          INSERT INTO problem_areas (
            user_id, 
            problem_type, 
            triggers, 
            patterns, 
            last_bet_date,
            gambling_forms,
            most_used_forms,
            illegal_gambling,
            frequency,
            last_occurrence_date,
            specific_types,
            impact_areas
          )
          VALUES (
            ${userId}, 
            'gambling',
            ${JSON.stringify(triggers)}::jsonb,
            ${`Frequency: ${data.gamblingFrequency || "Not specified"}. Impact areas: ${impactAreas.join(", ") || "Not specified"}`},
            ${data.lastBetDate || null},
            ${JSON.stringify(gamblingForms)}::jsonb,
            ${JSON.stringify(mostUsedForms)}::jsonb,
            ${data.illegalGambling || null},
            ${data.gamblingFrequency || null},
            ${data.lastBetDate || null},
            ${JSON.stringify(gamblingForms)}::jsonb,
            ${JSON.stringify(impactAreas)}::jsonb
          )
        `
        console.log("[v0] Saved gambling problem area")
      }
    } catch (error) {
      console.error("[v0] Error saving gambling problem area:", error)
      throw new Error(`Gambling problem area save failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    }

    // Save alcohol-specific problem area
    try {
      if (journeyTypes.includes("alcohol") && (data.alcoholTriggers || data.alcoholFrequency)) {
        const triggers = Array.isArray(data.alcoholTriggers) ? data.alcoholTriggers : []
        const impactAreas = Array.isArray(data.alcoholImpactAreas) ? data.alcoholImpactAreas : []
        const drinkingTypes = Array.isArray(data.drinkingTypes) ? data.drinkingTypes : []

        await sql`
          INSERT INTO problem_areas (
            user_id, 
            problem_type, 
            triggers, 
            patterns,
            frequency,
            last_occurrence_date,
            specific_types,
            impact_areas
          )
          VALUES (
            ${userId}, 
            'alcohol',
            ${JSON.stringify(triggers)}::jsonb,
            ${`Frequency: ${data.alcoholFrequency || "Not specified"}. Types: ${drinkingTypes.join(", ") || "Not specified"}`},
            ${data.alcoholFrequency || null},
            ${data.lastDrinkDate || null},
            ${JSON.stringify(drinkingTypes)}::jsonb,
            ${JSON.stringify(impactAreas)}::jsonb
          )
        `
        console.log("[v0] Saved alcohol problem area")
      }
    } catch (error) {
      console.error("[v0] Error saving alcohol problem area:", error)
      throw new Error(`Alcohol problem area save failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    }

    // Save substance-specific problem area
    try {
      if (journeyTypes.includes("substances") && (data.substanceTriggers || data.substanceFrequency)) {
        const triggers = Array.isArray(data.substanceTriggers) ? data.substanceTriggers : []
        const impactAreas = Array.isArray(data.substanceImpactAreas) ? data.substanceImpactAreas : []
        const substanceTypes = Array.isArray(data.substanceTypes) ? data.substanceTypes : []

        await sql`
          INSERT INTO problem_areas (
            user_id, 
            problem_type, 
            triggers, 
            patterns,
            frequency,
            last_occurrence_date,
            specific_types,
            impact_areas
          )
          VALUES (
            ${userId}, 
            'substances',
            ${JSON.stringify(triggers)}::jsonb,
            ${`Frequency: ${data.substanceFrequency || "Not specified"}. Types: ${substanceTypes.join(", ") || "Not specified"}`},
            ${data.substanceFrequency || null},
            ${data.lastSubstanceDate || null},
            ${JSON.stringify(substanceTypes)}::jsonb,
            ${JSON.stringify(impactAreas)}::jsonb
          )
        `
        console.log("[v0] Saved substances problem area")
      }
    } catch (error) {
      console.error("[v0] Error saving substances problem area:", error)
      throw new Error(
        `Substances problem area save failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      )
    }

    // Save mental health data as a "problem area" for consistent tracking
    try {
      if (journeyTypes.includes("mental_health") && data.mentalHealthAreas?.length > 0) {
        const mentalHealthAreas = Array.isArray(data.mentalHealthAreas) ? data.mentalHealthAreas : []
        const supportNeeds = Array.isArray(data.mentalHealthSupportNeeds) ? data.mentalHealthSupportNeeds : []
        const copingMethods = Array.isArray(data.currentCopingMethods) ? data.currentCopingMethods : []

        await sql`
          INSERT INTO problem_areas (
            user_id, 
            problem_type, 
            triggers, 
            patterns,
            frequency,
            specific_types,
            impact_areas
          )
          VALUES (
            ${userId}, 
            'mental_health',
            ${JSON.stringify(copingMethods)}::jsonb,
            ${`Frequency: ${data.mentalHealthFrequency || "Not specified"}. Treatment: ${data.receivingMentalHealthTreatment || "Not specified"}`},
            ${data.mentalHealthFrequency || null},
            ${JSON.stringify(mentalHealthAreas)}::jsonb,
            ${JSON.stringify(supportNeeds)}::jsonb
          )
        `
        console.log("[v0] Saved mental health area")
      }
    } catch (error) {
      console.error("[v0] Error saving mental health area:", error)
      throw new Error(`Mental health area save failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    }

    // Save personal growth goals
    try {
      if (journeyTypes.includes("personal_growth") && data.growthGoals?.length > 0) {
        const growthGoals = Array.isArray(data.growthGoals) ? data.growthGoals : []
        const challenges = Array.isArray(data.growthChallenges) ? data.growthChallenges : []

        await sql`
          INSERT INTO problem_areas (
            user_id, 
            problem_type, 
            triggers, 
            patterns,
            frequency,
            specific_types,
            impact_areas
          )
          VALUES (
            ${userId}, 
            'personal_growth',
            ${JSON.stringify(challenges)}::jsonb,
            ${`Motivation: ${data.growthMotivation || "Not specified"}`},
            ${data.growthMotivation || null},
            ${JSON.stringify(growthGoals)}::jsonb,
            ${JSON.stringify(challenges)}::jsonb
          )
        `
        console.log("[v0] Saved personal growth goals")
      }
    } catch (error) {
      console.error("[v0] Error saving personal growth:", error)
      throw new Error(`Personal growth save failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    }

    // Save choice points
    try {
      if (data.recognizedChoicePoints && data.recognizedChoicePoints.length > 0) {
        await sql`
          UPDATE user_profiles
          SET choice_points = ${JSON.stringify(data.recognizedChoicePoints)}::jsonb
          WHERE user_id = ${userId}
        `
        console.log("[v0] Saved choice points")
      }
    } catch (error) {
      console.error("[v0] Error saving choice points:", error)
      throw new Error(`Choice points save failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    }

    // Save strengths assessment
    try {
      if (data.perceivedStrengths || data.identifiedStrengths) {
        const perceivedStrengths = Array.isArray(data.perceivedStrengths) ? data.perceivedStrengths : []
        const identifiedStrengths = Array.isArray(data.identifiedStrengths) ? data.identifiedStrengths : []

        await sql`
          UPDATE user_profiles
          SET 
            perceived_strengths = ${JSON.stringify(perceivedStrengths)}::jsonb,
            identified_strengths = ${JSON.stringify(identifiedStrengths)}::jsonb,
            strengths_completed = true
          WHERE user_id = ${userId}
        `
        console.log("[v0] Saved strengths assessment")
      }
    } catch (error) {
      console.error("[v0] Error saving strengths:", error)
      throw new Error(`Strengths save failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    }

    // Create initial daily check-in
    try {
      const initialMood = 7
      const initialUrgeStrength = journeyTypes.some((t: string) => ["gambling", "alcohol", "substances"].includes(t))
        ? 5
        : 3
      const emotionsFelt = data.currentEmotions || []
      const strongestEmotion = data.strongestEmotion || (emotionsFelt.length > 0 ? emotionsFelt[0] : null)
      const emotionContext = data.situationDescription || "Initial onboarding reflection"
      const overallRating = 6

      await sql`
        INSERT INTO daily_checkins (
          user_id,
          date,
          mood_rating,
          urge_strength,
          gambling_occurred,
          emotions_felt,
          strongest_emotion,
          emotion_context,
          overall_rating,
          good_things,
          bad_things,
          notes,
          created_at
        )
        VALUES (
          ${userId},
          CURRENT_DATE,
          ${initialMood},
          ${initialUrgeStrength},
          false,
          ${emotionsFelt.length > 0 ? emotionsFelt : null},
          ${strongestEmotion},
          ${emotionContext},
          ${overallRating},
          ${data.perceivedStrengths ? `Started my recovery journey. Recognized strengths: ${data.perceivedStrengths.join(", ")}` : "Started my recovery journey"},
          ${data.gamblingTriggers ? `Identified triggers: ${data.gamblingTriggers.join(", ")}` : null},
          ${"Initial check-in from onboarding completion"},
          NOW()
        )
        ON CONFLICT (user_id, date) DO NOTHING
      `
      console.log("[v0] Created initial daily check-in from onboarding data")
    } catch (error) {
      console.error("[v0] Error creating initial daily check-in:", error)
    }

    // Update user profile with all journey data
    try {
      // Prepare all the data
      const alcoholTriggers = Array.isArray(data.alcoholTriggers) ? data.alcoholTriggers : []
      const alcoholImpactAreas = Array.isArray(data.alcoholImpactAreas) ? data.alcoholImpactAreas : []
      const drinkingTypes = Array.isArray(data.drinkingTypes) ? data.drinkingTypes : []
      const substanceTriggers = Array.isArray(data.substanceTriggers) ? data.substanceTriggers : []
      const substanceImpactAreas = Array.isArray(data.substanceImpactAreas) ? data.substanceImpactAreas : []
      const substanceTypes = Array.isArray(data.substanceTypes) ? data.substanceTypes : []
      const mentalHealthAreas = Array.isArray(data.mentalHealthAreas) ? data.mentalHealthAreas : []
      const copingMethods = Array.isArray(data.currentCopingMethods) ? data.currentCopingMethods : []
      const supportNeeds = Array.isArray(data.mentalHealthSupportNeeds) ? data.mentalHealthSupportNeeds : []
      const growthGoals = Array.isArray(data.growthGoals) ? data.growthGoals : []
      const growthChallenges = Array.isArray(data.growthChallenges) ? data.growthChallenges : []

      await sql`
        UPDATE user_profiles
        SET 
          onboarding_completed = true,
          level_credits = 1,
          total_points_earned = 1,
          check_in_streak = 1,
          longest_streak = 1,
          last_check_in_date = CURRENT_DATE,
          journey_types = ${JSON.stringify(journeyTypes)}::jsonb,
          growth_avatar = ${data.growthAvatar || "growth_tree"},
          self_harm_thoughts = ${data.selfHarmThoughts || null},
          self_harm_actions = ${data.selfHarmActions || null},
          suicidal_thoughts = ${data.suicidalThoughts || null},
          alcohol_use = ${data.alcoholUse || data.alcoholFrequency || null},
          alcohol_frequency = ${data.alcoholFrequency || null},
          last_drink_date = ${data.lastDrinkDate || null},
          drinking_types = ${JSON.stringify(drinkingTypes)}::jsonb,
          alcohol_triggers = ${JSON.stringify(alcoholTriggers)}::jsonb,
          alcohol_impact_areas = ${JSON.stringify(alcoholImpactAreas)}::jsonb,
          drug_use = ${data.drugUse || data.substanceFrequency || null},
          substance_frequency = ${data.substanceFrequency || null},
          last_substance_date = ${data.lastSubstanceDate || null},
          substance_types = ${JSON.stringify(substanceTypes)}::jsonb,
          substance_triggers = ${JSON.stringify(substanceTriggers)}::jsonb,
          substance_impact_areas = ${JSON.stringify(substanceImpactAreas)}::jsonb,
          substance_gambling_link = ${data.substanceGamblingLink || null},
          substance_mental_health_link = ${data.substanceMentalHealthLink || null},
          mental_health_areas = ${JSON.stringify(mentalHealthAreas)}::jsonb,
          mental_health_frequency = ${data.mentalHealthFrequency || null},
          coping_methods = ${JSON.stringify(copingMethods)}::jsonb,
          mental_health_support_needs = ${JSON.stringify(supportNeeds)}::jsonb,
          receiving_treatment = ${data.receivingMentalHealthTreatment || null},
          growth_goals = ${JSON.stringify(growthGoals)}::jsonb,
          growth_motivation = ${data.growthMotivation || null},
          growth_challenges = ${JSON.stringify(growthChallenges)}::jsonb,
          plays_video_games = ${data.playsVideoGames !== undefined ? data.playsVideoGames : null},
          gaming_frequency = ${data.gamingFrequency || null},
          gaming_impact = ${data.gamingImpact || null},
          loot_box_exposure = ${data.lootBoxExposure || null},
          in_game_purchases = ${data.inGamePurchases || null},
          updated_at = NOW()
        WHERE user_id = ${userId}
      `
      console.log("[v0] Marked onboarding as completed with all journey data")
    } catch (error) {
      console.error("[v0] Error updating user profile:", error)
      throw new Error(`User profile update failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Onboarding completion error:", error)
    return NextResponse.json(
      {
        error: "Failed to complete onboarding",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
