-- Add column to store all emotions from check-ins
ALTER TABLE awareness_checkins ADD COLUMN IF NOT EXISTS all_emotions JSONB;
ALTER TABLE awareness_checkins ADD COLUMN IF NOT EXISTS strongest_emotion VARCHAR(100);
ALTER TABLE awareness_checkins ADD COLUMN IF NOT EXISTS situation_context TEXT;

-- Comment to describe the new structure
COMMENT ON COLUMN awareness_checkins.all_emotions IS 'Array of all emotions selected during the awareness practice';
COMMENT ON COLUMN awareness_checkins.strongest_emotion IS 'The primary/strongest emotion identified';
COMMENT ON COLUMN awareness_checkins.situation_context IS 'Description of the situation when the emotion occurred';
