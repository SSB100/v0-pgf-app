-- Create table to track which skills users have read and found helpful
CREATE TABLE IF NOT EXISTS skills_completed (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  skill_slug VARCHAR(100) NOT NULL,
  was_helpful BOOLEAN NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, skill_slug)
);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_skills_completed_user ON skills_completed(user_id);

COMMENT ON TABLE skills_completed IS 'Tracks which skills users have completed and whether they found them helpful';
