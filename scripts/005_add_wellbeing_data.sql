-- Add columns for physical harm, substance use, and gaming data

ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS self_harm_thoughts TEXT,
ADD COLUMN IF NOT EXISTS self_harm_actions TEXT,
ADD COLUMN IF NOT EXISTS suicidal_thoughts TEXT,
ADD COLUMN IF NOT EXISTS alcohol_use TEXT,
ADD COLUMN IF NOT EXISTS drug_use TEXT,
ADD COLUMN IF NOT EXISTS substance_gambling_link TEXT,
ADD COLUMN IF NOT EXISTS substance_mental_health_link TEXT,
ADD COLUMN IF NOT EXISTS plays_video_games BOOLEAN,
ADD COLUMN IF NOT EXISTS gaming_frequency TEXT,
ADD COLUMN IF NOT EXISTS gaming_impact TEXT,
ADD COLUMN IF NOT EXISTS loot_box_exposure TEXT,
ADD COLUMN IF NOT EXISTS in_game_purchases TEXT;
