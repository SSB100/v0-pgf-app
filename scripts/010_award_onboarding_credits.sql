-- Award 1 level credit to all users who have completed onboarding
-- This is a one-time migration for existing users

UPDATE user_profiles
SET level_credits = 1
WHERE onboarding_completed = true
  AND (level_credits IS NULL OR level_credits = 0);

-- Verify the update
SELECT 
  user_id,
  onboarding_completed,
  tree_growth_level,
  level_credits
FROM user_profiles
WHERE onboarding_completed = true;
