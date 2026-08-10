-- Remove importance_rating column and use rank instead
-- rank represents the order (1 = most important, 2 = second most important, etc.)

ALTER TABLE user_values 
DROP COLUMN IF EXISTS importance_rating;

-- Ensure rank column exists
ALTER TABLE user_values 
ADD COLUMN IF NOT EXISTS rank INTEGER;

COMMENT ON COLUMN user_values.rank IS 'Order of value importance (1 = most important, 2 = second most important, etc.)';
