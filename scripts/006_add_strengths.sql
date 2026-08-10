-- Add strengths assessment columns to user_profiles

ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS perceived_strengths jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS identified_strengths jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS strengths_completed boolean DEFAULT false;

-- Add comment
COMMENT ON COLUMN user_profiles.perceived_strengths IS 'Strengths user believes others see in them';
COMMENT ON COLUMN user_profiles.identified_strengths IS 'Strengths user identifies in themselves';
COMMENT ON COLUMN user_profiles.strengths_completed IS 'Whether user completed the strengths assessment';
