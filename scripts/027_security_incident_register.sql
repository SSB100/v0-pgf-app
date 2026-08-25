-- Phase 4G: incident response and privacy-breach readiness

CREATE TABLE IF NOT EXISTS security_incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(180) NOT NULL,
  incident_type VARCHAR(40) NOT NULL CHECK (incident_type IN ('privacy', 'security', 'availability', 'integrity', 'supplier', 'other')),
  status VARCHAR(30) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'contained', 'monitoring', 'closed')),
  severity VARCHAR(20) NOT NULL DEFAULT 'moderate' CHECK (severity IN ('low', 'moderate', 'high', 'critical')),
  summary TEXT NOT NULL,
  detected_at TIMESTAMP NOT NULL,
  contained_at TIMESTAMP,
  closed_at TIMESTAMP,
  affected_people_estimate INTEGER CHECK (affected_people_estimate IS NULL OR affected_people_estimate >= 0),
  personal_information_involved BOOLEAN NOT NULL DEFAULT FALSE,
  health_information_involved BOOLEAN NOT NULL DEFAULT FALSE,
  maori_data_involved BOOLEAN NOT NULL DEFAULT FALSE,
  serious_harm_assessment VARCHAR(30) NOT NULL DEFAULT 'not_assessed' CHECK (serious_harm_assessment IN ('not_assessed', 'unlikely', 'possible', 'likely')),
  opc_notification_status VARCHAR(30) NOT NULL DEFAULT 'not_assessed' CHECK (opc_notification_status IN ('not_assessed', 'not_required', 'planned', 'notified')),
  opc_notified_at TIMESTAMP,
  affected_people_notification_status VARCHAR(30) NOT NULL DEFAULT 'not_assessed' CHECK (affected_people_notification_status IN ('not_assessed', 'not_required', 'planned', 'notified', 'exception_applied')),
  affected_people_notified_at TIMESTAMP,
  containment_summary TEXT,
  notification_decision_reason TEXT,
  policy_version VARCHAR(80) NOT NULL,
  created_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  updated_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS security_incident_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_id UUID NOT NULL REFERENCES security_incidents(id) ON DELETE CASCADE,
  actor_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  event_type VARCHAR(80) NOT NULL,
  note TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_security_incidents_status_updated
  ON security_incidents(status, updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_security_incident_events_incident_created
  ON security_incident_events(incident_id, created_at DESC);
