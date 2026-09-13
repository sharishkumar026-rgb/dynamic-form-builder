import { useEffect, useState } from "react";

import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import type { FieldType } from "./FieldPalette";

export interface FieldEditorData {
  id: number | string;
  type: FieldType;
  label: string;
  description?: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
  min?: number;
  max?: number;
}

interface FieldEditorProps {
  field: FieldEditorData | null;
  onChange?: (field: FieldEditorData) => void;
  onDelete?: (field: FieldEditorData) => void;
}

const optionFieldTypes: FieldType[] = [
  "select",
  "radio",
  "checkbox",
];

const FieldEditor = ({
  field,
  onChange,
  onDelete,
}: FieldEditorProps) => {
  const [form, setForm] = useState<FieldEditorData | null>(
    field,
  );

  useEffect(() => {
    setForm(field);
  }, [field]);

  if (!form) {
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
          Select a field from the form to edit its properties.
        </Typography>
      </Box>
    );
  }

  const updateField = (
    updates: Partial<FieldEditorData>,
  ) => {
    const updatedField = {
      ...form,
      ...updates,
    };

    setForm(updatedField);
    onChange?.(updatedField);
  };

  const handleOptionChange = (
    index: number,
    value: string,
  ) => {
    const options = [...(form.options || [])];

    options[index] = value;

    updateField({
      options,
    });
  };

  const handleAddOption = () => {
    const options = [
      ...(form.options || []),
      `Option ${(form.options?.length || 0) + 1}`,
    ];

    updateField({
      options,
    });
  };

  const handleRemoveOption = (index: number) => {
    const options = [...(form.options || [])];

    options.splice(index, 1);

    updateField({
      options,
    });
  };

  const showOptions = optionFieldTypes.includes(
    form.type,
  );

  const showPlaceholder =
    form.type === "text" ||
    form.type === "textarea" ||
    form.type === "email" ||
    form.type === "number";

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={1}
        >
          <Box>
            <Typography
              variant="subtitle1"
              fontWeight={700}
            >
              Field Properties
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
            >
              Configure the selected field
            </Typography>
          </Box>

          <IconButton
            color="error"
            size="small"
            onClick={() => onDelete?.(form)}
            aria-label="Delete field"
          >
            <DeleteOutlineIcon />
          </IconButton>
        </Stack>
      </Box>

      <Divider />

      {/* Editor Content */}
      <Stack
        spacing={2.5}
        sx={{
          p: 2,
        }}
      >
        {/* Field Type */}
        <TextField
          fullWidth
          size="small"
          label="Field Type"
          value={form.type}
          slotProps={{
            input: {
              readOnly: true,
            },
          }}
        />

        {/* Label */}
        <TextField
          fullWidth
          required
          size="small"
          label="Label"
          value={form.label}
          onChange={(event) =>
            updateField({
              label: event.target.value,
            })
          }
          placeholder="Enter field label"
        />

        {/* Description */}
        <TextField
          fullWidth
          size="small"
          label="Description"
          value={form.description || ""}
          onChange={(event) =>
            updateField({
              description: event.target.value,
            })
          }
          placeholder="Enter field description"
          multiline
          rows={3}
        />

        {/* Placeholder */}
        {showPlaceholder && (
          <TextField
            fullWidth
            size="small"
            label="Placeholder"
            value={form.placeholder || ""}
            onChange={(event) =>
              updateField({
                placeholder: event.target.value,
              })
            }
            placeholder="Enter placeholder text"
          />
        )}

        {/* Required */}
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
                checked={Boolean(form.required)}
                onChange={(event) =>
                  updateField({
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
                  Required field
                </Typography>

                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Users must complete this field
                </Typography>
              </Box>
            }
          />
        </Box>

        {/* Options */}
        {showOptions && (
          <>
            <Divider />

            <Box>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ mb: 1.5 }}
              >
                <Box>
                  <Typography
                    variant="subtitle2"
                    fontWeight={700}
                  >
                    Options
                  </Typography>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Add choices for this field
                  </Typography>
                </Box>

                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={handleAddOption}
                >
                  Add
                </Button>
              </Stack>

              <Stack spacing={1}>
                {(form.options || []).map(
                  (option, index) => (
                    <Stack
                      key={`${form.id}-option-${index}`}
                      direction="row"
                      alignItems="center"
                      spacing={0.5}
                    >
                      <DragIndicatorIcon
                        fontSize="small"
                        color="disabled"
                      />

                      <TextField
                        fullWidth
                        size="small"
                        value={option}
                        onChange={(event) =>
                          handleOptionChange(
                            index,
                            event.target.value,
                          )
                        }
                        placeholder={`Option ${
                          index + 1
                        }`}
                      />

                      <IconButton
                        size="small"
                        color="error"
                        onClick={() =>
                          handleRemoveOption(index)
                        }
                        disabled={
                          (form.options?.length || 0) <= 1
                        }
                        aria-label="Remove option"
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  ),
                )}

                {(!form.options ||
                  form.options.length === 0) && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      py: 2,
                      textAlign: "center",
                    }}
                  >
                    No options added yet.
                  </Typography>
                )}
              </Stack>
            </Box>
          </>
        )}

        {/* Number Validation */}
        {form.type === "number" && (
          <>
            <Divider />

            <Typography
              variant="subtitle2"
              fontWeight={700}
            >
              Number Validation
            </Typography>

            <Stack direction="row" spacing={1}>
              <TextField
                fullWidth
                size="small"
                type="number"
                label="Minimum"
                value={form.min ?? ""}
                onChange={(event) =>
                  updateField({
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
                label="Maximum"
                value={form.max ?? ""}
                onChange={(event) =>
                  updateField({
                    max:
                      event.target.value === ""
                        ? undefined
                        : Number(event.target.value),
                  })
                }
              />
            </Stack>
          </>
        )}
      </Stack>
    </Box>
  );
};

export default FieldEditor;