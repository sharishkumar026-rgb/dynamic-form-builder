import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import RefreshIcon from "@mui/icons-material/Refresh";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";

interface ErrorStateProps {
  title?: string;
  message?: string;
  action?: ReactNode;
  actionText?: string;
  onRetry?: () => void;
  minHeight?: number | string;
}

const ErrorState = ({
  title = "Something went wrong",
  message = "We could not load the requested data. Please try again.",
  action,
  actionText = "Try Again",
  onRetry,
  minHeight = 240,
}: ErrorStateProps) => {
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
            color: "error.main",
            mb: 0.5,
          }}
        >
          <ErrorOutlineIcon fontSize="large" />
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

        {(onRetry || action) && (
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            spacing={1}
            sx={{
              pt: 1,
            }}
          >
            {onRetry && (
              <Button
                variant="contained"
                color="primary"
                onClick={onRetry}
                startIcon={<RefreshIcon />}
              >
                {actionText}
              </Button>
            )}

            {action}
          </Stack>
        )}
      </Stack>
    </Box>
  );
};

export default ErrorState;