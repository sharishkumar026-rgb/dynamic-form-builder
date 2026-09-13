export const colors = {
  primary: {
    main: "#1976d2",
    light: "#42a5f5",
    dark: "#1565c0",
    contrastText: "#ffffff",
  },

  secondary: {
    main: "#9c27b0",
    light: "#ba68c8",
    dark: "#7b1fa2",
    contrastText: "#ffffff",
  },

  success: {
    main: "#2e7d32",
    light: "#4caf50",
    dark: "#1b5e20",
    contrastText: "#ffffff",
  },

  warning: {
    main: "#ed6c02",
    light: "#ff9800",
    dark: "#e65100",
    contrastText: "#ffffff",
  },

  error: {
    main: "#d32f2f",
    light: "#ef5350",
    dark: "#c62828",
    contrastText: "#ffffff",
  },

  info: {
    main: "#0288d1",
    light: "#29b6f6",
    dark: "#01579b",
    contrastText: "#ffffff",
  },

  common: {
    white: "#ffffff",
    black: "#000000",
  },

  background: {
    light: "#f5f7fa",
    dark: "#121212",
    paperLight: "#ffffff",
    paperDark: "#1e1e1e",
  },

  text: {
    primary: "#212121",
    secondary: "#616161",
    disabled: "#9e9e9e",
    white: "#ffffff",
  },

  border: {
    light: "#e0e0e0",
    medium: "#bdbdbd",
    dark: "#757575",
  },

  grey: {
    50: "#fafafa",
    100: "#f5f5f5",
    200: "#eeeeee",
    300: "#e0e0e0",
    400: "#bdbdbd",
    500: "#9e9e9e",
    600: "#757575",
    700: "#616161",
    800: "#424242",
    900: "#212121",
  },

  status: {
    active: "#2e7d32",
    inactive: "#757575",
    pending: "#ed6c02",
    completed: "#2e7d32",
    reviewed: "#0288d1",
    submitted: "#1976d2",
    draft: "#757575",
    cancelled: "#d32f2f",
    archived: "#616161",
  },

  chart: {
    primary: "#1976d2",
    secondary: "#9c27b0",
    success: "#2e7d32",
    warning: "#ed6c02",
    error: "#d32f2f",
    info: "#0288d1",
    neutral: "#757575",
  },
} as const;

export type AppColors = typeof colors;

export default colors;