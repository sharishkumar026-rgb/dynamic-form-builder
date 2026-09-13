export const formatDate = (
  value?: string | Date | null,
  fallback: string = "-"
): string => {
  if (!value) {
    return fallback;
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return fallback;
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export const formatDateTime = (
  value?: string | Date | null,
  fallback: string = "-"
): string => {
  if (!value) {
    return fallback;
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return fallback;
  }

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export const formatTime = (
  value?: string | Date | null,
  fallback: string = "-"
): string => {
  if (!value) {
    return fallback;
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return fallback;
  }

  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export const formatNumber = (
  value?: number | string | null,
  fallback: string = "0"
): string => {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }

  const number = Number(value);

  if (Number.isNaN(number)) {
    return fallback;
  }

  return new Intl.NumberFormat("en-IN").format(number);
};

export const formatCurrency = (
  value?: number | string | null,
  currency: string = "INR",
  fallback: string = "₹0"
): string => {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }

  const number = Number(value);

  if (Number.isNaN(number)) {
    return fallback;
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(number);
};

export const formatPercentage = (
  value?: number | string | null,
  decimals: number = 2,
  fallback: string = "0%"
): string => {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }

  const number = Number(value);

  if (Number.isNaN(number)) {
    return fallback;
  }

  return `${number.toFixed(decimals)}%`;
};

export const formatFileSize = (
  bytes?: number | null,
  fallback: string = "0 Bytes"
): string => {
  if (bytes === null || bytes === undefined || bytes < 0) {
    return fallback;
  }

  if (bytes === 0) {
    return "0 Bytes";
  }

  const units = [
    "Bytes",
    "KB",
    "MB",
    "GB",
    "TB",
  ];

  const index = Math.floor(Math.log(bytes) / Math.log(1024));

  const unitIndex = Math.min(index, units.length - 1);

  const size = bytes / Math.pow(1024, unitIndex);

  return `${size.toFixed(size >= 10 || unitIndex === 0 ? 0 : 2)} ${
    units[unitIndex]
  }`;
};

export const capitalize = (
  value?: string | null,
  fallback: string = ""
): string => {
  if (!value) {
    return fallback;
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
};

export const capitalizeWords = (
  value?: string | null,
  fallback: string = ""
): string => {
  if (!value) {
    return fallback;
  }

  return value
    .trim()
    .split(/\s+/)
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1).toLowerCase()
    )
    .join(" ");
};

export const formatStatus = (
  value?: string | null,
  fallback: string = "-"
): string => {
  if (!value) {
    return fallback;
  }

  return value
    .trim()
    .replace(/[_-]+/g, " ")
    .split(/\s+/)
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1).toLowerCase()
    )
    .join(" ");
};

export const formatRole = (
  value?: string | null,
  fallback: string = "-"
): string => {
  if (!value) {
    return fallback;
  }

  return formatStatus(value, fallback);
};

export const truncateText = (
  value?: string | null,
  maxLength: number = 50,
  suffix: string = "..."
): string => {
  if (!value) {
    return "";
  }

  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, Math.max(0, maxLength - suffix.length))}${suffix}`;
};

export const formatBoolean = (
  value?: boolean | null,
  trueLabel: string = "Yes",
  falseLabel: string = "No"
): string => {
  if (value === null || value === undefined) {
    return "-";
  }

  return value ? trueLabel : falseLabel;
};

export const formatFieldType = (
  value?: string | null,
  fallback: string = "-"
): string => {
  if (!value) {
    return fallback;
  }

  return formatStatus(value, fallback);
};

export const formatResponseStatus = (
  value?: string | null,
  fallback: string = "-"
): string => {
  if (!value) {
    return fallback;
  }

  return formatStatus(value, fallback);
};

export const formatReportStatus = (
  value?: string | null,
  fallback: string = "-"
): string => {
  if (!value) {
    return fallback;
  }

  return formatStatus(value, fallback);
};

export const formatRelativeTime = (
  value?: string | Date | null,
  fallback: string = "-"
): string => {
  if (!value) {
    return fallback;
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return fallback;
  }

  const now = new Date();
  const difference = now.getTime() - date.getTime();

  const seconds = Math.floor(difference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  }

  if (hours < 24) {
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  }

  if (days < 7) {
    return `${days} day${days === 1 ? "" : "s"} ago`;
  }

  return formatDate(date);
};

export const formatInitials = (
  name?: string | null,
  fallback: string = "U"
): string => {
  if (!name || !name.trim()) {
    return fallback;
  }

  const words = name.trim().split(/\s+/);

  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }

  return `${words[0].charAt(0)}${words[words.length - 1].charAt(
    0
  )}`.toUpperCase();
};

export const formatApiMessage = (
  message?: string | null,
  fallback: string = "Something went wrong"
): string => {
  if (!message || !message.trim()) {
    return fallback;
  }

  return message.trim();
};