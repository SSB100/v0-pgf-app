-- Add journey module completion tracking
-- Fixed user_id to use UUID type to match users table
CREATE TABLE IF NOT EXISTS journey_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  module_slug VARCHAR(255) NOT NULL,
  module_name VARCHAR(255) NOT NULL,
  completed_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, module_slug)
);

-- Added performance indexes
CREATE INDEX IF NOT EXISTS idx_journey_completions_user_id ON journey_completions(user_id);
CREATE INDEX IF NOT EXISTS idx_journey_completions_completed_at ON journey_completions(completed_at DESC);
