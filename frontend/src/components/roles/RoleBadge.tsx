import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";

import Chip from "@mui/material/Chip";

interface RoleBadgeProps {
  role?: string | null;
  size?: "small" | "medium";
  variant?: "filled" | "outlined";
}

const RoleBadge = ({
  role,
  size = "small",
  variant = "outlined",
}: RoleBadgeProps) => {
  const normalizedRole = role?.trim().toLowerCase() || "user";

  const getRoleConfig = () => {
    switch (normalizedRole) {
      case "admin":
      case "administrator":
        return {
          label: role || "Admin",
          color: "error" as const,
          icon: <AdminPanelSettingsOutlinedIcon />,
        };

      case "manager":
        return {
          label: role || "Manager",
          color: "warning" as const,
          icon: <BadgeOutlinedIcon />,
        };

      case "user":
      case "employee":
        return {
          label: role || "User",
          color: "primary" as const,
          icon: <PersonOutlineOutlinedIcon />,
        };

      default:
        return {
          label: role || "User",
          color: "default" as const,
          icon: <BadgeOutlinedIcon />,
        };
    }
  };

  const config = getRoleConfig();

  return (
    <Chip
      label={config.label}
      color={config.color}
      size={size}
      variant={variant}
      icon={config.icon}
      sx={{
        fontWeight: 600,
        textTransform: "capitalize",
        borderRadius: 1.5,
        "& .MuiChip-icon": {
          fontSize: size === "small" ? 17 : 19,
        },
      }}
    />
  );
};

export default RoleBadge;