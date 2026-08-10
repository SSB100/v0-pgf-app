-- Add growth avatar column to user profiles
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS growth_avatar VARCHAR(50) DEFAULT 'growth_tree';

-- Add comment explaining the column
COMMENT ON COLUMN user_profiles.growth_avatar IS 'The type of growth avatar chosen by the user: growth_tree, rising_phoenix, mountain_climber, ocean_guardian, or cosmic_explorer';
