CREATE TABLE IF NOT EXISTS user_safeguard_checklist (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  safeguard_key TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT FALSE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, safeguard_key)
);
