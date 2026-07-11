-- Hospital analytics schema for the admin dashboard.
-- Run with: psql "$DATABASE_URL" -f sql/analytics-schema.sql

CREATE TABLE IF NOT EXISTS doctors (
  id           BIGSERIAL PRIMARY KEY,
  name         TEXT NOT NULL,
  department   TEXT NOT NULL,
  specialization TEXT,
  is_active    BOOLEAN NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS patient_visits (
  id          BIGSERIAL PRIMARY KEY,
  patient_id  BIGINT NOT NULL,
  doctor_id   BIGINT REFERENCES doctors(id),
  department  TEXT NOT NULL,
  visit_type  TEXT NOT NULL CHECK (visit_type IN ('opd','ipd','emergency')),
  status      TEXT NOT NULL DEFAULT 'completed',
  visit_date  DATE NOT NULL GENERATED ALWAYS AS (created_at::date) STORED,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS invoices (
  id           BIGSERIAL PRIMARY KEY,
  patient_id   BIGINT NOT NULL,
  doctor_id    BIGINT REFERENCES doctors(id),
  department   TEXT NOT NULL,
  amount       NUMERIC(12,2) NOT NULL DEFAULT 0,
  discount     NUMERIC(12,2) NOT NULL DEFAULT 0,
  paid_amount  NUMERIC(12,2) NOT NULL DEFAULT 0,
  status       TEXT NOT NULL DEFAULT 'pending'
                 CHECK (status IN ('paid','pending','cancelled')),
  invoice_date DATE NOT NULL GENERATED ALWAYS AS (created_at::date) STORED,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS queue_tickets (
  id           BIGSERIAL PRIMARY KEY,
  patient_id   BIGINT NOT NULL,
  doctor_id    BIGINT REFERENCES doctors(id),
  department   TEXT NOT NULL,
  status       TEXT NOT NULL DEFAULT 'waiting'
                 CHECK (status IN ('waiting','in_consult','completed','cancelled')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  called_at    TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS beds (
  id          BIGSERIAL PRIMARY KEY,
  ward        TEXT NOT NULL,
  bed_number  TEXT NOT NULL,
  status      TEXT NOT NULL DEFAULT 'available'
                CHECK (status IN ('available','occupied','maintenance')),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
