import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import ShieldIcon from "@mui/icons-material/Shield";
import PeopleIcon from "@mui/icons-material/People";

const API_BASE_URL = "http://127.0.0.1:8000/api";

interface Role {
  id: number | string;
  name: string;
  description?: string;
  is_active?: boolean;
  isActive?: boolean;
  user_count?: number;
  userCount?: number;
  created_at?: string;
  createdAt?: string;
  updated_at?: string;
  updatedAt?: string;
}

interface RoleFormData {
  name: string;
  description: string;
  isActive: boolean;
}

function getAccessToken(): string | null {
  return (
    localStorage.getItem("access_token") ||
    localStorage.getItem("accessToken") ||
    sessionStorage.getItem("access_token") ||
    sessionStorage.getItem("accessToken")
  );
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getBoolean(
  object: Record<string, unknown>,
  snakeKey: string,
  camelKey: string,
  defaultValue = true
): boolean {
  if (typeof object[snakeKey] === "boolean") {
    return object[snakeKey];
  }

  if (typeof object[camelKey] === "boolean") {
    return object[camelKey];
  }

  return defaultValue;
}

function getNumber(
  object: Record<string, unknown>,
  snakeKey: string,
  camelKey: string
): number {
  const snakeValue = object[snakeKey];

  if (typeof snakeValue === "number") {
    return snakeValue;
  }

  const camelValue = object[camelKey];

  if (typeof camelValue === "number") {
    return camelValue;
  }

  return 0;
}

function convertRole(value: unknown): Role | null {
  if (!isObject(value)) {
    return null;
  }

  const id = value.id;

  if (
    typeof id !== "number" &&
    typeof id !== "string"
  ) {
    return null;
  }

  return {
    id,
    name: typeof value.name === "string" ? value.name : "Unnamed Role",
    description:
      typeof value.description === "string"
        ? value.description
        : "",
    is_active: getBoolean(value, "is_active", "isActive", true),
    user_count: getNumber(value, "user_count", "userCount"),
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

function extractRoles(result: unknown): Role[] {
  if (Array.isArray(result)) {
    return result
      .map(convertRole)
      .filter((role): role is Role => role !== null);
  }

  if (!isObject(result)) {
    return [];
  }

  if (Array.isArray(result.roles)) {
    return result.roles
      .map(convertRole)
      .filter((role): role is Role => role !== null);
  }

  if (isObject(result.data)) {
    const data = result.data;

    if (Array.isArray(data.roles)) {
      return data.roles
        .map(convertRole)
        .filter((role): role is Role => role !== null);
    }

    if (Array.isArray(data.items)) {
      return data.items
        .map(convertRole)
        .filter((role): role is Role => role !== null);
    }

    if (Array.isArray(data)) {
      return data
        .map(convertRole)
        .filter((role): role is Role => role !== null);
    }
  }

  if (Array.isArray(result.items)) {
    return result.items
      .map(convertRole)
      .filter((role): role is Role => role !== null);
  }

  return [];
}

function getRoleActive(role: Role): boolean {
  if (typeof role.is_active === "boolean") {
    return role.is_active;
  }

  if (typeof role.isActive === "boolean") {
    return role.isActive;
  }

  return true;
}

function getRoleUserCount(role: Role): number {
  if (typeof role.user_count === "number") {
    return role.user_count;
  }

  if (typeof role.userCount === "number") {
    return role.userCount;
  }

  return 0;
}

function getRoleCreatedAt(role: Role): string | undefined {
  return role.created_at || role.createdAt;
}

function formatDate(value?: string): string {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString();
}

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);

  const [formData, setFormData] = useState<RoleFormData>({
    name: "",
    description: "",
    isActive: true,
  });

  const fetchRoles = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = getAccessToken();

      const response = await fetch(`${API_BASE_URL}/roles`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          ...(token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {}),
        },
      });

      const result: unknown = await response.json();

      if (!response.ok) {
        if (isObject(result) && typeof result.detail === "string") {
          throw new Error(result.detail);
        }

        if (isObject(result) && typeof result.message === "string") {
          throw new Error(result.message);
        }

        throw new Error("Failed to load roles");
      }

      setRoles(extractRoles(result));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load roles"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchRoles();
  }, []);

  const filteredRoles = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return roles.filter((role) => {
      const active = getRoleActive(role);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && active) ||
        (statusFilter === "inactive" && !active);

      if (!matchesStatus) {
        return false;
      }

      if (!searchValue) {
        return true;
      }

      return (
        role.name.toLowerCase().includes(searchValue) ||
        (role.description || "")
          .toLowerCase()
          .includes(searchValue) ||
        String(role.id).includes(searchValue)
      );
    });
  }, [roles, search, statusFilter]);

  const totalRoles = roles.length;

  const activeRoles = roles.filter((role) =>
    getRoleActive(role)
  ).length;

  const inactiveRoles = totalRoles - activeRoles;

  const totalAssignedUsers = roles.reduce(
    (total, role) => total + getRoleUserCount(role),
    0
  );

  const openCreateDialog = () => {
    setEditingRole(null);

    setFormData({
      name: "",
      description: "",
      isActive: true,
    });

    setError("");
    setSuccess("");
    setDialogOpen(true);
  };

  const openEditDialog = (role: Role) => {
    setEditingRole(role);

    setFormData({
      name: role.name,
      description: role.description || "",
      isActive: getRoleActive(role),
    });

    setError("");
    setSuccess("");
    setDialogOpen(true);
  };

  const closeDialog = () => {
    if (saving) {
      return;
    }

    setDialogOpen(false);
    setEditingRole(null);
  };

  const handleSaveRole = async () => {
    setError("");
    setSuccess("");

    const name = formData.name.trim();
    const description = formData.description.trim();

    if (name.length < 2) {
      setError("Role name must contain at least 2 characters.");
      return;
    }

    if (name.length > 100) {
      setError("Role name cannot exceed 100 characters.");
      return;
    }

    if (description.length > 500) {
      setError("Description cannot exceed 500 characters.");
      return;
    }

    setSaving(true);

    try {
      const token = getAccessToken();

      const payload = {
        name,
        description: description || null,
        is_active: formData.isActive,
      };

      const url = editingRole
        ? `${API_BASE_URL}/roles/${editingRole.id}`
        : `${API_BASE_URL}/roles`;

      const response = await fetch(url, {
        method: editingRole ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...(token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {}),
        },
        body: JSON.stringify(payload),
      });

      const result: unknown = await response.json();

      if (!response.ok) {
        if (isObject(result) && typeof result.detail === "string") {
          throw new Error(result.detail);
        }

        if (isObject(result) && typeof result.message === "string") {
          throw new Error(result.message);
        }

        throw new Error(
          editingRole
            ? "Failed to update role."
            : "Failed to create role."
        );
      }

      setDialogOpen(false);
      setEditingRole(null);

      setSuccess(
        editingRole
          ? "Role updated successfully."
          : "Role created successfully."
      );

      await fetchRoles();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save role."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (role: Role) => {
    setError("");
    setSuccess("");

    try {
      const token = getAccessToken();
      const newStatus = !getRoleActive(role);

      const response = await fetch(
        `${API_BASE_URL}/roles/${role.id}/status`,
        {
          method: "PATCH",
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
            is_active: newStatus,
          }),
        }
      );

      const result: unknown = await response.json();

      if (!response.ok) {
        if (isObject(result) && typeof result.detail === "string") {
          throw new Error(result.detail);
        }

        if (isObject(result) && typeof result.message === "string") {
          throw new Error(result.message);
        }

        throw new Error("Failed to update role status.");
      }

      setSuccess(
        `Role "${role.name}" ${
          newStatus ? "activated" : "deactivated"
        } successfully.`
      );

      await fetchRoles();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update role status."
      );
    }
  };

  const openDeleteDialog = (role: Role) => {
    setRoleToDelete(role);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setRoleToDelete(null);
  };

  const handleDeleteRole = async () => {
    if (!roleToDelete) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      const token = getAccessToken();

      const response = await fetch(
        `${API_BASE_URL}/roles/${roleToDelete.id}`,
        {
          method: "DELETE",
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
        if (isObject(result) && typeof result.detail === "string") {
          throw new Error(result.detail);
        }

        if (isObject(result) && typeof result.message === "string") {
          throw new Error(result.message);
        }

        throw new Error("Failed to delete role.");
      }

      closeDeleteDialog();

      setSuccess(
        `Role "${roleToDelete.name}" deleted successfully.`
      );

      await fetchRoles();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete role."
      );
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", md: "center" }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Roles
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            Manage user roles and role permissions.
          </Typography>
        </Box>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1}
        >
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => void fetchRoles()}
            disabled={loading}
          >
            Refresh
          </Button>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={openCreateDialog}
          >
            Add Role
          </Button>
        </Stack>
      </Stack>

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

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Total Roles
                  </Typography>

                  <Typography
                    variant="h4"
                    fontWeight={700}
                    sx={{ mt: 1 }}
                  >
                    {totalRoles}
                  </Typography>
                </Box>

                <ShieldIcon color="primary" fontSize="large" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Active Roles
                  </Typography>

                  <Typography
                    variant="h4"
                    fontWeight={700}
                    sx={{ mt: 1 }}
                  >
                    {activeRoles}
                  </Typography>
                </Box>

                <Chip
                  label="Active"
                  color="success"
                  size="small"
                />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Inactive Roles
                  </Typography>

                  <Typography
                    variant="h4"
                    fontWeight={700}
                    sx={{ mt: 1 }}
                  >
                    {inactiveRoles}
                  </Typography>
                </Box>

                <Chip
                  label="Inactive"
                  color="default"
                  size="small"
                />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Assigned Users
                  </Typography>

                  <Typography
                    variant="h4"
                    fontWeight={700}
                    sx={{ mt: 1 }}
                  >
                    {totalAssignedUsers}
                  </Typography>
                </Box>

                <PeopleIcon color="primary" fontSize="large" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 7 }}>
              <TextField
                fullWidth
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search roles..."
                InputProps={{
                  startAdornment: (
                    <SearchIcon
                      sx={{
                        mr: 1,
                        color: "text.secondary",
                      }}
                    />
                  ),
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 5 }}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>

                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(event) =>
                    setStatusFilter(
                      event.target.value as
                        | "all"
                        | "active"
                        | "inactive"
                    )
                  }
                >
                  <MenuItem value="all">
                    All Roles
                  </MenuItem>

                  <MenuItem value="active">
                    Active
                  </MenuItem>

                  <MenuItem value="inactive">
                    Inactive
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {loading ? (
        <Card>
          <CardContent>
            <Stack
              alignItems="center"
              justifyContent="center"
              sx={{ py: 8 }}
              spacing={2}
            >
              <CircularProgress />
              <Typography color="text.secondary">
                Loading roles...
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      ) : filteredRoles.length === 0 ? (
        <Card>
          <CardContent>
            <Stack
              alignItems="center"
              justifyContent="center"
              sx={{ py: 8 }}
              spacing={2}
            >
              <ShieldIcon
                sx={{
                  fontSize: 56,
                  color: "text.disabled",
                }}
              />

              <Typography
                variant="h6"
                fontWeight={600}
              >
                No roles found
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                {search || statusFilter !== "all"
                  ? "Try changing your search or filter."
                  : "Create your first role to get started."}
              </Typography>

              {!search && statusFilter === "all" && (
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={openCreateDialog}
                >
                  Add Role
                </Button>
              )}
            </Stack>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={2}>
          {filteredRoles.map((role) => {
            const active = getRoleActive(role);
            const userCount = getRoleUserCount(role);

            return (
              <Grid
                key={String(role.id)}
                size={{ xs: 12, sm: 6, lg: 4 }}
              >
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="flex-start"
                      spacing={2}
                    >
                      <Stack
                        direction="row"
                        spacing={1.5}
                        alignItems="center"
                      >
                        <Box
                          sx={{
                            width: 46,
                            height: 46,
                            borderRadius: 2,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: "primary.main",
                            color: "primary.contrastText",
                          }}
                        >
                          <ShieldIcon />
                        </Box>

                        <Box>
                          <Typography
                            variant="h6"
                            fontWeight={700}
                          >
                            {role.name}
                          </Typography>

                          <Typography
                            variant="caption"
                            color="text.secondary"
                          >
                            Role ID: {role.id}
                          </Typography>
                        </Box>
                      </Stack>

                      <Chip
                        label={
                          active ? "Active" : "Inactive"
                        }
                        color={
                          active ? "success" : "default"
                        }
                        size="small"
                      />
                    </Stack>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mt: 2,
                        minHeight: 42,
                      }}
                    >
                      {role.description ||
                        "No description provided."}
                    </Typography>

                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      sx={{ mt: 3 }}
                    >
                      <Box>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          Assigned Users
                        </Typography>

                        <Typography
                          variant="h6"
                          fontWeight={700}
                        >
                          {userCount}
                        </Typography>
                      </Box>

                      <Box sx={{ textAlign: "right" }}>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          Created
                        </Typography>

                        <Typography
                          variant="body2"
                          fontWeight={600}
                        >
                          {formatDate(
                            getRoleCreatedAt(role)
                          )}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>

                  <Stack
                    direction="row"
                    justifyContent="flex-end"
                    spacing={0.5}
                    sx={{
                      px: 2,
                      pb: 2,
                    }}
                  >
                    <Tooltip
                      title={
                        active
                          ? "Deactivate role"
                          : "Activate role"
                      }
                    >
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() =>
                          void handleToggleStatus(role)
                        }
                      >
                        {active
                          ? "Deactivate"
                          : "Activate"}
                      </Button>
                    </Tooltip>

                    <Tooltip title="Edit role">
                      <IconButton
                        color="primary"
                        onClick={() =>
                          openEditDialog(role)
                        }
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Delete role">
                      <IconButton
                        color="error"
                        onClick={() =>
                          openDeleteDialog(role)
                        }
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      <Dialog
        open={dialogOpen}
        onClose={closeDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {editingRole ? "Edit Role" : "Create Role"}
        </DialogTitle>

        <DialogContent>
          <Stack spacing={2.5} sx={{ pt: 1 }}>
            <TextField
              fullWidth
              required
              label="Role Name"
              value={formData.name}
              onChange={(event) =>
                setFormData((previous) => ({
                  ...previous,
                  name: event.target.value,
                }))
              }
              placeholder="Enter role name"
              autoFocus
            />

            <TextField
              fullWidth
              multiline
              minRows={3}
              label="Description"
              value={formData.description}
              onChange={(event) =>
                setFormData((previous) => ({
                  ...previous,
                  description: event.target.value,
                }))
              }
              placeholder="Enter role description"
            />

            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>

              <Select
                value={formData.isActive ? "active" : "inactive"}
                label="Status"
                onChange={(event) =>
                  setFormData((previous) => ({
                    ...previous,
                    isActive:
                      event.target.value === "active",
                  }))
                }
              >
                <MenuItem value="active">
                  Active
                </MenuItem>

                <MenuItem value="inactive">
                  Inactive
                </MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={closeDialog}
            disabled={saving}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={() => void handleSaveRole()}
            disabled={saving}
            startIcon={
              saving ? (
                <CircularProgress size={18} />
              ) : undefined
            }
          >
            {saving
              ? "Saving..."
              : editingRole
                ? "Update Role"
                : "Create Role"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteDialogOpen}
        onClose={closeDeleteDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          Delete Role
        </DialogTitle>

        <DialogContent>
          <Typography>
            Are you sure you want to delete the role{" "}
            <strong>
              {roleToDelete?.name}
            </strong>
            ?
          </Typography>

          {roleToDelete &&
            getRoleUserCount(roleToDelete) > 0 && (
              <Alert
                severity="warning"
                sx={{ mt: 2 }}
              >
                This role has{" "}
                {getRoleUserCount(roleToDelete)}{" "}
                assigned user
                {getRoleUserCount(roleToDelete) === 1
                  ? ""
                  : "s"}
                . The backend may prevent deletion.
              </Alert>
            )}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={closeDeleteDialog}>
            Cancel
          </Button>

          <Button
            color="error"
            variant="contained"
            startIcon={<DeleteIcon />}
            onClick={() => void handleDeleteRole()}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}