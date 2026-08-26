-- Phase 5C: privately persist current completed Journey responses and add an
-- explicitly consented professional sharing scope with a clear history mode.

CREATE TABLE IF NOT EXISTS journey_module_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  module_slug VARCHAR(255) NOT NULL,
  module_name VARCHAR(255) NOT NULL,
  content_id VARCHAR(255) NOT NULL,
  content_version VARCHAR(64) NOT NULL,
  content_registry_revision VARCHAR(64) NOT NULL,
  response_schema_version VARCHAR(64) NOT NULL,
  response_data JSONB NOT NULL,
  last_completed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, module_slug),
  CHECK (jsonb_typeof(response_data) = 'object')
);

CREATE INDEX IF NOT EXISTS idx_journey_module_responses_user_completed
  ON journey_module_responses(user_id, last_completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_journey_module_responses_content_version
  ON journey_module_responses(content_id, content_version);

ALTER TABLE sharing_grants
  ADD COLUMN IF NOT EXISTS include_pre_grant_data BOOLEAN;

-- Validate the broader scope rule while the existing production rule remains active.
-- The temporary constraint name makes this sequence safe to rerun without a
-- procedural block and avoids a window with no data-scope constraint.
ALTER TABLE sharing_grants
  DROP CONSTRAINT IF EXISTS sharing_grants_data_scope_check_v2;

ALTER TABLE sharing_grants
  ADD CONSTRAINT sharing_grants_data_scope_check_v2 CHECK (data_scope IN (
    'journey_progress',
    'journey_responses',
    'daily_checkins_summary',
    'skills_practice',
    'core_values',
    'safeguards',
    'selected_reflections'
  )) NOT VALID;

ALTER TABLE sharing_grants
  VALIDATE CONSTRAINT sharing_grants_data_scope_check_v2;

ALTER TABLE sharing_grants
  DROP CONSTRAINT IF EXISTS sharing_grants_data_scope_check;

ALTER TABLE sharing_grants
  RENAME CONSTRAINT sharing_grants_data_scope_check_v2
  TO sharing_grants_data_scope_check;

-- Apply the Journey-history rule with the same validate-before-replace pattern.
ALTER TABLE sharing_grants
  DROP CONSTRAINT IF EXISTS sharing_grants_journey_history_check_v2;

ALTER TABLE sharing_grants
  ADD CONSTRAINT sharing_grants_journey_history_check_v2 CHECK (
    data_scope <> 'journey_responses' OR include_pre_grant_data IS NOT NULL
  ) NOT VALID;

ALTER TABLE sharing_grants
  VALIDATE CONSTRAINT sharing_grants_journey_history_check_v2;

ALTER TABLE sharing_grants
  DROP CONSTRAINT IF EXISTS sharing_grants_journey_history_check;

ALTER TABLE sharing_grants
  RENAME CONSTRAINT sharing_grants_journey_history_check_v2
  TO sharing_grants_journey_history_check;
