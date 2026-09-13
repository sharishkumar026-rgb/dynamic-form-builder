
import { useEffect, useMemo, useState } from "react";
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
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import {
  AssessmentOutlined as AssessmentOutlinedIcon,
  RefreshOutlined as RefreshOutlinedIcon,
  SearchOutlined as SearchOutlinedIcon,
  VisibilityOutlined as VisibilityOutlinedIcon,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

import api from "../../api/axios";

// ==============================
// Types
// ==============================

interface FormItem {
  id: number;
  title: string;
  description?: string | null;
  is_active?: boolean;
  created_at?: string | null;
  updated_at?: string | null;
}

interface FormsResponse {
  success?: boolean;
  message?: string;
  total?: number;
  data?: unknown;
}

// ==============================
// Helpers
// ==============================

const extractForms = (
  result: unknown,
): FormItem[] => {
  if (Array.isArray(result)) {
    return result
      .filter(
        (item): item is Record<string, unknown> =>
          typeof item === "object" &&
          item !== null,
      )
      .map((item) => ({
        id: Number(item.id),
        title:
          typeof item.title === "string"
            ? item.title
            : "Untitled Form",
        description:
          typeof item.description === "string"
            ? item.description
            : null,
        is_active:
          typeof item.is_active === "boolean"
            ? item.is_active
            : true,
        created_at:
          typeof item.created_at === "string"
            ? item.created_at
            : null,
        updated_at:
          typeof item.updated_at === "string"
            ? item.updated_at
            : null,
      }))
      .filter((item) => !Number.isNaN(item.id));
  }

  if (
    typeof result !== "object" ||
    result === null
  ) {
    return [];
  }

  const object =
    result as Record<string, unknown>;

  if ("data" in object) {
    return extractForms(object.data);
  }

  if ("forms" in object) {
    return extractForms(object.forms);
  }

  if ("items" in object) {
    return extractForms(object.items);
  }

  return [];
};

const formatDate = (
  value?: string | null,
): string => {
  if (!value) {
    return "N/A";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString();
};

// ==============================
// Component
// ==============================

export default function ReportsPage() {
  const navigate = useNavigate();

  const [forms, setForms] =
    useState<FormItem[]>([]);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("all");

  const [sortBy, setSortBy] =
    useState("newest");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // ==============================
  // Load Forms
  // ==============================

  const loadForms = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await api.get<FormsResponse>(
          "/forms",
          {
            params: {
              skip: 0,
              limit: 100,
            },
          },
        );

      console.log(
        "Reports - Forms response:",
        response.data,
      );

      setForms(
        extractForms(response.data),
      );
    } catch (err: any) {
      console.error(
        "Failed to load report forms:",
        err,
      );

      setError(
        err?.response?.data?.detail ||
          err?.response?.data?.message ||
          `Failed to load reports (${
            err?.response?.status || 500
          })`,
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadForms();
  }, []);

  // ==============================
  // Filter / Sort
  // ==============================

  const filteredForms =
    useMemo(() => {
      const normalizedSearch =
        search.trim().toLowerCase();

      const filtered =
        forms.filter((form) => {
          const matchesSearch =
            !normalizedSearch ||
            form.title
              .toLowerCase()
              .includes(
                normalizedSearch,
              ) ||
            (form.description || "")
              .toLowerCase()
              .includes(
                normalizedSearch,
              ) ||
            String(form.id).includes(
              normalizedSearch,
            );

          const status =
            form.is_active
              ? "active"
              : "inactive";

          const matchesStatus =
            statusFilter === "all" ||
            status === statusFilter;

          return (
            matchesSearch &&
            matchesStatus
          );
        });

      return [...filtered].sort(
        (a, b) => {
          switch (sortBy) {
            case "oldest":
              return (
                new Date(
                  a.created_at || 0,
                ).getTime() -
                new Date(
                  b.created_at || 0,
                ).getTime()
              );

            case "name_asc":
              return a.title.localeCompare(
                b.title,
              );

            case "name_desc":
              return b.title.localeCompare(
                a.title,
              );

            case "newest":
            default:
              return (
                new Date(
                  b.created_at || 0,
                ).getTime() -
                new Date(
                  a.created_at || 0,
                ).getTime()
              );
          }
        },
      );
    }, [
      forms,
      search,
      statusFilter,
      sortBy,
    ]);

  // ==============================
  // Statistics
  // ==============================

  const totalReports =
    forms.length;

  const activeReports =
    forms.filter(
      (form) => form.is_active,
    ).length;

  const inactiveReports =
    forms.filter(
      (form) => !form.is_active,
    ).length;

  // ==============================
  // Loading
  // ==============================

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "70vh",
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
            Loading reports...
          </Typography>
        </Stack>
      </Box>
    );
  }

  // ==============================
  // UI
  // ==============================

  return (
    <Box
      sx={{
        p: {
          xs: 2,
          md: 4,
        },
      }}
    >
      <Stack spacing={3}>
        {/* Header */}

        <Stack
          direction={{
            xs: "column",
            md: "row",
          }}
          spacing={2}
          justifyContent="space-between"
          alignItems={{
            xs: "flex-start",
            md: "center",
          }}
        >
          <Box>
            <Typography
              variant="h4"
              fontWeight={700}
            >
              Reports
            </Typography>

            <Typography
              color="text.secondary"
              sx={{ mt: 0.5 }}
            >
              View reports and analytics
              generated from your forms
            </Typography>
          </Box>

          <Button
            variant="outlined"
            startIcon={
              <RefreshOutlinedIcon />
            }
            onClick={() =>
              void loadForms()
            }
          >
            Refresh
          </Button>
        </Stack>

        {/* Error */}

        {error && (
          <Alert severity="error">
            {error}
          </Alert>
        )}

        {/* Statistics */}

        <Grid container spacing={2}>
          <Grid
            size={{
              xs: 12,
              sm: 4,
            }}
          >
            <Card variant="outlined">
              <CardContent>
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Total Reports
                </Typography>

                <Typography
                  variant="h4"
                  fontWeight={700}
                  sx={{ mt: 1 }}
                >
                  {totalReports}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid
            size={{
              xs: 12,
              sm: 4,
            }}
          >
            <Card variant="outlined">
              <CardContent>
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Active
                </Typography>

                <Typography
                  variant="h4"
                  fontWeight={700}
                  sx={{ mt: 1 }}
                >
                  {activeReports}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid
            size={{
              xs: 12,
              sm: 4,
            }}
          >
            <Card variant="outlined">
              <CardContent>
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Inactive
                </Typography>

                <Typography
                  variant="h4"
                  fontWeight={700}
                  sx={{ mt: 1 }}
                >
                  {inactiveReports}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Filters */}

        <Paper
          variant="outlined"
          sx={{ p: 2 }}
        >
          <Grid
            container
            spacing={2}
            alignItems="center"
          >
            <Grid
              size={{
                xs: 12,
                md: 5,
              }}
            >
              <TextField
                fullWidth
                size="small"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value,
                  )
                }
                placeholder="Search reports..."
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchOutlinedIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid
              size={{
                xs: 12,
                sm: 6,
                md: 3,
              }}
            >
              <Select
                fullWidth
                size="small"
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value,
                  )
                }
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
            </Grid>

            <Grid
              size={{
                xs: 12,
                sm: 6,
                md: 4,
              }}
            >
              <Select
                fullWidth
                size="small"
                value={sortBy}
                onChange={(event) =>
                  setSortBy(
                    event.target.value,
                  )
                }
              >
                <MenuItem value="newest">
                  Newest First
                </MenuItem>

                <MenuItem value="oldest">
                  Oldest First
                </MenuItem>

                <MenuItem value="name_asc">
                  Name A-Z
                </MenuItem>

                <MenuItem value="name_desc">
                  Name Z-A
                </MenuItem>
              </Select>
            </Grid>
          </Grid>
        </Paper>

        {/* Reports */}

        {filteredForms.length === 0 ? (
          <Paper
            variant="outlined"
            sx={{ p: 6 }}
          >
            <Stack
              spacing={2}
              alignItems="center"
              textAlign="center"
            >
              <AssessmentOutlinedIcon
                sx={{
                  fontSize: 60,
                  color:
                    "text.secondary",
                }}
              />

              <Typography
                variant="h6"
                fontWeight={700}
              >
                No Reports Found
              </Typography>

              <Typography color="text.secondary">
                Create a form first to
                generate a report.
              </Typography>

              <Button
                variant="contained"
                onClick={() =>
                  navigate(
                    "/forms/create",
                  )
                }
              >
                Create Form
              </Button>
            </Stack>
          </Paper>
        ) : (
          <Grid container spacing={2}>
            {filteredForms.map(
              (form) => (
                <Grid
                  key={form.id}
                  size={{
                    xs: 12,
                    md: 6,
                    lg: 4,
                  }}
                >
                  <Card
                    variant="outlined"
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection:
                        "column",
                    }}
                  >
                    <CardContent
                      sx={{
                        flex: 1,
                      }}
                    >
                      <Stack spacing={2}>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="flex-start"
                          spacing={1}
                        >
                          <Box
                            sx={{
                              minWidth: 0,
                            }}
                          >
                            <Typography
                              variant="h6"
                              fontWeight={700}
                              sx={{
                                overflow:
                                  "hidden",
                                textOverflow:
                                  "ellipsis",
                                whiteSpace:
                                  "nowrap",
                              }}
                            >
                              {form.title}
                            </Typography>

                            <Typography
                              variant="body2"
                              color="text.secondary"
                            >
                              Form ID:{" "}
                              {form.id}
                            </Typography>
                          </Box>

                          <Chip
                            label={
                              form.is_active
                                ? "Active"
                                : "Inactive"
                            }
                            color={
                              form.is_active
                                ? "success"
                                : "default"
                            }
                            size="small"
                          />
                        </Stack>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            minHeight: 40,
                            display:
                              "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient:
                              "vertical",
                            overflow:
                              "hidden",
                          }}
                        >
                          {form.description ||
                            "No description available."}
                        </Typography>

                        <Divider />

                        <Stack
                          direction="row"
                          justifyContent="space-between"
                        >
                          <Box>
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
                                form.created_at,
                              )}
                            </Typography>
                          </Box>

                          <Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Updated
                            </Typography>

                            <Typography
                              variant="body2"
                              fontWeight={600}
                            >
                              {formatDate(
                                form.updated_at,
                              )}
                            </Typography>
                          </Box>
                        </Stack>
                      </Stack>
                    </CardContent>

                    <Divider />

                    <Box
                      sx={{
                        p: 1,
                        display: "flex",
                        justifyContent:
                          "flex-end",
                      }}
                    >
                      <Button
                        size="small"
                        startIcon={
                          <VisibilityOutlinedIcon />
                        }
                        onClick={() =>
                          navigate(
                            `/reports/${form.id}`,
                          )
                        }
                      >
                        View Report
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              ),
            )}
          </Grid>
        )}
      </Stack>
    </Box>
  );
}

