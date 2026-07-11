import { describe, expect, it } from 'vitest';
import * as queries from '../queries';

function placeholders(sql: string): number {
  const matches = sql.match(/\$\d+/g) ?? [];
  return new Set(matches).size;
}

describe('analytics SQL queries', () => {
  it('daily patients scans patient_visits with 2 params', () => {
    expect(queries.DAILY_PATIENTS_SQL).toContain('FROM patient_visits');
    expect(queries.DAILY_PATIENTS_SQL).toContain('GROUP BY v.visit_date');
    expect(placeholders(queries.DAILY_PATIENTS_SQL)).toBe(2);
  });

  it('revenue excludes cancelled and supports optional department (3 params)', () => {
    expect(queries.REVENUE_SQL).toContain('status <> \'cancelled\'');
    expect(queries.REVENUE_SQL).toContain('$3::text IS NULL OR i.department');
    expect(placeholders(queries.REVENUE_SQL)).toBe(3);
  });

  it('doctor performance uses scoped left joins and a limit (4 params)', () => {
    expect(queries.DOCTOR_PERFORMANCE_SQL).toContain('LEFT JOIN patient_visits');
    expect(queries.DOCTOR_PERFORMANCE_SQL).toContain('LIMIT $4');
    expect(placeholders(queries.DOCTOR_PERFORMANCE_SQL)).toBe(4);
  });

  it('queue statistics derives wait and service minutes', () => {
    expect(queries.QUEUE_STATISTICS_SQL).toContain('avg_wait_minutes');
    expect(queries.QUEUE_STATISTICS_SQL).toContain('avg_service_minutes');
    expect(placeholders(queries.QUEUE_STATISTICS_SQL)).toBe(3);
  });

  it('bed occupancy excludes maintenance from utilisation denominator', () => {
    expect(queries.BED_OCCUPANCY_SQL).toContain('NULLIF');
    expect(placeholders(queries.BED_OCCUPANCY_SQL)).toBe(1);
  });

  it('overview aggregates across base tables (2 params)', () => {
    expect(queries.OVERVIEW_SQL).toContain('UNION ALL');
    expect(placeholders(queries.OVERVIEW_SQL)).toBe(2);
  });
});
