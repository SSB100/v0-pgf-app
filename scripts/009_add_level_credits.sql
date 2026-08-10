-- Add level credits system to user_profiles
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS level_credits INTEGER DEFAULT 0;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS total_points_earned INTEGER DEFAULT 0;

-- Add comment explaining the system
COMMENT ON COLUMN user_profiles.level_credits IS 'Available credits that can be applied to increase tree_growth_level';
COMMENT ON COLUMN user_profiles.total_points_earned IS 'Lifetime total of all points earned (includes already applied levels)';
