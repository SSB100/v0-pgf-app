-- Add check-in streak tracking to user_profiles
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS check_in_streak INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_check_in_date DATE,
ADD COLUMN IF NOT EXISTS longest_streak INTEGER DEFAULT 0;

-- Award 1 streak to all users who completed onboarding
UPDATE user_profiles
SET 
  check_in_streak = 1,
  longest_streak = 1,
  last_check_in_date = CURRENT_DATE
WHERE onboarding_completed = true 
  AND (check_in_streak IS NULL OR check_in_streak = 0);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_streak ON user_profiles(check_in_streak, last_check_in_date);
