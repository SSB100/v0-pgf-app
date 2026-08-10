-- Comprehensive migration to add all missing columns

-- Add columns to problem_areas table
ALTER TABLE problem_areas 
ADD COLUMN IF NOT EXISTS last_bet_date DATE,
ADD COLUMN IF NOT EXISTS gambling_forms JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS most_used_forms JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS illegal_gambling VARCHAR(50);

-- Add columns to user_profiles table for wellbeing data
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS choice_points JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS perceived_strengths JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS identified_strengths JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS strengths_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS self_harm_thoughts VARCHAR(100),
ADD COLUMN IF NOT EXISTS self_harm_actions VARCHAR(100),
ADD COLUMN IF NOT EXISTS suicidal_thoughts VARCHAR(100),
ADD COLUMN IF NOT EXISTS alcohol_use VARCHAR(100),
ADD COLUMN IF NOT EXISTS drug_use VARCHAR(100),
ADD COLUMN IF NOT EXISTS substance_gambling_link VARCHAR(100),
ADD COLUMN IF NOT EXISTS substance_mental_health_link VARCHAR(100),
ADD COLUMN IF NOT EXISTS plays_video_games BOOLEAN,
ADD COLUMN IF NOT EXISTS gaming_frequency VARCHAR(100),
ADD COLUMN IF NOT EXISTS gaming_impact VARCHAR(100),
ADD COLUMN IF NOT EXISTS loot_box_exposure VARCHAR(100),
ADD COLUMN IF NOT EXISTS in_game_purchases VARCHAR(100);

-- Add column to user_values for ranking
ALTER TABLE user_values
ADD COLUMN IF NOT EXISTS rank INTEGER;

-- Create index on last_bet_date for tracking
CREATE INDEX IF NOT EXISTS idx_problem_areas_last_bet ON problem_areas(last_bet_date DESC);

-- Create index on perceived/identified strengths for queries
CREATE INDEX IF NOT EXISTS idx_user_profiles_strengths ON user_profiles(strengths_completed);

COMMENT ON COLUMN problem_areas.last_bet_date IS 'Date of most recent gambling activity';
COMMENT ON COLUMN problem_areas.gambling_forms IS 'Array of gambling types used (e.g., Lotto, Sports Betting, Pokies)';
COMMENT ON COLUMN problem_areas.most_used_forms IS 'Array of most frequently used gambling types';
COMMENT ON COLUMN problem_areas.illegal_gambling IS 'Response to illegal gambling participation question';
COMMENT ON COLUMN user_profiles.choice_points IS 'Array of recognized choice points from onboarding';
COMMENT ON COLUMN user_profiles.perceived_strengths IS 'Strengths others might see in the user';
COMMENT ON COLUMN user_profiles.identified_strengths IS 'Strengths the user identifies in themselves';
COMMENT ON COLUMN user_profiles.self_harm_thoughts IS 'Self-harm thoughts assessment';
COMMENT ON COLUMN user_profiles.suicidal_thoughts IS 'Suicidal thoughts assessment';
COMMENT ON COLUMN user_profiles.alcohol_use IS 'Alcohol use frequency assessment';
COMMENT ON COLUMN user_profiles.drug_use IS 'Drug use frequency assessment';
COMMENT ON COLUMN user_profiles.substance_gambling_link IS 'Connection between substance use and gambling';
COMMENT ON COLUMN user_profiles.substance_mental_health_link IS 'Connection between substance use and mental health';
COMMENT ON COLUMN user_profiles.plays_video_games IS 'Whether user plays video games';
COMMENT ON COLUMN user_profiles.gaming_frequency IS 'Video gaming frequency';
COMMENT ON COLUMN user_profiles.gaming_impact IS 'Impact of video gaming on life';
COMMENT ON COLUMN user_profiles.loot_box_exposure IS 'Exposure to loot boxes in games';
COMMENT ON COLUMN user_profiles.in_game_purchases IS 'In-game purchase behavior';
COMMENT ON COLUMN user_values.rank IS 'Ranking of value importance (1 = most important)';
