
import MenuIcon from "@mui/icons-material/Menu";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import AppBar from "@mui/material/AppBar";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { Outlet } from "react-router-dom";

import Logo from "../common/Logo";

interface AppLayoutProps {
  sidebar?: React.ReactNode;
  headerActions?: React.ReactNode;
  sidebarWidth?: number;
}

const AppLayout = ({
  sidebar,
  headerActions,
  sidebarWidth = 260,
}: AppLayoutProps) => {
  const theme = useTheme();

  const isMobile = useMediaQuery(
    theme.breakpoints.down("md")
  );

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "background.default",
      }}
    >
      {/* Desktop Sidebar */}
      {!isMobile && sidebar && (
        <Box
          component="aside"
          sx={{
            width: sidebarWidth,
            flexShrink: 0,
            borderRight: 1,
            borderColor: "divider",
            backgroundColor: "background.paper",
            minHeight: "100vh",
          }}
        >
          <Box
            sx={{
              height: 72,
              display: "flex",
              alignItems: "center",
              px: 2.5,
              borderBottom: 1,
              borderColor: "divider",
            }}
          >
            <Logo />
          </Box>

          <Box
            sx={{
              p: 2,
            }}
          >
            {sidebar}
          </Box>
        </Box>
      )}

      {/* Main Area */}
      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
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
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
              >
                {isMobile && (
                  <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="Open navigation menu"
                  >
                    <MenuIcon />
                  </IconButton>
                )}

                {isMobile && (
                  <Logo
                    showText
                  />
                )}
              </Stack>

              {headerActions && (
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                >
                  {headerActions}
                </Stack>
              )}
            </Stack>
          </Toolbar>
        </AppBar>

        {/* Page Content */}
        <Box
          component="main"
          sx={{
            flex: 1,
            width: "100%",
            p: {
              xs: 2,
              sm: 3,
              md: 4,
            },
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default AppLayout;

