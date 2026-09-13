
import { useState, type MouseEvent } from "react";

import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import DoneAllIcon from "@mui/icons-material/DoneAll";

import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

export type NotificationType =
  | "info"
  | "success"
  | "warning"
  | "error";

export interface NotificationItem {
  id: number | string;
  title: string;
  message: string;
  type?: NotificationType;
  createdAt?: string | Date;
  read?: boolean;
}

interface NotificationMenuProps {
  notifications?: NotificationItem[];
  onNotificationClick?: (
    notification: NotificationItem,
  ) => void;
  onMarkAllRead?: () => void;
}

const NotificationMenu = ({
  notifications = [],
  onNotificationClick,
  onMarkAllRead,
}: NotificationMenuProps) => {
  const [anchorEl, setAnchorEl] =
    useState<HTMLElement | null>(null);

  const open = Boolean(anchorEl);

  const unreadCount = notifications.filter(
    (item) => !item.read,
  ).length;

  const handleOpen = (
    event: MouseEvent<HTMLElement>,
  ) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (
    notification: NotificationItem,
  ) => {
    onNotificationClick?.(notification);
    handleClose();
  };

  const handleMarkAllRead = () => {
    onMarkAllRead?.();
  };

  const getIcon = (
    type: NotificationType = "info",
  ) => {
    if (type === "success") {
      return (
        <CheckCircleOutlineIcon
          fontSize="small"
          color="success"
        />
      );
    }

    if (type === "warning") {
      return (
        <WarningAmberOutlinedIcon
          fontSize="small"
          color="warning"
        />
      );
    }

    if (type === "error") {
      return (
        <ErrorOutlineIcon
          fontSize="small"
          color="error"
        />
      );
    }

    return (
      <InfoOutlinedIcon
        fontSize="small"
        color="info"
      />
    );
  };

  const formatDate = (
    value?: string | Date,
  ) => {
    if (!value) {
      return "";
    }

    const date =
      value instanceof Date
        ? value
        : new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <Box>
      <Tooltip title="Notifications">
        <IconButton
          onClick={handleOpen}
          aria-label="Open notifications"
        >
          <Badge
            badgeContent={unreadCount}
            color="error"
            max={99}
          >
            <NotificationsNoneOutlinedIcon />
          </Badge>
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        slotProps={{
          paper: {
            sx: {
              width: 380,
              maxWidth: "calc(100vw - 32px)",
              maxHeight: 520,
            },
          },
        }}
      >
        <Box
          sx={{
            px: 2,
            py: 1.5,
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 700,
                }}
              >
                Notifications
              </Typography>

              <Typography
                variant="caption"
                color="text.secondary"
              >
                {unreadCount > 0
                  ? `${unreadCount} unread`
                  : "You're all caught up"}
              </Typography>
            </Box>

            {unreadCount > 0 &&
              onMarkAllRead && (
                <Tooltip title="Mark all as read">
                  <IconButton
                    size="small"
                    onClick={handleMarkAllRead}
                    aria-label="Mark all as read"
                  >
                    <DoneAllIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
          </Stack>
        </Box>

        <Divider />

        {notifications.length === 0 ? (
          <Box
            sx={{
              px: 3,
              py: 5,
              textAlign: "center",
            }}
          >
            <Avatar
              sx={{
                width: 48,
                height: 48,
                mx: "auto",
                mb: 1.5,
                backgroundColor: "action.hover",
                color: "text.secondary",
              }}
            >
              <NotificationsNoneOutlinedIcon />
            </Avatar>

            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
              }}
            >
              No notifications
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
            >
              You don't have any notifications yet.
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              maxHeight: 390,
              overflowY: "auto",
            }}
          >
            {notifications.map((notification) => (
              <MenuItem
                key={notification.id}
                onClick={() =>
                  handleNotificationClick(
                    notification,
                  )
                }
                sx={{
                  alignItems: "flex-start",
                  whiteSpace: "normal",
                  px: 2,
                  py: 1.5,
                  backgroundColor: notification.read
                    ? "transparent"
                    : "action.hover",
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 36,
                    mt: 0.25,
                  }}
                >
                  {getIcon(notification.type)}
                </ListItemIcon>

                <Box
                  sx={{
                    minWidth: 0,
                    flex: 1,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: notification.read
                        ? 500
                        : 700,
                      lineHeight: 1.4,
                    }}
                  >
                    {notification.title}
                  </Typography>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      display: "block",
                      mt: 0.35,
                      lineHeight: 1.45,
                    }}
                  >
                    {notification.message}
                  </Typography>

                  {notification.createdAt && (
                    <Typography
                      variant="caption"
                      color="text.disabled"
                      sx={{
                        display: "block",
                        mt: 0.5,
                      }}
                    >
                      {formatDate(
                        notification.createdAt,
                      )}
                    </Typography>
                  )}
                </Box>

                {!notification.read && (
                  <Box
                    sx={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      backgroundColor: "primary.main",
                      flexShrink: 0,
                      mt: 1,
                      ml: 1,
                    }}
                  />
                )}
              </MenuItem>
            ))}
          </Box>
        )}
      </Menu>
    </Box>
  );
};

