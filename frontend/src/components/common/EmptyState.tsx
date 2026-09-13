import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";

interface EmptyStateProps {
  title?: string;
  message?: string;
  action?: ReactNode;
  minHeight?: number | string;
}

const EmptyState = ({
  title = "No data found",
  message = "There is nothing to display here yet.",
  action,
  minHeight = 240,
}: EmptyStateProps) => {
  return (
    <Box
      sx={{
        width: "100%",
        minHeight,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        py: 4,
      }}
    >
      <Stack
        alignItems="center"
        spacing={1.5}
        sx={{
          textAlign: "center",
          maxWidth: 480,
        }}
      >
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "action.hover",
            color: "text.secondary",
            mb: 0.5,
          }}
        >
          <InboxOutlinedIcon fontSize="large" />
        </Box>

        <Typography
          variant="h6"
          component="h2"
          sx={{
            fontWeight: 700,
          }}
        >
          {title}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            lineHeight: 1.6,
          }}
        >
          {message}
        </Typography>

        {action && (
          <Box
            sx={{
              pt: 1,
            }}
          >
            {action}
          </Box>
        )}
      </Stack>
    </Box>
  );
};

export default EmptyState;