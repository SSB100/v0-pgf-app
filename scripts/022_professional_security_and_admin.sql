-- Phase 3: professional strong authentication, administrative verification and session revocation.
-- Apply only through the controlled Neon migration workflow.

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS security_version INTEGER NOT NULL DEFAULT 1;

ALTER TABLE professional_accounts
  ADD COLUMN IF NOT EXISTS verified_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS suspended_at TIMESTAMP,
  ADD COLUMN IF NOT EXISTS suspension_reason TEXT,
  ADD COLUMN IF NOT EXISTS offboarded_at TIMESTAMP,
  ADD COLUMN IF NOT EXISTS offboarding_reason TEXT;

ALTER TABLE organisations
  ADD COLUMN IF NOT EXISTS verified_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS verification_note TEXT;

CREATE TABLE IF NOT EXISTS mfa_factors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  factor_type VARCHAR(30) NOT NULL DEFAULT 'totp' CHECK (factor_type = 'totp'),
  status VARCHAR(30) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'disabled')),
  secret_ciphertext TEXT NOT NULL,
  secret_iv TEXT NOT NULL,
  secret_auth_tag TEXT NOT NULL,
  failed_attempts INTEGER NOT NULL DEFAULT 0 CHECK (failed_attempts >= 0),
  locked_until TIMESTAMP,
  setup_started_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  verified_at TIMESTAMP,
  last_verified_at TIMESTAMP,
  disabled_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS mfa_recovery_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  factor_id UUID NOT NULL REFERENCES mfa_factors(id) ON DELETE CASCADE,
  code_hash VARCHAR(128) NOT NULL UNIQUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  used_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS administrative_audit_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  target_type VARCHAR(80) NOT NULL,
  target_id UUID,
  reason TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  occurred_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK (jsonb_typeof(metadata) = 'object')
);

CREATE TABLE IF NOT EXISTS professional_verification_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_account_id UUID NOT NULL REFERENCES professional_accounts(id) ON DELETE CASCADE,
  actor_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(40) NOT NULL CHECK (action IN ('verified', 'suspended', 'offboarded', 'mfa_reset', 'organisation_linked')),
  previous_status VARCHAR(30),
  new_status VARCHAR(30),
  organisation_id UUID REFERENCES organisations(id) ON DELETE SET NULL,
  reason TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  occurred_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK (jsonb_typeof(metadata) = 'object')
);

CREATE INDEX IF NOT EXISTS idx_mfa_factors_user_status
  ON mfa_factors(user_id, status);
CREATE INDEX IF NOT EXISTS idx_mfa_recovery_factor_unused
  ON mfa_recovery_codes(factor_id, used_at);
CREATE INDEX IF NOT EXISTS idx_admin_audit_actor_time
  ON administrative_audit_events(actor_user_id, occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_audit_target
  ON administrative_audit_events(target_type, target_id, occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_professional_verification_events_account
  ON professional_verification_events(professional_account_id, occurred_at DESC);

COMMENT ON COLUMN users.security_version IS 'Increment to invalidate previously issued Waypoint sessions after a security-sensitive account change.';
COMMENT ON TABLE mfa_factors IS 'Encrypted strong-authentication factors. TOTP secrets must never be stored in plaintext.';
COMMENT ON TABLE mfa_recovery_codes IS 'One-time MFA recovery codes stored only as keyed hashes.';
COMMENT ON TABLE administrative_audit_events IS 'Append-only record of privileged Waypoint administrative actions.';
