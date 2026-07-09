export type IssueCategory =
  | 'pothole'
  | 'garbage'
  | 'streetlight'
  | 'water_leakage'
  | 'illegal_parking'
  | 'broken_road'
  | 'traffic_signal'
  | 'open_drain'
  | 'construction_waste'
  | 'fallen_tree'
  | 'unknown';

export type SeverityLevel = 'low' | 'medium' | 'high' | 'critical';

export type ReportStatus = 'submitted' | 'in_review' | 'assigned' | 'resolved';

export type MunicipalDepartment =
  | 'road_works'
  | 'sanitation'
  | 'electricity'
  | 'water_supply'
  | 'traffic'
  | 'public_works'
  | 'parks_and_trees'
  | 'enforcement'
  | 'general_civic';

export interface ReportLocation {
  latitude: number;
  longitude: number;
  address?: string | null;
  ward?: string | null;
}

export interface ReportCreatePayload {
  image_base64: string;
  mime_type: string;
  notes?: string;
  citizen_name?: string;
  citizen_contact?: string;
  location?: ReportLocation;
}

export interface IssueAnalysis {
  issue: string;
  category: IssueCategory;
  severity: SeverityLevel;
  department: MunicipalDepartment;
  complaint: string;
  confidence: number;
  suggested_next_action: string;
  keywords: string[];
  analysis_source: string;
}

export interface ReportRecord {
  id: string;
  image_digest: string;
  mime_type: string;
  notes?: string | null;
  citizen_name?: string | null;
  citizen_contact?: string | null;
  location?: ReportLocation | null;
  analysis: IssueAnalysis;
  status: ReportStatus;
  officer_notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface LocationSnapshot {
  label: string;
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export interface ReportIssueFormValues {
  notes: string;
}
