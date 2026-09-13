import { useEffect, useState } from "react";

import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

export interface OptionEditorData {
  id: number | string;
  options: string[];
}

interface OptionEditorProps {
  value?: string[];
  onChange?: (options: string[]) => void;
  disabled?: boolean;
  minOptions?: number;
  maxOptions?: number;
}

const OptionEditor = ({
  value = [],
  onChange,
  disabled = false,
  minOptions = 1,
  maxOptions = 20,
}: OptionEditorProps) => {
  const [options, setOptions] = useState<string[]>(
    value.length > 0 ? value : [""],
  );

  useEffect(() => {
    setOptions(
      value.length > 0 ? value : [""],
    );
  }, [value]);

  const updateOptions = (nextOptions: string[]) => {
    setOptions(nextOptions);
    onChange?.(nextOptions);
  };

  const handleOptionChange = (
    index: number,
    newValue: string,
  ) => {
    const nextOptions = [...options];

    nextOptions[index] = newValue;

    updateOptions(nextOptions);
  };

  const handleAddOption = () => {
    if (options.length >= maxOptions) {
      return;
    }

    updateOptions([
      ...options,
      `Option ${options.length + 1}`,
    ]);
  };

  const handleRemoveOption = (index: number) => {
    if (options.length <= minOptions) {
      return;
    }

    const nextOptions = options.filter(
      (_, optionIndex) => optionIndex !== index,
    );

    updateOptions(nextOptions);
  };

  const handleClearOption = (index: number) => {
    handleOptionChange(index, "");
  };

  return (
    <Box sx={{ width: "100%" }}>
      {/* Header */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={2}
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
            Add and manage the choices for this field.
          </Typography>
        </Box>

        <Button
          size="small"
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleAddOption}
          disabled={
            disabled || options.length >= maxOptions
          }
        >
          Add Option
        </Button>
      </Stack>

      <Divider sx={{ mb: 1.5 }} />

      {/* Options */}
      <Stack spacing={1}>
        {options.map((option, index) => (
          <Stack
            key={`option-${index}`}
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
              disabled={disabled}
              label={`Option ${index + 1}`}
              placeholder={`Enter option ${index + 1}`}
              onChange={(event) =>
                handleOptionChange(
                  index,
                  event.target.value,
                )
              }
            />

            <IconButton
              size="small"
              color="error"
              disabled={
                disabled || options.length <= minOptions
              }
              onClick={() =>
                handleRemoveOption(index)
              }
              aria-label={`Delete option ${index + 1}`}
            >
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Stack>
        ))}
      </Stack>

      {/* Empty state */}
      {options.length === 0 && (
        <Box
          sx={{
            py: 2,
            textAlign: "center",
            border: 1,
            borderColor: "divider",
            borderRadius: 2,
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
          >
            No options added.
          </Typography>

          <Button
            size="small"
            startIcon={<AddIcon />}
            onClick={handleAddOption}
            disabled={disabled}
            sx={{ mt: 1 }}
          >
            Add Option
          </Button>
        </Box>
      )}

      {/* Footer */}
      <Stack
        direction="row"
        justifyContent="space-between"
        sx={{ mt: 1.5 }}
      >
        <Typography
          variant="caption"
          color="text.secondary"
        >
          {options.length} / {maxOptions} options
        </Typography>

        <Typography
          variant="caption"
          color="text.secondary"
        >
          Minimum: {minOptions}
        </Typography>
      </Stack>

      {/* Reset blank options helper */}
      {options.some((option) => !option.trim()) && (
        <Box
          sx={{
            mt: 1.5,
            p: 1,
            borderRadius: 1.5,
            backgroundColor: "warning.50",
          }}
        >
          <Typography
            variant="caption"
            color="warning.dark"
          >
            Some options are empty. Add text or remove
            the empty option before saving.
          </Typography>
        </Box>
      )}

      {/* Keep helper function available for future validation */}
      <Box
        sx={{
          display: "none",
        }}
      >
        <button
          type="button"
          onClick={() =>
            options.forEach((_, index) =>
              handleClearOption(index),
            )
          }
        >
          Clear
        </button>
      </Box>
    </Box>
  );
};

export default OptionEditor;