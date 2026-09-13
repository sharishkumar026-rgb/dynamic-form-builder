import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import type { MouseEvent } from "react";

export interface UserStatusToggleData {
  id: number | string;
  name?: string;
  isActive: boolean;
}

interface UserStatusToggleProps {
  user: UserStatusToggleData;
  loading?: boolean;
  onToggle?: (user: UserStatusToggleData) => void;
  compact?: boolean;
}

const UserStatusToggle = ({
  user,
  loading = false,
  onToggle,
  compact = false,
}: UserStatusToggleProps) => {
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onToggle?.(user);
  };

  return (
    <Stack direction="row" alignItems="center">
      <Button
        variant={user.isActive ? "outlined" : "contained"}
        color={user.isActive ? "error" : "success"}
        size={compact ? "small" : "medium"}
        startIcon={
          user.isActive ? (
            <BlockOutlinedIcon />
          ) : (
            <CheckCircleOutlineIcon />
          )
        }
        onClick={handleClick}
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
          : user.isActive
            ? "Deactivate"
            : "Activate"}
      </Button>
    </Stack>
  );
};

export default UserStatusToggle;