import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import { dbTableExists, sql } from "@/lib/db"
import { getJourneyContentRecord } from "@/lib/clinical-content-registry"
import { LEGACY_CONTENT_VERSION } from "@/lib/content-evidence-registry.mjs"
import {
  canonicaliseJourneyResponse,
  JOURNEY_RESPONSE_SCHEMA_VERSION,
  MAX_JOURNEY_RESPONSE_BODY_CHARS,
} from "@/lib/journey-response-policy"

// Keep the previous standalone Distress Tolerance route rewardable for users who
// arrive through an old bookmark while keeping it clearly outside the current
// versioned Journey registry. Legacy content remains response-less.
const LEGACY_JOURNEY_MODULES: Record<string, string> = {
  "distress-tolerance": "Distress Tolerance",
}

export async function POST(request: NextRequest) {
  try {
    const user = await getSession()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    if (user.role !== "client") return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    const rawBody = await request.text()
    if (rawBody.length > MAX_JOURNEY_RESPONSE_BODY_CHARS) {
      return NextResponse.json({ error: "Journey response is too large" }, { status: 413 })
    }

    let body: any
    try {
      body = JSON.parse(rawBody)
    } catch {
      return NextResponse.json({ error: "Invalid Journey response" }, { status: 400 })
    }

    const moduleSlug = typeof body.moduleSlug === "string" ? body.moduleSlug : ""
    const currentContent = getJourneyContentRecord(moduleSlug)
    const legacyTitle = LEGACY_JOURNEY_MODULES[moduleSlug]

    if (!currentContent && !legacyTitle) {
      return NextResponse.json({ error: "Unknown journey module" }, { status: 400 })
    }

    const moduleTitle = currentContent?.title ?? legacyTitle
    const contentId = currentContent?.contentId ?? `waypoint.journey.${moduleSlug.replaceAll("/", ".")}`
    const contentVersion = currentContent?.version ?? LEGACY_CONTENT_VERSION
    const registryRevision = currentContent?.registryRevision ?? LEGACY_CONTENT_VERSION

    // Legacy standalone modules pre-date the guided response schema. Preserve
    // their old one-credit completion behaviour without pretending a response
    // exists that Waypoint never collected.
    if (!currentContent) {
      const inserted = await sql`
        INSERT INTO journey_completions (
          user_id,
          module_slug,
          module_name,
          content_id,
          content_version,
          content_registry_revision
        )
        VALUES (
          ${user.id},
          ${moduleSlug},
          ${moduleTitle},
          ${contentId},
          ${contentVersion},
          ${registryRevision}
        )
        ON CONFLICT (user_id, module_slug) DO NOTHING
        RETURNING id
      `

      if (inserted.length === 0) {
        return NextResponse.json({ message: "Module already completed", alreadyCompleted: true, creditsAwarded: 0 })
      }

      const profileResult = await sql`
        UPDATE user_profiles
        SET level_credits = COALESCE(level_credits, 0) + 1
        WHERE user_id = ${user.id}
        RETURNING level_credits
      `

      return NextResponse.json({
        success: true,
        creditsAwarded: 1,
        totalCredits: profileResult[0]?.level_credits || 0,
        content: { contentId, version: contentVersion },
      })
    }

    if (!(await dbTableExists("journey_module_responses"))) {
      return NextResponse.json(
        { error: "Journey response storage has not been activated on this environment yet" },
        { status: 503 },
      )
    }

    const valuesResult = await sql`
      SELECT value_name
      FROM user_values
      WHERE user_id = ${user.id} AND is_core_value = TRUE
      ORDER BY rank NULLS LAST, created_at ASC
      LIMIT 3
    `
    const coreValues = valuesResult
      .map((row: any) => row.value_name)
      .filter((value: unknown): value is string => typeof value === "string")

    let canonicalResponse
    try {
      canonicalResponse = canonicaliseJourneyResponse(moduleSlug, body.response, coreValues)
    } catch (error) {
      const message = error instanceof Error ? error.message : "Invalid Journey response"
      return NextResponse.json({ error: message }, { status: 400 })
    }

    const responseJson = JSON.stringify(canonicalResponse)

    // Response replacement, first-completion insertion and first-credit award
    // happen in one statement so a repeat cannot partially mutate progress.
    const result = await sql`
      WITH response_upsert AS (
        INSERT INTO journey_module_responses (
          user_id,
          module_slug,
          module_name,
          content_id,
          content_version,
          content_registry_revision,
          response_schema_version,
          response_data,
          last_completed_at,
          updated_at
        ) VALUES (
          ${user.id},
          ${moduleSlug},
          ${moduleTitle},
          ${contentId},
          ${contentVersion},
          ${registryRevision},
          ${JOURNEY_RESPONSE_SCHEMA_VERSION},
          ${responseJson}::jsonb,
          CURRENT_TIMESTAMP,
          CURRENT_TIMESTAMP
        )
        ON CONFLICT (user_id, module_slug) DO UPDATE SET
          module_name = EXCLUDED.module_name,
          content_id = EXCLUDED.content_id,
          content_version = EXCLUDED.content_version,
          content_registry_revision = EXCLUDED.content_registry_revision,
          response_schema_version = EXCLUDED.response_schema_version,
          response_data = EXCLUDED.response_data,
          last_completed_at = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
        RETURNING id
      ),
      completion_insert AS (
        INSERT INTO journey_completions (
          user_id,
          module_slug,
          module_name,
          content_id,
          content_version,
          content_registry_revision
        )
        SELECT
          ${user.id},
          ${moduleSlug},
          ${moduleTitle},
          ${contentId},
          ${contentVersion},
          ${registryRevision}
        FROM response_upsert
        ON CONFLICT (user_id, module_slug) DO NOTHING
        RETURNING id
      ),
      credit_update AS (
        UPDATE user_profiles
        SET level_credits = COALESCE(level_credits, 0) + 1
        WHERE user_id = ${user.id}
          AND EXISTS (SELECT 1 FROM completion_insert)
        RETURNING level_credits
      )
      SELECT
        EXISTS (SELECT 1 FROM completion_insert) AS first_completion,
        COALESCE(
          (SELECT level_credits FROM credit_update LIMIT 1),
          (SELECT level_credits FROM user_profiles WHERE user_id = ${user.id} LIMIT 1),
          0
        ) AS total_credits
    `

    const firstCompletion = result[0]?.first_completion === true
    const totalCredits = Number(result[0]?.total_credits || 0)

    return NextResponse.json({
      success: true,
      responseSaved: true,
      repeated: !firstCompletion,
      creditsAwarded: firstCompletion ? 1 : 0,
      totalCredits,
      content: {
        contentId,
        version: contentVersion,
        responseSchemaVersion: JOURNEY_RESPONSE_SCHEMA_VERSION,
      },
    })
  } catch (error) {
    console.error("Error completing journey module:", error)
    return NextResponse.json({ error: "Failed to complete module" }, { status: 500 })
  }
}
