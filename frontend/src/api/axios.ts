import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";

// ============================================================
// API CONFIGURATION
// ============================================================

const API_BASE_URL = "http://127.0.0.1:8000/api";

// ============================================================
// STORAGE KEYS
// ============================================================

export const ACCESS_TOKEN_KEY = "access_token";
export const REFRESH_TOKEN_KEY = "refresh_token";
export const USER_KEY = "auth_user";

// ============================================================
// TOKEN HELPERS
// ============================================================

export const getAccessToken = (): string | null => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

export const setTokens = (
  accessToken: string,
  refreshToken?: string,
): void => {
  localStorage.setItem(
    ACCESS_TOKEN_KEY,
    accessToken,
  );

  if (refreshToken) {
    localStorage.setItem(
      REFRESH_TOKEN_KEY,
      refreshToken,
    );
  }
};

export const clearAuthStorage = (): void => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const setStoredUser = (
  user: unknown,
): void => {
  localStorage.setItem(
    USER_KEY,
    JSON.stringify(user),
  );
};

export const getStoredUser = <T = unknown>(): T | null => {
  const user = localStorage.getItem(USER_KEY);

  if (!user) {
    return null;
  }

  try {
    return JSON.parse(user) as T;
  } catch {
    return null;
  }
};

// ============================================================
// AXIOS INSTANCE
// ============================================================

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,

  headers: {
    Accept: "application/json",
  },
});

// ============================================================
// REFRESH STATE
// ============================================================

let isRefreshing = false;

type FailedRequest = {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
};

let failedQueue: FailedRequest[] = [];

// ============================================================
// PROCESS QUEUED REQUESTS
// ============================================================

const processQueue = (
  error: unknown,
  token: string | null = null,
): void => {
  failedQueue.forEach((request) => {
    if (error) {
      request.reject(error);
    } else if (token) {
      request.resolve(token);
    }
  });

  failedQueue = [];
};

// ============================================================
// REQUEST INTERCEPTOR
// ============================================================

api.interceptors.request.use(
  (
    config: InternalAxiosRequestConfig,
  ): InternalAxiosRequestConfig => {
    const accessToken = getAccessToken();

    if (accessToken) {
      config.headers.Authorization =
        `Bearer ${accessToken}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  },
);

// ============================================================
// RESPONSE INTERCEPTOR
// ============================================================

api.interceptors.response.use(
  (response) => {
    return response;
  },

  async (error: AxiosError) => {
    const originalRequest =
      error.config as AxiosRequestConfig & {
        _retry?: boolean;
      };

    // ========================================================
    // Only handle 401 Unauthorized
    // ========================================================

    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // ========================================================
    // Identify authentication endpoints
    // ========================================================

    const requestUrl =
      originalRequest?.url || "";

    const isLoginRequest =
      requestUrl.includes("/auth/login");

    const isRefreshRequest =
      requestUrl.includes("/auth/refresh");

    const isLogoutRequest =
      requestUrl.includes("/auth/logout");

    // ========================================================
    // Do not refresh authentication endpoints
    // ========================================================

    if (
      isLoginRequest ||
      isRefreshRequest ||
      isLogoutRequest
    ) {
      clearAuthStorage();

      return Promise.reject(error);
    }

    // ========================================================
    // Prevent infinite retry loop
    // ========================================================

    if (originalRequest._retry) {
      clearAuthStorage();

      return Promise.reject(error);
    }

    // ========================================================
    // Get refresh token
    // ========================================================

    const refreshToken = getRefreshToken();

    if (!refreshToken) {
      clearAuthStorage();

      if (
        window.location.pathname !== "/login"
      ) {
        window.location.href = "/login";
      }

      return Promise.reject(error);
    }

    // ========================================================
    // Wait if another request is refreshing
    // ========================================================

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token: string) => {
            if (!originalRequest.headers) {
              originalRequest.headers = {};
            }

            originalRequest.headers.Authorization =
              `Bearer ${token}`;

            resolve(api(originalRequest));
          },

          reject: (
            refreshError: unknown,
          ) => {
            reject(refreshError);
          },
        });
      });
    }

    // ========================================================
    // Start refresh process
    // ========================================================

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshResponse =
        await axios.post<{
          success: boolean;
          message: string;
          access_token: string;
          token_type: string;
        }>(
          `${API_BASE_URL}/auth/refresh`,
          {
            refresh_token: refreshToken,
          },
          {
            headers: {
              "Content-Type":
                "application/json",
              Accept: "application/json",
            },
          },
        );

      const newAccessToken =
        refreshResponse.data.access_token;

      if (!newAccessToken) {
        throw new Error(
          "Refresh response did not contain an access token.",
        );
      }

      // ======================================================
      // Store new access token
      // ======================================================

      setTokens(newAccessToken);

      // ======================================================
      // Resolve queued requests
      // ======================================================

      processQueue(
        null,
        newAccessToken,
      );

      // ======================================================
      // Retry original request
      // ======================================================

      if (!originalRequest.headers) {
        originalRequest.headers = {};
      }

      originalRequest.headers.Authorization =
        `Bearer ${newAccessToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      // ======================================================
      // Refresh failed
      // ======================================================

      processQueue(
        refreshError,
        null,
      );

      clearAuthStorage();

      if (
        window.location.pathname !== "/login"
      ) {
        window.location.href = "/login";
      }

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default api;