export type ActivityAction =
  | "create"
  | "read"
  | "view"
  | "update"
  | "delete"
  | "login"
  | "logout"
  | "register"
  | "export"
  | "submit"
  | "share"
  | "schedule"
  | string;

export interface ActivityLog {
  id: number | string;

  user_id?: number | string | null;
  userId?: number | string | null;

  user_name?: string;
  userName?: string;

  user_email?: string;
  userEmail?: string;

  action: ActivityAction;

  entity_type?: string;
  entityType?: string;

  entity_id?: number | string | null;
  entityId?: number | string | null;

  description?: string;
  details?: string;

  ip_address?: string | null;
  ipAddress?: string | null;

  user_agent?: string | null;
  userAgent?: string | null;

  created_at?: string;
  createdAt?: string;

  updated_at?: string;
  updatedAt?: string;
}

export interface ActivityLogFilters {
  user_id?: number | string;
  userId?: number | string;

  action?: ActivityAction | "all";

  entity_type?: string;
  entityType?: string;

  start_date?: string;
  end_date?: string;

  search?: string;

  page?: number;
  page_size?: number;

  sort_by?: "created_at" | "action" | "user_id";
  sort_order?: "asc" | "desc";
}

export interface ActivityLogResponse {
  success: boolean;
  message: string;
  log: ActivityLog;
}

export interface ActivityLogListResponse {
  success: boolean;
  message: string;

  data?: ActivityLog[];
  logs?: ActivityLog[];

  total?: number;
  page?: number;
  page_size?: number;
  total_pages?: number;
}

export interface ActivityLogStats {
  total_activities: number;
  login_count?: number;
  logout_count?: number;
  create_count?: number;
  update_count?: number;
  delete_count?: number;
  export_count?: number;
}

export interface ActivityLogStatsResponse {
  success: boolean;
  message: string;
  data: ActivityLogStats;
}