-- Migration to remove mind_state column from awareness_checkins
-- Mind states are now educational content only, not tracked data

ALTER TABLE awareness_checkins DROP COLUMN IF EXISTS mind_state;

-- Add a comment to the table explaining the change
COMMENT ON TABLE awareness_checkins IS 'Tracks user emotional awareness check-ins. Mind states (emotional/reasonable/wise) are taught as educational concepts but not tracked as data points.';
