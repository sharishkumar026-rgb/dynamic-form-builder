export interface AuthRole {
  id?: number | string;
  name: string;
  description?: string;
  is_active?: boolean;
  isActive?: boolean;
}

export interface AuthUser {
  id: number | string;
  name: string;
  email: string;

  role?: AuthRole | string | null;

  role_id?: number | string | null;
  roleId?: number | string | null;

  role_name?: string | null;
  roleName?: string | null;

  is_active?: boolean;
  isActive?: boolean;

  created_at?: string;
  createdAt?: string;

  updated_at?: string;
  updatedAt?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role_id?: number | string | null;
}

export interface LoginResponse {
  success: boolean;
  message: string;

  access_token?: string;
  refresh_token?: string;

  accessToken?: string;
  refreshToken?: string;

  user?: AuthUser;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  user?: AuthUser;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface RefreshTokenResponse {
  success: boolean;
  message: string;

  access_token?: string;
  refresh_token?: string;

  accessToken?: string;
  refreshToken?: string;
}

export interface LogoutResponse {
  success: boolean;
  message: string;
}

export interface MeResponse {
  success: boolean;
  message: string;
  user: AuthUser;
}

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
}

export type UserRole = "admin" | "user";