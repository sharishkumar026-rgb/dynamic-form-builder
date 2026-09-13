import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";

import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

export interface RoleStatusToggleData {
  id: number | string;
  name?: string;
  isActive: boolean;
}

interface RoleStatusToggleProps {
  role: RoleStatusToggleData;
  loading?: boolean;
  onToggle?: (role: RoleStatusToggleData) => void;
  compact?: boolean;
}

const RoleStatusToggle = ({
  role,
  loading = false,
  onToggle,
  compact = false,
}: RoleStatusToggleProps) => {
  const handleToggle = () => {
    if (loading) {
      return;
    }

    onToggle?.(role);
  };

  return (
    <Stack direction="row" alignItems="center">
      <Button
        variant={role.isActive ? "outlined" : "contained"}
        color={role.isActive ? "error" : "success"}
        size={compact ? "small" : "medium"}
        startIcon={
          role.isActive ? (
            <BlockOutlinedIcon />
          ) : (
            <CheckCircleOutlineIcon />
          )
        }
        onClick={handleToggle}
        disabled={loading}
        sx={{
          minWidth: compact ? 110 : 140,
          textTransform: "none",
          fontWeight: 600,
          borderRadius: 2,
        }}
      >
        {loading
          ? "Updating..."
          : role.isActive
            ? "Deactivate"
            : "Activate"}
      </Button>
    </Stack>
  );
};

export default RoleStatusToggle;