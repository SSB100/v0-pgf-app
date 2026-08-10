-- Migration to support multiple journey types and addiction tracking

-- Add journey_types array to user_profiles to track what the user signed up for
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS journey_types JSONB DEFAULT '[]'::jsonb;

-- Add alcohol-specific tracking fields
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS alcohol_frequency VARCHAR(100),
ADD COLUMN IF NOT EXISTS last_drink_date DATE,
ADD COLUMN IF NOT EXISTS drinking_types JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS alcohol_triggers JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS alcohol_impact_areas JSONB DEFAULT '[]'::jsonb;

-- Add substance-specific tracking fields
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS substance_frequency VARCHAR(100),
ADD COLUMN IF NOT EXISTS last_substance_date DATE,
ADD COLUMN IF NOT EXISTS substance_types JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS substance_triggers JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS substance_impact_areas JSONB DEFAULT '[]'::jsonb;

-- Add mental health tracking fields
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS mental_health_areas JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS mental_health_frequency VARCHAR(100),
ADD COLUMN IF NOT EXISTS coping_methods JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS mental_health_support_needs JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS receiving_treatment VARCHAR(100);

-- Add personal growth tracking fields  
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS growth_goals JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS growth_motivation VARCHAR(100),
ADD COLUMN IF NOT EXISTS growth_challenges JSONB DEFAULT '[]'::jsonb;

-- Create separate problem_areas entries for different addiction types
-- Update problem_areas table to support different problem types better
ALTER TABLE problem_areas
ADD COLUMN IF NOT EXISTS frequency VARCHAR(100),
ADD COLUMN IF NOT EXISTS last_occurrence_date DATE,
ADD COLUMN IF NOT EXISTS specific_types JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS impact_areas JSONB DEFAULT '[]'::jsonb;

-- Add indexes for common queries
CREATE INDEX IF NOT EXISTS idx_user_profiles_journey_types ON user_profiles USING GIN(journey_types);
CREATE INDEX IF NOT EXISTS idx_problem_areas_problem_type ON problem_areas(problem_type);

-- Comments for documentation
COMMENT ON COLUMN user_profiles.journey_types IS 'Array of journey types: gambling, alcohol, substances, mental_health, personal_growth, gaming';
COMMENT ON COLUMN user_profiles.alcohol_frequency IS 'How often user drinks: Daily, Several times a week, Weekly, Occasionally, Currently sober';
COMMENT ON COLUMN user_profiles.substance_frequency IS 'How often user uses substances';
COMMENT ON COLUMN user_profiles.mental_health_areas IS 'Mental health areas user needs support with';
COMMENT ON COLUMN user_profiles.growth_goals IS 'Personal growth goals selected during onboarding';
