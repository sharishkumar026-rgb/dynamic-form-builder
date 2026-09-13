
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Grid";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://127.0.0.1:8000/api";

interface FormData {
  title: string;
  description: string;
  isActive: boolean;
}

const CreateFormPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    isActive: true,
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof FormData, string>>
  >({});

  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);

  const getToken = () => {
    return (
      localStorage.getItem("access_token") ||
      localStorage.getItem("accessToken") ||
      sessionStorage.getItem("access_token") ||
      sessionStorage.getItem("accessToken")
    );
  };

  const handleChange =
    (field: keyof FormData) =>
    (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
      const value = event.target.value;

      setFormData((previous) => ({
        ...previous,
        [field]: value,
      }));

      setErrors((previous) => ({
        ...previous,
        [field]: "",
      }));

      setSubmitError("");
    };

  const validate = () => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    const title = formData.title.trim();
    const description = formData.description.trim();

    if (!title) {
      newErrors.title = "Form title is required";
    } else if (title.length < 2) {
      newErrors.title = "Form title must be at least 2 characters";
    } else if (title.length > 255) {
      newErrors.title = "Form title must not exceed 255 characters";
    }

    if (description.length > 2000) {
      newErrors.description =
        "Description must not exceed 2000 characters";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSubmitError("");

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      const token = getToken();

      const response = await fetch(`${API_BASE_URL}/forms`, {
        method: "POST",
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
          title: formData.title.trim(),
          description: formData.description.trim() || null,
          is_active: formData.isActive,
        }),
      });

      if (!response.ok) {
        let message = `Request failed with status ${response.status}`;

        try {
          const errorData = await response.json();

          if (typeof errorData?.detail === "string") {
            message = errorData.detail;
          } else if (typeof errorData?.message === "string") {
            message = errorData.message;
          } else if (Array.isArray(errorData?.detail)) {
            message = errorData.detail
              .map((item: { msg?: string }) => item.msg)
              .filter(Boolean)
              .join(", ");
          }
        } catch {
          // Keep default message.
        }

        throw new Error(message);
      }

      const result = await response.json();

      const createdForm =
        result?.data ??
        result?.form ??
        result;

      if (createdForm?.id !== undefined) {
        navigate(`/forms/${createdForm.id}`);
      } else {
        navigate("/forms");
      }
    } catch (requestError) {
      setSubmitError(
        requestError instanceof Error
          ? requestError.message
          : "Failed to create form.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 1100,
        mx: "auto",
        px: { xs: 1.5, sm: 2, md: 3 },
        py: { xs: 2, md: 3 },
      }}
    >
      <Stack spacing={3}>
        {/* Header */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems={{ xs: "flex-start", sm: "center" }}
          justifyContent="space-between"
        >
          <Box>
            <Typography variant="h4" fontWeight={700}>
              Create Form
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mt: 0.5 }}
            >
              Create a new form to collect responses.
            </Typography>
          </Box>

          <Button
            variant="outlined"
            startIcon={<ArrowBackOutlinedIcon />}
            onClick={() => navigate("/forms")}
            disabled={loading}
          >
            Back to Forms
          </Button>
        </Stack>

        {submitError && (
          <Alert
            severity="error"
            onClose={() => setSubmitError("")}
          >
            {submitError}
          </Alert>
        )}

        <Card
          sx={{
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
            >
              <Stack spacing={3}>
                <Box>
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    sx={{ mb: 0.5 }}
                  >
                    Form Information
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Enter the basic information for your form.
                  </Typography>
                </Box>

                <Grid container spacing={2.5}>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      required
                      label="Form Title"
                      placeholder="Enter form title"
                      value={formData.title}
                      onChange={handleChange("title")}
                      error={Boolean(errors.title)}
                      helperText={
                        errors.title ||
                        `${formData.title.length}/255 characters`
                      }
                      disabled={loading}
                      autoFocus
                    />
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      multiline
                      minRows={4}
                      label="Description"
                      placeholder="Enter a description for your form"
                      value={formData.description}
                      onChange={handleChange("description")}
                      error={Boolean(errors.description)}
                      helperText={
                        errors.description ||
                        `${formData.description.length}/2000 characters`
                      }
                      disabled={loading}
                    />
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <FormControl>
                      <FormLabel component="legend">
                        Form Status
                      </FormLabel>

                      <FormControlLabel
                        control={
                          <Switch
                            checked={formData.isActive}
                            onChange={(event) => {
                              setFormData((previous) => ({
                                ...previous,
                                isActive: event.target.checked,
                              }));
                            }}
                            disabled={loading}
                          />
                        }
                        label={
                          formData.isActive
                            ? "Active"
                            : "Inactive"
                        }
                      />

                      <FormHelperText>
                        Active forms can be used to collect
                        responses.
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                </Grid>

                <Alert severity="info">
                  After creating the form, you can add and configure
                  fields from the form builder.
                </Alert>

                <Stack
                  direction={{ xs: "column-reverse", sm: "row" }}
                  spacing={1.5}
                  justifyContent="flex-end"
                >
                  <Button
                    variant="outlined"
                    onClick={() => navigate("/forms")}
                    disabled={loading}
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<SaveOutlinedIcon />}
                    disabled={loading}
                  >
                    {loading ? "Creating..." : "Create Form"}
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
};

export default CreateFormPage;
