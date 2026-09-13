export type RoleName =
  | "admin"
  | "user"
  | string;

export interface Role {
  id: number | string;

  name: RoleName;

  description?: string;

  is_active?: boolean;
  isActive?: boolean;

  created_at?: string;
  createdAt?: string;

  updated_at?: string;
  updatedAt?: string;
}

export interface CreateRoleRequest {
  name: string;
  description?: string;
}

export interface UpdateRoleRequest {
  name?: string;
  description?: string;
}

export interface UpdateRoleStatusRequest {
  is_active: boolean;
}

export interface RoleResponse {
  success: boolean;
  message: string;
  role: Role;
}

export interface RoleListResponse {
  success: boolean;
  message: string;

  data?: Role[];
  roles?: Role[];

  total?: number;
  page?: number;
  page_size?: number;
  total_pages?: number;
}

export interface DeleteRoleResponse {
  success: boolean;
  message: string;
}

export interface RoleFilters {
  search?: string;
  status?: "active" | "inactive" | "all";
  page?: number;
  page_size?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}