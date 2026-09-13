
import CloseIcon from "@mui/icons-material/Close";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import AnalyticsOutlinedIcon from "@mui/icons-material/AnalyticsOutlined";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";

import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import SidebarItem from "./SidebarItem";
import Logo from "../common/Logo";

interface MobileSidebarProps {
  open: boolean;
  onClose: () => void;
}

const MobileSidebar = ({
  open,
  onClose,
}: MobileSidebarProps) => {
  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      ModalProps={{
        keepMounted: true,
      }}
      PaperProps={{
        sx: {
          width: 280,
          maxWidth: "85vw",
        },
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: "100%",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "background.paper",
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            minHeight: 72,
            px: 2,
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Logo />

          <IconButton
            onClick={onClose}
            size="small"
            aria-label="Close navigation"
          >
            <CloseIcon />
          </IconButton>
        </Stack>

        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            px: 1.5,
            py: 2,
          }}
        >
          <Typography
            variant="overline"
            color="text.secondary"
            sx={{
              display: "block",
              px: 1,
              mb: 1,
              fontWeight: 700,
              letterSpacing: 0.8,
            }}
          >
            Main
          </Typography>

          <List
            disablePadding
            sx={{
              mb: 3,
            }}
          >
            <SidebarItem
              label="Dashboard"
              path="/dashboard"
              icon={<DashboardOutlinedIcon />}
              onClick={onClose}
            />

            <SidebarItem
              label="Forms"
              path="/forms"
              icon={<DescriptionOutlinedIcon />}
              onClick={onClose}
            />

            <SidebarItem
              label="Responses"
              path="/responses"
              icon={<AssignmentOutlinedIcon />}
              onClick={onClose}
            />

            <SidebarItem
              label="Analytics"
              path="/analytics"
              icon={<AnalyticsOutlinedIcon />}
              onClick={onClose}
            />

            <SidebarItem
              label="Reports"
              path="/reports"
              icon={<AssessmentOutlinedIcon />}
              onClick={onClose}
            />
          </List>

          <Typography
            variant="overline"
            color="text.secondary"
            sx={{
              display: "block",
              px: 1,
              mb: 1,
              fontWeight: 700,
              letterSpacing: 0.8,
            }}
          >
            Administration
          </Typography>

          <List disablePadding>
            <SidebarItem
              label="Users"
              path="/users"
              icon={<PeopleOutlineIcon />}
              onClick={onClose}
            />

            <SidebarItem
              label="Roles"
              path="/roles"
              icon={<SecurityOutlinedIcon />}
              onClick={onClose}
            />

            <SidebarItem
              label="Activity Logs"
              path="/activity-logs"
              icon={<HistoryOutlinedIcon />}
              onClick={onClose}
            />
          </List>
        </Box>

        <Box
          sx={{
            px: 2,
            py: 1.5,
            borderTop: 1,
            borderColor: "divider",
          }}
        >
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
        </Box>
      </Box>
    </Drawer>
  );
};

export default MobileSidebar;

