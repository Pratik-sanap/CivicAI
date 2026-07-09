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

export interface ImageAnalysisResponse {
  category: IssueCategory;
  severity: SeverityLevel;
  confidence: number;
  department: MunicipalDepartment;
  impact: string;
  priority: string;
  complaint: string;
}
