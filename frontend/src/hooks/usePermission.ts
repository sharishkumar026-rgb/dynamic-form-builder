import { useEffect, useState } from "react";
import authStore from "../store/authStore";

interface PermissionHook {
  isAuthenticated: boolean;
  isAdmin: boolean;
  role: string;

  hasRole: (role: string | string[]) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
  hasPermission: (permission: string | string[]) => boolean;

  canViewUsers: boolean;
  canManageUsers: boolean;
  canManageRoles: boolean;
  canViewActivityLogs: boolean;

  canCreateForm: boolean;
  canEditForm: boolean;
  canDeleteForm: boolean;
  canViewResponses: boolean;
  canManageResponses: boolean;

  canCreateReport: boolean;
  canEditReport: boolean;
  canDeleteReport: boolean;
  canExportReport: boolean;
}

const normalize = (value: string): string => {
  return value.trim().toLowerCase();
};

const usePermission = (): PermissionHook => {
  const [authState, setAuthState] = useState(authStore.getState());

  useEffect(() => {
    return authStore.subscribe((state) => {
      setAuthState(state);
    });
  }, []);

  const role = authStore.getUserRole();
  const isAdmin = role === "admin";
  const isAuthenticated = authState.isAuthenticated;

  const hasRole = (requiredRole: string | string[]): boolean => {
    if (!role) {
      return false;
    }

    if (Array.isArray(requiredRole)) {
      return requiredRole.some(
        (item) => normalize(item) === role
      );
    }

    return normalize(requiredRole) === role;
  };

  const hasAnyRole = (roles: string[]): boolean => {
    if (!role || roles.length === 0) {
      return false;
    }

    return roles.some(
      (item) => normalize(item) === role
    );
  };

  const hasPermission = (
    permission: string | string[]
  ): boolean => {
    if (!isAuthenticated) {
      return false;
    }

    /*
     * Current assignment uses RBAC with Admin/User roles.
     *
     * Admin has access to all assignment-level permissions.
     * Regular users have access to their own form/report operations.
     */

    const permissions = Array.isArray(permission)
      ? permission.map(normalize)
      : [normalize(permission)];

    if (isAdmin) {
      return true;
    }

    const userPermissions = new Set([
      "form.create",
      "form.edit",
      "form.view",
      "form.preview",

      "response.create",
      "response.update",
      "response.delete",

      "report.create",
      "report.edit",
      "report.view",
      "report.export",

      "dashboard.view",
      "analytics.view",
      "profile.view",
      "profile.edit",
    ]);

    return permissions.some((item) =>
      userPermissions.has(item)
    );
  };

  return {
    isAuthenticated,
    isAdmin,
    role,

    hasRole,
    hasAnyRole,
    hasPermission,

    // User management
    canViewUsers: isAdmin,
    canManageUsers: isAdmin,
    canManageRoles: isAdmin,
    canViewActivityLogs: isAdmin,

    // Forms
    canCreateForm: hasPermission("form.create"),
    canEditForm: hasPermission("form.edit"),
    canDeleteForm: isAdmin,
    canViewResponses: isAdmin,
    canManageResponses:
      isAdmin || hasPermission("response.update"),

    // Reports
    canCreateReport: hasPermission("report.create"),
    canEditReport: hasPermission("report.edit"),
    canDeleteReport: isAdmin,
    canExportReport: hasPermission("report.export"),
  };
};

export default usePermission;