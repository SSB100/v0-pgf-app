import { sql } from "@/lib/db"

export type GovernanceTable =
  | "organisations"
  | "professional_accounts"
  | "client_professional_links"
  | "sharing_grants"
  | "consent_events"
  | "access_audit_events"
  | "policy_acceptances"
  | "privacy_requests"

export async function governanceTableExists(table: GovernanceTable) {
  const result = await sql`SELECT to_regclass(${`public.${table}`}) AS relation_name`
  return Boolean(result[0]?.relation_name)
}

type ConsentEventInput = {
  subjectUserId: string
  actorUserId?: string | null
  consentType: string
  action: "granted" | "revoked" | "updated" | "accepted" | "withdrawn" | "declined"
  targetType?: string | null
  targetId?: string | null
  scope?: Record<string, unknown> | unknown[]
  documentVersion?: string | null
  metadata?: Record<string, unknown>
}

export async function recordConsentEvent(input: ConsentEventInput) {
  if (!(await governanceTableExists("consent_events"))) return false

  await sql`
    INSERT INTO consent_events (
      subject_user_id,
      actor_user_id,
      consent_type,
      action,
      target_type,
      target_id,
      scope,
      document_version,
      metadata
    )
    VALUES (
      ${input.subjectUserId},
      ${input.actorUserId ?? null},
      ${input.consentType},
      ${input.action},
      ${input.targetType ?? null},
      ${input.targetId ?? null},
      ${JSON.stringify(input.scope ?? {})}::jsonb,
      ${input.documentVersion ?? null},
      ${JSON.stringify(input.metadata ?? {})}::jsonb
    )
  `

  return true
}

type AccessAuditInput = {
  subjectUserId: string
  actorUserId?: string | null
  professionalAccountId?: string | null
  organisationId?: string | null
  eventType: string
  resourceScope?: string | null
  purpose?: string | null
  metadata?: Record<string, unknown>
}

export async function recordAccessAuditEvent(input: AccessAuditInput) {
  if (!(await governanceTableExists("access_audit_events"))) return false

  await sql`
    INSERT INTO access_audit_events (
      subject_user_id,
      actor_user_id,
      professional_account_id,
      organisation_id,
      event_type,
      resource_scope,
      purpose,
      metadata
    )
    VALUES (
      ${input.subjectUserId},
      ${input.actorUserId ?? null},
      ${input.professionalAccountId ?? null},
      ${input.organisationId ?? null},
      ${input.eventType},
      ${input.resourceScope ?? null},
      ${input.purpose ?? null},
      ${JSON.stringify(input.metadata ?? {})}::jsonb
    )
  `

  return true
}
