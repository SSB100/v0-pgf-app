-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'client', -- 'client' or 'peer_supporter'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- User profiles with awareness and values data
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  tree_growth_level INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Core values identified during onboarding
CREATE TABLE IF NOT EXISTS user_values (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  value_name VARCHAR(255) NOT NULL,
  importance_rating INTEGER CHECK (importance_rating >= 1 AND importance_rating <= 10),
  category VARCHAR(100), -- e.g., 'relationships', 'health', 'purpose'
  is_core_value BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Awareness check-ins tracking emotional state
CREATE TABLE IF NOT EXISTS awareness_checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  emotion VARCHAR(100),
  emotion_intensity INTEGER CHECK (emotion_intensity >= 0 AND emotion_intensity <= 10),
  trigger_description TEXT,
  urge_description TEXT,
  mind_state VARCHAR(50), -- 'reasonable', 'wise', or 'emotional'
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Skills practiced by users
CREATE TABLE IF NOT EXISTS skills_practice (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  skill_name VARCHAR(255) NOT NULL, -- e.g., 'STOP', 'TIP', 'RAIN', 'Opposite Action'
  skill_category VARCHAR(100), -- 'distress_tolerance', 'emotion_regulation', 'interpersonal'
  practiced_at TIMESTAMP DEFAULT NOW(),
  effectiveness_rating INTEGER CHECK (effectiveness_rating >= 1 AND effectiveness_rating <= 5),
  notes TEXT
);

-- Problem areas and triggers
CREATE TABLE IF NOT EXISTS problem_areas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  problem_type VARCHAR(100) DEFAULT 'gambling', -- main focus but extensible
  severity INTEGER CHECK (severity >= 1 AND severity <= 10),
  triggers JSONB, -- array of trigger descriptions
  patterns TEXT,
  identified_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Daily check-ins for progress tracking
CREATE TABLE IF NOT EXISTS daily_checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  mood_rating INTEGER CHECK (mood_rating >= 1 AND mood_rating <= 10),
  urge_strength INTEGER CHECK (urge_strength >= 0 AND urge_strength <= 10),
  skills_used JSONB, -- array of skill names used today
  gambling_occurred BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- SOS alerts
CREATE TABLE IF NOT EXISTS sos_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  peer_supporter_id UUID REFERENCES users(id),
  status VARCHAR(50) DEFAULT 'active', -- 'active', 'acknowledged', 'resolved'
  created_at TIMESTAMP DEFAULT NOW(),
  acknowledged_at TIMESTAMP,
  resolved_at TIMESTAMP
);

-- Messages between clients and peer supporters
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Peer supporter assignments
CREATE TABLE IF NOT EXISTS peer_support_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  peer_supporter_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'active', -- 'active', 'paused', 'ended'
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(client_id, peer_supporter_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_values_user_id ON user_values(user_id);
CREATE INDEX IF NOT EXISTS idx_awareness_checkins_user_id ON awareness_checkins(user_id);
CREATE INDEX IF NOT EXISTS idx_awareness_checkins_created_at ON awareness_checkins(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_skills_practice_user_id ON skills_practice(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_checkins_user_id ON daily_checkins(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_checkins_date ON daily_checkins(date DESC);
CREATE INDEX IF NOT EXISTS idx_sos_alerts_user_id ON sos_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_sos_alerts_status ON sos_alerts(status);
CREATE INDEX IF NOT EXISTS idx_messages_recipient_id ON messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_peer_relationships_client ON peer_support_relationships(client_id);
