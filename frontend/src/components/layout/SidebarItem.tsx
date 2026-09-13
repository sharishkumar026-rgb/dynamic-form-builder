
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";

interface SidebarItemProps {
  label: string;
  path: string;
  icon: ReactNode;
  collapsed?: boolean;
  onClick?: () => void;
}

const SidebarItem = ({
  label,
  path,
  icon,
  collapsed = false,
  onClick,
}: SidebarItemProps) => {
  return (
    <ListItem
      disablePadding
      sx={{
        mb: 0.5,
      }}
    >
      <ListItemButton
        component={NavLink}
        to={path}
        onClick={onClick}
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
          {icon}
        </ListItemIcon>

        {!collapsed && (
          <ListItemText
            primary={label}
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
  );
};

export default SidebarItem;

