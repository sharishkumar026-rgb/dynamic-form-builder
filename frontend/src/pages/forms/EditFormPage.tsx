import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Checkbox from "@mui/material/Checkbox";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import SaveIcon from "@mui/icons-material/Save";

const API_BASE_URL = "http://127.0.0.1:8000/api";

interface FormData {
  id?: number | string;
  title: string;
  description: string;
  is_active: boolean;
}

interface ApiResponse {
  success?: boolean;
  message?: string;
  data?: FormData;
  form?: FormData;
  id?: number | string;
  title?: string;
  description?: string | null;
  is_active?: boolean;
  isActive?: boolean;
}

export default function EditFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [form, setForm] = useState<FormData>({
    title: "",
    description: "",
    is_active: true,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
  }>({});

  const getToken = () => {
    return (
      localStorage.getItem("access_token") ||
      localStorage.getItem("accessToken") ||
      sessionStorage.getItem("access_token") ||
      sessionStorage.getItem("accessToken")
    );
  };

  const getHeaders = () => {
    const token = getToken();

    return {
      "Content-Type": "application/json",
      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),
    };
  };

  useEffect(() => {
    if (!id) {
      setError("Form ID is missing.");
      setLoading(false);
      return;
    }

    fetchForm();
  }, [id]);

  const fetchForm = async () => {
    if (!id) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_BASE_URL}/forms/${id}`, {
        method: "GET",
        headers: getHeaders(),
      });

      const result: ApiResponse = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          result.message ||
            `Failed to load form. Server returned ${response.status}.`
        );
      }

      /*
       * Backend may return:
       *
       * {
       *   "success": true,
       *   "form": {...}
       * }
       *
       * or:
       *
       * {
       *   "success": true,
       *   "data": {...}
       * }
       *
       * or the form object directly.
       */
      let formData: FormData | undefined;

      if (result.form) {
        formData = result.form;
      } else if (result.data) {
        formData = result.data;
      } else if (
        result.id !== undefined &&
        result.title !== undefined
      ) {
        formData = {
          id: result.id,
          title: result.title,
          description: result.description ?? "",
          is_active:
            result.is_active ??
            result.isActive ??
            true,
        };
      }

      if (!formData) {
        throw new Error(
          "Form data was not found in the server response."
        );
      }

      setForm({
        id: formData.id ?? id,
        title: formData.title ?? "",
        description: formData.description ?? "",
        is_active: formData.is_active ?? true,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load form."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: undefined,
    }));

    setError("");
    setSuccessMessage("");
  };

  const handleActiveChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setForm((previous) => ({
      ...previous,
      is_active: event.target.checked,
    }));

    setError("");
    setSuccessMessage("");
  };

  const validate = () => {
    const newErrors: {
      title?: string;
      description?: string;
    } = {};

    const title = form.title.trim();
    const description = form.description.trim();

    if (!title) {
      newErrors.title = "Form title is required.";
    } else if (title.length < 2) {
      newErrors.title =
        "Form title must contain at least 2 characters.";
    } else if (title.length > 255) {
      newErrors.title =
        "Form title cannot exceed 255 characters.";
    }

    if (description.length > 2000) {
      newErrors.description =
        "Description cannot exceed 2000 characters.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSuccessMessage("");

    if (!id) {
      setError("Form ID is missing.");
      return;
    }

    if (!validate()) {
      return;
    }

    try {
      setSaving(true);

      const payload = {
        title: form.title.trim(),
        description: form.description.trim() || null,
        is_active: form.is_active,
      };

      const response = await fetch(`${API_BASE_URL}/forms/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });

      const result: ApiResponse = await response
        .json()
        .catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          result.message ||
            `Failed to update form. Server returned ${response.status}.`
        );
      }

      setSuccessMessage(
        result.message || "Form updated successfully."
      );

      setTimeout(() => {
        navigate(`/forms/${id}`);
      }, 700);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update form."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(`/forms/${id}`);
  };

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
        <Stack spacing={2} alignItems="center">
          <CircularProgress />

          <Typography color="text.secondary">
            Loading form...
          </Typography>
        </Stack>
      </Box>
    );
  }

  if (error && !form.title) {
    return (
      <Box
        sx={{
          maxWidth: 900,
          mx: "auto",
          p: { xs: 2, md: 4 },
        }}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/forms")}
          sx={{ mb: 3 }}
        >
          Back to Forms
        </Button>

        <Alert severity="error">{error}</Alert>

        <Button
          variant="contained"
          onClick={fetchForm}
          sx={{ mt: 2 }}
        >
          Try Again
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        maxWidth: 1000,
        mx: "auto",
        p: { xs: 2, md: 4 },
      }}
    >
      {/* Header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
        sx={{ mb: 4 }}
      >
        <Box>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleCancel}
            sx={{ mb: 1 }}
          >
            Back to Form
          </Button>

          <Stack
            direction="row"
            spacing={1.5}
            alignItems="center"
          >
            <EditOutlinedIcon color="primary" />

            <Typography
              variant="h4"
              fontWeight={700}
              sx={{
                fontSize: {
                  xs: "1.75rem",
                  md: "2.125rem",
                },
              }}
            >
              Edit Form
            </Typography>
          </Stack>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mt: 1 }}
          >
            Update the form details and status.
          </Typography>
        </Box>
      </Stack>

      {/* Error */}
      {error && (
        <Alert
          severity="error"
          onClose={() => setError("")}
          sx={{ mb: 3 }}
        >
          {error}
        </Alert>
      )}

      {/* Success */}
      {successMessage && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {successMessage}
        </Alert>
      )}

      {/* Form */}
      <Card
        component="form"
        onSubmit={handleSubmit}
        elevation={2}
        sx={{
          borderRadius: 3,
        }}
      >
        <CardContent
          sx={{
            p: {
              xs: 2.5,
              md: 4,
            },
          }}
        >
          <Stack spacing={3}>
            {/* Section Header */}
            <Box>
              <Typography
                variant="h6"
                fontWeight={700}
              >
                Form Details
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                Change the basic information for this form.
              </Typography>
            </Box>

            <Divider />

            <Grid container spacing={3}>
              {/* Title */}
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  required
                  label="Form Title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  error={Boolean(errors.title)}
                  helperText={
                    errors.title ||
                    `${form.title.length}/255 characters`
                  }
                  placeholder="Enter form title"
                  disabled={saving}
                />
              </Grid>

              {/* Description */}
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  multiline
                  minRows={5}
                  label="Description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  error={Boolean(errors.description)}
                  helperText={
                    errors.description ||
                    `${form.description.length}/2000 characters`
                  }
                  placeholder="Enter a description for this form"
                  disabled={saving}
                />
              </Grid>

              {/* Active Status */}
              <Grid size={{ xs: 12 }}>
                <Box
                  sx={{
                    p: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2,
                    backgroundColor: "background.default",
                  }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={form.is_active}
                        onChange={handleActiveChange}
                        disabled={saving}
                      />
                    }
                    label={
                      <Box>
                        <Typography fontWeight={600}>
                          Active Form
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          Active forms can be used for submitting
                          responses.
                        </Typography>
                      </Box>
                    }
                  />
                </Box>
              </Grid>
            </Grid>

            <Divider />

            {/* Actions */}
            <Stack
              direction={{
                xs: "column-reverse",
                sm: "row",
              }}
              justifyContent="flex-end"
              spacing={2}
            >
              <Button
                variant="outlined"
                onClick={handleCancel}
                disabled={saving}
                sx={{
                  minWidth: 120,
                  textTransform: "none",
                }}
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
                sx={{
                  minWidth: 150,
                  textTransform: "none",
                }}
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}