-- Sathus Platform Core CMS Schema
-- Supports Company Website, Products, Labs, X, and Blog configurations.
-- Run with: psql "$DATABASE_URL" -f sql/cms-schema.sql

-- Enable uuid-ossp extension for UUID generation if needed in the future
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  id            BIGSERIAL PRIMARY KEY,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  first_name    TEXT,
  last_name     TEXT,
  role          TEXT NOT NULL DEFAULT 'Writer' CHECK (role IN ('SuperAdmin', 'Editor', 'Writer')),
  status        TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Suspended', 'Pending')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. SESSIONS TABLE
CREATE TABLE IF NOT EXISTS sessions (
  id            BIGSERIAL PRIMARY KEY,
  session_token TEXT NOT NULL UNIQUE,
  user_id       BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at    TIMESTAMPTZ NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. POSTS TABLE (Blog, Documentation, Learning Center)
CREATE TABLE IF NOT EXISTS posts (
  id            BIGSERIAL PRIMARY KEY,
  slug          TEXT NOT NULL UNIQUE,
  title         TEXT NOT NULL,
  summary       TEXT NOT NULL,
  content       TEXT NOT NULL,
  status        TEXT NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft', 'Published', 'Archived')),
  category      TEXT NOT NULL CHECK (category IN ('Blog', 'Doc', 'Learning', 'LabNote')),
  author_id     BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  published_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. PRODUCTS TABLE (Products, Sathus Labs, Sathus X)
CREATE TABLE IF NOT EXISTS products (
  id            BIGSERIAL PRIMARY KEY,
  slug          TEXT NOT NULL UNIQUE,
  name          TEXT NOT NULL,
  tagline       TEXT,
  description   TEXT NOT NULL,
  version       TEXT,
  status        TEXT NOT NULL DEFAULT 'Beta' CHECK (status IN ('Ideation', 'Beta', 'Active', 'Deprecated')),
  category      TEXT NOT NULL CHECK (category IN ('CoreProduct', 'LabExperiment', 'SathusX')),
  metadata      JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. AUDIT LOGS TABLE (Compliance, Security, and System Health)
CREATE TABLE IF NOT EXISTS audit_logs (
  id            BIGSERIAL PRIMARY KEY,
  user_id       BIGINT REFERENCES users(id) ON DELETE SET NULL,
  action        TEXT NOT NULL, -- e.g., 'user.login', 'post.create', 'product.update'
  target_table  TEXT NOT NULL, -- e.g., 'users', 'posts', 'products'
  target_id     BIGINT,
  changes       JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. INDEXES FOR PERFORMANCE OPTIMIZATION
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_status_published ON posts(status, published_at DESC) WHERE status = 'Published';
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);
