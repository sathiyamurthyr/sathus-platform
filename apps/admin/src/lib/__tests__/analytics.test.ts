import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../db', () => ({
  query: vi.fn(),
}));

import { query } from '../db';
import {
  getBedOccupancy,
  getDailyPatients,
  getDoctorPerformance,
  getOverview,
  getQueueStatistics,
  getRevenue,
} from '../analytics';

const mockedQuery = vi.mocked(query);

beforeEach(() => {
  mockedQuery.mockReset();
});

describe('analytics service', () => {
  it('getDailyPatients forwards the date range', async () => {
    mockedQuery.mockResolvedValue([{ date: '2026-01-01', completed_visits: 5 }]);
    const rows = await getDailyPatients('2026-01-01', '2026-01-31');
    expect(mockedQuery).toHaveBeenCalledWith(expect.any(String), ['2026-01-01', '2026-01-31']);
    expect(rows).toHaveLength(1);
  });

  it('getRevenue passes null when department omitted', async () => {
    await getRevenue('2026-01-01', '2026-01-31');
    expect(mockedQuery).toHaveBeenCalledWith(expect.any(String), [
      '2026-01-01',
      '2026-01-31',
      null,
    ]);
  });

  it('getDoctorPerformance passes the limit (default 50)', async () => {
    await getDoctorPerformance('2026-01-01', '2026-01-31', 'cardiology', 10);
    const params = mockedQuery.mock.calls[0][1];
    expect(params).toEqual(['2026-01-01', '2026-01-31', 'cardiology', 10]);
  });

  it('getQueueStatistics passes optional department', async () => {
    await getQueueStatistics('2026-01-01', '2026-01-31', undefined);
    expect(mockedQuery.mock.calls[0][1]).toEqual(['2026-01-01', '2026-01-31', null]);
  });

  it('getBedOccupancy passes optional ward', async () => {
    await getBedOccupancy('ICU');
    expect(mockedQuery).toHaveBeenCalledWith(expect.any(String), ['ICU']);
  });

  it('getOverview forwards the date range (2 params)', async () => {
    mockedQuery.mockResolvedValue([{ metric: 'revenue', value: 0 }]);
    await getOverview('2026-01-01', '2026-01-31');
    expect(mockedQuery.mock.calls[0][1]).toEqual(['2026-01-01', '2026-01-31']);
  });
});
