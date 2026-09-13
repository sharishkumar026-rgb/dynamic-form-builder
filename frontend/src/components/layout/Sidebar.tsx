
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import AnalyticsOutlinedIcon from "@mui/icons-material/AnalyticsOutlined";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { NavLink } from "react-router-dom";

import Logo from "../common/Logo";

interface SidebarProps {
  collapsed?: boolean;
  onNavigate?: () => void;
}

interface MenuItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const mainMenuItems: MenuItem[] = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: <DashboardOutlinedIcon />,
  },
  {
    label: "Forms",
    path: "/forms",
    icon: <DescriptionOutlinedIcon />,
  },
  {
    label: "Responses",
    path: "/responses",
    icon: <AssignmentOutlinedIcon />,
  },
  {
    label: "Analytics",
    path: "/analytics",
    icon: <AnalyticsOutlinedIcon />,
  },
  {
    label: "Reports",
    path: "/reports",
    icon: <AssessmentOutlinedIcon />,
  },
];

const adminMenuItems: MenuItem[] = [
  {
    label: "Users",
    path: "/users",
    icon: <PeopleOutlineIcon />,
  },
  {
    label: "Roles",
    path: "/roles",
    icon: <SecurityOutlinedIcon />,
  },
  {
    label: "Activity Logs",
    path: "/activity-logs",
    icon: <HistoryOutlinedIcon />,
  },
];

const Sidebar = ({
  collapsed = false,
  onNavigate,
}: SidebarProps) => {
  const renderMenuItems = (items: MenuItem[]) => {
    return items.map((item) => (
      <ListItem
        key={item.path}
        disablePadding
        sx={{
          mb: 0.5,
        }}
      >
        <ListItemButton
          component={NavLink}
          to={item.path}
          onClick={onNavigate}
          sx={{
            minHeight: 44,
            px: collapsed ? 1.5 : 2,
            borderRadius: 2,
            justifyContent: collapsed
              ? "center"
              : "flex-start",

            "&.active": {
              backgroundColor: "primary.main",
              color: "primary.contrastText",

              "& .MuiListItemIcon-root": {
                color: "primary.contrastText",
              },

              "&:hover": {
                backgroundColor: "primary.dark",
              },
            },

            "&:hover": {
              backgroundColor: "action.hover",
            },
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: collapsed ? 0 : 40,
              justifyContent: "center",
              color: "text.secondary",
            }}
          >
            {item.icon}
          </ListItemIcon>

          {!collapsed && (
            <ListItemText
              primary={item.label}
              slotProps={{
                primary: {
                  fontSize: 14,
                  fontWeight: 500,
                },
              }}
            />
          )}
        </ListItemButton>
      </ListItem>
    ));
  };

  return (
    <Box
      component="aside"
      sx={{
        width: collapsed ? 76 : 260,
        height: "100%",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "background.paper",
        borderRight: 1,
        borderColor: "divider",
        transition: "width 0.2s ease",
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          height: 72,
          px: collapsed ? 1.5 : 2.5,
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed
            ? "center"
            : "flex-start",
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Logo
          collapsed={collapsed}
          showText={!collapsed}
        />
      </Box>

      {/* Navigation */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          px: collapsed ? 1 : 1.5,
          py: 2,
        }}
      >
        <Stack spacing={2}>
          {/* Main Menu */}
          <Box>
            {!collapsed && (
              <Typography
                variant="overline"
                color="text.secondary"
                sx={{
                  display: "block",
                  px: 1,
                  mb: 0.75,
                  fontWeight: 700,
                  letterSpacing: 0.8,
                }}
              >
                Main
              </Typography>
            )}

            <List
              disablePadding
              sx={{
                width: "100%",
              }}
            >
              {renderMenuItems(mainMenuItems)}
            </List>
          </Box>

          <Divider />

          {/* Administration */}
          <Box>
            {!collapsed && (
              <Typography
                variant="overline"
                color="text.secondary"
                sx={{
                  display: "block",
                  px: 1,
                  mb: 0.75,
                  fontWeight: 700,
                  letterSpacing: 0.8,
                }}
              >
                Administration
              </Typography>
            )}

            <List
              disablePadding
              sx={{
                width: "100%",
              }}
            >
              {renderMenuItems(adminMenuItems)}
            </List>
          </Box>
        </Stack>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          px: collapsed ? 1 : 2,
          py: 1.5,
          borderTop: 1,
          borderColor: "divider",
        }}
      >
        {!collapsed && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: "block",
              textAlign: "center",
            }}
          >
            Dynamic Form Builder
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default Sidebar;

