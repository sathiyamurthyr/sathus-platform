import { query } from './db';
import {
  BED_OCCUPANCY_SQL,
  DAILY_PATIENTS_SQL,
  DOCTOR_PERFORMANCE_SQL,
  OVERVIEW_SQL,
  QUEUE_STATISTICS_SQL,
  REVENUE_SQL,
} from './queries';
import type {
  BedOccupancyRow,
  DailyPatientsRow,
  DoctorPerformanceRow,
  OverviewRow,
  QueueStatisticsRow,
  RevenueRow,
} from './types';
import type { DateRange } from './validation';

function range(from: string, to: string): DateRange {
  return { from, to };
}

export async function getDailyPatients(from: string, to: string): Promise<DailyPatientsRow[]> {
  return query<DailyPatientsRow>(DAILY_PATIENTS_SQL, [from, to]);
}

export async function getRevenue(
  from: string,
  to: string,
  department?: string,
): Promise<RevenueRow[]> {
  return query<RevenueRow>(REVENUE_SQL, [from, to, department ?? null]);
}

export async function getDoctorPerformance(
  from: string,
  to: string,
  department?: string,
  limit = 50,
): Promise<DoctorPerformanceRow[]> {
  return query<DoctorPerformanceRow>(DOCTOR_PERFORMANCE_SQL, [
    from,
    to,
    department ?? null,
    limit,
  ]);
}

export async function getQueueStatistics(
  from: string,
  to: string,
  department?: string,
): Promise<QueueStatisticsRow[]> {
  return query<QueueStatisticsRow>(QUEUE_STATISTICS_SQL, [from, to, department ?? null]);
}

export async function getBedOccupancy(ward?: string): Promise<BedOccupancyRow[]> {
  return query<BedOccupancyRow>(BED_OCCUPANCY_SQL, [ward ?? null]);
}

export async function getOverview(from: string, to: string): Promise<OverviewRow[]> {
  return query<OverviewRow>(OVERVIEW_SQL, [from, to]);
}

export { range as buildRange };
