-- ============================================================
-- WebGuard AI — PostgreSQL Database Schema
-- Version: 1.0.0
-- ============================================================

-- ─── Extensions ──────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── Custom Enum Types ──────────────────────────────────────
DO $$ BEGIN
    CREATE TYPE plan_type AS ENUM ('free', 'starter', 'pro', 'agency');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE subscription_status AS ENUM ('active', 'cancelled', 'past_due', 'trialing');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE seal_style AS ENUM ('badge', 'banner', 'minimal');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;


-- ─── Users ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email           VARCHAR(255) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    full_name       VARCHAR(150) NOT NULL,
    company_name    VARCHAR(255),
    plan            plan_type NOT NULL DEFAULT 'free',
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_plan ON users(plan);


-- ─── Websites (Connected Domains) ───────────────────────────
CREATE TABLE IF NOT EXISTS websites (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    domain              VARCHAR(255) NOT NULL,
    display_name        VARCHAR(255),
    is_active           BOOLEAN NOT NULL DEFAULT TRUE,
    monitoring_enabled  BOOLEAN NOT NULL DEFAULT TRUE,
    last_score          INTEGER,
    last_scanned_at     TIMESTAMPTZ,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Prevent duplicate domains per user
    CONSTRAINT uq_user_domain UNIQUE (user_id, domain)
);

CREATE INDEX IF NOT EXISTS idx_websites_user_id ON websites(user_id);
CREATE INDEX IF NOT EXISTS idx_websites_domain ON websites(domain);
CREATE INDEX IF NOT EXISTS idx_websites_monitoring ON websites(monitoring_enabled) WHERE monitoring_enabled = TRUE;


-- ─── Scan Results ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS scan_results (
    id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    website_id              UUID NOT NULL REFERENCES websites(id) ON DELETE CASCADE,
    overall_score           INTEGER NOT NULL DEFAULT 0 CHECK (overall_score >= 0 AND overall_score <= 100),
    
    -- Detailed reports stored as JSONB for flexibility
    ssl_report              JSONB NOT NULL DEFAULT '{}',
    headers_report          JSONB NOT NULL DEFAULT '{}',
    sensitive_files_report  JSONB NOT NULL DEFAULT '{}',
    full_report             JSONB NOT NULL DEFAULT '{}',
    
    -- Metadata
    scan_type               VARCHAR(20) NOT NULL DEFAULT 'manual'
                            CHECK (scan_type IN ('manual', 'scheduled', 'api')),
    scan_duration_ms        DOUBLE PRECISION,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_scan_results_website_id ON scan_results(website_id);
CREATE INDEX IF NOT EXISTS idx_scan_results_created_at ON scan_results(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_scan_results_score ON scan_results(overall_score);

-- Partial index for quick "latest scan" lookups
CREATE INDEX IF NOT EXISTS idx_scan_results_latest 
    ON scan_results(website_id, created_at DESC);


-- ─── Subscriptions ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS subscriptions (
    id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id                 UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    plan                    plan_type NOT NULL DEFAULT 'free',
    status                  subscription_status NOT NULL DEFAULT 'active',
    stripe_customer_id      VARCHAR(255),
    stripe_subscription_id  VARCHAR(255),
    current_period_start    TIMESTAMPTZ,
    current_period_end      TIMESTAMPTZ,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);


-- ─── Trust Seals ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS trust_seals (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    website_id      UUID NOT NULL UNIQUE REFERENCES websites(id) ON DELETE CASCADE,
    seal_token      VARCHAR(64) NOT NULL UNIQUE,
    style           seal_style NOT NULL DEFAULT 'badge',
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    config          JSONB NOT NULL DEFAULT '{}',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_trust_seals_token ON trust_seals(seal_token);
CREATE INDEX IF NOT EXISTS idx_trust_seals_website_id ON trust_seals(website_id);


-- ─── Updated-At Trigger ─────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();


-- ─── Seed Data (Optional) ───────────────────────────────────
-- Insert a test user (password: "webguard123")
-- Password hash generated with bcrypt
-- INSERT INTO users (email, password_hash, full_name, plan)
-- VALUES (
--     'demo@webguard.ai',
--     '$2b$12$LJ3bZzR8JcfQ2n0z8y9gUeK4GqFSIm4vY5v7h2W5r1T6xgKqJ1OKe',
--     'Demo User',
--     'pro'
-- );
