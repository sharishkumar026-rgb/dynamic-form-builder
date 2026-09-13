
import { useState, type MouseEvent } from "react";
import { useNavigate } from "react-router-dom";

import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";

import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

interface UserMenuProps {
  userName?: string;
  userRole?: string;
  onLogout?: () => void;
}

const UserMenu = ({
  userName = "User",
  userRole = "User",
  onLogout,
}: UserMenuProps) => {
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] =
    useState<HTMLElement | null>(null);

  const menuOpen = Boolean(anchorEl);

  const getInitials = (name: string) => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      return "U";
    }

    const words = trimmedName.split(/\s+/);

    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    }

    return (
      words[0].charAt(0) +
      words[words.length - 1].charAt(0)
    ).toUpperCase();
  };

  const handleOpen = (
    event: MouseEvent<HTMLElement>,
  ) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    handleClose();
    navigate("/profile");
  };

  const handleSettings = () => {
    handleClose();
    navigate("/settings");
  };

  const handleLogout = () => {
    handleClose();

    if (onLogout) {
      onLogout();
      return;
    }

    navigate("/login");
  };

  return (
    <>
      <Tooltip title="Account">
        <IconButton
          onClick={handleOpen}
          aria-label="Open account menu"
          aria-controls={
            menuOpen
              ? "user-account-menu"
              : undefined
          }
          aria-haspopup="true"
          aria-expanded={
            menuOpen ? "true" : undefined
          }
        >
          <Avatar
            sx={{
              width: 38,
              height: 38,
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            {getInitials(userName)}
          </Avatar>
        </IconButton>
      </Tooltip>

      <Menu
        id="user-account-menu"
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Box
          sx={{
            minWidth: 220,
            px: 2,
            py: 1.5,
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={1.5}
          >
            <Avatar
              sx={{
                width: 42,
                height: 42,
                fontSize: 15,
                fontWeight: 600,
              }}
            >
              {getInitials(userName)}
            </Avatar>

            <Box
              sx={{
                minWidth: 0,
              }}
            >
              <Typography
                variant="subtitle2"
                noWrap
                sx={{
                  fontWeight: 700,
                }}
              >
                {userName}
              </Typography>

              <Typography
                variant="caption"
                color="text.secondary"
                noWrap
              >
                {userRole}
              </Typography>
            </Box>
          </Stack>
        </Box>

        <Divider />

        <MenuItem onClick={handleProfile}>
          <ListItemIcon>
            <PersonOutlineIcon fontSize="small" />
          </ListItemIcon>

          Profile
        </MenuItem>

        <MenuItem onClick={handleSettings}>
          <ListItemIcon>
            <SettingsOutlinedIcon fontSize="small" />
          </ListItemIcon>

          Settings
        </MenuItem>

        <Divider />

        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutOutlinedIcon
              fontSize="small"
              color="error"
            />
          </ListItemIcon>

          <Typography color="error.main">
            Logout
          </Typography>
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserMenu;

