export const isRequired = (
  value: unknown,
  message: string = "This field is required"
): string => {
  if (value === null || value === undefined) {
    return message;
  }

  if (typeof value === "string" && value.trim() === "") {
    return message;
  }

  if (Array.isArray(value) && value.length === 0) {
    return message;
  }

  return "";
};

export const isValidEmail = (
  email: string,
  message: string = "Please enter a valid email address"
): string => {
  if (!email.trim()) {
    return "Email is required";
  }

  const emailRegex =
    /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

  return emailRegex.test(email.trim()) ? "" : message;
};

export const isValidPassword = (
  password: string,
  minLength: number = 8
): string => {
  if (!password) {
    return "Password is required";
  }

  if (password.length < minLength) {
    return `Password must be at least ${minLength} characters`;
  }

  return "";
};

export const isValidPasswordConfirmation = (
  password: string,
  confirmPassword: string
): string => {
  if (!confirmPassword) {
    return "Please confirm your password";
  }

  if (password !== confirmPassword) {
    return "Passwords do not match";
  }

  return "";
};

export const minLength = (
  value: string,
  length: number,
  message?: string
): string => {
  if (value.length < length) {
    return (
      message ||
      `Must be at least ${length} characters`
    );
  }

  return "";
};

export const maxLength = (
  value: string,
  length: number,
  message?: string
): string => {
  if (value.length > length) {
    return (
      message ||
      `Must not exceed ${length} characters`
    );
  }

  return "";
};

export const isLengthBetween = (
  value: string,
  min: number,
  max: number,
  message?: string
): string => {
  if (value.length < min || value.length > max) {
    return (
      message ||
      `Must be between ${min} and ${max} characters`
    );
  }

  return "";
};

export const isPositiveNumber = (
  value: number | string,
  message: string = "Value must be greater than 0"
): string => {
  if (value === "" || value === null || value === undefined) {
    return "Value is required";
  }

  const number = Number(value);

  if (Number.isNaN(number)) {
    return "Please enter a valid number";
  }

  return number > 0 ? "" : message;
};

export const isNonNegativeNumber = (
  value: number | string,
  message: string = "Value cannot be negative"
): string => {
  if (value === "" || value === null || value === undefined) {
    return "Value is required";
  }

  const number = Number(value);

  if (Number.isNaN(number)) {
    return "Please enter a valid number";
  }

  return number >= 0 ? "" : message;
};

export const isNumberInRange = (
  value: number | string,
  min: number,
  max: number,
  message?: string
): string => {
  if (value === "" || value === null || value === undefined) {
    return "Value is required";
  }

  const number = Number(value);

  if (Number.isNaN(number)) {
    return "Please enter a valid number";
  }

  if (number < min || number > max) {
    return (
      message ||
      `Value must be between ${min} and ${max}`
    );
  }

  return "";
};

export const isInteger = (
  value: number | string,
  message: string = "Please enter a whole number"
): string => {
  if (value === "" || value === null || value === undefined) {
    return "Value is required";
  }

  const number = Number(value);

  if (Number.isNaN(number)) {
    return "Please enter a valid number";
  }

  return Number.isInteger(number) ? "" : message;
};

export const isValidUrl = (
  value: string,
  message: string = "Please enter a valid URL"
): string => {
  if (!value.trim()) {
    return "URL is required";
  }

  try {
    new URL(value.trim());
    return "";
  } catch {
    return message;
  }
};

export const isValidDate = (
  value: string,
  message: string = "Please enter a valid date"
): string => {
  if (!value.trim()) {
    return "Date is required";
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? message : "";
};

export const isDateInPast = (
  value: string,
  message: string = "Date cannot be in the past"
): string => {
  const validationError = isValidDate(value);

  if (validationError) {
    return validationError;
  }

  const selectedDate = new Date(value);
  const today = new Date();

  selectedDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  return selectedDate < today ? message : "";
};

export const isDateInFuture = (
  value: string,
  message: string = "Date cannot be in the future"
): string => {
  const validationError = isValidDate(value);

  if (validationError) {
    return validationError;
  }

  const selectedDate = new Date(value);
  const today = new Date();

  selectedDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  return selectedDate > today ? message : "";
};

export const isValidPhone = (
  value: string,
  message: string = "Please enter a valid phone number"
): string => {
  if (!value.trim()) {
    return "Phone number is required";
  }

  const phone = value.replace(/[\s()-]/g, "");

  const phoneRegex = /^\+?[0-9]{7,15}$/;

  return phoneRegex.test(phone) ? "" : message;
};

export const isValidIndianMobile = (
  value: string,
  message: string = "Please enter a valid Indian mobile number"
): string => {
  if (!value.trim()) {
    return "Mobile number is required";
  }

  const mobile = value.replace(/\s|-/g, "");

  const mobileRegex =
    /^(?:\+91|91)?[6-9][0-9]{9}$/;

  return mobileRegex.test(mobile) ? "" : message;
};

export const isValidName = (
  value: string,
  message: string = "Please enter a valid name"
): string => {
  if (!value.trim()) {
    return "Name is required";
  }

  const nameRegex = /^[A-Za-zÀ-ÿ\s.'-]+$/;

  return nameRegex.test(value.trim()) ? "" : message;
};

export const isValidFieldName = (
  value: string,
  message: string = "Field name can contain only letters, numbers and underscores"
): string => {
  if (!value.trim()) {
    return "Field name is required";
  }

  const fieldNameRegex = /^[A-Za-z_][A-Za-z0-9_]*$/;

  return fieldNameRegex.test(value.trim()) ? "" : message;
};

export const isValidSlug = (
  value: string,
  message: string = "Please enter a valid slug"
): string => {
  if (!value.trim()) {
    return "Slug is required";
  }

  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

  return slugRegex.test(value.trim()) ? "" : message;
};

export const isValidFileSize = (
  file: File,
  maxSizeInMB: number
): string => {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

  return file.size <= maxSizeInBytes
    ? ""
    : `File size must not exceed ${maxSizeInMB} MB`;
};

export const isValidFileType = (
  file: File,
  allowedTypes: string[]
): string => {
  if (allowedTypes.length === 0) {
    return "";
  }

  const fileType = file.type.toLowerCase();

  const isAllowed = allowedTypes.some((type) => {
    const normalizedType = type.toLowerCase();

    if (normalizedType.endsWith("/*")) {
      return fileType.startsWith(
        normalizedType.replace("/*", "/")
      );
    }

    return fileType === normalizedType;
  });

  return isAllowed ? "" : "File type is not allowed";
};

export const validateForm = (
  values: Record<string, unknown>,
  rules: Record<string, Array<(value: unknown) => string>>
): Record<string, string> => {
  const errors: Record<string, string> = {};

  Object.entries(rules).forEach(([field, validators]) => {
    const value = values[field];

    for (const validator of validators) {
      const error = validator(value);

      if (error) {
        errors[field] = error;
        break;
      }
    }
  });

  return errors;
};

export const hasValidationErrors = (
  errors: Record<string, string>
): boolean => {
  return Object.values(errors).some(
    (error) => Boolean(error)
  );
};