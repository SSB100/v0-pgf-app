-- Add onboarding progress tracking
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS onboarding_current_step INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS onboarding_data JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS onboarding_last_saved TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
