
import api from "./axios";

// ============================================================
// ROLE RESPONSE
// ============================================================

export interface ActivityLogRoleResponse {
  id: number;
  name: string;
}

// ============================================================
// USER RESPONSE
// ============================================================

export interface ActivityLogUserResponse {
  id: number;
  name: string;
  email: string;
  role: ActivityLogRoleResponse | null;
}

// ============================================================
// ACTIVITY LOG RESPONSE
// ============================================================

export interface ActivityLogResponse {
  id: number;
  user: ActivityLogUserResponse | null;
  action: string;
  entity_type: string;
  entity_id: number | null;
  description: string | null;
  details: Record<string, unknown> | null;
  ip_address: string | null;
  created_at: string;
}

// ============================================================
// ACTIVITY LOG DETAIL RESPONSE
// GET /activity-logs/{log_id}
// ============================================================

export interface ActivityLogDetailResponse {
  success: boolean;
  message: string;
  activity_log: ActivityLogResponse;
}

// ============================================================
// ACTIVITY LOG LIST RESPONSE
// GET /activity-logs
// ============================================================

export interface ActivityLogListResponse {
  success: boolean;
  message: string;
  activity_log: ActivityLogResponse[];
  total: number;
  page: number;
  page_size: number;
}

// ============================================================
// ACTIVITY LOG API RESPONSE
// ============================================================

export interface ActivityLogAPIResponse {
  success: boolean;
  message: string;
  activity_log: ActivityLogResponse | null;
}

// ============================================================
// ACTIVITY LOG FILTERS
// ============================================================

export interface ActivityLogFilters {
  skip?: number;
  limit?: number;
  user_id?: number;
  action?: string;
  entity_type?: string;
  entity_id?: number;
  start_date?: string;
  end_date?: string;
}

// ============================================================
// ACTIVITY LOG API
// ============================================================

export const activityLogsApi = {
  // ==========================================================
  // GET /api/activity-logs
  // ==========================================================

  getActivityLogs: async (
    filters: ActivityLogFilters = {}
  ): Promise<ActivityLogListResponse> => {
    const response = await api.get<ActivityLogListResponse>(
      "/activity-logs",
      {
        params: {
          ...(filters.skip !== undefined && {
            skip: filters.skip,
          }),
          ...(filters.limit !== undefined && {
            limit: filters.limit,
          }),
          ...(filters.user_id !== undefined && {
            user_id: filters.user_id,
          }),
          ...(filters.action !== undefined && {
            action: filters.action,
          }),
          ...(filters.entity_type !== undefined && {
            entity_type: filters.entity_type,
          }),
          ...(filters.entity_id !== undefined && {
            entity_id: filters.entity_id,
          }),
          ...(filters.start_date !== undefined && {
            start_date: filters.start_date,
          }),
          ...(filters.end_date !== undefined && {
            end_date: filters.end_date,
          }),
        },
      }
    );

    return response.data;
  },

  // ==========================================================
  // GET /api/activity-logs/{log_id}
  // ==========================================================

  getActivityLog: async (
    logId: number
  ): Promise<ActivityLogDetailResponse> => {
    const response = await api.get<ActivityLogDetailResponse>(
      `/activity-logs/${logId}`
    );

    return response.data;
  },
};

export default activityLogsApi;

