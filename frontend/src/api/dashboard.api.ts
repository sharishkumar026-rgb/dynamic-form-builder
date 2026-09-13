
import api from "./axios";

// ============================================================
// DASHBOARD SUMMARY
// ============================================================

export interface DashboardSummaryData {
  total_forms: number;
  active_forms: number;
  inactive_forms: number;
  total_responses: number;
  total_users: number;
  active_users: number;
  generated_at: string;
}

export interface DashboardSummaryResponse {
  success: boolean;
  message: string;
  data: DashboardSummaryData;
}

// ============================================================
// SUBMISSION TRENDS
// ============================================================

export interface SubmissionTrendItem {
  date: string;
  submissions: number;
}

export interface DashboardSubmissionTrendsResponse {
  success: boolean;
  message: string;
  total: number;
  data: SubmissionTrendItem[];
}

// ============================================================
// MOST USED FORMS
// ============================================================

export interface MostUsedFormItem {
  form_id: number;
  title: string;
  response_count: number;
  is_active: boolean;
}

export interface DashboardMostUsedFormsResponse {
  success: boolean;
  message: string;
  total: number;
  data: MostUsedFormItem[];
}

// ============================================================
// RESPONSE STATISTICS
// ============================================================

export interface ResponseStatisticsData {
  total_responses: number;
  today_responses: number;
  this_week_responses: number;
  this_month_responses: number;
  average_responses_per_form: number;
  most_active_form_id: number | null;
  most_active_form_title: string | null;
  generated_at: string;
}

export interface DashboardResponseStatisticsResponse {
  success: boolean;
  message: string;
  data: ResponseStatisticsData;
}

// ============================================================
// DASHBOARD API
// ============================================================

export const dashboardApi = {
  // ==========================================================
  // GET /api/dashboard/summary
  // ==========================================================

  getSummary: async (): Promise<DashboardSummaryResponse> => {
    const response = await api.get<DashboardSummaryResponse>(
      "/dashboard/summary"
    );

    return response.data;
  },

  // ==========================================================
  // GET /api/dashboard/submission-trends
  // ==========================================================

  getSubmissionTrends: async (
    startDate?: string,
    endDate?: string
  ): Promise<DashboardSubmissionTrendsResponse> => {
    const response = await api.get<DashboardSubmissionTrendsResponse>(
      "/dashboard/submission-trends",
      {
        params: {
          ...(startDate !== undefined && {
            start_date: startDate,
          }),
          ...(endDate !== undefined && {
            end_date: endDate,
          }),
        },
      }
    );

    return response.data;
  },

  // ==========================================================
  // GET /api/dashboard/most-used-forms
  // ==========================================================

  getMostUsedForms: async (
    limit: number = 10
  ): Promise<DashboardMostUsedFormsResponse> => {
    const response = await api.get<DashboardMostUsedFormsResponse>(
      "/dashboard/most-used-forms",
      {
        params: {
          limit,
        },
      }
    );

    return response.data;
  },

  // ==========================================================
  // GET /api/dashboard/response-statistics
  // ==========================================================

  getResponseStatistics: async (): Promise<DashboardResponseStatisticsResponse> => {
    const response = await api.get<DashboardResponseStatisticsResponse>(
      "/dashboard/response-statistics"
    );

    return response.data;
  },
};

export default dashboardApi;

