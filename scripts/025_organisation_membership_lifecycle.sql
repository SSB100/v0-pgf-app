-- Phase 4D: organisation membership and lifecycle controls
--
-- Professional verification and organisation verification are not enough on
-- their own to represent a current workforce affiliation. This migration adds
-- an explicit, auditable organisation-membership lifecycle. Existing verified
-- affiliations are preserved through a controlled backfill.

ALTER TABLE organisations
  ADD COLUMN IF NOT EXISTS suspended_at TIMESTAMP,
  ADD COLUMN IF NOT EXISTS suspension_reason TEXT;

CREATE TABLE IF NOT EXISTS organisation_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_account_id UUID NOT NULL REFERENCES professional_accounts(id) ON DELETE CASCADE,
  organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE RESTRICT,
  status VARCHAR(30) NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'suspended', 'ended')),
  role_title VARCHAR(160),
  verified_at TIMESTAMP,
  verified_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  verification_note TEXT,
  started_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  suspended_at TIMESTAMP,
  ended_at TIMESTAMP,
  status_reason TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_organisation_memberships_open_professional
  ON organisation_memberships(professional_account_id)
  WHERE status IN ('active', 'suspended');

CREATE INDEX IF NOT EXISTS idx_organisation_memberships_org_status
  ON organisation_memberships(organisation_id, status);

CREATE INDEX IF NOT EXISTS idx_organisation_memberships_professional_status
  ON organisation_memberships(professional_account_id, status);

CREATE TABLE IF NOT EXISTS organisation_membership_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  membership_id UUID NOT NULL REFERENCES organisation_memberships(id) ON DELETE CASCADE,
  professional_account_id UUID NOT NULL REFERENCES professional_accounts(id) ON DELETE CASCADE,
  organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE RESTRICT,
  actor_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(40) NOT NULL
    CHECK (action IN ('backfilled', 'created', 'verified', 'suspended', 'reactivated', 'ended', 'transferred')),
  previous_status VARCHAR(30),
  new_status VARCHAR(30),
  reason TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  occurred_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK (jsonb_typeof(metadata) = 'object')
);

CREATE INDEX IF NOT EXISTS idx_organisation_membership_events_membership
  ON organisation_membership_events(membership_id, occurred_at DESC);

CREATE INDEX IF NOT EXISTS idx_organisation_membership_events_professional
  ON organisation_membership_events(professional_account_id, occurred_at DESC);

CREATE INDEX IF NOT EXISTS idx_organisation_membership_events_organisation
  ON organisation_membership_events(organisation_id, occurred_at DESC);

-- Preserve the current approved state without pretending that migration itself
-- is a new verification event. The backfill records that the membership came
-- from the pre-Phase-4D professional/organisation approval state.
INSERT INTO organisation_memberships (
  professional_account_id,
  organisation_id,
  status,
  role_title,
  verified_at,
  verified_by_user_id,
  verification_note,
  started_at,
  suspended_at,
  status_reason
)
SELECT
  p.id,
  p.organisation_id,
  CASE
    WHEN p.verification_status = 'verified'
      AND o.verification_status = 'verified'
      AND p.offboarded_at IS NULL
    THEN 'active'
    ELSE 'suspended'
  END,
  p.professional_role,
  p.verified_at,
  p.verified_by_user_id,
  'Backfilled from the professional and organisation verification state that existed before Phase 4D.',
  COALESCE(p.verified_at, p.created_at, CURRENT_TIMESTAMP),
  CASE
    WHEN p.verification_status = 'verified'
      AND o.verification_status = 'verified'
      AND p.offboarded_at IS NULL
    THEN NULL
    ELSE COALESCE(p.suspended_at, CURRENT_TIMESTAMP)
  END,
  CASE
    WHEN p.verification_status = 'verified'
      AND o.verification_status = 'verified'
      AND p.offboarded_at IS NULL
    THEN NULL
    ELSE 'Backfilled as non-active because the professional or organisation was not in an active verified state.'
  END
FROM professional_accounts p
JOIN organisations o ON o.id = p.organisation_id
WHERE p.organisation_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1
    FROM organisation_memberships existing
    WHERE existing.professional_account_id = p.id
      AND existing.status IN ('active', 'suspended')
  );

INSERT INTO organisation_membership_events (
  membership_id,
  professional_account_id,
  organisation_id,
  actor_user_id,
  action,
  previous_status,
  new_status,
  reason,
  metadata
)
SELECT
  m.id,
  m.professional_account_id,
  m.organisation_id,
  NULL,
  'backfilled',
  NULL,
  m.status,
  'Phase 4D migration preserved the pre-existing organisation affiliation state.',
  '{"source":"phase_4d_backfill","new_verification_performed":false}'::jsonb
FROM organisation_memberships m
WHERE NOT EXISTS (
  SELECT 1
  FROM organisation_membership_events e
  WHERE e.membership_id = m.id
);
