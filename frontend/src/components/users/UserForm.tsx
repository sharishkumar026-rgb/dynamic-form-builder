import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";

export interface UserFormData {
  name: string;
  email: string;
  password?: string;
  roleId?: number | string;
  isActive: boolean;
}

interface UserFormRole {
  id: number | string;
  name: string;
}

interface UserFormProps {
  initialData?: Partial<UserFormData>;
  roles?: UserFormRole[];
  loading?: boolean;
  isEdit?: boolean;
  onSubmit?: (data: UserFormData) => void;
  onCancel?: () => void;
}

const defaultFormData: UserFormData = {
  name: "",
  email: "",
  password: "",
  roleId: "",
  isActive: true,
};

const UserForm = ({
  initialData,
  roles = [],
  loading = false,
  isEdit = false,
  onSubmit,
  onCancel,
}: UserFormProps) => {
  const [formData, setFormData] =
    useState<UserFormData>(defaultFormData);

  const [errors, setErrors] = useState<
    Partial<Record<keyof UserFormData, string>>
  >({});

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setFormData({
      ...defaultFormData,
      ...initialData,
      password: "",
    });

    setErrors({});
  }, [initialData]);

  const handleChange = <K extends keyof UserFormData>(
    field: K,
    value: UserFormData[K],
  ) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((current) => ({
        ...current,
        [field]: undefined,
      }));
    }
  };

  const validate = () => {
    const nextErrors: Partial<
      Record<keyof UserFormData, string>
    > = {};

    if (!formData.name.trim()) {
      nextErrors.name = "Name is required.";
    } else if (formData.name.trim().length < 2) {
      nextErrors.name = "Name must be at least 2 characters.";
    }

    if (!formData.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!isEdit && !formData.password?.trim()) {
      nextErrors.password = "Password is required.";
    } else if (
      formData.password &&
      formData.password.length > 0 &&
      formData.password.length < 8
    ) {
      nextErrors.password =
        "Password must be at least 8 characters.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) {
      return;
    }

    onSubmit?.({
      ...formData,
      name: formData.name.trim(),
      email: formData.email.trim(),
      password: formData.password?.trim() || undefined,
    });
  };

  return (
    <Paper
      variant="outlined"
      sx={{
        borderRadius: 3,
        p: { xs: 2, sm: 3 },
      }}
    >
      <Stack spacing={3}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "action.hover",
              color: "primary.main",
            }}
          >
            <PersonOutlineIcon />
          </Box>

          <Box>
            <Typography variant="h6" fontWeight={700}>
              {isEdit ? "Edit User" : "Create User"}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {isEdit
                ? "Update the user's account information."
                : "Create a new user account."}
            </Typography>
          </Box>
        </Stack>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              required
              label="Full Name"
              placeholder="Enter full name"
              value={formData.name}
              onChange={(event) =>
                handleChange("name", event.target.value)
              }
              error={Boolean(errors.name)}
              helperText={errors.name}
              disabled={loading}
              size="small"
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              required
              type="email"
              label="Email Address"
              placeholder="Enter email address"
              value={formData.email}
              onChange={(event) =>
                handleChange("email", event.target.value)
              }
              error={Boolean(errors.email)}
              helperText={errors.email}
              disabled={loading}
              size="small"
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              required={!isEdit}
              type={showPassword ? "text" : "password"}
              label={
                isEdit
                  ? "New Password (optional)"
                  : "Password"
              }
              placeholder={
                isEdit
                  ? "Leave blank to keep current password"
                  : "Enter password"
              }
              value={formData.password ?? ""}
              onChange={(event) =>
                handleChange("password", event.target.value)
              }
              error={Boolean(errors.password)}
              helperText={
                errors.password ??
                (isEdit
                  ? "Leave blank if you do not want to change it."
                  : "Password must contain at least 8 characters.")
              }
              disabled={loading}
              size="small"
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        onClick={() =>
                          setShowPassword((current) => !current)
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
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl
              fullWidth
              size="small"
              error={Boolean(errors.roleId)}
              disabled={loading}
            >
              <InputLabel id="user-role-label">
                Role
              </InputLabel>

              <Select
                labelId="user-role-label"
                value={formData.roleId ?? ""}
                label="Role"
                onChange={(event) =>
                  handleChange("roleId", event.target.value)
                }
              >
                <MenuItem value="">
                  <em>Default Role</em>
                </MenuItem>

                {roles.map((role) => (
                  <MenuItem
                    key={String(role.id)}
                    value={role.id}
                  >
                    {role.name}
                  </MenuItem>
                ))}
              </Select>

              <FormHelperText>
                {errors.roleId ??
                  "Select a role for this user."}
              </FormHelperText>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <FormControl
              fullWidth
              disabled={loading}
            >
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.5}
                alignItems={{ xs: "flex-start", sm: "center" }}
                sx={{
                  p: 1.5,
                  border: 1,
                  borderColor: "divider",
                  borderRadius: 2,
                }}
              >
                <Typography
                  variant="body2"
                  fontWeight={600}
                >
                  Account Status
                </Typography>

                <Stack direction="row" spacing={1}>
                  <Button
                    size="small"
                    variant={
                      formData.isActive
                        ? "contained"
                        : "outlined"
                    }
                    onClick={() =>
                      handleChange("isActive", true)
                    }
                    disabled={loading}
                    sx={{
                      textTransform: "none",
                      borderRadius: 2,
                    }}
                  >
                    Active
                  </Button>

                  <Button
                    size="small"
                    variant={
                      !formData.isActive
                        ? "contained"
                        : "outlined"
                    }
                    onClick={() =>
                      handleChange("isActive", false)
                    }
                    disabled={loading}
                    sx={{
                      textTransform: "none",
                      borderRadius: 2,
                    }}
                  >
                    Inactive
                  </Button>
                </Stack>
              </Stack>
            </FormControl>
          </Grid>
        </Grid>

        <Stack
          direction={{ xs: "column-reverse", sm: "row" }}
          spacing={1.5}
          justifyContent="flex-end"
        >
          {onCancel && (
            <Button
              variant="outlined"
              onClick={onCancel}
              disabled={loading}
              sx={{
                textTransform: "none",
                borderRadius: 2,
                minWidth: 100,
              }}
            >
              Cancel
            </Button>
          )}

          <Button
            variant="contained"
            startIcon={<SaveOutlinedIcon />}
            onClick={handleSubmit}
            disabled={loading}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              minWidth: 130,
            }}
          >
            {loading
              ? "Saving..."
              : isEdit
                ? "Update User"
                : "Create User"}
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default UserForm;