-- Add columns for detailed gambling tracking to problem_areas table
ALTER TABLE problem_areas 
ADD COLUMN IF NOT EXISTS last_bet_date DATE,
ADD COLUMN IF NOT EXISTS gambling_forms JSONB,
ADD COLUMN IF NOT EXISTS most_used_forms JSONB,
ADD COLUMN IF NOT EXISTS illegal_gambling VARCHAR(10);

-- Create index for last_bet_date for efficient dashboard queries
CREATE INDEX IF NOT EXISTS idx_problem_areas_last_bet_date ON problem_areas(last_bet_date DESC);
