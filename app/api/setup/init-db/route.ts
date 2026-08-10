import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    const sql = neon(process.env.NEON_DATABASE_URL!)

    // Users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        full_name VARCHAR(255),
        role VARCHAR(50) DEFAULT 'client',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `

    // User profiles
    await sql`
      CREATE TABLE IF NOT EXISTS user_profiles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        onboarding_completed BOOLEAN DEFAULT FALSE,
        tree_growth_level INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(user_id)
      )
    `

    // Core values
    await sql`
      CREATE TABLE IF NOT EXISTS user_values (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        value_name VARCHAR(255) NOT NULL,
        importance_rating INTEGER CHECK (importance_rating >= 1 AND importance_rating <= 10),
        category VARCHAR(100),
        is_core_value BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `

    // Awareness check-ins
    await sql`
      CREATE TABLE IF NOT EXISTS awareness_checkins (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        emotion VARCHAR(100),
        emotion_intensity INTEGER CHECK (emotion_intensity >= 0 AND emotion_intensity <= 10),
        trigger_description TEXT,
        urge_description TEXT,
        mind_state VARCHAR(50),
        notes TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `

    // Skills practice
    await sql`
      CREATE TABLE IF NOT EXISTS skills_practice (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        skill_name VARCHAR(255) NOT NULL,
        skill_category VARCHAR(100),
        practiced_at TIMESTAMP DEFAULT NOW(),
        effectiveness_rating INTEGER CHECK (effectiveness_rating >= 1 AND effectiveness_rating <= 5),
        notes TEXT
      )
    `

    // Problem areas
    await sql`
      CREATE TABLE IF NOT EXISTS problem_areas (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        problem_type VARCHAR(100) DEFAULT 'gambling',
        severity INTEGER CHECK (severity >= 1 AND severity >= 10),
        triggers JSONB,
        patterns TEXT,
        identified_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `

    // Daily check-ins
    await sql`
      CREATE TABLE IF NOT EXISTS daily_checkins (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        date DATE NOT NULL,
        mood_rating INTEGER CHECK (mood_rating >= 1 AND mood_rating <= 10),
        urge_strength INTEGER CHECK (urge_strength >= 0 AND urge_strength <= 10),
        skills_used JSONB,
        gambling_occurred BOOLEAN DEFAULT FALSE,
        notes TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(user_id, date)
      )
    `

    // SOS alerts
    await sql`
      CREATE TABLE IF NOT EXISTS sos_alerts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        peer_supporter_id UUID REFERENCES users(id),
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT NOW(),
        acknowledged_at TIMESTAMP,
        resolved_at TIMESTAMP
      )
    `

    // Messages
    await sql`
      CREATE TABLE IF NOT EXISTS messages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        recipient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `

    // Peer support relationships
    await sql`
      CREATE TABLE IF NOT EXISTS peer_support_relationships (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        client_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        peer_supporter_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(client_id, peer_supporter_id)
      )
    `

    // Create indexes - each in separate statement
    await sql`CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id)`
    await sql`CREATE INDEX IF NOT EXISTS idx_user_values_user_id ON user_values(user_id)`
    await sql`CREATE INDEX IF NOT EXISTS idx_awareness_checkins_user_id ON awareness_checkins(user_id)`
    await sql`CREATE INDEX IF NOT EXISTS idx_awareness_checkins_created_at ON awareness_checkins(created_at DESC)`
    await sql`CREATE INDEX IF NOT EXISTS idx_skills_practice_user_id ON skills_practice(user_id)`
    await sql`CREATE INDEX IF NOT EXISTS idx_daily_checkins_user_id ON daily_checkins(user_id)`
    await sql`CREATE INDEX IF NOT EXISTS idx_daily_checkins_date ON daily_checkins(date DESC)`
    await sql`CREATE INDEX IF NOT EXISTS idx_sos_alerts_user_id ON sos_alerts(user_id)`
    await sql`CREATE INDEX IF NOT EXISTS idx_sos_alerts_status ON sos_alerts(status)`
    await sql`CREATE INDEX IF NOT EXISTS idx_messages_recipient_id ON messages(recipient_id)`
    await sql`CREATE INDEX IF NOT EXISTS idx_peer_relationships_client ON peer_support_relationships(client_id)`

    return NextResponse.json({
      success: true,
      message: "Database initialized successfully",
    })
  } catch (error: any) {
    console.error("[v0] Database initialization error:", error)
    return NextResponse.json({ error: "Failed to initialize database", details: error.message }, { status: 500 })
  }
}
