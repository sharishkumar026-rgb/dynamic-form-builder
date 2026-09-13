
import Box from "@mui/material/Box";
import type { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
  maxWidth?: number | string;
  padding?: boolean;
  fullWidth?: boolean;
}

const PageContainer = ({
  children,
  maxWidth = 1440,
  padding = true,
  fullWidth = false,
}: PageContainerProps) => {
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: fullWidth ? "none" : maxWidth,
        mx: "auto",
        px: padding
          ? {
              xs: 0,
              sm: 1,
              md: 2,
            }
          : 0,
        py: padding
          ? {
              xs: 1,
              sm: 1.5,
              md: 2,
            }
          : 0,
        boxSizing: "border-box",
      }}
    >
      {children}
    </Box>
  );
};

export default PageContainer;

