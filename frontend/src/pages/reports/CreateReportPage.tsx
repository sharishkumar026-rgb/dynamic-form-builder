import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
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
  status: "draft" | "active";
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

function getCreatedReportId(result: unknown): number | string | null {
  if (!isObject(result)) {
    return null;
  }

  const candidates: unknown[] = [
    result.id,
    isObject(result.report) ? result.report.id : undefined,
    isObject(result.data) ? result.data.id : undefined,
    isObject(result.data) && isObject(result.data.report)
      ? result.data.report.id
      : undefined,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === "number" || typeof candidate === "string") {
      return candidate;
    }
  }

  return null;
}

function getErrorMessage(result: unknown): string {
  if (!isObject(result)) {
    return "Failed to create report.";
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

  return "Failed to create report.";
}

export default function CreateReportPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState<ReportForm>({
    name: "",
    description: "",
    status: "draft",
  });

  const [errors, setErrors] = useState<{
    name?: string;
    description?: string;
  }>({});

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange =
    (field: keyof ReportForm) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  const handleStatusChange = (event: ChangeEvent<HTMLInputElement>) => {
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
      newErrors.name = "Report name must be at least 2 characters.";
    } else if (trimmedName.length > 255) {
      newErrors.name = "Report name must not exceed 255 characters.";
    }

    if (trimmedDescription.length > 2000) {
      newErrors.description =
        "Description must not exceed 2000 characters.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setErrorMessage("");

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
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

      const response = await fetch(`${API_BASE_URL}/reports`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      const result: unknown = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(getErrorMessage(result));
      }

      const reportId = getCreatedReportId(result);

      if (reportId !== null) {
        navigate(`/reports/${reportId}`);
      } else {
        navigate("/reports");
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to create report."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/reports");
  };

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
              Create Report
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.5 }}
            >
              Create a new report and configure it later.
            </Typography>
          </Box>

          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={handleCancel}
            disabled={loading}
          >
            Back to Reports
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
                    Enter the basic information for your report.
                  </Typography>
                </Box>

                <Grid container spacing={3}>
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
                      disabled={loading}
                      autoFocus
                    />
                  </Grid>

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
                      disabled={loading}
                    />
                  </Grid>

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
                              onChange={handleStatusChange}
                              disabled={loading}
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
                                Make this report active immediately after
                                creation.
                              </Typography>
                            </Box>
                          }
                        />
                      </CardContent>
                    </Card>
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
                    disabled={loading}
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={
                      loading ? (
                        <CircularProgress size={18} color="inherit" />
                      ) : (
                        <SaveIcon />
                      )
                    }
                    disabled={loading}
                  >
                    {loading ? "Creating..." : "Create Report"}
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