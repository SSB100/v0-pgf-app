import { NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import { dbTableExists, sql } from "@/lib/db"
import { governanceTableExists, recordAccessAuditEvent } from "@/lib/governance"

export async function GET() {
  try {
    const user = await getSession()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    const [demographicsReady, journeyResponsesReady] = await Promise.all([
      dbTableExists("user_demographics"), dbTableExists("journey_module_responses"),
    ])
    const [account, demographics, profile, values, awarenessCheckins, skillsPractice, problemAreas, dailyCheckins,
      journeyCompletions, journeyResponses, sosAlerts, directMessages, peerSupportRelationships, communityProfiles,
      groupMemberships, communityMessages, communityReportsMade, groupSwitchReasons] = await Promise.all([
      sql`SELECT id,email,full_name,role,created_at,updated_at,data_consent,data_consent_date,terms_accepted,terms_accepted_date,date_of_birth,age_verified_18_plus,age_verified_at,age_band,country,gender FROM users WHERE id=${user.id}`,
      demographicsReady ? sql`SELECT * FROM user_demographics WHERE user_id=${user.id}` : Promise.resolve([]),
      sql`SELECT * FROM user_profiles WHERE user_id=${user.id}`,
      sql`SELECT * FROM user_values WHERE user_id=${user.id} ORDER BY created_at`,
      sql`SELECT * FROM awareness_checkins WHERE user_id=${user.id} ORDER BY created_at`,
      sql`SELECT * FROM skills_practice WHERE user_id=${user.id} ORDER BY practiced_at`,
      sql`SELECT * FROM problem_areas WHERE user_id=${user.id} ORDER BY identified_at`,
      sql`SELECT * FROM daily_checkins WHERE user_id=${user.id} ORDER BY date`,
      sql`SELECT * FROM journey_completions WHERE user_id=${user.id} ORDER BY completed_at`,
      journeyResponsesReady ? sql`SELECT * FROM journey_module_responses WHERE user_id=${user.id} ORDER BY last_completed_at` : Promise.resolve([]),
      sql`SELECT * FROM sos_alerts WHERE user_id=${user.id} ORDER BY created_at`,
      sql`SELECT * FROM messages WHERE sender_id=${user.id} OR recipient_id=${user.id} ORDER BY created_at`,
      sql`SELECT * FROM peer_support_relationships WHERE client_id=${user.id} OR peer_supporter_id=${user.id} ORDER BY created_at`,
      sql`SELECT * FROM community_profiles WHERE user_id=${user.id}`,
      sql`SELECT * FROM group_memberships WHERE user_id=${user.id} ORDER BY joined_at`,
      sql`SELECT * FROM community_messages WHERE user_id=${user.id} ORDER BY created_at`,
      sql`SELECT * FROM community_reports WHERE reporter_user_id=${user.id} ORDER BY created_at`,
      sql`SELECT * FROM group_switch_reasons WHERE user_id=${user.id} ORDER BY created_at`,
    ])
    const governance: Record<string, unknown> = {}
    if (await governanceTableExists("client_professional_links")) governance.professionalConnections = await sql`SELECT * FROM client_professional_links WHERE client_user_id=${user.id} ORDER BY created_at`
    if (await governanceTableExists("sharing_grants")) governance.sharingGrants = await sql`SELECT g.* FROM sharing_grants g JOIN client_professional_links l ON l.id=g.link_id WHERE l.client_user_id=${user.id} ORDER BY g.created_at`
    if (await governanceTableExists("consent_events")) governance.consentEvents = await sql`SELECT * FROM consent_events WHERE subject_user_id=${user.id} ORDER BY occurred_at`
    if (await governanceTableExists("access_audit_events")) governance.accessAuditEvents = await sql`SELECT * FROM access_audit_events WHERE subject_user_id=${user.id} ORDER BY occurred_at`
    if (await governanceTableExists("policy_acceptances")) governance.policyAcceptances = await sql`SELECT * FROM policy_acceptances WHERE user_id=${user.id} ORDER BY occurred_at`
    if (await governanceTableExists("privacy_requests")) governance.privacyRequests = await sql`SELECT * FROM privacy_requests WHERE user_id=${user.id} ORDER BY requested_at`
    await recordAccessAuditEvent({ subjectUserId:user.id,actorUserId:user.id,eventType:"user_data_export",resourceScope:"user_owned_waypoint_data",purpose:"User requested a copy of their Waypoint information",metadata:{format:"json",formatVersion:"1.2",initiatedBy:"user"} })
    const exportData = {
      export:{generatedAt:new Date().toISOString(),formatVersion:"1.2",note:"This export contains user-owned Waypoint data available through the current MVP. Reports made by other community members about the user are not automatically included because they may contain another person's confidential information and require a reviewed access process."},
      identityAndAccount:account[0]??null, demographics:demographics[0]??null,
      privateWaypoint:{profile:profile[0]??null,values,awarenessCheckins,skillsPractice,problemAreas,dailyCheckins,journeyCompletions,journeyResponses,sosAlerts},
      supportAndMessaging:{directMessages,peerSupportRelationships},
      community:{profiles:communityProfiles,memberships:groupMemberships,messagesAuthoredByUser:communityMessages,reportsSubmittedByUser:communityReportsMade,groupSwitchReasons}, governance,
    }
    const date=new Date().toISOString().slice(0,10)
    return new NextResponse(JSON.stringify(exportData,null,2),{status:200,headers:{"Content-Type":"application/json; charset=utf-8","Content-Disposition":`attachment; filename="waypoint-data-export-${date}.json"`,"Cache-Control":"private, no-store, max-age=0"}})
  } catch (error) {
    console.error("[waypoint] Unable to export user data",error)
    return NextResponse.json({error:"Unable to create data export"},{status:500})
  }
}
