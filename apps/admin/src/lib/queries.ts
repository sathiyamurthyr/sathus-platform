/**
 * Optimized analytics SQL for the hospital admin dashboard.
 *
 * All queries are parameterised (Postgres $1, $2, ...) to avoid SQL injection
 * and to allow the planner to reuse prepared statements. Date predicates are
 * written against the indexed `date`/`created_at` columns so range scans use
 * the B-tree indexes defined in `sql/analytics-indexes.sql`.
 *
 * Numeric money columns use NUMERIC(12,2); aggregates are cast to NUMERIC and
 * rounded to avoid floating point drift in downstream charting.
 */

/**
 * Daily patient volume: completed visits, split by visit type, and unique
 * patients per calendar day. `visit_date` is a generated date column kept in
 * sync with `created_at` and indexed, so the GROUP BY is a cheap index scan.
 */
export const DAILY_PATIENTS_SQL = `
SELECT
  v.visit_date AS date,
  COUNT(*) FILTER (WHERE v.status = 'completed')            AS completed_visits,
  COUNT(*) FILTER (WHERE v.visit_type = 'opd')              AS opd,
  COUNT(*) FILTER (WHERE v.visit_type = 'ipd')              AS ipd,
  COUNT(*) FILTER (WHERE v.visit_type = 'emergency')        AS emergency,
  COUNT(DISTINCT v.patient_id)                              AS unique_patients
FROM patient_visits v
WHERE v.visit_date >= $1
  AND v.visit_date <= $2
GROUP BY v.visit_date
ORDER BY v.visit_date;
`;

/**
 * Revenue: per day/department gross, discount, recognised revenue and
 * outstanding (pending) amount. Cancelled invoices are excluded. Filtering on
 * `invoice_date` keeps the scan on the (invoice_date, department) index.
 */
export const REVENUE_SQL = `
SELECT
  i.invoice_date                               AS date,
  i.department                                 AS department,
  COUNT(*)                                     AS invoices,
  ROUND(SUM(i.amount), 2)                       AS gross,
  ROUND(SUM(i.discount), 2)                     AS discount,
  ROUND(SUM(i.paid_amount), 2)                  AS revenue,
  ROUND(SUM(i.amount - i.paid_amount)
        FILTER (WHERE i.status = 'pending'), 2) AS outstanding
FROM invoices i
WHERE i.invoice_date >= $1
  AND i.invoice_date <= $2
  AND i.status <> 'cancelled'
  AND ($3::text IS NULL OR i.department = $3)
GROUP BY i.invoice_date, i.department
ORDER BY i.invoice_date, i.department;
`;

/**
 * Doctor performance: visits, completions, revenue generated and average
 * consult minutes per active doctor. Uses LEFT JOINs scoped to the date window
 * so doctors with no activity in range still appear. Consult time is derived
 * from queue ticket timestamps (minutes).
 */
export const DOCTOR_PERFORMANCE_SQL = `
SELECT
  d.id                                                   AS doctor_id,
  d.name                                                 AS name,
  d.department                                           AS department,
  COUNT(v.id)                                            AS total_visits,
  COUNT(v.id) FILTER (WHERE v.status = 'completed')      AS completed,
  ROUND(SUM(i.paid_amount), 2)                           AS revenue_generated,
  ROUND(AVG(EXTRACT(EPOCH FROM (q.completed_at - q.called_at)) / 60)
        FILTER (WHERE q.completed_at IS NOT NULL
                AND q.called_at IS NOT NULL), 2)          AS avg_consult_minutes
FROM doctors d
LEFT JOIN patient_visits v
  ON v.doctor_id = d.id
 AND v.visit_date BETWEEN $1 AND $2
LEFT JOIN invoices i
  ON i.doctor_id = d.id
 AND i.invoice_date BETWEEN $1 AND $2
 AND i.status <> 'cancelled'
LEFT JOIN queue_tickets q
  ON q.doctor_id = d.id
 AND q.completed_at::date BETWEEN $1 AND $2
WHERE d.is_active
  AND ($3::text IS NULL OR d.department = $3)
GROUP BY d.id, d.name, d.department
ORDER BY total_visits DESC
LIMIT $4;
`;

/**
 * Queue statistics: per-department ticket disposition plus average wait and
 * service times (minutes). Wait = called_at - created_at; service =
 * completed_at - called_at. Filtered on `created_at` date for index usage.
 */
export const QUEUE_STATISTICS_SQL = `
SELECT
  q.department                                            AS department,
  COUNT(*) FILTER (WHERE q.status = 'waiting')            AS waiting,
  COUNT(*) FILTER (WHERE q.status = 'in_consult')         AS in_consult,
  COUNT(*) FILTER (WHERE q.status = 'completed')          AS completed,
  COUNT(*) FILTER (WHERE q.status = 'cancelled')          AS cancelled,
  ROUND(AVG(EXTRACT(EPOCH FROM (q.called_at - q.created_at)) / 60)
        FILTER (WHERE q.called_at IS NOT NULL), 2)        AS avg_wait_minutes,
  ROUND(AVG(EXTRACT(EPOCH FROM (q.completed_at - q.called_at)) / 60)
        FILTER (WHERE q.completed_at IS NOT NULL
                AND q.called_at IS NOT NULL), 2)          AS avg_service_minutes
FROM queue_tickets q
WHERE q.created_at::date BETWEEN $1 AND $2
  AND ($3::text IS NULL OR q.department = $3)
GROUP BY q.department
ORDER BY waiting DESC;
`;

/**
 * Bed occupancy: real-time utilisation by ward. Occupancy rate excludes beds
 * under maintenance from the denominator to reflect usable capacity.
 */
export const BED_OCCUPANCY_SQL = `
SELECT
  b.ward                                            AS ward,
  COUNT(*)                                          AS total_beds,
  COUNT(*) FILTER (WHERE b.status = 'occupied')     AS occupied,
  COUNT(*) FILTER (WHERE b.status = 'available')    AS available,
  COUNT(*) FILTER (WHERE b.status = 'maintenance')  AS maintenance,
  ROUND(100.0 * COUNT(*) FILTER (WHERE b.status = 'occupied')
        / NULLIF(COUNT(*) FILTER (WHERE b.status <> 'maintenance'), 0), 2)
                                                       AS occupancy_rate
FROM beds b
WHERE ($1::text IS NULL OR b.ward = $1)
GROUP BY b.ward
ORDER BY occupancy_rate DESC NULLS LAST;
`;

/**
 * Overview: single-row key performance indicators for the date range, computed
 * from the same base tables. Cheap aggregates over indexed columns.
 */
export const OVERVIEW_SQL = `
WITH kpis AS (
  SELECT
    (SELECT COUNT(*) FROM patient_visits v
       WHERE v.visit_date BETWEEN $1 AND $2)                         AS total_visits,
    (SELECT COUNT(DISTINCT patient_id) FROM patient_visits v
       WHERE v.visit_date BETWEEN $1 AND $2)                         AS unique_patients,
    (SELECT COALESCE(SUM(paid_amount), 0) FROM invoices i
       WHERE i.invoice_date BETWEEN $1 AND $2 AND i.status <> 'cancelled')
                                                                     AS revenue,
    (SELECT COUNT(*) FROM queue_tickets q
       WHERE q.created_at::date BETWEEN $1 AND $2
         AND q.status = 'waiting')                                   AS queue_waiting
)
SELECT 'total_visits'   AS metric, total_visits::bigint     AS value FROM kpis
UNION ALL
SELECT 'unique_patients', unique_patients::bigint            FROM kpis
UNION ALL
SELECT 'revenue',         revenue::bigint                    FROM kpis
UNION ALL
SELECT 'queue_waiting',   queue_waiting::bigint              FROM kpis
UNION ALL
SELECT 'bed_occupancy_rate',
       COALESCE(
         ROUND(100.0 * SUM((b.status = 'occupied')::int)
               / NULLIF(SUM((b.status <> 'maintenance')::int), 0), 2), 0)
FROM beds b;
`;
