
import { useState, type MouseEvent } from "react";
import { useNavigate } from "react-router-dom";

import MenuIcon from "@mui/icons-material/Menu";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";

import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

interface TopbarProps {
  title?: string;
  userName?: string;
  userRole?: string;
  onMenuClick?: () => void;
  showMenuButton?: boolean;
  onLogout?: () => void;
}

const Topbar = ({
  title = "Dashboard",
  userName = "User",
  userRole = "User",
  onMenuClick,
  showMenuButton = true,
  onLogout,
}: TopbarProps) => {
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] =
    useState<HTMLElement | null>(null);

  const menuOpen = Boolean(anchorEl);

  const handleProfileMenu = (
    event: MouseEvent<HTMLElement>,
  ) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    handleMenuClose();
    navigate("/profile");
  };

  const handleSettings = () => {
    handleMenuClose();
    navigate("/settings");
  };

  const handleLogout = () => {
    handleMenuClose();

    if (onLogout) {
      onLogout();
      return;
    }

    navigate("/login");
  };

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

  return (
    <AppBar
      position="sticky"
      elevation={0}
      color="inherit"
      sx={{
        borderBottom: 1,
        borderColor: "divider",
        backgroundColor: "background.paper",
      }}
    >
      <Toolbar
        sx={{
          minHeight: "72px !important",
          px: {
            xs: 2,
            sm: 3,
          },
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
          sx={{
            width: "100%",
          }}
        >
          {/* Left section */}
          <Stack
            direction="row"
            alignItems="center"
            spacing={1.5}
            sx={{
              minWidth: 0,
            }}
          >
            {showMenuButton && (
              <Tooltip title="Open navigation">
                <IconButton
                  onClick={onMenuClick}
                  aria-label="Open navigation menu"
                >
                  <MenuIcon />
                </IconButton>
              </Tooltip>
            )}

            <Box
              sx={{
                minWidth: 0,
              }}
            >
              <Typography
                variant="h6"
                component="h1"
                noWrap
                sx={{
                  fontWeight: 700,
                  lineHeight: 1.3,
                }}
              >
                {title}
              </Typography>
            </Box>
          </Stack>

          {/* Right section */}
          <Stack
            direction="row"
            alignItems="center"
            spacing={0.5}
          >
            <Tooltip title="Notifications">
              <IconButton
                aria-label="Notifications"
                onClick={() => navigate("/notifications")}
              >
                <NotificationsNoneOutlinedIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Account">
              <IconButton
                onClick={handleProfileMenu}
                aria-label="Open account menu"
                aria-controls={
                  menuOpen
                    ? "account-menu"
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
              id="account-menu"
              anchorEl={anchorEl}
              open={menuOpen}
              onClose={handleMenuClose}
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
                  px: 2,
                  py: 1.5,
                  minWidth: 220,
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 700,
                  }}
                >
                  {userName}
                </Typography>

                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  {userRole}
                </Typography>
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
          </Stack>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;

