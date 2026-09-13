import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";

import type { MouseEvent } from "react";
import { useState } from "react";

export interface UserActionsData {
  id: number | string;
  name: string;
  email?: string;
  isActive?: boolean;
}

interface UserActionsProps {
  user: UserActionsData;
  loading?: boolean;
  onView?: (user: UserActionsData) => void;
  onEdit?: (user: UserActionsData) => void;
  onDelete?: (user: UserActionsData) => void;
  onToggleStatus?: (user: UserActionsData) => void;
}

const UserActions = ({
  user,
  loading = false,
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
}: UserActionsProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const menuOpen = Boolean(anchorEl);

  const handleOpen = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAction = (
    callback?: (user: UserActionsData) => void,
  ) => {
    handleClose();
    callback?.(user);
  };

  const handleDelete = () => {
    handleClose();
    onDelete?.(user);
  };

  return (
    <Stack direction="row" alignItems="center">
      <Tooltip title="Actions">
        <span>
          <IconButton
            size="small"
            onClick={handleOpen}
            disabled={loading}
            sx={{
              border: 1,
              borderColor: "divider",
              borderRadius: 1.5,
            }}
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleClose}
        onClick={(event) => event.stopPropagation()}
        slotProps={{
          paper: {
            sx: {
              minWidth: 190,
              mt: 0.5,
              borderRadius: 2,
            },
          },
        }}
      >
        {onView && (
          <MenuItem onClick={() => handleAction(onView)}>
            <ListItemIcon>
              <VisibilityOutlinedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="View" />
          </MenuItem>
        )}

        {onEdit && (
          <MenuItem onClick={() => handleAction(onEdit)}>
            <ListItemIcon>
              <EditOutlinedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Edit" />
          </MenuItem>
        )}

        {onToggleStatus && (
          <MenuItem onClick={() => handleAction(onToggleStatus)}>
            <ListItemIcon>
              {user.isActive ? (
                <BlockOutlinedIcon fontSize="small" />
              ) : (
                <CheckCircleOutlineIcon fontSize="small" />
              )}
            </ListItemIcon>

            <ListItemText
              primary={user.isActive ? "Deactivate" : "Activate"}
            />
          </MenuItem>
        )}

        {onDelete && (
          <MenuItem
            onClick={handleDelete}
            sx={{
              color: "error.main",
            }}
          >
            <ListItemIcon sx={{ color: "error.main" }}>
              <DeleteOutlineIcon fontSize="small" />
            </ListItemIcon>

            <ListItemText primary="Delete" />
          </MenuItem>
        )}
      </Menu>
    </Stack>
  );
};

export default UserActions;