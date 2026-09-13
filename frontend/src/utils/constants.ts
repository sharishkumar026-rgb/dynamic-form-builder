export const APP_NAME = "Dynamic Form Builder";

export const API_BASE_URL = "http://127.0.0.1:8000/api";

export const STORAGE_KEYS = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
  USER: "user",
  UI_PREFERENCES: "ui_preferences",
} as const;

export const ROUTES = {
  LOGIN: "/login",
  REGISTER: "/register",

  DASHBOARD: "/dashboard",

  FORMS: "/forms",
  CREATE_FORM: "/forms/create",
  FORM_DETAILS: (id: number | string) => `/forms/${id}`,
  EDIT_FORM: (id: number | string) => `/forms/${id}/edit`,
  FORM_PREVIEW: (id: number | string) => `/forms/${id}/preview`,
  FORM_RESPONSES: (id: number | string) => `/forms/${id}/responses`,

  RESPONSE_DETAILS: (
    formId: number | string,
    responseId: number | string
  ) => `/forms/${formId}/responses/${responseId}`,

  RESPONSE_HISTORY: (
    formId: number | string,
    responseId: number | string
  ) => `/forms/${formId}/responses/${responseId}/history`,

  ANALYTICS: "/analytics",

  REPORTS: "/reports",
  CREATE_REPORT: "/reports/create",
  REPORT_DETAILS: (id: number | string) => `/reports/${id}`,
  EDIT_REPORT: (id: number | string) => `/reports/${id}/edit`,

  USERS: "/users",
  USER_DETAILS: (id: number | string) => `/users/${id}`,

  ROLES: "/roles",
  ACTIVITY_LOGS: "/activity-logs",
  PROFILE: "/profile",

  UNAUTHORIZED: "/unauthorized",
  SERVER_ERROR: "/server-error",
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    REFRESH: "/auth/refresh",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
  },

  USERS: {
    LIST: "/users",
    DETAILS: (id: number | string) => `/users/${id}`,
    STATUS: (id: number | string) => `/users/${id}/status`,
  },

  ROLES: {
    LIST: "/roles",
    DETAILS: (id: number | string) => `/roles/${id}`,
    STATUS: (id: number | string) => `/roles/${id}/status`,
  },

  FORMS: {
    LIST: "/forms",
    CREATE: "/forms",
    DETAILS: (id: number | string) => `/forms/${id}`,
    UPDATE: (id: number | string) => `/forms/${id}`,
    DELETE: (id: number | string) => `/forms/${id}`,
  },

  FORM_FIELDS: {
    LIST: (formId: number | string) => `/forms/${formId}/fields`,
    CREATE: (formId: number | string) => `/forms/${formId}/fields`,
    DETAILS: (id: number | string) => `/form-fields/${id}`,
    UPDATE: (id: number | string) => `/form-fields/${id}`,
    DELETE: (id: number | string) => `/form-fields/${id}`,
  },

  FIELD_OPTIONS: {
    LIST: (fieldId: number | string) => `/form-fields/${fieldId}/options`,
    CREATE: (fieldId: number | string) => `/form-fields/${fieldId}/options`,
    DETAILS: (id: number | string) => `/field-options/${id}`,
    UPDATE: (id: number | string) => `/field-options/${id}`,
    DELETE: (id: number | string) => `/field-options/${id}`,
  },

  RESPONSES: {
    LIST: (formId: number | string) =>
      `/forms/${formId}/responses`,

    CREATE: (formId: number | string) =>
      `/forms/${formId}/responses`,

    DETAILS: (
      formId: number | string,
      responseId: number | string
    ) => `/forms/${formId}/responses/${responseId}`,

    UPDATE: (
      formId: number | string,
      responseId: number | string
    ) => `/forms/${formId}/responses/${responseId}`,

    DELETE: (
      formId: number | string,
      responseId: number | string
    ) => `/forms/${formId}/responses/${responseId}`,

    HISTORY: (
      formId: number | string,
      responseId: number | string
    ) => `/forms/${formId}/responses/${responseId}/history`,
  },

  DASHBOARD: {
    SUMMARY: "/dashboard/summary",
    MOST_USED_FORMS: "/dashboard/most-used-forms",
    RESPONSE_STATISTICS: "/dashboard/response-statistics",
  },

  ANALYTICS: {
    SUMMARY: "/analytics",
    MOST_USED_FORMS: "/dashboard/most-used-forms",
  },

  REPORTS: {
    LIST: "/reports",
    CREATE: "/reports",
    DETAILS: (id: number | string) => `/reports/${id}`,
    UPDATE: (id: number | string) => `/reports/${id}`,
    DELETE: (id: number | string) => `/reports/${id}`,
    PREVIEW: (id: number | string) => `/reports/${id}/preview`,
    EXPORT: (id: number | string) => `/reports/${id}/export`,
    SCHEDULE: (id: number | string) => `/reports/${id}/schedule`,
    SHARE: (id: number | string) => `/reports/${id}/share`,
  },

  ACTIVITY_LOGS: {
    LIST: "/activity-logs",
    DETAILS: (id: number | string) => `/activity-logs/${id}`,
  },
} as const;

export const USER_ROLES = {
  ADMIN: "admin",
  USER: "user",
} as const;

export const FORM_FIELD_TYPES = {
  TEXT: "text",
  TEXTAREA: "textarea",
  EMAIL: "email",
  NUMBER: "number",
  DATE: "date",
  SELECT: "select",
  DROPDOWN: "dropdown",
  RADIO: "radio",
  CHECKBOX: "checkbox",
  MULTI_SELECT: "multi_select",
  RATING: "rating",
  TOGGLE: "toggle",
  SWITCH: "switch",
  BOOLEAN: "boolean",
  FILE: "file",
} as const;

export const REPORT_STATUS = {
  DRAFT: "draft",
  ACTIVE: "active",
  INACTIVE: "inactive",
  ARCHIVED: "archived",
} as const;

export const RESPONSE_STATUS = {
  PENDING: "pending",
  COMPLETED: "completed",
  REVIEWED: "reviewed",
  SUBMITTED: "submitted",
  DRAFT: "draft",
  CANCELLED: "cancelled",
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 25, 50],
} as const;

export const API_TIMEOUT = 30000;

export const DEBOUNCE_DELAY = 500;

export const DATE_FORMAT = "DD/MM/YYYY";

export const DATETIME_FORMAT = "DD/MM/YYYY HH:mm";

export const TOAST_DURATION = 4000;