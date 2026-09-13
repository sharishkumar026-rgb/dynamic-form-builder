import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
} from "@mui/icons-material";

const API_BASE_URL = "http://127.0.0.1:8000/api";

interface ReportForm {
  name: string;
  description: string;
  status: "active" | "draft" | "inactive" | "archived";
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

function getReportObject(result: unknown): ApiObject | null {
  if (!isObject(result)) {
    return null;
  }

  if (isObject(result.report)) {
    return result.report;
  }

  if (isObject(result.data)) {
    if (isObject(result.data.report)) {
      return result.data.report;
    }

    return result.data;
  }

  return result;
}

function getStringValue(
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

function getStatusValue(
  object: ApiObject
): ReportForm["status"] {
  const value = getStringValue(object, ["status"], "draft").toLowerCase();

  if (
    value === "active" ||
    value === "draft" ||
    value === "inactive" ||
    value === "archived"
  ) {
    return value;
  }

  return "draft";
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

  if (isObject(result.error) && typeof result.error.message === "string") {
    return result.error.message;
  }

  return "Request failed.";
}

export default function EditReportPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [form, setForm] = useState<ReportForm>({
    name: "",
    description: "",
    status: "draft",
  });

  const [errors, setErrors] = useState<{
    name?: string;
    description?: string;
  }>({});

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadReport = async () => {
      if (!id) {
        setErrorMessage("Report ID is missing.");
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
          `${API_BASE_URL}/reports/${id}`,
          {
            method: "GET",
            headers,
          }
        );

        const result: unknown = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(getErrorMessage(result));
        }

        const report = getReportObject(result);

        if (!report) {
          throw new Error("Report data was not found.");
        }

        setForm({
          name: getStringValue(report, ["name", "title"]),
          description: getStringValue(report, [
            "description",
          ]),
          status: getStatusValue(report),
        });
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Failed to load report."
        );
      } finally {
        setLoading(false);
      }
    };

    void loadReport();
  }, [id]);

  const handleChange =
    (field: "name" | "description") =>
    (
      event: ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement
      >
    ) => {
      const value = event.target.value;

      setForm((previous) => ({
        ...previous,
        [field]: value,
      }));

      setErrors((previous) => ({
        ...previous,
        [field]: undefined,
      }));

      setErrorMessage("");
    };

  const handleActiveChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setForm((previous) => ({
      ...previous,
      status: event.target.checked ? "active" : "draft",
    }));
  };

  const validate = (): boolean => {
    const newErrors: {
      name?: string;
      description?: string;
    } = {};

    const trimmedName = form.name.trim();
    const trimmedDescription = form.description.trim();

    if (!trimmedName) {
      newErrors.name = "Report name is required.";
    } else if (trimmedName.length < 2) {
      newErrors.name =
        "Report name must be at least 2 characters.";
    } else if (trimmedName.length > 255) {
      newErrors.name =
        "Report name must not exceed 255 characters.";
    }

    if (trimmedDescription.length > 2000) {
      newErrors.description =
        "Description must not exceed 2000 characters.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setErrorMessage("");

    if (!id) {
      setErrorMessage("Report ID is missing.");
      return;
    }

    if (!validate()) {
      return;
    }

    try {
      setSaving(true);

      const token = getAccessToken();

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const payload = {
        name: form.name.trim(),
        description: form.description.trim() || null,
        status: form.status,
      };

      const response = await fetch(
        `${API_BASE_URL}/reports/${id}`,
        {
          method: "PUT",
          headers,
          body: JSON.stringify(payload),
        }
      );

      const result: unknown = await response
        .json()
        .catch(() => null);

      if (!response.ok) {
        throw new Error(getErrorMessage(result));
      }

      navigate(`/reports/${id}`);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to update report."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (id) {
      navigate(`/reports/${id}`);
    } else {
      navigate("/reports");
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
            Loading report...
          </Typography>
        </Stack>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Box sx={{ maxWidth: 900, mx: "auto" }}>
        {/* Header */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={2}
          sx={{ mb: 3 }}
        >
          <Box>
            <Typography variant="h4" fontWeight={700}>
              Edit Report
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.5 }}
            >
              Update the report information and status.
            </Typography>
          </Box>

          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={handleCancel}
            disabled={saving}
          >
            Back to Report
          </Button>
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

        <Card>
          <CardContent sx={{ p: { xs: 2, md: 4 } }}>
            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    Report Information
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                  >
                    Modify the basic information for this report.
                  </Typography>
                </Box>

                <Grid container spacing={3}>
                  {/* Name */}
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      required
                      label="Report Name"
                      placeholder="Enter report name"
                      value={form.name}
                      onChange={handleChange("name")}
                      error={Boolean(errors.name)}
                      helperText={
                        errors.name ||
                        `${form.name.length}/255 characters`
                      }
                      disabled={saving}
                    />
                  </Grid>

                  {/* Description */}
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="Description"
                      placeholder="Enter report description"
                      multiline
                      minRows={5}
                      value={form.description}
                      onChange={handleChange("description")}
                      error={Boolean(errors.description)}
                      helperText={
                        errors.description ||
                        `${form.description.length}/2000 characters`
                      }
                      disabled={saving}
                    />
                  </Grid>

                  {/* Status */}
                  <Grid size={{ xs: 12 }}>
                    <Card
                      variant="outlined"
                      sx={{
                        backgroundColor: "background.default",
                      }}
                    >
                      <CardContent sx={{ py: 2 }}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={form.status === "active"}
                              onChange={handleActiveChange}
                              disabled={saving}
                            />
                          }
                          label={
                            <Box>
                              <Typography fontWeight={600}>
                                Active Report
                              </Typography>

                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Enable this report for normal use.
                              </Typography>
                            </Box>
                          }
                        />
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Current status */}
                  <Grid size={{ xs: 12 }}>
                    <Alert
                      severity={
                        form.status === "active"
                          ? "success"
                          : "info"
                      }
                    >
                      Current status:{" "}
                      <strong>
                        {form.status.charAt(0).toUpperCase() +
                          form.status.slice(1)}
                      </strong>
                    </Alert>
                  </Grid>
                </Grid>

                {/* Actions */}
                <Stack
                  direction={{ xs: "column-reverse", sm: "row" }}
                  justifyContent="flex-end"
                  spacing={2}
                  sx={{
                    pt: 2,
                    borderTop: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Button
                    variant="outlined"
                    onClick={handleCancel}
                    disabled={saving}
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
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
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}