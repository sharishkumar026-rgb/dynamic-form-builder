
import api from "./axios";

// ============================================================
// FORM ANALYTICS SUMMARY
// ============================================================

export interface FormAnalyticsSummary {
  form_id: number;
  title: string;
  is_active: boolean;
  total_fields: number;
  total_responses: number;
  average_field_responses: number;
  completion_rate: number;
  generated_at: string;
}

export interface FormAnalyticsResponse {
  success: boolean;
  message: string;
  data: FormAnalyticsSummary;
}

// ============================================================
// FORM RESPONSE ANALYTICS
// ============================================================

export interface FormResponseAnalyticsRole {
  id: number;
  name: string;
}

export interface FormResponseAnalyticsUser {
  id: number;
  name: string;
  email: string;
  role: FormResponseAnalyticsRole;
}

export interface FormResponseAnalyticsItem {
  response_id: number;
  form_id: number;
  submitted_by: FormResponseAnalyticsUser;
  submitted_at: string;
  updated_at: string;
  answered_fields: number;
  details_count: number;
}

export interface FormResponseAnalyticsResponse {
  success: boolean;
  message: string;
  total: number;
  data: FormResponseAnalyticsItem[];
}

// ============================================================
// FIELD ANALYTICS
// ============================================================

export interface FieldAnalyticsItem {
  field_id: number;
  label: string;
  name: string;
  field_type: string;
  is_required: boolean;
  total_responses: number;
  response_count: number;
  unanswered_count: number;
  response_percentage: number;
  answer_distribution: Record<string, number> | null;
}

export interface FormFieldsAnalyticsData {
  form_id: number;
  fields: FieldAnalyticsItem[];
  generated_at: string;
}

export interface FormFieldsAnalyticsResponse {
  success: boolean;
  message: string;
  data: FormFieldsAnalyticsData;
}

// ============================================================
// SUBMISSION ANALYTICS
// ============================================================

export interface SubmissionAnalyticsItem {
  date: string;
  submissions: number;
}

export interface SubmissionAnalyticsData {
  form_id: number | null;
  start_date: string | null;
  end_date: string | null;
  total_submissions: number;
  trends: SubmissionAnalyticsItem[];
  generated_at: string;
}

export interface SubmissionAnalyticsResponse {
  success: boolean;
  message: string;
  data: SubmissionAnalyticsData;
}

// ============================================================
// ANALYTICS API
// ============================================================

export const analyticsApi = {
  // ==========================================================
  // GET /api/analytics/forms/{form_id}
  // ==========================================================

  getFormAnalytics: async (
    formId: number
  ): Promise<FormAnalyticsResponse> => {
    const response = await api.get<FormAnalyticsResponse>(
      `/analytics/forms/${formId}`
    );

    return response.data;
  },

  // ==========================================================
  // GET /api/analytics/forms/{form_id}/responses
  // ==========================================================

  getFormResponseAnalytics: async (
    formId: number,
    skip: number = 0,
    limit: number = 100
  ): Promise<FormResponseAnalyticsResponse> => {
    const response = await api.get<FormResponseAnalyticsResponse>(
      `/analytics/forms/${formId}/responses`,
      {
        params: {
          skip,
          limit,
        },
      }
    );

    return response.data;
  },

  // ==========================================================
  // GET /api/analytics/forms/{form_id}/fields
  // ==========================================================

  getFormFieldAnalytics: async (
    formId: number
  ): Promise<FormFieldsAnalyticsResponse> => {
    const response = await api.get<FormFieldsAnalyticsResponse>(
      `/analytics/forms/${formId}/fields`
    );

    return response.data;
  },

  // ==========================================================
  // GET /api/analytics/submissions
  // ==========================================================

  getSubmissionAnalytics: async (
    formId?: number,
    startDate?: string,
    endDate?: string
  ): Promise<SubmissionAnalyticsResponse> => {
    const response = await api.get<SubmissionAnalyticsResponse>(
      "/analytics/submissions",
      {
        params: {
          ...(formId !== undefined && {
            form_id: formId,
          }),
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
};

export default analyticsApi;

