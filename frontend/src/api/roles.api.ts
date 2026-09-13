
import api from "./axios";

/* ============================================================
   ROLE
   ============================================================ */

export interface RoleResponse {
  id: number;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/* ============================================================
   CREATE ROLE
   POST /api/roles
   ============================================================ */

export interface RoleCreate {
  name: string;
  description?: string | null;
}

/* ============================================================
   UPDATE ROLE
   PUT /api/roles/{role_id}
   ============================================================ */

export interface RoleUpdate {
  name?: string | null;
  description?: string | null;
}

/* ============================================================
   UPDATE ROLE STATUS
   PATCH /api/roles/{role_id}/status
   ============================================================ */

export interface RoleStatusUpdate {
  is_active: boolean;
}

/* ============================================================
   GET ALL ROLES
   GET /api/roles
   ============================================================ */

export interface RoleListResponse {
  success: boolean;
  message: string;
  total: number;
  roles: RoleResponse[];
}

/* ============================================================
   GET SINGLE ROLE
   GET /api/roles/{role_id}
   ============================================================ */

export interface RoleAPIResponse {
  success: boolean;
  message: string;
  role: RoleResponse;
}

/* ============================================================
   ROLE ACTION RESPONSE
   POST /api/roles
   PUT /api/roles/{role_id}
   PATCH /api/roles/{role_id}/status
   ============================================================ */

export interface RoleActionResponse {
  success: boolean;
  message: string;
  role: RoleResponse;
}

/* ============================================================
   DELETE ROLE
   DELETE /api/roles/{role_id}
   ============================================================ */

export interface RoleDeleteResponse {
  success: boolean;
  message: string;
}

/* ============================================================
   ROLES API
   ============================================================ */

export const rolesApi = {
  /* ----------------------------------------------------------
     GET ALL ROLES

     GET /api/roles

     Admin + User
     ---------------------------------------------------------- */

  getRoles: async (): Promise<RoleListResponse> => {
    const response = await api.get<RoleListResponse>(
      "/roles",
    );

    return response.data;
  },

  /* ----------------------------------------------------------
     GET ROLE BY ID

     GET /api/roles/{role_id}

     Admin + User
     ---------------------------------------------------------- */

  getRole: async (
    roleId: number,
  ): Promise<RoleAPIResponse> => {
    const response =
      await api.get<RoleAPIResponse>(
        `/roles/${roleId}`,
      );

    return response.data;
  },

  /* ----------------------------------------------------------
     CREATE ROLE

     POST /api/roles

     Admin only
     ---------------------------------------------------------- */

  createRole: async (
    data: RoleCreate,
  ): Promise<RoleActionResponse> => {
    const response =
      await api.post<RoleActionResponse>(
        "/roles",
        data,
      );

    return response.data;
  },

  /* ----------------------------------------------------------
     UPDATE ROLE

     PUT /api/roles/{role_id}

     Admin only
     ---------------------------------------------------------- */

  updateRole: async (
    roleId: number,
    data: RoleUpdate,
  ): Promise<RoleActionResponse> => {
    const response =
      await api.put<RoleActionResponse>(
        `/roles/${roleId}`,
        data,
      );

    return response.data;
  },

  /* ----------------------------------------------------------
     UPDATE ROLE STATUS

     PATCH /api/roles/{role_id}/status

     Admin only
     ---------------------------------------------------------- */

  updateRoleStatus: async (
    roleId: number,
    data: RoleStatusUpdate,
  ): Promise<RoleActionResponse> => {
    const response =
      await api.patch<RoleActionResponse>(
        `/roles/${roleId}/status`,
        data,
      );

    return response.data;
  },

  /* ----------------------------------------------------------
     DELETE ROLE

     DELETE /api/roles/{role_id}

     Admin only
     ---------------------------------------------------------- */

  deleteRole: async (
    roleId: number,
  ): Promise<RoleDeleteResponse> => {
    const response =
      await api.delete<RoleDeleteResponse>(
        `/roles/${roleId}`,
      );

    return response.data;
  },
};

export default rolesApi;

