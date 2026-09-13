import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  DeleteOutline as DeleteOutlineIcon,
  EditOutlined as EditOutlinedIcon,
  EmailOutlined as EmailOutlinedIcon,
  PersonOutline as PersonOutlineIcon,
  Refresh as RefreshIcon,
  SecurityOutlined as SecurityOutlinedIcon,
} from "@mui/icons-material";

const API_BASE_URL = "http://127.0.0.1:8000/api";

interface UserData {
  id: number | string;
  name: string;
  email: string;
  role?: string;
  role_id?: number | string;
  roleId?: number | string;
  is_active?: boolean;
  isActive?: boolean;
  created_at?: string;
  createdAt?: string;
  updated_at?: string;
  updatedAt?: string;
}

interface ApiObject {
  [key: string]: unknown;
}

function isObject(value: unknown): value is ApiObject {
  return typeof value === "object" && value !== null;
}

function getAccessToken(): string | null {
  return (
    localStorage.getItem("access_token") ||
    localStorage.getItem("accessToken") ||
    sessionStorage.getItem("access_token") ||
    sessionStorage.getItem("accessToken")
  );
}

function getString(
  object: ApiObject,
  keys: string[],
  fallback = ""
): string {
  for (const key of keys) {
    const value = object[key];

    if (typeof value === "string") {
      return value;
    }

    if (typeof value === "number") {
      return String(value);
    }
  }

  return fallback;
}

function getBoolean(
  object: ApiObject,
  keys: string[],
  fallback = true
): boolean {
  for (const key of keys) {
    const value = object[key];

    if (typeof value === "boolean") {
      return value;
    }
  }

  return fallback;
}

function getRoleName(object: ApiObject): string {
  if (isObject(object.role)) {
    return getString(object.role, ["name"], "User");
  }

  return getString(
    object,
    ["role_name", "roleName", "role"],
    "User"
  );
}

function convertToUser(
  object: ApiObject
): UserData | null {
  const id = object.id;

  if (
    typeof id !== "number" &&
    typeof id !== "string"
  ) {
    return null;
  }

  return {
    id,
    name: getString(
      object,
      ["name", "full_name", "fullName"],
      "Unknown User"
    ),
    email: getString(object, ["email"], ""),
    role: getRoleName(object),
    role_id:
      typeof object.role_id === "number" ||
      typeof object.role_id === "string"
        ? object.role_id
        : undefined,
    roleId:
      typeof object.roleId === "number" ||
      typeof object.roleId === "string"
        ? object.roleId
        : undefined,
    is_active: getBoolean(
      object,
      ["is_active", "isActive"],
      true
    ),
    created_at: getString(object, [
      "created_at",
      "createdAt",
    ]),
    updated_at: getString(object, [
      "updated_at",
      "updatedAt",
    ]),
  };
}

function getUserObject(result: unknown): ApiObject | null {
  if (!isObject(result)) {
    return null;
  }

  if (isObject(result.user)) {
    return result.user;
  }

  if (isObject(result.data)) {
    if (isObject(result.data.user)) {
      return result.data.user;
    }

    return result.data;
  }

  return result;
}

function getErrorMessage(result: unknown): string {
  if (!isObject(result)) {
    return "Request failed.";
  }

  if (typeof result.detail === "string") {
    return result.detail;
  }

  if (typeof result.message === "string") {
    return result.message;
  }

  if (
    isObject(result.error) &&
    typeof result.error.message === "string"
  ) {
    return result.error.message;
  }

  return "Request failed.";
}

function formatDate(value?: string): string {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
}

function formatRole(role?: string): string {
  if (!role) {
    return "User";
  }

  return role.charAt(0).toUpperCase() + role.slice(1);
}

export default function UserDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const loadUser = async () => {
    if (!id) {
      setErrorMessage("User ID is missing.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");

      const token = getAccessToken();

      const headers: Record<string, string> = {};

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(
        `${API_BASE_URL}/users/${id}`,
        {
          method: "GET",
          headers,
        }
      );

      const result: unknown = await response
        .json()
        .catch(() => null);

      if (!response.ok) {
        throw new Error(getErrorMessage(result));
      }

      const userObject = getUserObject(result);

      if (!userObject) {
        throw new Error("User data was not found.");
      }

      const convertedUser =
        convertToUser(userObject);

      if (!convertedUser) {
        throw new Error(
          "Invalid user data received from the server."
        );
      }

      setUser(convertedUser);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to load user."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadUser();
  }, [id]);

  const handleStatusToggle = async () => {
    if (!user) {
      return;
    }

    const currentStatus = user.is_active !== false;
    const newStatus = !currentStatus;

    const confirmed = window.confirm(
      `Are you sure you want to ${
        newStatus ? "activate" : "deactivate"
      } ${user.name}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(true);
      setErrorMessage("");

      const token = getAccessToken();

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(
        `${API_BASE_URL}/users/${user.id}/status`,
        {
          method: "PATCH",
          headers,
          body: JSON.stringify({
            is_active: newStatus,
          }),
        }
      );

      const result: unknown = await response
        .json()
        .catch(() => null);

      if (!response.ok) {
        throw new Error(getErrorMessage(result));
      }

      setUser((previous) =>
        previous
          ? {
              ...previous,
              is_active: newStatus,
            }
          : previous
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to update user status."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!user) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete ${user.name}? This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(true);
      setErrorMessage("");

      const token = getAccessToken();

      const headers: Record<string, string> = {};

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(
        `${API_BASE_URL}/users/${user.id}`,
        {
          method: "DELETE",
          headers,
        }
      );

      const result: unknown = await response
        .json()
        .catch(() => null);

      if (!response.ok) {
        throw new Error(getErrorMessage(result));
      }

      navigate("/users");
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to delete user."
      );
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Stack spacing={2} alignItems="center">
          <CircularProgress />

          <Typography color="text.secondary">
            Loading user...
          </Typography>
        </Stack>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        <Box sx={{ maxWidth: 1000, mx: "auto" }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMessage || "User was not found."}
          </Alert>

          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/users")}
          >
            Back to Users
          </Button>
        </Box>
      </Box>
    );
  }

  const isActive = user.is_active !== false;

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Box sx={{ maxWidth: 1100, mx: "auto" }}>
        {/* Header */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{
            xs: "flex-start",
            md: "center",
          }}
          spacing={2}
          sx={{ mb: 3 }}
        >
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
          >
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "primary.main",
                color: "primary.contrastText",
                fontSize: 26,
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {user.name
                .charAt(0)
                .toUpperCase()}
            </Box>

            <Box>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                flexWrap="wrap"
                useFlexGap
              >
                <Typography
                  variant="h4"
                  fontWeight={700}
                >
                  {user.name}
                </Typography>

                <Chip
                  label={
                    isActive
                      ? "Active"
                      : "Inactive"
                  }
                  color={
                    isActive
                      ? "success"
                      : "error"
                  }
                  size="small"
                />
              </Stack>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                User ID: {user.id}
              </Typography>
            </Box>
          </Stack>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
            width={{ xs: "100%", md: "auto" }}
          >
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate("/users")}
              disabled={actionLoading}
            >
              Back
            </Button>

            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => void loadUser()}
              disabled={actionLoading}
            >
              Refresh
            </Button>

            <Button
              variant="contained"
              startIcon={<EditOutlinedIcon />}
              onClick={() =>
                navigate(`/users/${user.id}/edit`)
              }
              disabled={actionLoading}
            >
              Edit
            </Button>
          </Stack>
        </Stack>

        {errorMessage && (
          <Alert
            severity="error"
            onClose={() => setErrorMessage("")}
            sx={{ mb: 3 }}
          >
            {errorMessage}
          </Alert>
        )}

        {/* Summary */}
        <Grid container spacing={2.5} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Stack
                  direction="row"
                  spacing={1.5}
                  alignItems="center"
                >
                  <PersonOutlineIcon color="primary" />

                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      User ID
                    </Typography>

                    <Typography
                      variant="h6"
                      fontWeight={700}
                    >
                      {user.id}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Stack
                  direction="row"
                  spacing={1.5}
                  alignItems="center"
                >
                  <SecurityOutlinedIcon color="secondary" />

                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      Role
                    </Typography>

                    <Typography
                      variant="h6"
                      fontWeight={700}
                    >
                      {formatRole(user.role)}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Stack
                  direction="row"
                  spacing={1.5}
                  alignItems="center"
                >
                  {isActive ? (
                    <CheckCircleIcon color="success" />
                  ) : (
                    <BlockIcon color="error" />
                  )}

                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      Account Status
                    </Typography>

                    <Typography
                      variant="h6"
                      fontWeight={700}
                    >
                      {isActive
                        ? "Active"
                        : "Inactive"}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* User Information */}
        <Card sx={{ mb: 3 }}>
          <CardContent
            sx={{ p: { xs: 2, md: 3 } }}
          >
            <Typography
              variant="h6"
              fontWeight={700}
              sx={{ mb: 2 }}
            >
              User Information
            </Typography>

            <Divider sx={{ mb: 2.5 }} />

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Stack
                  direction="row"
                  spacing={1.5}
                  alignItems="flex-start"
                >
                  <PersonOutlineIcon
                    color="action"
                    sx={{ mt: 0.25 }}
                  />

                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      Full Name
                    </Typography>

                    <Typography
                      variant="body1"
                      fontWeight={600}
                      sx={{ mt: 0.5 }}
                    >
                      {user.name}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Stack
                  direction="row"
                  spacing={1.5}
                  alignItems="flex-start"
                >
                  <EmailOutlinedIcon
                    color="action"
                    sx={{ mt: 0.25 }}
                  />

                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      Email Address
                    </Typography>

                    <Typography
                      variant="body1"
                      fontWeight={600}
                      sx={{ mt: 0.5 }}
                    >
                      {user.email || "Not available"}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Stack
                  direction="row"
                  spacing={1.5}
                  alignItems="flex-start"
                >
                  <SecurityOutlinedIcon
                    color="action"
                    sx={{ mt: 0.25 }}
                  />

                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      Role
                    </Typography>

                    <Typography
                      variant="body1"
                      fontWeight={600}
                      sx={{ mt: 0.5 }}
                    >
                      {formatRole(user.role)}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Stack
                  direction="row"
                  spacing={1.5}
                  alignItems="flex-start"
                >
                  {isActive ? (
                    <CheckCircleIcon
                      color="success"
                      sx={{ mt: 0.25 }}
                    />
                  ) : (
                    <BlockIcon
                      color="error"
                      sx={{ mt: 0.25 }}
                    />
                  )}

                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      Account Status
                    </Typography>

                    <Typography
                      variant="body1"
                      fontWeight={600}
                      sx={{ mt: 0.5 }}
                    >
                      {isActive
                        ? "Active"
                        : "Inactive"}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Account Details */}
        <Card sx={{ mb: 3 }}>
          <CardContent
            sx={{ p: { xs: 2, md: 3 } }}
          >
            <Typography
              variant="h6"
              fontWeight={700}
              sx={{ mb: 2 }}
            >
              Account Details
            </Typography>

            <Divider sx={{ mb: 2.5 }} />

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  User ID
                </Typography>

                <Typography
                  variant="body1"
                  fontWeight={600}
                  sx={{ mt: 0.5 }}
                >
                  {user.id}
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Role ID
                </Typography>

                <Typography
                  variant="body1"
                  fontWeight={600}
                  sx={{ mt: 0.5 }}
                >
                  {user.role_id ??
                    user.roleId ??
                    "Not available"}
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Created At
                </Typography>

                <Typography
                  variant="body1"
                  sx={{ mt: 0.5 }}
                >
                  {formatDate(
                    user.created_at
                  )}
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Last Updated
                </Typography>

                <Typography
                  variant="body1"
                  sx={{ mt: 0.5 }}
                >
                  {formatDate(
                    user.updated_at
                  )}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardContent>
            <Stack
              direction={{ xs: "column", md: "row" }}
              justifyContent="space-between"
              alignItems={{
                xs: "flex-start",
                md: "center",
              }}
              spacing={2}
            >
              <Box>
                <Typography
                  variant="subtitle1"
                  fontWeight={700}
                >
                  Account Actions
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  Manage this user's account status
                  or remove the user.
                </Typography>
              </Box>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.5}
                width={{ xs: "100%", md: "auto" }}
              >
                <Button
                  variant="outlined"
                  color={
                    isActive
                      ? "warning"
                      : "success"
                  }
                  startIcon={
                    isActive ? (
                      <BlockIcon />
                    ) : (
                      <CheckCircleIcon />
                    )
                  }
                  onClick={() =>
                    void handleStatusToggle()
                  }
                  disabled={actionLoading}
                >
                  {isActive
                    ? "Deactivate User"
                    : "Activate User"}
                </Button>

                <Button
                  variant="outlined"
                  color="error"
                  startIcon={
                    <DeleteOutlineIcon />
                  }
                  onClick={() =>
                    void handleDelete()
                  }
                  disabled={actionLoading}
                >
                  {actionLoading
                    ? "Processing..."
                    : "Delete User"}
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}