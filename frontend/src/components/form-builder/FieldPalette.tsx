import type { DragEvent, ReactNode } from "react";

import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import DateRangeOutlinedIcon from "@mui/icons-material/DateRangeOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import FormatAlignLeftOutlinedIcon from "@mui/icons-material/FormatAlignLeftOutlined";
import NumbersOutlinedIcon from "@mui/icons-material/NumbersOutlined";
import RadioButtonCheckedOutlinedIcon from "@mui/icons-material/RadioButtonCheckedOutlined";
import ShortTextOutlinedIcon from "@mui/icons-material/ShortTextOutlined";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";
import SubjectOutlinedIcon from "@mui/icons-material/SubjectOutlined";
import ToggleOnOutlinedIcon from "@mui/icons-material/ToggleOnOutlined";
import ViewListOutlinedIcon from "@mui/icons-material/ViewListOutlined";

import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export type FieldType =
  | "text"
  | "textarea"
  | "email"
  | "number"
  | "date"
  | "select"
  | "radio"
  | "checkbox"
  | "rating"
  | "file"
  | "toggle";

export interface FieldTypeOption {
  type: FieldType;
  label: string;
  description: string;
  icon: ReactNode;
}

interface FieldPaletteProps {
  onAddField?: (fieldType: FieldType) => void;
  onFieldDragStart?: (
    event: DragEvent<HTMLButtonElement>,
    fieldType: FieldType,
  ) => void;
}

const fieldTypes: FieldTypeOption[] = [
  {
    type: "text",
    label: "Short Text",
    description: "Single line text",
    icon: <ShortTextOutlinedIcon />,
  },
  {
    type: "textarea",
    label: "Long Text",
    description: "Multi-line text",
    icon: <SubjectOutlinedIcon />,
  },
  {
    type: "email",
    label: "Email",
    description: "Email address",
    icon: <EmailOutlinedIcon />,
  },
  {
    type: "number",
    label: "Number",
    description: "Numeric value",
    icon: <NumbersOutlinedIcon />,
  },
  {
    type: "date",
    label: "Date",
    description: "Date selection",
    icon: <DateRangeOutlinedIcon />,
  },
  {
    type: "select",
    label: "Dropdown",
    description: "Select one option",
    icon: <ViewListOutlinedIcon />,
  },
  {
    type: "radio",
    label: "Radio",
    description: "Choose one option",
    icon: <RadioButtonCheckedOutlinedIcon />,
  },
  {
    type: "checkbox",
    label: "Checkbox",
    description: "Choose multiple options",
    icon: <CheckBoxOutlinedIcon />,
  },
  {
    type: "rating",
    label: "Rating",
    description: "Star rating",
    icon: <StarBorderOutlinedIcon />,
  },
  {
    type: "file",
    label: "File Upload",
    description: "Upload a file",
    icon: <CloudUploadOutlinedIcon />,
  },
  {
    type: "toggle",
    label: "Toggle",
    description: "On or off value",
    icon: <ToggleOnOutlinedIcon />,
  },
];

const FieldPalette = ({
  onAddField,
  onFieldDragStart,
}: FieldPaletteProps) => {
  const handleDragStart = (
    event: DragEvent<HTMLButtonElement>,
    fieldType: FieldType,
  ) => {
    event.dataTransfer.effectAllowed = "copy";
    event.dataTransfer.setData(
      "application/form-field-type",
      fieldType,
    );

    onFieldDragStart?.(event, fieldType);
  };

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
          px: 2,
          py: 2,
        }}
      >
        <Typography
          variant="subtitle1"
          fontWeight={700}
        >
          Form Fields
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 0.5 }}
        >
          Click or drag a field into your form.
        </Typography>
      </Box>

      <Divider />

      {/* Field List */}
      <Stack
        spacing={1}
        sx={{
          p: 1.5,
        }}
      >
        {fieldTypes.map((field) => (
          <ButtonBase
            key={field.type}
            component="button"
            type="button"
            draggable
            onClick={() => onAddField?.(field.type)}
            onDragStart={(event) =>
              handleDragStart(event, field.type)
            }
            sx={{
              width: "100%",
              textAlign: "left",
              display: "block",
              borderRadius: 2,
              cursor: "grab",
              "&:active": {
                cursor: "grabbing",
              },
            }}
          >
            <Box
              sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                p: 1.25,
                border: 1,
                borderColor: "divider",
                borderRadius: 2,
                backgroundColor: "background.paper",
                transition:
                  "border-color 0.2s, background-color 0.2s, box-shadow 0.2s",
                "&:hover": {
                  borderColor: "primary.main",
                  backgroundColor: "action.hover",
                  boxShadow: 1,
                },
              }}
            >
              {/* Icon */}
              <Box
                sx={{
                  width: 38,
                  height: 38,
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 1.5,
                  color: "primary.main",
                  backgroundColor: "primary.50",
                  "& .MuiSvgIcon-root": {
                    fontSize: 21,
                  },
                }}
              >
                {field.icon}
              </Box>

              {/* Text */}
              <Box
                sx={{
                  minWidth: 0,
                  flex: 1,
                }}
              >
                <Typography
                  variant="body2"
                  fontWeight={600}
                  noWrap
                >
                  {field.label}
                </Typography>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  noWrap
                >
                  {field.description}
                </Typography>
              </Box>
            </Box>
          </ButtonBase>
        ))}
      </Stack>
    </Box>
  );
};

export default FieldPalette;