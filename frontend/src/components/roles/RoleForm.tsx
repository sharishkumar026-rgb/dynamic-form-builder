import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";

import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import { useEffect, useState } from "react";

export interface RoleFormData {
  name: string;
  description: string;
  isActive: boolean;
}

interface RoleFormProps {
  initialData?: Partial<RoleFormData>;
  loading?: boolean;
  isEdit?: boolean;
  onSubmit?: (data: RoleFormData) => void;
  onCancel?: () => void;
}

interface RoleFormErrors {
  name?: string;
  description?: string;
}

const defaultFormData: RoleFormData = {
  name: "",
  description: "",
  isActive: true,
};

const RoleForm = ({
  initialData,
  loading = false,
  isEdit = false,
  onSubmit,
  onCancel,
}: RoleFormProps) => {
  const [formData, setFormData] =
    useState<RoleFormData>(defaultFormData);

  const [errors, setErrors] = useState<RoleFormErrors>({});

  useEffect(() => {
    setFormData({
      ...defaultFormData,
      ...initialData,
    });
  }, [initialData]);

  const handleChange = (
    field: keyof RoleFormData,
    value: string | boolean,
  ) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [field]: undefined,
    }));
  };

  const validate = () => {
    const newErrors: RoleFormErrors = {};

    const trimmedName = formData.name.trim();
    const trimmedDescription =
      formData.description.trim();

    if (!trimmedName) {
      newErrors.name = "Role name is required.";
    } else if (trimmedName.length < 2) {
      newErrors.name =
        "Role name must be at least 2 characters.";
    } else if (trimmedName.length > 100) {
      newErrors.name =
        "Role name must not exceed 100 characters.";
    }

    if (trimmedDescription.length > 500) {
      newErrors.description =
        "Description must not exceed 500 characters.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) {
      return;
    }

    onSubmit?.({
      name: formData.name.trim(),
      description: formData.description.trim(),
      isActive: formData.isActive,
    });
  };

  const handleCancel = () => {
    if (loading) {
      return;
    }

    onCancel?.();
  };

  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        border: 1,
        borderColor: "divider",
        borderRadius: 2,
        p: { xs: 2, sm: 3 },
      }}
    >
      <Stack spacing={3}>
        <Stack spacing={0.5}>
          <Typography
            variant="h6"
            fontWeight={700}
          >
            {isEdit ? "Edit Role" : "Create Role"}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            {isEdit
              ? "Update the role details below."
              : "Create a new user role."}
          </Typography>
        </Stack>

        <Alert severity="info">
          Role names should be unique and clearly describe
          the permissions or responsibility of the role.
        </Alert>

        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              required
              label="Role Name"
              placeholder="Enter role name"
              value={formData.name}
              onChange={(event) =>
                handleChange("name", event.target.value)
              }
              error={Boolean(errors.name)}
              helperText={
                errors.name ||
                `${formData.name.length}/100 characters`
              }
              disabled={loading}
              slotProps={{
                htmlInput: {
                  maxLength: 100,
                },
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Stack
              sx={{
                height: "100%",
                justifyContent: "center",
              }}
            >
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isActive}
                    onChange={(event) =>
                      handleChange(
                        "isActive",
                        event.target.checked,
                      )
                    }
                    disabled={loading}
                  />
                }
                label={
                  formData.isActive
                    ? "Active role"
                    : "Inactive role"
                }
              />

              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ ml: 4.5 }}
              >
                Inactive roles cannot be assigned to users.
              </Typography>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              multiline
              minRows={4}
              label="Description"
              placeholder="Enter role description"
              value={formData.description}
              onChange={(event) =>
                handleChange(
                  "description",
                  event.target.value,
                )
              }
              error={Boolean(errors.description)}
              helperText={
                errors.description ||
                `${formData.description.length}/500 characters`
              }
              disabled={loading}
              slotProps={{
                htmlInput: {
                  maxLength: 500,
                },
              }}
            />
          </Grid>
        </Grid>

        <Stack
          direction={{ xs: "column-reverse", sm: "row" }}
          justifyContent="flex-end"
          spacing={1.5}
        >
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<CancelOutlinedIcon />}
            onClick={handleCancel}
            disabled={loading}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              minWidth: 120,
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            startIcon={<SaveOutlinedIcon />}
            onClick={handleSubmit}
            disabled={loading}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              minWidth: 140,
            }}
          >
            {loading
              ? "Saving..."
              : isEdit
                ? "Update Role"
                : "Create Role"}
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default RoleForm;