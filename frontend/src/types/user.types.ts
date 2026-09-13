export type UserStatus =
  | "active"
  | "inactive"
  | "pending"
  | "suspended";

export type UserRoleName =
  | "admin"
  | "user"
  | string;

export interface UserRole {
  id: number | string;
  name: UserRoleName;
  description?: string;
  is_active?: boolean;
  isActive?: boolean;
}

export interface User {
  id: number | string;

  name: string;
  email: string;

  role?: UserRole | string | null;

  role_id?: number | string | null;
  roleId?: number | string | null;

  role_name?: string | null;
  roleName?: string | null;

  is_active?: boolean;
  isActive?: boolean;

  status?: UserStatus;

  created_at?: string;
  createdAt?: string;

  updated_at?: string;
  updatedAt?: string;

  last_login?: string | null;
  lastLogin?: string | null;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role_id?: number | string | null;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  role_id?: number | string | null;
}

export interface UpdateUserStatusRequest {
  is_active: boolean;
}

export interface UserListResponse {
  success: boolean;
  message: string;

  data?: User[];
  users?: User[];

  total?: number;
  page?: number;
  page_size?: number;
  total_pages?: number;
}

export interface UserResponse {
  success: boolean;
  message: string;
  user: User;
}

export interface DeleteUserResponse {
  success: boolean;
  message: string;
}

export interface UserStats {
  total_users: number;
  active_users: number;
  inactive_users: number;
  admin_users?: number;
  regular_users?: number;
}

export interface UserStatsResponse {
  success: boolean;
  message: string;
  data: UserStats;
}

export interface UserFilters {
  search?: string;
  status?: UserStatus | "all";
  role?: string | "all";
  page?: number;
  page_size?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}