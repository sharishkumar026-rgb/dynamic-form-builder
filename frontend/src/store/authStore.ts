
export interface AuthRole {
  id?: number | string;
  name?: string;
  description?: string;
  is_active?: boolean;
  isActive?: boolean;
}

export interface AuthUser {
  id?: number | string;
  name?: string;
  email?: string;
  role_id?: number | string;
  roleId?: number | string;
  role?: string | AuthRole;
  role_name?: string;
  roleName?: string;
  is_active?: boolean;
  isActive?: boolean;
  created_at?: string;
  createdAt?: string;
  updated_at?: string;
  updatedAt?: string;
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
}

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const USER_KEY = "user";

const getStorage = (): Storage => {
  return localStorage;
};

const getStoredValue = (key: string): string | null => {
  const localValue = localStorage.getItem(key);

  if (localValue) {
    return localValue;
  }

  return sessionStorage.getItem(key);
};

const getStoredUser = (): AuthUser | null => {
  const value = getStoredValue(USER_KEY);

  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as AuthUser;
  } catch {
    return null;
  }
};

const getInitialState = (): AuthState => {
  const accessToken = getStoredValue(ACCESS_TOKEN_KEY);
  const refreshToken = getStoredValue(REFRESH_TOKEN_KEY);
  const user = getStoredUser();

  return {
    accessToken,
    refreshToken,
    user,
    isAuthenticated: Boolean(accessToken),
  };
};

let authState: AuthState = getInitialState();

const listeners = new Set<(state: AuthState) => void>();

const notifyListeners = () => {
  listeners.forEach((listener) => {
    listener(authState);
  });
};

const updateState = (newState: AuthState) => {
  authState = newState;
  notifyListeners();
};

const getRoleName = (user: AuthUser | null): string => {
  if (!user) {
    return "";
  }

  if (typeof user.role === "string") {
    return user.role.toLowerCase();
  }

  if (user.role?.name) {
    return user.role.name.toLowerCase();
  }

  if (user.role_name) {
    return user.role_name.toLowerCase();
  }

  if (user.roleName) {
    return user.roleName.toLowerCase();
  }

  return "";
};

const saveAuthData = (
  accessToken: string,
  refreshToken: string | null,
  user: AuthUser | null,
  rememberMe = true
) => {
  const storage = rememberMe ? localStorage : sessionStorage;
  const otherStorage = rememberMe ? sessionStorage : localStorage;

  // Clear previous authentication data from both storages.
  otherStorage.removeItem(ACCESS_TOKEN_KEY);
  otherStorage.removeItem(REFRESH_TOKEN_KEY);
  otherStorage.removeItem(USER_KEY);

  storage.setItem(ACCESS_TOKEN_KEY, accessToken);

  if (refreshToken) {
    storage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }

  if (user) {
    storage.setItem(USER_KEY, JSON.stringify(user));
  }

  updateState({
    accessToken,
    refreshToken,
    user,
    isAuthenticated: true,
  });
};

const clearAuthData = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);

  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  sessionStorage.removeItem(REFRESH_TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);

  updateState({
    accessToken: null,
    refreshToken: null,
    user: null,
    isAuthenticated: false,
  });
};

const setUser = (user: AuthUser | null) => {
  const accessToken = getStoredValue(ACCESS_TOKEN_KEY);
  const refreshToken = getStoredValue(REFRESH_TOKEN_KEY);

  if (user) {
    const storage =
      localStorage.getItem(ACCESS_TOKEN_KEY) !== null
        ? localStorage
        : sessionStorage;

    storage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(USER_KEY);
  }

  updateState({
    accessToken,
    refreshToken,
    user,
    isAuthenticated: Boolean(accessToken),
  });
};

const setAccessToken = (accessToken: string | null) => {
  if (accessToken) {
    const storage =
      localStorage.getItem(ACCESS_TOKEN_KEY) !== null
        ? localStorage
        : sessionStorage;

    storage.setItem(ACCESS_TOKEN_KEY, accessToken);
  } else {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  }

  updateState({
    ...authState,
    accessToken,
    isAuthenticated: Boolean(accessToken),
  });
};

const setRefreshToken = (refreshToken: string | null) => {
  if (refreshToken) {
    const storage =
      localStorage.getItem(REFRESH_TOKEN_KEY) !== null
        ? localStorage
        : sessionStorage;

    storage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  } else {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    sessionStorage.removeItem(REFRESH_TOKEN_KEY);
  }

  updateState({
    ...authState,
    refreshToken,
  });
};

const getState = (): AuthState => {
  return {
    ...authState,
  };
};

const subscribe = (listener: (state: AuthState) => void) => {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
};

const isAuthenticated = (): boolean => {
  return Boolean(getStoredValue(ACCESS_TOKEN_KEY));
};

const isAdmin = (): boolean => {
  const user = getStoredUser();
  return getRoleName(user) === "admin";
};

const getUserRole = (): string => {
  return getRoleName(getStoredUser());
};

const logout = () => {
  clearAuthData();
};

const authStore = {
  getState,
  subscribe,

  saveAuthData,
  clearAuthData,
  logout,

  setUser,
  setAccessToken,
  setRefreshToken,

  isAuthenticated,
  isAdmin,
  getUserRole,
};

export default authStore;

