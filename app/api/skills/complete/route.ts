import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"

export async function POST(req: NextRequest) {
  try {
    const user = await getSession()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { skillSlug, wasHelpful } = await req.json()

    if (!skillSlug || typeof wasHelpful !== "boolean") {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 })
    }

    // Check if already marked this skill as completed
    const existing = await sql`
      SELECT id FROM skills_completed
      WHERE user_id = ${user.id} AND skill_slug = ${skillSlug}
    `

    if (existing.length > 0) {
      return NextResponse.json({ message: "Already completed", alreadyCompleted: true })
    }

    // Record the completion
    await sql`
      INSERT INTO skills_completed (user_id, skill_slug, was_helpful)
      VALUES (${user.id}, ${skillSlug}, ${wasHelpful})
    `

    // If helpful, award 1 level credit
    if (wasHelpful) {
      await sql`
        UPDATE user_profiles
        SET level_credits = COALESCE(level_credits, 0) + 1
        WHERE user_id = ${user.id}
      `

      return NextResponse.json({
        success: true,
        creditAwarded: true,
        message: "Thank you! 1 level credit added to your account.",
      })
    }

    // If not helpful, suggest another skill
    const currentSkillsCompleted = await sql`
      SELECT skill_slug FROM skills_completed WHERE user_id = ${user.id}
    `

    const completedSlugs = currentSkillsCompleted.map((s: any) => s.skill_slug)

    // Get all available skills
    const allSkills = [
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
    ]

    // Find a skill they haven't completed
    const suggestions = allSkills.filter((s) => !completedSlugs.includes(s.slug) && s.slug !== skillSlug)

    const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)]

    return NextResponse.json({
      success: true,
      creditAwarded: false,
      message: "Thanks for your feedback. Here's another skill that might help:",
      suggestedSkill: randomSuggestion || null,
    })
  } catch (error) {
    console.error("[v0] Error completing skill:", error)
    return NextResponse.json({ error: "Failed to complete skill" }, { status: 500 })
  }
}
