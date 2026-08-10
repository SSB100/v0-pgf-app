-- Add columns for tracking specific behavior types and self-harm
ALTER TABLE daily_checkins 
ADD COLUMN IF NOT EXISTS alcohol_occurred BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS substance_occurred BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS self_harm_thoughts BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS self_harm_actions BOOLEAN DEFAULT false;
