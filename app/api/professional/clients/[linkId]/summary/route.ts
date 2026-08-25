import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { recordAccessAuditEvent } from "@/lib/governance"
import { getProfessionalSession, looksLikeUuid, professionalCanAccessClientData } from "@/lib/professional-access"
import { normaliseProfessionalShareScopes, type ProfessionalShareScope } from "@/lib/sharing-policy"

const ALLOWED_WINDOWS = new Set([7, 14, 30])

export async function GET(request: NextRequest, context: { params: Promise<{ linkId: string }> }) {
  try {
    const { user, professional, mfaVerified } = await getProfessionalSession()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    if (!professional) return NextResponse.json({ error: "Professional account not found" }, { status: 404 })
    if (!professionalCanAccessClientData(professional, mfaVerified)) {
      return NextResponse.json({ error: "Verified professional, organisation and MFA access are required" }, { status: 403 })
    }

    const { linkId } = await context.params
    if (!looksLikeUuid(linkId)) return NextResponse.json({ error: "Invalid client connection" }, { status: 400 })

    const daysRequested = Number(request.nextUrl.searchParams.get("days") || 14)
    const days = ALLOWED_WINDOWS.has(daysRequested) ? daysRequested : 14

    const rows = await sql`
      SELECT
        l.id,
        l.client_user_id,
        l.accepted_at,
        u.full_name AS client_name,
        COALESCE(
          json_agg(DISTINCT g.data_scope) FILTER (WHERE g.id IS NOT NULL AND g.status = 'active'),
          '[]'::json
        ) AS shared_scopes
      FROM client_professional_links l
      JOIN users u ON u.id = l.client_user_id
      LEFT JOIN sharing_grants g ON g.link_id = l.id AND g.status = 'active'
      WHERE l.id = ${linkId}
        AND l.professional_account_id = ${professional.id}
        AND l.status = 'active'
      GROUP BY l.id, u.id
      LIMIT 1
    `

    const connection = rows[0]
    if (!connection) return NextResponse.json({ error: "Active client connection not found" }, { status: 404 })

    const authorisedScopes = normaliseProfessionalShareScopes(connection.shared_scopes)
    const scopes = new Set<ProfessionalShareScope>(authorisedScopes)
    const response: Record<string, unknown> = {
      client: { name: connection.client_name, connectedAt: connection.accepted_at },
      windowDays: days,
      generatedAt: new Date().toISOString(),
      sharedScopes: authorisedScopes,
      monitoringNotice: "This is a user-authorised summary for later review. Waypoint is not continuously monitored and does not generate a clinical risk score.",
    }

    if (scopes.has("daily_checkins_summary")) {
      const checkins = await sql`
        SELECT
          COUNT(*)::int AS checkin_count,
          ROUND(AVG(mood_rating)::numeric, 1) AS average_mood,
          ROUND(AVG(urge_strength)::numeric, 1) AS average_urge,
          ROUND(AVG(overall_rating)::numeric, 1) AS average_overall,
          COUNT(*) FILTER (WHERE gambling_occurred = TRUE)::int AS gambling_days,
          COUNT(*) FILTER (WHERE behavior_occurred = TRUE)::int AS behaviour_days,
          MAX(date) AS latest_date
        FROM daily_checkins
        WHERE user_id = ${connection.client_user_id}
          AND date >= CURRENT_DATE - (${days - 1} * INTERVAL '1 day')
      `
      const recent = await sql`
        SELECT date, mood_rating, urge_strength, overall_rating, gambling_occurred, behavior_occurred
        FROM daily_checkins
        WHERE user_id = ${connection.client_user_id}
          AND date >= CURRENT_DATE - (${days - 1} * INTERVAL '1 day')
        ORDER BY date ASC
      `
      response.dailyCheckins = { summary: checkins[0] ?? {}, trend: recent }
    }

    if (scopes.has("journey_progress")) {
      const totals = await sql`
        SELECT COUNT(*)::int AS completed_modules, MAX(completed_at) AS latest_completion
        FROM journey_completions
        WHERE user_id = ${connection.client_user_id}
      `
      const recent = await sql`
        SELECT module_slug, module_name, completed_at
        FROM journey_completions
        WHERE user_id = ${connection.client_user_id}
        ORDER BY completed_at DESC
        LIMIT 8
      `
      response.journeyProgress = { ...(totals[0] ?? {}), recentModules: recent }
    }

    if (scopes.has("skills_practice")) {
      const totals = await sql`
        SELECT
          COUNT(*)::int AS completed_skills,
          COUNT(*) FILTER (WHERE effectiveness_rating >= 4)::int AS found_helpful,
          ROUND(AVG(effectiveness_rating)::numeric, 1) AS average_effectiveness,
          MAX(practiced_at) AS latest_completion
        FROM skills_practice
        WHERE user_id = ${connection.client_user_id}
      `
      const recent = await sql`
        SELECT skill_name, skill_category, effectiveness_rating, practiced_at
        FROM skills_practice
        WHERE user_id = ${connection.client_user_id}
        ORDER BY practiced_at DESC
        LIMIT 8
      `
      response.skillsPractice = { ...(totals[0] ?? {}), recentSkills: recent }
    }

    if (scopes.has("core_values")) {
      response.coreValues = await sql`
        SELECT value_name, category, rank
        FROM user_values
        WHERE user_id = ${connection.client_user_id}
          AND is_core_value = TRUE
        ORDER BY rank NULLS LAST, created_at ASC
      `
    }

    await recordAccessAuditEvent({
      subjectUserId: connection.client_user_id,
      actorUserId: user.id,
      professionalAccountId: professional.id,
      organisationId: professional.organisation_id,
      eventType: "professional_summary_view",
      resourceScope: authorisedScopes.join(","),
      purpose: "clinical_support",
      metadata: { linkId, days, mfaVerified: true },
    })

    return NextResponse.json(response, { headers: { "Cache-Control": "private, no-store, max-age=0" } })
  } catch (error) {
    console.error("[waypoint] Unable to load professional client summary", error)
    return NextResponse.json({ error: "Unable to load client summary" }, { status: 500 })
  }
}
