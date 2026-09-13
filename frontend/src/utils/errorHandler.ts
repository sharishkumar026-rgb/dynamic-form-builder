export interface ApiErrorResponse {
  success?: boolean;
  message?: string;
  detail?: string;
  error?: string;
  errors?: Record<string, string | string[]>;
}

export interface AppError {
  message: string;
  status?: number;
  code?: string;
  details?: unknown;
}

export const getErrorMessage = (
  error: unknown,
  fallback: string = "Something went wrong"
): string => {
  if (!error) {
    return fallback;
  }

  if (typeof error === "string") {
    return error.trim() || fallback;
  }

  if (error instanceof Error) {
    return error.message || fallback;
  }

  if (typeof error === "object") {
    const value = error as Record<string, unknown>;

    if (
      typeof value.message === "string" &&
      value.message.trim()
    ) {
      return value.message;
    }

    if (
      typeof value.detail === "string" &&
      value.detail.trim()
    ) {
      return value.detail;
    }

    if (
      typeof value.error === "string" &&
      value.error.trim()
    ) {
      return value.error;
    }

    if (
      value.response &&
      typeof value.response === "object"
    ) {
      const response = value.response as Record<string, unknown>;

      if (
        response.data &&
        typeof response.data === "object"
      ) {
        const data = response.data as Record<string, unknown>;

        if (
          typeof data.message === "string" &&
          data.message.trim()
        ) {
          return data.message;
        }

        if (
          typeof data.detail === "string" &&
          data.detail.trim()
        ) {
          return data.detail;
        }

        if (
          typeof data.error === "string" &&
          data.error.trim()
        ) {
          return data.error;
        }
      }

      if (
        typeof response.data === "string" &&
        response.data.trim()
      ) {
        return response.data;
      }

      if (typeof response.status === "number") {
        return getHttpErrorMessage(response.status);
      }
    }
  }

  return fallback;
};

export const getErrorStatus = (
  error: unknown
): number | undefined => {
  if (!error || typeof error !== "object") {
    return undefined;
  }

  const value = error as Record<string, unknown>;

  if (typeof value.status === "number") {
    return value.status;
  }

  if (typeof value.statusCode === "number") {
    return value.statusCode;
  }

  if (
    value.response &&
    typeof value.response === "object"
  ) {
    const response = value.response as Record<string, unknown>;

    if (typeof response.status === "number") {
      return response.status;
    }
  }

  return undefined;
};

export const getHttpErrorMessage = (
  status?: number
): string => {
  switch (status) {
    case 400:
      return "Invalid request. Please check your input.";

    case 401:
      return "Your session has expired. Please log in again.";

    case 403:
      return "You do not have permission to perform this action.";

    case 404:
      return "The requested resource was not found.";

    case 409:
      return "The requested operation conflicts with existing data.";

    case 422:
      return "Please check the submitted information.";

    case 429:
      return "Too many requests. Please try again later.";

    case 500:
      return "An internal server error occurred.";

    case 502:
      return "The server is temporarily unavailable.";

    case 503:
      return "The service is temporarily unavailable.";

    case 504:
      return "The server took too long to respond.";

    default:
      return "Something went wrong. Please try again.";
  }
};

export const isApiError = (
  error: unknown
): boolean => {
  if (!error || typeof error !== "object") {
    return false;
  }

  const value = error as Record<string, unknown>;

  return (
    "response" in value ||
    "status" in value ||
    "statusCode" in value
  );
};

export const isUnauthorizedError = (
  error: unknown
): boolean => {
  return getErrorStatus(error) === 401;
};

export const isForbiddenError = (
  error: unknown
): boolean => {
  return getErrorStatus(error) === 403;
};

export const isNotFoundError = (
  error: unknown
): boolean => {
  return getErrorStatus(error) === 404;
};

export const isValidationError = (
  error: unknown
): boolean => {
  return getErrorStatus(error) === 422;
};

export const isServerError = (
  error: unknown
): boolean => {
  const status = getErrorStatus(error);

  return (
    status !== undefined &&
    status >= 500
  );
};

export const getValidationErrors = (
  error: unknown
): Record<string, string> => {
  if (!error || typeof error !== "object") {
    return {};
  }

  const value = error as Record<string, unknown>;

  let data: unknown = value;

  if (
    value.response &&
    typeof value.response === "object"
  ) {
    const response = value.response as Record<string, unknown>;

    data = response.data ?? response;
  }

  if (!data || typeof data !== "object") {
    return {};
  }

  const responseData = data as ApiErrorResponse;

  if (!responseData.errors) {
    return {};
  }

  const result: Record<string, string> = {};

  Object.entries(responseData.errors).forEach(
    ([field, message]) => {
      if (Array.isArray(message)) {
        result[field] = message.join(", ");
      } else {
        result[field] = String(message);
      }
    }
  );

  return result;
};

export const normalizeError = (
  error: unknown,
  fallback: string = "Something went wrong"
): AppError => {
  return {
    message: getErrorMessage(error, fallback),
    status: getErrorStatus(error),
    details: error,
  };
};

export const logError = (
  error: unknown,
  context?: string
): void => {
  if (context) {
    console.error(`[${context}]`, error);
  } else {
    console.error(error);
  }
};

export const handleError = (
  error: unknown,
  fallback: string = "Something went wrong"
): string => {
  const message = getErrorMessage(
    error,
    fallback
  );

  logError(error);

  return message;
};

export default {
  getErrorMessage,
  getErrorStatus,
  getHttpErrorMessage,
  isApiError,
  isUnauthorizedError,
  isForbiddenError,
  isNotFoundError,
  isValidationError,
  isServerError,
  getValidationErrors,
  normalizeError,
  logError,
  handleError,
};