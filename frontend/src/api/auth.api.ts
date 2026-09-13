
import api, {
  getAccessToken,
  getRefreshToken,
  setStoredUser,
  setTokens,
  clearAuthStorage,
} from "./axios";

/* ============================================================
   TYPES
   ============================================================ */

export interface RoleResponse {
  id: number;
  name: string;
  description: string | null;
  is_active: boolean;
}

export interface AuthUserResponse {
  id: number;
  name: string;
  email: string;
  is_active: boolean;
  role: RoleResponse | null;
  created_at: string;
  updated_at: string;
}

/* ============================================================
   REGISTER
   POST /api/auth/register
   ============================================================ */

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role_id: number;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  user: AuthUserResponse | null;
}

/* ============================================================
   LOGIN
   POST /api/auth/login
   Content-Type: application/x-www-form-urlencoded
   ============================================================ */

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: AuthUserResponse;
}

/* ============================================================
   REFRESH TOKEN
   POST /api/auth/refresh
   ============================================================ */

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface RefreshTokenResponse {
  success: boolean;
  message: string;
  access_token: string;
  token_type: string;
}

/* ============================================================
   CURRENT USER
   GET /api/auth/me
   ============================================================ */

export interface CurrentUserResponse {
  success: boolean;
  message: string;
  user: AuthUserResponse;
}

/* ============================================================
   LOGOUT
   POST /api/auth/logout
   ============================================================ */

export interface LogoutResponse {
  success: boolean;
  message: string;
}

/* ============================================================
   AUTH API
   ============================================================ */

export const authApi = {
  /* ----------------------------------------------------------
     REGISTER
     ---------------------------------------------------------- */

  register: async (
    data: RegisterRequest,
  ): Promise<RegisterResponse> => {
    const response = await api.post<RegisterResponse>(
      "/auth/register",
      data,
    );

    return response.data;
  },

  /* ----------------------------------------------------------
     LOGIN
     
     FastAPI OAuth2PasswordRequestForm expects:

     username=email
     password=password

     Content-Type:
     application/x-www-form-urlencoded
     ---------------------------------------------------------- */

  login: async (
    data: LoginRequest,
  ): Promise<LoginResponse> => {
    const formData = new URLSearchParams();

    formData.append("username", data.email);
    formData.append("password", data.password);

    const response = await api.post<LoginResponse>(
      "/auth/login",
      formData,
      {
        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded",
        },
      },
    );

    const loginData = response.data;

    /* --------------------------------------------------------
       Save authentication data
       -------------------------------------------------------- */

    setTokens(
      loginData.access_token,
      loginData.refresh_token,
    );

    setStoredUser(loginData.user);

    return loginData;
  },

  /* ----------------------------------------------------------
     REFRESH ACCESS TOKEN
     ---------------------------------------------------------- */

  refresh: async (
    refreshToken?: string,
  ): Promise<RefreshTokenResponse> => {
    const token = refreshToken ?? getRefreshToken();

    if (!token) {
      throw new Error("Refresh token is not available.");
    }

    const response =
      await api.post<RefreshTokenResponse>(
        "/auth/refresh",
        {
          refresh_token: token,
        },
      );

    const refreshData = response.data;

    /* --------------------------------------------------------
       Backend returns only a new access token.
       Existing refresh token remains valid.
       -------------------------------------------------------- */

    setTokens(refreshData.access_token);

    return refreshData;
  },

  /* ----------------------------------------------------------
     GET CURRENT USER
     GET /api/auth/me
     ---------------------------------------------------------- */

  getCurrentUser:
    async (): Promise<CurrentUserResponse> => {
      const response =
        await api.get<CurrentUserResponse>(
          "/auth/me",
        );

      const currentUser = response.data;

      setStoredUser(currentUser.user);

      return currentUser;
    },

  /* ----------------------------------------------------------
     LOGOUT
     POST /api/auth/logout
     ---------------------------------------------------------- */

  logout: async (): Promise<LogoutResponse> => {
    try {
      const response =
        await api.post<LogoutResponse>(
          "/auth/logout",
        );

      return response.data;
    } finally {
      /*
       * Your backend logout does not revoke JWTs.
       * Therefore the frontend must remove its local
       * authentication data after logout.
       */
      clearAuthStorage();
    }
  },

  /* ----------------------------------------------------------
     CHECK WHETHER ACCESS TOKEN EXISTS
     ---------------------------------------------------------- */

  isAuthenticated: (): boolean => {
    return Boolean(getAccessToken());
  },

  /* ----------------------------------------------------------
     GET STORED ACCESS TOKEN
     ---------------------------------------------------------- */

  getAccessToken: (): string | null => {
    return getAccessToken();
  },

  /* ----------------------------------------------------------
     GET STORED REFRESH TOKEN
     ---------------------------------------------------------- */

  getRefreshToken: (): string | null => {
    return getRefreshToken();
  },
};

export default authApi;

