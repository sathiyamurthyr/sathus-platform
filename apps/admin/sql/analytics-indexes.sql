-- Indexes that back the optimized analytics queries in src/lib/queries.ts.
-- Run with: psql "$DATABASE_URL" -f sql/analytics-indexes.sql

-- Daily Patients / Overview: range scan + GROUP BY on visit_date.
CREATE INDEX IF NOT EXISTS idx_visits_date_type
  ON patient_visits (visit_date, visit_type);

-- Revenue: (invoice_date, department) covering the GROUP BY + range filter.
CREATE INDEX IF NOT EXISTS idx_invoices_date_dept
  ON invoices (invoice_date, department)
  WHERE status <> 'cancelled';

-- Doctor performance: join keys scoped to doctors.
CREATE INDEX IF NOT EXISTS idx_visits_doctor_date
  ON patient_visits (doctor_id, visit_date);
CREATE INDEX IF NOT EXISTS idx_invoices_doctor_date
  ON invoices (doctor_id, invoice_date);
CREATE INDEX IF NOT EXISTS idx_doctors_active_dept
  ON doctors (is_active, department);

-- Queue statistics: date filter on created_at + per-department grouping.
CREATE INDEX IF NOT EXISTS idx_queue_created_dept
  ON queue_tickets (created_at, department);

-- Bed occupancy: ward grouping / optional ward filter.
CREATE INDEX IF NOT EXISTS idx_beds_ward_status
  ON beds (ward, status);
