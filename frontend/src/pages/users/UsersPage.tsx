import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import {
  Add as AddIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  DeleteOutline as DeleteOutlineIcon,
  EditOutlined as EditOutlinedIcon,
  PersonOutline as PersonOutlineIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
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
  const directRole = getString(object, [
    "role_name",
    "roleName",
    "role",
  ]);

  if (directRole) {
    return directRole;
  }

  if (isObject(object.role)) {
    return getString(object.role, ["name"], "User");
  }

  return "User";
}

function convertUser(object: ApiObject): UserData | null {
  const id = object.id;

  if (
    typeof id !== "number" &&
    typeof id !== "string"
  ) {
    return null;
  }

  return {
    id,
    name: getString(object, ["name", "full_name", "fullName"], "Unknown User"),
    email: getString(object, ["email"], ""),
    role: getRoleName(object),
    role_id: object.role_id as number | string | undefined,
    roleId: object.roleId as number | string | undefined,
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

function getUsersFromResponse(result: unknown): UserData[] {
  let source: unknown = result;

  if (isObject(result)) {
    if (Array.isArray(result.users)) {
      source = result.users;
    } else if (isObject(result.data)) {
      if (Array.isArray(result.data.users)) {
        source = result.data.users;
      } else if (Array.isArray(result.data)) {
        source = result.data;
      }
    } else if (Array.isArray(result.data)) {
      source = result.data;
    } else if (Array.isArray(result.items)) {
      source = result.items;
    }
  }

  if (!Array.isArray(source)) {
    return [];
  }

  return source
    .filter(isObject)
    .map(convertUser)
    .filter((user): user is UserData => user !== null);
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

  return date.toLocaleDateString();
}

function formatRole(role?: string): string {
  if (!role) {
    return "User";
  }

  return role.charAt(0).toUpperCase() + role.slice(1);
}

export default function UsersPage() {
  const navigate = useNavigate();

  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<
    number | string | null
  >(null);
  const [errorMessage, setErrorMessage] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [roleFilter, setRoleFilter] = useState("all");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const token = getAccessToken();

      const headers: Record<string, string> = {};

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/users`, {
        method: "GET",
        headers,
      });

      const result: unknown = await response
        .json()
        .catch(() => null);

      if (!response.ok) {
        throw new Error(getErrorMessage(result));
      }

      setUsers(getUsersFromResponse(result));
      setPage(0);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to load users."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadUsers();
  }, []);

  const roles = useMemo(() => {
    const roleSet = new Set<string>();

    users.forEach((user) => {
      if (user.role) {
        roleSet.add(user.role.toLowerCase());
      }
    });

    return Array.from(roleSet).sort();
  }, [users]);

  const filteredUsers = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !searchValue ||
        user.name.toLowerCase().includes(searchValue) ||
        user.email.toLowerCase().includes(searchValue) ||
        (user.role ?? "")
          .toLowerCase()
          .includes(searchValue) ||
        String(user.id).includes(searchValue);

      const active = user.is_active !== false;

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && active) ||
        (statusFilter === "inactive" && !active);

      const matchesRole =
        roleFilter === "all" ||
        (user.role ?? "").toLowerCase() ===
          roleFilter.toLowerCase();

      return (
        matchesSearch &&
        matchesStatus &&
        matchesRole
      );
    });
  }, [users, search, statusFilter, roleFilter]);

  const paginatedUsers = useMemo(() => {
    const start = page * rowsPerPage;

    return filteredUsers.slice(
      start,
      start + rowsPerPage
    );
  }, [filteredUsers, page, rowsPerPage]);

  const totalUsers = users.length;

  const activeUsers = users.filter(
    (user) => user.is_active !== false
  ).length;

  const inactiveUsers = totalUsers - activeUsers;

  const adminUsers = users.filter(
    (user) => user.role?.toLowerCase() === "admin"
  ).length;

  const handleStatusToggle = async (user: UserData) => {
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
      setActionLoading(user.id);
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

      setUsers((previous) =>
        previous.map((item) =>
          String(item.id) === String(user.id)
            ? {
                ...item,
                is_active: newStatus,
              }
            : item
        )
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to update user status."
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (user: UserData) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${user.name}? This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(user.id);
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

      setUsers((previous) =>
        previous.filter(
          (item) =>
            String(item.id) !== String(user.id)
        )
      );

      if (
        paginatedUsers.length === 1 &&
        page > 0
      ) {
        setPage(page - 1);
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to delete user."
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleChangePage = (
    _event: unknown,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Box sx={{ maxWidth: 1400, mx: "auto" }}>
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
          <Box>
            <Typography variant="h4" fontWeight={700}>
              Users
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.5 }}
            >
              Manage users, roles, and account status.
            </Typography>
          </Box>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
            width={{ xs: "100%", md: "auto" }}
          >
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => void loadUsers()}
              disabled={loading || actionLoading !== null}
            >
              Refresh
            </Button>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate("/users/create")}
            >
              Add User
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

        {/* Statistics */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
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
                      Total Users
                    </Typography>

                    <Typography
                      variant="h5"
                      fontWeight={700}
                    >
                      {totalUsers}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Stack
                  direction="row"
                  spacing={1.5}
                  alignItems="center"
                >
                  <CheckCircleIcon color="success" />

                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      Active Users
                    </Typography>

                    <Typography
                      variant="h5"
                      fontWeight={700}
                    >
                      {activeUsers}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Stack
                  direction="row"
                  spacing={1.5}
                  alignItems="center"
                >
                  <BlockIcon color="error" />

                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      Inactive Users
                    </Typography>

                    <Typography
                      variant="h5"
                      fontWeight={700}
                    >
                      {inactiveUsers}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Stack
                  direction="row"
                  spacing={1.5}
                  alignItems="center"
                >
                  <PersonOutlineIcon color="secondary" />

                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      Admin Users
                    </Typography>

                    <Typography
                      variant="h5"
                      fontWeight={700}
                    >
                      {adminUsers}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Filters */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Search users"
                  placeholder="Search by name, email, role or ID"
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setPage(0);
                  }}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>

                  <Select
                    value={statusFilter}
                    label="Status"
                    onChange={(event) => {
                      setStatusFilter(
                        event.target.value as
                          | "all"
                          | "active"
                          | "inactive"
                      );
                      setPage(0);
                    }}
                  >
                    <MenuItem value="all">
                      All Statuses
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

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <FormControl fullWidth>
                  <InputLabel>Role</InputLabel>

                  <Select
                    value={roleFilter}
                    label="Role"
                    onChange={(event) => {
                      setRoleFilter(event.target.value);
                      setPage(0);
                    }}
                  >
                    <MenuItem value="all">
                      All Roles
                    </MenuItem>

                    {roles.map((role) => (
                      <MenuItem
                        key={role}
                        value={role}
                      >
                        {formatRole(role)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardContent sx={{ p: 0 }}>
            {loading ? (
              <Box
                sx={{
                  minHeight: 400,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Stack
                  spacing={2}
                  alignItems="center"
                >
                  <CircularProgress />

                  <Typography color="text.secondary">
                    Loading users...
                  </Typography>
                </Stack>
              </Box>
            ) : filteredUsers.length === 0 ? (
              <Box
                sx={{
                  minHeight: 350,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  p: 3,
                }}
              >
                <Stack
                  spacing={1}
                  alignItems="center"
                >
                  <PersonOutlineIcon
                    sx={{
                      fontSize: 56,
                      color: "text.disabled",
                    }}
                  />

                  <Typography
                    variant="h6"
                    fontWeight={600}
                  >
                    No users found
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    textAlign="center"
                  >
                    Try changing your search or filters.
                  </Typography>
                </Stack>
              </Box>
            ) : (
              <>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>User</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Role</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Created</TableCell>
                        <TableCell align="right">
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {paginatedUsers.map((user) => {
                        const isActive =
                          user.is_active !== false;

                        const isActionLoading =
                          String(actionLoading) ===
                          String(user.id);

                        return (
                          <TableRow
                            key={String(user.id)}
                            hover
                          >
                            <TableCell>
                              <Stack
                                direction="row"
                                spacing={1.5}
                                alignItems="center"
                              >
                                <Box
                                  sx={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent:
                                      "center",
                                    bgcolor:
                                      "primary.main",
                                    color:
                                      "primary.contrastText",
                                    fontWeight: 700,
                                  }}
                                >
                                  {user.name
                                    .charAt(0)
                                    .toUpperCase()}
                                </Box>

                                <Box>
                                  <Typography
                                    fontWeight={600}
                                  >
                                    {user.name}
                                  </Typography>

                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    ID: {user.id}
                                  </Typography>
                                </Box>
                              </Stack>
                            </TableCell>

                            <TableCell>
                              {user.email || "—"}
                            </TableCell>

                            <TableCell>
                              <Chip
                                label={formatRole(
                                  user.role
                                )}
                                size="small"
                                variant="outlined"
                              />
                            </TableCell>

                            <TableCell>
                              <Chip
                                label={
                                  isActive
                                    ? "Active"
                                    : "Inactive"
                                }
                                size="small"
                                color={
                                  isActive
                                    ? "success"
                                    : "error"
                                }
                                icon={
                                  isActive ? (
                                    <CheckCircleIcon />
                                  ) : (
                                    <BlockIcon />
                                  )
                                }
                              />
                            </TableCell>

                            <TableCell>
                              {formatDate(
                                user.created_at
                              )}
                            </TableCell>

                            <TableCell align="right">
                              <Stack
                                direction="row"
                                spacing={0.5}
                                justifyContent="flex-end"
                              >
                                <Button
                                  size="small"
                                  variant="outlined"
                                  startIcon={
                                    <EditOutlinedIcon />
                                  }
                                  onClick={() =>
                                    navigate(
                                      `/users/${user.id}/edit`
                                    )
                                  }
                                  disabled={
                                    isActionLoading
                                  }
                                >
                                  Edit
                                </Button>

                                <Button
                                  size="small"
                                  variant="outlined"
                                  color={
                                    isActive
                                      ? "warning"
                                      : "success"
                                  }
                                  onClick={() =>
                                    void handleStatusToggle(
                                      user
                                    )
                                  }
                                  disabled={
                                    isActionLoading
                                  }
                                >
                                  {isActionLoading ? (
                                    <CircularProgress
                                      size={16}
                                    />
                                  ) : isActive ? (
                                    "Deactivate"
                                  ) : (
                                    "Activate"
                                  )}
                                </Button>

                                <Button
                                  size="small"
                                  variant="outlined"
                                  color="error"
                                  startIcon={
                                    <DeleteOutlineIcon />
                                  }
                                  onClick={() =>
                                    void handleDelete(
                                      user
                                    )
                                  }
                                  disabled={
                                    isActionLoading
                                  }
                                >
                                  Delete
                                </Button>
                              </Stack>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>

                <TablePagination
                  component="div"
                  count={filteredUsers.length}
                  page={page}
                  onPageChange={handleChangePage}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={
                    handleChangeRowsPerPage
                  }
                  rowsPerPageOptions={[5, 10, 25, 50]}
                />
              </>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}