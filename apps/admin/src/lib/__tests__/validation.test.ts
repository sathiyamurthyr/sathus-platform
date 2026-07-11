import { describe, expect, it } from 'vitest';
import {
  bedOccupancyQuerySchema,
  dateRangeSchema,
  doctorPerformanceQuerySchema,
  revenueQuerySchema,
} from '../validation';

describe('validation schemas', () => {
  it('accepts a valid date range', () => {
    expect(dateRangeSchema.parse({ from: '2026-01-01', to: '2026-01-31' })).toEqual({
      from: '2026-01-01',
      to: '2026-01-31',
    });
  });

  it('rejects swapped date range', () => {
    expect(() => dateRangeSchema.parse({ from: '2026-02-01', to: '2026-01-01' })).toThrow();
  });

  it('rejects non-ISO dates', () => {
    expect(() => dateRangeSchema.parse({ from: '01/01/2026', to: '2026-01-02' })).toThrow();
  });

  it('defaults limit and allows optional department on revenue', () => {
    const r = revenueQuerySchema.parse({ from: '2026-01-01', to: '2026-01-02' });
    expect(r.department).toBeUndefined();
  });

  it('coerces and clamps limit', () => {
    const r = doctorPerformanceQuerySchema.parse({
      from: '2026-01-01',
      to: '2026-01-02',
      limit: '10',
    });
    expect(r.limit).toBe(10);
  });

  it('allows optional ward on bed occupancy', () => {
    expect(bedOccupancyQuerySchema.parse({})).toEqual({});
    expect(bedOccupancyQuerySchema.parse({ ward: 'ICU' })).toEqual({ ward: 'ICU' });
  });
});
