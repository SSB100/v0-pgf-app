-- Waypoint trust and sharing foundation
--
-- This migration creates the governance and permission primitives required
-- before professional access is enabled. It deliberately does not create a
-- public migration endpoint. Apply it through a controlled deployment/admin
-- process and verify it in staging before any pilot or production rollout.

CREATE TABLE IF NOT EXISTS organisations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  organisation_type VARCHAR(100),
  verification_status VARCHAR(30) NOT NULL DEFAULT 'unverified'
    CHECK (verification_status IN ('unverified', 'pending', 'verified', 'suspended')),
  verified_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS professional_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  organisation_id UUID REFERENCES organisations(id) ON DELETE RESTRICT,
  display_name VARCHAR(255) NOT NULL,
  professional_role VARCHAR(120),
  registration_body VARCHAR(120),
  registration_number VARCHAR(120),
  verification_status VARCHAR(30) NOT NULL DEFAULT 'unverified'
    CHECK (verification_status IN ('unverified', 'pending', 'verified', 'suspended')),
  verified_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS client_professional_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  professional_account_id UUID NOT NULL REFERENCES professional_accounts(id) ON DELETE CASCADE,
  status VARCHAR(30) NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'active', 'paused', 'ended', 'expired')),
  invited_by VARCHAR(30) NOT NULL
    CHECK (invited_by IN ('client', 'professional')),
  -- Store only a cryptographic hash of an invitation token. Never persist the
  -- clear token that is sent to a user/professional.
  invitation_token_hash VARCHAR(128),
  invitation_expires_at TIMESTAMP,
  requested_scopes JSONB NOT NULL DEFAULT '[]'::jsonb,
  invited_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  accepted_at TIMESTAMP,
  ended_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK (jsonb_typeof(requested_scopes) = 'array')
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_client_professional_open_relationship
  ON client_professional_links(client_user_id, professional_account_id)
  WHERE status IN ('pending', 'active', 'paused');

CREATE UNIQUE INDEX IF NOT EXISTS idx_client_professional_invitation_hash
  ON client_professional_links(invitation_token_hash)
  WHERE invitation_token_hash IS NOT NULL;

CREATE TABLE IF NOT EXISTS sharing_grants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id UUID NOT NULL REFERENCES client_professional_links(id) ON DELETE CASCADE,
  data_scope VARCHAR(80) NOT NULL
    CHECK (data_scope IN (
      'journey_progress',
      'daily_checkins_summary',
      'skills_practice',
      'core_values',
      'safeguards',
      'selected_reflections'
    )),
  status VARCHAR(30) NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'revoked', 'expired')),
  consent_version VARCHAR(80) NOT NULL,
  granted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP,
  revoked_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_sharing_grants_active_scope
  ON sharing_grants(link_id, data_scope)
  WHERE status = 'active';

-- Append-only history of material consent and preference decisions. Application
-- code should insert a new event rather than editing earlier events.
CREATE TABLE IF NOT EXISTS consent_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  actor_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  consent_type VARCHAR(80) NOT NULL,
  action VARCHAR(40) NOT NULL
    CHECK (action IN ('granted', 'revoked', 'updated', 'accepted', 'withdrawn', 'declined')),
  target_type VARCHAR(80),
  target_id UUID,
  scope JSONB NOT NULL DEFAULT '{}'::jsonb,
  document_version VARCHAR(80),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  occurred_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK (jsonb_typeof(scope) IN ('object', 'array')),
  CHECK (jsonb_typeof(metadata) = 'object')
);

-- Append-only record of sensitive data access and export activity. This is not
-- a substitute for infrastructure/security logs; it records application-level
-- accountability events that can later be shown to the user and governance team.
CREATE TABLE IF NOT EXISTS access_audit_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  actor_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  professional_account_id UUID REFERENCES professional_accounts(id) ON DELETE SET NULL,
  organisation_id UUID REFERENCES organisations(id) ON DELETE SET NULL,
  event_type VARCHAR(80) NOT NULL,
  resource_scope VARCHAR(120),
  purpose VARCHAR(255),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  occurred_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK (jsonb_typeof(metadata) = 'object')
);

CREATE TABLE IF NOT EXISTS policy_acceptances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  policy_type VARCHAR(80) NOT NULL,
  policy_version VARCHAR(80) NOT NULL,
  action VARCHAR(30) NOT NULL DEFAULT 'accepted'
    CHECK (action IN ('accepted', 'acknowledged', 'withdrawn', 'superseded')),
  occurred_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  CHECK (jsonb_typeof(metadata) = 'object')
);

CREATE TABLE IF NOT EXISTS privacy_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  request_type VARCHAR(40) NOT NULL
    CHECK (request_type IN ('access', 'export', 'correction', 'deletion')),
  status VARCHAR(30) NOT NULL DEFAULT 'requested'
    CHECK (status IN ('requested', 'in_review', 'completed', 'declined', 'cancelled')),
  requested_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  resolution_note TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  CHECK (jsonb_typeof(metadata) = 'object')
);

CREATE INDEX IF NOT EXISTS idx_professional_accounts_org
  ON professional_accounts(organisation_id);
CREATE INDEX IF NOT EXISTS idx_client_professional_client
  ON client_professional_links(client_user_id, status);
CREATE INDEX IF NOT EXISTS idx_client_professional_professional
  ON client_professional_links(professional_account_id, status);
CREATE INDEX IF NOT EXISTS idx_sharing_grants_link
  ON sharing_grants(link_id, status);
CREATE INDEX IF NOT EXISTS idx_consent_events_subject
  ON consent_events(subject_user_id, occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_access_audit_subject
  ON access_audit_events(subject_user_id, occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_access_audit_professional
  ON access_audit_events(professional_account_id, occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_policy_acceptances_user
  ON policy_acceptances(user_id, policy_type, occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_privacy_requests_user
  ON privacy_requests(user_id, requested_at DESC);

-- Preserve only affirmative historical research-interest signals. A legacy
-- FALSE value may simply be the column default for an account created before
-- the preference was shown, so it must not be rewritten as an explicit decline.
INSERT INTO consent_events (
  subject_user_id,
  actor_user_id,
  consent_type,
  action,
  scope,
  document_version,
  occurred_at,
  metadata
)
SELECT
  u.id,
  u.id,
  'future_research_interest',
  'granted',
  '{}'::jsonb,
  'legacy-signup-preference-v1',
  COALESCE(u.data_consent_date, u.created_at, CURRENT_TIMESTAMP),
  '{"source":"legacy_user_field","formal_research_consent":false}'::jsonb
FROM users u
WHERE u.data_consent = TRUE
  AND NOT EXISTS (
    SELECT 1
    FROM consent_events ce
    WHERE ce.subject_user_id = u.id
      AND ce.consent_type = 'future_research_interest'
      AND ce.document_version = 'legacy-signup-preference-v1'
  );

-- Historical users only have a boolean/timestamp, not the exact Terms version
-- they saw. Record that honestly instead of claiming they accepted today's
-- version. New signups are logged with explicit policy versions by the app.
INSERT INTO policy_acceptances (
  user_id,
  policy_type,
  policy_version,
  action,
  occurred_at,
  metadata
)
SELECT
  u.id,
  'terms',
  'legacy-unversioned',
  'accepted',
  COALESCE(u.terms_accepted_date, u.created_at, CURRENT_TIMESTAMP),
  '{"source":"legacy_user_field","exact_version_unknown":true}'::jsonb
FROM users u
WHERE u.terms_accepted = TRUE
  AND NOT EXISTS (
    SELECT 1
    FROM policy_acceptances pa
    WHERE pa.user_id = u.id
      AND pa.policy_type = 'terms'
      AND pa.policy_version = 'legacy-unversioned'
  );
