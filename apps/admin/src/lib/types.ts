export interface DailyPatientsRow {
  date: string;
  completed_visits: number;
  opd: number;
  ipd: number;
  emergency: number;
  unique_patients: number;
}

export interface RevenueRow {
  date: string;
  department: string;
  invoices: number;
  gross: number;
  discount: number;
  revenue: number;
  outstanding: number;
}

export interface DoctorPerformanceRow {
  doctor_id: number;
  name: string;
  department: string;
  total_visits: number;
  completed: number;
  revenue_generated: number;
  avg_consult_minutes: number | null;
}

export interface QueueStatisticsRow {
  department: string;
  waiting: number;
  in_consult: number;
  completed: number;
  cancelled: number;
  avg_wait_minutes: number | null;
  avg_service_minutes: number | null;
}

export interface BedOccupancyRow {
  ward: string;
  total_beds: number;
  occupied: number;
  available: number;
  maintenance: number;
  occupancy_rate: number | null;
}

export interface OverviewRow {
  metric: string;
  value: number;
}

export interface AnalyticsResponse<T> {
  data: T[];
  generatedAt: string;
  range?: { from: string; to: string };
}
