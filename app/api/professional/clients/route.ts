import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getProfessionalSession, professionalCanAccessClientData } from "@/lib/professional-access"

export async function GET() {
  try {
    const { user, professional } = await getProfessionalSession()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    if (!professional) return NextResponse.json({ error: "Professional account not found" }, { status: 404 })
    if (!professionalCanAccessClientData(professional)) {
      return NextResponse.json({ error: "Verified professional and organisation access is required" }, { status: 403 })
    }

    const clients = await sql`
      SELECT
        l.id AS link_id,
        l.accepted_at,
        u.full_name AS client_name,
        COALESCE(
          json_agg(DISTINCT g.data_scope) FILTER (WHERE g.id IS NOT NULL AND g.status = 'active'),
          '[]'::json
        ) AS shared_scopes,
        MAX(d.date) AS latest_checkin_date,
        MAX(a.occurred_at) FILTER (WHERE a.professional_account_id = ${professional.id}) AS last_professional_access
      FROM client_professional_links l
      JOIN users u ON u.id = l.client_user_id
      LEFT JOIN sharing_grants g ON g.link_id = l.id AND g.status = 'active'
      LEFT JOIN daily_checkins d ON d.user_id = l.client_user_id
      LEFT JOIN access_audit_events a ON a.subject_user_id = l.client_user_id
        AND a.professional_account_id = ${professional.id}
        AND a.event_type = 'professional_summary_view'
      WHERE l.professional_account_id = ${professional.id}
        AND l.status = 'active'
      GROUP BY l.id, u.id
      ORDER BY u.full_name NULLS LAST, l.accepted_at DESC
    `

    return NextResponse.json({ clients })
  } catch (error) {
    console.error("[waypoint] Unable to load professional clients", error)
    return NextResponse.json({ error: "Unable to load connected clients" }, { status: 500 })
  }
}
