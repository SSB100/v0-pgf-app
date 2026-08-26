import { NextResponse } from "next/server"
import { dbTableExists, sql } from "@/lib/db"
import { getSession } from "@/lib/session"
import { sanitizeDemographicsInput } from "@/lib/demographics-policy.mjs"
import { demographicsRecordToFormValue } from "@/lib/demographics-form-policy.mjs"
import { recordConsentEvent } from "@/lib/governance"

const NO_STORE_HEADERS = { "Cache-Control": "no-store" }

function unavailableResponse() {
  return NextResponse.json(
    { error: "Demographic settings are temporarily unavailable." },
    { status: 503, headers: NO_STORE_HEADERS },
  )
}

async function requireClient() {
  const user = await getSession()
  if (!user) return { response: NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: NO_STORE_HEADERS }) }
  if (user.role !== "client") return { response: NextResponse.json({ error: "Forbidden" }, { status: 403, headers: NO_STORE_HEADERS }) }
  return { user }
}

export async function GET() {
  try {
    const access = await requireClient()
    if ("response" in access) return access.response
    if (!(await dbTableExists("user_demographics"))) return unavailableResponse()

    const rows = await sql`
      SELECT
        ethnicity_responses,
        ethnicity_response_status,
        iwi_affiliations,
        iwi_response_status
      FROM user_demographics
      WHERE user_id = ${access.user.id}::uuid
      LIMIT 1
    `

    return NextResponse.json(
      { demographics: demographicsRecordToFormValue(rows[0] || {}) },
      { headers: NO_STORE_HEADERS },
    )
  } catch (error) {
    console.error("[waypoint] Failed to load demographic settings", error)
    return NextResponse.json({ error: "Failed to load demographic settings" }, { status: 500, headers: NO_STORE_HEADERS })
  }
}

export async function PATCH(request: Request) {
  try {
    const access = await requireClient()
    if ("response" in access) return access.response
    if (!(await dbTableExists("user_demographics"))) return unavailableResponse()

    const input = await request.json()
    const demographics = sanitizeDemographicsInput(input)

    await sql`
      INSERT INTO user_demographics (
        user_id,
        ethnicity_responses,
        ethnicity_response_status,
        iwi_affiliations,
        iwi_response_status,
        collection_notice_version,
        ethnicity_standard_version,
        iwi_standard_version,
        updated_at
      ) VALUES (
        ${access.user.id}::uuid,
        ${JSON.stringify(demographics.ethnicityResponses)}::jsonb,
        ${demographics.ethnicityResponseStatus},
        ${JSON.stringify(demographics.iwiAffiliations)}::jsonb,
        ${demographics.iwiResponseStatus},
        ${demographics.collectionNoticeVersion},
        ${demographics.ethnicityStandardVersion},
        ${demographics.iwiStandardVersion},
        CURRENT_TIMESTAMP
      )
      ON CONFLICT (user_id) DO UPDATE SET
        ethnicity_responses = EXCLUDED.ethnicity_responses,
        ethnicity_response_status = EXCLUDED.ethnicity_response_status,
        iwi_affiliations = EXCLUDED.iwi_affiliations,
        iwi_response_status = EXCLUDED.iwi_response_status,
        collection_notice_version = EXCLUDED.collection_notice_version,
        ethnicity_standard_version = EXCLUDED.ethnicity_standard_version,
        iwi_standard_version = EXCLUDED.iwi_standard_version,
        updated_at = CURRENT_TIMESTAMP
    `

    try {
      await recordConsentEvent({
        subjectUserId: access.user.id,
        actorUserId: access.user.id,
        consentType: "demographics_collection_preference",
        action: "updated",
        documentVersion: demographics.collectionNoticeVersion,
        scope: {},
        metadata: {
          source: "settings",
          optional: true,
          ethnicityResponseStatus: demographics.ethnicityResponseStatus,
          iwiResponseStatus: demographics.iwiResponseStatus,
          valuesIncludedInAudit: false,
        },
      })
    } catch (governanceError) {
      console.warn("[waypoint] Demographic settings saved but governance history could not be recorded", governanceError)
    }

    return NextResponse.json(
      { success: true, demographics: demographicsRecordToFormValue(demographics) },
      { headers: NO_STORE_HEADERS },
    )
  } catch (error) {
    console.error("[waypoint] Failed to update demographic settings", error)
    return NextResponse.json({ error: "Failed to update demographic settings" }, { status: 500, headers: NO_STORE_HEADERS })
  }
}
