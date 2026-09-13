
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

import Alert from "@mui/material/Alert";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import type { FormEvent } from "react";
import { useState } from "react";

import {
  Link as RouterLink,
  useLocation,
  useNavigate,
} from "react-router-dom";

import authApi from "../../api/auth.api";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [emailError, setEmailError] =
    useState("");

  const [passwordError, setPasswordError] =
    useState("");

  // ==========================================================
  // VALIDATION
  // ==========================================================

  const validate = (): boolean => {
    let valid = true;

    setEmailError("");
    setPasswordError("");
    setError("");

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setEmailError("Email is required.");
      valid = false;
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        trimmedEmail,
      )
    ) {
      setEmailError(
        "Enter a valid email address.",
      );
      valid = false;
    }

    if (!password) {
      setPasswordError(
        "Password is required.",
      );
      valid = false;
    }

    return valid;
  };

  // ==========================================================
  // LOGIN
  // ==========================================================

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await authApi.login({
        email: email.trim(),
        password,
      });

      if (!response.success) {
        setError(
          response.message ||
            "Login failed.",
        );
        return;
      }

      // authApi.login() already stores:
      // access_token
      // refresh_token
      // user

      navigate("/dashboard", {
        replace: true,
      });
    } catch (err: any) {
      console.error(
        "Login failed:",
        err,
      );

      const responseData =
        err?.response?.data;

      let message =
        "Unable to login. Please check your email and password.";

      if (
        typeof responseData?.detail ===
        "string"
      ) {
        message = responseData.detail;
      } else if (
        typeof responseData?.message ===
        "string"
      ) {
        message = responseData.message;
      } else if (
        Array.isArray(responseData?.detail)
      ) {
        message = responseData.detail
          .map(
            (item: {
              msg?: string;
            }) =>
              item.msg ||
              "Invalid input",
          )
          .join(", ");
      } else if (err?.message) {
        message = err.message;
      }

      setError(message);
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
        bgcolor: "background.default",
        px: 2,
        py: 4,
      }}
    >
      <Container
        maxWidth="sm"
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Card
          elevation={4}
          sx={{
            width: "100%",
            maxWidth: 460,
            borderRadius: 3,
          }}
        >
          <CardContent
            sx={{
              p: {
                xs: 3,
                sm: 4,
              },
              "&:last-child": {
                pb: {
                  xs: 3,
                  sm: 4,
                },
              },
            }}
          >
            <Stack
              component="form"
              spacing={2.5}
              onSubmit={handleSubmit}
              noValidate
            >
              {/* Header */}

              <Stack
                alignItems="center"
                spacing={1.5}
              >
                <Avatar
                  sx={{
                    width: 56,
                    height: 56,
                    bgcolor:
                      "primary.main",
                  }}
                >
                  <LockOutlinedIcon />
                </Avatar>

                <Typography
                  variant="h4"
                  fontWeight={700}
                  textAlign="center"
                >
                  Welcome Back
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  textAlign="center"
                >
                  Sign in to your Dynamic
                  Form Builder account
                </Typography>
              </Stack>

              {/* Registration success message */}

              {location.state?.registered && (
                <Alert
                  severity="success"
                  onClose={() =>
                    window.history.replaceState(
                      {},
                      document.title,
                      window.location.pathname,
                    )
                  }
                >
                  Registration successful.
                  Please login with your
                  account.
                </Alert>
              )}

              {/* Error */}

              {error && (
                <Alert
                  severity="error"
                  onClose={() =>
                    setError("")
                  }
                >
                  {error}
                </Alert>
              )}

              {/* Email */}

              <TextField
                fullWidth
                required
                label="Email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(event) => {
                  setEmail(
                    event.target.value,
                  );

                  setEmailError("");
                  setError("");
                }}
                error={Boolean(
                  emailError,
                )}
                helperText={emailError}
                disabled={loading}
                autoComplete="email"
                autoFocus
              />

              {/* Password */}

              <TextField
                fullWidth
                required
                label="Password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Enter your password"
                value={password}
                onChange={(event) => {
                  setPassword(
                    event.target.value,
                  );

                  setPasswordError("");
                  setError("");
                }}
                error={Boolean(
                  passwordError,
                )}
                helperText={
                  passwordError
                }
                disabled={loading}
                autoComplete="current-password"
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          onClick={() =>
                            setShowPassword(
                              (previous) =>
                                !previous,
                            )
                          }
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

              {/* Forgot Password */}

              <Box
                sx={{
                  display: "flex",
                  justifyContent:
                    "flex-end",
                }}
              >
                <Link
                  component={RouterLink}
                  to="/forgot-password"
                  underline="hover"
                  variant="body2"
                >
                  Forgot password?
                </Link>
              </Box>

              {/* Login Button */}

              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                startIcon={
                  loading ? (
                    <CircularProgress
                      size={20}
                      color="inherit"
                    />
                  ) : (
                    <LoginOutlinedIcon />
                  )
                }
                disabled={loading}
                sx={{
                  minHeight: 48,
                  borderRadius: 2,
                  textTransform:
                    "none",
                  fontSize: 16,
                  fontWeight: 600,
                }}
              >
                {loading
                  ? "Signing in..."
                  : "Sign In"}
              </Button>

              {/* Register */}

              <Typography
                variant="body2"
                color="text.secondary"
                textAlign="center"
              >
                Don't have an account?{" "}
                <Link
                  component={RouterLink}
                  to="/register"
                  underline="hover"
                  fontWeight={600}
                >
                  Create an account
                </Link>
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default LoginPage;

