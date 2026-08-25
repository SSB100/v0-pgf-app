CREATE TABLE IF NOT EXISTS user_demographics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  ethnicity_responses jsonb NOT NULL DEFAULT '[]'::jsonb,
  ethnicity_response_status varchar(32) NOT NULL DEFAULT 'not_stated',
  iwi_affiliations jsonb NOT NULL DEFAULT '[]'::jsonb,
  iwi_response_status varchar(32) NOT NULL DEFAULT 'not_stated',
  collection_notice_version varchar(80) NOT NULL DEFAULT 'demographics-collection-v1',
  ethnicity_standard_version varchar(160) NOT NULL DEFAULT 'Stats NZ 2023 Census ethnicity question',
  iwi_standard_version varchar(200) NOT NULL DEFAULT 'Stats NZ 2023 Census Guide Notes iwi list / Census iwi and iwi-related groups V2.1.0',
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE user_demographics
  DROP CONSTRAINT IF EXISTS user_demographics_ethnicity_status_check;

ALTER TABLE user_demographics
  ADD CONSTRAINT user_demographics_ethnicity_status_check
  CHECK (ethnicity_response_status IN ('provided', 'not_stated', 'prefer_not_to_say'));

ALTER TABLE user_demographics
  DROP CONSTRAINT IF EXISTS user_demographics_iwi_status_check;

ALTER TABLE user_demographics
  ADD CONSTRAINT user_demographics_iwi_status_check
  CHECK (iwi_response_status IN ('provided', 'not_stated', 'dont_know', 'none', 'prefer_not_to_say'));

CREATE INDEX IF NOT EXISTS idx_user_demographics_ethnicity_status
  ON user_demographics (ethnicity_response_status);

CREATE INDEX IF NOT EXISTS idx_user_demographics_iwi_status
  ON user_demographics (iwi_response_status);
