-- Add new fields to daily_checkins table
ALTER TABLE daily_checkins 
ADD COLUMN IF NOT EXISTS overall_rating INTEGER,
ADD COLUMN IF NOT EXISTS bad_things TEXT,
ADD COLUMN IF NOT EXISTS good_things TEXT;
