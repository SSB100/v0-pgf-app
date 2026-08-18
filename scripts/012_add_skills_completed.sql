-- Create table to track which skills users have read and found helpful.
-- users.id is UUID, so the foreign key must use UUID as well.
CREATE TABLE IF NOT EXISTS skills_completed (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  skill_slug VARCHAR(100) NOT NULL,
  was_helpful BOOLEAN NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, skill_slug)
);

CREATE INDEX IF NOT EXISTS idx_skills_completed_user ON skills_completed(user_id);

COMMENT ON TABLE skills_completed IS 'Tracks which Waypoint skills users have completed and whether they reported finding them helpful';
