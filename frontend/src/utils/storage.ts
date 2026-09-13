const isBrowser = (): boolean => {
  return typeof window !== "undefined";
};

export const setItem = (
  key: string,
  value: string
): void => {
  if (!isBrowser()) {
    return;
  }

  localStorage.setItem(key, value);
};

export const getItem = (
  key: string
): string | null => {
  if (!isBrowser()) {
    return null;
  }

  return localStorage.getItem(key);
};

export const removeItem = (
  key: string
): void => {
  if (!isBrowser()) {
    return;
  }

  localStorage.removeItem(key);
};

export const clearStorage = (): void => {
  if (!isBrowser()) {
    return;
  }

  localStorage.clear();
};

export const setJson = <T>(
  key: string,
  value: T
): void => {
  if (!isBrowser()) {
    return;
  }

  try {
    localStorage.setItem(
      key,
      JSON.stringify(value)
    );
  } catch {
    // Ignore storage serialization errors.
  }
};

export const getJson = <T>(
  key: string
): T | null => {
  if (!isBrowser()) {
    return null;
  }

  const value = localStorage.getItem(key);

  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
};

export const setSessionItem = (
  key: string,
  value: string
): void => {
  if (!isBrowser()) {
    return;
  }

  sessionStorage.setItem(key, value);
};

export const getSessionItem = (
  key: string
): string | null => {
  if (!isBrowser()) {
    return null;
  }

  return sessionStorage.getItem(key);
};

export const removeSessionItem = (
  key: string
): void => {
  if (!isBrowser()) {
    return;
  }

  sessionStorage.removeItem(key);
};

export const clearSessionStorage = (): void => {
  if (!isBrowser()) {
    return;
  }

  sessionStorage.clear();
};

export const setSessionJson = <T>(
  key: string,
  value: T
): void => {
  if (!isBrowser()) {
    return;
  }

  try {
    sessionStorage.setItem(
      key,
      JSON.stringify(value)
    );
  } catch {
    // Ignore storage serialization errors.
  }
};

export const getSessionJson = <T>(
  key: string
): T | null => {
  if (!isBrowser()) {
    return null;
  }

  const value = sessionStorage.getItem(key);

  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
};

export const getAuthToken = (): string | null => {
  if (!isBrowser()) {
    return null;
  }

  return (
    localStorage.getItem("access_token") ||
    localStorage.getItem("accessToken") ||
    sessionStorage.getItem("access_token") ||
    sessionStorage.getItem("accessToken")
  );
};

export const getRefreshToken = (): string | null => {
  if (!isBrowser()) {
    return null;
  }

  return (
    localStorage.getItem("refresh_token") ||
    localStorage.getItem("refreshToken") ||
    sessionStorage.getItem("refresh_token") ||
    sessionStorage.getItem("refreshToken")
  );
};

export const getStoredUser = <T>(): T | null => {
  if (!isBrowser()) {
    return null;
  }

  const user =
    localStorage.getItem("user") ||
    sessionStorage.getItem("user");

  if (!user) {
    return null;
  }

  try {
    return JSON.parse(user) as T;
  } catch {
    return null;
  }
};

export const clearAuthStorage = (): void => {
  if (!isBrowser()) {
    return;
  }

  localStorage.removeItem("access_token");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");

  sessionStorage.removeItem("access_token");
  sessionStorage.removeItem("accessToken");
  sessionStorage.removeItem("refresh_token");
  sessionStorage.removeItem("refreshToken");
  sessionStorage.removeItem("user");
};

export const saveAuthStorage = <T>(
  accessToken: string,
  refreshToken: string | null,
  user: T | null,
  rememberMe: boolean = true
): void => {
  if (!isBrowser()) {
    return;
  }

  clearAuthStorage();

  const storage = rememberMe
    ? localStorage
    : sessionStorage;

  storage.setItem("access_token", accessToken);

  if (refreshToken) {
    storage.setItem(
      "refresh_token",
      refreshToken
    );
  }

  if (user) {
    storage.setItem(
      "user",
      JSON.stringify(user)
    );
  }
};

export const hasAuthToken = (): boolean => {
  return Boolean(getAuthToken());
};

export const storage = {
  setItem,
  getItem,
  removeItem,
  clearStorage,

  setJson,
  getJson,

  setSessionItem,
  getSessionItem,
  removeSessionItem,
  clearSessionStorage,

  setSessionJson,
  getSessionJson,

  getAuthToken,
  getRefreshToken,
  getStoredUser,

  clearAuthStorage,
  saveAuthStorage,
  hasAuthToken,
};

export default storage;