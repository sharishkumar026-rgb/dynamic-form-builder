import { Navigate, Route, Routes } from "react-router-dom";

// ==============================
// Authentication
// ==============================
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";

// ==============================
// Dashboard
// ==============================
import DashboardPage from "../pages/dashboard/DashboardPage";

// ==============================
// Forms
// ==============================
import FormsPage from "../pages/forms/FormsPage";
import CreateFormPage from "../pages/forms/CreateFormPage";
import EditFormPage from "../pages/forms/EditFormPage";
import FormBuilderPage from "../pages/forms/FormBuilderPage";
import FormDetailsPage from "../pages/forms/FormDetailsPage";
import FormPreviewPage from "../pages/forms/FormPreviewPage";

// ==============================
// Responses
// ==============================
import ResponsesPage from "../pages/responses/ResponsesPage";
import ResponseDetailsPage from "../pages/responses/ResponseDetailsPage";
import ResponseHistoryPage from "../pages/responses/ResponseHistoryPage";

// ==============================
// Analytics
// ==============================
import AnalyticsPage from "../pages/analytics/AnalyticsPage";

// ==============================
// Reports
// ==============================
import ReportsPage from "../pages/reports/ReportsPage";
import CreateReportPage from "../pages/reports/CreateReportPage";
import EditReportPage from "../pages/reports/EditReportPage";
import ReportDetailsPage from "../pages/reports/ReportDetailsPage";

// ==============================
// Users
// ==============================
import UsersPage from "../pages/users/UsersPage";
import UserDetailsPage from "../pages/users/UserDetailsPage";

// ==============================
// Roles
// ==============================
import RolesPage from "../pages/roles/RolesPage";

// ==============================
// Activity Logs
// ==============================
import ActivityLogsPage from "../pages/activity-logs/ActivityLogsPage";

// ==============================
// Profile
// ==============================
import ProfilePage from "../pages/profile/ProfilePage";

// ==============================
// Error Pages
// ==============================
import NotFoundPage from "../pages/errors/NotFoundPage";
import UnauthorizedPage from "../pages/errors/UnauthorizedPage";
import ServerErrorPage from "../pages/errors/ServerErrorPage";

const AppRoutes = () => {
  return (
    <Routes>
      {/* ==============================
          ROOT
          ============================== */}

      <Route
        path="/"
        element={
          <Navigate
            to="/login"
            replace
          />
        }
      />

      {/* ==============================
          AUTHENTICATION
          ============================== */}

      <Route
        path="/login"
        element={<LoginPage />}
      />

      <Route
        path="/register"
        element={<RegisterPage />}
      />

      {/* ==============================
          DASHBOARD
          ============================== */}

      <Route
        path="/dashboard"
        element={<DashboardPage />}
      />

      {/* ==============================
          FORMS
          ============================== */}

      <Route
        path="/forms"
        element={<FormsPage />}
      />

      <Route
        path="/forms/create"
        element={<CreateFormPage />}
      />

      <Route
        path="/forms/:id/builder"
        element={<FormBuilderPage />}
      />

      <Route
        path="/forms/:id/edit"
        element={<EditFormPage />}
      />

      <Route
        path="/forms/:id/preview"
        element={<FormPreviewPage />}
      />

      {/* ==============================
          RESPONSES
          ============================== */}

      {/* Responses for a specific form */}

      <Route
        path="/forms/:id/responses"
        element={<ResponsesPage />}
      />

      {/* Response details */}

      <Route
        path="/forms/:id/responses/:responseId"
        element={<ResponseDetailsPage />}
      />

      {/* Response history */}

      <Route
        path="/forms/:id/responses/:responseId/history"
        element={<ResponseHistoryPage />}
      />

      {/* ==============================
          FORM DETAILS

          Keep this after all
          /forms/:id/... routes.
          ============================== */}

      <Route
        path="/forms/:id"
        element={<FormDetailsPage />}
      />

      {/* ==============================
          ANALYTICS
          ============================== */}

      <Route
        path="/analytics"
        element={<AnalyticsPage />}
      />

      {/* ==============================
          REPORTS
          ============================== */}

      <Route
        path="/reports"
        element={<ReportsPage />}
      />

      <Route
        path="/reports/create"
        element={<CreateReportPage />}
      />

      <Route
        path="/reports/:id/edit"
        element={<EditReportPage />}
      />

      <Route
        path="/reports/:id"
        element={<ReportDetailsPage />}
      />

      {/* ==============================
          USERS
          ============================== */}

      <Route
        path="/users"
        element={<UsersPage />}
      />

      <Route
        path="/users/:id"
        element={<UserDetailsPage />}
      />

      {/* ==============================
          ROLES
          ============================== */}

      <Route
        path="/roles"
        element={<RolesPage />}
      />

      {/* ==============================
          ACTIVITY LOGS
          ============================== */}

      <Route
        path="/activity-logs"
        element={<ActivityLogsPage />}
      />

      {/* ==============================
          PROFILE
          ============================== */}

      <Route
        path="/profile"
        element={<ProfilePage />}
      />

      {/* ==============================
          ERROR PAGES
          ============================== */}

      <Route
        path="/unauthorized"
        element={<UnauthorizedPage />}
      />

      <Route
        path="/server-error"
        element={<ServerErrorPage />}
      />

      {/* ==============================
          404 - NOT FOUND
          ============================== */}

      <Route
        path="*"
        element={<NotFoundPage />}
      />
    </Routes>
  );
};

export default AppRoutes;