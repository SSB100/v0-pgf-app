-- Community Feature Tables
-- Creates tables for anonymous community profiles, groups, messaging, and reporting

-- Community Profiles: Anonymous aliases for users
CREATE TABLE IF NOT EXISTS community_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  alias_name VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Community Groups: Journey-type based groups
CREATE TABLE IF NOT EXISTS community_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  journey_type VARCHAR(50) NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  max_members INT DEFAULT 20,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(journey_type)
);

-- Group Memberships: Track user membership in groups
CREATE TABLE IF NOT EXISTS group_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  group_id UUID NOT NULL REFERENCES community_groups(id) ON DELETE CASCADE,
  community_profile_id UUID NOT NULL REFERENCES community_profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMP DEFAULT NOW(),
  last_active_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, group_id)
);

-- Community Messages: Chat messages in groups
CREATE TABLE IF NOT EXISTS community_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES community_groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  community_profile_id UUID NOT NULL REFERENCES community_profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Community Reports: Report abusive users/messages
CREATE TABLE IF NOT EXISTS community_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES community_groups(id) ON DELETE CASCADE,
  reporter_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reported_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reported_message_id UUID REFERENCES community_messages(id) ON DELETE SET NULL,
  reason VARCHAR(100) NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'open',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Group Switch Reasons: Track why users switch groups
CREATE TABLE IF NOT EXISTS group_switch_reasons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  from_group_id UUID NOT NULL REFERENCES community_groups(id) ON DELETE CASCADE,
  to_group_id UUID NOT NULL REFERENCES community_groups(id) ON DELETE CASCADE,
  reason VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_community_profiles_user_id ON community_profiles(user_id);
CREATE INDEX idx_group_memberships_user_id ON group_memberships(user_id);
CREATE INDEX idx_group_memberships_group_id ON group_memberships(group_id);
CREATE INDEX idx_community_messages_group_id ON community_messages(group_id);
CREATE INDEX idx_community_messages_user_id ON community_messages(user_id);
CREATE INDEX idx_community_messages_created_at ON community_messages(created_at);
CREATE INDEX idx_community_reports_group_id ON community_reports(group_id);
CREATE INDEX idx_community_reports_reported_user_id ON community_reports(reported_user_id);
CREATE INDEX idx_group_switch_reasons_user_id ON group_switch_reasons(user_id);
