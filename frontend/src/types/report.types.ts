export type ReportStatus =
  | "active"
  | "inactive"
  | "draft"
  | "archived";

export type ReportFieldType =
  | "text"
  | "number"
  | "date"
  | "boolean";

export type ReportFilterOperator =
  | "equals"
  | "not_equals"
  | "contains"
  | "greater_than"
  | "less_than"
  | "greater_or_equal"
  | "less_or_equal";

export type ReportSortDirection = "asc" | "desc";

export type ReportChartType =
  | "bar"
  | "line"
  | "pie"
  | "doughnut"
  | "area"
  | "none";

export interface ReportField {
  id: number | string;
  name: string;
  label: string;
  type?: ReportFieldType;
}

export interface ReportFilter {
  id: number | string;
  fieldId: number | string;
  operator: ReportFilterOperator;
  value: string;
}

export interface ReportSort {
  id: number | string;
  fieldId: number | string;
  direction: ReportSortDirection;
}

export interface ReportBuilderData {
  id?: number | string;

  name: string;
  description: string;

  fields: ReportField[];
  filters: ReportFilter[];
  sorts: ReportSort[];

  groupBy?: number | string;

  chartType?: ReportChartType;
}

export interface Report {
  id: number | string;

  name: string;
  description?: string | null;

  status?: ReportStatus;

  report_type?: string;
  reportType?: string;

  created_by?: number | string | null;
  createdBy?: number | string | null;

  created_by_name?: string;
  createdByName?: string;

  configuration?: ReportBuilderData | Record<string, unknown>;

  created_at?: string;
  createdAt?: string;

  updated_at?: string;
  updatedAt?: string;

  last_generated_at?: string | null;
  lastGeneratedAt?: string | null;
}

export interface ReportCardData {
  id: number | string;

  name: string;
  description?: string;

  status?: ReportStatus;
  reportType?: string;

  createdBy?: string;

  createdAt?: string | Date;
  updatedAt?: string | Date;

  lastGeneratedAt?: string | Date;

  recordCount?: number;
}

export interface CreateReportRequest {
  name: string;
  description?: string | null;
  status?: ReportStatus;
  configuration?: ReportBuilderData | Record<string, unknown>;
}

export interface UpdateReportRequest {
  name?: string;
  description?: string | null;
  status?: ReportStatus;
  configuration?: ReportBuilderData | Record<string, unknown>;
}

export interface ReportResponse {
  success: boolean;
  message: string;
  report: Report;
}

export interface ReportListResponse {
  success: boolean;
  message: string;

  data?: Report[];
  reports?: Report[];

  total?: number;
  page?: number;
  page_size?: number;
  total_pages?: number;
}

export interface DeleteReportResponse {
  success: boolean;
  message: string;
}

export interface ReportFilters {
  search?: string;
  status?: ReportStatus | "all";

  page?: number;
  page_size?: number;

  sort_by?: "name" | "created_at" | "updated_at";
  sort_order?: "asc" | "desc";
}

export interface ReportPreviewData {
  columns: string[];
  rows: Record<string, unknown>[];

  total_rows?: number;
}

export interface ReportPreviewResponse {
  success: boolean;
  message: string;
  data?: ReportPreviewData;
  preview?: ReportPreviewData;
}

export interface ReportExportRequest {
  format: "pdf" | "excel" | "xlsx" | "csv";
  report_id: number | string;
}

export interface ReportExportResponse {
  success: boolean;
  message: string;
  file_url?: string;
  download_url?: string;
}

export interface ReportSchedule {
  id: number | string;
  report_id: number | string;

  frequency:
    | "daily"
    | "weekly"
    | "monthly"
    | "custom";

  time?: string;
  day_of_week?: number;
  day_of_month?: number;

  is_active: boolean;

  created_at?: string;
  updated_at?: string;
}

export interface CreateReportScheduleRequest {
  frequency:
    | "daily"
    | "weekly"
    | "monthly"
    | "custom";

  time?: string;
  day_of_week?: number;
  day_of_month?: number;

  is_active?: boolean;
}

export interface UpdateReportScheduleRequest {
  frequency?:
    | "daily"
    | "weekly"
    | "monthly"
    | "custom";

  time?: string;
  day_of_week?: number;
  day_of_month?: number;

  is_active?: boolean;
}

export interface ReportScheduleResponse {
  success: boolean;
  message: string;
  schedule: ReportSchedule;
}

export interface ReportScheduleListResponse {
  success: boolean;
  message: string;

  data?: ReportSchedule[];
  schedules?: ReportSchedule[];
}

export interface SharedReport {
  id: number | string;
  report_id: number | string;
  user_id: number | string;

  permission?: "view" | "edit";

  created_at?: string;
  updated_at?: string;
}

export interface ShareReportRequest {
  user_id: number | string;
  permission: "view" | "edit";
}

export interface ShareReportResponse {
  success: boolean;
  message: string;
  shared_report: SharedReport;
}

export interface SharedReportListResponse {
  success: boolean;
  message: string;

  data?: SharedReport[];
  shared_reports?: SharedReport[];
}