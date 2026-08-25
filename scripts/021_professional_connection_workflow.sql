-- Phase 2: verified professional connection workflow
-- Apply through the controlled Neon migration process only.

ALTER TABLE professional_accounts
  ADD COLUMN IF NOT EXISTS claimed_organisation_name VARCHAR(255),
  ADD COLUMN IF NOT EXISTS verification_requested_at TIMESTAMP,
  ADD COLUMN IF NOT EXISTS professional_use_version VARCHAR(80),
  ADD COLUMN IF NOT EXISTS professional_use_accepted_at TIMESTAMP;

CREATE TABLE IF NOT EXISTS professional_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_account_id UUID NOT NULL REFERENCES professional_accounts(id) ON DELETE CASCADE,
  token_hash VARCHAR(128) NOT NULL UNIQUE,
  requested_scopes JSONB NOT NULL DEFAULT '[]'::jsonb,
  status VARCHAR(30) NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'used', 'revoked', 'expired')),
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  used_at TIMESTAMP,
  used_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  CHECK (jsonb_typeof(requested_scopes) = 'array')
);

CREATE INDEX IF NOT EXISTS idx_professional_invitations_professional
  ON professional_invitations(professional_account_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_professional_invitations_status_expiry
  ON professional_invitations(status, expires_at);

COMMENT ON TABLE professional_invitations IS 'Short-lived professional-generated invitations. Only a cryptographic hash of the clear invitation token is stored.';
COMMENT ON COLUMN professional_accounts.claimed_organisation_name IS 'Organisation name supplied during professional application. This is not verified affiliation.';
COMMENT ON COLUMN professional_accounts.verification_requested_at IS 'When the professional requested Waypoint verification.';
