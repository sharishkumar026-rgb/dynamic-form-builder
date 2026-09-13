import type { DragEvent, ReactNode } from "react";

import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Typography from "@mui/material/Typography";

import type { FieldType } from "./FieldPalette";

interface FieldPaletteItemProps {
  type: FieldType;
  label: string;
  description: string;
  icon: ReactNode;
  onClick?: (fieldType: FieldType) => void;
  onDragStart?: (
    event: DragEvent<HTMLButtonElement>,
    fieldType: FieldType,
  ) => void;
}

const FieldPaletteItem = ({
  type,
  label,
  description,
  icon,
  onClick,
  onDragStart,
}: FieldPaletteItemProps) => {
  const handleDragStart = (
    event: DragEvent<HTMLButtonElement>,
  ) => {
    event.dataTransfer.effectAllowed = "copy";

    event.dataTransfer.setData(
      "application/form-field-type",
      type,
    );

    onDragStart?.(event, type);
  };

  const handleClick = () => {
    onClick?.(type);
  };

  return (
    <ButtonBase
      component="button"
      type="button"
      draggable
      onClick={handleClick}
      onDragStart={handleDragStart}
      sx={{
        width: "100%",
        display: "block",
        textAlign: "left",
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
        {/* Field Icon */}
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
          {icon}
        </Box>

        {/* Field Information */}
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
            {label}
          </Typography>

          <Typography
            variant="caption"
            color="text.secondary"
            noWrap
          >
            {description}
          </Typography>
        </Box>
      </Box>
    </ButtonBase>
  );
};

export default FieldPaletteItem;