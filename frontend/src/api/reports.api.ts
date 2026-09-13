import api from "./axios";

// ==============================
// Report Filter
// ==============================

export interface ReportFilter {
  start_date: string | null;
  end_date: string | null;
  submitted_by_id: number | null;
}

// ==============================
// Report Answer
// ==============================

export interface FormReportAnswer {
  field_id: number;
  field_name: string;
  field_label: string;
  field_type: string;
  value: unknown | null;
  value_json: unknown | null;
}

// ==============================
// Report Item
// ==============================

export interface FormReportItem {
  response_id: number;
  form_id: number;

  submitted_by: Record<
    string,
    unknown
  > | null;

  submitted_at: string | null;

  updated_at: string | null;

  answers: FormReportAnswer[];
}

// ==============================
// Form Report
// ==============================

export interface FormReportData {
  form_id: number;

  title: string;

  description: string | null;

  is_active: boolean;

  total_fields: number;

  total_responses: number;

  start_date: string | null;

  end_date: string | null;

  responses: FormReportItem[];

  generated_at: string;
}

export interface FormReportResponse {
  success: boolean;

  message: string;

  total: number;

  data: FormReportData;
}

// ==============================
// Statistics Field
// ==============================

export interface FieldStatistic {
  field_id: number;

  field_name: string;

  field_label: string;

  field_type: string;

  response_count: number;
}

// ==============================
// Statistics
// ==============================

export interface ReportStatisticsData {
  form_id: number;

  form_title: string;

  total_fields: number;

  total_responses: number;

  average_answers_per_response: number;

  field_statistics: FieldStatistic[];

  start_date: string | null;

  end_date: string | null;

  generated_at: string;
}

export interface ReportStatisticsResponse {
  success: boolean;

  message: string;

  data: ReportStatisticsData;
}

// ==============================
// Export Request
// ==============================

export interface ReportExportRequest {
  start_date?: string | null;

  end_date?: string | null;

  submitted_by_id?: number | null;
}

// ==============================
// Export Queued Data
// ==============================

export interface ReportExportData {
  task_id: string;

  form_id?: number;

  report_type?: string;

  status: string;

  message?: string;

  created_at?: string;

  file_name?: string | null;

  file_path?: string | null;

  total_responses?: number;

  submitted_by_id?: number | null;

  requested_by?: number;
}

export interface ReportExportResponse {
  success: boolean;

  message: string;

  data: ReportExportData;
}

// ==============================
// Export Status
// ==============================

export interface ReportExportResultData {
  task_id: string;

  status: string;

  file_name: string | null;

  file_url: string | null;

  error: string | null;

  form_id?: number;

  report_type?: string;

  total_responses?: number;
}

export interface ReportExportResultResponse {
  success: boolean;

  message: string;

  data: ReportExportResultData;
}

// ==============================
// Reports API
// ==============================

export const reportsApi = {
  // ------------------------------
  // Get Form Report
  // ------------------------------

  getFormReport: async (
    formId: number,
    skip: number = 0,
    limit: number = 100,
    startDate?: string | null,
    endDate?: string | null,
  ): Promise<FormReportResponse> => {
    const response =
      await api.get<FormReportResponse>(
        `/reports/forms/${formId}`,
        {
          params: {
            skip,
            limit,
            start_date:
              startDate ?? undefined,
            end_date:
              endDate ?? undefined,
          },
        },
      );

    return response.data;
  },

  // ------------------------------
  // Get Form Statistics
  // ------------------------------

  getFormStatistics: async (
    formId: number,
    startDate?: string | null,
    endDate?: string | null,
  ): Promise<ReportStatisticsResponse> => {
    const response =
      await api.get<ReportStatisticsResponse>(
        `/reports/forms/${formId}/statistics`,
        {
          params: {
            start_date:
              startDate ?? undefined,
            end_date:
              endDate ?? undefined,
          },
        },
      );

    return response.data;
  },

  // ------------------------------
  // Export Excel
  // ------------------------------

  exportExcel: async (
    formId: number,
    request: ReportExportRequest = {},
  ): Promise<ReportExportResponse> => {
    const response =
      await api.post<ReportExportResponse>(
        `/reports/forms/${formId}/export/excel`,
        request,
      );

    return response.data;
  },

  // ------------------------------
  // Export PDF
  // ------------------------------

  exportPdf: async (
    formId: number,
    request: ReportExportRequest = {},
  ): Promise<ReportExportResponse> => {
    const response =
      await api.post<ReportExportResponse>(
        `/reports/forms/${formId}/export/pdf`,
        request,
      );

    return response.data;
  },

  // ------------------------------
  // Get Export Status
  // ------------------------------

  getExportStatus: async (
    taskId: string,
  ): Promise<ReportExportResultResponse> => {
    const response =
      await api.get<
        ReportExportResultResponse
      >(
        `/reports/exports/status/${taskId}`,
      );

    return response.data;
  },

  // ------------------------------
  // Download Export
  // ------------------------------

  downloadExport: async (
    filename: string,
  ): Promise<Blob> => {
    const response =
      await api.get<Blob>(
        `/reports/exports/${encodeURIComponent(
          filename,
        )}`,
        {
          responseType: "blob",
        },
      );

    return response.data;
  },
};