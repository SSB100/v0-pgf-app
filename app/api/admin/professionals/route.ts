import { randomUUID } from "node:crypto"
import { type NextRequest, NextResponse } from "next/server"
import { dbTableExists, dbTransaction, sql } from "@/lib/db"
import { getAdminSession } from "@/lib/admin-access"
import { looksLikeUuid } from "@/lib/professional-access"
import { isOrganisationAffiliationTransfer } from "@/lib/organisation-lifecycle-policy.mjs"
import { validateVerificationEvidence } from "@/lib/professional-verification-policy.mjs"

export const runtime = "nodejs"

async function loadProfessional(professionalId: string) {
  const rows = await sql`
    SELECT
      p.id,
      p.user_id,
      p.display_name,
      p.professional_role,
      p.registration_body,
      p.registration_number,
      p.verification_status,
      p.claimed_organisation_name,
      p.organisation_id,
      p.verified_at,
      p.suspended_at,
      p.suspension_reason,
      p.offboarded_at,
      p.offboarding_reason,
      u.email,
      u.security_version,
      o.name AS organisation_name,
      o.verification_status AS organisation_verification_status,
      m.status AS mfa_status,
      m.verified_at AS mfa_verified_at
    FROM professional_accounts p
    JOIN users u ON u.id = p.user_id
    LEFT JOIN organisations o ON o.id = p.organisation_id
    LEFT JOIN mfa_factors m ON m.user_id = p.user_id AND m.factor_type = 'totp'
    WHERE p.id = ${professionalId}
    LIMIT 1
  `
  return rows[0] ?? null
}

async function loadOpenMembership(professionalId: string) {
  const rows = await sql`
    SELECT id, professional_account_id, organisation_id, status, verified_at, suspended_at, started_at
    FROM organisation_memberships
    WHERE professional_account_id = ${professionalId}
      AND status IN ('active', 'suspended')
    ORDER BY created_at DESC
    LIMIT 1
  `
  return rows[0] ?? null
}

export async function GET() {
  try {
    const admin = await getAdminSession()
    if (!admin.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    if (!admin.authorised) return NextResponse.json({ error: "Administrator MFA is required" }, { status: 403 })

    const professionals = await sql`
      SELECT
        p.id,
        p.display_name,
        p.professional_role,
        p.registration_body,
        p.registration_number,
        p.verification_status,
        p.claimed_organisation_name,
        p.verification_requested_at,
        p.verified_at,
        p.suspended_at,
        p.suspension_reason,
        p.offboarded_at,
        u.email,
        o.id AS organisation_id,
        o.name AS organisation_name,
        o.verification_status AS organisation_verification_status,
        m.status AS mfa_status,
        m.verified_at AS mfa_verified_at,
        latest_verification.action AS latest_verification_action,
        latest_verification.occurred_at AS latest_verification_at,
        latest_verification.metadata AS latest_verification_metadata
      FROM professional_accounts p
      JOIN users u ON u.id = p.user_id
      LEFT JOIN organisations o ON o.id = p.organisation_id
      LEFT JOIN mfa_factors m ON m.user_id = p.user_id AND m.factor_type = 'totp'
      LEFT JOIN LATERAL (
        SELECT action, occurred_at, metadata
        FROM professional_verification_events
        WHERE professional_account_id = p.id
        ORDER BY occurred_at DESC
        LIMIT 1
      ) latest_verification ON TRUE
      ORDER BY
        CASE p.verification_status WHEN 'pending' THEN 0 WHEN 'suspended' THEN 1 ELSE 2 END,
        p.verification_requested_at DESC NULLS LAST,
        p.created_at DESC
      LIMIT 200
    `

    return NextResponse.json({ professionals }, { headers: { "Cache-Control": "private, no-store, max-age=0" } })
  } catch (error) {
    console.error("[waypoint] Unable to load professional verification queue", error)
    return NextResponse.json({ error: "Unable to load professional verification queue" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const admin = await getAdminSession()
    if (!admin.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    if (!admin.authorised) return NextResponse.json({ error: "Administrator MFA is required" }, { status: 403 })

    const body = await request.json()
    const professionalId = body.professionalId
    const action = body.action
    const reason = typeof body.reason === "string" ? body.reason.trim().slice(0, 2000) : ""
    const organisationName = typeof body.organisationName === "string" ? body.organisationName.trim().slice(0, 255) : ""

    if (!looksLikeUuid(professionalId)) return NextResponse.json({ error: "Invalid professional account" }, { status: 400 })
    if (!["verify", "suspend", "offboard", "reset_mfa"].includes(action)) {
      return NextResponse.json({ error: "Invalid administrative action" }, { status: 400 })
    }
    if (["suspend", "offboard", "reset_mfa"].includes(action) && !reason) {
      return NextResponse.json({ error: "A reason is required for this security action" }, { status: 400 })
    }

    const professional = await loadProfessional(professionalId)
    if (!professional) return NextResponse.json({ error: "Professional account not found" }, { status: 404 })
    const previousStatus = professional.verification_status as string

    const membershipReady = await dbTableExists("organisation_memberships") && await dbTableExists("organisation_membership_events")
    if (["verify", "suspend", "offboard"].includes(action) && !membershipReady) {
      return NextResponse.json({ error: "Professional lifecycle actions are temporarily unavailable until the Phase 4D data update is applied" }, { status: 503 })
    }
    const openMembership = membershipReady ? await loadOpenMembership(professionalId) : null

    if (action === "verify") {
      if (professional.mfa_status !== "active") {
        return NextResponse.json({ error: "The professional must activate MFA before verification can be granted" }, { status: 409 })
      }

      const evidenceResult = validateVerificationEvidence(body.verificationEvidence)
      if (!evidenceResult.ok) {
        return NextResponse.json({ error: evidenceResult.errors[0], verificationErrors: evidenceResult.errors }, { status: 400 })
      }
      const verificationEvidence = evidenceResult.value
      const verificationNote = verificationEvidence.note

      const finalOrganisationName = organisationName || professional.organisation_name || professional.claimed_organisation_name
      if (!finalOrganisationName) return NextResponse.json({ error: "A verified organisation is required" }, { status: 400 })

      const existingOrganisations = await sql`
        SELECT id, name, verification_status
        FROM organisations
        WHERE LOWER(name) = LOWER(${finalOrganisationName})
        ORDER BY created_at ASC
        LIMIT 1
      `
      const existingOrganisation = existingOrganisations[0] ?? null
      if (existingOrganisation?.verification_status === "suspended") {
        return NextResponse.json({ error: "This organisation is suspended and must be reviewed before a professional can be verified against it" }, { status: 409 })
      }

      const organisationId = (existingOrganisation?.id as string | undefined) ?? randomUUID()
      const organisationWasExisting = Boolean(existingOrganisation)
      const organisationTransfer = isOrganisationAffiliationTransfer({
        currentOrganisationId: openMembership?.organisation_id ?? null,
        nextOrganisationId: organisationId,
      })
      const sameOpenMembership = openMembership?.organisation_id === organisationId ? openMembership : null
      const membershipId = (sameOpenMembership?.id as string | undefined) ?? randomUUID()
      const membershipAction = sameOpenMembership?.status === "suspended" ? "reactivated" : sameOpenMembership ? "verified" : "created"
      const verificationMetadata = {
        source: "admin_portal",
        organisationId,
        membershipId,
        previousOrganisationId: organisationTransfer ? openMembership?.organisation_id : null,
        consentContextReset: organisationTransfer,
        verification: verificationEvidence,
      }
      const verificationMetadataJson = JSON.stringify(verificationMetadata)

      await dbTransaction((tx) => {
        const queries: unknown[] = [
          organisationWasExisting
            ? tx`
                UPDATE organisations
                SET verification_status = 'verified', verified_at = CURRENT_TIMESTAMP,
                  verified_by_user_id = ${admin.user.id}, verification_note = ${verificationNote},
                  suspended_at = NULL, suspension_reason = NULL, updated_at = CURRENT_TIMESTAMP
                WHERE id = ${organisationId}
              `
            : tx`
                INSERT INTO organisations (
                  id, name, verification_status, verified_at, verified_by_user_id, verification_note
                ) VALUES (
                  ${organisationId}, ${finalOrganisationName}, 'verified', CURRENT_TIMESTAMP, ${admin.user.id}, ${verificationNote}
                )
              `,
        ]

        if (organisationTransfer && openMembership) {
          const transferMetadata = JSON.stringify({
            source: "admin_portal",
            previousOrganisationId: openMembership.organisation_id,
            newOrganisationId: organisationId,
            automaticAction: "connection_paused",
          })
          queries.push(
            tx`
              UPDATE organisation_memberships
              SET status = 'ended', ended_at = CURRENT_TIMESTAMP,
                status_reason = 'Affiliation transferred during professional re-verification.', updated_at = CURRENT_TIMESTAMP
              WHERE id = ${openMembership.id}
            `,
            tx`
              INSERT INTO organisation_membership_events (
                membership_id, professional_account_id, organisation_id, actor_user_id,
                action, previous_status, new_status, reason, metadata
              ) VALUES (
                ${openMembership.id}, ${professionalId}, ${openMembership.organisation_id}, ${admin.user.id},
                'transferred', ${openMembership.status}, 'ended', ${verificationNote}, ${verificationMetadataJson}::jsonb
              )
            `,
            tx`
              UPDATE professional_invitations
              SET status = 'revoked'
              WHERE professional_account_id = ${professionalId} AND status = 'active'
            `,
            tx`
              INSERT INTO access_audit_events (
                subject_user_id, actor_user_id, professional_account_id, organisation_id,
                event_type, resource_scope, purpose, metadata
              )
              SELECT
                l.client_user_id, ${admin.user.id}, ${professionalId}, ${openMembership.organisation_id},
                'professional_affiliation_changed', 'connection', 'user_privacy_control',
                jsonb_build_object(
                  'linkId', l.id,
                  'previousOrganisationId', ${openMembership.organisation_id},
                  'newOrganisationId', ${organisationId},
                  'automaticAction', 'paused'
                )
              FROM client_professional_links l
              WHERE l.professional_account_id = ${professionalId} AND l.status = 'active'
            `,
            tx`
              UPDATE client_professional_links
              SET status = 'paused', updated_at = CURRENT_TIMESTAMP
              WHERE professional_account_id = ${professionalId} AND status = 'active'
            `,
            tx`
              INSERT INTO administrative_audit_events (
                actor_user_id, action, target_type, target_id, reason, metadata
              ) VALUES (
                ${admin.user.id}, 'professional_organisation_transferred', 'professional_account', ${professionalId},
                ${verificationNote}, ${transferMetadata}::jsonb
              )
            `,
          )
        }

        if (sameOpenMembership) {
          queries.push(
            tx`
              UPDATE organisation_memberships
              SET status = 'active', role_title = ${professional.professional_role || null},
                verified_at = CURRENT_TIMESTAMP, verified_by_user_id = ${admin.user.id},
                verification_note = ${verificationNote}, suspended_at = NULL, ended_at = NULL,
                status_reason = NULL, updated_at = CURRENT_TIMESTAMP
              WHERE id = ${membershipId}
            `,
            tx`
              INSERT INTO organisation_membership_events (
                membership_id, professional_account_id, organisation_id, actor_user_id,
                action, previous_status, new_status, reason, metadata
              ) VALUES (
                ${membershipId}, ${professionalId}, ${organisationId}, ${admin.user.id},
                ${membershipAction}, ${sameOpenMembership.status}, 'active', ${verificationNote}, ${verificationMetadataJson}::jsonb
              )
            `,
          )
        } else {
          queries.push(
            tx`
              INSERT INTO organisation_memberships (
                id, professional_account_id, organisation_id, status, role_title,
                verified_at, verified_by_user_id, verification_note, started_at
              ) VALUES (
                ${membershipId}, ${professionalId}, ${organisationId}, 'active', ${professional.professional_role || null},
                CURRENT_TIMESTAMP, ${admin.user.id}, ${verificationNote}, CURRENT_TIMESTAMP
              )
            `,
            tx`
              INSERT INTO organisation_membership_events (
                membership_id, professional_account_id, organisation_id, actor_user_id,
                action, previous_status, new_status, reason, metadata
              ) VALUES (
                ${membershipId}, ${professionalId}, ${organisationId}, ${admin.user.id},
                'created', NULL, 'active', ${verificationNote}, ${verificationMetadataJson}::jsonb
              )
            `,
          )
        }

        queries.push(
          tx`
            UPDATE professional_accounts
            SET organisation_id = ${organisationId}, verification_status = 'verified',
              verified_at = CURRENT_TIMESTAMP, verified_by_user_id = ${admin.user.id},
              suspended_at = NULL, suspension_reason = NULL, offboarded_at = NULL,
              offboarding_reason = NULL, updated_at = CURRENT_TIMESTAMP
            WHERE id = ${professionalId}
          `,
          tx`
            UPDATE users
            SET security_version = COALESCE(security_version, 1) + 1, updated_at = CURRENT_TIMESTAMP
            WHERE id = ${professional.user_id}
          `,
          tx`
            INSERT INTO professional_verification_events (
              professional_account_id, actor_user_id, action, previous_status, new_status, organisation_id, reason, metadata
            ) VALUES (
              ${professionalId}, ${admin.user.id}, 'verified', ${previousStatus}, 'verified', ${organisationId}, ${verificationNote},
              ${verificationMetadataJson}::jsonb
            )
          `,
          tx`
            INSERT INTO administrative_audit_events (
              actor_user_id, action, target_type, target_id, reason, metadata
            ) VALUES (
              ${admin.user.id}, 'professional_verified', 'professional_account', ${professionalId}, ${verificationNote},
              ${verificationMetadataJson}::jsonb
            )
          `,
        )
        return queries
      })
    }

    if (action === "suspend") {
      await dbTransaction((tx) => {
        const queries: unknown[] = []
        if (openMembership?.status === "active") {
          const membershipMetadata = JSON.stringify({ source: "admin_portal", trigger: "professional_suspension" })
          queries.push(
            tx`
              UPDATE organisation_memberships
              SET status = 'suspended', suspended_at = CURRENT_TIMESTAMP,
                status_reason = ${reason}, updated_at = CURRENT_TIMESTAMP
              WHERE id = ${openMembership.id}
            `,
            tx`
              INSERT INTO organisation_membership_events (
                membership_id, professional_account_id, organisation_id, actor_user_id,
                action, previous_status, new_status, reason, metadata
              ) VALUES (
                ${openMembership.id}, ${professionalId}, ${openMembership.organisation_id}, ${admin.user.id},
                'suspended', 'active', 'suspended', ${reason}, ${membershipMetadata}::jsonb
              )
            `,
          )
        }
        queries.push(
          tx`
            UPDATE professional_accounts
            SET verification_status = 'suspended', suspended_at = CURRENT_TIMESTAMP,
              suspension_reason = ${reason}, updated_at = CURRENT_TIMESTAMP
            WHERE id = ${professionalId}
          `,
          tx`
            UPDATE professional_invitations SET status = 'revoked'
            WHERE professional_account_id = ${professionalId} AND status = 'active'
          `,
          tx`
            UPDATE client_professional_links SET status = 'paused', updated_at = CURRENT_TIMESTAMP
            WHERE professional_account_id = ${professionalId} AND status = 'active'
          `,
          tx`
            UPDATE users
            SET security_version = COALESCE(security_version, 1) + 1, updated_at = CURRENT_TIMESTAMP
            WHERE id = ${professional.user_id}
          `,
          tx`
            INSERT INTO professional_verification_events (
              professional_account_id, actor_user_id, action, previous_status, new_status, organisation_id, reason
            ) VALUES (${professionalId}, ${admin.user.id}, 'suspended', ${previousStatus}, 'suspended', ${professional.organisation_id}, ${reason})
          `,
          tx`
            INSERT INTO administrative_audit_events (actor_user_id, action, target_type, target_id, reason)
            VALUES (${admin.user.id}, 'professional_suspended', 'professional_account', ${professionalId}, ${reason})
          `,
        )
        return queries
      })
    }

    if (action === "offboard") {
      await dbTransaction((tx) => {
        const queries: unknown[] = []
        if (openMembership) {
          const membershipMetadata = JSON.stringify({ source: "admin_portal", trigger: "professional_offboarding" })
          queries.push(
            tx`
              UPDATE organisation_memberships
              SET status = 'ended', ended_at = CURRENT_TIMESTAMP,
                status_reason = ${reason}, updated_at = CURRENT_TIMESTAMP
              WHERE id = ${openMembership.id}
            `,
            tx`
              INSERT INTO organisation_membership_events (
                membership_id, professional_account_id, organisation_id, actor_user_id,
                action, previous_status, new_status, reason, metadata
              ) VALUES (
                ${openMembership.id}, ${professionalId}, ${openMembership.organisation_id}, ${admin.user.id},
                'ended', ${openMembership.status}, 'ended', ${reason}, ${membershipMetadata}::jsonb
              )
            `,
          )
        }
        queries.push(
          tx`
            UPDATE sharing_grants
            SET status = 'revoked', revoked_at = CURRENT_TIMESTAMP
            WHERE link_id IN (SELECT id FROM client_professional_links WHERE professional_account_id = ${professionalId})
              AND status = 'active'
          `,
          tx`
            UPDATE professional_invitations SET status = 'revoked'
            WHERE professional_account_id = ${professionalId} AND status = 'active'
          `,
          tx`
            UPDATE client_professional_links
            SET status = 'ended', ended_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
            WHERE professional_account_id = ${professionalId}
              AND status IN ('pending', 'active', 'paused')
          `,
          tx`
            UPDATE professional_accounts
            SET verification_status = 'suspended', suspended_at = CURRENT_TIMESTAMP,
              suspension_reason = ${reason}, offboarded_at = CURRENT_TIMESTAMP,
              offboarding_reason = ${reason}, updated_at = CURRENT_TIMESTAMP
            WHERE id = ${professionalId}
          `,
          tx`
            UPDATE mfa_factors
            SET status = 'disabled', disabled_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
            WHERE user_id = ${professional.user_id}
          `,
          tx`
            UPDATE users
            SET security_version = COALESCE(security_version, 1) + 1, updated_at = CURRENT_TIMESTAMP
            WHERE id = ${professional.user_id}
          `,
          tx`
            INSERT INTO professional_verification_events (
              professional_account_id, actor_user_id, action, previous_status, new_status, organisation_id, reason
            ) VALUES (${professionalId}, ${admin.user.id}, 'offboarded', ${previousStatus}, 'suspended', ${professional.organisation_id}, ${reason})
          `,
          tx`
            INSERT INTO administrative_audit_events (actor_user_id, action, target_type, target_id, reason)
            VALUES (${admin.user.id}, 'professional_offboarded', 'professional_account', ${professionalId}, ${reason})
          `,
        )
        return queries
      })
    }

    if (action === "reset_mfa") {
      await dbTransaction((tx) => [
        tx`
          DELETE FROM mfa_recovery_codes
          WHERE factor_id IN (SELECT id FROM mfa_factors WHERE user_id = ${professional.user_id})
        `,
        tx`
          UPDATE mfa_factors
          SET status = 'disabled', failed_attempts = 0, locked_until = NULL,
            disabled_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
          WHERE user_id = ${professional.user_id}
        `,
        tx`
          UPDATE users
          SET security_version = COALESCE(security_version, 1) + 1, updated_at = CURRENT_TIMESTAMP
          WHERE id = ${professional.user_id}
        `,
        tx`
          INSERT INTO professional_verification_events (
            professional_account_id, actor_user_id, action, previous_status, new_status, organisation_id, reason
          ) VALUES (${professionalId}, ${admin.user.id}, 'mfa_reset', ${previousStatus}, ${previousStatus}, ${professional.organisation_id}, ${reason})
        `,
        tx`
          INSERT INTO administrative_audit_events (actor_user_id, action, target_type, target_id, reason)
          VALUES (${admin.user.id}, 'professional_mfa_reset', 'professional_account', ${professionalId}, ${reason})
        `,
      ])
    }

    return NextResponse.json({ success: true, professional: await loadProfessional(professionalId) })
  } catch (error) {
    console.error("[waypoint] Professional administrative action failed", error)
    return NextResponse.json({ error: "Unable to complete professional administrative action" }, { status: 500 })
  }
}
