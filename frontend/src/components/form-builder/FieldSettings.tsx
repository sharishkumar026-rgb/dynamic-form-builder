import { useEffect, useState } from "react";

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";

import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import type { FieldType } from "./FieldPalette";

export interface FieldSettingsData {
  id: number | string;
  type: FieldType;
  label: string;
  description?: string;
  placeholder?: string;
  required?: boolean;
  hidden?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

interface FieldSettingsProps {
  field: FieldSettingsData | null;
  onChange?: (field: FieldSettingsData) => void;
}

const FieldSettings = ({
  field,
  onChange,
}: FieldSettingsProps) => {
  const [settings, setSettings] =
    useState<FieldSettingsData | null>(field);

  useEffect(() => {
    setSettings(field);
  }, [field]);

  if (!settings) {
    return (
      <Box
        sx={{
          p: 3,
          textAlign: "center",
        }}
      >
        <Typography
          variant="subtitle1"
          fontWeight={600}
        >
          No field selected
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 0.5 }}
        >
          Select a field to configure its settings.
        </Typography>
      </Box>
    );
  }

  const updateSettings = (
    updates: Partial<FieldSettingsData>,
  ) => {
    const updatedSettings = {
      ...settings,
      ...updates,
    };

    setSettings(updatedSettings);
    onChange?.(updatedSettings);
  };

  const showPlaceholder =
    settings.type === "text" ||
    settings.type === "textarea" ||
    settings.type === "email" ||
    settings.type === "number";

  const showTextValidation =
    settings.type === "text" ||
    settings.type === "textarea" ||
    settings.type === "email";

  const showNumberValidation =
    settings.type === "number";

  return (
    <Box sx={{ width: "100%" }}>
      {/* Header */}
      <Box sx={{ p: 2 }}>
        <Typography
          variant="subtitle1"
          fontWeight={700}
        >
          Field Settings
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 0.5 }}
        >
          Configure how this field behaves.
        </Typography>
      </Box>

      <Divider />

      <Stack spacing={2.5} sx={{ p: 2 }}>
        {/* Basic Settings */}
        <Box>
          <Typography
            variant="subtitle2"
            fontWeight={700}
            sx={{ mb: 1.5 }}
          >
            Basic Settings
          </Typography>

          <Stack spacing={2}>
            <TextField
              fullWidth
              size="small"
              label="Field Label"
              value={settings.label}
              onChange={(event) =>
                updateSettings({
                  label: event.target.value,
                })
              }
              required
            />

            <TextField
              fullWidth
              size="small"
              label="Description"
              value={settings.description || ""}
              onChange={(event) =>
                updateSettings({
                  description: event.target.value,
                })
              }
              placeholder="Optional description"
              multiline
              rows={3}
            />

            {showPlaceholder && (
              <TextField
                fullWidth
                size="small"
                label="Placeholder"
                value={settings.placeholder || ""}
                onChange={(event) =>
                  updateSettings({
                    placeholder: event.target.value,
                  })
                }
                placeholder="Enter placeholder text"
              />
            )}
          </Stack>
        </Box>

        <Divider />

        {/* Behaviour */}
        <Box>
          <Typography
            variant="subtitle2"
            fontWeight={700}
            sx={{ mb: 1.5 }}
          >
            Behaviour
          </Typography>

          <Stack spacing={1}>
            <Box
              sx={{
                px: 1.5,
                py: 1,
                border: 1,
                borderColor: "divider",
                borderRadius: 2,
              }}
            >
              <FormControlLabel
                control={
                  <Switch
                    checked={Boolean(settings.required)}
                    onChange={(event) =>
                      updateSettings({
                        required: event.target.checked,
                      })
                    }
                  />
                }
                label={
                  <Box>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                    >
                      Required
                    </Typography>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      User must complete this field
                    </Typography>
                  </Box>
                }
              />
            </Box>

            <Box
              sx={{
                px: 1.5,
                py: 1,
                border: 1,
                borderColor: "divider",
                borderRadius: 2,
              }}
            >
              <FormControlLabel
                control={
                  <Switch
                    checked={Boolean(settings.hidden)}
                    onChange={(event) =>
                      updateSettings({
                        hidden: event.target.checked,
                      })
                    }
                  />
                }
                label={
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                  >
                    <VisibilityOffOutlinedIcon
                      fontSize="small"
                      color="action"
                    />

                    <Box>
                      <Typography
                        variant="body2"
                        fontWeight={600}
                      >
                        Hidden field
                      </Typography>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        Hide this field from users
                      </Typography>
                    </Box>
                  </Stack>
                }
              />
            </Box>
          </Stack>
        </Box>

        {/* Text Validation */}
        {showTextValidation && (
          <>
            <Divider />

            <Box>
              <Typography
                variant="subtitle2"
                fontWeight={700}
                sx={{ mb: 1.5 }}
              >
                Text Validation
              </Typography>

              <Stack
                direction={{
                  xs: "column",
                  sm: "row",
                }}
                spacing={1.5}
              >
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  label="Minimum Length"
                  value={settings.minLength ?? ""}
                  onChange={(event) =>
                    updateSettings({
                      minLength:
                        event.target.value === ""
                          ? undefined
                          : Number(event.target.value),
                    })
                  }
                  inputProps={{
                    min: 0,
                  }}
                />

                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  label="Maximum Length"
                  value={settings.maxLength ?? ""}
                  onChange={(event) =>
                    updateSettings({
                      maxLength:
                        event.target.value === ""
                          ? undefined
                          : Number(event.target.value),
                    })
                  }
                  inputProps={{
                    min: 0,
                  }}
                />
              </Stack>
            </Box>
          </>
        )}

        {/* Number Validation */}
        {showNumberValidation && (
          <>
            <Divider />

            <Box>
              <Typography
                variant="subtitle2"
                fontWeight={700}
                sx={{ mb: 1.5 }}
              >
                Number Validation
              </Typography>

              <Stack
                direction={{
                  xs: "column",
                  sm: "row",
                }}
                spacing={1.5}
              >
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  label="Minimum Value"
                  value={settings.min ?? ""}
                  onChange={(event) =>
                    updateSettings({
                      min:
                        event.target.value === ""
                          ? undefined
                          : Number(event.target.value),
                    })
                  }
                />

                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  label="Maximum Value"
                  value={settings.max ?? ""}
                  onChange={(event) =>
                    updateSettings({
                      max:
                        event.target.value === ""
                          ? undefined
                          : Number(event.target.value),
                    })
                  }
                />
              </Stack>
            </Box>
          </>
        )}

        {/* Field Type */}
        <Divider />

        <Box
          sx={{
            p: 1.5,
            borderRadius: 2,
            backgroundColor: "action.hover",
          }}
        >
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
          >
            <LockOutlinedIcon
              fontSize="small"
              color="action"
            />

            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Field Type
              </Typography>

              <Typography
                variant="body2"
                fontWeight={600}
                sx={{
                  textTransform: "capitalize",
                }}
              >
                {settings.type}
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

export default FieldSettings;