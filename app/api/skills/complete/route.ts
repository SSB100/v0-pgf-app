import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"
import { SKILL_CONTENT, getSkillContentBySlug } from "@/lib/clinical-content-registry"

export async function POST(req: NextRequest) {
  try {
    const user = await getSession()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await req.json()
    const skillSlug = typeof body.skillSlug === "string" ? body.skillSlug : ""
    const wasHelpful = body.wasHelpful
    const content = getSkillContentBySlug(skillSlug)

    if (!content || typeof wasHelpful !== "boolean") {
      return NextResponse.json({ error: "Invalid skill feedback" }, { status: 400 })
    }

    const inserted = await sql`
      INSERT INTO skills_practice (
        user_id,
        skill_name,
        skill_category,
        practiced_at,
        skill_slug,
        content_id,
        content_version,
        content_registry_revision,
        practice_source,
        was_helpful
      )
      VALUES (
        ${user.id},
        ${content.title},
        ${content.category},
        CURRENT_TIMESTAMP,
        ${content.slug},
        ${content.contentId},
        ${content.version},
        ${content.registryRevision},
        'skill_page_feedback',
        ${wasHelpful}
      )
      ON CONFLICT (user_id, skill_slug)
        WHERE practice_source = 'skill_page_feedback' AND skill_slug IS NOT NULL
      DO NOTHING
      RETURNING id
    `

    if (inserted.length === 0) {
      return NextResponse.json({ message: "Already completed", alreadyCompleted: true })
    }

    if (wasHelpful) {
      const updated = await sql`
        UPDATE user_profiles
        SET level_credits = COALESCE(level_credits, 0) + 1
        WHERE user_id = ${user.id}
        RETURNING level_credits
      `

      return NextResponse.json({
        success: true,
        creditAwarded: true,
        message: "Feedback recorded and 1 Growth Credit added for this Waypoint activity.",
        totalCredits: updated[0]?.level_credits || 0,
        content: { contentId: content.contentId, version: content.version },
      })
    }

    const currentSkillsCompleted = await sql`
      SELECT skill_slug
      FROM skills_practice
      WHERE user_id = ${user.id}
        AND practice_source = 'skill_page_feedback'
        AND skill_slug IS NOT NULL
    `
    const completedSlugs = new Set(currentSkillsCompleted.map((skill: any) => skill.skill_slug))
    const suggestion = SKILL_CONTENT.find((skill) => !completedSlugs.has(skill.slug) && skill.slug !== skillSlug)

    return NextResponse.json({
      success: true,
      creditAwarded: false,
      message: suggestion ? "Thanks for your feedback. You could try another skill if you want to:" : "Thanks for your feedback.",
      suggestedSkill: suggestion ? { slug: suggestion.slug, name: suggestion.title } : null,
      content: { contentId: content.contentId, version: content.version },
    })
  } catch (error) {
    console.error("[v0] Error recording skill feedback:", error)
    return NextResponse.json({ error: "Failed to record skill feedback" }, { status: 500 })
  }
}
