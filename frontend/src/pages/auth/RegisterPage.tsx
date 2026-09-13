
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  FormControl,
  FormHelperText,
    IconButton,
  InputAdornment,
  InputLabel,
  Link,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import {
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

import {
  Link as RouterLink,
  useNavigate,
} from "react-router-dom";

import authApi from "../../api/auth.api";

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role_id: number;
}

const RegisterPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] =
    useState<RegisterFormData>({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role_id: 2,
    });

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [errors, setErrors] = useState<
    Partial<Record<keyof RegisterFormData, string>>
  >({});

  const [submitError, setSubmitError] =
    useState("");

  const [loading, setLoading] = useState(false);

  // ==========================================================
  // HANDLE TEXT INPUT CHANGE
  // ==========================================================

  const handleChange =
    (field: keyof RegisterFormData) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setFormData((previous) => ({
        ...previous,
        [field]: event.target.value,
      }));

      setErrors((previous) => ({
        ...previous,
        [field]: "",
      }));

      setSubmitError("");
    };

  // ==========================================================
  // HANDLE ROLE CHANGE
  // ==========================================================

  const handleRoleChange = (
    event: any,
  ) => {
    setFormData((previous) => ({
      ...previous,
      role_id: Number(event.target.value),
    }));

    setErrors((previous) => ({
      ...previous,
      role_id: "",
    }));

    setSubmitError("");
  };

  // ==========================================================
  // VALIDATION
  // ==========================================================

  const validate = (): boolean => {
    const newErrors: Partial<
      Record<keyof RegisterFormData, string>
    > = {};

    const name = formData.name.trim();
    const email = formData.email.trim();

    // Name
    if (!name) {
      newErrors.name = "Name is required";
    } else if (name.length < 2) {
      newErrors.name =
        "Name must be at least 2 characters";
    } else if (name.length > 100) {
      newErrors.name =
        "Name must not exceed 100 characters";
    }

    // Email
    if (!email) {
      newErrors.email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      newErrors.email =
        "Enter a valid email address";
    }

    // Password
    if (!formData.password) {
      newErrors.password =
        "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password =
        "Password must be at least 8 characters";
    } else if (formData.password.length > 128) {
      newErrors.password =
        "Password must not exceed 128 characters";
    }

    // Confirm Password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword =
        "Please confirm your password";
    } else if (
      formData.password !==
      formData.confirmPassword
    ) {
      newErrors.confirmPassword =
        "Passwords do not match";
    }

    // Role
    if (![1, 2].includes(formData.role_id)) {
      newErrors.role_id = "Please select a role";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // ==========================================================
  // REGISTER
  // ==========================================================

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setSubmitError("");

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      await authApi.register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role_id: formData.role_id,
      });

      navigate("/login", {
        replace: true,
        state: {
          registered: true,
          email: formData.email.trim(),
        },
      });
    } catch (error: any) {
      const responseData =
        error?.response?.data;

      let message =
        "Registration failed. Please try again.";

      if (
        typeof responseData?.detail === "string"
      ) {
        message = responseData.detail;
      } else if (
        typeof responseData?.message === "string"
      ) {
        message = responseData.message;
      } else if (
        Array.isArray(responseData?.detail)
      ) {
        message = responseData.detail
          .map(
            (item: { msg?: string }) =>
              item.msg || "Invalid input",
          )
          .join(", ");
      } else if (error?.message) {
        message = error.message;
      }

      setSubmitError(message);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "background.default",
        px: 2,
        py: 4,
      }}
    >
      <Card
        elevation={3}
        sx={{
          width: "100%",
          maxWidth: 480,
          borderRadius: 3,
        }}
      >
        <CardContent
          sx={{
            p: {
              xs: 3,
              sm: 4,
            },
          }}
        >
          <Stack spacing={3}>

            {/* Header */}

            <Box>
              <Stack
                direction="row"
                spacing={1.5}
                alignItems="center"
                justifyContent="center"
              >
                <PersonAddOutlinedIcon
                  color="primary"
                  sx={{
                    fontSize: 32,
                  }}
                />

                <Typography
                  variant="h5"
                  component="h1"
                  fontWeight={700}
                >
                  Create Account
                </Typography>
              </Stack>

              <Typography
                variant="body2"
                color="text.secondary"
                textAlign="center"
                sx={{
                  mt: 1,
                }}
              >
                Register to start using Dynamic
                Form Builder
              </Typography>
            </Box>

            {/* Error */}

            {submitError && (
              <Alert
                severity="error"
                onClose={() =>
                  setSubmitError("")
                }
              >
                {submitError}
              </Alert>
            )}

            {/* Form */}

            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
            >
              <Stack spacing={2.25}>

                {/* Name */}

                <TextField
                  label="Full Name"
                  value={formData.name}
                  onChange={handleChange("name")}
                  error={Boolean(errors.name)}
                  helperText={errors.name}
                  fullWidth
                  required
                  autoComplete="name"
                  autoFocus
                  disabled={loading}
                />

                {/* Email */}

                <TextField
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={handleChange("email")}
                  error={Boolean(errors.email)}
                  helperText={errors.email}
                  fullWidth
                  required
                  autoComplete="email"
                  disabled={loading}
                />

                {/* Role */}

                <FormControl
                  fullWidth
                  required
                  error={Boolean(errors.role_id)}
                  disabled={loading}
                >
                  <InputLabel id="role-label">
                    Role
                  </InputLabel>

                  <Select
                    labelId="role-label"
                    value={formData.role_id}
                    label="Role"
                    onChange={handleRoleChange}
                  >
                    <MenuItem value={1}>
                      Admin
                    </MenuItem>

                    <MenuItem value={2}>
                      User
                    </MenuItem>
                  </Select>

                  {errors.role_id && (
                    <FormHelperText>
                      {errors.role_id}
                    </FormHelperText>
                  )}
                </FormControl>

                {/* Password */}

                <TextField
                  label="Password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={formData.password}
                  onChange={handleChange("password")}
                  error={Boolean(errors.password)}
                  helperText={
                    errors.password ||
                    "Password must contain at least 8 characters"
                  }
                  fullWidth
                  required
                  autoComplete="new-password"
                  disabled={loading}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() =>
                              setShowPassword(
                                (value) => !value,
                              )
                            }
                            edge="end"
                            disabled={loading}
                            aria-label={
                              showPassword
                                ? "Hide password"
                                : "Show password"
                            }
                          >
                            {showPassword ? (
                              <VisibilityOffOutlinedIcon />
                            ) : (
                              <VisibilityOutlinedIcon />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />

                {/* Confirm Password */}

                <TextField
                  label="Confirm Password"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  value={
                    formData.confirmPassword
                  }
                  onChange={handleChange(
                    "confirmPassword",
                  )}
                  error={Boolean(
                    errors.confirmPassword,
                  )}
                  helperText={
                    errors.confirmPassword
                  }
                  fullWidth
                  required
                  autoComplete="new-password"
                  disabled={loading}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() =>
                              setShowConfirmPassword(
                                (value) => !value,
                              )
                            }
                            edge="end"
                            disabled={loading}
                            aria-label={
                              showConfirmPassword
                                ? "Hide confirm password"
                                : "Show confirm password"
                            }
                          >
                            {showConfirmPassword ? (
                              <VisibilityOffOutlinedIcon />
                            ) : (
                              <VisibilityOutlinedIcon />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />

                {/* Register Button */}

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={loading}
                  sx={{
                    minHeight: 48,
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  {loading
                    ? "Creating Account..."
                    : "Create Account"}
                </Button>
              </Stack>
            </Box>

            <Divider />

            {/* Login */}

            <Stack
              direction="row"
              justifyContent="center"
              alignItems="center"
              spacing={0.75}
            >
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Already have an account?
              </Typography>

              <Link
                component={RouterLink}
                to="/login"
                underline="hover"
                fontWeight={600}
              >
                Login
              </Link>
            </Stack>

            {/* Back */}

            <Button
              component={RouterLink}
              to="/login"
              variant="text"
              startIcon={
                <ArrowBackOutlinedIcon />
              }
              sx={{
                alignSelf: "center",
                textTransform: "none",
              }}
            >
              Back to Login
            </Button>

          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default RegisterPage;

