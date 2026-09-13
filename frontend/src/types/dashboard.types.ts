export interface DashboardSummary {
  total_forms: number;
  active_forms: number;
  inactive_forms: number;

  total_responses: number;

  total_users: number;
  active_users: number;
  inactive_users?: number;

  generated_at?: string;
  generatedAt?: string;
}

export interface DashboardSummaryResponse {
  success: boolean;
  message: string;
  data: DashboardSummary;
}

export interface MostUsedForm {
  id: number | string;
  title: string;

  response_count: number;
  responseCount?: number;

  is_active?: boolean;
  isActive?: boolean;
}

export interface MostUsedFormsResponse {
  success: boolean;
  message: string;

  data?: MostUsedForm[];
  forms?: MostUsedForm[];
}

export interface ResponseStatistics {
  labels: string[];
  values: number[];

  total?: number;
}

export interface ResponseStatisticsResponse {
  success: boolean;
  message: string;

  data?: ResponseStatistics;
  statistics?: ResponseStatistics;
}

export interface RecentResponse {
  id: number | string;

  form_id?: number | string;
  formId?: number | string;

  form_name?: string;
  formName?: string;

  submitted_by?: string;
  submittedBy?: string;

  submitted_at?: string;
  submittedAt?: string;

  status?: "pending" | "completed" | "reviewed" | "submitted" | string;
}

export interface RecentResponsesResponse {
  success: boolean;
  message: string;

  data?: RecentResponse[];
  responses?: RecentResponse[];
}

export interface DashboardData {
  summary?: DashboardSummary;
  most_used_forms?: MostUsedForm[];
  mostUsedForms?: MostUsedForm[];
  response_statistics?: ResponseStatistics;
  responseStatistics?: ResponseStatistics;
  recent_responses?: RecentResponse[];
  recentResponses?: RecentResponse[];
}

export interface DashboardResponse {
  success: boolean;
  message: string;
  data?: DashboardData;
}