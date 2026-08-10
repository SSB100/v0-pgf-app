-- Add SOS configuration to user_profiles
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS sos_contact_number VARCHAR(20),
ADD COLUMN IF NOT EXISTS sos_service_type VARCHAR(50), -- 'pgf_contact' or 'direct_notification' (future)
ADD COLUMN IF NOT EXISTS sos_configured BOOLEAN DEFAULT FALSE;
