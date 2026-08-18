-- Legacy signup preference and terms-tracking fields.
-- IMPORTANT: `data_consent` is a legacy column name. In the current MVP it
-- records only whether the user expressed interest in future research. It must
-- not be treated as consent to a formal study or as permission for secondary
-- research use. A formal study requires separate approved consent/versioning.
ALTER TABLE users ADD COLUMN IF NOT EXISTS data_consent BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS data_consent_date TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS terms_accepted BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS terms_accepted_date TIMESTAMP;
