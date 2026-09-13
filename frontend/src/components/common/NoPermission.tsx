import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";

interface NoPermissionProps {
  title?: string;
  message?: string;
  action?: ReactNode;
  actionText?: string;
  onBack?: () => void;
  minHeight?: number | string;
}

const NoPermission = ({
  title = "Access Denied",
  message = "You do not have permission to access this page.",
  action,
  actionText = "Go Back",
  onBack,
  minHeight = 360,
}: NoPermissionProps) => {
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
          maxWidth: 480,
          textAlign: "center",
        }}
      >
        <Box
          sx={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "action.hover",
            color: "error.main",
            mb: 0.5,
          }}
        >
          <BlockOutlinedIcon fontSize="large" />
        </Box>

        <Typography
          variant="h5"
          component="h1"
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

        {(onBack || action) && (
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            spacing={1}
            sx={{
              pt: 1,
            }}
          >
            {onBack && (
              <Button
                variant="contained"
                startIcon={<ArrowBackIcon />}
                onClick={onBack}
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

export default NoPermission;