-- Phase 4F: durable authentication abuse protection
--
-- Stores only keyed hashes of rate-limit subjects. Raw email addresses and IP
-- addresses are never written to this table.

CREATE TABLE IF NOT EXISTS auth_rate_limit_counters (
  action VARCHAR(80) NOT NULL,
  subject_hash CHAR(64) NOT NULL,
  window_started_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  window_seconds INTEGER NOT NULL CHECK (window_seconds BETWEEN 1 AND 86400),
  attempt_count INTEGER NOT NULL DEFAULT 0 CHECK (attempt_count >= 0),
  last_attempt_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (action, subject_hash)
);

CREATE INDEX IF NOT EXISTS idx_auth_rate_limit_counters_last_attempt
  ON auth_rate_limit_counters(last_attempt_at);
