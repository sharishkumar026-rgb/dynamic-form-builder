export interface AnalyticsSummary {
  total_forms: number;
  active_forms: number;
  inactive_forms: number;
  total_responses: number;
  total_users?: number;
  active_users?: number;
  inactive_users?: number;
}

export interface AnalyticsDataPoint {
  label: string;
  value: number;
}

export interface ResponseStatistics {
  labels: string[];
  values: number[];
  total?: number;
}

export interface FormUsage {
  id: number | string;
  title: string;
  response_count: number;
  responseCount?: number;
  is_active?: boolean;
  isActive?: boolean;
}

export interface AnalyticsOverview {
  summary?: AnalyticsSummary;
  response_statistics?: ResponseStatistics;
  responseStatistics?: ResponseStatistics;
  most_used_forms?: FormUsage[];
  mostUsedForms?: FormUsage[];
}

export interface AnalyticsResponse {
  success: boolean;
  message: string;
  data?: AnalyticsOverview | AnalyticsSummary;
  analytics?: AnalyticsOverview;
}

export interface ResponseStatisticsResponse {
  success: boolean;
  message: string;
  data?: ResponseStatistics;
  statistics?: ResponseStatistics;
}

export interface MostUsedFormsResponse {
  success: boolean;
  message: string;
  data?: FormUsage[];
  forms?: FormUsage[];
}

export interface AnalyticsFilters {
  start_date?: string;
  end_date?: string;
  form_id?: number | string;
  group_by?: "day" | "week" | "month" | "year";
}