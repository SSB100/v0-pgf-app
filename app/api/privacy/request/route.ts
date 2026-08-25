import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import { sql } from "@/lib/db"
import { governanceTableExists, recordAccessAuditEvent } from "@/lib/governance"

const USER_REQUEST_TYPES = new Set(["correction", "deletion"])

export async function POST(request: NextRequest) {
  try {
    const user = await getSession()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    if (!(await governanceTableExists("privacy_requests"))) {
      return NextResponse.json(
        { error: "The governed privacy-request workflow has not been activated on this environment." },
        { status: 503 },
      )
    }

    const body = await request.json()
    const requestType = typeof body.requestType === "string" ? body.requestType : ""
    const note = typeof body.note === "string" ? body.note.trim().slice(0, 2000) : ""

    if (!USER_REQUEST_TYPES.has(requestType)) {
      return NextResponse.json({ error: "Unsupported privacy request" }, { status: 400 })
    }

    const existing = await sql`
      SELECT id, status
      FROM privacy_requests
      WHERE user_id = ${user.id}
        AND request_type = ${requestType}
        AND status IN ('requested', 'in_review')
      ORDER BY requested_at DESC
      LIMIT 1
    `

    if (existing.length > 0) {
      return NextResponse.json(
        { error: `You already have an open ${requestType} request.`, requestId: existing[0].id },
        { status: 409 },
      )
    }

    const rows = await sql`
      INSERT INTO privacy_requests (user_id, request_type, status, metadata)
      VALUES (
        ${user.id},
        ${requestType},
        'requested',
        ${JSON.stringify({ note, source: "privacy_centre" })}::jsonb
      )
      RETURNING id, request_type, status, requested_at
    `

    await recordAccessAuditEvent({
      subjectUserId: user.id,
      actorUserId: user.id,
      eventType: "privacy_request_submitted",
      resourceScope: requestType,
      purpose: `User submitted a ${requestType} request`,
      metadata: { requestId: rows[0]?.id },
    })

    return NextResponse.json(rows[0], { status: 201 })
  } catch (error) {
    console.error("[waypoint] Unable to create privacy request", error)
    return NextResponse.json({ error: "Unable to submit privacy request" }, { status: 500 })
  }
}
