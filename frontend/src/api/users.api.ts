
import api from "./axios";

/* ============================================================
   ROLE
   ============================================================ */

export interface UserRoleResponse {
  id: number;
  name: string;
  description: string | null;
  is_active: boolean;
}

/* ============================================================
   USER
   ============================================================ */

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  is_active: boolean;
  role: UserRoleResponse | null;
  created_at: string;
  updated_at: string;
}

/* ============================================================
   CREATE USER
   POST /api/users
   ============================================================ */

export interface UserCreateRequest {
  name: string;
  email: string;
  password: string;
  role_id: number;
}

/* ============================================================
   UPDATE USER
   PUT /api/users/{user_id}
   ============================================================ */

export interface UserUpdateRequest {
  name?: string;
  email?: string;
  role_id?: number;
}

/* ============================================================
   UPDATE USER ROLE
   PATCH /api/users/{user_id}/role
   ============================================================ */

export interface UserRoleUpdateRequest {
  role_id: number;
}

/* ============================================================
   UPDATE USER STATUS
   PATCH /api/users/{user_id}/status
   ============================================================ */

export interface UserStatusUpdateRequest {
  is_active: boolean;
}

/* ============================================================
   GET ALL USERS RESPONSE
   GET /api/users
   ============================================================ */

export interface UserListResponse {
  success: boolean;
  message: string;
  total: number;
  users: UserResponse[];
}

/* ============================================================
   GET SINGLE USER RESPONSE
   GET /api/users/{user_id}
   ============================================================ */

export interface SingleUserResponse {
  success: boolean;
  message: string;
  user: UserResponse | null;
}

/* ============================================================
   DELETE USER RESPONSE
   DELETE /api/users/{user_id}
   ============================================================ */

export interface DeleteUserResponse {
  success: boolean;
  message: string;
}

/* ============================================================
   USER ACTION RESPONSE
   POST /api/users
   PUT /api/users/{user_id}
   PATCH /api/users/{user_id}/role
   PATCH /api/users/{user_id}/status
   ============================================================ */

export interface UserActionResponse {
  success: boolean;
  message: string;
  user: UserResponse | null;
}

/* ============================================================
   USERS API
   ============================================================ */

export const usersApi = {
  /* ----------------------------------------------------------
     GET ALL USERS

     GET /api/users

     Admin + User
     ---------------------------------------------------------- */

  getUsers: async (): Promise<UserListResponse> => {
    const response = await api.get<UserListResponse>(
      "/users",
    );

    return response.data;
  },

  /* ----------------------------------------------------------
     GET SINGLE USER

     GET /api/users/{user_id}

     Admin + User
     ---------------------------------------------------------- */

  getUser: async (
    userId: number,
  ): Promise<SingleUserResponse> => {
    const response =
      await api.get<SingleUserResponse>(
        `/users/${userId}`,
      );

    return response.data;
  },

  /* ----------------------------------------------------------
     CREATE USER

     POST /api/users

     Admin only
     ---------------------------------------------------------- */

  createUser: async (
    data: UserCreateRequest,
  ): Promise<UserActionResponse> => {
    const response =
      await api.post<UserActionResponse>(
        "/users",
        data,
      );

    return response.data;
  },

  /* ----------------------------------------------------------
     UPDATE USER

     PUT /api/users/{user_id}

     Admin only
     ---------------------------------------------------------- */

  updateUser: async (
    userId: number,
    data: UserUpdateRequest,
  ): Promise<UserActionResponse> => {
    const response =
      await api.put<UserActionResponse>(
        `/users/${userId}`,
        data,
      );

    return response.data;
  },

  /* ----------------------------------------------------------
     UPDATE USER ROLE

     PATCH /api/users/{user_id}/role

     Admin only
     ---------------------------------------------------------- */

  updateUserRole: async (
    userId: number,
    data: UserRoleUpdateRequest,
  ): Promise<UserActionResponse> => {
    const response =
      await api.patch<UserActionResponse>(
        `/users/${userId}/role`,
        data,
      );

    return response.data;
  },

  /* ----------------------------------------------------------
     UPDATE USER STATUS

     PATCH /api/users/{user_id}/status

     Admin only
     ---------------------------------------------------------- */

  updateUserStatus: async (
    userId: number,
    data: UserStatusUpdateRequest,
  ): Promise<UserActionResponse> => {
    const response =
      await api.patch<UserActionResponse>(
        `/users/${userId}/status`,
        data,
      );

    return response.data;
  },

  /* ----------------------------------------------------------
     DELETE USER

     DELETE /api/users/{user_id}

     Admin only
     ---------------------------------------------------------- */

  deleteUser: async (
    userId: number,
  ): Promise<DeleteUserResponse> => {
    const response =
      await api.delete<DeleteUserResponse>(
        `/users/${userId}`,
      );

    return response.data;
  },
};

export default usersApi;

