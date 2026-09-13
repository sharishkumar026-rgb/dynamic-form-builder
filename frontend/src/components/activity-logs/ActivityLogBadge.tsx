import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";

import Chip from "@mui/material/Chip";

export type ActivityLogStatus =
  | "success"
  | "failed"
  | "warning"
  | "info";

interface ActivityLogBadgeProps {
  status?: ActivityLogStatus;
  size?: "small" | "medium";
  variant?: "filled" | "outlined";
}

const ActivityLogBadge = ({
  status = "info",
  size = "small",
  variant = "outlined",
}: ActivityLogBadgeProps) => {
  const getStatusConfig = () => {
    switch (status) {
      case "success":
        return {
          label: "Success",
          color: "success" as const,
          icon: <CheckCircleOutlineIcon />,
        };

      case "failed":
        return {
          label: "Failed",
          color: "error" as const,
          icon: <ErrorOutlineIcon />,
        };

      case "warning":
        return {
          label: "Warning",
          color: "warning" as const,
          icon: <WarningAmberOutlinedIcon />,
        };

      case "info":
      default:
        return {
          label: "Info",
          color: "info" as const,
          icon: <InfoOutlinedIcon />,
        };
    }
  };

  const config = getStatusConfig();

  return (
    <Chip
      label={config.label}
      color={config.color}
      size={size}
      variant={variant}
      icon={config.icon}
      sx={{
        fontWeight: 600,
        borderRadius: 1.5,
        "& .MuiChip-icon": {
          fontSize: size === "small" ? 17 : 19,
        },
      }}
    />
  );
};

export default ActivityLogBadge;