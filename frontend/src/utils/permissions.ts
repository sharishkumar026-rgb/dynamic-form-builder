export type UserRole = "admin" | "user";

export type Permission =
  | "dashboard.view"
  | "analytics.view"

  | "form.view"
  | "form.create"
  | "form.edit"
  | "form.delete"
  | "form.preview"

  | "response.view"
  | "response.create"
  | "response.update"
  | "response.delete"

  | "report.view"
  | "report.create"
  | "report.edit"
  | "report.delete"
  | "report.export"
  | "report.share"
  | "report.schedule"

  | "user.view"
  | "user.create"
  | "user.edit"
  | "user.delete"
  | "user.manage"

  | "role.view"
  | "role.create"
  | "role.edit"
  | "role.delete"
  | "role.manage"

  | "activity_log.view"

  | "profile.view"
  | "profile.edit";

const ADMIN_PERMISSIONS: Permission[] = [
  "dashboard.view",
  "analytics.view",

  "form.view",
  "form.create",
  "form.edit",
  "form.delete",
  "form.preview",

  "response.view",
  "response.create",
  "response.update",
  "response.delete",

  "report.view",
  "report.create",
  "report.edit",
  "report.delete",
  "report.export",
  "report.share",
  "report.schedule",

  "user.view",
  "user.create",
  "user.edit",
  "user.delete",
  "user.manage",

  "role.view",
  "role.create",
  "role.edit",
  "role.delete",
  "role.manage",

  "activity_log.view",

  "profile.view",
  "profile.edit",
];

const USER_PERMISSIONS: Permission[] = [
  "dashboard.view",
  "analytics.view",

  "form.view",
  "form.create",
  "form.edit",
  "form.preview",

  "response.create",
  "response.update",
  "response.delete",

  "report.view",
  "report.create",
  "report.edit",
  "report.export",

  "profile.view",
  "profile.edit",
];

export const normalizeRole = (
  role?: string | null
): string => {
  return role?.trim().toLowerCase() || "";
};

export const isAdmin = (
  role?: string | null
): boolean => {
  return normalizeRole(role) === "admin";
};

export const isUser = (
  role?: string | null
): boolean => {
  return normalizeRole(role) === "user";
};

export const getRolePermissions = (
  role?: string | null
): Permission[] => {
  const normalizedRole = normalizeRole(role);

  if (normalizedRole === "admin") {
    return ADMIN_PERMISSIONS;
  }

  if (normalizedRole === "user") {
    return USER_PERMISSIONS;
  }

  return [];
};

export const hasPermission = (
  role: string | null | undefined,
  permission: Permission
): boolean => {
  return getRolePermissions(role).includes(permission);
};

export const hasAnyPermission = (
  role: string | null | undefined,
  permissions: Permission[]
): boolean => {
  if (permissions.length === 0) {
    return false;
  }

  return permissions.some((permission) =>
    hasPermission(role, permission)
  );
};

export const hasAllPermissions = (
  role: string | null | undefined,
  permissions: Permission[]
): boolean => {
  if (permissions.length === 0) {
    return true;
  }

  return permissions.every((permission) =>
    hasPermission(role, permission)
  );
};

export const hasRole = (
  currentRole: string | null | undefined,
  requiredRole: UserRole | string
): boolean => {
  return (
    normalizeRole(currentRole) ===
    normalizeRole(requiredRole)
  );
};

export const hasAnyRole = (
  currentRole: string | null | undefined,
  requiredRoles: string[]
): boolean => {
  const normalizedCurrentRole =
    normalizeRole(currentRole);

  if (!normalizedCurrentRole) {
    return false;
  }

  return requiredRoles.some(
    (role) => normalizeRole(role) === normalizedCurrentRole
  );
};

/* Dashboard */

export const canViewDashboard = (
  role?: string | null
): boolean => {
  return hasPermission(role, "dashboard.view");
};

export const canViewAnalytics = (
  role?: string | null
): boolean => {
  return hasPermission(role, "analytics.view");
};

/* Forms */

export const canViewForms = (
  role?: string | null
): boolean => {
  return hasPermission(role, "form.view");
};

export const canCreateForms = (
  role?: string | null
): boolean => {
  return hasPermission(role, "form.create");
};

export const canEditForms = (
  role?: string | null
): boolean => {
  return hasPermission(role, "form.edit");
};

export const canDeleteForms = (
  role?: string | null
): boolean => {
  return hasPermission(role, "form.delete");
};

export const canPreviewForms = (
  role?: string | null
): boolean => {
  return hasPermission(role, "form.preview");
};

/* Responses */

export const canViewResponses = (
  role?: string | null
): boolean => {
  return hasPermission(role, "response.view");
};

export const canCreateResponses = (
  role?: string | null
): boolean => {
  return hasPermission(role, "response.create");
};

export const canUpdateResponses = (
  role?: string | null
): boolean => {
  return hasPermission(role, "response.update");
};

export const canDeleteResponses = (
  role?: string | null
): boolean => {
  return hasPermission(role, "response.delete");
};

/* Reports */

export const canViewReports = (
  role?: string | null
): boolean => {
  return hasPermission(role, "report.view");
};

export const canCreateReports = (
  role?: string | null
): boolean => {
  return hasPermission(role, "report.create");
};

export const canEditReports = (
  role?: string | null
): boolean => {
  return hasPermission(role, "report.edit");
};

export const canDeleteReports = (
  role?: string | null
): boolean => {
  return hasPermission(role, "report.delete");
};

export const canExportReports = (
  role?: string | null
): boolean => {
  return hasPermission(role, "report.export");
};

export const canShareReports = (
  role?: string | null
): boolean => {
  return hasPermission(role, "report.share");
};

export const canScheduleReports = (
  role?: string | null
): boolean => {
  return hasPermission(role, "report.schedule");
};

/* Users */

export const canViewUsers = (
  role?: string | null
): boolean => {
  return hasPermission(role, "user.view");
};

export const canCreateUsers = (
  role?: string | null
): boolean => {
  return hasPermission(role, "user.create");
};

export const canEditUsers = (
  role?: string | null
): boolean => {
  return hasPermission(role, "user.edit");
};

export const canDeleteUsers = (
  role?: string | null
): boolean => {
  return hasPermission(role, "user.delete");
};

export const canManageUsers = (
  role?: string | null
): boolean => {
  return hasPermission(role, "user.manage");
};

/* Roles */

export const canViewRoles = (
  role?: string | null
): boolean => {
  return hasPermission(role, "role.view");
};

export const canCreateRoles = (
  role?: string | null
): boolean => {
  return hasPermission(role, "role.create");
};

export const canEditRoles = (
  role?: string | null
): boolean => {
  return hasPermission(role, "role.edit");
};

export const canDeleteRoles = (
  role?: string | null
): boolean => {
  return hasPermission(role, "role.delete");
};

export const canManageRoles = (
  role?: string | null
): boolean => {
  return hasPermission(role, "role.manage");
};

/* Activity Logs */

export const canViewActivityLogs = (
  role?: string | null
): boolean => {
  return hasPermission(role, "activity_log.view");
};

/* Profile */

export const canViewProfile = (
  role?: string | null
): boolean => {
  return hasPermission(role, "profile.view");
};

export const canEditProfile = (
  role?: string | null
): boolean => {
  return hasPermission(role, "profile.edit");
};

export const permissions = {
  admin: ADMIN_PERMISSIONS,
  user: USER_PERMISSIONS,
} as const;