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

-- Validate the broader scope rule before removing the existing production rule.
-- This avoids a window where sharing_grants has no data-scope constraint.
ALTER TABLE sharing_grants
  DROP CONSTRAINT IF EXISTS sharing_grants_data_scope_check_v2;

DO $$
DECLARE
  current_scope_constraint TEXT;
BEGIN
  SELECT pg_get_constraintdef(oid)
  INTO current_scope_constraint
  FROM pg_constraint
  WHERE conrelid = 'sharing_grants'::regclass
    AND conname = 'sharing_grants_data_scope_check';

  IF current_scope_constraint IS NULL THEN
    ALTER TABLE sharing_grants
      ADD CONSTRAINT sharing_grants_data_scope_check CHECK (data_scope IN (
        'journey_progress',
        'journey_responses',
        'daily_checkins_summary',
        'skills_practice',
        'core_values',
        'safeguards',
        'selected_reflections'
      )) NOT VALID;

    ALTER TABLE sharing_grants
      VALIDATE CONSTRAINT sharing_grants_data_scope_check;
  ELSIF POSITION('journey_responses' IN current_scope_constraint) = 0 THEN
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
      DROP CONSTRAINT sharing_grants_data_scope_check;

    ALTER TABLE sharing_grants
      RENAME CONSTRAINT sharing_grants_data_scope_check_v2
      TO sharing_grants_data_scope_check;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conrelid = 'sharing_grants'::regclass
      AND conname = 'sharing_grants_journey_history_check'
  ) THEN
    ALTER TABLE sharing_grants
      ADD CONSTRAINT sharing_grants_journey_history_check CHECK (
        data_scope <> 'journey_responses' OR include_pre_grant_data IS NOT NULL
      ) NOT VALID;
  END IF;

  ALTER TABLE sharing_grants
    VALIDATE CONSTRAINT sharing_grants_journey_history_check;
END $$;
