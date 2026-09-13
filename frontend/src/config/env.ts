export const API_BASE_URL =
  "http://127.0.0.1:8000/api";

export const API_TIMEOUT = 30000;

export const APP_NAME =
  "Dynamic Form Builder";

export const STORAGE_KEYS = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
  USER: "user",
} as const;

export const ENV = {
  API_BASE_URL,
  API_TIMEOUT,
  APP_NAME,
  STORAGE_KEYS,
} as const;

export default ENV;