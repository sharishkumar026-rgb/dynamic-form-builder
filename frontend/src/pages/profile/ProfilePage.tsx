import { useEffect, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import RefreshIcon from "@mui/icons-material/Refresh";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import ShieldIcon from "@mui/icons-material/Shield";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

const API_BASE_URL = "http://127.0.0.1:8000/api";

interface UserProfile {
  id: number | string;
  name: string;
  email: string;

  role_id?: number | string;
  roleId?: number | string;

  role?: {
    id?: number | string;
    name?: string;
    description?: string;
    is_active?: boolean;
    isActive?: boolean;
  };

  is_active?: boolean;
  isActive?: boolean;

  created_at?: string;
  createdAt?: string;

  updated_at?: string;
  updatedAt?: string;
}

interface ProfileFormData {
  name: string;
  email: string;
}

function isObject(value: unknown): value is Record<string, unknown> {
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

function convertUser(value: unknown): UserProfile | null {
  if (!isObject(value)) {
    return null;
  }

  const id = value.id;

  if (typeof id !== "number" && typeof id !== "string") {
    return null;
  }

  const roleValue = isObject(value.role)
    ? value.role
    : undefined;

  const role = roleValue
    ? {
        id:
          typeof roleValue.id === "number" ||
          typeof roleValue.id === "string"
            ? roleValue.id
            : undefined,

        name:
          typeof roleValue.name === "string"
            ? roleValue.name
            : undefined,

        description:
          typeof roleValue.description === "string"
            ? roleValue.description
            : undefined,

        is_active:
          typeof roleValue.is_active === "boolean"
            ? roleValue.is_active
            : undefined,

        isActive:
          typeof roleValue.isActive === "boolean"
            ? roleValue.isActive
            : undefined,
      }
    : undefined;

  return {
    id,

    name:
      typeof value.name === "string"
        ? value.name
        : "",

    email:
      typeof value.email === "string"
        ? value.email
        : "",

    role_id:
      typeof value.role_id === "number" ||
      typeof value.role_id === "string"
        ? value.role_id
        : undefined,

    roleId:
      typeof value.roleId === "number" ||
      typeof value.roleId === "string"
        ? value.roleId
        : undefined,

    role,

    is_active:
      typeof value.is_active === "boolean"
        ? value.is_active
        : undefined,

    isActive:
      typeof value.isActive === "boolean"
        ? value.isActive
        : undefined,

    created_at:
      typeof value.created_at === "string"
        ? value.created_at
        : undefined,

    createdAt:
      typeof value.createdAt === "string"
        ? value.createdAt
        : undefined,

    updated_at:
      typeof value.updated_at === "string"
        ? value.updated_at
        : undefined,

    updatedAt:
      typeof value.updatedAt === "string"
        ? value.updatedAt
        : undefined,
  };
}

function extractUser(result: unknown): UserProfile | null {
  if (!isObject(result)) {
    return null;
  }

  const directUser = convertUser(result);

  if (directUser) {
    return directUser;
  }

  if (isObject(result.user)) {
    return convertUser(result.user);
  }

  if (isObject(result.data)) {
    const data = result.data;

    if (isObject(data.user)) {
      return convertUser(data.user);
    }

    return convertUser(data);
  }

  return null;
}

function getRoleName(user: UserProfile): string {
  if (user.role?.name) {
    return user.role.name;
  }

  return "User";
}

function getActiveStatus(user: UserProfile): boolean {
  if (typeof user.is_active === "boolean") {
    return user.is_active;
  }

  if (typeof user.isActive === "boolean") {
    return user.isActive;
  }

  return true;
}

function getCreatedAt(user: UserProfile): string | undefined {
  return user.created_at || user.createdAt;
}

function getUpdatedAt(user: UserProfile): string | undefined {
  return user.updated_at || user.updatedAt;
}

function formatDate(value?: string): string {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
}

function getInitials(name: string): string {
  const trimmed = name.trim();

  if (!trimmed) {
    return "U";
  }

  const parts = trimmed.split(/\s+/);

  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }

  return (
    parts[0].charAt(0) +
    parts[parts.length - 1].charAt(0)
  ).toUpperCase();
}

export default function ProfilePage() {
  const [profile, setProfile] =
    useState<UserProfile | null>(null);

  const [formData, setFormData] =
    useState<ProfileFormData>({
      name: "",
      email: "",
    });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchProfile = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = getAccessToken();

      const response = await fetch(
        `${API_BASE_URL}/auth/me`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            ...(token
              ? {
                  Authorization: `Bearer ${token}`,
                }
              : {}),
          },
        }
      );

      const result: unknown = await response.json();

      if (!response.ok) {
        if (
          isObject(result) &&
          typeof result.detail === "string"
        ) {
          throw new Error(result.detail);
        }

        if (
          isObject(result) &&
          typeof result.message === "string"
        ) {
          throw new Error(result.message);
        }

        throw new Error(
          "Failed to load profile."
        );
      }

      const user = extractUser(result);

      if (!user) {
        throw new Error(
          "Invalid profile response received from server."
        );
      }

      setProfile(user);

      setFormData({
        name: user.name,
        email: user.email,
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load profile."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchProfile();
  }, []);

  const handleEdit = () => {
    if (!profile) {
      return;
    }

    setFormData({
      name: profile.name,
      email: profile.email,
    });

    setError("");
    setSuccess("");
    setEditing(true);
  };

  const handleCancel = () => {
    if (!profile) {
      return;
    }

    setFormData({
      name: profile.name,
      email: profile.email,
    });

    setError("");
    setEditing(false);
  };

  const handleSave = async () => {
    setError("");
    setSuccess("");

    if (!profile) {
      return;
    }

    const name = formData.name.trim();
    const email = formData.email.trim();

    if (name.length < 2) {
      setError(
        "Name must contain at least 2 characters."
      );
      return;
    }

    if (name.length > 100) {
      setError(
        "Name cannot exceed 100 characters."
      );
      return;
    }

    if (!email) {
      setError("Email is required.");
      return;
    }

    setSaving(true);

    try {
      const token = getAccessToken();

      const response = await fetch(
        `${API_BASE_URL}/users/${profile.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            ...(token
              ? {
                  Authorization: `Bearer ${token}`,
                }
              : {}),
          },
          body: JSON.stringify({
            name,
            email,
          }),
        }
      );

      const result: unknown = await response.json();

      if (!response.ok) {
        if (
          isObject(result) &&
          typeof result.detail === "string"
        ) {
          throw new Error(result.detail);
        }

        if (
          isObject(result) &&
          typeof result.message === "string"
        ) {
          throw new Error(result.message);
        }

        throw new Error(
          "Failed to update profile."
        );
      }

      const updatedUser = extractUser(result);

      if (updatedUser) {
        setProfile(updatedUser);

        setFormData({
          name: updatedUser.name,
          email: updatedUser.email,
        });
      } else {
        await fetchProfile();
      }

      setEditing(false);
      setSuccess(
        "Profile updated successfully."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update profile."
      );
    } finally {
      setSaving(false);
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
        <Stack
          alignItems="center"
          spacing={2}
        >
          <CircularProgress />

          <Typography color="text.secondary">
            Loading profile...
          </Typography>
        </Stack>
      </Box>
    );
  }

  if (!profile) {
    return (
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || "Profile could not be loaded."}
        </Alert>

        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={() => void fetchProfile()}
        >
          Try Again
        </Button>
      </Box>
    );
  }

  const active = getActiveStatus(profile);

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems={{
          xs: "stretch",
          md: "center",
        }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography
            variant="h4"
            fontWeight={700}
          >
            My Profile
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            View and manage your account information.
          </Typography>
        </Box>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1}
        >
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() =>
              void fetchProfile()
            }
            disabled={saving}
          >
            Refresh
          </Button>

          {!editing ? (
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={handleEdit}
            >
              Edit Profile
            </Button>
          ) : (
            <>
              <Button
                variant="outlined"
                startIcon={<CancelIcon />}
                onClick={handleCancel}
                disabled={saving}
              >
                Cancel
              </Button>

              <Button
                variant="contained"
                startIcon={
                  saving ? (
                    <CircularProgress
                      size={18}
                      color="inherit"
                    />
                  ) : (
                    <SaveIcon />
                  )
                }
                onClick={() =>
                  void handleSave()
                }
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </Button>
            </>
          )}
        </Stack>
      </Stack>

      {/* Alerts */}
      {error && (
        <Alert
          severity="error"
          onClose={() => setError("")}
          sx={{ mb: 2 }}
        >
          {error}
        </Alert>
      )}

      {success && (
        <Alert
          severity="success"
          onClose={() => setSuccess("")}
          sx={{ mb: 2 }}
        >
          {success}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Profile Card */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Stack
                alignItems="center"
                spacing={2}
                sx={{ py: 2 }}
              >
                <Avatar
                  sx={{
                    width: 100,
                    height: 100,
                    fontSize: 36,
                    bgcolor: "primary.main",
                  }}
                >
                  {getInitials(profile.name)}
                </Avatar>

                <Box sx={{ textAlign: "center" }}>
                  <Typography
                    variant="h5"
                    fontWeight={700}
                  >
                    {profile.name}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                  >
                    {profile.email}
                  </Typography>
                </Box>

                <Stack
                  direction="row"
                  spacing={1}
                  flexWrap="wrap"
                  justifyContent="center"
                >
                  <Box
                    sx={{
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 5,
                      bgcolor: active
                        ? "success.light"
                        : "grey.200",
                      color: active
                        ? "success.dark"
                        : "text.secondary",
                    }}
                  >
                    <Typography
                      variant="caption"
                      fontWeight={700}
                    >
                      {active
                        ? "Active"
                        : "Inactive"}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 5,
                      bgcolor:
                        "primary.50",
                      color:
                        "primary.main",
                    }}
                  >
                    <Typography
                      variant="caption"
                      fontWeight={700}
                    >
                      {getRoleName(profile)}
                    </Typography>
                  </Box>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Personal Information */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent>
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{ mb: 2 }}
              >
                <PersonIcon color="primary" />

                <Typography
                  variant="h6"
                  fontWeight={700}
                >
                  Personal Information
                </Typography>
              </Stack>

              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={2.5}>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    value={formData.name}
                    disabled={!editing || saving}
                    onChange={(event) =>
                      setFormData(
                        (previous) => ({
                          ...previous,
                          name: event.target.value,
                        })
                      )
                    }
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    value={formData.email}
                    disabled={!editing || saving}
                    onChange={(event) =>
                      setFormData(
                        (previous) => ({
                          ...previous,
                          email:
                            event.target.value,
                        })
                      )
                    }
                    type="email"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Account Information */}
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{ mb: 2 }}
              >
                <ShieldIcon color="primary" />

                <Typography
                  variant="h6"
                  fontWeight={700}
                >
                  Account Information
                </Typography>
              </Stack>

              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Stack
                    direction="row"
                    spacing={1.5}
                    alignItems="center"
                  >
                    <PersonIcon color="action" />

                    <Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        User ID
                      </Typography>

                      <Typography
                        variant="body1"
                        fontWeight={600}
                      >
                        {profile.id}
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Stack
                    direction="row"
                    spacing={1.5}
                    alignItems="center"
                  >
                    <EmailIcon color="action" />

                    <Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        Email
                      </Typography>

                      <Typography
                        variant="body1"
                        fontWeight={600}
                        sx={{
                          wordBreak:
                            "break-word",
                        }}
                      >
                        {profile.email}
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Stack
                    direction="row"
                    spacing={1.5}
                    alignItems="center"
                  >
                    <ShieldIcon color="action" />

                    <Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        Role
                      </Typography>

                      <Typography
                        variant="body1"
                        fontWeight={600}
                      >
                        {getRoleName(
                          profile
                        )}
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Stack
                    direction="row"
                    spacing={1.5}
                    alignItems="center"
                  >
                    <CalendarTodayIcon color="action" />

                    <Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        Status
                      </Typography>

                      <Typography
                        variant="body1"
                        fontWeight={600}
                      >
                        {active
                          ? "Active"
                          : "Inactive"}
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Account Dates */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography
                variant="h6"
                fontWeight={700}
                sx={{ mb: 2 }}
              >
                Account Dates
              </Typography>

              <Divider sx={{ mb: 2 }} />

              <Stack spacing={2}>
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Created At
                  </Typography>

                  <Typography
                    variant="body1"
                    fontWeight={600}
                  >
                    {formatDate(
                      getCreatedAt(profile)
                    )}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Last Updated
                  </Typography>

                  <Typography
                    variant="body1"
                    fontWeight={600}
                  >
                    {formatDate(
                      getUpdatedAt(profile)
                    )}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Role Information */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography
                variant="h6"
                fontWeight={700}
                sx={{ mb: 2 }}
              >
                Role Information
              </Typography>

              <Divider sx={{ mb: 2 }} />

              <Stack spacing={2}>
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Role Name
                  </Typography>

                  <Typography
                    variant="body1"
                    fontWeight={600}
                  >
                    {getRoleName(profile)}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Role ID
                  </Typography>

                  <Typography
                    variant="body1"
                    fontWeight={600}
                  >
                    {profile.role?.id ??
                      profile.role_id ??
                      profile.roleId ??
                      "-"}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Description
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    {profile.role
                      ?.description ||
                      "No role description available."}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}