import type { NavigateFunction } from "react-router-dom";

export const goToLogin = (
  navigate: NavigateFunction
): void => {
  navigate("/login");
};

export const goToRegister = (
  navigate: NavigateFunction
): void => {
  navigate("/register");
};

export const goToDashboard = (
  navigate: NavigateFunction
): void => {
  navigate("/dashboard");
};

export const goToForms = (
  navigate: NavigateFunction
): void => {
  navigate("/forms");
};

export const goToCreateForm = (
  navigate: NavigateFunction
): void => {
  navigate("/forms/create");
};

export const goToFormDetails = (
  navigate: NavigateFunction,
  formId: number | string
): void => {
  navigate(`/forms/${formId}`);
};

export const goToEditForm = (
  navigate: NavigateFunction,
  formId: number | string
): void => {
  navigate(`/forms/${formId}/edit`);
};

export const goToFormPreview = (
  navigate: NavigateFunction,
  formId: number | string
): void => {
  navigate(`/forms/${formId}/preview`);
};

export const goToFormResponses = (
  navigate: NavigateFunction,
  formId: number | string
): void => {
  navigate(`/forms/${formId}/responses`);
};

export const goToResponseDetails = (
  navigate: NavigateFunction,
  formId: number | string,
  responseId: number | string
): void => {
  navigate(
    `/forms/${formId}/responses/${responseId}`
  );
};

export const goToResponseHistory = (
  navigate: NavigateFunction,
  formId: number | string,
  responseId: number | string
): void => {
  navigate(
    `/forms/${formId}/responses/${responseId}/history`
  );
};

export const goToAnalytics = (
  navigate: NavigateFunction
): void => {
  navigate("/analytics");
};

export const goToReports = (
  navigate: NavigateFunction
): void => {
  navigate("/reports");
};

export const goToCreateReport = (
  navigate: NavigateFunction
): void => {
  navigate("/reports/create");
};

export const goToReportDetails = (
  navigate: NavigateFunction,
  reportId: number | string
): void => {
  navigate(`/reports/${reportId}`);
};

export const goToEditReport = (
  navigate: NavigateFunction,
  reportId: number | string
): void => {
  navigate(`/reports/${reportId}/edit`);
};

export const goToUsers = (
  navigate: NavigateFunction
): void => {
  navigate("/users");
};

export const goToUserDetails = (
  navigate: NavigateFunction,
  userId: number | string
): void => {
  navigate(`/users/${userId}`);
};

export const goToRoles = (
  navigate: NavigateFunction
): void => {
  navigate("/roles");
};

export const goToActivityLogs = (
  navigate: NavigateFunction
): void => {
  navigate("/activity-logs");
};

export const goToProfile = (
  navigate: NavigateFunction
): void => {
  navigate("/profile");
};

export const goToUnauthorized = (
  navigate: NavigateFunction
): void => {
  navigate("/unauthorized");
};

export const goToServerError = (
  navigate: NavigateFunction
): void => {
  navigate("/server-error");
};

export const goBack = (
  navigate: NavigateFunction
): void => {
  navigate(-1);
};

export const goForward = (
  navigate: NavigateFunction
): void => {
  navigate(1);
};

export const replaceRoute = (
  navigate: NavigateFunction,
  path: string
): void => {
  navigate(path, {
    replace: true,
  });
};

export const navigation = {
  goToLogin,
  goToRegister,
  goToDashboard,
  goToForms,
  goToCreateForm,
  goToFormDetails,
  goToEditForm,
  goToFormPreview,
  goToFormResponses,
  goToResponseDetails,
  goToResponseHistory,
  goToAnalytics,
  goToReports,
  goToCreateReport,
  goToReportDetails,
  goToEditReport,
  goToUsers,
  goToUserDetails,
  goToRoles,
  goToActivityLogs,
  goToProfile,
  goToUnauthorized,
  goToServerError,
  goBack,
  goForward,
  replaceRoute,
};

export default navigation;