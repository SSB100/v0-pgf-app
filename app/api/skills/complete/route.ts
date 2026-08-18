import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"

const AVAILABLE_SKILLS = [
  { slug: "tip", name: "TIP Skills" },
  { slug: "stop", name: "STOP Skill" },
  { slug: "please", name: "PLEASE Skills" },
  { slug: "improve", name: "IMPROVE Skills" },
  { slug: "rain", name: "RAIN Mindfulness" },
  { slug: "opposite-action", name: "Opposite Action" },
  { slug: "interpersonal/dear-man", name: "DEAR MAN" },
  { slug: "interpersonal/give", name: "GIVE" },
  { slug: "interpersonal/fast", name: "FAST" },
  { slug: "interpersonal/problem-solving", name: "Problem Solving" },
  { slug: "interpersonal/turning-the-mind", name: "Turning the Mind" },
  { slug: "reality-acceptance", name: "Reality Acceptance" },
  { slug: "willingness", name: "Willingness" },
  { slug: "distress-tolerance", name: "Distress Tolerance Overview" },
] as const

const AVAILABLE_SKILL_SLUGS = new Set<string>(AVAILABLE_SKILLS.map((skill) => skill.slug))

export async function POST(req: NextRequest) {
  try {
    const user = await getSession()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await req.json()
    const skillSlug = typeof body.skillSlug === "string" ? body.skillSlug : ""
    const wasHelpful = body.wasHelpful

    if (!AVAILABLE_SKILL_SLUGS.has(skillSlug) || typeof wasHelpful !== "boolean") {
      return NextResponse.json({ error: "Invalid skill feedback" }, { status: 400 })
    }

    const inserted = await sql`
      INSERT INTO skills_completed (user_id, skill_slug, was_helpful)
      SELECT ${user.id}, ${skillSlug}, ${wasHelpful}
      WHERE NOT EXISTS (
        SELECT 1 FROM skills_completed
        WHERE user_id = ${user.id} AND skill_slug = ${skillSlug}
      )
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
      })
    }

    const currentSkillsCompleted = await sql`
      SELECT skill_slug FROM skills_completed WHERE user_id = ${user.id}
    `
    const completedSlugs = new Set(currentSkillsCompleted.map((skill: any) => skill.skill_slug))
    const suggestion = AVAILABLE_SKILLS.find((skill) => !completedSlugs.has(skill.slug) && skill.slug !== skillSlug)

    return NextResponse.json({
      success: true,
      creditAwarded: false,
      message: suggestion ? "Thanks for your feedback. You could try another skill if you want to:" : "Thanks for your feedback.",
      suggestedSkill: suggestion || null,
    })
  } catch (error) {
    console.error("[v0] Error recording skill feedback:", error)
    return NextResponse.json({ error: "Failed to record skill feedback" }, { status: 500 })
  }
}
