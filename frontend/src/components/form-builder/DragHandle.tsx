import DragIndicatorIcon from "@mui/icons-material/DragIndicator";

import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

interface DragHandleProps {
  disabled?: boolean;
  size?: "small" | "medium";
  label?: string;
}

const DragHandle = ({
  disabled = false,
  size = "small",
  label = "Drag to reorder",
}: DragHandleProps) => {
  return (
    <Tooltip title={disabled ? "" : label}>
      <Box
        component="span"
        sx={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: disabled ? "default" : "grab",
          "&:active": {
            cursor: disabled ? "default" : "grabbing",
          },
        }}
      >
        <IconButton
          size={size}
          disabled={disabled}
          aria-label={label}
          sx={{
            color: "text.disabled",
            cursor: disabled ? "default" : "grab",
            "&:hover": {
              color: disabled
                ? "text.disabled"
                : "text.secondary",
              backgroundColor: "action.hover",
            },
          }}
        >
          <DragIndicatorIcon fontSize={size} />
        </IconButton>
      </Box>
    </Tooltip>
  );
};

export default DragHandle;