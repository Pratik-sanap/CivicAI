import type { ReportStatus, SeverityLevel } from './report';

export interface AdminMetricCard {
  label: string;
  value: string;
  delta: string;
  tone: 'cyan' | 'emerald' | 'amber' | 'rose';
  description: string;
}

export interface AdminComplaintRow {
  id: string;
  reference: string;
  citizen: string;
  category: string;
  department: string;
  status: ReportStatus;
  severity: SeverityLevel;
  location: string;
  updatedAt: string;
}

export interface AdminFilterState {
  department: string;
  status: string;
  severity: string;
}

export interface AdminChartSlice {
  label: string;
  value: number;
  color: string;
}

export interface AdminChartPoint {
  label: string;
  value: number;
}


export interface AdminMapComplaint {
  id: string;
  reference: string;
  citizen: string;
  category: string;
  department: string;
  status: ReportStatus;
  severity: SeverityLevel;
  location: string;
  summary: string;
  updatedAt: string;
  latitude: number;
  longitude: number;
}