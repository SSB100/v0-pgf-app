import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import { sql } from "@/lib/db"
import { getJourneyContentRecord } from "@/lib/clinical-content-registry"
import { LEGACY_CONTENT_VERSION } from "@/lib/content-evidence-registry.mjs"

// Keep the previous standalone Distress Tolerance route rewardable for users who
// arrive through an old bookmark while keeping it clearly outside the current
// versioned Journey registry.
const LEGACY_JOURNEY_MODULES: Record<string, string> = {
  "distress-tolerance": "Distress Tolerance",
}

export async function POST(request: NextRequest) {
  try {
    const user = await getSession()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await request.json()
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

    // Do not trust the client to decide whether a completion is rewardable or
    // what the module is called. Only one completion per known module can earn a
    // Growth Credit.
    const inserted = await sql`
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
      WHERE NOT EXISTS (
        SELECT 1 FROM journey_completions
        WHERE user_id = ${user.id} AND module_slug = ${moduleSlug}
      )
      RETURNING id
    `

    if (inserted.length === 0) {
      return NextResponse.json({ message: "Module already completed", alreadyCompleted: true })
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
      content: {
        contentId,
        version: contentVersion,
      },
    })
  } catch (error) {
    console.error("Error completing journey module:", error)
    return NextResponse.json({ error: "Failed to complete module" }, { status: 500 })
  }
}
