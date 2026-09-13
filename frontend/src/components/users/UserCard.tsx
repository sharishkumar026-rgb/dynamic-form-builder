import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { MouseEvent } from "react";
import { useState } from "react";

export interface UserCardData {
  id: number | string;
  name: string;
  email: string;
  role?: string;
  roleId?: number | string;
  isActive?: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

interface UserCardProps {
  user: UserCardData;
  loading?: boolean;
  onView?: (user: UserCardData) => void;
  onEdit?: (user: UserCardData) => void;
  onDelete?: (user: UserCardData) => void;
  onToggleStatus?: (user: UserCardData) => void;
}

const formatDate = (value?: string | Date) => {
  if (!value) {
    return "—";
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString();
};

const getRoleLabel = (user: UserCardData) => {
  if (user.role) {
    return user.role;
  }

  if (user.roleId !== undefined) {
    return `Role ${user.roleId}`;
  }

  return "User";
};

const UserCard = ({
  user,
  loading = false,
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
}: UserCardProps) => {
  const [anchorEl, setAnchorEl] =
    useState<null | HTMLElement>(null);

  const menuOpen = Boolean(anchorEl);
  const isActive = user.isActive !== false;

  const handleMenuOpen = (
    event: MouseEvent<HTMLButtonElement>,
  ) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleView = () => {
    onView?.(user);
    handleMenuClose();
  };

  const handleEdit = () => {
    onEdit?.(user);
    handleMenuClose();
  };

  const handleDelete = () => {
    onDelete?.(user);
    handleMenuClose();
  };

  const handleToggleStatus = () => {
    onToggleStatus?.(user);
    handleMenuClose();
  };

  if (loading) {
    return (
      <Paper
        variant="outlined"
        sx={{
          p: 2.5,
          borderRadius: 3,
        }}
      >
        <Stack spacing={2}>
          <Stack
            direction="row"
            spacing={1.5}
            alignItems="center"
          >
            <Skeleton
              variant="circular"
              width={52}
              height={52}
            />

            <Box sx={{ flex: 1 }}>
              <Skeleton width="60%" height={25} />
              <Skeleton width="80%" />
            </Box>
          </Stack>

          <Skeleton width="35%" />
          <Skeleton width="45%" />

          <Stack
            direction="row"
            spacing={1}
            justifyContent="space-between"
          >
            <Skeleton width={80} height={30} />
            <Skeleton width={36} height={36} />
          </Stack>
        </Stack>
      </Paper>
    );
  }

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2.5,
        borderRadius: 3,
        height: "100%",
        transition: "box-shadow 0.2s ease, transform 0.2s ease",
        "&:hover": {
          boxShadow: 3,
          transform: "translateY(-2px)",
        },
      }}
    >
      <Stack spacing={2}>
        <Stack
          direction="row"
          spacing={1.5}
          alignItems="flex-start"
        >
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "action.hover",
              color: "primary.main",
              flexShrink: 0,
            }}
          >
            <PersonOutlineIcon />
          </Box>

          <Box
            sx={{
              flex: 1,
              minWidth: 0,
            }}
          >
            <Typography
              variant="subtitle1"
              fontWeight={700}
              noWrap
              title={user.name}
            >
              {user.name}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              noWrap
              title={user.email}
            >
              {user.email}
            </Typography>
          </Box>

          <IconButton
            size="small"
            onClick={handleMenuOpen}
            aria-label={`Actions for ${user.name}`}
            aria-controls={
              menuOpen ? "user-card-actions-menu" : undefined
            }
            aria-haspopup="menu"
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </Stack>

        <Stack
          direction="row"
          spacing={1}
          flexWrap="wrap"
          useFlexGap
        >
          <Chip
            label={getRoleLabel(user)}
            size="small"
            variant="outlined"
            sx={{
              textTransform: "capitalize",
            }}
          />

          <Chip
            icon={
              isActive ? (
                <CheckCircleOutlineIcon />
              ) : (
                <CancelOutlinedIcon />
              )
            }
            label={isActive ? "Active" : "Inactive"}
            size="small"
            color={isActive ? "success" : "default"}
            variant="outlined"
          />
        </Stack>

        <Box
          sx={{
            p: 1.5,
            borderRadius: 2,
            backgroundColor: "action.hover",
          }}
        >
          <Typography
            variant="caption"
            color="text.secondary"
            display="block"
          >
            User ID
          </Typography>

          <Typography variant="body2" fontWeight={600}>
            {user.id}
          </Typography>
        </Box>

        <Stack spacing={0.5}>
          <Stack
            direction="row"
            justifyContent="space-between"
            spacing={2}
          >
            <Typography
              variant="caption"
              color="text.secondary"
            >
              Created
            </Typography>

            <Typography variant="caption" fontWeight={500}>
              {formatDate(user.createdAt)}
            </Typography>
          </Stack>

          {user.updatedAt && (
            <Stack
              direction="row"
              justifyContent="space-between"
              spacing={2}
            >
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Updated
              </Typography>

              <Typography variant="caption" fontWeight={500}>
                {formatDate(user.updatedAt)}
              </Typography>
            </Stack>
          )}
        </Stack>

        <Stack
          direction="row"
          spacing={1}
          sx={{ pt: 0.5 }}
        >
          {onView && (
            <Box
              component="button"
              type="button"
              onClick={handleView}
              sx={{
                flex: 1,
                border: 1,
                borderColor: "divider",
                borderRadius: 2,
                backgroundColor: "transparent",
                color: "text.primary",
                py: 0.8,
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 600,
                "&:hover": {
                  backgroundColor: "action.hover",
                },
              }}
            >
              View
            </Box>
          )}

          {onEdit && (
            <Box
              component="button"
              type="button"
              onClick={handleEdit}
              sx={{
                flex: 1,
                border: 1,
                borderColor: "primary.main",
                borderRadius: 2,
                backgroundColor: "transparent",
                color: "primary.main",
                py: 0.8,
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 600,
                "&:hover": {
                  backgroundColor: "primary.50",
                },
              }}
            >
              Edit
            </Box>
          )}
        </Stack>
      </Stack>

      <Menu
        id="user-card-actions-menu"
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
        slotProps={{
          paper: {
            sx: {
              minWidth: 180,
              borderRadius: 2,
            },
          },
        }}
      >
        {onView && (
          <MenuItem onClick={handleView}>
            <PersonOutlineIcon
              fontSize="small"
              sx={{ mr: 1.5 }}
            />
            View User
          </MenuItem>
        )}

        {onEdit && (
          <MenuItem onClick={handleEdit}>
            <EditOutlinedIcon
              fontSize="small"
              sx={{ mr: 1.5 }}
            />
            Edit User
          </MenuItem>
        )}

        {onToggleStatus && (
          <MenuItem onClick={handleToggleStatus}>
            {isActive ? (
              <CancelOutlinedIcon
                fontSize="small"
                sx={{ mr: 1.5 }}
              />
            ) : (
              <CheckCircleOutlineIcon
                fontSize="small"
                sx={{ mr: 1.5 }}
              />
            )}

            {isActive
              ? "Deactivate User"
              : "Activate User"}
          </MenuItem>
        )}

        {onDelete && (
          <MenuItem
            onClick={handleDelete}
            sx={{
              color: "error.main",
            }}
          >
            <DeleteOutlineIcon
              fontSize="small"
              sx={{ mr: 1.5 }}
            />
            Delete User
          </MenuItem>
        )}
      </Menu>
    </Paper>
  );
};

export default UserCard;