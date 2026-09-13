import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Rating from "@mui/material/Rating";
import Switch from "@mui/material/Switch";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import PreviewOutlinedIcon from "@mui/icons-material/PreviewOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";

const API_BASE_URL = "http://127.0.0.1:8000/api";

interface FieldOption {
  id?: number | string;
  label: string;
  value: string;
}

interface FormField {
  id: number | string;
  label?: string;
  name?: string;
  field_name?: string;
  fieldName?: string;
  type?: string;
  field_type?: string;
  fieldType?: string;
  placeholder?: string;
  description?: string;
  is_required?: boolean;
  isRequired?: boolean;
  required?: boolean;
  options?: FieldOption[];
  field_options?: FieldOption[];
  fieldOptions?: FieldOption[];
  order?: number;
  sort_order?: number;
  sortOrder?: number;
}

interface FormData {
  id: number | string;
  title: string;
  description?: string | null;
  is_active?: boolean;
  isActive?: boolean;
  fields?: FormField[];
  form_fields?: FormField[];
  formFields?: FormField[];
}

interface ApiResponse {
  success?: boolean;
  message?: string;
  data?: FormData;
  form?: FormData;
  fields?: FormField[];
  form_fields?: FormField[];
  formFields?: FormField[];
  id?: number | string;
  title?: string;
  description?: string | null;
  is_active?: boolean;
  isActive?: boolean;
}

export default function FormPreviewPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [form, setForm] = useState<FormData | null>(null);
  const [fields, setFields] = useState<FormField[]>([]);

  const [values, setValues] = useState<
    Record<string, unknown>
  >({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

      const response = await fetch(
        `${API_BASE_URL}/forms/${id}`,
        {
          method: "GET",
          headers: getHeaders(),
        }
      );

      const result: ApiResponse = await response
        .json()
        .catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          result.message ||
            `Failed to load form. Server returned ${response.status}.`
        );
      }

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
          description: result.description,
          is_active: result.is_active,
          isActive: result.isActive,
          fields:
            result.fields ??
            result.form_fields ??
            result.formFields ??
            [],
        };
      }

      if (!formData) {
        throw new Error(
          "Form data was not found in the server response."
        );
      }

      const responseFields =
        result.fields ??
        result.form_fields ??
        result.formFields ??
        formData.fields ??
        formData.form_fields ??
        formData.formFields ??
        [];

      setForm(formData);
      setFields(responseFields);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load form."
      );
    } finally {
      setLoading(false);
    }
  };

  const getFieldType = (field: FormField) => {
    return (
      field.type ??
      field.field_type ??
      field.fieldType ??
      "text"
    ).toLowerCase();
  };

  const getFieldName = (field: FormField) => {
    return (
      field.name ??
      field.field_name ??
      field.fieldName ??
      `field_${field.id}`
    );
  };

  const getFieldLabel = (field: FormField) => {
    return (
      field.label ??
      field.name ??
      field.field_name ??
      field.fieldName ??
      `Field ${field.id}`
    );
  };

  const getFieldRequired = (field: FormField) => {
    return (
      field.is_required ??
      field.isRequired ??
      field.required ??
      false
    );
  };

  const getFieldOptions = (field: FormField) => {
    return (
      field.options ??
      field.field_options ??
      field.fieldOptions ??
      []
    );
  };

  const getFieldOrder = (field: FormField) => {
    return (
      field.order ??
      field.sort_order ??
      field.sortOrder ??
      0
    );
  };

  const sortedFields = [...fields].sort(
    (a, b) => getFieldOrder(a) - getFieldOrder(b)
  );

  const handleValueChange = (
    fieldName: string,
    value: unknown
  ) => {
    setValues((previous) => ({
      ...previous,
      [fieldName]: value,
    }));
  };

  const renderField = (field: FormField) => {
    const type = getFieldType(field);
    const name = getFieldName(field);
    const label = getFieldLabel(field);
    const required = getFieldRequired(field);
    const options = getFieldOptions(field);

    const value = values[name];

    switch (type) {
      case "textarea":
      case "long_text":
      case "longtext":
        return (
          <TextField
            fullWidth
            multiline
            minRows={4}
            label={label}
            placeholder={
              field.placeholder ||
              `Enter ${label.toLowerCase()}`
            }
            value={
              typeof value === "string"
                ? value
                : ""
            }
            onChange={(event) =>
              handleValueChange(
                name,
                event.target.value
              )
            }
            required={required}
          />
        );

      case "email":
        return (
          <TextField
            fullWidth
            type="email"
            label={label}
            placeholder={
              field.placeholder ||
              "Enter your email"
            }
            value={
              typeof value === "string"
                ? value
                : ""
            }
            onChange={(event) =>
              handleValueChange(
                name,
                event.target.value
              )
            }
            required={required}
          />
        );

      case "number":
        return (
          <TextField
            fullWidth
            type="number"
            label={label}
            placeholder={
              field.placeholder ||
              "Enter a number"
            }
            value={
              value === undefined ||
              value === null
                ? ""
                : String(value)
            }
            onChange={(event) =>
              handleValueChange(
                name,
                event.target.value
              )
            }
            required={required}
          />
        );

      case "date":
        return (
          <TextField
            fullWidth
            type="date"
            label={label}
            value={
              typeof value === "string"
                ? value
                : ""
            }
            onChange={(event) =>
              handleValueChange(
                name,
                event.target.value
              )
            }
            required={required}
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
          />
        );

      case "select":
      case "dropdown":
        return (
          <FormControl fullWidth required={required}>
            <FormLabel
              sx={{
                mb: 1,
                color: "text.primary",
              }}
            >
              {label}
            </FormLabel>

            <Select
              value={
                typeof value === "string"
                  ? value
                  : ""
              }
              displayEmpty
              onChange={(event) =>
                handleValueChange(
                  name,
                  event.target.value
                )
              }
            >
              <MenuItem value="">
                <em>Select an option</em>
              </MenuItem>

              {options.map((option, index) => (
                <MenuItem
                  key={
                    option.id ??
                    `${name}_${index}`
                  }
                  value={option.value}
                >
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );

      case "radio":
        return (
          <FormControl required={required}>
            <FormLabel
              sx={{
                color: "text.primary",
                mb: 1,
              }}
            >
              {label}
            </FormLabel>

            <RadioGroup
              value={
                typeof value === "string"
                  ? value
                  : ""
              }
              onChange={(event) =>
                handleValueChange(
                  name,
                  event.target.value
                )
              }
            >
              {options.map((option, index) => (
                <FormControlLabel
                  key={
                    option.id ??
                    `${name}_${index}`
                  }
                  value={option.value}
                  control={<Radio />}
                  label={option.label}
                />
              ))}
            </RadioGroup>
          </FormControl>
        );

      case "checkbox":
      case "multi_select":
      case "multiselect": {
        const selectedValues = Array.isArray(
          value
        )
          ? value
          : [];

        return (
          <FormControl required={required}>
            <FormLabel
              sx={{
                color: "text.primary",
                mb: 1,
              }}
            >
              {label}
            </FormLabel>

            <Stack spacing={0.5}>
              {options.map((option, index) => {
                const checked =
                  selectedValues.includes(
                    option.value
                  );

                return (
                  <FormControlLabel
                    key={
                      option.id ??
                      `${name}_${index}`
                    }
                    control={
                      <Checkbox
                        checked={checked}
                        onChange={(event) => {
                          const current =
                            Array.isArray(value)
                              ? [...value]
                              : [];

                          if (
                            event.target.checked
                          ) {
                            if (
                              !current.includes(
                                option.value
                              )
                            ) {
                              current.push(
                                option.value
                              );
                            }
                          } else {
                            const indexToRemove =
                              current.indexOf(
                                option.value
                              );

                            if (
                              indexToRemove !== -1
                            ) {
                              current.splice(
                                indexToRemove,
                                1
                              );
                            }
                          }

                          handleValueChange(
                            name,
                            current
                          );
                        }}
                      />
                    }
                    label={option.label}
                  />
                );
              })}
            </Stack>
          </FormControl>
        );
      }

      case "rating":
        return (
          <FormControl>
            <FormLabel
              sx={{
                color: "text.primary",
                mb: 1,
              }}
            >
              {label}
            </FormLabel>

            <Rating
              value={
                typeof value === "number"
                  ? value
                  : 0
              }
              onChange={(_, newValue) =>
                handleValueChange(
                  name,
                  newValue ?? 0
                )
              }
              size="large"
            />
          </FormControl>
        );

      case "toggle":
      case "switch":
      case "boolean":
        return (
          <FormControlLabel
            control={
              <Switch
                checked={Boolean(value)}
                onChange={(event) =>
                  handleValueChange(
                    name,
                    event.target.checked
                  )
                }
              />
            }
            label={label}
          />
        );

      case "file":
        return (
          <Box>
            <Typography
              variant="body2"
              fontWeight={600}
              sx={{ mb: 1 }}
            >
              {label}
              {required && " *"}
            </Typography>

            <Button
              component="label"
              variant="outlined"
              sx={{
                textTransform: "none",
              }}
            >
              Choose File

              <input
                hidden
                type="file"
                onChange={(event) =>
                  handleValueChange(
                    name,
                    event.target.files?.[0] ??
                      null
                  )
                }
              />
            </Button>

            {value instanceof File && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 1 }}
              >
                Selected: {value.name}
              </Typography>
            )}
          </Box>
        );

      default:
        return (
          <TextField
            fullWidth
            label={label}
            placeholder={
              field.placeholder ||
              `Enter ${label.toLowerCase()}`
            }
            value={
              typeof value === "string"
                ? value
                : ""
            }
            onChange={(event) =>
              handleValueChange(
                name,
                event.target.value
              )
            }
            required={required}
          />
        );
    }
  };

  const handleBack = () => {
    navigate(`/forms/${id}`);
  };

  const handleEdit = () => {
    navigate(`/forms/${id}/edit`);
  };

  const handleSubmit = () => {
    /*
     * This is a preview page.
     *
     * Submission should be connected to:
     * POST /api/forms/{form_id}/responses
     *
     * from a separate response/submission page.
     */
    alert(
      "This is a preview. Response submission will be handled separately."
    );
  };

  const isActive =
    form?.is_active ??
    form?.isActive ??
    false;

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
            Loading form preview...
          </Typography>
        </Stack>
      </Box>
    );
  }

  if (error || !form) {
    return (
      <Box
        sx={{
          maxWidth: 1000,
          mx: "auto",
          p: { xs: 2, md: 4 },
        }}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/forms")}
          sx={{
            mb: 3,
            textTransform: "none",
          }}
        >
          Back to Forms
        </Button>

        <Alert severity="error">
          {error || "Form not found."}
        </Alert>

        <Button
          variant="contained"
          onClick={fetchForm}
          sx={{
            mt: 2,
            textTransform: "none",
          }}
        >
          Try Again
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "background.default",
        py: {
          xs: 2,
          md: 4,
        },
        px: {
          xs: 1.5,
          sm: 2,
          md: 4,
        },
      }}
    >
      {/* Top navigation */}
      <Box
        sx={{
          maxWidth: 1000,
          mx: "auto",
          mb: 3,
        }}
      >
        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          justifyContent="space-between"
          alignItems={{
            xs: "flex-start",
            sm: "center",
          }}
          spacing={2}
        >
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            sx={{
              textTransform: "none",
            }}
          >
            Back to Form
          </Button>

          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            spacing={1}
            width={{
              xs: "100%",
              sm: "auto",
            }}
          >
            <Button
              variant="outlined"
              startIcon={<EditOutlinedIcon />}
              onClick={handleEdit}
              sx={{
                textTransform: "none",
              }}
            >
              Edit Form
            </Button>

            <Chip
              icon={<PreviewOutlinedIcon />}
              label="Preview Mode"
              color="info"
              variant="outlined"
            />
          </Stack>
        </Stack>
      </Box>

      {/* Form Preview */}
      <Box
        sx={{
          maxWidth: 800,
          mx: "auto",
        }}
      >
        <Card
          elevation={3}
          sx={{
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          {/* Form Header */}
          <Box
            sx={{
              p: {
                xs: 3,
                md: 5,
              },
              backgroundColor: "primary.main",
              color: "primary.contrastText",
            }}
          >
            <Stack spacing={2}>
              <Stack
                direction="row"
                spacing={1.5}
                alignItems="center"
              >
                <PreviewOutlinedIcon />

                <Typography
                  variant="overline"
                  sx={{
                    fontWeight: 700,
                    letterSpacing: 1,
                  }}
                >
                  Form Preview
                </Typography>
              </Stack>

              <Typography
                variant="h4"
                fontWeight={700}
                sx={{
                  fontSize: {
                    xs: "1.75rem",
                    md: "2.25rem",
                  },
                }}
              >
                {form.title}
              </Typography>

              {form.description && (
                <Typography
                  variant="body1"
                  sx={{
                    opacity: 0.9,
                    lineHeight: 1.7,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {form.description}
                </Typography>
              )}

              <Box>
                <Chip
                  label={
                    isActive
                      ? "Active"
                      : "Inactive"
                  }
                  size="small"
                  sx={{
                    backgroundColor:
                      "rgba(255,255,255,0.18)",
                    color: "inherit",
                  }}
                />
              </Box>
            </Stack>
          </Box>

          {/* Fields */}
          <CardContent
            sx={{
              p: {
                xs: 2.5,
                sm: 4,
                md: 5,
              },
            }}
          >
            {sortedFields.length === 0 ? (
              <Box
                sx={{
                  py: 8,
                  textAlign: "center",
                }}
              >
                <PreviewOutlinedIcon
                  sx={{
                    fontSize: 50,
                    color: "text.disabled",
                    mb: 2,
                  }}
                />

                <Typography
                  variant="h6"
                  fontWeight={600}
                >
                  No fields added yet
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mt: 1,
                    mb: 3,
                  }}
                >
                  Add fields to this form to see
                  them in the preview.
                </Typography>

                <Button
                  variant="contained"
                  startIcon={
                    <EditOutlinedIcon />
                  }
                  onClick={handleEdit}
                  sx={{
                    textTransform: "none",
                  }}
                >
                  Edit Form
                </Button>
              </Box>
            ) : (
              <Stack spacing={4}>
                {sortedFields.map(
                  (field, index) => (
                    <Box key={field.id}>
                      <Stack
                        spacing={1.5}
                      >
                        {/* Field description */}
                        {field.description && (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                          >
                            {field.description}
                          </Typography>
                        )}

                        {/* Field */}
                        {renderField(field)}

                        {/* Required indicator */}
                        {getFieldRequired(
                          field
                        ) && (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                          >
                            * Required
                          </Typography>
                        )}
                      </Stack>

                      {index <
                        sortedFields.length -
                          1 && (
                        <Divider
                          sx={{
                            mt: 4,
                          }}
                        />
                      )}
                    </Box>
                  )
                )}

                <Divider />

                {/* Preview Submit */}
                <Stack
                  direction={{
                    xs: "column",
                    sm: "row",
                  }}
                  justifyContent="space-between"
                  alignItems={{
                    xs: "stretch",
                    sm: "center",
                  }}
                  spacing={2}
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    This is a preview of the
                    form.
                  </Typography>

                  <Button
                    variant="contained"
                    size="large"
                    startIcon={
                      <SendOutlinedIcon />
                    }
                    onClick={handleSubmit}
                    disabled={!isActive}
                    sx={{
                      textTransform: "none",
                      minWidth: 150,
                    }}
                  >
                    Submit
                  </Button>
                </Stack>
              </Stack>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{
            mt: 3,
          }}
        >
          Form ID: {form.id}
        </Typography>
      </Box>
    </Box>
  );
}