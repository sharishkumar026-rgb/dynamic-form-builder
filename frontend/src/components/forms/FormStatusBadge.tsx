
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";

import Chip from "@mui/material/Chip";

interface FormStatusBadgeProps {
  isActive: boolean;
  size?: "small" | "medium";
}

const FormStatusBadge = ({
  isActive,
  size = "small",
}: FormStatusBadgeProps) => {
  return (
    <Chip
      icon={
        isActive ? (
          <CheckCircleOutlineIcon />
        ) : (
          <CancelOutlinedIcon />
        )
      }
      label={isActive ? "Active" : "Inactive"}
      color={isActive ? "success" : "default"}
      variant="outlined"
      size={size}
      sx={{
        fontWeight: 600,
        "& .MuiChip-icon": {
          fontSize: size === "small" ? 17 : 20,
        },
      }}
    />
  );
};

export default FormStatusBadge;

