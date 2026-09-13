
export type ThemeMode = "light" | "dark" | "system";

export type NotificationSeverity =
  | "success"
  | "error"
  | "warning"
  | "info";

export interface UiNotification {
  id: string;
  message: string;
  severity: NotificationSeverity;
  duration?: number;
}

export interface UiState {
  sidebarOpen: boolean;
  mobileSidebarOpen: boolean;
  themeMode: ThemeMode;
  globalLoading: boolean;
  notifications: UiNotification[];
}

const STORAGE_KEY = "ui_preferences";

const getInitialThemeMode = (): ThemeMode => {
  const stored = localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    return "system";
  }

  try {
    const parsed = JSON.parse(stored) as {
      themeMode?: ThemeMode;
    };

    if (
      parsed.themeMode === "light" ||
      parsed.themeMode === "dark" ||
      parsed.themeMode === "system"
    ) {
      return parsed.themeMode;
    }
  } catch {
    // Ignore invalid stored preferences.
  }

  return "system";
};

const initialState: UiState = {
  sidebarOpen: true,
  mobileSidebarOpen: false,
  themeMode: getInitialThemeMode(),
  globalLoading: false,
  notifications: [],
};

let uiState: UiState = {
  ...initialState,
};

const listeners = new Set<(state: UiState) => void>();

const notifyListeners = () => {
  listeners.forEach((listener) => {
    listener({
      ...uiState,
      notifications: [...uiState.notifications],
    });
  });
};

const updateState = (newState: Partial<UiState>) => {
  uiState = {
    ...uiState,
    ...newState,
  };

  notifyListeners();
};

const saveThemePreference = (themeMode: ThemeMode) => {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      themeMode,
    })
  );
};

const toggleSidebar = () => {
  updateState({
    sidebarOpen: !uiState.sidebarOpen,
  });
};

const setSidebarOpen = (open: boolean) => {
  updateState({
    sidebarOpen: open,
  });
};

const toggleMobileSidebar = () => {
  updateState({
    mobileSidebarOpen: !uiState.mobileSidebarOpen,
  });
};

const setMobileSidebarOpen = (open: boolean) => {
  updateState({
    mobileSidebarOpen: open,
  });
};

const closeSidebars = () => {
  updateState({
    mobileSidebarOpen: false,
  });
};

const setThemeMode = (themeMode: ThemeMode) => {
  saveThemePreference(themeMode);

  updateState({
    themeMode,
  });
};

const setGlobalLoading = (loading: boolean) => {
  updateState({
    globalLoading: loading,
  });
};

const addNotification = (
  message: string,
  severity: NotificationSeverity = "info",
  duration = 4000
): string => {
  const id = `${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 9)}`;

  const notification: UiNotification = {
    id,
    message,
    severity,
    duration,
  };

  updateState({
    notifications: [...uiState.notifications, notification],
  });

  if (duration > 0) {
    window.setTimeout(() => {
      removeNotification(id);
    }, duration);
  }

  return id;
};

const removeNotification = (id: string) => {
  updateState({
    notifications: uiState.notifications.filter(
      (notification) => notification.id !== id
    ),
  });
};

const clearNotifications = () => {
  updateState({
    notifications: [],
  });
};

const showSuccess = (message: string, duration = 4000) => {
  return addNotification(message, "success", duration);
};

const showError = (message: string, duration = 5000) => {
  return addNotification(message, "error", duration);
};

const showWarning = (message: string, duration = 5000) => {
  return addNotification(message, "warning", duration);
};

const showInfo = (message: string, duration = 4000) => {
  return addNotification(message, "info", duration);
};

const getState = (): UiState => {
  return {
    ...uiState,
    notifications: [...uiState.notifications],
  };
};

const subscribe = (listener: (state: UiState) => void) => {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
};

const reset = () => {
  uiState = {
    ...initialState,
    themeMode: getInitialThemeMode(),
    notifications: [],
  };

  notifyListeners();
};

const uiStore = {
  getState,
  subscribe,

  toggleSidebar,
  setSidebarOpen,

  toggleMobileSidebar,
  setMobileSidebarOpen,
  closeSidebars,

  setThemeMode,

  setGlobalLoading,

  addNotification,
  removeNotification,
  clearNotifications,

  showSuccess,
  showError,
  showWarning,
  showInfo,

  reset,
};

export default uiStore;

