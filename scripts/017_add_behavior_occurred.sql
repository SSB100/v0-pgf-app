-- Add behavior_occurred column to support all journey types (not just gambling)
ALTER TABLE daily_checkins ADD COLUMN IF NOT EXISTS behavior_occurred BOOLEAN DEFAULT false;

-- Update existing records: copy gambling_occurred to behavior_occurred for backwards compatibility
UPDATE daily_checkins SET behavior_occurred = gambling_occurred WHERE behavior_occurred IS NULL;

-- Add comment to explain the column
COMMENT ON COLUMN daily_checkins.behavior_occurred IS 'Whether the tracked behavior occurred (gambling/drinking/using/gaming depending on journey type)';
