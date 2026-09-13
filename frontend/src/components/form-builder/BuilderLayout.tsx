import type { ReactNode } from "react";

import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";

interface BuilderLayoutProps {
  header?: ReactNode;
  leftPanel?: ReactNode;
  children: ReactNode;
  rightPanel?: ReactNode;
  leftPanelWidth?: number;
  rightPanelWidth?: number;
}

const BuilderLayout = ({
  header,
  leftPanel,
  children,
  rightPanel,
  leftPanelWidth = 260,
  rightPanelWidth = 320,
}: BuilderLayoutProps) => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        minHeight: "calc(100vh - 64px)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        backgroundColor: "background.default",
      }}
    >
      {/* Builder Header */}
      {header && (
        <Box
          sx={{
            flexShrink: 0,
            backgroundColor: "background.paper",
            borderBottom: 1,
            borderColor: "divider",
            zIndex: 10,
          }}
        >
          {header}
        </Box>
      )}

      {/* Builder Content */}
      <Stack
        direction="row"
        sx={{
          flex: 1,
          minHeight: 0,
          width: "100%",
          overflow: "hidden",
        }}
      >
        {/* Left Panel */}
        {leftPanel && (
          <>
            <Box
              sx={{
                width: leftPanelWidth,
                minWidth: leftPanelWidth,
                height: "100%",
                overflowY: "auto",
                overflowX: "hidden",
                backgroundColor: "background.paper",
                borderRight: 1,
                borderColor: "divider",
                "&::-webkit-scrollbar": {
                  width: 6,
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "divider",
                  borderRadius: 3,
                },
              }}
            >
              {leftPanel}
            </Box>

            <Divider orientation="vertical" flexItem />
          </>
        )}

        {/* Main Builder Canvas */}
        <Box
          component="main"
          sx={{
            flex: 1,
            minWidth: 0,
            height: "100%",
            overflowY: "auto",
            overflowX: "hidden",
            backgroundColor: "grey.50",
            p: {
              xs: 2,
              sm: 3,
              md: 4,
            },
            "&::-webkit-scrollbar": {
              width: 8,
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "divider",
              borderRadius: 4,
            },
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: 900,
              mx: "auto",
            }}
          >
            {children}
          </Box>
        </Box>

        {/* Right Properties Panel */}
        {rightPanel && (
          <>
            <Divider orientation="vertical" flexItem />

            <Box
              sx={{
                width: rightPanelWidth,
                minWidth: rightPanelWidth,
                height: "100%",
                overflowY: "auto",
                overflowX: "hidden",
                backgroundColor: "background.paper",
                "&::-webkit-scrollbar": {
                  width: 6,
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "divider",
                  borderRadius: 3,
                },
              }}
            >
              {rightPanel}
            </Box>
          </>
        )}
      </Stack>
    </Box>
  );
};

export default BuilderLayout;