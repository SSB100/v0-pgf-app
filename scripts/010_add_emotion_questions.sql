-- Migration to add emotion tracking questions to daily_checkins table
-- These questions help users reflect on their emotional experiences throughout the day

ALTER TABLE daily_checkins ADD COLUMN IF NOT EXISTS emotions_felt TEXT[];
ALTER TABLE daily_checkins ADD COLUMN IF NOT EXISTS strongest_emotion VARCHAR(100);
ALTER TABLE daily_checkins ADD COLUMN IF NOT EXISTS emotion_context TEXT;

-- Add comments for clarity
COMMENT ON COLUMN daily_checkins.emotions_felt IS 'Array of emotions the user experienced during the day';
COMMENT ON COLUMN daily_checkins.strongest_emotion IS 'The most intense/dominant emotion they felt';
COMMENT ON COLUMN daily_checkins.emotion_context IS 'Description of what was happening when they felt the strongest emotion';
