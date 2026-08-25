import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import { sql } from "@/lib/db"
import { recordConsentEvent } from "@/lib/governance"

export async function PATCH(request: NextRequest) {
  try {
    const user = await getSession()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await request.json()
    if (typeof body.interested !== "boolean") {
      return NextResponse.json({ error: "interested must be true or false" }, { status: 400 })
    }

    const currentRows = await sql`
      SELECT data_consent
      FROM users
      WHERE id = ${user.id}
      LIMIT 1
    `

    if (currentRows.length === 0) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 })
    }

    const wasInterested = currentRows[0]?.data_consent === true
    const now = new Date().toISOString()

    await sql`
      UPDATE users
      SET
        data_consent = ${body.interested},
        data_consent_date = ${now},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${user.id}
    `

    if (wasInterested !== body.interested) {
      await recordConsentEvent({
        subjectUserId: user.id,
        actorUserId: user.id,
        consentType: "future_research_interest",
        action: body.interested ? "granted" : "withdrawn",
        documentVersion: "future-research-interest-v1",
        scope: {},
        metadata: {
          formalResearchConsent: false,
          source: "privacy_centre",
        },
      })
    }

    return NextResponse.json({
      interested: body.interested,
      changedAt: now,
      formalResearchConsent: false,
    })
  } catch (error) {
    console.error("[waypoint] Unable to update research interest", error)
    return NextResponse.json({ error: "Unable to update research preference" }, { status: 500 })
  }
}
