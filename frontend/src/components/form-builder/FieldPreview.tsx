import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import DateRangeOutlinedIcon from "@mui/icons-material/DateRangeOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import NumbersOutlinedIcon from "@mui/icons-material/NumbersOutlined";
import RadioButtonCheckedOutlinedIcon from "@mui/icons-material/RadioButtonCheckedOutlined";
import ShortTextOutlinedIcon from "@mui/icons-material/ShortTextOutlined";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";
import SubjectOutlinedIcon from "@mui/icons-material/SubjectOutlined";
import ToggleOnOutlinedIcon from "@mui/icons-material/ToggleOnOutlined";
import ViewListOutlinedIcon from "@mui/icons-material/ViewListOutlined";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Rating from "@mui/material/Rating";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import type { FieldType } from "./FieldPalette";

export interface FieldPreviewData {
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

interface FieldPreviewProps {
  field: FieldPreviewData;
  disabled?: boolean;
  showTypeIcon?: boolean;
}

const FieldPreview = ({
  field,
  disabled = false,
  showTypeIcon = false,
}: FieldPreviewProps) => {
  const options =
    field.options && field.options.length > 0
      ? field.options
      : ["Option 1", "Option 2"];

  const renderTypeIcon = () => {
    switch (field.type) {
      case "text":
        return <ShortTextOutlinedIcon fontSize="small" />;

      case "textarea":
        return <SubjectOutlinedIcon fontSize="small" />;

      case "email":
        return <EmailOutlinedIcon fontSize="small" />;

      case "number":
        return <NumbersOutlinedIcon fontSize="small" />;

      case "date":
        return <DateRangeOutlinedIcon fontSize="small" />;

      case "select":
        return <ViewListOutlinedIcon fontSize="small" />;

      case "radio":
        return (
          <RadioButtonCheckedOutlinedIcon fontSize="small" />
        );

      case "checkbox":
        return <CheckBoxOutlinedIcon fontSize="small" />;

      case "rating":
        return <StarBorderOutlinedIcon fontSize="small" />;

      case "file":
        return <CloudUploadOutlinedIcon fontSize="small" />;

      case "toggle":
        return <ToggleOnOutlinedIcon fontSize="small" />;

      default:
        return null;
    }
  };

  const renderField = () => {
    switch (field.type) {
      case "text":
        return (
          <TextField
            fullWidth
            size="small"
            placeholder={
              field.placeholder || "Enter your answer"
            }
            disabled={disabled}
          />
        );

      case "textarea":
        return (
          <TextField
            fullWidth
            size="small"
            multiline
            rows={4}
            placeholder={
              field.placeholder || "Enter your answer"
            }
            disabled={disabled}
          />
        );

      case "email":
        return (
          <TextField
            fullWidth
            size="small"
            type="email"
            placeholder={
              field.placeholder || "Enter your email"
            }
            disabled={disabled}
          />
        );

      case "number":
        return (
          <TextField
            fullWidth
            size="small"
            type="number"
            placeholder={
              field.placeholder || "Enter a number"
            }
            disabled={disabled}
            inputProps={{
              min: field.min,
              max: field.max,
            }}
          />
        );

      case "date":
        return (
          <TextField
            fullWidth
            size="small"
            type="date"
            disabled={disabled}
            InputLabelProps={{
              shrink: true,
            }}
          />
        );

      case "select":
        return (
          <FormControl fullWidth size="small">
            <InputLabel>
              {field.label}
            </InputLabel>

            <Select
              label={field.label}
              defaultValue=""
              disabled={disabled}
            >
              <MenuItem value="">
                <em>Select an option</em>
              </MenuItem>

              {options.map((option, index) => (
                <MenuItem
                  key={`${field.id}-select-${index}`}
                  value={option}
                >
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );

      case "radio":
        return (
          <FormControl disabled={disabled}>
            <RadioGroup>
              {options.map((option, index) => (
                <FormControlLabel
                  key={`${field.id}-radio-${index}`}
                  value={option}
                  control={<Radio />}
                  label={option}
                />
              ))}
            </RadioGroup>
          </FormControl>
        );

      case "checkbox":
        return (
          <Stack spacing={0.25}>
            {options.map((option, index) => (
              <FormControlLabel
                key={`${field.id}-checkbox-${index}`}
                control={<Checkbox disabled={disabled} />}
                label={option}
              />
            ))}
          </Stack>
        );

      case "rating":
        return (
          <Rating
            name={`rating-${field.id}`}
            disabled={disabled}
            defaultValue={0}
          />
        );

      case "file":
        return (
          <Button
            variant="outlined"
            component="label"
            disabled={disabled}
            startIcon={<CloudUploadOutlinedIcon />}
          >
            Upload File
            <input
              type="file"
              hidden
              onChange={() => undefined}
            />
          </Button>
        );

      case "toggle":
        return (
          <FormControlLabel
            control={
              <Switch disabled={disabled} />
            }
            label="Enable"
          />
        );

      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        p: 2.5,
        border: 1,
        borderColor: "divider",
        borderRadius: 2,
        backgroundColor: "background.paper",
      }}
    >
      {/* Field Header */}
      <Stack
        direction="row"
        alignItems="flex-start"
        spacing={1}
        sx={{ mb: 1 }}
      >
        {showTypeIcon && (
          <Box
            sx={{
              mt: 0.25,
              display: "flex",
              alignItems: "center",
              color: "primary.main",
            }}
          >
            {renderTypeIcon()}
          </Box>
        )}

        <Box sx={{ minWidth: 0 }}>
          <FormLabel
            sx={{
              display: "block",
              color: "text.primary",
              fontWeight: 600,
              fontSize: 15,
            }}
          >
            {field.label || "Untitled field"}

            {field.required && (
              <Typography
                component="span"
                color="error.main"
                sx={{ ml: 0.5 }}
              >
                *
              </Typography>
            )}
          </FormLabel>

          {field.description && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mt: 0.5,
              }}
            >
              {field.description}
            </Typography>
          )}
        </Box>
      </Stack>

      {/* Field Control */}
      <Box sx={{ mt: 1.5 }}>
        {renderField()}
      </Box>
    </Box>
  );
};

export default FieldPreview;