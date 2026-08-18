import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"

export async function POST(request: NextRequest) {
  try {
    const user = await getSession()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data } = await request.json()
    if (!data) {
      return NextResponse.json({ error: "Onboarding data is required" }, { status: 400 })
    }

    try {
      await sql`SELECT last_bet_date FROM problem_areas LIMIT 0`
    } catch (error) {
      console.error("[v0] Database schema issue detected")
      return NextResponse.json(
        {
          error: "Database schema needs migration",
          details: "Please contact support.",
        },
        { status: 500 },
      )
    }

    try {
      // Replace onboarding-derived profile information without touching genuine daily check-in history.
      await sql`DELETE FROM user_values WHERE user_id = ${user.id}`
      await sql`DELETE FROM awareness_checkins WHERE user_id = ${user.id}`
      await sql`DELETE FROM problem_areas WHERE user_id = ${user.id}`
    } catch (error) {
      console.error("[v0] Error replacing existing onboarding data:", error)
      throw new Error(`Existing onboarding data replacement failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    }

    try {
      if (data.currentEmotions && data.currentEmotions.length > 0) {
        await sql`
          INSERT INTO awareness_checkins (
            user_id, emotion, all_emotions, strongest_emotion,
            situation_context, urge_description, notes
          )
          VALUES (
            ${user.id},
            ${data.strongestEmotion || data.currentEmotions[0]},
            ${JSON.stringify(data.currentEmotions)}::jsonb,
            ${data.strongestEmotion || data.currentEmotions[0]},
            ${data.situationDescription || null},
            ${data.selfTalk || null},
            ${`Initial onboarding reflection. Still experiencing: ${data.stillExperiencing ? "Yes" : "No"}`}
          )
        `
      }
    } catch (error) {
      console.error("[v0] Error saving awareness reflection:", error)
      throw new Error(`Awareness reflection failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    }

    try {
      if (data.selectedValues && data.selectedValues.length > 0) {
        for (let i = 0; i < data.selectedValues.length; i++) {
          const value = data.selectedValues[i]
          const rank = i + 1

          await sql`
            INSERT INTO user_values (user_id, value_name, category, is_core_value, rank)
            VALUES (
              ${user.id},
              ${value.name || value},
              ${value.category || "personal"},
              true,
              ${rank}
            )
          `
        }
      }
    } catch (error) {
      console.error("[v0] Error saving values:", error)
      throw new Error(`Values save failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    }

    const journeyTypes = Array.isArray(data.journeyTypes) ? data.journeyTypes : []

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
            ${user.id},
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
      }
    } catch (error) {
      console.error("[v0] Error saving gambling problem area:", error)
      throw new Error(`Gambling problem area save failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    }

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
            ${user.id},
            'alcohol',
            ${JSON.stringify(triggers)}::jsonb,
            ${`Frequency: ${data.alcoholFrequency || "Not specified"}. Types: ${drinkingTypes.join(", ") || "Not specified"}`},
            ${data.alcoholFrequency || null},
            ${data.lastDrinkDate || null},
            ${JSON.stringify(drinkingTypes)}::jsonb,
            ${JSON.stringify(impactAreas)}::jsonb
          )
        `
      }
    } catch (error) {
      console.error("[v0] Error saving alcohol problem area:", error)
      throw new Error(`Alcohol problem area save failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    }

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
            ${user.id},
            'substances',
            ${JSON.stringify(triggers)}::jsonb,
            ${`Frequency: ${data.substanceFrequency || "Not specified"}. Types: ${substanceTypes.join(", ") || "Not specified"}`},
            ${data.substanceFrequency || null},
            ${data.lastSubstanceDate || null},
            ${JSON.stringify(substanceTypes)}::jsonb,
            ${JSON.stringify(impactAreas)}::jsonb
          )
        `
      }
    } catch (error) {
      console.error("[v0] Error saving substances problem area:", error)
      throw new Error(`Substances problem area save failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    }

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
            ${user.id},
            'mental_health',
            ${JSON.stringify(copingMethods)}::jsonb,
            ${`Frequency: ${data.mentalHealthFrequency || "Not specified"}. Treatment: ${data.receivingMentalHealthTreatment || "Not specified"}`},
            ${data.mentalHealthFrequency || null},
            ${JSON.stringify(mentalHealthAreas)}::jsonb,
            ${JSON.stringify(supportNeeds)}::jsonb
          )
        `
      }
    } catch (error) {
      console.error("[v0] Error saving mental health area:", error)
      throw new Error(`Mental health area save failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    }

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
            ${user.id},
            'personal_growth',
            ${JSON.stringify(challenges)}::jsonb,
            ${`Motivation: ${data.growthMotivation || "Not specified"}`},
            ${data.growthMotivation || null},
            ${JSON.stringify(growthGoals)}::jsonb,
            ${JSON.stringify(challenges)}::jsonb
          )
        `
      }
    } catch (error) {
      console.error("[v0] Error saving personal growth:", error)
      throw new Error(`Personal growth save failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    }

    try {
      if (data.recognizedChoicePoints && data.recognizedChoicePoints.length > 0) {
        await sql`
          UPDATE user_profiles
          SET choice_points = ${JSON.stringify(data.recognizedChoicePoints)}::jsonb
          WHERE user_id = ${user.id}
        `
      }
    } catch (error) {
      console.error("[v0] Error saving choice points:", error)
      throw new Error(`Choice points save failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    }

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
          WHERE user_id = ${user.id}
        `
      }
    } catch (error) {
      console.error("[v0] Error saving strengths:", error)
      throw new Error(`Strengths save failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    }

    try {
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
          onboarding_current_step = NULL,
          onboarding_data = NULL,
          updated_at = NOW()
        WHERE user_id = ${user.id}
      `
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
