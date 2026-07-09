import type { MunicipalDepartment, ReportStatus, SeverityLevel } from './report';

export interface DashboardStatCard {
  label: string;
  value: string;
  change: string;
  tone: 'cyan' | 'emerald' | 'amber' | 'rose';
  detail: string;
}

export interface DashboardComplaint {
  id: string;
  title: string;
  category: string;
  status: ReportStatus;
  department: MunicipalDepartment;
  location: string;
  updatedAt: string;
  severity: SeverityLevel;
  summary: string;
}

export interface DashboardTimelineStep {
  title: string;
  status: ReportStatus;
  count: number;
  note: string;
  accent: 'cyan' | 'emerald' | 'amber' | 'rose';
}

export interface DashboardMapMarker {
  id: string;
  title: string;
  location: string;
  left: number;
  top: number;
  severity: SeverityLevel;
  status: ReportStatus;
}